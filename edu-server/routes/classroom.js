var express = require('express');
var query = require('../util/dbHelper.js');
var httpResult = require('../config').httpResult;

var router = express.Router();

router.get('/all', function(req, res, next) {
	var sql = 'SELECT * FROM `dt_classroom`;';
	res.flag = query(sql, [])
		.then(results => httpResult.success(results));
	next();
});

router.post('/add', function(req, res, next) {
	var { clsr_name } = req.body;
	var sql = 'insert `dt_classroom`(`clsr_name`) values(?);';
	res.flag = query(sql, [ clsr_name ])
		.then(results => httpResult.success(results.insertId));
	next();
});

router.post('/update', function(req, res, next) {
	var { clsr_id, clsr_name } = req.body;
	var sql = 'update `dt_classroom` set `clsr_name` = ? where `clsr_id` = ?;';
	res.flag = query(sql, [ clsr_name, clsr_id ])
		.then(results => httpResult.success());
	next();
});

router.get('/remove/:clsr_id', function(req, res, next) {
	var clsr_id = parseInt(req.params.clsr_id);
	var sql = 'delete from `dt_classroom` where `clsr_id` = ?;';
	res.flag = query(sql, [ clsr_id ]).then(() => httpResult.success());
	next();
});

module.exports = router;