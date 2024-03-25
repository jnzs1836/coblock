from django.urls import path, include
from rest_framework import routers

from . import views
from rest_framework.authtoken import views as authtoken_views
# router = routers.DefaultRouter()
# router.register(r'blueprint', views.BlueprintAPIView)


urlpatterns = [
    path('blueprint/', views.BlueprintListAPI.as_view(), name='blueprint'),
    path('blueprint/<int:pk>/', views.BlueprintDetailAPI.as_view(), name='blueprint'),
    path('users/', views.UserList.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
    path('collaboration/', views.CollaborationSessionListAPI.as_view(), name='collaboration'),
    path('collaboration/<int:pk>/', views.CollaborationSessionDetailAPI.as_view(), name='collaboration'),
    
    path('experiment/', views.CollaborationExperimentListAPI.as_view(), name='collaboration'),
    path('experiment/<int:pk>/', views.CollaborationExperimentDetailAPI.as_view(), name='collaboration'),
    path('w/<str:link>/', views.CollaborationExperimentLinkAPI.as_view({'get': 'retrieve'}), name='collaboration-experiment-link'),
    
    path('feedback/', views.CollaborationExperimentFeedbackListAPI.as_view(), name='feedback'),
    path('feedback/<int:pk>/', views.CollaborationExperimentFeedbackDetailAPI.as_view(), name='feedback'),
    path('feedback/<str:link>/', views.CollaborationExperimentFeedbackLinkAPI.as_view({'get': 'retrieve'}), name='collaboration-experiment-link'),

    path('checkpoint/', views.CollaborationCheckpointListAPI.as_view(), name='checkpoint'),
    path('checkpoint/<int:pk>/', views.CollaborationCheckpointDetailAPI.as_view(), name='checkpoint'),

    path('record/', views.CollaborationRecordListAPI.as_view(), name='record'),
    path('record/<int:pk>/', views.CollaborationRecordDetailAPI.as_view(), name='record'),


    # path('login/', authtoken_views.obtain_auth_token, name='login'),
    path('login/', views.login_view, name='login'),
    path('rrset/', views.reset_password_view, name='reset'),
    path('openai/', views.forward_to_openai, name='openai'),
    
    path('blueprints/<int:blueprint_id>/collaborators/', views.BlueprintCollaboratorListAPI.as_view(), name='blueprint_collaborator_list'),
    path('blueprints/<int:blueprint_id>/collaborators/<int:pk>/', views.BlueprintCollaboratorDetailAPI.as_view(), name='blueprint_collaborator_detail'),
    # path('blueprint/link/<int:blueprint_id>/', BlueprintLinkView.as_view()),
    path('blueprints/<int:pk>/share-link/', views.BlueprintShareLinkView.as_view(), name='blueprint_share_link'),
    path('blueprints/<int:pk>/share-link/<str:uuid>', views.BlueprintShareLinkDetailView.as_view(), name='blueprint_share_link'),
    path('users/search/', views.UserSearchAPIView.as_view(), name='user-search'),
    path("prompts/", views.PromptCheckpointListCreateAPIView.as_view()),
    path("prompts/<int:pk>/", views.PromptCheckpointRetrieveUpdateDestroyAPIView.as_view()),
    path("pools/", views.TaskPoolListCreateView.as_view()),
    path("pools/<int:pk>", views.TaskPoolRetrieveUpdateDestroyView.as_view()),
    path("participant/", views.ParticipantHomePage.as_view()),
    path("ptask/<int:pk>/", views.ParticipantTaskStatusView.as_view()),
    path('pt/<str:link>/', views.ParticipantTaskLinkAPI.as_view({'get': 'retrieve'}), name='particiant-task-link'),
    path('pfdback/', views.ParticipantTaskFeedbackAPI.as_view(), name='task_feedback'),
    path('pfdback/<int:pk>/', views.ParticipantTaskFeedbackDetailAPI.as_view(), name='task_feedback_detail'),
    path('pstatus/', views.ParticipantStatusAPI.as_view(), name='participant_status'),
    # path('', include(router.urls)),
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
    # path("", views.index, name="index"),
    path('pinfo/', views.ParticipantListAPI.as_view(), name='pinfo'),
    path('pinfo/<int:pk>/', views.CollaborationSessionDetailAPI.as_view(), name='pinfo'),
    path('mbfdback/', views.MachineBatchFeedbackListView.as_view(), name='mbfdback'),
    path('mbfdback/<int:pk>/', views.MachineBatchFeedbackRetrieveUpdateDestroyView.as_view(), name='mbfdback'),
]

urlpatterns += [
    path('api-auth/', include('rest_framework.urls')),
]