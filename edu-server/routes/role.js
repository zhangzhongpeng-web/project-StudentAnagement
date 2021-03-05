var express = require('express');
var query = require('../util/dbHelper.js');
var httpResult = require('../config').httpResult;

var router = express.Router();

router.get('/all', function(req, res, next) {
	var sql = 'SELECT * FROM `dt_role`;';
	res.flag = query(sql, [])
		.then(results => httpResult.success(results));
	next();
});

router.post('/add', function(req, res, next) {
	var { role_name } = req.body;
	var sql = 'insert `dt_role`(`role_name`) values(?);';
	res.flag = query(sql, [ role_name ])
		.then(results => httpResult.success(results.insertId));
	next();
});

router.post('/update', function(req, res, next) {
	var { role_id, role_name } = req.body;
	var sql = 'update `dt_role` set `role_name` = ? where `role_id` = ? ;';
	res.flag = query(sql, [ role_name, role_id ])
		.then(results => httpResult.success());
	next();
});

router.post('/remove/:id', function(req, res, next) {
	var role_id = parseInt(req.params.id);
	var sql = 'delete from `dt_role` where `role_id` = ?;';
	res.flag = query(sql, [ role_id ]).then(() => httpResult.success());
	next();
});

module.exports = router;