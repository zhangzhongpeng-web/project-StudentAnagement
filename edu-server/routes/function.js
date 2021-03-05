var express = require('express');
var query = require('../util/dbHelper.js');
var httpResult = require('../config').httpResult;

var router = express.Router();

router.get('/all', function(req, res, next) {
	var sql = 'SELECT * FROM `dt_function`;';
	res.flag = query(sql, [])
		.then(results => httpResult.success(results));
	next();
});

router.post('/add', function(req, res, next) {
	var { func_name, func_key, func_fid } = req.body;
	var sql = 'insert `dt_function`(`func_name`, `func_key`, `func_fid`) values(?,?,?);';
	res.flag = query(sql, [ func_name, func_key, func_fid ])
		.then(results => httpResult.success(results.insertId));
	next();
});

router.post('/update', function(req, res, next) {
	var { func_id, func_name, func_key, func_fid } = req.body;
	var sql = 'update `dt_function` set `func_name` = ?, `func_key` = ?, `func_fid` = ? where `func_id` = ? ;';
	res.flag = query(sql, [ func_name, func_key, func_fid, func_id ])
		.then(results => httpResult.success());
	next();
});

router.post('/remove/:id', function(req, res, next) {
	var func_id = parseInt(req.params.id);
	var sql = 'delete from `dt_function` where `func_id` = ?;';
	res.flag = query(sql, [ func_id ]).then(() => httpResult.success());
	next();
});

module.exports = router;