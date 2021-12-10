const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));
//const {check , validationResult} = require('express-validator');
//const passport = require('passport');
//router.use(passport.initialize());
//router.use(passport.session());
const gauntletController = require('../controllers/gauntlet.js');

router.get('/1.0.0/:Username', gauntletController.fetch);
router.post('/1.0.0/create', gauntletController.create);
router.post('/1.0.0/log', gauntletController.gameLog);
router.put('1.0.0/record', gauntletController.record);
router.put('1.0.0/start', gauntletController.start);
router.delete('/1.0.0/temp/clear', gauntletController.tempClear);
router.post('/1.0.0/temp/setup', gauntletController.setup);
router.put('/1.0.0/temp/record', gauntletController.tempRecord);
router.post('1.0.0/runs', gauntletController.runs);