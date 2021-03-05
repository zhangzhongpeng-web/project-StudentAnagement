<template>
	<el-container>
		<el-header>
			<el-form :inline="true" style="width: 100%">
				<el-form-item label="用户名">
					<el-input placeholder="请输入搜索内容"

					          prefix-icon="el-icon-search"
					          @change="getUser(true)"
					          v-model="search.user_name">
					</el-input>
				</el-form-item>
				<el-form-item label="用户角色">
					<el-select placeholder="-请选择-" v-model="search.role_id" @change="getUser(true)">
						<el-option :label="'-全部-'" :value="-1"></el-option>
						<el-option :label="'-无角色-'" :value="0"></el-option>
						<el-option
							v-for="role in roleList"
							:key="role.role_id"
							:label="role.role_name"
							:value="role.role_id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-plus" @click="beginAdd">添加用户</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<el-table style="width:80%;" stripe border :data="userList" class="table">
				<el-table-column type="index" :index="number" width="100" label="#"
				                 align="center"></el-table-column>
				<el-table-column prop="user_name" label="姓名" width="180"></el-table-column>
				<el-table-column v-model="distribute.role_name" prop="role_id" label="用户角色" width="180" align="center">
					<template slot-scope="{row}">
					<span v-if="row.role_id !== null && roleList.length > 0"
					      v-text="roleList.find(item => item.role_id === row.role_id).role_name"></span>
						<span v-else class="no-role">无角色</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="{row}">
						<el-button type="primary" icon="el-icon-edit" circle
						           @click="beginUpdate(row)"></el-button>
						<el-button type="danger" icon="el-icon-delete" circle
						           @click="remove(row.user_name)"></el-button>
						<el-button type="info" @click="beginRole(row)">角色分配</el-button>
					</template>
				</el-table-column>

			</el-table>
		</el-main>
		<el-footer>
			<el-pagination
				background
				layout="prev,pager,next,jumper, ->,sizes,total"
				:page-sizes="[6,8,10,12,15]"
				:page-size.sync="pagination.pageSize"
				:current-page.sync="pagination.currentPage"
				@size-change="getUser(true)"
				@current-change="getUser(false)"
				:total="pagination.total">
			</el-pagination>
		</el-footer>

		<!--弹窗-->
		<el-dialog :title="isEdit === true ? '新增用户' : '编辑用户' " :visible="isDialog " width="500px"
		           :show-close="false">
			<el-form ref="form" label-width="100px">
				<el-form-item label="角色名:" prop="">
					<el-input :disabled="isEdit === false" v-model.trim="model.user_name"
					          placeholder="请输入用户名"
					          clearable style="width: 300px">
					</el-input>
				</el-form-item>
				<el-form-item label="密码:" prop="">
					<el-input placeholder="请输入用户密码" v-model.trim="model.user_pwd"
					          clearable style="width: 300px" show-password></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" style="display: flex;justify-content: space-around;width: 90%">
				<el-button type="primary" @click="save">确定</el-button>
				<el-button @click="isDialog = false">取消</el-button>
			</span>
		</el-dialog>
		<!--角色分配部分弹窗-->
		<el-dialog title="分配角色" :visible="isDis" :show-close="false" width="400px">

			<template slot-scope="{row}">
				<el-form label-width="70px">
					<el-form-item label="角色:">
						<el-select v-model="distribute.role_id" style="width: 250px;">
							<el-option :label="'-无角色-'" :value="0"></el-option>
							<el-option
								v-for="item in roleList"
								:key="item.role_id"
								:label="item.role_name"
								:value="item.role_id"
							></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<span slot="footer" style="display: flex;justify-content: space-around;width: 90%">
					<el-button type="primary" @click="startRole(row)">确定</el-button>
					<el-button @click="isDis = false">取消</el-button>
				</span>
			</template>
		</el-dialog>
	</el-container>

</template>

