const express = require('express');

require('dotenv').config();
const app = express();
const router = express.Router();
router.use(express.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

const user = require('./routes/user.js');
const userstats = require('./routes/userstats.js');
app.use('/user', user);
app.use('/userstats', userstats);
//app.use('/gauntlet', gauntlet)

module.exports = app;