<template>
	<el-container>
		<el-header height="40px">
			<el-form :inline="true">
				<el-form-item label="学生名字：">
					<el-input

						v-model.trim="search.stu_name"
						placeholder="请输入搜索内容"
						clearable
						prefix-icon="el-icon-search"
						@change="getData()"></el-input>
				</el-form-item>
				<el-form-item label="所在班级：">
					<el-select v-model="search.stu_cls_id" @change="getData()">
						<i slot="prefix" class="el-icon-search"></i>
						<el-option :value="0" label="- 全部 -"></el-option>
						<el-option :value="null" label="- 无班级 -"></el-option>
						<el-option v-for="item in listClass" :key="item.cls_id"
						           :value="item.cls_id" :label="item.cls_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="学生学历：">
					<el-select v-model="search.stu_qualification" @change="getData()">
						<i slot="prefix" class="el-icon-search"></i>
						<el-option :value="0" label="- 全部 -"></el-option>
						<el-option
							v-for="item in $store.getters['dictionary/getGroupByKey']('qualification')"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="float: right">
					<el-button type="danger" size="medium" icon="el-icon-download"
					           @click="exportStudent">导出学生信息
					</el-button>
				</el-form-item>
				<el-form-item style="float: right">
					<el-button type="success" size="medium" icon="el-icon-share"
					           @click="beginAssignClassBatch">批量分班
					</el-button>
				</el-form-item>
				<el-form-item style="float: right">
					<el-button type="primary" size="medium" icon="el-icon-plus" @click="beginAdd">
						新增
					</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<div class="table-wrapper">
				<el-table border stripe :highlight-current-row="true" :data="list" height="100%"
				          @selection-change="selectionChangeHandler">
					<el-table-column type="index" label="#" align="center"></el-table-column>
					<el-table-column type="selection" align="center"></el-table-column>
					<el-table-column label="学生名字" prop="stu_name" width="100"></el-table-column>
					<el-table-column label="班级" width="120">
						<template slot-scope="{ row }">
							<span style="color: #ccc;"
							      v-if="row.stu_cls_id === null">无班级</span>
							<span v-else
							      v-text="listClass.find(item => item.cls_id === row.stu_cls_id).cls_name"></span>
						</template>
					</el-table-column>
					<el-table-column label="存档照片" width="100" align="center">
						<template slot-scope="{ row }">
							<el-popover placement="right" :title="row.stu_name"
							            trigger="click">
								<el-image :src="row.stu_avatar || defaultAvatar" style="width: 230px; height: 280px; margin: 20px 50px;" fit="contain"></el-image>
								<el-button slot="reference" type="text">预览</el-button>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="性别" width="60" align="center">
						<template slot-scope="{ row }">
							<span v-text="row.stu_sex === 1 ? '男' : '女'"></span>
						</template>
					</el-table-column>
					<el-table-column label="联系电话" width="120" align="center"
					                 prop="stu_phone"></el-table-column>
					<el-table-column label="联系电话(备用)" width="140" align="center"
					                 prop="stu_phone2"></el-table-column>
					<el-table-column label="出生日期" width="120" align="center"
					                 prop="stu_born"></el-table-column>
					<el-table-column label="学历" width="120">
						<template slot-scope="{ row }">
							<span v-text="row.stu_qualification ? getGroupByKey('qualification').find(item => item.dic_id === row.stu_qualification).dic_name : null"></span>
						</template>
					</el-table-column>
					<el-table-column label="毕业院校" width="140" prop="stu_school"
					                 show-overflow-tooltip></el-table-column>
					<el-table-column label="院校专业" width="140" prop="stu_major"
					                 show-overflow-tooltip></el-table-column>
					<el-table-column label="家庭住址" width="240" prop="stu_address"
					                 show-overflow-tooltip></el-table-column>
					<el-table-column label="备注" width="260" show-overflow-tooltip>
						<template slot-scope="{ row }">
							<span v-if="row.stu_remark === ''"
							      style="color: #ccc;">暂无相关备注..</span>
							<span v-else v-text="row.stu_remark"></span>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="400" align="center" fixed="right">
						<template slot-scope="{ row }">
							<el-button type="success" size="mini" icon="el-icon-share"
							           @click="beginAssignClass(row)">分班
							</el-button>
							<el-button type="danger" size="mini" icon="el-icon-picture"
							           @click="beginUploadAvatar(row)">照片存档
							</el-button>
							<el-button type="primary" size="mini" icon="el-icon-edit"
							           @click="beginUpdate(row)">编辑
							</el-button>
							<el-button type="warning" size="mini" icon="el-icon-delete">删除
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
				@size-change="getData()"
				@current-change="getData"
			></el-pagination>
		</el-footer>
		<!-- 编辑对话框 -->
		<el-dialog
			:modal="false"
			width="700px"
			:visible="edit.isEdit"
			:show-close="false">
			<h2 slot="title" v-text="`学生维护 - ${ edit.mode ? '新增' : '修改' }`"
			    class="custom-dialog-title"></h2>
			<el-form label-width="130px" :model="edit.model" :rules="edit.validationRules" ref="editForm"
			         status-icon>
				<el-form-item label="学生姓字：" prop="stu_name">
					<el-input v-model.trim="edit.model.stu_name" placeholder="请输入学生的名字"></el-input>
				</el-form-item>
				<el-form-item label="性别：">
					<el-radio v-model="edit.model.stu_sex" :label="1">男</el-radio>
					<el-radio v-model="edit.model.stu_sex" :label="0">女</el-radio>
				</el-form-item>
				<el-form-item label="联系电话：" prop="stu_phone">
					<el-input v-model.trim="edit.model.stu_phone" placeholder="请输入手机号"
					          maxlength="11" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="备用电话：" prop="stu_phone2">
					<el-input v-model.trim="edit.model.stu_phone2" placeholder="请输入备用联系电话(手机号/坐机号)">
						<template slot="append">例如：028-88888888</template>
					</el-input>
				</el-form-item>
				<el-form-item label="出生日期：" prop="stu_born">
					<el-date-picker
						v-model="edit.model.stu_born"
						placeholder="请选择出生日期"
						:editable="false"
						value-format="yyyy-MM-dd"
						:picker-options="pickerOptions"></el-date-picker>
				</el-form-item>
				<el-form-item label="学历：" prop="stu_qualification">
					<el-select v-model="edit.model.stu_qualification" placeholder="- 请选择学生的学历 -">
						<el-option
							v-for="item in $store.getters['dictionary/getGroupByKey']('qualification')"
							:key="item.dic_id" :value="item.dic_id"
							:label="item.dic_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="在读/毕业院校：">
					<el-input v-model.trim="edit.model.stu_school"
					          placeholder="请输入在读/毕业的院校(选填)"></el-input>
				</el-form-item>
				<el-form-item label="在校学习专业：">
					<el-input v-model.trim="edit.model.stu_major"
					          placeholder="请输入在校学习专业(选填)"></el-input>
				</el-form-item>
				<el-form-item label="家庭住址：" prop="stu_address">
					<el-input v-model.trim="edit.model.stu_address"
					          placeholder="请输入家庭住址"></el-input>
				</el-form-item>
				<el-form-item label="学生备注：">
					<el-input type="textarea" :rows="4" placeholder="请输入学生备注.."
					          v-model.trim="edit.model.stu_remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" size="medium" @click="save">保存</el-button>
				<el-button @click="edit.isEdit = false" size="medium">取消</el-button>
			</div>
		</el-dialog>
		<!-- 分班对话框 -->
		<el-dialog
			:modal="false"
			width="700px"
			:visible="edit2.isEdit"
			:show-close="false">
			<h2 slot="title" class="custom-dialog-title">分班</h2>
			<el-form label-width="80px">
				<el-form-item label="班级：">
					<el-select v-model="edit2.model.stu_cls_id">
						<el-option :value="null" label="- 无班级 -"></el-option>
						<el-option
							v-for="item in listClass"
							:key="item.cls_id"
							:value="item.cls_id"
							:label="item.cls_name"
							:disabled="item.cls_end !== null"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" size="medium" @click="assignClass">确定</el-button>
				<el-button @click="edit2.isEdit = false" size="medium">取消</el-button>
			</div>
		</el-dialog>
		<!-- 照片存档对话框 -->
		<el-dialog
			:modal="false"
			width="700px"
			:visible="edit3.isEdit"
			:show-close="false">
			<h2 slot="title" class="custom-dialog-title">照片存档</h2>
			<el-form label-width="100px">
				<el-form-item label="个人照片：">
					<div class="avatar-wrapper">
						<div class="avatar-wrapper-old"
						     v-if="edit3.model.stu_avatar_old !== null">
							<el-image :src="edit3.model.stu_avatar_old"></el-image>
							<p>学生当前存档图片</p>
						</div>
						<div class="seperator" v-if="edit3.model.stu_avatar_old !== null"></div>
						<div class="avatar-wrapper-new">
							<el-upload
								ref="upload"
								class="avatar-uploader"
								list-type="picture-card"
								accept=".png,.jpg"
								action="/student/avatarupload"
								name="avatar"
								:headers="uploadHeaders"
								:before-upload="beforeUploadHandler"
								:on-success="successHandler"
								:on-remove="removeHandler">
								<i class="el-icon-plus avatar-uploader-icon"></i>
								<p slot="tip" style="color: red;">
									提示：只能上传jpg/png文件，且不超过2M, 一寸照片宽高比最好5:7</p>
							</el-upload>
						</div>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" size="medium"
				           :disabled="this.edit3.model.stu_avatar_new === null" @click="uploadAvatar">存档
				</el-button>
				<el-button @click="edit3.isEdit = false" size="medium">取消</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
        import defaultAvatar from './moren.jpg';

        import {createNamespacedHelpers} from 'vuex';

        let {mapGetters} = createNamespacedHelpers('dictionary');
        export default {
                name: "Student",
                data(){
                        return {
                                defaultAvatar,
                                uploadHeaders: {"Authorization": sessionStorage.getItem("token")},
                                search: {
                                        stu_name: "",
                                        stu_cls_id: 0,
                                        stu_qualification: 0
                                },
                                list: [],               //当前正在显示的学生信息
                                listClass: [],          //所有的班级信息
                                pagination: {total: 0, pageSize: 5, currentPage: 1},
                                pickerOptions: {
                                        disabledDate(time){
                                                let year = new Date().getFullYear();
                                                let minYear = year - 18;
                                                return time.getTime() > new Date(minYear, 0, 1).getTime();
                                        }
                                },
                                upload: {
                                        isUpload: false,
                                        model: {
                                                stu_id: 0,
                                                stu_avatar_old: null,
                                                stu_avatar_new: ""
                                        }
                                },
                                edit: {                          // edit学生新增/修改功能的驱动数据
                                        isEdit: false,
                                        mode: true,
                                        model: {
                                                stu_id: 0,
                                                stu_name: '',
                                                stu_avatar: null,
                                                stu_cls_id: null,
                                                stu_sex: 1,
                                                stu_phone: '',
                                                stu_phone2: '',
                                                stu_born: null,
                                                stu_qualification: null,
                                                stu_school: '',
                                                stu_major: '',
                                                stu_address: '',
                                                stu_remark: ''
                                        }
                                },
                                edit2: {        // edit2学生分班（批量/单个）功能的驱动数据
                                        isEdit: false,
                                        model: {
                                                stu_id: null,   //null表示批量分班
                                                stu_ids: [],    //批量分班是存储勾选学生的编号
                                                stu_cls_id: null
                                        }
                                },
                                // edit3学生照片存档功能驱动数据
                                edit3: {
                                        isEdit: false,
                                        model: {stu_id: null, stu_avatar_old: null, stu_avatar_new: null}
                                },
                        };
                },
                computed: {
                        ...mapGetters(["getGroupByKey"])
                },
                methods: {
                        getData(currentPage = 1){
                                this.pagination.currentPage = currentPage;
                                // 向服务器发送ajax请求，获取数据，并更新到data节点的list中
                                this.$http({
                                        url: '/student/list',
                                        method: 'post',
                                        data: {
                                                ...this.search,
                                                begin: (this.pagination.currentPage - 1) * this.pagination.pageSize,
                                                pageSize: this.pagination.pageSize
                                        }
                                }).then(({list, total}) =>{
                                        this.list = list;
                                        this.pagination.total = total;
                                });
                        },
                        // 学生新增/修改功能相关方法
                        beginAdd(){
                                this.edit.mode = true;
                                this.edit.isEdit = true;
                        },
                        beginUpdate(stu){
                                this.edit.model.stu_id = stu.stu_id;
                                this.edit.model.stu_name = stu.stu_name;
                                this.edit.model.stu_avatar = stu.stu_avatar;
                                this.edit.model.stu_cls_id = stu.stu_cls_id;
                                this.edit.model.stu_sex = stu.stu_sex;
                                this.edit.model.stu_phone = stu.stu_phone;
                                this.edit.model.stu_phone2 = stu.stu_phone2;
                                this.edit.model.stu_born = stu.stu_born;
                                this.edit.model.stu_qualification = stu.stu_qualification;
                                this.edit.model.stu_school = stu.stu_school;
                                this.edit.model.stu_major = stu.stu_major;
                                this.edit.model.stu_address = stu.stu_address;
                                this.edit.model.stu_remark = stu.stu_remark;

                                this.edit.mode = false;
                                this.edit.isEdit = true;
                        },
                        //开始新增或编辑
                        save(){
                                if(this.edit.mode){
                                        let ids = this.$http({
                                                url: '/student/add',
                                                method: 'post',
                                                data: this.edit.model
                                        });
                                        this.edit.model.stu_id = ids;
                                        this.list.push(Object.assign({}, this.edit.model));
                                        this.$message({
                                                message: `学生："${ this.edit.model.stu_name }" 添加成功！`,
                                                type: 'success'
                                        });
                                }else{
                                        this.$http({url: '/student/update', method: 'post', data: this.edit.model});
                                        let i = this.list.findIndex(item => item.stu_id === this.edit.model.stu_id);
                                        this.list.splice(i, 1, Object.assign({}, this.edit.model));
                                        this.$message({message: '学生信息修改成功', type: 'success'});

                                }
                                this.edit.isEdit = false;
                        },
                        // 学生的分班(单个/批量)
                        //当选择项发生变化时会触发该事件
                        selectionChangeHandler(rows){
                                this.edit2.model.stu_ids = rows.map(item => item.stu_id);
                        },
                        //开始单个分班前
                        beginAssignClass(stu){
                                this.edit2.model.stu_id = stu.stu_id;
                                this.edit2.model.stu_cls_id = stu.stu_cls_id;
                                this.edit2.isEdit = true;
                        },
                        //批量分班前
                        beginAssignClassBatch(){
                                if(this.edit2.model.stu_ids.length === 0){
                                        this.$alert('请选勾选要分班的学生！', {title: '提示', type: 'warning', showClose: false});
                                }else{
                                        this.edit2.model.stu_cls_id = null;
                                        this.edit2.isEdit = true;
                                }
                        },
                        assignClass(){
                                this.$http({url: '/student/assignclass', method: 'post', data: this.edit2.model})
                                        .then(() =>{
                                                if(this.edit2.model.stu_id !== null){          // 单个分班
                                                        let i = this.list.findIndex(item => item.stu_id === this.edit2.model.stu_id);
                                                        this.list[i].stu_cls_id = this.edit2.model.stu_cls_id;
                                                }else{                                                         // 批量分班
                                                        this.list.forEach(item =>{
                                                                if(this.edit2.model.stu_ids.indexOf(item.stu_id) !== -1)
                                                                        item.stu_cls_id = this.edit2.model.stu_cls_id;
                                                        });
                                                }
                                                this.$message({message: '学生分班成功！', type: 'success'});
                                                this.edit2.isEdit = false;
                                        });
                        },
                        // 照片存档
                        beforeUploadHandler(file){
                                const isJPG = file.type === 'image/jpeg';
                                const isPNG = file.type === 'image/png';
                                const isLt2M = file.size / 1024 / 1024 < 2;

                                if((!isJPG) && (!isPNG)){
                                        this.$message.error('学生存档照片只能是 JPG 格式或PNG格式!');
                                }
                                if(!isLt2M){
                                        this.$message.error('学生存档照片大小不能超过 2MB!');
                                }
                                return (isJPG || isPNG) && isLt2M;
                        },
                        successHandler(response, file, fileList){
                                if(response.status === 200){
                                        this.edit3.model.stu_avatar_new = response.data;
                                        if(fileList.length > 1) fileList.splice(0, 1);
                                }else{
                                        this.$message.error('存档照片 预上传 失败！');
                                }
                        },
                        removeHandler(file, fileList){
                                this.edit3.model.stu_avatar_new = null;
                        },
                       //照片存档之前，点击照片存档按钮触发
                        beginUploadAvatar(stu){
                                this.edit3.model.stu_id = stu.stu_id;
                                this.edit3.model.stu_avatar_old = stu.stu_avatar;
                                this.edit3.isEdit = true;
                        },
	                //开始上传图片
                        uploadAvatar(){
                                this.$http({url: '/student/avatarupdate', method: 'post', data: this.edit3.model})
                                        .then(stu_avatar =>{
                                                let i = this.list.findIndex(item => item.stu_id === this.edit3.model.stu_id);
                                                this.list[i].stu_avatar = stu_avatar;
                                                this.$message({message: '学生照片存档成功！', type: 'success'});
                                                this.edit3.isEdit = false;
                                        });
                        },
                        // 导出学生信息
                        beginExportStudent() {

                        },
                        exportStudent() {
                                let header = {
                                        header: ["stu_name"]
                                };
                                let workbook = XLSX.utils.book_new();
                                let worksheet = XLSX.utils.json_to_sheet(this.list, header);
                                XLSX.utils.book_append_sheet(workbook, worksheet, 'abc');
                                XLSX.writeFile(workbook, 'abc.xlsx');
                        }
                },
                async created(){
                        // 发送ajax拿取所有班级信息
                        let p1 = this.$http({url: "/class/all"});
                        let p2 = this.$http({
                                url: '/student/list',
                                method: 'post',
                                data: {
                                        ...this.search,
                                        begin: (this.pagination.currentPage - 1) * this.pagination.pageSize,
                                        pageSize: this.pagination.pageSize
                                }
                        });
                        Promise.all([p1, p2])
                                .then(([a, b]) =>{
                                        this.listClass = a;
                                        this.list = b.list;
                                        this.pagination.total = total;
                                })
                                .catch((erro) =>{
                                        console.log(erro)
                                })
                }
        };
</script>

<style scoped>
	.el-container {
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
		height: 32px;
		display: flex;
		flex-direction: column;
		justify-content: center
	}
	/* 上传控件样式 */
	.avatar-uploader /deep/ .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		width: 200px;
		height: 280px;
	}
	.avatar-uploader /deep/ .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader /deep/ .el-upload-list__item {
		width: 200px;
		height: 280px;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 200px;
		height: 280px;
		line-height: 280px;
		text-align: center;
	}

	.avatar-wrapper {
		display: flex;
	}
	.seperator { border-right: 2px solid #ccc; margin: 0 40px; }
	.avatar-wrapper-old {  }
	.avatar-wrapper-old>.el-image { width: 200px; height: 280px; }
</style>