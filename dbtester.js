const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const mysql = require('mysql');
const sqlVar = require('./sqlVars.js');

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

const queryDatabase = (query) => new Promise ((resolve, reject) => {
    console.log(sqlVars.createTable);
    db.query(query, (err, res) => {
        if (err){
            reject(err)
        } else {
            resolve(res);
        }
    })
})

async function stuff(addUsers){ 
    await Promise.all([sqlVar.createTable, addUsers, sqlVar.renameOrgTable, sqlVar.renameTestTable].map(queryDatabase));
}