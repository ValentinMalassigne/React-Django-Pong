import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, } from "react-router-dom";
import Room from "./Room";
import { Grid, Button, Typography } from "@material-ui/core";

export default class MusicHomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			roomCode: null,
		}
		this.clearRoomCode = this.clearRoomCode.bind(this);
	}

	//called after the component has been rendered for the first time to the DOM
	async componentDidMount() {
		fetch("/api/user-in-room")
			.then((response) => response.json())
			.then((data) => {
				if (data.code) {
					this.setState({
						roomCode: data.code,
					});
					// this.props.history.push(`/room/${data.code}`);
				}
			});
	}

	renderHomePage() {
		return (
			<Grid container spacing={3}>
				<Grid item xs={12} align="center">
					<Typography variant="h3" compact="h3">
						Music Controller
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<Button color="primary" variant="contained" to="/join" component={Link}>
						Join a Room
					</Button>
				</Grid>
				<Grid item xs={12} align="center">
					<Button color="secondary" variant="contained" to="/create" component={Link}>
						Create a Room
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
						<Navigate to={`room/${this.state.roomCode}`} /> :
						this.renderHomePage()
				}
			</>
		);
	}
}

