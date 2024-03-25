# your_project/routing.py

from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path

from minestructure import consumers  # Import your consumers here

websocket_urlpatterns = [
    path('ws/participant/', consumers.ParticipantTaskConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    'websocket': URLRouter(websocket_urlpatterns),
})
