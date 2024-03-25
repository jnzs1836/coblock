from rest_framework.generics import RetrieveAPIView, RetrieveUpdateDestroyAPIView 
from ..models import ParticipantTaskModel, ParticipantTaskFeedbackModel
from ..serializers import ParticipantTaskModelSerializer, ParticipantTaskFeedbackModelSerializer
from rest_framework.response import Response
from rest_framework import status 
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import redis
import random
from rest_framework import generics
from rest_framework import viewsets
from rest_framework import permissions


class ParticipantTaskFeedbackAPI(generics.ListCreateAPIView):
    queryset = ParticipantTaskFeedbackModel.objects.all()
    serializer_class = ParticipantTaskFeedbackModelSerializer
    def create(self, request, *args, **kwargs):
        # Deserialize the incoming request data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save the object
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # Access the created instance
        instance = serializer.instance

        # Modify the serialized data based on the `hitcode` field in `collaboration_feedback`
        response_data = serializer.data  # This is a dictionary
        complete_code = instance.collaboration_experiment_feedback.complete_code
        complete_code = complete_code  # Perform your logic here
        response_data['complete_code'] = complete_code
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)
    
class ParticipantTaskFeedbackDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = ParticipantTaskFeedbackModel.objects.all()
    serializer_class = ParticipantTaskFeedbackModelSerializer
    