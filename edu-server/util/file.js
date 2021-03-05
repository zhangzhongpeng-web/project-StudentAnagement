var fs = require('fs');

// 判断文件是否存在
exports.stat = file => newPromise((resolve, reject) => {
	fs.stat(file, (error, stats) => {
		if(error) reject(error);
		else {
			if(stats && stats.isFile()) resolve();
			else reject(new Error('文件不存在'));
		}
	})
});

// 创建目录
exports.mkdir = dir => new Promise((resolve, reject) => {
	fs.mkdir(dir, error => {
		if(error) {
			console.log(`创建文件夹: ${ dir } 失败 `);
			console.log(`失败原因: ${ error.message }`);
			reject(error);
		} 
		else {
			console.log(`创建目录: ${ dir } 成功`);
			resolve();
		}
	});
});

// 删除文件
exports.unlink = file => new Promise((resolve, reject) => {
	fs.unlink(file, error => {
		if(error) {
			console.log(`删除文件: ${ file } 失败 `);
			console.log(`失败原因: ${ error.message }`);
			reject(error);
		}
		else {
			console.log(`删除文件: ${ file } 成功`);
			resolve();
		}
	})
});

// 文件拷贝
exports.copy = (file1, file2) => new Promise((resolve, reject) => {
	try{
		const rs = fs.createReadStream(file1); 	// 创建文件读取流
		const ws = fs.createWriteStream(file2);	// 创建文件写入流
		// rs.pipe(ws); // 将读取流与写入流通过pipe连接
		rs.on('data', chunk => {
			ws.write(chunk);
		});
		rs.on('end', () => {
			console.log('提示:拷贝成功');
			console.log(`提示: 已成功将 ${ file1 } 拷贝到 ${ file2 }`);
			ws.end();
			resolve();
		});
	}catch(e){
		//TODO handle the exception
		reject(e);
	}
});

