const express = require('express');
const mysql = require('mysql');
const app = require('./apptest.js');
const sqlVar = require('./sqlVars.js');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

//our generic query that we can map with an array of required queries for testing//
const queryDatabase = (query) => new Promise ((resolve, reject) => {
    db.query(query, (err, res) => {
        if (err){
            reject(err)
        } else {
            resolve(res);
        }
    })
})

async function setup(addUsers){ 
    await Promise.all([sqlVar.createTable, addUsers, sqlVar.renameTable].map(queryDatabase));
}

async function breakdown(){
    await Promise.all([sqlVar.dropTable, sqlVar.resetDB].map(queryDatabase));
    db.end();
}

module.exports = {setup, breakdown};