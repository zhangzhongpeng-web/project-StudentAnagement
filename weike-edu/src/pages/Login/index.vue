<template>
	<div class="all">
		<div class="logo-wrapper">
		<h1>潍科教学管理系统</h1>
		</div>
		<el-form :model="model" :rules="rules" ref="model" status-icon>
			<h1>用户登录</h1>
			<el-form-item prop="user_name">
				<el-input suffix-icon="el-icon-s-custom" v-model="model.user_name">
					<template slot="prepend"><span class="info">用户名：</span></template>
				</el-input>
			</el-form-item>
			<el-form-item prop="user_pwd">
				<el-input placeholder="请输入密码" v-model="model.user_pwd" show-password>
					<template slot="prepend"><span class="info">密码：</span></template>
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button plain="" @click="login">登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name: "Login",
	        data() {
                        return {
                            model: {
                                    user_name: "",
                                    user_pwd: ""
                            },
	                     rules: {
                                    user_name: [
	                                    { required: true, message: "请输入用户名", trigger: "blur"},
	                                    { min: 5, max: 20, message: "用户名长度在5到20个字符",trigger: "blur"}
                                    ],
		                     user_pwd: [
//			                     { required:true,message: "请输入密码", trigger: "blur" },
			                     { min:3, max:20,message: "密码长度应在3到20个字符" ,trigger:"blur"}
		                     ]
	                     }

                        }
	        },
	        methods: {
                      async login() {
                           let token = await  this.$http({
	                                url: " /user/login",
	                                method: "post",
	                                data: this.model
                                });
                           sessionStorage.setItem("token",token);
                           sessionStorage.setItem("user_name",this.model.user_pwd);

                           this.$router.replace('/home')
                        }
	        }
        }
</script>

<style scoped="">
	@keyframes aaa {
		0% {transform: rotateY(0deg)}
		100% {transform: rotateY(45deg)}
	}
	@keyframes bbb {
		0% {transform: translateY(-50%) translateX(15%)}
		100%{transform:translateY(-50%) translateX(40%)}
	}
	.all{
		background: url("2021.jpg") no-repeat center ;
		height: 100%;
		background-size: cover;
	}
	.logo-wrapper{
		perspective: 500px;
		position: fixed;
		top: 60%;
		right:50%;
		transform: translateY(-50%) translateX(15%);
		animation-name:bbb;
		animation-duration: 1s;
		animation-fill-mode: forwards;
		animation-delay: 1s;
	}
.logo-wrapper h1{
		animation-name: aaa;
		animation-duration: 1s;
		animation-fill-mode: forwards;

		transform: rotateY(30deg);
		transform-origin: left center;
		font-size: 100px;
		text-shadow: -2px 22px 3px black;
		border-bottom: 1px solid black;
		white-space: nowrap;
		padding: 30px 40px;
		color: #5F9EA0;
		position: relative;
	}

	.el-form{
		width: 300px;
		border: 1px solid #b0b0b0;
		border-radius: 10px;
		padding: 35px 80px;
		position: fixed;
		top: 50%;
		right:10%;
		transform: translateY(-50%);
		box-shadow: 0 0 10px #999;
		background-color: rgba(255,255,255,0.7);
	}
	.el-form .info{
		width: 50px;
		display: inline-block;
	}
	.el-form .el-button{
		margin-left: 38%;

	}
	h1{
		text-align: center;
		margin-bottom: 20px;
		color: #515151;
	}
</style>