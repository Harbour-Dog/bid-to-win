const express = require("express");
const router = express.Router();
router.use(express.json());
const mysql = require('mysql2');
require('dotenv').config();

const fetch = (req, res, next) => {
    let db = mysql.createPool({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });

    let sql = 'SELECT * FROM gauntlet_stats WHERE Username=?';
    db.query(sql, req.body.Username, (err, result) => {
        if(result.length == 0){
            res.status(400).json({data: [{msg: 'No gauntlet data recorded for current user'}]});
            db.end();
        } else {
            res.status(200).json({Success: true, data: result});
            db.end();
        }
    })
}

const create = (req, res, next) => {
    let db = mysql.createPool({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });

    let sql = 'INSERT INTO gauntlet_stats (Username, Wins, Losses, AvgWins, Abandons)' + 
        'VALUES (?, 0, 0, 0, 0)';
    db.query(sql, req.body.Username, (err, result) => {
        if (err){
            res.status(400).json({data: [{msg: "Gauntlet data for current user already exists"}]});
            db.end();
        } else {
            res.status(200).json({Success: true});
            db.end();
        }
    })
}

const record = (req, res, next) => {
    let db = mysql.createPool({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });

    let sql = 'UPDATE gauntlet_stats SET Wins=?, Losses=?, AvgWins=?, Abandons=Abandons-1 WHERE Username=?'
    db.query(sql, [req.body.Wins, req.body.Losses, req.body.AvgWins, req.body.Username], (err, result) => {
        if(err){
            res.status(400).json({data: [{msg: "No log in detected"}]});
            db.end();
        } else {
            res.status(200).json({Success: true});
            db.end();
        }
    })
}

const gameLog = (req, res, next) => {
    let db = mysql.createPool({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });

    let sql = 'INSERT INTO gauntlet_runs (Username, Wins)' + 
    'VALUES (?, ?)';
    db.query(sql, [req.body.Username, req.body.Record], (err, result) => {
        if (err){
            res.status(400).json({data: [{msg: "Game log not saved"}]});
            db.end();
        } else {
            res.status(200).json({Success: true});
            db.end();
        }
    })
}

module.exports = {fetch, create, record, gameLog};