from rest_framework import viewsets
from ..models import MachineBatchFeedbackModel
from ..serializers import MachineBatchFeedbackSerializer 
from rest_framework import generics
from rest_framework import permissions

class MachineBatchFeedbackListView(generics.ListCreateAPIView):
    queryset = MachineBatchFeedbackModel.objects.all()
    serializer_class = MachineBatchFeedbackSerializer

class MachineBatchFeedbackRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MachineBatchFeedbackModel.objects.all()
    serializer_class = MachineBatchFeedbackSerializer
