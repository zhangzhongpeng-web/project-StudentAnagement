# project-StudentAnagement
# 基于vue开发的学生管理系统
## 项目描述  
此项目主要采用了vue全家桶进行系统的开发，允许扩展功能模块。
当前系统实现了用户登录、用户自身账号密码修改、系统管理、教务教学管理以及行政人事管理。

1、系统管理
系统功能管理、角色管理及角色功能管理、系统用户管理及角色分配;

2、教务教学管理
班级管理、教室管理、学生管理;

3、行政人事管理
员工管理

## 相关技术  
html5、element ui、axios、vue、vue-cli、vue-router、vuex、ES6

## 运行准备  
1、安装node服务  
2、安装mysql数据库和数据库管理软件（本人使用的是Navicat），并导入创建weike数据库  
3、修改edu-server -> config -> index.js配置文件中的数据库配置user和password     
4、本项目为一个vue项目，因此需按需安装第三包，本项目采用的包安装方式为yarn安装方式 yarn -v： 检查yarn是否存在  
npm install -g yarn： 通过安装node时捆绑安装的npm安装yarn包 yarn 或 yarn install：通过当前路径下的package.json文件记录的包依赖，批量安装第三包

## 运行  
1、在edu-server文件夹下打开命令窗口，输入yarn start启动项目服务器   
2、推荐使用webstorm打开项目，在控制台中输入yarn start编译项目，等待几秒后可在浏览器中打开预览

### 测试账号（管理员）  
用户名：admin；密码：123
