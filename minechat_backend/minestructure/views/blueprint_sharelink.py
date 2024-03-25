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



# Blueprint Share Link API
# Create a new share link for a blueprint
class BlueprintShareLinkView(APIView):
    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = {'request': self.request, 'blueprint': self.get_blueprint()}
        return self.serializer_class(*args, **kwargs)

    def get_blueprint(self):
        blueprint_id = self.kwargs.get('pk')
        return get_object_or_404(BlueprintModel, pk=blueprint_id, owner=self.request.user)


    def post(self, request, pk):
        blueprint = get_object_or_404(BlueprintModel, pk=pk)
        user = request.user
        serializer = BlueprintShareLinkSerializer(data=request.data, context={'blueprint': blueprint, "user": user})
        if serializer.is_valid():
            share_link = serializer.save(blueprint=blueprint, user=user, context={'blueprint': blueprint})
            return Response({'share_link': share_link.id, "uuid": share_link.link}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk, id):
        blueprint = get_object_or_404(BlueprintModel, pk=pk)
        share_link = get_object_or_404(ShareLinkModel, blueprint=blueprint, id=id, is_active=True)
        if share_link.expires_at < timezone.now():
            share_link.is_active = False
            share_link.save()
            return Response({'error': 'The share link has expired.'}, status=status.HTTP_400_BAD_REQUEST)
        can_edit = share_link.can_edit
        collaborating_user = request.user
        # if not can_edit:
        #     permission = BlueprintAccessPermission(blueprint, request.user)
        #     if not permission.has_view_permission():
        #         raise PermissionDenied
        

        serializer = BlueprintSerializer(blueprint, context={'can_edit': can_edit})
        return Response(serializer.data)


# Blueprint Share Link Detail API
# Retrieve a share link for a blueprint
class BlueprintShareLinkDetailView(APIView):
    def get(self, request, pk, uuid):
        blueprint = get_object_or_404(BlueprintModel, pk=pk)
        share_link = get_object_or_404(BlueprintShareLinkModel, blueprint=blueprint, link=uuid, is_active=True)
        if share_link.expires_at < timezone.now():
            share_link.is_active = False
            share_link.save()
            return Response({'error': 'The share link has expired.'}, status=status.HTTP_400_BAD_REQUEST)
        can_edit = share_link.can_edit
        can_view = share_link.can_view
        collaborating_user = request.user
        try:
            collaborator = BlueprintCollaboratorModel.objects.get(blueprint=blueprint, collaborator=collaborating_user)
            collaborator.can_edit = can_edit or collaborator.can_edit
            collaborator.can_view = can_view or collaborator.can_view
            collaborator.save()
        except BlueprintCollaboratorModel.DoesNotExist:
            BlueprintCollaboratorModel.objects.create(blueprint=blueprint, collaborator=collaborating_user, can_edit=can_edit)

        return Response({'success': 'Access granted.'}, status=status.HTTP_200_OK)
        serializer = BlueprintSerializer(blueprint, context={'can_edit': can_edit})
        return Response(serializer.data)
