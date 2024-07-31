import  { useEffect, useState } from 'react';

const useChat = () => {
	const [rooms, setRooms] = useState([]);
	const [roomCode, setRoomCode] = useState('global');

	//initalization
	useEffect(() => {
		const initChat = () => {
			try {
				const wssConnection = new WebSocket('ws://localhost:8000/ws/chat/global/');

				if (wssConnection)
				{
					setRooms([{ id: "global", name: "global", messages: [{text: "Welcome to the chat", role: "system",username: "System"}], wssConnection: wssConnection }]);
				}
			} catch (error) {
				console.error("Error during websocket creation:", error);
			}
		}
		initChat();
	}, []);

	const connectToRoom = async (roomId) => {
		console.log("Connecting to room:", roomId);
		try {
			// console.log("Creating websocket for room:", roomId);
			const wssConnection = new WebSocket('ws://localhost:8000/ws/chat/' + roomId + "/");

			setRooms([...rooms, { id: roomId, name: roomId, messages: [{text: "Welcome to the chat", role: "system",username: "useChat"}], wssConnection: wssConnection }]);
			setRoomCode(roomId);
		}
		catch (error) {
			console.error("Error during websocket creation:", error);
		}
	};

	const listenToWebsocket = async (roomId) => {
		const filteredRooms = rooms.filter(room => room.id === roomId);
		if (filteredRooms.length !== 0) {
			const currentRoom = filteredRooms[0];
			currentRoom.wssConnection.onmessage = (e) => {
				const data = JSON.parse(e.data);
				if (data != null && data.type === 'command')
				{
					manageReceivedCommand(data)
				} else if (data != null && typeof data.text === 'string' && typeof data.role === 'string' && typeof data.username === 'string') {
					currentRoom.messages = [...(currentRoom.messages || []), { text: data.text, role: data.role, username: data.username }];
					
					// Find the index of the room to be replaced
					const roomIndex = rooms.findIndex(room => room.id === roomId);
					// If the room is found, replace it with currentRoom at the same index
					if (roomIndex !== -1) {
						setRooms([
							...rooms.slice(0, roomIndex),
							currentRoom,
							...rooms.slice(roomIndex + 1)
						]);
					}
					
					// setRooms( [...rooms.filter(room => room.id !== roomId), currentRoom]);
				} else {
					console.error('Received data has an unexpected structure:', data);
				}
			}
		}
	}

	const manageReceivedCommand = (data) => {
		if (typeof data.command === 'string')
		{
			switch (data.command) {
				case "open_private_room":
					if (typeof data.arguments === "string")
						connectToRoom(data.arguments)
					break;
				default:
					console.log("Command not recognized: ", data.command);
					break;
			}
		}
	}

	const leaveRoom = async (roomId) => {
		const newRooms = rooms.filter(room => room.id !== roomId);

		const oldRoom = rooms.filter(room => room.id === roomId);
		oldRoom[0].wssConnection.close();

		setRooms(newRooms);
	}

	const sendMessage = async (message, roomId) => {
		//TODO intercept commands

		const room = rooms.filter(room => room.id === roomId);

		room[0].wssConnection.send(JSON.stringify({ message: message }));
	}

	return { rooms, roomCode, setRoomCode, connectToRoom, leaveRoom, sendMessage, listenToWebsocket };
}

export default useChat;