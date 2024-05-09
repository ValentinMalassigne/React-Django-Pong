import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const RoomJoinPage = () => {
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
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				code: state.roomCode,
			}),
		};
		fetch("/api/join-room/", requestOptions)
			.then((response) => {
				if (response.ok) {
					navigate(`/room/${state.roomCode}`);
				} else {
					setState({ ...state, error: "Room not found." });
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return (
		<Grid container spacing={1}>
			<Grid item xs={12} align="center">
				<Typography component="h4" variant="h4">
					Join a Room
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
				<Button variant="contained" color="secondary" to="/" component={Link}>
					Back
				</Button>
			</Grid>
		</Grid>
	);
}

export default RoomJoinPage;