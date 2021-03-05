var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var httpResult = require('./config').httpResult;
var Token = require('./util/token.js');

// 自定义中间件引入
var dictionaryRouter = require('./routes/dictionary');			// 字典表管理中间件
var staffRouter = require('./routes/staff');					// 员工管理中间件
var classroomRouter = require('./routes/classroom');			// 教室管理中间件
var functionRouter = require('./routes/function.js');			// 功能管理中间件
var roleRouter = require('./routes/role.js');					// 角色管理中间件
var roleFunctionRouter = require('./routes/role_function.js');  // 角色功能管理中间件
var userRouter = require('./routes/user.js');					// 用户管理管理中间件
var classRouter = require('./routes/class.js');					// 班级管理中间件
var studentRouter = require('./routes/student.js');				// 学生管理中间件

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRouter);									// 路由(用户)中间件
app.use('/dictionary', Token.verify, dictionaryRouter);			// 路由(字典)中间件
app.use('/staff', Token.verify, staffRouter);					// 路由(员工)中间件
app.use('/classroom', Token.verify, classroomRouter);			// 路由(教室)中间件		
app.use('/function', Token.verify, functionRouter);				// 路由(功能)中间件
app.use('/role', Token.verify, roleRouter);						// 路由(角色)中间件
app.use('/role_function', Token.verify, roleFunctionRouter);	// 路由(角色功能)中间件
app.use('/class', Token.verify, classRouter);					// 路由(班级)中间件
app.use('/student', Token.verify, studentRouter);				// 路由(学生)中间件

// 收尾的中间件， 把前面处理的结果统一res.send回客户端
app.use(function(req, res, next) {
	if(res.flag) {
		res.flag
			.then(result => res.send(result))
			.catch(message => res.send(httpResult.error(null, message)));
	}
	else next(); // 继续放行，让后面的404进行处理
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
