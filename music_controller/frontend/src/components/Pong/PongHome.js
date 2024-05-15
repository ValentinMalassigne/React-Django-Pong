import React, { Component } from "react";
import { Link, Navigate, } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";

export default class PongHomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			roomCode: null,
		}
		this.clearRoomCode = this.clearRoomCode.bind(this);
	}

	//called after the component has been rendered for the first time to the DOM
	// async componentDidMount() {
	// 	fetch("/api/user-in-room")
	// 		.then((response) => response.json())
	// 		.then((data) => {
	// 			if (data.code) {
	// 				this.setState({
	// 					roomCode: data.code,
	// 				});
	// 				// this.props.history.push(`/room/${data.code}`);
	// 			}
	// 		});
	// }

	renderHomePage() {
		return (
			<Grid container spacing={3}>
				<Grid item xs={12} align="center">
					<Typography variant="h3" compact="h3">
						Pong Home
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<Button color="primary" variant="contained" to="/pong-join" component={Link}>
						Join a Room
					</Button>
				</Grid>
				<Grid item xs={12} align="center">
					<Button color="primary" variant="contained" to="/pong-create" component={Link}>
						Create a Room
					</Button>
				</Grid>
				<Grid item xs={12} align="center">
					<Button variant="contained" color="secondary" to="/" component={Link}>
						Back
					</Button>
				</Grid>
			</Grid>
		);
	};


	clearRoomCode() {
		this.setState({
			roomCode: null,
		});
	}

	render() {
		return (
			<>
				{
					this.state.roomCode ?
						<Navigate to={`pong/${this.state.roomCode}`} /> :
						this.renderHomePage()
				}
			</>
		);
	}
}

