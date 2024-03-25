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
from rest_framework import viewsets
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

from ..models import BlueprintModel, CollaborationSessionModel, CollaborationCheckpointModel, BlueprintCollaboratorModel, BlueprintShareLinkModel, PromptTagModel, PromptCheckpointModel, CollaborationRecordModel, CollaborationExperimentModel
from ..serializers import BlueprintSerializer , UserSerializer, CollaborationSessionSerializer, CollaborationCheckpointSerializer, BlueprintCollaboratorSerializer, BlueprintShareLinkSerializer, PromptCheckpointSerializer, CollaborationRecordSerializer, CollaborationExperimentSerializer
from ..permission import BlueprintCollaboratorPermission, IsBlueprintOwnerOrReadOnly, IsOwnerOrCollaborator, BlueprintAccessPermission


# Collaboration Experiment API
# List all experiments of a collaboration session
# Create a new experiment for a collaboration session
class CollaborationExperimentListAPI(generics.ListCreateAPIView):
    queryset = CollaborationExperimentModel.objects.all()
    serializer_class = CollaborationExperimentSerializer 
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        queryset = CollaborationExperimentModel.objects.all()
        x_value = self.request.query_params.get('session_id')
        if x_value:
            queryset = queryset.filter(session_id=x_value)
        return queryset
    
    

# Collaboration Experiment Detail API
# Retrieve, update or delete a collaboration experiment
class CollaborationExperimentDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = CollaborationExperimentModel.objects.all()
    serializer_class = CollaborationExperimentSerializer
    permission_classes = [permissions.IsAuthenticated]


# Collaboration Experiment Link API
# Retrieve a collaboration experiment by link
class CollaborationExperimentLinkAPI(viewsets.ReadOnlyModelViewSet):
    queryset = CollaborationExperimentModel.objects.all()
    serializer_class = CollaborationExperimentSerializer

    lookup_field = 'link'  # Specify the field to be used for lookup
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        # Add any additional custom logic or data manipulation here
        return Response(serializer.data)