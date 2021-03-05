<template>
	<el-container>
		<el-header>
			<el-form :inline="true">
				<el-form-item label="班级名称：">
					<el-input
						clearable
						placeholder="请输入搜索内容"
						prefix-icon="el-icon-search"
						v-model.trim="search.cls_name"
						@change="getData()"></el-input>
				</el-form-item>
				<el-form-item label="班级专业：">
					<el-select v-model="search.cls_dic_id_major" @change="getData()">
						<i slot="prefix" class="el-icon-search"></i>
						<el-option :value="0" label="- 所有专业 -"></el-option>
						<el-option
							v-for="item in $store.getters['dictionary/getGroupByKey']('class_major')"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级状态：">
					<el-select v-model="search.cls_status" @change="getData()">
						<el-option :value="0" label="- 所有 -"></el-option>
						<el-option :value="1" label="开课中"></el-option>
						<el-option :value="2" label="未开课"></el-option>
						<el-option :value="3" label="结课"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="float: right">
					<el-button type="success" size="medium" icon="el-icon-plus" @click="beginAdd">新增
					</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<div class="table-wrapper">
				<el-table border stripe :highlight-current-row="true" :data="list" height="100%">
					<el-table-column type="index" label="#" align="center"></el-table-column>
					<el-table-column label="班级名称" prop="cls_name" width="110"
					></el-table-column>
					<el-table-column label="班级专业" width="110">
						<template slot-scope="{ row }">
							<span v-text=" row.cls_dic_id_major ? getGroupByKey('class_major').find(item => item.dic_id === row.cls_dic_id_major).dic_name : null"></span>
						</template>
					</el-table-column>
					<el-table-column label="教学老师" width="100" align="center">
						<template slot-scope="{ row }">
							<span v-text="row.cls_stf_id_teacher !== null? staffTeacher.find(item => item.stf_id === row.cls_stf_id_teacher).stf_name: ''"></span>
						</template>
					</el-table-column>
					<el-table-column label="教务老师" width="100" align="center">
						<template slot-scope="{ row }">
							<span v-text="row.cls_stf_id_admin !== null? staffAdmin.find(item => item.stf_id === row.cls_stf_id_admin).stf_name: ''"></span>
						</template>
					</el-table-column>
					<el-table-column label="就业老师" width="100" align="center">
						<template slot-scope="{ row }">
							<span v-text="row.cls_stf_id_job !== null? staffJob.find(item => item.stf_id === row.cls_stf_id_job).stf_name: ''"></span>
						</template>
					</el-table-column>
					<el-table-column label="教室" width="100">
						<template slot-scope="{ row }">
							<span v-if="row.cls_clsr_id === null"></span>
							<span v-else
							      v-text="row.cls_clsr_id !== null? clsrList.find(item => item.clsr_id === row.cls_clsr_id).clsr_name: ''"></span>
						</template>
					</el-table-column>
					<el-table-column label="开课时间" prop="cls_begin" width="120"
					                 align="center"></el-table-column>
					<el-table-column label="结课时间" prop="cls_end" width="120"
					                 align="center"></el-table-column>
					<el-table-column label="班级状态" width="100" align="center">
						<template slot-scope="{ row }">
							<span v-if="row.cls_begin === null && row.cls_end === null"
							      class="do">未开课</span>
							<span v-else-if="row.cls_begin !== null && row.cls_end === null"
							      class="doing">开课中</span>
							<span v-else class="done">结课</span>
						</template>
					</el-table-column>
					<el-table-column label="备注" show-overflow-tooltip width="130">
						<template slot-scope="{ row }">
							<span :class="{empty : !row.cls_remark}"
							      v-text="row.cls_remark || '暂无相关备注...' "></span>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="200" fixed="right">
						<template slot-scope="{ row }">
							<el-button type="primary" size="small" icon="el-icon-edit"
							           @click="beginUpdate(row)">修改
							</el-button>
							<el-button type="success" size="small" icon="el-icon-open"
							           v-if="row.cls_begin === null && row.cls_end === null"
							           @click="beginClassBegin(row)">开课
							</el-button>
							<el-button type="danger" size="small" icon="el-icon-turn-off"
							           v-else-if="row.cls_begin && !row.cls_end"
							           @click="classEnd(row)">结课
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-main>
		<el-footer>
			<el-pagination
				background
				:total="pagination.total"
				:page-size.sync="pagination.pageSize"
				:current-page.sync="pagination.currentPage"
				layout="total, prev, pager, next, jumper, ->, sizes"
				:page-sizes="[5, 8, 10, 12, 15]"
				@current-change="getData"
				@size-change="getData()"
			></el-pagination>
		</el-footer>
		<!--新增和编辑的对话框-->
		<el-dialog
			:modal="false"
			width="700px"
			:visible="edit.isEdit"
			:show-close="false">
			<h2 slot="title" v-text="`班级维护 - ${ edit.mode ? '新增' : '修改' }`"
			    class="custom-dialog-title"></h2>
			<el-form label-width="100px" :model="edit.model" ref="editForm"
			         status-icon>
				<el-form-item label="班级名称：" prop="cls_name">
					<el-input v-model.trim="edit.model.cls_name" placeholder="请输入班级的名称"></el-input>
				</el-form-item>
				<el-form-item label="班级专业：" prop="cls_dic_id_major">
					<el-select v-model="edit.model.cls_dic_id_major">
						<el-option
							v-for="item in getGroupByKey('class_major')"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教室："
				              v-show="edit.model.cls_begin !== null && edit.model.cls_end === null">
					<el-select v-model="edit.model.cls_clsr_id">
						<el-option
							v-for="item in clsrList"
							:key="item.clsr_id"
							:value="item.clsr_id"
							:label="item.clsr_name"
							:disabled="
								(!!item.clsr_occupy) &&
								!list.some(item2 => item2.cls_id === edit.model.cls_id && item2.cls_clsr_id === item.clsr_id)
							"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教学老师：" prop="cls_stf_id_teacher">
					<el-select v-model="edit.model.cls_stf_id_teacher">
						<el-option v-for="item in staffTeacher" :key="item.stf_id"
						           :value="item.stf_id" :label="item.stf_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教务老师：" prop="cls_stf_id_admin">
					<el-select v-model="edit.model.cls_stf_id_admin">
						<el-option v-for="item in staffAdmin" :key="item.stf_id"
						           :value="item.stf_id" :label="item.stf_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="就业老师：" prop="cls_stf_id_job">
					<el-select v-model="edit.model.cls_stf_id_job">
						<el-option v-for="item in staffJob" :key="item.stf_id"
						           :value="item.stf_id" :label="item.stf_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级备注：">
					<el-input type="textarea" :rows="4" placeholder="请输入班级备注.."
					          v-model.trim="edit.model.cls_remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" size="medium" @click="save">保存</el-button>
				<el-button @click="edit.isEdit = false" size="medium">取消</el-button>
			</div>
		</el-dialog>
		<!-- 开班操作对话框 -->
		<el-dialog
			:modal="false"
			width="500px"
			:visible="edit2.isEdit"
			:show-close="false">
			<h1 slot="title" class="custom-dialog-title">开班</h1>
			<el-form label-width="100px" :model="edit.model" ref="editForm2" status-icon>
				<el-form-item label="教室：" prop="cls_clsr_id">
					<el-select v-model="edit.model.cls_clsr_id">
						<el-option
							v-for="item in clsrList"
							:key="item.clsr_id"
							:value="item.clsr_id"
							:label="item.clsr_name"
							:disabled="!!item.clsr_occupy"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" size="medium" @click="classBegin">确定</el-button>
				<el-button @click="edit2.isEdit = false" size="medium">取消</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
        import {createNamespacedHelpers} from 'vuex';

        let {mapGetters} = createNamespacedHelpers('dictionary');
        let {mapState, mapActions} = createNamespacedHelpers('classroom');
        export default {
                name: "Class",
                data(){
                        return {
                                search: {cls_name: "", cls_dic_id_major: 0, cls_status: 0},
                                pagination: {total: 0, currentPage: 1, pageSize: 5},
                                edit: {
                                        isEdit: false,
                                        mode: true,
                                        model: {
                                                cls_id: 0,
                                                cls_name: '',
                                                cls_dic_id_major: 0,
                                                cls_clsr_id: null,
                                                cls_stf_id_teacher: 0,
                                                cls_stf_id_admin: 0,
                                                cls_stf_id_job: 0,
                                                cls_begin: null,
                                                cls_end: null,
                                                cls_remark: null
                                        },
                                },
                                edit2: {
                                        isEdit: false,
                                        model: {cls_id: 0, cls_clsr_id: null},
                                },
                                EnumStaffCategory: {
                                        teacher: 4,
                                        admin: 4,
                                        job: 6
                                },
                                staffTeacher: [],
                                staffAdmin: [],
                                staffJob: [],
                                list: []
                        };
                },
                computed: {...mapGetters(["getGroupByKey"]), ...mapState({"clsrList": "list"})},
                async created(){
                        await this.Init();

                        // 拿取所有教学老师信息
                        let p1 = this.$http({
                                url: '/staff/listbycategory/4',
                                method: 'get'
                        });
                        console.log(this.staffTeacher);
                        // 拿取所有教务老师信息
                        let p2 = this.$http({
                                url: '/staff/listbycategory/5',
                                method: 'get'
                        });
                        // 拿取所有就业老师信息
                        let p3 = this.$http({url: '/staff/listbycategory/6', method: 'get'});
                        let p4 = this.$http({
                                url: "/class/list",
                                method: "post",
                                data: {
                                        ...this.search,
                                        begin: this.pagination.pageSize * (this.pagination.currentPage - 1),
                                        pageSize: this.pagination.pageSize
                                }
                        });

                        Promise.all([p1, p2, p3, p4])
                                .then(([a, b, c, d]) =>{
                                        this.staffTeacher = a;
                                        this.staffAdmin = b;
                                        this.staffJob = c;
                                        this.list = d.list;
                                        this.pagination.total = d.total;
                                })
                                .catch((error) =>{
                                        console.log(error)
                                });

                },
                methods: {
                        ...mapActions(["Init"]),
                        //获取所有数据，当搜索栏页面改变时都会发生变化
                        async getData(){
                                let {list, total} = await this.$http({
                                        url: "/class/list",
                                        method: "post",
                                        data: {
                                                ...this.search,
                                                begin: this.pagination.pageSize * (this.pagination.currentPage - 1),
                                                pageSize: this.pagination.pageSize
                                        }
                                });
                                this.list = list;
                                this.pagination.total = total;
                        },
                        beginAdd(){
                                this.edit.mode = true;
                                this.edit.model.cls_id = null;
                                this.edit.model.cls_name = null;
                                this.edit.model.cls_dic_id_major = null;
                                this.edit.model.cls_clsr_id = null;
                                this.edit.model.cls_stf_id_teacher = null;
                                this.edit.model.cls_stf_id_admin = null;
                                this.edit.model.cls_stf_id_job = null;
                                this.edit.model.cls_begin = null;
                                this.edit.model.cls_end = null;
                                this.edit.model.cls_remark = null;
                                this.edit.isEdit = true;
                        },
                        beginUpdate(cls){
                                this.edit.model.cls_id = cls.cls_id;
                                this.edit.model.cls_name = cls.cls_name;
                                this.edit.model.cls_dic_id_major = cls.cls_dic_id_major;
                                this.edit.model.cls_clsr_id = cls.cls_clsr_id;
                                this.edit.model.cls_stf_id_teacher = cls.cls_stf_id_teacher;
                                this.edit.model.cls_stf_id_admin = cls.cls_stf_id_admin;
                                this.edit.model.cls_stf_id_job = cls.cls_stf_id_job;
                                this.edit.model.cls_begin = cls.cls_begin;
                                this.edit.model.cls_end = cls.cls_end;
                                this.edit.model.cls_remark = cls.cls_remark;

                                this.edit.mode = false;
                                this.edit.isEdit = true;
                        },
                        async save(){
                                if(this.edit.mode){
                                        let i = await this.$http({
                                                url: '/class/add',
                                                method: 'post',
                                                data: this.edit.model
                                        });
                                        this.edit.model.cls_id = i;
                                        this.list.push(Object.assign({}, this.edit.model));
                                        this.$message({
                                                message: `班级："${ this.edit.model.cls_name }" 添加成功！`,
                                                type: 'success'
                                        });
                                }else{
                                        this.$http({url: '/class/update', method: 'post', data: this.edit.model});
                                        let i = this.list.findIndex(item => item.cls_id === this.edit.model.cls_id);
                                        // 班级对应的教室是否修改了
                                        if(this.list[i].cls_clsr_id !== this.edit.model.cls_clsr_id){
                                                this.$store.commit('classroom/toggleStatus', this.list[i].cls_clsr_id);
                                                this.$store.commit('classroom/toggleStatus', this.edit.model.cls_clsr_id);
                                        }
                                        this.list.splice(i, 1, Object.assign({}, this.edit.model));
                                        this.$message({message: '班级修改成功', type: 'success'});
                                }
                                this.edit.isEdit = false;
                        },
                        beginClassBegin(node){
                                this.$confirm(
                                        `确定要对班级："${ node.cls_name }" 进行 开课 操作吗？`,
                                        '警告',
                                        {showClose: false, type: 'warning'}
                                )
                                        .then(() =>{

                                                this.edit.model.cls_id = node.cls_id;
                                                this.edit.model.cls_clsr_id = node.cls_clsr_id;
                                                this.edit2.isEdit = true;
                                        })
                                        .catch(() =>{
                                        });
                        },
                        classBegin(){
                                this.$refs.editForm2.validate(async isValid =>{
                                        if(!isValid) return;
                                        let beginTime = await this.$http({
                                                url: '/class/begin',
                                                method: 'post',
                                                data: this.edit.model
                                        });
//                                        this.edit.model.cls_begin = beginTime;
                                        let i = this.list.findIndex(item => item.cls_id === this.edit.model.cls_id);
//                                        this.list.splice(i, 1, Object.assign({}, this.edit.model));
                                        this.list[i].cls_begin = beginTime;
                                        this.list[i].cls_clsr_id = this.edit.model.cls_clsr_id;
                                        this.$store.commit('classroom/toggleStatus', this.edit.model.cls_clsr_id);
                                        this.$message({message: '开课成功！', type: 'success'});
                                        this.edit2.isEdit = false;
                                });
                        },
                        classEnd(node){
                                this.$confirm(
                                        `确定要对班级："${ node.cls_name }" 进行 结课 操作吗？`,
                                        '警告',
                                        {showClose: false, type: 'warning'}
                                )
                                        .then(async() =>{
                                                let endTime = await this.$http({
                                                        url: '/class/end',
                                                        method: 'post',
                                                        data: {cls_id: node.cls_id}
                                                });
                                                let i = this.list.findIndex(item => item.cls_id === node.cls_id);
                                                this.list[i].cls_end = endTime;
	                                        this.list.splice(i,1,Object.assign({},list[i]));
                                                this.$store.commit('classroom/toggleStatus', this.list[i].cls_clsr_id);
                                                this.$message({ message: '结课成功！', type: 'success' });
                                        })
                                        .catch(() =>{
                                        })
                        }
                }
        };
</script>

<style scoped>
	.el-container {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0
	}

	.table-wrapper {
		width: 100%;
		height: 100%;
	}

	.el-footer {
		display: flex;
		flex-direction: column;
		justify-content: center
	}

	span.empty {
		color: #ccc;
	}

	span.do {
		color: #E6A23C;
	}

	span.doing {
		color: #67C23A;
	}

	span.done {
		color: #ccc;
	}

	h2.custom-dialog-title {
		text-indent: 2em;
		height: 40px;
		line-height: 40px;
		font-size: 22px;
	}

	h1.custom-dialog-title {
		font-size: 23px;
	}
</style>