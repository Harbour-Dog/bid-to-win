# bid-to-win
____________________________________________________________
DESCRIPTION

A simple strategy bidding game where users can create accounts and have their stats saved.<br><br>
Check it out here! https://bid-to-win.herokuapp.com/
_____________________________________________________________
BUILT WITH

HTML<br>
CSS<br>
JS<br>
NODE JS<br>
Express<br>
Jest<br>
Supertest<br>
YAML<br>
Heroku<br>
_____________________________________________________________
WHAT WAS MY MOTIVATION IN BUILDING THIS APP?

I am very fond of strategy card games, and so I decided that for my second app I would build an approximation of that. This was the result! Simple, fun, and addictive.
_____________________________________________________________
GAMEPLAY

At the beginning of each round, two randomly generated tricks (between 1 and 10) are displayed for the players to bid on. The buttons labelled 1-10 are there for the players to use to bid, but once a button has been utilized, it isn't available for the rest of the game.

The player with the highest bid on a particular trick wins that many points, and the
player with the most points at the end of a game, wins! Each game lasts five rounds.
_____________________________________________________________
PLAY VS. COMP GAME MODE 

In this game mode you play as the Blue Player, against the computer. After committing your selections each round, the computer's bids are revealed and points are assigned normally. This is currently the only mode that records user's stats in the database.
_____________________________________________________________
2-PLAYER GAME 

This game mode is meant to be played by two players using the same device. The Blue Player makes their selections while the Red Player looks away. After the Blue Player commits, their bids are then hidden until both have committed.<br><br>
The next addition to the game will use WebSocket to allow for remote play!
_____________________________________________________________
