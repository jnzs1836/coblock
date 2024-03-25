# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import ParticipantModel, TaskPool, ParticipantTaskModel, CollaborationExperimentModel
from ..serializers import ParticipantModelSerializer
import uuid
import random
import numpy as np

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

from ..models import BlueprintModel, CollaborationSessionModel, CollaborationCheckpointModel, BlueprintCollaboratorModel, BlueprintShareLinkModel, PromptTagModel, PromptCheckpointModel, CollaborationRecordModel
from ..serializers import BlueprintSerializer , UserSerializer, CollaborationSessionSerializer, CollaborationCheckpointSerializer, BlueprintCollaboratorSerializer, BlueprintShareLinkSerializer, PromptCheckpointSerializer, CollaborationRecordSerializer
from ..permission import BlueprintCollaboratorPermission, IsBlueprintOwnerOrReadOnly, IsOwnerOrCollaborator, BlueprintAccessPermission


class ParticipantListAPI(generics.ListCreateAPIView):
    queryset = ParticipantModel.objects.all()
    serializer_class = ParticipantModelSerializer 
    # permission_classes = [permissions.IsAuthenticated]
 
    
class ParticipantDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = ParticipantModel.objects.all()
    serializer_class = ParticipantModelSerializer 
    # permission_classes = [permissions.IsAuthenticated]
