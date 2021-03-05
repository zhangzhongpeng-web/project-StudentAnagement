<template>
	<div>

		<el-tree class="custom-tree" :data="treeData" default-expand-all :expand-on-click-node="false">
			<span class="custom-tree-node" slot-scope="{node,data}">
				<span v-text="data.func_name"
				      :class="{root: data.func_id === 0, unleaf: data.func_key === '', leaf: data.func_key !== ''}">

				</span>
				<span>
					<el-button type="text" v-if="data.func_key ===''" @click="beginAdd(data)"><i
						class="el-icon-plus"></i></el-button>
					<el-button type="text" v-if="data.func_id !== 0" @click="beginUpdate(data)"><i
						class="el-icon-edit"></i></el-button>
					<el-button type="text" v-if="[0,44,45].indexOf(data.func_id ) === -1"
					           :disabled="typeof (data.children) !== 'undefined'"
					           @click="remove(data)"><i class="el-icon-delete"></i></el-button>
				</span>
			</span>
		</el-tree>
		<el-dialog :modal="false" :title="edit.mode === true ? '新增节点' : '编辑节点' " :visible="edit.isEdit"
		           :close-on-click-modal="false"
		           :close-on-press-escape="false" width="600px" :hide-required-asterisk="true"
		           :show-close="false">
			<el-form label-width="120px" :model="edit.model" :rules="edit.rules" ref="form">
				<el-form-item label="父级节点名称:">
					<el-select v-model="edit.model.func_fid" :disabled="edit.mode || !edit.isLeaf">
						<el-option
							v-for="item in selectData"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="节点类型：">
					<el-radio v-model="edit.isLeaf" :label="true"
					          :disabled="!(edit.mode && edit.model.func_fid === 0)">新增叶子节点
					</el-radio>
					<el-radio v-model="edit.isLeaf" :label="false"
					          :disabled="!(edit.mode && edit.model.func_fid === 0)">新增非叶子节点
					</el-radio>
				</el-form-item>
				<el-form-item label="系统功能名称" prop="func_name">
					<el-input v-model.trim="edit.model.func_name" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="绑定组件" v-show="edit.isLeaf" prop="func_key">
					<el-select v-model="edit.model.func_key">
						<!-- object.keys拿到对象中所有的键名-->
						<el-option
							v-for="item in Object.keys(views)"
							:key="item"
							:label="item"
							:value="item"
							:disabled="list.findIndex(func => func.func_key === item) !== -1">

							<!--由于label和value值一样所以都是item-->
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="edit.isEdit=false">取消</el-button>
				<el-button type="primary" @click="save">确定</el-button>

			</span>
		</el-dialog>
	</div>
</template>

