import asyncio
import json

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from pong.manage_game import game_loop

class PongConsumer(AsyncWebsocketConsumer):     
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"pong_{self.room_name}"

        # Create a session key if it doesn't exist
        if not self.scope["session"].session_key:
            await sync_to_async(self.scope["session"].create)()
            await sync_to_async(self.scope["session"].save)()

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

   
    # Receive message from WebSocket
    async def receive(self, text_data):
        print(self.scope["session"].session_key + " : " + text_data)
        text_data_json = json.loads(text_data)
        if text_data_json["type"] == "start_game":
            await self.start_game(event=text_data_json)
        elif text_data_json["type"] == "update_paddle":
            if text_data_json["side"] == "left":
                self.left_paddle_position = self.left_paddle_position - 10 if text_data_json["direction"] == "up" else self.left_paddle_position + 10
            elif text_data_json["side"] == "right":
                self.right_paddle_position = self.right_paddle_position - 10 if text_data_json["direction"] == "up" else self.right_paddle_position + 10
        elif text_data_json["type"] == "pause":
            self.pause = not self.pause
        elif text_data_json["type"] == "restart":
            self.restart = True
            self.pause = False
            await asyncio.sleep(1.5)
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "start_game", "nb_players": text_data_json["nb_players"]}
            )

    async def start_game(self, event):
        self.left_paddle_position = 150
        self.right_paddle_position = 150
        self.pause = False
        self.restart = False
        asyncio.ensure_future(game_loop(self=self, event=event))


    # Receive a message to send, send it to the room group
    async def send_message(self, event):

        # Send message to WebSocket
        await self.send(text_data=json.dumps(event["message"]))