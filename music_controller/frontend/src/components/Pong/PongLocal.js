import React, { useState, useEffect, useRef } from 'react';

const PongLocal = () => {
	const initialBallState = { x: 300, y: 200, speedX: 5, speedY: 5 };
	const initialPaddleState = { left: 150, right: 150 };
	const [ball, setBall] = useState(initialBallState);
	const [paddles, setPaddles] = useState(initialPaddleState);
	const [gameOver, setGameOver] = useState(false);
	const [gameRunning, setGameRunning] = useState(false);
	const ballRef = useRef(null);

	useEffect(() => {
		if (gameRunning) {
			const handleKeyPress = (e) => {
				switch (e.key) {
					case 'ArrowUp':
						setPaddles((prev) => ({ ...prev, left: Math.max(prev.left - 10, 0) }));
						break;
					case 'ArrowDown':
						setPaddles((prev) => ({ ...prev, left: Math.min(prev.left + 10, 300) }));
						break;
					default:
						break;
				}
			};

			const updateGame = () => {
				setBall((prevBall) => ({
					...prevBall,
					x: prevBall.x + prevBall.speedX,
					y: prevBall.y + prevBall.speedY,
				}));

				const ballRect = ballRef.current.getBoundingClientRect();
				const paddleLeftRect = document.getElementById('paddle-left').getBoundingClientRect();
				const paddleRightRect = document.getElementById('paddle-right').getBoundingClientRect();

				// Check for collisions with paddles
				if (
					(ball.x <= 10 &&
						ball.x >= 0 &&
						ball.y <= paddles.left + 90 &&
						ball.y >= paddles.left - 10) ||
					(ball.x >= 570 &&
						ball.x < 590 &&
						ball.y <= paddles.right + 90 &&
						ball.y >= paddles.right - 10)
				) {
					setBall((prevBall) => ({ ...prevBall, speedX: -prevBall.speedX, x: prevBall.x - (ballRect.right - ballRect.left) * 2 * Math.sign(prevBall.speedX) }));
				}

				// Check for collisions with top and bottom walls
				if (ball.y <= 0 || ball.y >= 400) {
					setBall((prevBall) => ({ ...prevBall, speedY: -prevBall.speedY, y: prevBall.y - (ballRect.bottom - ballRect.top) * 2 * Math.sign(prevBall.speedY) }));
				}

				//Powerfull AI for the right paddle
				if (ball.speedX > 0) {
					if (ball.y > paddles.right + 90) {
						setPaddles((prev) => ({ ...prev, right: Math.min(prev.right + 10, 300) }));
					} else if (ball.y < paddles.right - 10) {
						setPaddles((prev) => ({ ...prev, right: Math.max(prev.right - 10, 0) }));
					}
				} else {
					if (paddleRightRect.y > 150) {
						setPaddles((prev) => ({ ...prev, right: Math.max(prev.right - 10, 150) }));
					} else if (paddleRightRect.y < 150) {
						setPaddles((prev) => ({ ...prev, right: Math.min(prev.right + 10, 150) }));
					}
				}
				// Check for game over
				if (ball.x < 0 || ball.x > 600) {
					setGameOver(true);
					pauseGame();
				}
			};
			const intervalId = setInterval(updateGame, 50);

			window.addEventListener('keydown', handleKeyPress);

			return () => {
				clearInterval(intervalId);
				window.removeEventListener('keydown', handleKeyPress);
			};
		}
	}, [gameRunning, ball]);

	const startGame = () => {
		setGameRunning(true);
	};

	const restartGame = () => {
		setBall(initialBallState);
		setPaddles(initialPaddleState);
		setGameOver(false);
	};

	const pauseGame = () => {
		setGameRunning(false);
	};

	return (<>
		<p>Ball x : {ball.x}</p>
		<p>paddle right y : {paddles.right}</p>
		<p>paddle left y : {paddles.left}</p>
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
			<div className="controls">
				<button onClick={startGame}>Start</button>
				<button onClick={restartGame}>Restart</button>
				<button onClick={pauseGame}>Pause</button>
			</div>
			{gameOver && <div className="game-over">Game Over</div>}
		</div>
	</>
	);
};
export default PongLocal;