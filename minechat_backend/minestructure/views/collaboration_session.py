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



class CollaborationSessionListAPI(generics.ListCreateAPIView):
    queryset = CollaborationSessionModel.objects.all()
    serializer_class = CollaborationSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = CollaborationSessionModel.objects.all()
        serializer = CollaborationSessionSerializer(queryset, context={"request":request},many=True)
        return Response(serializer.data)
    
    # @permission_classes([IsAuthenticated])
    def post(self, request):
        
        serializer = CollaborationSessionSerializer(data=request.data,
            context={"request":request}
        )
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CollaborationSessionDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = CollaborationSessionModel.objects.all()
    serializer_class = CollaborationSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

