var path = require('path');

// 此文件中保存和整个服务器相关重要配置
exports.dbConfig = {
	host: 'localhost',
	database: 'weike',
	user: 'root',
	password: '123'
};

exports.httpResult = {
	// 成功
	success: (data = null, message = '') => ({ status: 200, data, message }),
	// 逻辑失败
	failure: (data = null, message = '') => ({ status: 199, data, message }),
	// 物理失败
	error: (data = null, message = '') => ({ status: 500, data, message }),
	// 权限验证失败
	untoken: (data = null, message = '') => ({ status: 401, data, message }),
	// 不存在
	notFound: (data = null, message = '') => ({ status: 404, data, message })
};
// 系统管理员账户(本应该在数据库中表，但懒得弄了)
exports.admin = {
	user_name: 'admin',
	user_pwd: '123'
}

// 保存服务器端静态图片资源相关重要路径
exports.assetsPath = {
	// 绝对路径
	root: path.resolve(__dirname, '../public'),
	tmp: path.resolve(__dirname, '../public/tmp'),
	// 相对路径
	student: '/images/student/'
}