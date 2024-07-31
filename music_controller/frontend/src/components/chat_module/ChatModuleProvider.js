import React, { createContext, useContext } from 'react';
import useChat  from './useChat';

const RoomProps = {
	id: '',
	name: '',
	wssConnection: WebSocket | null,
	messages: [],
};

const ChatContextProps = {
	rooms: [],
	roomCode: 'global',
	setRoomCode: (roomId) => {},
	connectToRoom: (roomId) => Promise,
	leaveRoom: (roomId) => Promise,
	sendMessage: (message, roomId) => Promise,
	listenToWebsocket: (roomId) => Promise,
};

const ChatContext = createContext(ChatContextProps);

export const ChatContextProvider = ({ children }) => {
	const {
		rooms,
		roomCode,
		setRoomCode,
		connectToRoom,
		leaveRoom,
		sendMessage,
		listenToWebsocket,
	} = useChat();

	return <ChatContext.Provider value={{
		rooms,
		roomCode,
		setRoomCode,
		connectToRoom,
		leaveRoom,
		sendMessage,
		listenToWebsocket,
	}}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error('useChatContext must be used within a ChatContextProvider');
	}
	return context;
}