<template>
	<!--container 相当于div-->
	<el-container class="page-container">
		<!--设置高度两种方法-->
		<el-header height="80px">
			<h1>潍科管理系统 V1.0</h1>
			<h2 v-show="">欢迎进入潍科教学管理系统</h2>
		</el-header>

		<el-container>
			<el-aside>
				<el-menu
					background-color="#9999cc"
					text-color="#fff"
					active-text-color="#ffd04b"
					:default-active="activeFuncKey"
					@select="menuSelectHandler">
					<template v-for="item in menuData">
						<!--key 判断 是空 为假-->
						<el-menu-item
							v-if="item.func_key"
							:index="item.func_key"
							:key="item.func_id">
							<i class="el-icon-menu"></i>
							<span v-text="item.func_name" slot="title"></span>
						</el-menu-item>
						<el-submenu
							v-else :index="item.func_id.toString()"
							:key=" item.func_id">
							<template slot="title">
								<i class="el-icon-setting"></i>
								<span v-text="item.func_name"></span>
							</template>
							<!--如果是空-->
							<template v-if="item.children">
								<el-menu-item v-for="itme2 in item.children"
								              :index="itme2.func_key"
								              :key="itme2.func_id"
								>
									<i class="el-icon-menu"></i>
									<span v-text="itme2.func_name"></span>
								</el-menu-item>
							</template>
						</el-submenu>
					</template>
				</el-menu>
			</el-aside>
			<el-container>
				<el-main>
					<!--tab选项卡 有两个参数 ：key存放的是唯一的 -->
					<!--value 是左边控制右边    v-model 左右控制 -->
					<el-tabs type="card"
					         closable
					         v-model="activeFuncKey"
					         @tab-remove="tabRemoveHader"
					>
						<el-tab-pane
							v-for="func_key in activeFuncKeys"
							:key="func_key"
							:name="func_key"
							:label="menu.find(item =>item.func_key === func_key).func_name">
							<!---->
							<component :is="views[func_key]"></component>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<!--转移字符 是以 &开头 ; 结尾-->
				<el-footer>版权所有&copy;2009H5 网址:www.wsdsg.con</el-footer>
			</el-container>
		</el-container>
	</el-container>
</template>
<script type="text/ecmascript-6">
        import views from '../../views';

        export default {
                name: "Home",
                data(){
                        return {
//                                这个渲染 就是和 route 一样进行渲染。
                                views,
                                //服务器回来的线性结构的数据
//	                        线性: 就是没有包含关系。
                                //把线性结构变成 属性结构。
                                //这个是默认选中状态。
                                activeFuncKey: "",
                                //创建一个数组  里面存放的时  func_key 从而点击的时候把 存放在 activeFunKeys
                                activeFuncKeys: [],
                                menu: []
                        }
                },
                computed: {
                        menuData(){
                                let result = [];
                                this.menu.filter(item => item.func_fid === 0).forEach(item =>{
                                        let node = Object.assign({}, item);
                                        let children = this.menu.filter(item2 => item2.func_fid === item.func_id);
                                        if(children.length > 0){
                                                //对象.属性
                                                node.children = [];
                                                children.forEach(item2 =>{
                                                        node.children.push(Object.assign({}, item2))
                                                })
                                        }
                                        result.push(node);
                                });
                                return result;
                        }
                },

                methods: {
                        menuSelectHandler(index, indexPath){
                                console.log(index, indexPath);
                                this.activeFuncKey = index;
                                //如果 func_key有多个 就不需要 再次添加
                                if(this.activeFuncKeys.indexOf(index) === -1){
                                        this.activeFuncKeys.push(index);
                                }
                        },
                        tabRemoveHader(name){
                                //截取调 第一个参数是你选中的某一个 ,第二个参数 是截取几个
                                this.activeFuncKeys.splice(this.activeFuncKeys.indexOf(name), 1);
                                //删除之后进行判断   删除的内容如果在activeFuncKeys中找到
                                //就让数组中的第一个激活，如果数组里面没有  就让activeFuncKey = “”空
                                if(this.activeFuncKeys.indexOf(this.activeFuncKey) === -1){             //删除的是刚刚激活的
                                        this.activeFuncKey = this.activeFuncKeys[0] || "";
                                }
                        },
                },
                async created(){
                        // 获取字典表所有信息，初始化
                        this.$store.dispatch("dictionary/Init");
                        //获取菜单
                        this.menu = await  this.$http({
                                url: "/user/getmenu",
                                method: "post"
                        });
                }

        }


</script>

<!--<style  lang="stylus" type="text/stylus" scoped>-->
<!--.page-container{-->
<!--height: 100%;-->
<!--}-->
<!--/*设置高度有两种想法  一个是在 css样式里面写这个高度-->
<!--还有一种就是 在 elempate 里面的标签里面直接写*/-->
<!--.el-header {-->
<!--background-color: #303133;-->
<!--color: white;-->
<!--display: flex;-->
<!--align-items: center;-->
<!--}-->
<!--h1{-->
<!--/*用来设置一些简单样式。*/-->
<!--/*font-size: 38px;*/-->
<!--}-->

<!--.el-aside{-->
<!--background-color: #606266;-->
<!--color: white;-->
<!--}-->
<!--.el-footer {-->
<!--background-color: #909399;-->
<!--//		 页脚的居中处理-->
<!--display flex ;-->
<!--align-items center;-->
<!--justify-content center;-->
<!--color: white;-->
<!--}-->
<!--</style>-->

<!--这个更加高级的书写样式-->
<style lang="stylus" type="text/stylus" scoped>
	.page-container
		height: 100%
		.el-header
			display flex
			align-items center
			background-color: #336666
			color: #fff
			h1
				font-size: 38px
		.el-aside
			background-color: #9999cc
		.el-footer
			display: flex
			align-items: center
			justify-content: center
			color: white
			background-color: #3d7878
		.el-main
			position relative

</style>