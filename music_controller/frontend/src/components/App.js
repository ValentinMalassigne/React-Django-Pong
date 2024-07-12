import React, { Component } from 'react';
import { render } from 'react-dom';
import HomePage from './HomePage';
import FloatingChat from './FloatingChat';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<>
				<div className='center'>
					<HomePage />

				</div>
				<FloatingChat />
			</>

		);
	}
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);