var express = require('express');
var query = require('../util/dbHelper.js');
var httpResult = require('../config').httpResult;

var router = express.Router();

router.get('/all', function(req, res, next) {
	var sql = 'SELECT * FROM `dt_dictionary`;';
	res.flag = query(sql, [])
		.then(results => httpResult.success(results));
	next();
});


module.exports = router;