from django.contrib import admin

# Register your models here.
from .models import BlueprintModel, CollaborationSessionModel, CollaborationCheckpointModel, BlueprintCollaboratorModel, BlueprintShareLinkModel, PromptTagModel, PromptCheckpointModel, ParticipantModel, TaskPool, ParticipantTaskModel, CollaborationExperimentModel, ParticipantTaskFeedbackModel, CollaborationExperimentFeedbackModel 

admin.site.register(BlueprintModel)
admin.site.register(CollaborationSessionModel)
admin.site.register(CollaborationCheckpointModel)
admin.site.register(BlueprintCollaboratorModel)
admin.site.register(BlueprintShareLinkModel)
admin.site.register(PromptTagModel)
admin.site.register(PromptCheckpointModel)
admin.site.register(ParticipantModel)
admin.site.register(TaskPool)
admin.site.register(ParticipantTaskModel)
admin.site.register(CollaborationExperimentModel)
admin.site.register(CollaborationExperimentFeedbackModel)
admin.site.register(ParticipantTaskFeedbackModel)