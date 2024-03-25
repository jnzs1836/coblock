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

from ..models import BlueprintModel, CollaborationSessionModel, CollaborationCheckpointModel, BlueprintCollaboratorModel, BlueprintShareLinkModel, PromptTagModel, PromptCheckpointModel, CollaborationRecordModel, CollaborationExperimentModel, CollaborationExperimentFeedbackModel
from ..serializers import BlueprintSerializer , UserSerializer, CollaborationSessionSerializer, CollaborationCheckpointSerializer, BlueprintCollaboratorSerializer, BlueprintShareLinkSerializer, PromptCheckpointSerializer, CollaborationRecordSerializer, CollaborationExperimentSerializer, CollaborationExperimentFeedbackSerializer
from ..permission import BlueprintCollaboratorPermission, IsBlueprintOwnerOrReadOnly, IsOwnerOrCollaborator, BlueprintAccessPermission


# Collaboration Experiment API
# List all experiments of a collaboration session
# Create a new experiment for a collaboration session

class CollaborationExperimentFeedbackListAPI(generics.ListCreateAPIView):
    queryset = CollaborationExperimentFeedbackModel.objects.all()
    serializer_class = CollaborationExperimentFeedbackSerializer 
    permission_classes = []
    def get_queryset(self):
        queryset = CollaborationExperimentFeedbackModel.objects.all()
        x_value = self.request.query_params.get('session_id')
        if x_value:
            queryset = queryset.filter(session_id=x_value)
        return queryset
        
    # def post(self, request):
    #     serializer = CollaborationExperimentSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save(owner=request.user)
    #         # serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Collaboration Experiment API
# Retrieve, update or delete an experiment
class CollaborationExperimentFeedbackDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = CollaborationExperimentFeedbackModel.objects.all()
    serializer_class = CollaborationExperimentFeedbackSerializer
    permission_classes = []


# Collaboration Experiment API
# Retrieve an experiment
class CollaborationExperimentFeedbackLinkAPI(viewsets.ReadOnlyModelViewSet):
    queryset = CollaborationExperimentFeedbackModel.objects.all()
    serializer_class = CollaborationExperimentFeedbackSerializer

    lookup_field = 'link'  # Specify the field to be used for lookup
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        # Add any additional custom logic or data manipulation here
        return Response(serializer.data)