const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));
//const {check , validationResult} = require('express-validator');
//const passport = require('passport');
//router.use(passport.initialize());
//router.use(passport.session());
const gauntletController = require('../controllers/gauntlet.js');

router.get('/1.0.0', gauntletController.fetch);
router.post('/1.0.0/create', gauntletController.create);
router.post('/1.0.0/log', gauntletController.gameLog);
router.put('1.0.0/record', gauntletController.record);
router.put('1.0.0/gaunlet_start', gauntletController.start);
router.put('/1.0.0/gauntlet_temp', gauntletController.temp);