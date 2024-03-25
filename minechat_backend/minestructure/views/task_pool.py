from rest_framework import viewsets
from ..models import TaskPool
from ..serializers import TaskPoolSerializer
from rest_framework import generics
from rest_framework import permissions

class TaskPoolListCreateView(generics.ListCreateAPIView):
    queryset = TaskPool.objects.all()
    serializer_class = TaskPoolSerializer

class TaskPoolRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskPool.objects.all()
    serializer_class = TaskPoolSerializer