<script type="text/ecmascript-6">
        import views from '../../views';
        import {createNamespacedHelpers} from 'vuex';   //映射仓库里的数据
        let {mapState, mapGetters, mapActions} = createNamespacedHelpers("func");
        export default {
                name: "Func",
                data(){
                        return {
                                views,
                                funcs: [],
                                edit: {
                                        mode: true,       //true表示新增，false表示修改
                                        isEdit: false,        //表示当前是否进入了编辑状态
                                        isLeaf: true,
                                        model: {func_id: 0, func_name: "", func_key: "", func_fid: -1},
                                        rules: {
                                                func_name: [{
                                                        validator: (rule, value, callback) =>{
                                                                let {func_id, func_name, func_fid} = this.edit.model;//es6中的解构赋值
                                                                if(value.length === 0)
                                                                        callback(new Error('*功能名称不能为空'));
                                                                else if(value.length < 2 || value.length > 50)
                                                                        callback(new Error('*功能名称长度在2-50'));
                                                                else if(this.list.some(item => item.func_id !== func_id && item.func_name === func_name && item.func_fid === func_fid))
                                                                        callback(new Error('*功能名称在当前父级中已经存在'));
                                                                else callback();                        //最后直接调用callback不给参数,表示通过验证
                                                        },
                                                        trigger: "blur"
                                                }],
                                                func_key: [
                                                        {
                                                                validator: (rule, value, callback) =>{
                                                                        //r如果是新增节点,且是叶子节点,且没有选择绑定的组件
                                                                        if(this.edit.mode && this.edit.isLeaf && value === "")
                                                                                callback(new Error('*叶子节点必须绑定组件!'));
                                                                        else callback();
                                                                },
                                                                trigger: "blur"
                                                        },
                                                ]
                                        }
                                },
                        };
                },
                computed: {
                        ...mapState(["list"]),
                        ...mapGetters(["listToTree"]),  //展开运算符(对映射过来的函数去壳)
                        treeData(){
                                return [{
                                        func_id: 0,
                                        func_name: "Root",
                                        func_key: "",
                                        func_fid: -1,
                                        children: this.listToTree
//                                        children: this.$store.getters["func/listToTree"]
                                }];

                        },
                        selectData(){                   //通过计算属性那所有非叶子结点应用到下拉框中，首先有一个根节点root
                                let result = [{label: "Root", value: 0}];
                                this.list.filter(item => item.func_key === "").forEach(item =>{
                                        result.push({label: item.func_name, value: item.func_id});
                                });
                                return result;
                        },

                },
                async created(){
                        //通知func子仓库去初始化list所有功能列表
                        this.$store.dispatch("func/init")
                },
                methods: {
                        ...mapActions(["init", "addFunc", "updateFunc", "removeFunc"]),
                        remove(node){
                                this.$confirm('确定删除此节点吗？', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                }).then(async() =>{
                                   //   await this.$store.dispatch("func/removeFunc",node.func_id);
	                                await this.removeFunc(node.func_id);
                                        this.$message({
                                                type: "success",
                                                message: `${node.func_name}节点删除成功,请刷新页面`
                                        });
                                        setTimeout(() =>{
                                                this.$router.go(0)
                                        }, 500)
                                })
                                        .catch(() =>{
                                        })
                        },
                        beginAdd(parentNode){
                                this.$refs.form && this.$refs.form.resetFields();        //重置表单，同为真正则为真，相当于对前面添加了一个if判断
                                //准备工作
                                this.edit.mode = true;
                                this.edit.isLeaf = parentNode.func_id !== 0;
                                this.edit.model.func_id = 0;
                                this.edit.model.func_key = "";
                                this.edit.model.func_name = "";
                                this.edit.model.func_fid = parentNode.func_id;
                                this.edit.isEdit = true;        //打开对话框开始新增
                        },
                        beginUpdate(node){
                                this.$refs.form && this.$refs.form.resetFields();  //清除表单默认残留
                                //打开对话框之前的准备工作
                                this.edit.mode = false;                 //编辑模式变为修改模式
                                this.edit.isLeaf = node.func_key !== "";  //func_key不为空，即有功能组件情况下为叶子节点
                                this.edit.model.func_id = node.func_id;
                                this.edit.model.func_key = node.func_key;
                                this.edit.model.func_name = node.func_name;
                                this.edit.model.func_fid = node.func_fid;
                                this.edit.isEdit = true;        //打开对话框开始修改
                        },
                        save(){
                                //发ajax之前要进行表单自我校验,参数valid代表有没有通过验证
                                this.$refs.form.validate(async valid =>{
                                        if(!valid) return;
                                        //如果是新增状态就发送新增状态的ajax
                                        if(this.edit.mode){
                                                //为了不影响原有数据,对model进行复制在操作
                                             //   await this.$store.dispatch("func/addFunc", Object.assign({}, this.edit.model));
                                                await this.addFunc(Object.assign({}, this.edit.model));
                                                //新增和修改之后都要把现有的树进行修改,funcs数据变了,计算属性即树才会变,所以分别需要push和替换

                                                //把回来的func_id追加到复制后的副本上
                                                this.$message({
                                                        message: `${this.edit.model.func_name}添加成功!`,
                                                        type: "success"
                                                });
	                                        this.$router.go(0);
                                        }else{
                                               // await this.$store.dispatch("func/updateFunc", Object.assign({}, this.edit.model));
                                                await this.updateFunc(Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: `${this.edit.model.func_name}修改成功!`,
                                                        type: "success"
                                                });
                                        }
                                        this.edit.isEdit = false;               //ajax发完之后都关闭弹窗
                                });


                        }
                }
        };
</script>

<style lang="stylus" rel="text/stylus" scoped>
	.custom-tree
		width 500px
		span.custom-tree-node
			flex 1
			display flex
			justify-content space-between
			align-items center
			span.root
				color #eb3941 !important
				font-weight bold
			span.unleaf
				color #ffd04a
				font-weight bold
			span.leaf
				color #606266

	.el-dialog
		width 400px
		display flex
		flex-direction column
		justify-content space-between
		align-items center


</style>