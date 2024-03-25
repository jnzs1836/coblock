# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import ParticipantModel, TaskPool, ParticipantTaskModel, CollaborationExperimentModel
from ..serializers import ParticipantModelSerializer
import uuid
import random
import numpy as np

def select_objects(object_list, K, upper_limit):
    # Filter out objects with assigned_count >= upper_limit
    available_objects = [obj for obj in object_list if obj['assigned_count'] < upper_limit]

    if len(available_objects) == 0:
        return []

    # Calculate probabilities inversely proportional to assigned_count + 1
    total_weight = sum(1 / (obj['assigned_count'] + 1) for obj in available_objects)
    probabilities = np.array([(1 / (obj['assigned_count'] + 1)) / total_weight for obj in available_objects])

    # Randomly select min(K, len(available_objects)) unique objects based on the calculated probabilities
    num_to_select = min(K, len(available_objects))
    selected_indices = np.random.choice(len(available_objects), num_to_select, replace=False, p=probabilities)

    # Increment assigned_count for each selected object and gather their IDs
    selected_ids = []
    for i in selected_indices:
        available_objects[i]['assigned_count'] += 1
        selected_ids.append(available_objects[i]['id'])

    return selected_ids

    

class ParticipantHomePage(APIView):

    def create_experiments(self, participant, task_pool):
        object_list = []
        experiments = task_pool.experiments.all() 
        for i, experiment in enumerate(experiments):
                existing_objects = ParticipantTaskModel.objects.filter(pool=task_pool, experiment=experiment)
                users = list(map(lambda x: x.participant.user_id, existing_objects))
                object_list.append(
                    {"id": i, "assigned_count": len(existing_objects)}
                )
        selected_objects = select_objects(object_list, task_pool.user_task_limit, task_pool.upper_limit)
        selected_experiments = list(map(lambda x: experiments[x], selected_objects))
        for experiment in selected_experiments:
               ParticipantTaskModel.objects.create(participant=participant, experiment=experiment, pool=task_pool) 

    def get(self, request, *args, **kwargs):
        user_id = request.COOKIES.get('user_id')
        pool_id = request.GET.get('pool_id', None)

        if not pool_id:
            return Response({'error': 'Pool ID is required'}, status=400)

        try:
            task_pool = TaskPool.objects.get(pool_id=pool_id)
        except TaskPool.DoesNotExist:
            return Response({'error': 'Invalid Pool ID'}, status=400)

        # if user_id:
        #     participant = ParticipantModel.objects.get(user_id=user_id, task_pool=task_pool)

        if not user_id:
            user_id = uuid.uuid4()
            participant = ParticipantModel.objects.create(user_id=user_id, task_pool=task_pool)
            self.create_experiments(participant, task_pool)
            # Assign tasks from the task pool to the participant
            
            # object_list = []
            # experiments = task_pool.experiments.all() 
            # for i, experiment in enumerate(experiments):
            #     existing_objects = ParticipantTaskModel.objects.filter(pool=task_pool, experiment=experiment)
            #     users = list(map(lambda x: x.participant.user_id, existing_objects))
            #     object_list.append(
            #         {"id": i, "assigned_count": len(existing_objects)}
            #     )
            # selected_objects = select_objects(object_list, task_pool.user_task_limit, task_pool.upper_limit)
            # selected_experiments = list(map(lambda x: experiments[x], selected_objects))
            # for experiment in selected_experiments:
            #    ParticipantTaskModel.objects.create(participant=participant, experiment=experiment, pool=task_pool) 
            # return Response({"len": len(existing_objects), "selected": selected_objects})

                # ParticipantTaskModel.objects.create(participant=participant, experiment=experiment, pool=task_pool)
        else:
            try:
                participant = ParticipantModel.objects.get(user_id=user_id, task_pool=task_pool)
                # Update task pool's completed count or any other operations
            except ParticipantModel.DoesNotExist:
                user_id = uuid.uuid4()
                participant = ParticipantModel.objects.create(user_id=user_id, task_pool=task_pool)
                # Assign tasks from the task pool to the new participant
                self.create_experiments(participant, task_pool)
        
        serializer = ParticipantModelSerializer(participant)
        assigned_tasks = serializer.get_assigned_tasks(participant)
        
        # print(serializer.data, assigned_tasks)
        data = dict(serializer.data)  # Convert to native dict
        # data['assigned_tasks'] = serializer.get_assigned_tasks(participant)
        
        # for task in assigned_tasks:
        #     task['is_feedback_received'] = not task['is_feedback_received']
        
        data['assigned_tasks'] = assigned_tasks
        response = Response(data)

        response = Response(data)
        response.set_cookie('user_id', str(user_id), max_age=30*24*60*60)

        return response