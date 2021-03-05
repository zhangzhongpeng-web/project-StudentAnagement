var httpResult = require('../config').httpResult;
var jwt =  require('jsonwebtoken');
var tokenKey = 'abcdefg';			// token的密钥

module.exports = {
	// 创建token
	sign: function(name) {
		return jwt.sign({ name }, tokenKey, { expiresIn: '5h' })
	},
	// 验证token
	verify: function(req, res, next) {
		// 拿到传来的token
		var token = req.get('Authorization');
		// 验证token是否合法
		jwt.verify(token, tokenKey, function(err, decoded) {
			if(err) res.send(httpResult.untoken());	// token不合法
			else {
				req.token = decoded;
				next();
			}
		}); 
	}
};