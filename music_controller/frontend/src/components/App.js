import React, { Component } from 'react';
import { render } from 'react-dom';
import HomePage from './HomePage';
import FloatingChat from './chat_module/FloatingChat';
import { ChatContextProvider } from './chat_module/ChatModuleProvider';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<>
			<ChatContextProvider>
				<div className='center'>
					<HomePage />
				</div>
				<FloatingChat />
			</ChatContextProvider>
			</>
		);
	}
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);