from rest_framework.generics import RetrieveAPIView, RetrieveUpdateDestroyAPIView 
from ..models import ParticipantTaskModel, ParticipantModel, ParticipantTaskFeedbackModel
from ..serializers import ParticipantTaskModelSerializer
from rest_framework.response import Response
from rest_framework import status 
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import redis
import random
from rest_framework import generics
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import status, views


class ParticipantStatusAPI(views.APIView):
    def get(self, request, format=None):
        user_id = request.COOKIES.get('user_id')
    
        if user_id is None:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Find the tasks for the given user
        try:
            participant = ParticipantModel.objects.get(user_id=user_id)
        except ParticipantModel.DoesNotExist:
            return Response({'error': 'Participant not found'}, status=status.HTTP_404_NOT_FOUND)

        tasks = ParticipantTaskModel.objects.filter(participant=participant)

        # Fetch the latest-created ParticipantTaskFeedback for each task
        field_list = []
        participant_status = True 
        for task in tasks:
            try:
                latest_feedback = ParticipantTaskFeedbackModel.objects.filter(ptask=task).latest('created_at')
                field_list.append(latest_feedback.collaboration_experiment_feedback.complete_code)
            except ParticipantTaskFeedbackModel.DoesNotExist:
                # Handle the case where no feedback exists for a task
                participant_status = False
                field_list.append(None)

        return Response({'hit_codes': field_list, "status": participant_status}, status=status.HTTP_200_OK)
