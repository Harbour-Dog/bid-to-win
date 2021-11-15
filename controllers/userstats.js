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

// @description     Fetches User's rank in the database for GP
// @route           user_stats/1.0.0/gprank/:Username
// @access          Private
const gpRank = (req, res, next) => {
    let sql = 'SELECT * FROM (SELECT Username, GP, @gprank := @gprank + 1 AS row_num FROM user_stats p, (SELECT @gprank := 0) r ORDER BY GP DESC) AS tempgp WHERE Username=?';
    db.query(sql, req.query.Username, (err, rows) => {
        if(rows.length == 0) {
            return res.status(400).json({data: [{msg: "No login detected."}]});
        } else {
            return res.status(200).json({Success: true, data: rows});
        }        
    });    
}

// @description     Fetches User's rank in the database for Wins
// @route           user_stats/1.0.0/winsrank/:Username
// @access          Private
const winsRank = (req, res, next) => {
    let sql = 'SELECT * FROM (SELECT Username, Wins, @winsrank := @winsrank + 1 AS row_num FROM user_stats p, (SELECT @winsrank := 0) r ORDER BY Wins DESC) AS tempwins WHERE Username=?';
    db.query(sql, req.query.Username, (err, rows) => {
        if(rows.length == 0) {
            return res.status(400).json({data: [{msg: "No login detected."}]});
        } else {
            return res.status(200).json({Success: true, data: rows});
        }
    });    
}

// @description     Fetches User's rank in the database for Win Percentage
// @route           user_stats/1.0.0/winperrank/:Username
// @access          Private
const winPercRank = (req, res, next) => {
    let sql = 'SELECT * FROM (SELECT Username, WinPerc, @winperrank := @winperrank + 1 AS row_num FROM user_stats p, (SELECT @winperrank := 0) r ORDER BY WinPerc DESC) AS tempwinper WHERE Username=?';
    db.query(sql, req.query.Username, (err, rows) => {
        if(rows.length == 0) {
            return res.status(400).json({data: [{msg: "No login detected."}]});
        } else {
            return res.status(200).json({Success: true, data: rows});
        }
    });    
}

// @description     Fetches the top 10 rows from the winperc_rank table in the database
// @route           user_stats/1.0.0/leaderboard
// @access          Public
const leaderboard = (req, res, next) => {
    let sql = 'SELECT * FROM user_stats ORDER BY WinPerc DESC, GP DESC'
    db.query(sql, (err, rows) => {
        if(rows.length == undefined) {
            res.status(400).json({data: [{msg: 'Not connected to database.'}]})
        } else {
            res.status(200).json({Success: true, data: rows});
        }
    });
}

module.exports = {gpRank, winsRank, winPercRank, leaderboard};