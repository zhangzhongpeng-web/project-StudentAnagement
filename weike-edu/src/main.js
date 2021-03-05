import  Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import  store from './store'
import './assetes/reset.css';
import http from './utils/http.js'


Vue.use(ElementUI);
Vue.prototype.$http = http;     //把http发ajax的方法挂在所有组件的原型对象上，所有组件就不用在每个文件import导入他了，
                                                        //就可以直接通过this调用了
//导入，注册，使用三步走
import app from './App.vue'
//创建根实例，并渲染根组件
new Vue({
        el: "#app",
        components: {
                app    //键值对简写
        },
        template: "<app />",
        router,
        store
});