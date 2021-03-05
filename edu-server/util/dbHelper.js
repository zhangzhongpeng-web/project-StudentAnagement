var mysql = require('mysql');
var dbConfig = require('../config').dbConfig;

function query(sql, params) {
	return new Promise(function(resolve, reject) {
		var connection = mysql.createConnection(dbConfig);
		connection.query(sql, params, function(err, results, fields) {
			connection.end();
			if(err) {
				console.log(err.message);
				reject(err.message);
			}
			else resolve(results);
		});
	});
}

module.exports = query;