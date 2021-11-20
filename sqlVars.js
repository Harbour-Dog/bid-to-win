const express = require('express');

const createBaseTable = "CREATE TABLE user_stats (" +
                            "`ID` int(11) NOT NULL AUTO_INCREMENT," +
                            "`Username` varchar(45) NOT NULL," +
                            "`GP` int(11) NOT NULL," +
                            "`Wins` int(11) NOT NULL," +
                            "`Losses` int(11) NOT NULL," +
                            "`Ties` int(11) NOT NULL," +
                            "`Abandons` int(11) NOT NULL," +
                            "`WinPerc` int(11) NOT NULL," +
                            "`Password` varchar(45) NOT NULL," +
                            "PRIMARY KEY (`ID`)," +
                            "UNIQUE KEY `ID_UNIQUE` (`ID`)," +
                            "UNIQUE KEY `Username_UNIQUE` (`Username`)" +
                            ") ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;";
const createTable = "CREATE TABLE test_stats (" +
                        "`ID` int(11) NOT NULL AUTO_INCREMENT," +
                        "`Username` varchar(45) NOT NULL," +
                        "`GP` int(11) NOT NULL," +
                        "`Wins` int(11) NOT NULL," +
                        "`Losses` int(11) NOT NULL," +
                        "`Ties` int(11) NOT NULL," +
                        "`Abandons` int(11) NOT NULL," +
                        "`WinPerc` int(11) NOT NULL," +
                        "`Password` varchar(45) NOT NULL," +
                        "PRIMARY KEY (`ID`)," +
                        "UNIQUE KEY `ID_UNIQUE` (`ID`)," +
                        "UNIQUE KEY `Username_UNIQUE` (`Username`)" +
                        ") ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;";
const renameOrgTable = "RENAME TABLE user_stats TO user_stats_original;";
const renameTestTable = "RENAME TABLE test_stats TO user_stats;";
const dropTable = 'DROP TABLE user_stats;';
const resetDB = 'RENAME TABLE user_stats_original TO user_stats;';

module.exports = {createBaseTable, createTable, renameOrgTable, renameTestTable, dropTable, resetDB};