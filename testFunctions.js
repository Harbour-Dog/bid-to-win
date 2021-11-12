const express = require('express');
const mysql = require('mysql');
const app = require('./apptest.js');
const sqlVar = require('./sqlVars.js');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

//our generic query that we can map with an array of required queries for testing//
const queryDatabase = (query) => new Promise ((resolve, reject) => {
    console.log([process.env.MYSQL_HOST, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, process.env.MYSQL_DATABASE]);
    db.query(query, (err, res) => {
        if (err){
            reject(err)
        } else {
            resolve(res);
        }
    })
})

async function setup(addUsers){ 
    await Promise.all([sqlVar.createTable, addUsers, sqlVar.renameOrgTable, sqlVar.renameTestTable].map(queryDatabase));
}

async function breakdown(){
    await Promise.all([sqlVar.dropTable, sqlVar.resetDB].map(queryDatabase));
    db.end();
}

module.exports = {setup, breakdown};