import json

from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
		self.room_group_name = f"chat_{self.room_name}"

		# Join room group
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)

		await self.accept()

	async def disconnect(self, close_code):
		# Leave room group
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

	# Receive message from WebSocket
	async def receive(self, text_data):
		text_data_json = json.loads(text_data)

		message = text_data_json["message"]

		print(self.room_group_name + " à reçu un message: " + message)
		
		# check if message is a command, ie starts with /
		if message.startswith("/"):
			# split message in command and argument
			command = message.split(" ")[0]
			# check if there is an argument
			if len(message.split(" ")) > 1:
				argument = message.split(" ")[1]
			else:
				argument = None				

			# check if command is /set
			if command == "/msg":
				# set the role and username
				
				currentPlayer = "test"

				# Send message to room group
				await self.chat_message({ "message": {"type": "command", "command": "open_private_room", "arguments": currentPlayer+argument}})
					 
				
				return

			# if command is not recognized
			# Send message to room group
			await self.chat_message({"message": {"text": "Command not recognized, type /help for help", "role": "system", "username": "system"}}
			)
			return


		role = "player"
		username = "test"


		# Send message to room group
		await self.channel_layer.group_send(
		self.room_group_name, {"type": "chat.message", "message": {"text": message, "role": role, "username": username}}
		)

	# Receive message from room group
	async def chat_message(self, event):
		message = event["message"]

		# Send message to WebSocket
		await self.send(text_data=json.dumps( message))
