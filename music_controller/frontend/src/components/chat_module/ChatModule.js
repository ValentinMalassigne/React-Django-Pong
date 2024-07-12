import React, { useState, useEffect, useRef } from 'react';

const ChatModule = ({ roomCode }) => {
	const socketRef = useRef(null);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		try {
			console.log("Creating websocket for room:", roomCode);
			socketRef.current = new WebSocket('ws://localhost:8000/ws/chat/' + roomCode + "/");

			// socketRef.current.onopen = () => {
			// 	if (socketRef.current) {
			// 		socketRef.current.send(JSON.stringify({ message: '' }));
			// 	}
			// };

			socketRef.current.onerror = (error) => {
				console.error('WebSocket error', error);
			}
		}
		catch (error) {
			console.error("Error during websocket creation:", error);
		}

		return () => {
		};
	}, []);

	useEffect(() => {
		if (socketRef.current) {
			socketRef.current.onmessage = (e) => {
				const data = JSON.parse(e.data);
				// Ensure data.message is the structure you expect
				if (data != null && typeof data.text === 'string' && typeof data.role === 'string' && typeof data.username === 'string') {
					setMessages(prevMessages => [...prevMessages, { text: data.text, role: data.role, username: data.username }]);
					console.log('Received data:', data);
				} else {

					console.error('Received data has an unexpected structure:', data);
				}
			}
		}
	}, []);

	const sendMessage = () => {
		if (socketRef.current) {
			socketRef.current.send(JSON.stringify({ message: message }));
			setMessage('');
		}
	}

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
				<div id="chat-log" style={{ overflowY: 'scroll', backgroundColor: 'white', flexGrow: 1 }}>
					{messages.map((msg, index) => {
						// Define color based on msg.role
						let messageColor;
						switch (msg.role) {
							case 'player':
								messageColor = 'blue';
								break;
							case 'system':
								messageColor = 'red';
								break;
							case 'spectator':
								messageColor = 'green';
								break;
							default:
								messageColor = 'black'; // Default color
						}

						return (
							<div
								key={index}
								style={{ color: messageColor }}
							>
								{msg.role !== 'system' ? <a href={`/profile/${msg.username}`} style={{ color: messageColor, fontWeight: 'bold' }}>
									{msg.username + " : "}
								</a> : null}

								{msg.text}
							</div>
						);
					})}
				</div>
				<div style={{ marginTop: 'auto' }}>
					<input
						id="chat-message-input"
						type="text"
						value={message}
						onChange={e => setMessage(e.target.value)}
					/><br />
					<button onClick={sendMessage}>Send</button>
				</div>
			</div>
		</>
	);


};

export default ChatModule;