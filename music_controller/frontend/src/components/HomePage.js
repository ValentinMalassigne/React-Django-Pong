import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";
import Pong from "./Pong/Pong";
import PongLocal from "./Pong/PongLocal";
import JoinPongPage from "./Pong/JoinPongPage";
import MusicHomePage from "./music_room/MusicHome";
import RoomJoinPage from "./music_room/RoomJoinPage";
import CreateRoomPage from "./music_room/CreateRoomPage";
import Room from "./music_room/Room";
import PongHomePage from "./Pong/PongHome";
import CreatePongRoomPage from "./Pong/CreatePongRoomPage";


export default class HomePage extends Component {
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
						HomePage
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<Button color="primary" variant="contained" to="/music-home" component={Link}>
						Go to music home
					</Button>
				</Grid>
				<Grid item xs={12} align="center">
					<Button color="secondary" variant="contained" to="/pong" component={Link}>
						Go to Pong
					</Button>
				</Grid>
			</Grid>
		);
	}

	clearRoomCode() {
		this.setState({
			roomCode: null,
		});
	}

	render() {
		return (
			<Router>
				<Routes>
					<Route path="/" element={this.state.roomCode ?
						<Navigate to={`room/${this.state.roomCode}`} /> :
						this.renderHomePage()} />
					{/* MUSIC CONTROLLER */}
					<Route path="/music-home" element={<MusicHomePage />} />
					<Route path="/join" element={<RoomJoinPage />} />
					<Route path="/create" element={<CreateRoomPage />} />
					<Route path="/room/:roomCode" element={<Room leaveRoomCallback={this.clearRoomCode} />} />
					{/* PONG */}
					<Route path="/pong" element={<PongHomePage />} />
					<Route path="/pong-join" element={<JoinPongPage />} />
					<Route path="/pong-create" element={<CreatePongRoomPage />} />
					<Route path="/pong/:roomCode" element={<Pong />} />
					<Route path="/ponglocal" element={<PongLocal />} />
				</Routes>
			</Router>
		);
	}
}

