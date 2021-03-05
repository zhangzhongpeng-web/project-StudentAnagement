<template>
	<router-view></router-view>
</template>

<script type="text/ecmascript-6">
	export default {
	        name: "App"
	}
</script>

<style>
	/*当前项目相关的所有全局样式，适合放在这里来写*/
	html,body {width:100%;height: 100%}
	html{min-width: 1300px;min-height: 700px}
	/* 表单验证自定义样式 */
	.el-input__validateIcon { color: #67c23a; font-weight: bold; }

	/* 自定义树的样式 */
	.custom-tree .el-tree-node { position: relative; padding-left: 16px; }
	.custom-tree .el-tree-node__children { padding-left: 16px; }
	.custom-tree .el-tree-node :last-child:before { height: 38px; }
	.custom-tree .el-tree>.el-tree-node:before { border-left: none; }
	.custom-tree-container .el-tree>.el-tree-node:after { border-top: none; }
	.custom-tree .el-tree-node:before { content: ""; left: -4px; position: absolute; right: auto; border-width: 1px; }
	.custom-tree .el-tree-node:after{ content: ""; left: -4px; position: absolute; right: auto; border-width: 1px; }
	.custom-tree .el-tree-node__expand-icon.is-leaf { display: none; }
	.custom-tree .el-tree-node:before { border-left: 1px dashed #b8b9bb; bottom: 0; height: 100%; top: -20px; width: 1px; }
	.custom-tree .el-tree-node:after { border-top: 1px dashed #b8b9bb; height: 20px; top: 20px; width: 24px; }
	.custom-tree .el-tree-node__content { height: 40px; }
	/* el-tabs自定义样式 */
	.el-tabs { height: 100%; display: flex; flex-direction: column; position: absolute; left: 0; top: 0; width: 100%; }
	/* 父组件如何控制子组件内部渲染的元素的样式 */
	.el-tabs >>> .el-tabs__header { flex-shrink: 0; }
	.el-tabs /deep/ .el-tabs__content { flex-grow: 1; overflow: auto; }
	.el-tab-pane { min-height: 100%; padding: 20px; box-sizing: border-box; }
	/* el-dialog自定义样式 */
	.el-dialog__wrapper { position: absolute; background-color: rgba(0,0,0, .5); }
	.el-dialog { margin-top: 50px !important; }
	.page-container .el-aside{border: none}
	/* 自定义el-drawer的样式 */
	.custom-drawer.el-drawer__wrapper { position: absolute; background-color: rgba(0,0,0,0.5); }

</style>