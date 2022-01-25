const express = require('express');
const mysql = require('mysql2');
// const app = require('./apptest.js');
const sqlVar = require('./sqlVars.js');
require('dotenv').config();
// const db = app.db;

const db = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME
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
    if (process.env.RDS_DB_NAME === 'testdb'){
        await Promise.all([sqlVar.createBaseTable, sqlVar.createTable, addUsers, sqlVar.renameOrgTable, sqlVar.renameTestTable].map(queryDatabase));
    } else {
        await Promise.all([sqlVar.createTable, addUsers, sqlVar.renameOrgTable, sqlVar.renameTestTable].map(queryDatabase));
    }    
}

async function breakdown(){
    if (process.env.RDS_DB_NAME === 'testdb'){
        await Promise.all([sqlVar.dropBaseTable, sqlVar.dropTable].map(queryDatabase));
        db.end();
    } else {
        await Promise.all([sqlVar.dropTable, sqlVar.resetDB].map(queryDatabase));
        db.end();
    }
}

// async function dbEnd(){
//     await db.end();
// }

module.exports = {setup, breakdown};