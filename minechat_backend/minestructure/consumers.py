# your_app/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ParticipantTaskConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'task_updates'
        
        # Add this consumer instance to the room group.
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
                # Send a message to the group.
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'task_update',
                'message': message
            }
        )

        # await self.send(text_data=json.dumps({
        #     'message': message
        # }))
        
    async def task_update(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'] + "hey",
            'status': event['status'],
            'task_id': event['task_id'],
        }))
