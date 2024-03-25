from django.db import models
from django.core.exceptions import ValidationError
import uuid
from django.utils import timezone
from datetime import timedelta
from django.db import models
from django.utils.translation import gettext_lazy as _
import string
import random
from datetime import datetime



def generate_two_digit_identifier():
    # Generate a random two-character alphanumeric identifier
    characters = string.ascii_letters + string.digits
    return ''.join(random.choices(characters, k=2))

# Blueprint Model
class BlueprintModel(models.Model):
    name = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=3200, blank=True)
    spec = models.JSONField()
    owner = models.ForeignKey(
        'auth.User', related_name='blueprints', on_delete=models.CASCADE)
    collaborators = models.ManyToManyField(
        'auth.User',
        related_name='shared_blueprints',
        blank=True,
        through='BlueprintCollaboratorModel',
    )


class BlueprintCollaboratorModel(models.Model):
    # blueprint = models.ForeignKey(BlueprintModel, on_delete=models.CASCADE)
    # user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    blueprint = models.ForeignKey(
        BlueprintModel,
        on_delete=models.CASCADE,
        related_name='collaborating_users'
    )
    collaborator = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='collaborating_blueprints'
    )

    can_edit = models.BooleanField(default=False)
    can_view = models.BooleanField(default=False)
    can_manage = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.collaborator}, {self.collaborator.username}, ({self.blueprint.name}, {self.can_edit}, {self.can_view}, {self.can_manage})"

    class Meta:
        unique_together = ('blueprint', 'collaborator',)

    def clean(self):
        if self.collaborator == self.blueprint.owner:
            raise ValidationError(
                "The owner of the blueprint cannot be added as a collaborator.")

    def save(self, *args, **kwargs):
        if self.collaborator == self.blueprint.owner:
            raise ValidationError('Cannot add the owner as a collaborator.')
        super().save(*args, **kwargs)


class BlueprintShareLinkModel(models.Model):
    link = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    blueprint = models.ForeignKey(
        BlueprintModel, on_delete=models.CASCADE, related_name='share_links')
    user = models.ForeignKey(
        'auth.User', on_delete=models.CASCADE, related_name='share_links')
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(
        default=timezone.now() + timezone.timedelta(days=7))
    can_edit = models.BooleanField(default=False)
    can_view = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.blueprint.name} - {self.link}'

    def link_expired(self):
        return self.expiration_date < timezone.now()


class PromptTagModel(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Tag")
        verbose_name_plural = _("Tags")


class PromptCheckpointModel(models.Model):
    prompt_message = models.TextField(_("Prompt Message"))
    name = models.CharField(max_length=255, default="")
    message_prefix = models.TextField(_("Message Prefix"), default="")
    message_suffix = models.TextField(_("Message Suffix"), default="")
    version = models.CharField(max_length=255)
    tags = models.ManyToManyField(PromptTagModel, related_name="prompts")

    def __str__(self):
        return self.id

    class Meta:
        verbose_name = _("Prompt Checkpoint")
        verbose_name_plural = _("Prompt Checkpoints")


def get_default_foreign_key_prompt():
    return PromptCheckpointModel.objects.get(pk=18)


class CollaborationSessionModel(models.Model):
    blueprint = models.ForeignKey(
        BlueprintModel, related_name='sessions', on_delete=models.CASCADE)
    owner = models.ForeignKey(
        'auth.User', related_name='sessions', on_delete=models.CASCADE)
    # name = models.CharField(max_length=100, blank=True)
    # spec = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_public = models.BooleanField(default=False)

    task_config = models.JSONField()
    prompt_config = models.JSONField()

    prompt_checkpoint = models.ForeignKey(
        PromptCheckpointModel, related_name='sessions', on_delete=models.CASCADE, default=18)
    # prompt_config_checkpoint = models.ForeignKey(PromptCheckpointModel, related_name='sessions_new', on_delete=models.CASCADE, default=get_default_foreign_key_prompt())

    def __str__(self):
        return "session_" + self.updated_at.strftime("%Y-%m-%d %H:%M:%S")


class CollaborationCheckpointModel(models.Model):
    session = models.ForeignKey(
        CollaborationSessionModel, related_name='checkpoints', on_delete=models.CASCADE)
    owner = models.ForeignKey(
        'auth.User', related_name='checkpoints', on_delete=models.CASCADE)
    # name = models.CharField(max_length=100, blank=True)
    # spec = models.JSONField()
    state = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_public = models.BooleanField(default=False)
    name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name


class CollaborationRecordModel(models.Model):
    session = models.ForeignKey(
        CollaborationSessionModel, related_name='records', on_delete=models.CASCADE)
    # owner = models.ForeignKey('auth.User', related_name='records', on_delete=models.CASCADE)
    # name = models.CharField(max_length=100, blank=True)
    # spec = models.JSONField()
    record = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_public = models.BooleanField(default=False)
    name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name


def generate_random_string():
    length = 10  # Define the desired length of the random string
    # Define the characters to be used in the random string
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))


