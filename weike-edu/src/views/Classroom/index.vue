<template>
	<div>
		<el-header>
			<span class="state free"></span> 闲置&nbsp&nbsp&nbsp&nbsp
			<span class="state occupy"></span> 使用中
		</el-header>
		<el-row :gutter="20">
			<el-col v-for="item in list" :key="item.clsr_id" :span="6">
				<el-card
					:class="item.clsr_occupy===1 ? 'occupy' : 'free' "
					 shadow="hover"
				         @mouseover.native="hoverId = item.clsr_id"
				         @mouseout.native="hoverId = 0"
				>
					<span v-text="item.clsr_name"></span>
					<div class="hidden" v-show="item.clsr_id === hoverId">
						<i class="el-icon-edit-outline" @click="beginUpdate(item)"></i>
						<i class="el-icon-delete" @click="removeClsr(item)"></i>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="btn-add" shadow="hover" @click.native="beginAdd"><i
					class="el-icon-plus"></i>
				</el-card>
			</el-col>
		</el-row>
		<!-- 弹框 -->
		<el-dialog :title="isEdit === true ? '添加教室' : '修改教室' " :visible="isDialog " width="500px"
		           :show-close="false">
			<el-form ref="form" :model="model" :rules="validationRules">
				<el-form-item label="教室门牌号:" prop="clsr_name">
					<el-input v-model.trim="model.clsr_name" placeholder="请输入教室信息"
					          style="width: 300px">

					</el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" style="display: flex;justify-content: space-around;width: 90%">
				<el-button type="primary" @click="save" :disabled="model.cls">确定</el-button>
				<el-button @click="isDialog = false">取消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script type="text/ecmascript-6">
        import {createNamespacedHelpers} from 'vuex';

        let {mapState, mapActions} = createNamespacedHelpers('classroom');

        export default {
                name: "Classroom",
                data(){
                        return {
                                isEdit: true,
                                isDialog: false,
                                hoverId: 0,
                                model: {
                                        clsr_name: "",
                                        clsr_id: 0,
//                                        clsr_occupy: 0
                                },
                                validationRules: {
                                        clsr_name: [
                                                {
                                                        validator: (rule, value, callback) =>{
                                                                if(value === '')
                                                                        callback(new Error('教室名不能为空'));
                                                                else if(value.length < 2 || value.length > 20)
                                                                        callback(new Error('教室名长度 2 - 20'));
                                                                // 在list中是不是存在id和当前编辑的id不同，而名字又相同的元素，如果有就说明名字冲突（这个逻辑同时适用于新增和修改）
                                                                else if(this.list.some(item => item.clsr_id !== this.model.clsr_id && item.clsr_name === value))
                                                                        callback(new Error('教室名已存在'));
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: 'blur'
                                                }
                                        ]
                                }
                        };
                },
                computed: {...mapState(["list"])},
                created(){
                        this.Init()
                },
                methods: {
                        ...mapActions(["Init", "addClassroom", "updateClassroom", "removeClassroom"]),
                        beginAdd(){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.isEdit = true;
                                this.model.clsr_id = 0;
                                this.model.clsr_name = "";
                                this.isDialog = true
                        },
                        beginUpdate(node){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.isEdit = false;
                                this.model.clsr_name = node.clsr_name;
                                this.model.clsr_id = node.clsr_id;
                                this.isDialog = true;
                        },
                        async save(){
                                if(this.isEdit){
                                        await this.addClassroom(Object.assign({}, this.model))
//	                                this.hoverId = 0;
                                        this.$message({
                                                message: `${this.model.clsr_name}添加成功!`,
                                                type: "success"
                                        });
                                }else{
                                        await this.updateClassroom(Object.assign({}, this.model));
                                        this.$message({
                                                message: `${this.model.clsr_name}修改成功!`,
                                                type: "success"
                                        });
                                }
                                this.isDialog = false;
                        },
                        removeClsr(node){
                                this.$confirm('确定删除此教室吗？', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                })
                                        .then(async() =>{
                                                await this.removeClassroom(node.clsr_id);
                                                this.$message({
                                                        type: "success",
                                                        message: `${node.clsr_name}教室删除成功`
                                                });
                                        })
                                        .catch(() =>{
                                        })
                        }
                }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-header
		height 20px
		display flex
		span.free
			background-color: #67C23A;
			display block
			width 20px
			height 20px
		span.occupy
			background-color: #cd5c5c;
			display block
			width 20px
			height 20px

	.el-col
		margin-bottom 30px
		.free
			background-color #67C23A
		.occupy
			background-color indianred
		.el-card
			text-align center
			padding 15%
			color: #fff
			font-weight bold
			font-size 24px
			cursor pointer
			position: relative

			.hidden
				position absolute
				left 0
				top 0
				width 100%
				height 100%
				background-color rgba(0, 0, 0, 0.6)
				display flex
				justify-content center
				align-items center
				i
					font-size 40px
					color #fff
					cursor pointer
					margin 0 10px
			&.btn-add
				background transparent
				border 1px dashed #99e
				color #99e
				font-weight bold
</style>