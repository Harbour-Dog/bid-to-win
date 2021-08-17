const express = require("express");
const router = express.Router();
router.use(express.json());
const mysql = require('mysql');

const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

//Fetches user object from database. To run on login.//
router.get('/1.0.0/:Username/:Password', (req, res) => {
    let sql = 'SELECT * FROM leaderboard.user_stats WHERE Username=? AND Password=?';
    db.query(sql, [req.query.Username, req.query.Password], (err, rows) => {
        if(err) {throw err;
        } else {    
        console.log('User is logged in.');//how can I make this log conditional?//
        res.json(rows);
        }
    });    
});

//Adds new user to database//
router.post('/create/1.0.0', (req, res) => {
    let sql = 'INSERT INTO leaderboard.user_stats (Username, GP, Wins, Losses, Ties, Abandons, WinPerc, Password)' +
                'VALUES (?, 0, 0, 0, 0, 0, 0, ?)';
    db.query(sql, [req.body.Username, req.body.Password], (err, result) => {
        if(err) {throw err;
        } else {
        console.log(`New user created: ${req.body.Username}`);
        res.send(result);
        }
    });
});

//Increases user's GP and Abandons by 1. To run at start of game.//
router.put('/game_started/1.0.0', (req, res) => {
    let sql = 'UPDATE leaderboard.user_stats SET GP=GP+1, Abandons=Abandons+1 WHERE Username=?';
    db.query(sql, req.body.Username, (err, result) => {
        if(err) {throw err;
        } else {
        console.log("Game started");
        res.send(result);
        }
    });
});

//Increases users Wins by 1 and decreases Abandons by 1. To run after win//
router.put('/win/1.0.0', (req, res) => {
    let sql = 'UPDATE leaderboard.user_stats SET Wins=Wins+1, Abandons=Abandons-1, WinPerc=? WHERE Username=?';
    db.query(sql, [req.body.WinPerc, req.body.Username], (err, result) => {
        if(err) {throw err;
        } else {
        console.log("User won");
        res.send(result);
        }
    });
});

//Increases users Losses by 1 and decreases Abandons by 1. To run after loss//
router.put('/loss/1.0.0', (req, res) => {
    let sql = 'UPDATE leaderboard.user_stats SET Losses=Losses+1, Abandons=Abandons-1, WinPerc=? WHERE Username=?';
    db.query(sql, [req.body.WinPerc, req.body.Username], (err, result) => {
        if(err) {throw err;
        } else {
        console.log("User lost");
        res.send(result);
        }
    });
});

//Increases users Ties by 1 and decreases Abandons by 1. To run after tie//
router.put('/tie/1.0.0', (req, res) => {
    let sql = 'UPDATE leaderboard.user_stats SET Ties=Ties+1, Abandons=Abandons-1, WinPerc=? WHERE Username=?';
    db.query(sql, [req.body.WinPerc, req.body.Username], (err, result) => {
        if(err) {throw err;
        } else {
        console.log("User tied");
        res.send(result);
        }
    });
});

module.exports = router;