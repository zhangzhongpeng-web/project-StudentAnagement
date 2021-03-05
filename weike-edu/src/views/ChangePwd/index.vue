<template>
	<el-form label-width="120px" ref="form" :model="model" :rules="validateRules" status-icon>
		<el-form-item label="原始密码：" prop="oldPwd">
			<el-input type="password" v-model.trim="model.oldPwd"></el-input>
		</el-form-item>
		<el-form-item label="新密码：" prop="newPwd">
			<el-input type="password" v-model.trim="model.newPwd"></el-input>
		</el-form-item>
		<el-form-item label="新密码确认：" prop="newPwd2">
			<el-input type="password" v-model.trim="model.newPwd2"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="okHandler">确定</el-button>
		</el-form-item>
	</el-form>
</template>

<script type="text/ecmascript-6">
        export default {
                name: 'PwdChange',
                data() {
                        return {
                                model: { oldPwd: '', newPwd: '', newPwd2: '' },
                                validateRules: {
                                        oldPwd: [
                                                { required: true, message: '请输入原密码', trigger: 'blur' },
                                                { min: 3, max: 20, message: '密码长度 3 - 20', trigger: 'blur' }
                                        ],
                                        newPwd: [
                                                {
                                                        validator: (rule, value, callback) => {
                                                                if (value === '') {
                                                                        callback(new Error('请输入新密码'));
                                                                } else if(value.length <3 || value.length > 20) {
                                                                        callback(new Error('密码长度 3- 20'));
                                                                } else if(value === this.model.oldPwd) {
                                                                        callback(new Error('新密码不能与旧密码相同'));
                                                                }else {
                                                                        if (this.model.newPwd2 !== '') {
                                                                                this.$refs.form.validateField('newPwd2');
                                                                        }
                                                                        callback();
                                                                }
                                                        },
                                                        trigger: 'blur'
                                                }
                                        ],
                                        newPwd2: [
                                                {
                                                        validator: (rule, value, callback) => {
                                                                if (value === '') {
                                                                        callback(new Error('请再次输入密码'));
                                                                } else if (value !== this.model.newPwd) {
                                                                        callback(new Error('两次输入密码不一致!'));
                                                                } else {
                                                                        callback();
                                                                }
                                                        },
                                                        trigger: 'blur'
                                                }
                                        ]
                                }
                        };
                },
                methods: {
                        okHandler() {
                                this.$refs.form.validate(valid => {
                                        if(valid) {
                                                // 发送ajax修改密码
                                                this.$http({
                                                        url: '/user/pwdchange',
                                                        method: 'post',
                                                        data: this.model
                                                }).then(() => {
                                                        this.$message({ message: '密码修改成功！', type: 'success' });
                                                        this.$refs.form.resetFields();  // 重置表单
                                                });
                                        }
                                });
                        }
                }
        };
</script>

<style scoped>
	.el-form { width: 450px; }
</style>