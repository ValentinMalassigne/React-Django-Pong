"""
ASGI config for music_controller project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'music_controller.settings')

from chat.routing import websocket_urlpatterns
from pong.routing import pong_websocket_urlpatterns

application = ProtocolTypeRouter({
	"http": get_asgi_application(),
	"websocket": AllowedHostsOriginValidator(
		AuthMiddlewareStack(URLRouter(websocket_urlpatterns + pong_websocket_urlpatterns)),
	)
})

