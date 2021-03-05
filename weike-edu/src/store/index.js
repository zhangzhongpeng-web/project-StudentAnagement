import Vue from 'vue';
import Vuex from 'vuex';
import func from './func.js';
import  role from './role.js';
import  classroom from './classroom.js';
import dictionary from './dictionary.js';
import http from '../utils/http.js'

Vue.use(Vuex);  //之后就可以直接用this.$vuex....

let store = new Vuex.Store({
                modules: {dictionary,classroom, func,role},       //modules存放微型子仓库
                state: {        //存储组件公用组件数据
                       http
                },
               //当仓库中的states数据,多个组件都要经过一定的处理计算才可以用,getters相当于仓库的计算属性
                getters: {},
                //vuex规定:只有mutations中的方法才可以修改state中保存的数据
                //vuex规定: mutatiojs节点中的方法在调用时第一个参数总是state本身
                //vuex规定:mutations节点中的方法在调用时必须使用commit函数进行调用
                //mutations节点中不能包含异步好事的代码
                mutations: { },
               //vuex规定,actons节点中的方法可以包含异步耗时的代码,但绝对不可以修改state中的数据
                //vuex规定,actions节点中的方法调用时第一个参数是仓库的赏上下文对象,里面包含的重要属性有:state,commit
                //vuex规定:actions节点中方法组件调用时必须用dispatch来间接调用
                actions: {}
});

export  default store;
