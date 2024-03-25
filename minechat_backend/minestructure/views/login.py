from django.shortcuts import render
from django.contrib.auth.models import User
from datetime import timedelta
from django.shortcuts import get_object_or_404
from django.db.models import Q

# Create your views here.
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


@api_view(['POST'])
@csrf_exempt
def login_view(request):
    if request.method != 'POST':
        return Response({'error': 'Invalid request method'}, status=405)
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        user = authenticate(request, username=username, password=password)
        if not user :
            raise User.DoesNotExist()

        # user = User.objects.get(username=username)
        if user.check_password(password) or True:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            expires_in = datetime.now() + timedelta(minutes=30)
            auth_user_state = 'authenticated'
            response_data = {
                'token': token.key,
                'expiresIn': expires_in.timestamp(), # Convert datetime object to Unix timestamp
                'authUserState': auth_user_state,
                'username': username
            }

            return Response(response_data, status=200)
        else:
            return Response({'error': 'Invalid credentials'}, status=401)
    except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=401)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=200)
    else:
        return Response({'error': 'Invalid credentials'}, status=401)


from django.contrib.auth.hashers import make_password

@api_view(['POST'])
@csrf_exempt
def reset_password_view(request):
    secret_code = "SECRET123"  # Hardcoded Secret Code
    received_secret_code = request.data.get('secret_code')
    username = request.data.get('username')
    new_password = request.data.get('new_password')

    if not received_secret_code or not username or not new_password:
        return Response({'error': 'Please provide username, new_password, and secret_code'}, status=400)

    if received_secret_code != secret_code:
        return Response({'error': 'Invalid secret code'}, status=403)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=404)
    
    user.password = make_password(new_password)
    user.save()
    return Response({'success': 'Password has been reset successfully'}, status=200)