class CollaborationExperimentModel(models.Model):
    session = models.ForeignKey(
        CollaborationSessionModel, related_name='experiments', on_delete=models.CASCADE)
    # owner = models.ForeignKey('auth.User', related_name='records', on_delete=models.CASCADE)
    link = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    # name = models.CharField(max_length=100, blank=True)
    # spec = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_public = models.BooleanField(default=False)
    name = models.CharField(max_length=100, blank=True)
    prompt_checkpoint = models.ForeignKey(
        PromptCheckpointModel, related_name='experiments', on_delete=models.CASCADE, default=20)
    backend_version = models.CharField(max_length=100, default="gpt-4")
    # share_id = models.CharField(max_length=10, default=generate_random_string, unique=True)

    def __str__(self):
        return self.name


class CollaborationExperimentFeedbackModel(models.Model):
    session = models.ForeignKey(
        CollaborationSessionModel, related_name='feedbacks', on_delete=models.CASCADE)
    record = models.ForeignKey(
        CollaborationRecordModel, related_name='feedbacks', on_delete=models.CASCADE)

    # owner = models.ForeignKey('auth.User', related_name='records', on_delete=models.CASCADE)
    link = models.CharField(max_length=100, blank=True)
    # name = models.CharField(max_length=100, blank=True)
    # spec = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # share_id = models.CharField(max_length=10, default=generate_random_string, unique=True)
    content = models.TextField(blank=True)
    participant_code = models.CharField(max_length=100, blank=True)
    spec = models.JSONField()
    complete_code = models.CharField(
        max_length=2,  default=generate_two_digit_identifier)

    is_complete = models.BooleanField(default=False)

    def __str__(self):
        return self.content


class TaskPool(models.Model):
    pool_id = models.CharField(
        default=uuid.uuid4, max_length=36, editable=False, unique=True)
    experiments = models.ManyToManyField(CollaborationExperimentModel)
    # Format: {experiment_id: completion_count}
    completed_count = models.JSONField(default=dict)
    upper_limit = models.IntegerField(default=10)
    user_task_limit = models.IntegerField(default=5)
    def __str__(self):
        return self.pool_id


class ParticipantModel(models.Model):

    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    task_pool = models.ForeignKey(
        TaskPool, on_delete=models.CASCADE, null=True, blank=True)


    def __str__(self):
        return str(self.user_id)


class ParticipantTaskModel(models.Model):
    participant = models.ForeignKey(ParticipantModel, on_delete=models.CASCADE)
    experiment = models.ForeignKey(
        CollaborationExperimentModel, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    collaboration_records = models.ManyToManyField(
        CollaborationRecordModel, related_name='tasks')
    link = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    pool = models.ForeignKey(
        TaskPool,
        related_name='participant_tasks',
        on_delete=models.SET_NULL,  # or models.DO_NOTHING
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.participant.user_id} - {self.experiment.name} - {'Completed' if self.is_completed else 'Not Completed'}"
    
    @property
    def is_feedback_received(self):
        return self.participant_task_feedbacks.exists()

    @property
    def is_feedback_completed(self):
        for feedback in self.participant_task_feedbacks.all():
            if feedback.collaboration_experiment_feedback.is_complete:
                return True
            
        return False 
        # return self.participant_task_feedbacks.exists()


class ParticipantTaskFeedbackModel(models.Model):
    collaboration_experiment_feedback = models.ForeignKey(
        CollaborationExperimentFeedbackModel,
        related_name='participant_task_feedbacks',
        on_delete=models.CASCADE
    )
    # Adjust the type and constraints as needed
    user_id = models.CharField(max_length=100)
    link = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    ptask = models.ForeignKey(
        ParticipantTaskModel,
        related_name='participant_task_feedbacks',
        on_delete=models.SET_NULL,  # or models.DO_NOTHING
        null=True,
        blank=True
    )
    created_at = models.DateTimeField( default=datetime(2021, 7, 15, 0, 0, 0))  # Automatically set when the object is created
    updated_at = models.DateTimeField( default=datetime(2021, 7, 15, 0, 0, 0))  # Automatically set when the object is updated

    valid = models.BooleanField(default=True)  # New field added here

    # Additional fields here, if needed


    def __str__(self):
        return f"{self.user_id} - {self.collaboration_experiment_feedback}"


class MachineBatchFeedbackModel(models.Model):
    backend_version = models.CharField(max_length=100, default="gpt-4")
    spec = models.JSONField(default=dict)
    name = models.CharField(max_length=100)

    def __str__(self):
        return str(self.user_id)