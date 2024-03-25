from .models import BlueprintModel, CollaborationSessionModel, CollaborationCheckpointModel, BlueprintCollaboratorModel, BlueprintShareLinkModel, PromptCheckpointModel, PromptTagModel, CollaborationRecordModel, CollaborationExperimentModel, CollaborationExperimentFeedbackModel, ParticipantTaskFeedbackModel 
from .models import ParticipantModel, TaskPool, ParticipantTaskModel, MachineBatchFeedbackModel
from rest_framework import serializers
from django.contrib.auth.models import User
from .permission import IsBlueprintOwnerOrReadOnly
import random
import string
from datetime import datetime, timedelta
import uuid
from .permission import BlueprintAccessPermission
from rest_framework.fields import CurrentUserDefault


class BlueprintSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    can_edit = serializers.SerializerMethodField()
    can_view = serializers.SerializerMethodField()
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # request = kwargs.get('request')
        # request = self.context.get('request')
        # if request:
        #     permission = BlueprintAccessPermission(self.instance, request.user)
        #     can_edit = permission.has_edit_permission()
        #     self.fields['can_edit'] = serializers.BooleanField(default=can_edit, read_only=True)
        #     self.fields['can_view'] = serializers.BooleanField(default=True, read_only=True)

    # def set_request_context(self, user):
    #     self.context['request'] = request

    class Meta:
        model = BlueprintModel
        fields = ['name', 'spec', 'id', 'owner', 'description', 'can_edit', 'can_view']

    def get_can_edit(self, obj):
        user = CurrentUserDefault() 
        permission = BlueprintAccessPermission(obj, user)
        return permission.has_edit_permission()

    def get_can_view(self, obj):
        return True
        permission = BlueprintAccessPermission(obj, self.context['request'].user)
        return permission.has_view_permission()

    def get_can_edit(self, obj):
        request = self.context.get('request')
        if request:
            permission = BlueprintAccessPermission(obj, request.user)
            return permission.has_edit_permission()
        return False

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Add can_edit field for authenticated user
        request = self.context.get('request', None)
        if request and request.user.is_authenticated:
            try:
                collaborator = BlueprintCollaboratorModel.objects.get(
                    blueprint=instance,
                    collaborator=request.user
                )
                data['can_edit'] = collaborator.can_edit
                data['can_view'] = collaborator.can_edit or collaborator.can_view
            except BlueprintCollaboratorModel.DoesNotExist:
                pass

        return data



    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.spec = validated_data.get('spec', instance.spec)
        instance.save()
        collaborators = validated_data.get('collaborators', [])
        # instance.collaborators.clear()
        for collaborator_data in collaborators:
            collaborator = collaborator_data['collaborator']
            can_edit = collaborator_data.get('can_edit', False)
            can_view = collaborator_data.get('can_view', False)
            can_manage = collaborator_data.get('can_manage', False)
            if collaborator != instance.owner:
                collab, created = BlueprintCollaboratorModel.objects.get_or_create(
                    blueprint=instance, collaborator=collaborator)
                collab.can_edit = can_edit
                collab.can_view = can_view
                collab.can_manage = can_manage
                collab.save()
        return instance

class BlueprintAuthenticatedSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    can_edit = serializers.SerializerMethodField()
    can_view = serializers.SerializerMethodField()
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    class Meta:
        model = BlueprintModel
        fields = ['name', 'spec', 'id', 'owner', 'description', 'can_edit', 'can_view']

    def get_can_edit(self, obj):
        return True

    def get_can_view(self, obj):
        return True
    def get_can_edit(self, obj):
        return True 


class UserSerializer(serializers.ModelSerializer):
    blueprints = serializers.PrimaryKeyRelatedField(many=True, queryset=BlueprintModel.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'blueprints', 'shared_blueprints']

class BlueprintCollaboratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlueprintCollaboratorModel
        fields = ['id', 'collaborator', 'can_edit', 'can_manage', 'can_view']
        permissions = [IsBlueprintOwnerOrReadOnly]
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['collaborator_name'] = instance.collaborator.username
        return data

class BlueprintShareLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlueprintShareLinkModel
        fields = ('id', 'link', 'can_edit', 'can_view', 'expires_at')

    def create(self, validated_data):
        # Generate a random 10-character alphanumeric string for the link
        link = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        link = uuid.uuid4()
        # Get the blueprint and user from the context
        blueprint = self.context['blueprint']
        user = self.context['user']
        

        # Create the share link
        share_link = BlueprintShareLinkModel.objects.create(
            link=link,
            blueprint=blueprint,
            user=user,
            can_edit=validated_data.get('can_edit', False),
            can_view=validated_data.get('can_view', False),
            expires_at=datetime.now() + timedelta(days=7)
        )

        return share_link

class CollaborationSessionSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    # blueprint = BlueprintSerializer()
    # blueprint = serializers.PrimaryKeyRelatedField(queryset=BlueprintModel.objects.all())
    blueprint = BlueprintSerializer(read_only=True)
    blueprint_id = serializers.PrimaryKeyRelatedField(queryset=BlueprintModel.objects.all(), source='blueprint', write_only=True)
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    class Meta:
        model = CollaborationSessionModel
        fields = ['id', 'owner', 'blueprint', 'blueprint_id', 'created_at', 'updated_at', 'is_active', 'is_public', 'task_config', 'prompt_config', 'prompt_checkpoint', 'prompt_checkpoint_id']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        prompt_checkpoint_object = PromptCheckpointModel.objects.get(id = instance.prompt_checkpoint_id)
        prompt_serializer = PromptCheckpointSerializer(instance.prompt_checkpoint)
        data['prompt_checkpoint'] = prompt_serializer.data
        # Add can_edit field for authenticated user
        # data['blueprint'] = blueprint_serialier.data
        # data['blueprint_id'] = blueprint_model.id
        # blueprint_model
        return data



class CollaborationSessionAuthenticatedSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    blueprint_id = serializers.PrimaryKeyRelatedField(queryset=BlueprintModel.objects.all(), source='blueprint', write_only=True)
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    class Meta:
        model = CollaborationSessionModel
        fields = ['id', 'owner', 'blueprint', 'blueprint_id', 'created_at', 'updated_at', 'is_active', 'is_public', 'task_config', 'prompt_config']

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Add can_edit field for authenticated user
        request = self.context.get('request', None)
        blueprint_model = BlueprintModel.objects.get(id=instance.blueprint_id)
        blueprint_serialier = BlueprintAuthenticatedSerializer(blueprint_model)
        data['blueprint'] = blueprint_serialier.data
        data['blueprint_id'] = blueprint_model.id
        blueprint_model
        return data


class CollaborationCheckpointSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    # blueprint = BlueprintSerializer()
    session = CollaborationSessionAuthenticatedSerializer(read_only=True)
    session_id = serializers.PrimaryKeyRelatedField(queryset=CollaborationSessionModel.objects.all(), source='session', write_only=True)

    class Meta:
        model = CollaborationCheckpointModel
        fields = ['id', 'owner', 'session', "state", 'session_id', 'created_at', 'updated_at', 'is_active', 'is_public', 'name']
    

class CollaborationRecordSerializer(serializers.ModelSerializer):
    # owner = serializers.ReadOnlyField(source='owner.username')
    # blueprint = BlueprintSerializer()
    session = CollaborationSessionAuthenticatedSerializer(read_only=True)
    session_id = serializers.PrimaryKeyRelatedField(queryset=CollaborationSessionModel.objects.all(), source='session', write_only=True)

    class Meta:
        model = CollaborationRecordModel
        fields = ['id', 'session', "record", 'session_id', 'created_at', 'updated_at', 'is_active', 'is_public', 'name']


class PromptTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromptTagModel 
        fields = "__all__"

