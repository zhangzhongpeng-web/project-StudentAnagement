var express = require('express');
var query = require('../util/dbHelper.js');
var Token = require('../util/token.js');
var httpResult = require('../config').httpResult;
var admin = require('../config').admin;

var router = express.Router();

// 登录
router.post('/login', function(req, res, next) {
	var { user_name, user_pwd } = req.body;
	// 如果是管理员
	if(user_name === admin.user_name && user_pwd === admin.user_pwd) { 
		res.flag = Promise.resolve(httpResult.success(Token.sign(user_name)));
	}
	// 如果不是管理员
	else {
		var sql = 'select * from `dt_user` where `user_name` = ? and `user_pwd` = ?;';
		res.flag = query(sql, [ user_name, user_pwd ])
			.then(results => {
				if(results.length > 0) return httpResult.success(Token.sign(user_name));
				else return httpResult.failure(null, '用户名或密码错误');
			});
	}
	next();
});

// 根据用户名获取可以用的菜单
router.post('/getmenu', Token.verify, function(req, res, next) {
	var user_name = req.token.name;
	var sql = '';
	// 如果是管理员直接获取所有菜单
	if(user_name === admin.user_name) {
		sql = 'SELECT * FROM `dt_function`;'
		res.flag = query(sql, []).then(results => httpResult.success(results));
	}
	// 如果不是管理员，根据用户名获取角色，再根据角色获取功能菜单
	else {
		sql = 'CALL p_getUserMenu(?);';
		res.flag = query(sql, [ user_name ])
			.then(results => httpResult.success(results[0]));
	}
	next();
});

// 验证用户名是否存
router.post('/valid_name', Token.verify, function(req, res, next) {
	var { user_name } = req.body;
	var sql = 'select count(*) as count from `dt_user` where `user_name` = ?;';
	res.flag = query(sql, [ user_name ])
		.then(results => httpResult.success(results[0].count));
	next();
});
// 分页查询用户
router.post('/list', Token.verify, function(req, res, next) {
	// ES6解构赋值
	var { user_name, role_id, begin, pageSize } = req.body;
	var sql = 'call p_userRetrieve(?,?,?,?);';
	res.flag = query(sql, [ user_name, role_id, begin, pageSize ])
		.then(results => httpResult.success({ total: results[0][0].total, list: results[1] }));
	next();
});
// 新增用户
router.post('/add', Token.verify, function(req, res, next) {
	var { user_name, user_pwd } = req.body;
	var sql = 'insert `dt_user`(`user_name`,`user_pwd`) values(?,?);';
	res.flag = query(sql, [ user_name, user_pwd ])
		.then(results => httpResult.success());
	next();
});
// 管理员修改用户密码
router.post('/change_pwd', Token.verify, function(req, res, next) {
	var { user_name, user_pwd } = req.body;
	var sql = 'update `dt_user` set `user_pwd` = ? where `user_name` = ?;';
	res.flag = query(sql, [ user_pwd, user_name ])
		.then(results => httpResult.success());
	next();
});
// 用户自己修改密码
router.post('/pwdchange', Token.verify, function(req, res, next) {
	var user_name = req.token.name;
	var { oldPwd, newPwd } = req.body;
	if(user_name === admin.user_name) {
		res.flag = Promise.resolve(httpResult.failure(null, '管理员请直接修改配置文件！'));
	} else {
		var sql = 'call p_changePwd(?,?,?);';
		res.flag = query(sql, [ user_name, oldPwd, newPwd ])
			.then(results => {
				if(results[0][0].result === '') return httpResult.success();
				else return httpResult.failure(null, results[0][0].result);
			});
	}
	next();
});
// 删除用户
router.post('/remove/:user_name', Token.verify, function(req, res, next) {
	var user_name = req.params.user_name;
	var sql = 'delete from `dt_user` where `user_name` = ?';
	res.flag = query(sql, [ user_name ])
		.then(results => httpResult.success());
	next();
});
// 用户角色分配
router.post('/config_role', Token.verify, function(req, res, next) {
	var { user_name, role_id } = req.body;
	var sql = 'call p_configUserRole(?,?);';
	res.flag = query(sql, [ user_name, role_id ])
		.then(results => httpResult.success());
	next();
});

module.exports = router;