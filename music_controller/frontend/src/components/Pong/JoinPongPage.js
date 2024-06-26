import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormControl } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const JoinPongPage = () => {
	const [state, setState] = useState({
		roomCode: "",
		error: "",
	});
	const navigate = useNavigate();

	const handleTextFieldChange = (e) => {
		setState({
			...state,
			roomCode: e.target.value,
		});
	};

	const roomButtonPressed = () => {
		if (state.roomCode.length === 0) {
			setState({
				...state,
				error: "Please enter a room code.",
			});
		}
		else {
			const requestOptions = {
				method: 'Post',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					code: state.roomCode,
				}),
			};
			fetch('/pong-api/join-room/', requestOptions)
				.then((response) => response.json())
				.then((data) => navigate('/pong/' + data.code));
		}
	}

	return (
		<Grid container spacing={1}>
			<Grid item xs={12} align="center">
				<Typography component="h4" variant="h4">
					Join a pong room
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<FormControl>
					<TextField
						error={state.error.length > 0}
						label="Code"
						placeholder="Enter a Room Code"
						helperText={state.error}
						value={state.roomCode}
						variant="outlined"
						color="primary"
						onChange={handleTextFieldChange}
					/>
				</FormControl>
			</Grid>
			<Grid item xs={12} align="center">
				<Button variant="contained" color="primary" onClick={roomButtonPressed}>
					Enter Room
				</Button>
			</Grid>
			<Grid item xs={12} align="center">
				<Button variant="contained" color="secondary" to="/pong" component={Link}>
					Back
				</Button>
			</Grid>
		</Grid>
	);
}

export default JoinPongPage;