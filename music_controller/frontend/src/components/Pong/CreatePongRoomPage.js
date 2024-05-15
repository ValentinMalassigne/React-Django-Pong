import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Collapse } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert";

const CreatePongRoomPage = () => {
	const defaultProps = {
		player_limit: 2,
	}

	const [state, setState] = useState({
		player_limit: defaultProps.player_limit,
		errorMsg: "",
		successMsg: ""
	});
	const navigate = useNavigate();

	const handleVotesChange = (e) => {
		setState({
			...state,
			player_limit: e.target.value,
		});
	}

	const handleRoomButtonPressed = () => {
		const requestOptions = {
			method: 'Post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				player_limit: state.player_limit,
			}),
		};
		fetch('/pong-api/create-room/', requestOptions)
			.then((response) => response.json())
			.then((data) => navigate('/pong/' + data.code));
	}


	const renderCreateButtons = () => {
		return <> <Grid item xs={12} align="center">
			<Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>
				Create A Room
			</Button>
		</Grid>
			<Grid item xs={12} align="center">
				<Button variant="contained" color="secondary" to="/pong-home" component={Link}>
					Back
				</Button>
			</Grid>
		</>
	}

	return (
		<Grid container spacing={1}>
			<Grid item xs={12} align="center">
				<Collapse in={state.errorMsg != "" || state.successMsg != ""}>
					{state.successMsg != "" ?
						<Alert security="success" onClose={() => setState({ ...state, successMsg: "" })} >
							{state.successMsg}</Alert> :
						<Alert severity="error" onClose={() => setState({ ...state, successMsg: "" })}>
							{state.errorMsg}</Alert>}
				</Collapse>
			</Grid>
			<Grid item xs={12} align="center">
				<Typography component="h4" variant="h4">
					Create A Room
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<FormControl>
					<TextField
						required={true}
						type="number"
						defaultValue={state.player_limit}
						inputProps={{
							min: 0,
							max: 2,
							style: { textAlign: "center" },
						}}
						onChange={handleVotesChange}
					/>
					<FormHelperText component="div">
						<div align="center">Number of players in the game from 0 to 2</div>
					</FormHelperText>
				</FormControl>
			</Grid>
			{renderCreateButtons()}
		</Grid>

	);
}

export default CreatePongRoomPage;