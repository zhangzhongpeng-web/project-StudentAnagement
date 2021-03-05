<template>
	<el-container>
		<el-header>
			<el-form :inline="true">
				<el-form-item label="员工名字：">
					<el-input
						v-model.trim="search.stf_name"
						placeholder="请输入搜索内容"
						clearable
						@change="getData()"
						prefix-icon="el-icon-search"></el-input>
				</el-form-item>
				<el-form-item label="员工类型：">
					<el-select v-model="search.stf_category" @change="getData()">
						<i slot="prefix" class="el-icon-search"></i>
						<el-option :value="0" label="- 所有类型 -"></el-option>
						<el-option
							v-for="item in $store.getters['dictionary/getGroupByKey']('staff_category')"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="float: right">
					<el-button type="success" size="medium" icon="el-icon-plus" @click="beginAdd">新增
					</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<el-table border stripe :highlight-current-row="true" :data="list" height="100%" stripe>
				<el-table-column label="#" type="index" align="center"></el-table-column>
				<el-table-column label="姓名" width="100" prop="stf_name"></el-table-column>
				<el-table-column label="职务类型" prop="stf_category">
					<template slot-scope="{row}">
						<span v-text="row.stf_category ? getGroupByKey('staff_category').find(item => item.dic_id === row.stf_category).dic_name : null"></span>
					</template>
				</el-table-column>
				<el-table-column label="备注" prop="stf_remark">
					<template slot-scope="{row}">
						<span :class="{empty : !row.stf_remark}"
						      v-text="row.stf_remark || '暂无相关备注...' "></span>
					</template>
				</el-table-column>
				<el-table-column label="员工状态" prop="stf_invalid">
					<template slot-scope="{ row }">
						<span :class="{dimission : !row.stf_invalid}"
						      v-text="row.stf_invalid ? '在职' : '离职' "></span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180" align="center" fixed="right">
					<template slot-scope="{ row }">
						<el-button type="primary" size="mini" @click="beginUpdate(row)">编辑
						</el-button>
						<el-button type="danger" size="mini" v-if="row.stf_invalid"
						           @click="dimissionHandler(row)">
							离职
						</el-button>
						<el-button type="success" size="mini" v-else
						           @click="reinstateHandler(row)">入职
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<el-footer>
			<el-pagination
				background
				:total="pagination.total"
				:page-size.sync="pagination.pageSize"
				:current-page.sync="pagination.currentPage"
				layout="total, prev, pager, next, jumper, ->, sizes"
				:page-sizes="[5, 8, 10, 12, 15]"
				@size-change="getData()"
				@current-change="getData(false)"
			></el-pagination>
		</el-footer>
		<el-dialog
			:modal="false"
			width="700px"
			:visible="edit.isDialog"
			:show-close="false">
			<h2 slot="title" v-text="`员工维护 - ${ edit.mode ? '新增' : '修改' }`"
			    class="custom-dialog-title"></h2>
			<el-form label-width="100px" :model="edit.model" :rules="rules" ref="form"
			         status-icon>
				<el-form-item label="员工名字：" prop="stf_name">
					<el-input v-model.trim="edit.model.stf_name" placeholder="请输入员工的名字"></el-input>
				</el-form-item>
				<el-form-item label="员工类型：" prop="stf_category">
					<el-select v-model="edit.model.stf_category" placeholder="- 请选择员工类型 -">
						<el-option
							v-for="item in $store.getters['dictionary/getGroupByKey']('staff_category')"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="员工备注：">
					<el-input type="textarea" :rows="4" placeholder="请输入员工备注.."
					          v-model.trim="edit.model.stf_remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click="save()" size="medium">保存</el-button>
				<el-button @click="edit.isDialog = false" size="medium">取消</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
        import {createNamespacedHelpers} from 'vuex';

        let {mapState, mapActions, mapGetters} = createNamespacedHelpers('dictionary');
        export default {
                name: "Staff",
                data(){
                        return {
                                search: {stf_name: "", stf_category: 0},
                                pagination: {total: 0, pageSize: 5, currentPage: 1},
                                edit: {
                                        isDialog: false,
                                        mode: true,
                                        model: {stf_id: 0, stf_name: "", stf_category: "", stf_remark: ""},

                                },
                                rules: {
                                        stf_name: [
                                                { required: true, message: '员工名字不能为空', trigger: 'blur' },
                                                { min: 2, max: 20, message: '员工名字长度 2 - 20', trigger: 'blur' }
                                        ],
                                        stf_category: [
                                                { required: true, message: '请选择员工的类型', trigger: 'change' }
                                        ]

                        },
                                list: []        //存储表格数据
                        }
                },
                computed: {...mapState({"dicList": "list"}), ...mapGetters(["getGroupByKey"])},
                created(){
                        this.getData();
                        this.Init()
                },
                methods: {
                        ...mapActions(["Init"]),
                        async getData(fromPage1 = true){
                                if(fromPage1) this.pagination.currentPage = 1;
                                // 向服务器发送ajax请求，获取数据，并更新到data节点的list中
                                let {list, total} = await this.$http({
                                        url: '/staff/list',
                                        method: 'post',
                                        data: {
                                                ...this.search,
                                                begin: (this.pagination.currentPage - 1) * this.pagination.pageSize,
                                                pageSize: this.pagination.pageSize
                                        }
                                });
                                this.list = list;
                                this.pagination.total = total;
                        },
                        //离职
                        dimissionHandler(staff){
                                this.$confirm(
                                        `确定要让员工："${ staff.stf_name }" 离职吗？`,
                                        '警告',
                                        {showClose: false, type: 'warning'}
                                )
                                        .then(() => this.$http({
                                                url: `/staff/dimission/${ staff.stf_id }`,
                                                method: 'get'
                                        }))
                                        .then(() =>{
                                                var i = this.list.findIndex(item => item.stf_id === staff.stf_id);
                                                this.list[i].stf_invalid = 0;
                                                this.$message({
                                                        message: `员工："${ staff.stf_name }" 离职成功！`,
                                                        type: 'success'
                                                });
                                        })
                                        .catch(() =>{
                                        });
                        },
                        // 入职
                        reinstateHandler(staff){
                                this.$confirm(
                                        `确定要让员工："${ staff.stf_name }" 复职吗？`,
                                        '警告',
                                        {showClose: false, type: 'warning'}
                                )
                                        .then(() => this.$http({
                                                url: `/staff/reinstate/${ staff.stf_id }`,
                                                method: 'get'
                                        }))
                                        .then(() =>{
                                                var i = this.list.findIndex(item => item.stf_id === staff.stf_id);
                                                this.list[i].stf_invalid = 1;
                                                this.$message({
                                                        message: `员工："${ staff.stf_name }" 复职成功`,
                                                        type: 'success'
                                                });
                                        })
                                        .catch(() =>{
                                        });
                        },
                        //新增前准备工作
                        beginAdd(){
                                this.edit.model.stf_id = 0;
                                this.edit.model.stf_name = '';
                                this.edit.model.stf_category = '';
                                this.edit.model.stf_remark = '';

                                this.edit.mode = true;
                                this.edit.isDialog = true;
                        },
                        // 修改前准备工作
                        beginUpdate(staff){
                                this.edit.model.stf_id = staff.stf_id;
                                this.edit.model.stf_name = staff.stf_name;
                                this.edit.model.stf_category = staff.stf_category;
                                this.edit.model.stf_remark = staff.stf_remark;

                                this.edit.mode = false;
                                this.edit.isDialog = true;
                        },
                        async save(){
                                this.$refs.form.validate(async valid =>{
                                        if(!valid) return;

                                        if(this.edit.mode){
                                                await this.$http({
                                                        url: '/staff/add',
                                                        method: 'post',
                                                        data: this.edit.model
                                                });
                                                this.list.push(Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: `员工："${ this.edit.model.stf_name }" 添加成功！`,
                                                        type: 'success'
                                                });
                                        }else{
                                                await  this.$http({
                                                        url: '/staff/update',
                                                        method: 'post',
                                                        data: this.edit.model
                                                });
                                                var i = this.list.findIndex(item => item.stf_id === this.edit.model.stf_id);
                                                this.list.splice(i, 1, Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: `员工："${ this.edit.model.stf_name }" 修改成功！`,
                                                        type: 'success'
                                                });
                                        }
                                        this.edit.isDialog = false;
                                })
                        }

                }
        };
</script>

<style scoped>
	span.dimission {
		color: red;
	}

	span.empty {
		color: #ccc;
	}

	.el-container {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0
	}
</style>