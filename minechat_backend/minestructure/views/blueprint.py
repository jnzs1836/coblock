from django.shortcuts import render
from django.contrib.auth.models import User
from datetime import timedelta
from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response

from django.http import HttpResponse
from rest_framework import status
from django.http import Http404
from rest_framework import generics
from rest_framework import permissions
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from datetime import timedelta
import aiohttp
import asyncio
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied
import openai
import random
import string
from datetime import datetime, timedelta
from django.utils import timezone

from ..models import BlueprintModel, CollaborationSessionModel, CollaborationCheckpointModel, BlueprintCollaboratorModel, BlueprintShareLinkModel, PromptTagModel, PromptCheckpointModel
from ..serializers import BlueprintSerializer , UserSerializer, CollaborationSessionSerializer, CollaborationCheckpointSerializer, BlueprintCollaboratorSerializer, BlueprintShareLinkSerializer, PromptCheckpointSerializer
from ..permission import BlueprintCollaboratorPermission, IsBlueprintOwnerOrReadOnly, IsOwnerOrCollaborator, BlueprintAccessPermission


class BlueprintListAPI(generics.ListCreateAPIView):
    queryset = BlueprintModel.objects.all()
    serializer_class = BlueprintSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            'request': self.request,
        })
        return context
    def get_queryset(self):
        queryset = BlueprintModel.objects.all()
        user = self.request.user
        accessable = self.request.query_params.get('accessable')
        owned = self.request.query_params.get('owned')
        editable = self.request.query_params.get('editable')
        
            # queryset = queryset.filter(Q(owner=user) | Q(collaborators=user, blueprintcollaboratormodel__can_view=True))

        if owned:
            queryset = queryset.filter(owner=user)

        if editable:
            queryset = BlueprintModel.objects.filter(Q(collaborating_users__collaborator=user.id, collaborating_users__can_edit=True) | Q(owner=user))

        if accessable:
            queryset = BlueprintModel.objects.filter(Q(collaborating_users__collaborator=user.id, collaborating_users__can_view=True) | Q(owner=user) | Q(collaborating_users__collaborator=user.id, collaborating_users__can_edit=True)
            )

            # queryset = BlueprintModel.objects.filter(
                # Q(owner=user) |
                # Q(share_links__collaborator=user, share_links__can_edit=True)
            # ).distinct()
            # queryset = queryset.filter(Q(owner=user) | Q(collaborators=user, blueprintcollaboratormodel__can_edit=True))

        return queryset
    def get(self, request):
        queryset = BlueprintModel.objects.all()
        queryset = self.get_queryset()
        serializer = BlueprintSerializer(queryset, many=True, context={"request":request})
        # serializer.set_request_context(request)
        return Response(serializer.data)
    
    # @permission_classes([IsAuthenticated])
    def post(self, request):
        serializer = BlueprintSerializer(data=request.data, context={"request":request})

        if serializer.is_valid():
            serializer.save(owner=request.user)
            # serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class BlueprintDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = BlueprintModel.objects.all()
    serializer_class = BlueprintSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            'request': self.request,
        })
        return context
    def initial(self, request, *args, **kwargs):
        # Get the blueprint object and include it in the request object
        pk = kwargs.get('pk')
        if pk:
            blueprint = get_object_or_404(BlueprintModel, pk=pk)
            request.blueprint = blueprint

        return super().initial(request, *args, **kwargs)

    def get_object(self):
        # Get the blueprint object from the request object
        blueprint = getattr(self.request, 'blueprint', None)
        if not blueprint:
            pk = self.kwargs.get('pk')
            blueprint = get_object_or_404(BlueprintModel, pk=pk)

        return blueprint

    def get_permissions(self):
        # Pass the blueprint object to the permission class
        blueprint = self.get_object()
        return [BlueprintAccessPermission(blueprint=blueprint, user=self.request.user)]

    def get(self, request, pk):
        blueprint = get_object_or_404(BlueprintModel, pk=pk)

        permission = BlueprintAccessPermission(blueprint, request.user)
        if not permission.has_view_permission():
            raise PermissionDenied

        serializer = BlueprintSerializer(blueprint, context={'can_edit': permission.has_edit_permission(), 'request': request})
        return Response(serializer.data)
    
    def perform_update(self, serializer):
        # Get the blueprint instance
        blueprint = serializer.instance

        # Check if the user has edit permission
        permission = BlueprintAccessPermission(blueprint, self.request.user)
        if not permission.has_edit_permission():
            raise PermissionDenied

        # Save the changes
        serializer.save()
    # def get_object(self, pk):
    #     try:
    #         return BlueprintModel.objects.get(pk=pk)
    #     except BlueprintModel.DoesNotExist:
    #         raise Http404

    # def get(self, request, pk, format=None):
    #     blueprint = self.get_object(pk)
    #     serializer = BlueprintSerializer(blueprint)
    #     return Response(serializer.data)

    # def put(self, request, *args, **kwargs):
    #     return self.update(request, *args, **kwargs)

    # def delete(self, request, *args, **kwargs):
    #     return self.destroy(request, *args, **kwargs)