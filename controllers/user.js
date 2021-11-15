const express = require("express");
const router = express.Router();
router.use(express.json());
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// @description     User login and retrieve stats from database
// @route           /user/1.0.0/:Username/:Password
// @access          Private
const login = (req, res, next) => {
    let sql1 = 'SELECT * FROM user_stats WHERE Username=? AND Password=?';
    let sql2 = 'SELECT * FROM user_stats WHERE Username=?';
    db.query(sql2, req.query.Username, (err, result) => {
        if(result.length == 0){
            return res.status(400).json({data: [{msg: "Username doesn't exist"}]});
        } else {
            db.query(sql1, [req.query.Username, req.query.Password], (err, result) => {
                if(result.length == 0){
                    return res.status(400).json({data: [{msg: "Username and password do not match"}]});
                } else {    
                    return res.status(200).json({Success: true, data: result});
                }
            });
        }
    })
}

// @description     Create new user in database and login as that user
// @route           /user/1.0.0/create
// @access          Private
const create = (req, res, next) => {
    let sql = 'INSERT INTO user_stats (Username, GP, Wins, Losses, Ties, Abandons, WinPerc, Password)' + 
        'VALUES (?, 0, 0, 0, 0, 0, 0, ?)';
    db.query(sql, [req.body.Username, req.body.Password], (err, result) => {
        if(err) {
            return res.status(400).json({data: [{msg: "Username already exists"}]});
        } else {
            res.status(200).json({Success: true});
        }
    });
}

// @description     +1 GP, +1 Abandon, in database
// @route           user/1.0.0/game_started
// @access          Public
const gameStart = (req, res, next) => {
    let sql1 = 'SELECT * FROM user_stats WHERE Username=?';
    let sql2 = 'UPDATE user_stats SET GP=GP+1, Abandons=Abandons+1 WHERE Username=?';
    db.query(sql1, req.body.Username, (err, result) => {
        if(result.length == 0){
            return res.status(400).json({data: [{msg: "No login detected."}]});
        } else {
            db.query(sql2, req.body.Username, (err, result) => {
                if(err) {
                    return res.status(400).json({data: [{msg: "No login detected."}]});
                } else {
                    res.status(200).json({Success: true});
                }
            })
        }
    })
}

// @description     +1 Win, -1 Abandon, in database
// @route           user/1.0.0/win
// @access          Public
const win = (req, res, next) => {
    let sql1 = 'SELECT * FROM user_stats WHERE Username=?';
    let sql2 = 'UPDATE user_stats SET Wins=Wins+1, Abandons=Abandons-1, WinPerc=? WHERE Username=?';
    db.query(sql1, req.body.Username, (err, result) => {
        if(result.length == 0){
            return res.status(400).json({data: [{msg: "No login detected."}]});
        } else {
            db.query(sql2, [req.body.WinPerc, req.body.Username], (err, result) => {
                if(err) {
                    return res.status(400).json({data: [{msg: "No login detected."}]});
                } else {
                    res.status(200).json({Success: true});
                }
            })
        }
    })
}

// @description     +1 Loss, -1 Abandon, in database
// @route           user/1.0.0/loss
// @access          Public
const loss = (req, res, next) => {
    let sql1 = 'SELECT * FROM user_stats WHERE Username=?';
    let sql2 = 'UPDATE user_stats SET Losses=Losses+1, Abandons=Abandons-1, WinPerc=? WHERE Username=?';
    db.query(sql1, req.body.Username, (err, result) => {
        if(result.length == 0){
            return res.status(400).json({data: [{msg: "No login detected."}]});
        } else {
            db.query(sql2, [req.body.WinPerc, req.body.Username], (err, result) => {
                if(err) {
                    return res.status(400).json({data: [{msg: "No login detected."}]});
                } else {
                    res.status(200).json({Success: true});
                }
            })
        }
    })
}

// @description     +1 Tie, -1 Abandon, in database
// @route           user/1.0.0/tie
// @access          Public
const tie = (req, res, next) => {
    let sql1 = 'SELECT * FROM user_stats WHERE Username=?';
    let sql2 = 'UPDATE user_stats SET Ties=Ties+1, Abandons=Abandons-1, WinPerc=? WHERE Username=?';
    db.query(sql1, req.body.Username, (err, result) => {
        if(result.length == 0){
            return res.status(400).json({data: [{msg: "No login detected."}]});
        } else {
            db.query(sql2, [req.body.WinPerc, req.body.Username], (err, result) => {
                if(err) {
                    return res.status(400).json({data: [{msg: "No login detected."}]});
                } else {
                    res.status(200).json({Success: true});
                }
            })
        }
    })
}

module.exports = {login, create, gameStart, win, loss, tie}