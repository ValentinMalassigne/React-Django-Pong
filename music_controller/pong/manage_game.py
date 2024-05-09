import random
import asyncio
import json

# Faire une partie autonome avec 2 bots
    # Concidérer que le x et y de la balle sont le haut gauche de la balle, et donc tapper les murs bas et droit à BALL_DIAMETER de distance
    # le y du paddle est le haut du paddle
async def game_loop(self, event):
        MAP_HEIGHT = 400
        MAP_WIDTH = 600
        BALL_DIAMETER = 20
        BALL_SPEED = 5
        PADDLE_HEIGHT = 100
        TPS = 10
        TICKS_BEFORE_SEND = 5

        ticks_counter = 0

        ball_direction = {"x": random.choice([-1, 1]), "y": random.choice([-1, 1])}
        ball_position = {"x": 290.0, "y": 190.0}
        right_paddle_position = 150
        left_paddle_position = 150
        self.pause = False

        while True:
            while self.pause:
                await asyncio.sleep(1)
        
            if self.restart:
                self.restart = False
                break
        
            # Ball movement
            ball_position["x"] += (ball_direction["x"] * BALL_SPEED)
            ball_position["y"] += (ball_direction["y"] * BALL_SPEED)

            # Wall collisions
            if ball_position["y"] <= 0 or ball_position["y"] >= MAP_HEIGHT - BALL_DIAMETER:
                ball_direction["y"] = -ball_direction["y"]

            # Paddle collisions
            if ball_position["x"] <= 20 and ball_position["x"] >= 0 and ball_position["y"] <= left_paddle_position + 100 and ball_position["y"] >= left_paddle_position:
                ball_direction["x"] = -ball_direction["x"]
            elif ball_position["x"] >= 580 and ball_position["x"] < 600 and ball_position["y"] <= right_paddle_position + 100 and ball_position["y"] >= right_paddle_position:
                ball_direction["x"] = -ball_direction["x"]
            
            # End of game
            if ball_position["x"] <= 0 or ball_position["x"] >= MAP_WIDTH:
                await self.send(text_data=json.dumps({"type":"game_over"}))
                break
            
            if event["nb_players"] == 1 :
                # right paddle AI
                if  ball_direction["x"] > 0 and ball_position["x"] > 300 :
                    if ball_position["y"] > right_paddle_position + PADDLE_HEIGHT - 20:
                        right_paddle_position += 10
                    elif ball_position["y"] < right_paddle_position - 20:
                        right_paddle_position -= 10
                else:
                    if right_paddle_position > 150:
                        right_paddle_position -= 10
                    elif right_paddle_position < 150:
                        right_paddle_position += 10
            
            # update paddles from users messages
            left_paddle_position = self.left_paddle_position
            if event["nb_players"] == 2 :
                right_paddle_position = self.right_paddle_position
            
            ticks_counter += 1
            if ticks_counter == TICKS_BEFORE_SEND:
                await self.channel_layer.group_send(
                    self.room_group_name, {"type": "send_message", "message":  {"type":"game_state","ball_position": ball_position, "right_paddle_position": right_paddle_position, "left_paddle_position": left_paddle_position}}
                )
            ticks_counter %= TICKS_BEFORE_SEND
            await asyncio.sleep(1/TPS)