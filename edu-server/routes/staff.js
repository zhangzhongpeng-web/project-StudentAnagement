var express = require('express');
var query = require('../util/dbHelper.js');
var httpResult = require('../config').httpResult;

var router = express.Router();

router.post('/list', function(req, res, next) {
	// ES6解构赋值
	var { stf_category, stf_name, begin, pageSize } = req.body;
	var sql = 'call p_staffRetrieve(?,?,?,?);';
	res.flag = query(sql, [ stf_category, stf_name, begin, pageSize ])
		.then(results => httpResult.success({ total: results[0][0].total, list: results[1] }));
	next();
});

// 根据员工的类别获取员工
router.get('/listbycategory/:stf_category', function(req, res, next) {
	var stf_category = parseInt(req.params.stf_category);
	var sql = 'select * from `dt_staff` where `stf_category` = ?;';
	res.flag= query(sql, [stf_category]).then(results => httpResult.success(results));
	next();
});

router.post('/add', function(req, res, next) {
	var { stf_name, stf_category, stf_remark } = req.body;
	var sql = 'insert `dt_staff`(`stf_name`,`stf_category`,`stf_remark`) values(?,?,?);';
	res.flag = query(sql, [ stf_name, stf_category, stf_remark ])
		.then(results => httpResult.success(results.insertId));
	next();
});

router.post('/update', function(req, res, next) {
	var { stf_id, stf_name, stf_category, stf_remark } = req.body;
	var sql = 'update `dt_staff` set `stf_name`=?,`stf_category`=?,`stf_remark`=? where `stf_id`=?;';
	res.flag = query(sql, [ stf_name, stf_category, stf_remark, stf_id ])
		.then(results => httpResult.success());
	next();
});

router.get('/dimission/:stf_id', function(req, res, next) {
	var stf_id = parseInt(req.params.stf_id);
	var sql = 'update `dt_staff` set `stf_invalid`= 0 where `stf_id`=?;';
	res.flag = query(sql, [ stf_id ])
		.then(results => httpResult.success());
	next();
});

router.get('/reinstate/:stf_id', function(req, res, next) {
	var stf_id = parseInt(req.params.stf_id);
	var sql = 'update `dt_staff` set `stf_invalid`= 1 where `stf_id`=?;';
	res.flag = query(sql, [ stf_id ])
		.then(results => httpResult.success());
	next();
});

module.exports = router;