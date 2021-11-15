const express = require('express');

require('dotenv').config();
const app = express();
const router = express.Router();
router.use(express.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

const user = require('./routes/user.js');
const userstats = require('./routes/userstats.js');
app.use('/user', user);
app.use('/userstats', userstats);

module.exports = app;