import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";

const Room = ({ leaveRoomCallback }) => {
	const params = useParams();
	const navigate = useNavigate();
	const [state, setState] = useState({
		guestCanPause: false,
		isHost: false,
		showSettings: false,
	});

	useEffect(() => {
		getRoomDetails();
	}, []);

	const getRoomDetails = () => {
		fetch('/api/get-room?code=' + params.roomCode)
			.then((resp) => {
				if (!resp.ok) {
					leaveRoomCallback();
					navigate('/');
				}
				return resp.json()
			})
			.then((data) => {
				setState({
					...state,
					votesToSkip: data.votes_to_skip,
					guestCanPause: data.guest_can_pause,
					isHost: data.is_host
				})
			}
			)
	}

	const leaveButtonPressed = () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" }
		};
		fetch('/api/leave-room/', requestOptions).then((_resp) => {
			leaveRoomCallback();
			navigate(`/`);
		});

	}

	const updateShowSettings = (value) => {
		setState({
			...state,
			showSettings: value,
		});
	}

	const renderSettings = () => {
		return (
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<CreateRoomPage
						update={true}
						votesToSkip={state.votesToSkip}
						guestCanPause={state.guestCanPause}
						roomCode={params.roomCode}
						updateCallback={getRoomDetails} />
				</Grid>
				<Grid item xs={12} align="center">
					<Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)}>
						Close Settings
					</Button>
				</Grid>
			</Grid>
		);
	}

	const renderSettingsButton = () => {
		return (
			<Grid item xs={12} align="center">
				<Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>
					Settings
				</Button>
			</Grid>
		);

	}

	return (
		state.showSettings ? renderSettings() :
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<Typography variant="h4" compact="h4">
						Code: {params.roomCode}
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<Typography variant="h6" compact="h6">
						Votes: {state.votesToSkip}
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<Typography variant="h6" compact="h6">
						Guest Can Pause: {state.guestCanPause.toString()}
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<Typography variant="h6" compact="h4">
						Host: {state.isHost.toString()}
					</Typography>
				</Grid>
				{state.isHost ? renderSettingsButton() : null}
				<Grid item xs={12} align="center">
					<Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
						Leave Room
					</Button>
				</Grid>
			</Grid>
	);
}

export default Room;