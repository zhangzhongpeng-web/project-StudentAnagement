//我要把views下面的所有页面级组件统一导入

let files = require.context('./',true,/index.vue$/);
let views = {};
files.keys().forEach(filePath => {
        let key = filePath.match(/.*\/(.*)\/index.vue$/)[1];
        views[key] = files(filePath).default;
});
export  default  views;