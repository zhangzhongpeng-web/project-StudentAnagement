<template>

	<div>
		<el-row :gutter="20">
			<el-col v-for="item in list" :key="item.role_id" :span="6">
				<el-card shadow="hover">
					<span v-text="item.role_name"></span>
					<div class="button-wrapper">
						<el-button type="text" @click="beginUpdate(item)"><i
							class="el-icon-edit-outline"></i></el-button>
						<el-button type="text" @click="removeData(item)"><i
							class="el-icon-delete"></i></el-button>
						<el-button type="text" style="color: #777;font-size: 15px"
						           @click="beginRoleFuncConfig(item.role_id)">功能分配
						</el-button>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="btn-add" shadow="hover" @click.native="beginAdd"><i
					class="el-icon-plus"></i></el-card>
			</el-col>
		</el-row>
		<!-- 弹框 -->
		<el-dialog :title="isEdit === true ? '新增角色信息' : '编辑人员信息' " :visible="isDialog " width="500px"
		           :show-close="false">
			<el-form ref="form">
				<el-form-item label="角色姓名:">
					<el-input v-model.trim="model.role_name" placeholder="请输入人员信息"
					          style="width: 300px">

					</el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" style="display: flex;justify-content: space-around;width: 90%">
				<el-button type="primary" @click="save">确定</el-button>
				<el-button @click="isDialog = false">取消</el-button>
			</span>
		</el-dialog>
		<el-drawer class="custom-drawer"
		           :modal="false" :visible.sync="edit2.isEdit"
		           size="500px"
		           :show-close="false">
			<h3 slot="title">角色功能分配</h3>
			<el-tree class="custom-tree" :data="edit2.treeData">
				<span class="custom=tree-node" slot-scope="{node,data}"
				      :class="{parent: data.func_key === ''}">
					<span>
						<i v-if="data.func_key !== ''" class="el-icon-paperclip"></i>
						<span v-text="data.func_name"></span>
					</span>
					<span class="sweitch-wrapper">
						<el-switch v-model="data.open"
						           @change="switchChangeHandler(data)"></el-switch>
					</span>
				</span>
			</el-tree>
			<div class="drawer-footer">
				<el-button type="primary">确定</el-button>
				<el-button @click="edit2.isEdit = false">取消</el-button>
			</div>
		</el-drawer>
	</div>
</template>


<script type="text/ecmascript-6">
        import {createNamespacedHelpers} from 'vuex';

        let {mapState, mapActions} = createNamespacedHelpers('role');
        export default {
                name: "Role",
                data(){
                        return {
                                roles: [],
                                isEdit: true,       //控制新增或修改两种状态,true为新增
                                isDialog: false,    //控制弹窗是否显示
                                model: {
                                        role_id: -1,
                                        role_name: ""
                                },
                                edit2: {
                                        isEdit: false,
                                        model: {role_id: 0, role_func_ids: ""},
                                        treeData: []
                                }
                        };
                },
                computed: {...mapState(["list"])},
                created(){
                        this.Init()
                },
                methods: {
                        ...mapActions(["Init", "addRole", "updateRole", "removeRole"]),
                        //添加人员信息
                        beginAdd(){
                                //打开对话框之前的准备工作
                                this.$refs.form && this.$refs.form.resetFields();       //如果表单打开了先重置表单，在进行操作
                                this.isEdit = true;                                                     //开启新增模式
                                // this.model.role_id = 0;
                                this.model.role_name = "";
                                this.isDialog = true;                                                    //打开对话框
                        },
                        beginUpdate(node){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.isEdit = false;                            //开启编辑模式
                                this.model.role_id = node.role_id;
                                this.model.role_name = node.role_name;
                                this.isDialog = true;
                        },
                        async save(){
//                                this.$refs.form.validate(async valid => {
//                                        if(!valid) return;
                                if(this.isEdit){
                                        await this.addRole(Object.assign({}, this.model));

                                        this.$message({
                                                message: `${this.model.role_name}添加成功!`,
                                                type: "success"

                                        });
                                }else{
                                        await this.updateRole(Object.assign({}, this.model));
                                        this.$message({
                                                message: `${this.model.role_name}修改成功!`,
                                                type: "success"
                                        });
                                }
                                this.isDialog = false;

//                                });
                        },
                        removeData(node){
                                this.$confirm('确定删除此节点吗？', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                })
                                        .then(async() =>{
                                                await this.removeRole(node.role_id);
                                                this.$message({
                                                        type: "success",
                                                        message: `${node.role_name}节点删除成功,请刷新页面`
                                                });
                                        })
                                        .catch(() =>{
                                        })
                        },
                        async beginRoleFuncConfig(role_id){
                                let roleFuncs = await this.$http({url: "/role_function/list" + role_id});


                        }
                }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-col
		margin-bottom 30px
		.el-card
			text-align center
			padding 15%
			background lightskyblue
			color: #fff
			font-weight bold
			font-size 24px
			cursor pointer
			position: relative
			&.btn-add
				background transparent
				border 1px dashed #99e
				color #99e
				font-weight bold
			.button-wrapper
				position absolute
				right 10px
				bottom 0
				.el-button
					font-size 17px
					color: #fff

	.custom-tree
		width: 500px
		margin: 20px 0 50px 50px
		span.custom-tree-node
			flex: 1
			display: flex
			justify-content: space-between
			align-items: center
			&.parent
				padding-right: 50px
				color: #0094ff

	.drawer-footer
		text-align: center


</style>