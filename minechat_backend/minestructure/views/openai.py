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
from ..serializers import BlueprintSerializer, UserSerializer, CollaborationSessionSerializer, CollaborationCheckpointSerializer, BlueprintCollaboratorSerializer, BlueprintShareLinkSerializer, PromptCheckpointSerializer
from ..permission import BlueprintCollaboratorPermission, IsBlueprintOwnerOrReadOnly, IsOwnerOrCollaborator, BlueprintAccessPermission
from django.views.decorators.csrf import csrf_exempt


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import json
import os

# Note: you need to be using OpenAI Python v0.27.0 for the code below to work

MODEL_NAME = "gpt-3.5-turbo-16k"
MODEL_NAME = "gpt-3.5-turbo-16k-0613"
MODEL_NAME = "gpt-4"
# MODEL_NAME = "gpt-3.5-turbo-0613"
FUNCTIONS = [
    {
        "name": "place_block",
        "description": "Place a block at the specified location",
        "parameters": {
            "type": "object",
            "properties": {
                "block_type": {
                    "type": "string",
                    "description": "The type of block to place. The type should be in the asssitant's inventory"
                },
                "pos": {
                    "type": "object",
                    "descrption": "The position to place the block at. The type should be a three-tuple of integers (x, y, z)"
                }
            },
            "required": ["block_type", "pos"]
        },

    },
    {
        "name": "break_block",
        "description": "Break a block with the id",
        "parameters": {
            "type": "object",
            "properties": {
                "uid":
                    {
                        "type": "string",
                        "description": "The unique id of the block to break"
                    },
               
            },
             "required": ["uid"],

        },

    },
    {
        "name": "send_message",
        "description": "Send a message to the chat",
        "parameters": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "description": "The message to send to the chat"
                }
            },

            "required": ["message"],
        }
    }

]

# FUNCTIONS = [
#         {
#             "name": "get_current_weather",
#             "description": "Get the current weather in a given location",
#             "parameters": {
#                 "type": "object",
#                 "properties": {
#                     "location": {
#                         "type": "string",
#                         "description": "The city and state, e.g. San Francisco, CA",
#                     },
#                     "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
#                 },
#                 "required": ["location"],
#             },
#         }
#     ]

SAMPLE_RESPONSE = {
    "id": "chatcmpl-7ayQnxZRjAi6Kt3dPluruLkWaxScW",
    "object": "chat.completion",
    "created": 1689046461,
    "model": "gpt-3.5-turbo-16k-0613",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": """# I am assigned as Agent 1. Based on the Motives, there is a desired structure which needs yellow, green, and purple blocks. Looking at the world state, there are already some blocks placed correctly according to the blueprint. There is a green block at pos=(4, 0, 0) and two purple blocks stacked on top of it. The yellow blocks are missing from the structure in the world state.

# From the Dialogue history, I have informed my partner (Agent 0) about my inventory, and my lack of yellow blocks. Agent 0 informed me that they have yellow blocks. Agent 0 is also working on a separate structure and asked for my help to place a green block.

# According to the Inventory, I do have green blocks. I can look at the world state to approach his request.

# It is not directly mentioned where I need to put the green block, but based on common sense and experience, we usually build on top of existing blocks. Therefore, I can simply stack it on top of the tower. To do that, I need to find the position of the topmost block in his tower and add 1 to the y-coordinate.

# Agent 0 mentioned the base of his tower is from pos=(0, 0, 0) to pos=(0, 4, 0), I can infer the topmost block position of his tower in the world is pos=(0, 1, 0).

# Therefore, I should put my green block at position (0, 2, 0)
end_session(message="Finish")
place_block(block_type="green", pos=(0, 0, 0))
"""
# 

            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 3714,
        "completion_tokens": 1037,
        "total_tokens": 4751
    }
}


async def get_openai_response(request):
    prompt = request.GET.get('prompt')
    api_key = '<YOUR_API_KEY>'
    headers = {'Authorization': f'Bearer {api_key}'}
    data = {'prompt': prompt, 'model': 'text-davinci-002', 'max_tokens': 50}
    openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        functions=FUNCTIONS,
    )

# Assuming you have Django and requests library installed

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
openai.api_key = OPENAI_API_KEY

MODEL_NAMES = {
            'gpt-3.5': 'gpt-3.5-turbo-16k',
            # 'gpt-4': 'gpt-4'
            'gpt-4': 'gpt-4-0125-preview'
        }

@csrf_exempt
def forward_to_openai(request):
    if request.method == "POST":
        # Extract the data from the request
        data = json.loads(request.body)
        messages = data.get("messages", [
        ])
        backend_version = data.get('backend_version', "gg")
        
        
        model_name = MODEL_NAMES[backend_version]

        # payload = {
        #     "model": "gpt-3.5-turbo",
        #     "logprobs": 3,
        #     "n": 5,
        #     "messages": messages,
        #     "max_tokens": 50,  # Set the desired response length
        # }
        # headers = {
        #     "Content-Type": "application/json",
        #     "Authorization": "Bearer " + OPENAI_API_KEY,  # Replace with your actual OpenAI API key
        # }
        if len(messages) == 0:
            return JsonResponse({"error": "Invalid input."}, status=400)
        # completion = openai.Completion.create(
        #     model="davinci", prompt= "New York is", logprobs=5
        # )
        # return JsonResponse(SAMPLE_RESPONSE)
        chat_completion = openai.ChatCompletion.create(
            model=model_name, messages=messages, max_tokens=4096 )
        return JsonResponse(chat_completion)

        if chat_completion.status_code == 200:
            response_data = chat_completion
            completion = response_data["choices"][0]["text"]
            return JsonResponse({"completion": completion})
        else:
            return JsonResponse({"error": "Failed to process the request."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)
