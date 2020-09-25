'use strict';

var express = require("express");
var router = express.Router();
const formidable = require('formidable');
var isLoggedIn = require("./custom_modules/isLoggedIn.js");
var connection = require("./custom_modules/connection.js");
var queries = require("./custom_modules/queries.js");
var mustEmp = require("./custom_modules/mustEmp.js");
var upload = require("./custom_modules/upload.js");



router.get('/upload', isLoggedIn, mustEmp, function(req, res){
    connection.query(queries.stores + queries.userName, req.user.username, function(err, rows, fields){
        res.render('upload', {
            user : req.user,
            rows : rows[0],
            profile : rows[1][0]
        });
	});
});



router.get('/upload2', isLoggedIn, mustEmp, function(req, res){
    connection.query(queries.stores + queries.userName, req.user.username, function(err, rows, fields){
        res.render('upload2', {
            user : req.user,
            rows : rows[0],
            profile : rows[1][0]
        });
    });
});


router.post('/upload', function (req, res){
	var form = new formidable.IncomingForm();
	form.parse(req);
	form.on('fileBegin', function (name, file){
		file.path = './uploads/usa.csv';
	});
	form.on('file', function (name, file){
		console.log('Uploaded ' + file.name);
    });
    res.redirect('upload2');
});

router.post('/upload2', function (req, res) {
	var form = new formidable.IncomingForm();
	form.parse(req);
	form.on('fileBegin', function (name, file){
		file.path = './uploads/uk.csv';
	})
	form.on('file', function (name, file){
		console.log('Uploaded ' + file.name);
    });
    upload("productsusa", "./uploads/usa.csv");
    upload("productsuk", "./uploads/uk.csv");
    res.redirect('inventory'); 
});

module.exports = router;