<script type="text/ecmascript-6">
        import {createNamespacedHelpers} from 'vuex';

        let {mapState, mapActions} = createNamespacedHelpers("role");
        //这回个页面什么时候需要请求新的用户数据
        //created的时候
        //搜索用户名失去焦点（回车操作）
        //搜索中的select的change事件
        //分页控件改变页码的时候
        //分页控件的页容量pagesize改变的时候

        export default {
                name: "User",
                data(){
                        return {
                                isDialog: false,         //弹窗是否打开
                                isEdit: true,   //编辑模式
                                userList: [],           //存储表格数据
                                isDis: false,
                                search: {
                                        user_name: "",          //搜索相关数据
                                        role_id: -1
                                },
                                pagination: {           //分页相关数据
                                        total: 0,
                                        pageSize: 6,
                                        currentPage: 1
                                },
                                model: {user_name: "", user_pwd: "", role_id: null},//标识新增编辑时ajax的data
                                distribute: {role_name: "", role_id: null}
                        }
                },
                computed: {
                        ...mapState({"roleList": "list"})
                },

                methods: {
                        ...mapActions({"roIeInit": "Init"}),
                        number(index){
                                return index + 1
                        },
                        async getUser(fromPage1 = true){
                                if(fromPage1) this.pagination.currentPage = 1;
                                let {list, total} = await this.$http({
                                        method: "post",
                                        url: "/user/list",
                                        data: {
                                                ...this.search,         //去壳
                                                begin: this.pagination.pageSize * (this.pagination.currentPage - 1),
                                                pageSize: 6
                                        }
                                });
                                this.userList = list;
                                this.pagination.total = total
                        },
                        remove(user_name){
                                this.$confirm(`确定删除用户: "${user_name}"`, "提示", {type: "warning"})
                                        .then(async() =>{
                                                await this.$http({
                                                        method: "post",
                                                        url: "/user/remove/" + user_name
                                                });
                                               let i = this.userList.findIndex(item => item.user_name === user_name);
                                                this.userList.splice(i, 1);
                                                this.$message({message: `用户："${user_name}", 删除成功`, type: "success"})
                                        })
                                        .catch(() =>{
                                        })
                        },
                        //点击新增按钮及新增前的工作
                        beginAdd(){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.isEdit = true;
                                this.model.user_name = "";
                                this.model.user_pwd = "";
                                this.isDialog = true
                        },
                        //点击编辑按钮及编辑前的工作
                        beginUpdate(node){
                                console.log(node);
                                this.$refs.form && this.$refs.form.resetFields();
                                this.isEdit = false;
                                this.model.user_name = node.user_name;
                                this.model.user_pwd = node.user_pwd;
                                this.isDialog = true
                        },
                        async save(){
                                if(this.isEdit){
                                        await this.$http({url: "/user/add", method: "post", data: this.model});
                                        this.userList.push(Object.assign({}, this.model));
                                        this.$message({
                                                type: "success",
                                                message: "修改成功"
                                        })
                                }else{
                                        await this.$http({url: "/user/change_pwd", method: "post", data: this.model});
                                        let i = this.userList.findIndex(item => item.user_name === this.model.user_name);
                                        this.userList.splice(i, 1, Object.assign({}, this.model));
                                        this.$message({
                                                type: "success",
                                                message: "修改成功"
                                        })
                                }
                                this.isDialog = false;
                        },
                        //角色分配前准备工作
                        beginRole(index){
                                console.log(index);
                                this.distribute.user_name = index.user_name;
                                this.distribute.role_id = index.role_id;
                                this.isDis = true;
                        },
                        //开始分配
                        async startRole(){
                                await this.$http({url: "/user/config_role", method: "post", data: this.distribute});
                                this.$message({
                                        type: "success",
                                        message: this.distribute.user_name + "角色分配成功"
                                });
                                let i = this.userList.findIndex(item => item.user_name === this.distribute.user_name);
                                console.log(i);
                                this.userList.splice(i, 1, Object.assign({}, this.distribute));
                                this.isDis = false;
                        }
                },
                created(){
                        this.roIeInit();
                        this.getUser();
                },
        };
</script>

<style lang="stylus" scoped="">
	.el-container
		position absolute
		left 0
		top 0
		width 100%
		height 100%

	.main
		span.no_role
			color: #f00
</style>