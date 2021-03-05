var express = require('express');
var query = require('../util/dbHelper.js');
var httpResult = require('../config').httpResult;

var router = express.Router();

// 登录显示菜单要用；角色功能管理也要用
router.get('/list/:role_id', function(req, res, next) {
	var role_id = parseInt(req.params.role_id);
	var sql = 'call p_getFunctionByRole(?);';
	res.flag = query(sql, [ role_id ])
		.then(results => httpResult.success(results[0]));
	next();
});

// 角色功能配置
router.post('/config', function(req, res, next) {
	var { role_id, role_func_ids } = req.body;
	var sql = 'call p_configRoleFunction(?,?);';
	res.flag = query(sql, [ role_id, role_func_ids ])
		.then(results => httpResult.success());
	next();
})

module.exports = router;