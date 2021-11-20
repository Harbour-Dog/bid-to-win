const express = require('express');
const mysql = require('mysql2');
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
    db.query(query, (err, res) => {
        if (err){
            reject(err)
        } else {
            resolve(res);
        }
    })
})

async function setup(addUsers){ 
    if (process.env.MYSQL_DATABASE === 'testdb'){
        await Promise.all([sqlVar.createBaseTable, sqlVar.createTable, addUsers, sqlVar.renameOrgTable, sqlVar.renameTestTable].map(queryDatabase));
    } else {
        await Promise.all([sqlVar.createTable, addUsers, sqlVar.renameOrgTable, sqlVar.renameTestTable].map(queryDatabase));
    }    
}

async function breakdown(){
    await Promise.all([sqlVar.dropTable, sqlVar.resetDB].map(queryDatabase));
    db.end();
}

module.exports = {setup, breakdown};