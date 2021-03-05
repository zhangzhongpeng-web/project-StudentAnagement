var express = require('express');
var query = require('../util/dbHelper.js');
var file = require('../util/file.js');
var upload = require('../util/upload.js');
var path = require('path');
var assetsPath = require('../config').assetsPath;
var httpResult = require('../config').httpResult;

var router = express.Router();

// 分页查询学生信息
router.post('/list', function(req, res, next) {
	// ES6解构赋值
	var { stu_name, stu_cls_id, stu_qualification, begin, pageSize } = req.body;
	var sql = 'call p_studentRetrieve(?,?,?,?,?);';
	res.flag = query(sql, [ stu_name, stu_cls_id, stu_qualification, begin, pageSize ])
		.then(results => httpResult.success({ total: results[0][0].total, list: results[1] }));
	next();
});
// 验证学生手机号是否合理
router.post('/valid_phone', function(req, res, next) {
	var { stu_phone } = req.body;
	var sql = 'select count(*) as count from `dt_user` where `user_name` = ?;';
	res.flag = query(sql, [ stu_phone ])
		.then(results => httpResult.success(results[0].count));
	next();
});
// 新增学生
router.post('/add', function(req, res, next) {
	var { stu_name, stu_avatar, stu_cls_id, stu_sex, stu_phone, stu_phone2, stu_born, stu_qualification, stu_school, stu_major, stu_address, stu_remark } = req.body;
	var sql = 'insert into dt_student(stu_name, stu_avatar, stu_cls_id, stu_sex, stu_phone, stu_phone2, stu_born, stu_qualification, stu_school, stu_major, stu_address, stu_remark) values(?,?,?,?,?,?,?,?,?,?,?,?);';
	res.flag = query(sql, [ stu_name, stu_avatar, stu_cls_id, stu_sex, stu_phone, stu_phone2, stu_born, stu_qualification, stu_school, stu_major, stu_address, stu_remark ])
		.then(results => httpResult.success(results.insertId));
	next();
});
// 修改学生
router.post('/update', function(req, res, next) {
	var { stu_name, stu_avatar, stu_cls_id, stu_sex, stu_phone, stu_phone2, stu_born, stu_qualification, stu_school, stu_major, stu_address, stu_remark, stu_id } = req.body;
	var sql = 'update dt_student set stu_name=?, stu_avatar=?, stu_cls_id=?, stu_sex=?, stu_phone=?, stu_phone2=?, stu_born=?, stu_qualification=?, stu_school=?, stu_major=?, stu_address=?, stu_remark=? where stu_id=?;';
	res.flag = query(sql, [ stu_name, stu_avatar, stu_cls_id, stu_sex, stu_phone, stu_phone2, stu_born, stu_qualification, stu_school, stu_major, stu_address, stu_remark, stu_id ])
		.then(results => httpResult.success());
	next();
});
// 学生分班(有可能是单个，也有可能是批量)
router.post('/assignclass', function(req, res, next) {
	var { stu_id, stu_ids, stu_cls_id } = req.body;
	var sql = '';
	if(stu_id !== null) {
		sql = 'update dt_student set stu_cls_id = ? where stu_id = ?;';
		res.flag = query(sql, [ stu_cls_id, stu_id ])
			.then(results => httpResult.success());
	} else {
		sql = 'update dt_student set stu_cls_id = ? where stu_id in (?);';
		res.flag = query(sql, [ stu_cls_id, stu_ids ])
			.then(results => httpResult.success());
	}
	next();
});
// 预上传学生图片
router.post('/avatarupload', upload.single('avatar'), function(req, res, next) {
	res.flag = Promise.resolve(httpResult.success(req.file.filename));
	next();
});
// 修改学生的存档照片
router.post('/avatarupdate', function(req, res, next) {
	var { stu_id, stu_avatar_old, stu_avatar_new } = req.body;
	var { tmp, root, student } = assetsPath;
	res.flag = new Promise(function(resolve, reject) {
		var fromPath = path.join(tmp, stu_avatar_new);
		var toPath = path.join(root, student, stu_avatar_new);
		file.copy(fromPath, toPath)					// 把文件从临时目录拷贝到最终目录
			.then(() => file.unlink(fromPath))		// 把临时目录中的文件删除
			.then(() => {							// 如果原来有存档图片，就删除原来的存档
				if(stu_avatar_old !== null)  return file.unlink(path.join(root, stu_avatar_old));
				else return Promise.resolve();
			}) 	// 
			.then(() => resolve());
	})
		.then(() => {
			let sqlStr = 'UPDATE `dt_student` SET `stu_avatar` = ? WHERE `stu_id` = ?;';
			return query(sqlStr, [ student + stu_avatar_new, stu_id ]);
		})
		.then(() => httpResult.success(student + stu_avatar_new))
		.catch(message => httpResult.error(null, message));
	next();
});

module.exports = router;