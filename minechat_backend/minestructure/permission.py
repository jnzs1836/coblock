from rest_framework import permissions
from .models import BlueprintModel, BlueprintCollaboratorModel, BlueprintShareLinkModel

class BlueprintCollaboratorPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if obj.user == user:
            return True

        if obj.can_manage and user.is_staff:
            return True

        if obj.can_edit and user in obj.blueprint.collaborators.all():
            return True

        if obj.can_view:
            return True

        return False


class IsBlueprintOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow only blueprint owners to edit or delete their blueprints.
    """
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request, so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner of the blueprint.
        return obj.owner == request.user




class IsOwnerOrCollaborator(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user == obj.owner:
            return True
        return obj.collaborators.filter(pk=request.user.pk).exists()

class HasBlueprintPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == 'list':
            return True
        elif view.action in ['create', 'partial_update', 'update', 'destroy']:
            return request.user.is_authenticated
        elif view.action in ['retrieve', 'share']:
            blueprint = BlueprintModel.objects.get(pk=view.kwargs['pk'])
            return request.user.is_authenticated and IsOwnerOrCollaborator().has_object_permission(request, view, blueprint)
        else:
            return False

class HasShareLinkPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == 'retrieve':
            blueprint_share_link = BlueprintShareLinkModel.objects.get(pk=view.kwargs['share_id'])
            blueprint = blueprint_share_link.blueprint
            return blueprint_share_link.is_active and blueprint_share_link.user == request.user and IsOwnerOrCollaborator().has_object_permission(request, view, blueprint)
        elif view.action == 'create':
            blueprint = BlueprintModel.objects.get(pk=view.kwargs['pk'])
            return request.user.is_authenticated and IsOwnerOrCollaborator().has_object_permission(request, view, blueprint)
        else:
            return False

class CanManageShareLinks(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action in ['create', 'update', 'partial_update', 'destroy']:
            blueprint = BlueprintModel.objects.get(pk=view.kwargs['pk'])
            return request.user.is_authenticated and blueprint.owner == request.user
        else:
            return False


class BlueprintAccessPermission(permissions.BasePermission):
    def __init__(self, blueprint=None, user=None):
        self.blueprint = blueprint
        self.user = user

    def has_permission(self, request, view):
        if request.method == 'GET':
            return self.has_view_permission()
        elif request.method == 'PUT':
            return self.has_edit_permission()
        elif request.method == 'DELETE':
            return self.has_delete_permission()

    def has_object_permission(self, request, view, obj):
        
        if self.share_link:
            can_edit = self.share_link.can_edit
            can_view = self.share_link.can_view
        else:
            can_edit = False
            can_view = False

        if not can_edit and not can_view:
            return False

        if can_edit:
            return self.has_edit_permission()

        if can_view:
            return self.has_view_permission()

        return False

    def has_edit_permission(self):
        if self.user is None or self.user.is_anonymous:
            return False
        if self.user == self.blueprint.owner:
            return True
        
        collaborator = BlueprintCollaboratorModel.objects.filter(blueprint=self.blueprint, collaborator=self.user, can_edit=True).first()
        if collaborator is not None:
            return True
        # share_links = BlueprintShareLinkModel.objects.filter(blueprint=self.blueprint, is_active=True)
        return False
        

    def has_view_permission(self):
        if self.user is None or self.user.is_anonymous:
            return False
        if self.user == self.blueprint.owner:
            return True
        collaborator = BlueprintCollaboratorModel.objects.filter(blueprint=self.blueprint, collaborator=self.user, can_view=True).first()
        if collaborator is not None:
            return True
        share_links = BlueprintShareLinkModel.objects.filter(blueprint=self.blueprint, is_active=True)
        
        return False

    def has_delete_permission(self):
        if self.user is None or self.user.is_anonymous:
            return False
        if self.user == self.blueprint.owner:
            return True
        
        collaborator = BlueprintCollaboratorModel.objects.filter(blueprint=self.blueprint, collaborator=self.user, can_view=True).first()
        if collaborator is not None:
            return True
        share_links = BlueprintShareLinkModel.objects.filter(blueprint=self.blueprint, is_active=True)
        # for share_link in share_links:
        #     if share_link.can_view and share_link.shared_with == self.user:
        #         return True
        return True 

    def check_share_link_access(self, id):
        if self.share_link and str(self.share_link.id) == id:
            if not self.share_link.is_active:
                raise ValidationError('The share link has expired.')

            if self.share_link.expires_at < timezone.now():
                self.share_link.is_active = False
                self.share_link.save()
                raise ValidationError('The share link has expired.')

            return True

        return False