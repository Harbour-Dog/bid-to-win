const express = require('express');

require('dotenv').config();
const app = express();
const router = express.Router();
router.use(express.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME
});

const user = require('./routes/user.js');
const userstats = require('./routes/userstats.js');
const gauntlet = require('./routes/gauntlet.js');
app.use('/user', user);
app.use('/userstats', userstats);
app.use('/gauntlet', gauntlet)

module.exports = app;