const express = require('express');
const app = require('./apptest.js');
const mysql = require('mysql');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
app.use(express.json());
app.use(cors());
const passport = require('passport');
const session = require('express-session');
const LocalStrat = require('passport-local').Strategy;
const {check , validationResult} = require('express-validator');

app.use(express.urlencoded({extended: true}));
app.use(express.static('./'));
app.use(morgan('dev'));

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
}));

app.use(passport.initialize());
app.use(passport.session());

//routes handlers
const userstats = require('./routes/userstats.js');
const user = require('./routes/user.js');
app.use('/user_stats', userstats); //deals with fetching user and leaderboard stats for display
app.use('/user', user); //deals with logging in and updating user stats during games
console.log('in '+app.settings.env+' mode');

app.listen(process.env.PORT || 31801, () => {
    console.log('Listening on Port '+ process.env.PORT);
});

//Removes user from database. NOT YET IMPLEMENTED//
app.delete('/1.0.0/delete_user', (req, res) => {
    let sql = 'DELETE FROM user_stats WHERE ID=?'
    db.query (sql, req.body.ID, (err, result) => {
        if(err) {throw err;
        } else {
        console.log('Deleted user');
        res.send(result);
        }
    });
});