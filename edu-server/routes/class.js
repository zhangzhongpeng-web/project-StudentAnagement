var express = require('express');
var query = require('../util/dbHelper.js');
var httpResult = require('../config').httpResult;

var router = express.Router();

// 查询所有班级信息（主要是学生管理页面要用）
router.get('/all', function(req, res, next) {
	var sql = 'select * from dt_class;';
	res.flag = query(sql, [])
		.then(results => httpResult.success(results));
	next();
});
// 分页查询班级信息
router.post('/list', function(req, res, next) {
	// ES6解构赋值
	// cls_status 0: 所有 1：开课中 2. 未开课 3. 结课
	var { cls_name, cls_dic_id_major, cls_status, begin, pageSize } = req.body;
	var sql = 'call p_classRetrieve(?,?,?,?,?);';
	res.flag = query(sql, [ cls_name, cls_dic_id_major, cls_status, begin, pageSize ])
		.then(results => httpResult.success({ total: results[0][0].total, list: results[1] }));
	next();
});
// 验证班级名字是否合理
router.post('/valid_name', function(req, res, next) {
	var { cls_name } = req.body;
	var sql = 'select count(*) as count from `dt_class` where `cls_name` = ?;';
	res.flag = query(sql, [ cls_name ])
		.then(results => httpResult.success(results[0].count));
	next();
});
// 新增班级
router.post('/add', function(req, res, next) {
	var { cls_name, cls_dic_id_major, cls_clsr_id, cls_stf_id_teacher, cls_stf_id_admin, cls_stf_id_job, cls_begin, cls_end, cls_remark } = req.body;
	var sql = 'insert dt_class(cls_name, cls_dic_id_major, cls_clsr_id, cls_stf_id_teacher, cls_stf_id_admin, cls_stf_id_job, cls_begin, cls_end, cls_remark) values(?,?,?,?,?,?,?,?,?);';
	res.flag = query(sql, [ cls_name, cls_dic_id_major, cls_clsr_id, cls_stf_id_teacher, cls_stf_id_admin, cls_stf_id_job, cls_begin, cls_end, cls_remark ])
		.then(results => httpResult.success(results.insertId));
	next();
});
// 修改班级
router.post('/update', function(req, res, next) {
	var { cls_id, cls_name, cls_dic_id_major, cls_clsr_id, cls_stf_id_teacher, cls_stf_id_admin, cls_stf_id_job, cls_begin, cls_end, cls_remark } = req.body;
	var sql = 'call p_classUpdate(?,?,?,?,?,?,?,?,?,?);';
	res.flag = query(sql, [ cls_id, cls_name, cls_dic_id_major, cls_clsr_id, cls_stf_id_teacher, cls_stf_id_admin, cls_stf_id_job, cls_begin, cls_end, cls_remark ])
		.then(results => httpResult.success());
	next();
});
// 开课
router.post('/begin', function(req, res, next) {
	var { cls_id, cls_clsr_id } = req.body;
	var sql = 'call p_classBegin(?,?);';
	res.flag = query(sql, [ cls_id, cls_clsr_id ])
		.then(results => httpResult.success(results[0][0].result));
	next();
});
// 结课
router.post('/end', function(req, res, next) {
	var { cls_id } = req.body;
	var sql = 'call p_classEnd(?);';
	res.flag = query(sql, [ cls_id ])
		.then(results => httpResult.success(results[0][0].result));
	next();
});


module.exports = router;