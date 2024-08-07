import React, { useState } from 'react';
import ChatModule from './ChatModule';
import { useChatContext } from './ChatModuleProvider';

const FloatingChat = () => {
	const [open, setOpen] = useState(false);
	const { rooms, roomCode, setRoomCode } = useChatContext();

	const toggleOpen = () => setOpen(!open);

	return (
		<>
			{!open && (
				<button
					style={{
						position: 'fixed',
						bottom: '10px',
						right: '10px',
						height: '60px',
						width: '160px',
						borderRadius: '10px',
						backgroundColor: '#007bff',
						color: '#ffffff',
						border: 'none',
						outline: 'none',
						boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
						fontSize: '24px',
						cursor: 'pointer',
						zIndex: 1000, // Ensure it's above other elements
					}}
					onClick={toggleOpen}
				>
					{"💬 chat " + "    ⬆️"}
				</button>
			)}
			{open && (
				<div style={{
					position: 'fixed',
					bottom: '10px',
					right: '10px', width: '400px', height: '600px', border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden', zIndex: 1000,
				}}>
					<div style={{ position: 'absolute', top: '0', right: '0', padding: '10px', textAlign: 'center', zIndex: '1' }}>
						<button onClick={() => setOpen(false)}>Close</button>
					</div>
					<div style={{ position: 'absolute', top: '0', left: '0', padding: '10px', textAlign: 'center', zIndex: '1' }}>
						{
						console.log("rooms: ", rooms)
						}
						{
						rooms.map((room) => (
							<button key={"button" + room.id} onClick={() => setRoomCode(room.id)}>
							{room.name}
							</button>
						))}
					</div>
					<div style={{ position: 'absolute', top: '50px', bottom: '0', left: '0', right: '0', overflowY: 'auto', padding: '10px' }}>
						<ChatModule key={roomCode} roomCode={roomCode} />
					</div>
				</div>
			)}
		</>
	);
}

export default FloatingChat;