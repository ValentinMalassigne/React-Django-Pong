const useChat = () => {
	const [rooms, setRooms] = useState([]);
	const [wssConnections, setWssConnections] = useState([]);

	const connectToRoom = async (roomId) => {
		try {
			console.log("Creating websocket for room:", roomId);
			const wssConnection = new WebSocket('ws://localhost:8000/ws/chat/' + roomId + "/");

			setWssConnections([...wssConnections, { wssConnection: wssConnection, id: roomId }]);

			setRooms([...newRooms, { id: roomId, name: roomId, messages: [] }]);

			wssConnection.onmessage = (e) => {
				const data = JSON.parse(e.data);
				// Ensure data.message is the structure you expect
				if (data != null && typeof data.text === 'string' && typeof data.role === 'string' && typeof data.username === 'string') {
					const currentRoom = rooms.filter(room => room.id === roomId);
					currentRoom.messages = [...currentRoom.messages, { text: data.text, role: data.role, username: data.username }];
					setRooms = [...rooms.filter(room => room.id !== roomId), currentRoom];
					console.log('Received data:', data);
				} else {
					console.error('Received data has an unexpected structure:', data);
				}
			}
		}
		catch (error) {
			console.error("Error during websocket creation:", error);
		}
	};

	const leaveRoom = async (roomId) => {
		const newRooms = rooms.filter(room => room.id !== roomId);
		const newWssConnections = wssConnections.filter(wssConnection => wssConnection.id !== roomId);

		const oldWssConnection = wssConnections.filter(wssConnection => wssConnection.id === roomId);
		oldWssConnection.wssConnection.close();

		setRooms(newRooms);
		setWssConnections(newWssConnections);
	}

	const sendMessage = async (message, roomId) => {
		const wssConnection = wssConnections.filter(wssConnection => wssConnection.id === roomId);
		wssConnection.send(JSON.stringify({ message: message }));
	}

	return { rooms, wssConnections, connectToRoom, leaveRoom, sendMessage };
}

export default useChat;