class PromptCheckpointSerializer(serializers.ModelSerializer):
    tags = PromptTagSerializer(many=True, required=False)

    class Meta:
        model = PromptCheckpointModel
        fields = "__all__"
        extra_kwargs = {
            'tags': {'required': False}
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = kwargs.get('context', {}).get('request', None)
        print(request)
        if request:
            tag_count = int(request.data.get("tag_count", 0))
            tags = []
            for i in range(tag_count):
                field_name = f"tag_{i}"
                tags.append(request.data.get(field_name, None))
                # self.fields[field_name] = PromptTagSerializer()
                # serializers.CharField(required=False)
            self.tags = tags


    def validate(self, data):
        tags = self.tags

        # PromptTagModel.objects.all().delete()
        tag_objects = []
        for tag in tags:
            tag_object, _ = PromptTagModel.objects.get_or_create(name=tag)
            tag_objects.append(tag_object)
        # tag_objects = list(map(lambda x: PromptTagModel.objects.get_or_create(x)[0], tags))
        data["tags"] = tag_objects
        # print(data)
        return data
    

    def create(self, validated_data):
        request = self.context.get('request', None)
        print(request.data, request.user)
        tags_data = validated_data.pop("tags", [])
        prompt_checkpoint = PromptCheckpointModel.objects.create(**validated_data)
        # for tag_data in tags_data:
        #     tag, _ = PromptTagModel.objects.get_or_create(name=tag_data["name"])
        #     prompt_checkpoint.tags.add(tag)
        for tag_data in tags_data:
            tag = tag_data
            # tag, _ = PromptTagModel.objects.get_or_create(name=tag_data["name"])
            prompt_checkpoint.tags.add(tag)
        return prompt_checkpoint

    def update(self, instance, validated_data):
        
        tags_data = validated_data.pop("tags", [])
        instance = super().update(instance, validated_data)
        instance.tags.clear()
        for tag_data in tags_data:
            tag = tag_data
            # tag, _ = PromptTagModel.objects.get_or_create(name=tag_data["name"])
            instance.tags.add(tag)
        return instance

class CollaborationExperimentSerializer(serializers.ModelSerializer):
    # blueprint = BlueprintSerializer()
    session = CollaborationSessionSerializer(read_only=True)
    session_id = serializers.PrimaryKeyRelatedField(queryset=CollaborationSessionModel.objects.all(), source='session', write_only=True)
    # prompt_checkpoint = PromptCheckpointSerializer()
    # For Read
    prompt_checkpoint = PromptCheckpointSerializer(read_only=True)
    # For Write
    prompt_checkpoint_id = serializers.PrimaryKeyRelatedField(queryset=PromptCheckpointModel.objects.all(), source='prompt_checkpoint', write_only=True)

    class Meta:
        model = CollaborationExperimentModel
        fields = ['id', 'session', 'session_id', 'created_at', 'updated_at', 'is_active', 'is_public', 'name', 'link', 'prompt_checkpoint', 'backend_version', 'prompt_checkpoint_id']


class CollaborationExperimentFeedbackSerializer(serializers.ModelSerializer):
    # blueprint = BlueprintSerializer()
    session = CollaborationSessionSerializer(read_only=True)
    session_id = serializers.PrimaryKeyRelatedField(queryset=CollaborationSessionModel.objects.all(), source='session', write_only=True)

    class Meta:
        model = CollaborationExperimentFeedbackModel 
        fields = ['id', 'session', 'session_id', 'created_at', 'updated_at', 'content', 'link', "participant_code", "spec", "record", "complete_code", 'is_complete']





class TaskPoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskPool
        fields = ['pool_id', 'experiments', 'completed_count', 'upper_limit', 'user_task_limit']
        

class ParticipantTaskModelSerializer(serializers.ModelSerializer):
    records = CollaborationRecordSerializer(many=True, read_only=True)
    experiment = CollaborationExperimentSerializer(read_only=True)

    class Meta:
        model = ParticipantTaskModel
        fields = ['participant', 'experiment', 'is_completed', 'records', 'id', 'link', 'is_feedback_received', 'pool', 'is_feedback_completed']

class ParticipantModelSerializer(serializers.ModelSerializer):
    assigned_tasks = ParticipantTaskModelSerializer(many=True, read_only=True)

    class Meta:
        model = ParticipantModel
        fields = ['user_id', 'assigned_tasks', 'task_pool', 'id']
        
    def get_assigned_tasks(self, obj):
        tasks = ParticipantTaskModel.objects.filter(participant=obj)
        return ParticipantTaskModelSerializer(tasks, many=True).data


class ParticipantTaskFeedbackModelSerializer(serializers.ModelSerializer):
    collaboration_experiment_feedback = CollaborationExperimentFeedbackSerializer()

    class Meta:
        model = ParticipantTaskFeedbackModel
        fields = '__all__'  # include all fields and the nested collaboration_experiment_feedback
    def create(self, validated_data):
        collaboration_experiment_feedback_data = validated_data.pop('collaboration_experiment_feedback')
        collaboration_experiment_feedback = CollaborationExperimentFeedbackModel.objects.create(**collaboration_experiment_feedback_data)
        participant_task_feedback = ParticipantTaskFeedbackModel.objects.create(collaboration_experiment_feedback=collaboration_experiment_feedback, **validated_data)
        return participant_task_feedback
    
    
class MachineBatchFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineBatchFeedbackModel
        fields = '__all__'
    