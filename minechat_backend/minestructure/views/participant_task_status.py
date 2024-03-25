from rest_framework.generics import RetrieveAPIView, RetrieveUpdateDestroyAPIView 
from ..models import ParticipantTaskModel
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


class ParticipantTaskStatusView(RetrieveUpdateDestroyAPIView):
    queryset = ParticipantTaskModel.objects.all()
    serializer_class = ParticipantTaskModelSerializer
    lookup_field = 'pk'
    def patch(self, request, *args, **kwargs):
        # r = redis.Redis(host='redis', port=6379, db=0)
        # r.set('hello', 'world') 
        
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            task_id = instance.id
            channel_layer = get_channel_layer()

            async_to_sync(channel_layer.group_send)(
                'task_updates',  # Group name
                {
                    'type': 'task_update',
                    'message': f'Task {task_id} has been completed.',
                    'task_id': task_id,
                    'status': instance.is_completed,
                    'permission': random.randint(0, 100)
                }
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ParticipantTaskLinkAPI(viewsets.ReadOnlyModelViewSet):
    queryset = ParticipantTaskModel.objects.all()
    serializer_class = ParticipantTaskModelSerializer 

    lookup_field = 'link'  # Specify the field to be used for lookup
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # return Response(instance.experiment)
        serializer = self.get_serializer(instance)
        # Add any additional custom logic or data manipulation here
        return Response(serializer.data)