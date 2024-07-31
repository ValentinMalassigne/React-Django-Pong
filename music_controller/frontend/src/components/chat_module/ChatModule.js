import React, { useState, useEffect, useRef } from 'react';
import { useChatContext } from './ChatModuleProvider';

const ChatModule = ({ roomCode }) => {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const { rooms , sendMessage, connectToRoom, listenToWebsocket} = useChatContext();

	useEffect( () => {
		// console.log("Checking if room exists:", roomCode);
		const room = rooms.find(room => room.id === roomCode);
		if (!room) {
			// console.log("Room does not exist, connecting to room:", roomCode);
			 connectToRoom(roomCode);		 
		} else {
			// console.log("my rooms : ", rooms);
			listenToWebsocket(roomCode);
		}
	}, [roomCode, rooms]);

	useEffect(() => {
        const room = rooms.find(room => room.id === roomCode); // Find the room by ID
        if (room) {
            setMessages(room.messages); // Set messages for the found room
        }
    }, [roomCode, rooms]); // Re-run when roomId or rooms change

	const sendMessage2 = () => {
		sendMessage(message, roomCode);
		setMessage('');
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
									{msg.username + " :"}
								</a> : null}

								{" " + msg.text}
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
					<button onClick={sendMessage2}>Send</button>
				</div>
			</div>
		</>
	);


};

export default ChatModule;