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


# Blueprint Collaborator API
# List all collaborators of a blueprint
# Create a new collaborator for a blueprint

class BlueprintCollaboratorListAPI(generics.ListCreateAPIView):
    serializer_class = BlueprintCollaboratorSerializer
    permission_classes = [IsAuthenticated, IsBlueprintOwnerOrReadOnly]

    def get_queryset(self):
        blueprint_id = self.kwargs['blueprint_id']
        return BlueprintCollaboratorModel.objects.filter(blueprint_id=blueprint_id)
    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = {'request': self.request, 'blueprint': self.get_blueprint()}
        return self.serializer_class(*args, **kwargs)
    def perform_create(self, serializer):
        permission = IsBlueprintOwnerOrReadOnly()
        blueprint_id = self.kwargs['blueprint_id']
        blueprint = BlueprintModel.objects.get(id=blueprint_id)
        if permission.has_object_permission(self.request, BlueprintCollaboratorListAPI, blueprint):
            serializer.save(blueprint=blueprint)
        else:
            raise PermissionDenied()
    
     
# Retrieve, update or delete a collaborator of a blueprint
# Retrieve a collaborator of a blueprint
# Update a collaborator of a blueprint   
class BlueprintCollaboratorDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BlueprintCollaboratorSerializer
    permission_classes = [IsAuthenticated, BlueprintCollaboratorPermission]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            'request': self.request,
        })
        return context

    def initial(self, request, *args, **kwargs):
        # Get the blueprint object and include it in the request object
        return super().initial(request, *args, **kwargs)
    
    def get_queryset(self):
        blueprint_id = self.kwargs['blueprint_id']
        return BlueprintCollaboratorModel.objects.filter(blueprint_id=blueprint_id)

    def get_object(self):
        queryset = self.get_queryset()
        pk = self.kwargs['pk']
        return generics.get_object_or_404(queryset, pk=pk)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

