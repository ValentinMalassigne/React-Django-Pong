import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";

const Pong = () => {
	const params = useParams();
	const initialBallState = { x: 290, y: 190, speedX: 5, speedY: 5 };
	const initialPaddleState = { left: 150, right: 150 };
	const playerCount = 1;
	const [ball, setBall] = useState(initialBallState);
	const [paddles, setPaddles] = useState(initialPaddleState);
	const [gameOver, setGameOver] = useState(false);
	const [gameRunning, setGameRunning] = useState(false);
	const ballRef = useRef(null);
	const socketRef = useRef(null);

	useEffect(() => {
		socketRef.current = new WebSocket('ws://localhost:8000/ws/pong/' + params.roomCode + '/');

		socketRef.current.onopen = () => {
			// socketRef.current.send(JSON.stringify({ type: 'start_game' }));
		};

		socketRef.current.onerror = (error) => {
			console.error('WebSocket error', error);
		}

		return () => {
		};
	}, []);

	useEffect(() => {
		const handleKeyPress = (e) => {
			switch (e.key) {
				case 'ArrowUp':
					socketRef.current.send(JSON.stringify({ type: 'update_paddle', side: "left", direction: "up" }));
					setPaddles({ ...paddles, left: paddles.left - 10 });
					break;
				case 'ArrowDown':
					socketRef.current.send(JSON.stringify({ type: 'update_paddle', side: "left", direction: "down" }));
					setPaddles({ ...paddles, left: paddles.left + 10 });
					break;
				default:
					break;
			}
			if (playerCount === 2) {
				switch (e.key) {
					case 'u':
						socketRef.current.send(JSON.stringify({ type: 'update_paddle', side: "right", direction: "up" }));
						setPaddles({ ...paddles, right: paddles.right - 10 });
						break;
					case 'd':
						socketRef.current.send(JSON.stringify({ type: 'update_paddle', side: "right", direction: "down" }));
						setPaddles({ ...paddles, right: paddles.right + 10 });
						break;
					default:
						break;
				}
			}

		};

		//très import qu'il soit dans un useEffect qui dépend de paddles
		socketRef.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'game_state') {
				const { x, y } = data.ball_position;
				// const leftPaddle = data.left_paddle_position;
				const rightPaddle = data.right_paddle_position;
				setBall({ x, y });
				setPaddles({ ...paddles, right: rightPaddle });
			} else if (data.type === 'game_over') {
				setGameRunning(false);
				setGameOver(true);
				setBall(initialBallState);
				setPaddles(initialPaddleState);
			}
			else {
				console.log('Unknown message type', data.type);
			}
		};

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [paddles, socketRef]);

	const startGame = () => {
		if (!gameRunning) {
			socketRef.current.send(JSON.stringify({ type: 'start_game', nb_players: playerCount }));
			setGameRunning(true);
			setGameOver(false);
		}

	};

	const restartGame = () => {
		setBall(initialBallState);
		setPaddles(initialPaddleState);
		setGameOver(false);
		setGameRunning(true);
		socketRef.current.send(JSON.stringify({ type: 'restart', nb_players: playerCount }));

	};

	const pauseGame = () => {
		socketRef.current.send(JSON.stringify({ type: 'pause' }));

	};

	return (<>
		<p>Ball x : {ball.x}</p>
		<p>paddle right y : {paddles.right}</p>
		<p>paddle left y : {paddles.left}</p>
		<div className="controls">
			<button onClick={startGame}>Start</button>
			<button onClick={restartGame}>Restart</button>
			<button onClick={pauseGame}>Pause</button>
		</div>
		<div className="ping-pong-container" tabIndex="0">
			<div
				className={`paddle paddle-left ${gameRunning ? '' : 'paused'}`}
				id="paddle-left"
				style={{ top: `${paddles.left}px` }}
			/>
			<div
				className={`paddle paddle-right ${gameRunning ? '' : 'paused'}`}
				id="paddle-right"
				style={{ top: `${paddles.right}px`, left: '580px' }}
			/>
			<div
				className={`ball ${gameRunning ? '' : 'paused'}`}
				ref={ballRef}
				style={{ top: `${ball.y}px`, left: `${ball.x}px` }}
			/>
			{gameOver && <div className="game-over">Game Over</div>}
		</div>
	</>
	);
};
export default Pong;