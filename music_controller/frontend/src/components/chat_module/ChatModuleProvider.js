import { createContext, useContext } from 'react';

const RoomProps = {
	id: '',
	name: '',
	messages: [],
};

const wssConnectionProps = {
	wssConnection: WebSocket | null,
	id: null,
};


const ChatContextProps = {
	rooms: [],
	wssConnections: [],
	connectToRoom: (roomId) => Promise,
	leaveRoom: (roomId) => Promise,
	sendMessage: (message, roomId) => Promise,
};

const ChatContext = createContext(ChatContextProps);

export const ChatContextProvider = ({ children }) => {
	const {
		rooms,
		wssConnection,
	} = useChat();

	return <ChatContext.Provider value={{
		rooms,
		wssConnection
	}}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error('useChatContext must be used within a ChatContextProvider');
	}
	return context;
}