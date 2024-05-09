
from django.urls import path
from .views import index

urlpatterns = [
	path('', index),
	path('music-home', index),
	path('join', index),
	path('create', index),
	path('room/<str:roomCode>', index),
	path('pong/', index),
	path('pong/<str:roomCode>', index),
	path('ponglocal', index),
	
]