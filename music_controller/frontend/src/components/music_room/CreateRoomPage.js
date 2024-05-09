import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl } from "@material-ui/core";
import { Form, Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useNavigate } from "react-router-dom";
import { Collapse } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert";

const CreateRoomPage = ({ update, votesToSkip, guestCanPause, roomCode, updateCallback }) => {
	const defaultProps = {
		votesToSkip: 2,
		guestCanPause: true,
		update: false,
		roomCode: null,
		updateCallback: () => { },
	}

	const [state, setState] = useState({
		guestCanPause: guestCanPause != undefined ? guestCanPause : defaultProps.guestCanPause,
		votesToSkip: votesToSkip != undefined ? votesToSkip : defaultProps.votesToSkip,
		errorMsg: "",
		successMsg: ""
	});
	const navigate = useNavigate();

	const handleVotesChange = (e) => {
		setState({
			...state,
			votesToSkip: e.target.value,
		});
	}

	const handleGuestCanPauseChange = (e) => {
		setState({
			...state,
			guestCanPause: e.target.value === "true" ? true : false,
		});
	}

	const handleRoomButtonPressed = () => {
		const requestOptions = {
			method: 'Post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				votes_to_skip: state.votesToSkip,
				guest_can_pause: state.guestCanPause,
			}),
		};
		fetch('/api/create-room/', requestOptions)
			.then((response) => response.json())
			.then((data) => navigate('/room/' + data.code));
	}


	const renderCreateButtons = () => {
		return <> <Grid item xs={12} align="center">
			<Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>
				Create A Room
			</Button>
		</Grid>
			<Grid item xs={12} align="center">
				<Button color="secondary" variant="contained" to="/" component={Link}>
					Back
				</Button>
			</Grid>
		</>
	}

	const handleUpdateButtonPressed = () => {
		const requestOptions = {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				guest_can_pause: state.guestCanPause,
				votes_to_skip: state.votesToSkip,
				code: roomCode,
			})
		}
		fetch("/api/update-room/", requestOptions)
			.then((response) => {
				if (response.ok) {
					setState({
						...state,
						successMsg: "Room updated successfully !",
					});
				}
				else {
					setState({
						...state,
						successMsg: "Error while updating room",
					});
				}
				updateCallback();
			})
	}

	const renderUpdateButtons = () => {
		return <Grid item xs={12} align="center">
			<Button color="primary" variant="contained" onClick={handleUpdateButtonPressed}>
				Update Room
			</Button>
		</Grid>
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
					{update === true ? "Update Room" : "Create A Room"}
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<FormControl component="fieldset">
					<FormHelperText component="div">
						<div align="center">Guest Control of Playback State</div>
					</FormHelperText>
					<RadioGroup row defaultValue={guestCanPause === false ? "false" : "true"} onChange={handleGuestCanPauseChange}>
						<FormControlLabel
							value="true"
							control={<Radio color="primary" />}
							label="Play/Pause"
							labelPlacement="bottom"
						/>
						<FormControlLabel
							value="false"
							control={<Radio color="secondary" />}
							label="No Control"
							labelPlacement="bottom"
						/>
					</RadioGroup>
				</FormControl>
			</Grid>
			<Grid item xs={12} align="center">
				<FormControl>
					<TextField
						required={true}
						type="number"
						defaultValue={state.votesToSkip}
						inputProps={{
							min: 1,
							style: { textAlign: "center" },
						}}
						onChange={handleVotesChange}
					/>
					<FormHelperText component="div">
						<div align="center">Votes Required to Skip Song</div>
					</FormHelperText>
				</FormControl>
			</Grid>
			{update === true ? renderUpdateButtons() : renderCreateButtons()}
		</Grid>

	);
}

export default CreateRoomPage;