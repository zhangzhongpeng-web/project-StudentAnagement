// 创建一个可以自动保存特殊资源的multer对象,并导出
var assetsPath = require('../config').assetsPath;
var multer = require('multer');

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, assetsPath.tmp);
	},
	filename: function(req, file, cb) {
		var arr = file.originalname.split('.'),
		    extName = arr[arr.length - 1],
		    name = (new Date()).getTime();
		cb(null, `${ name }.${ extName }`);
	}
});
module.exports = multer({ storage: storage });