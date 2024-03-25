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


class PromptCheckpointListCreateAPIView(generics.ListCreateAPIView):
    queryset = PromptCheckpointModel.objects.all()
    serializer_class = PromptCheckpointSerializer
    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = {'request': self.request}
        return self.serializer_class(*args, **kwargs)
    # def post(self, request, *args, **kwargs):
    #     prompt_message = request.POST.get("prompt_message")
    #     version = request.POST.get("version")
    #     tag_count = int(request.POST.get("tag_count"))
    #     message_prefix = request.POST.get("message_prefix")
    #     message_suffix = request.POST.get("message_suffix")
    #     name = request.POST.get("name")
    #     tags = []
    #     for i in range(tag_count):
    #         tag = request.POST.get(f"tag_{i}")
    #         tags.append(tag)
    #     prompt_checkpoint = PromptCheckpointModel.objects.create(
    #         prompt_message=prompt_message,
    #         version=version,
    #         message_prefix=message_prefix,
    #         message_suffix=message_suffix
    #     )
    #     # Add tags to the PromptCheckpoint instance
    #     for tag in tags:
    #         tag_obj, created = PromptTagModel.objects.get_or_create(name=tag)
    #         prompt_checkpoint.tags.add(tag_obj)
    #     # Return a JSON response indicating success
    #     serializer = PromptCheckpointSerializer(prompt_checkpoint)
    #     return Response(serializer.data)


class PromptCheckpointRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PromptCheckpointModel.objects.all()
    serializer_class = PromptCheckpointSerializer