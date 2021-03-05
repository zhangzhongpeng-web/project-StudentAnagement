import http from '../utils/http.js';

export default {
        namespaced: true,
        state: {
                list: [],
                isInit: false           //标识是否初始化全部功能
        },
        getters: {},
        mutations: {
                _Init(state,list) {
                        state.list = list;
                        state.isInit = true;
                },
                _addRole(state,role){
                        state.list.push(role);
                },
                _updateRole(state,role) {
                        let i = state.list.findIndex(item => item.role_id === role.role_id);
                        state.list.splice(i,1,role)
                },
                _removeRole(state,role_id) {
                        let i = state.list.findIndex(item => item.role_id === role_id);
                        state.list.splice(i,1)
                }

        },
        actions: {
                async Init(context) {
                        if(context.state.isInit) return;
                        let list = await http({url:"/role/all"});
                        context.commit('_Init',list)    //第一个参数调用mutations下的函数，第二个数据list就是把获取之后的数据传给上面的函数
                },
                async addRole(context,role) {
                        await http({
                                method: "post",
                                url: "/role/add",
                                data: role
                        });
                        context.commit('_addRole',role)
                },
                async updateRole(context,role) {
                        await http({
                                method: "post",
                                url: "/role/update",
                                data: role
                        });
                        context.commit('_updateRole',role)
                },
                async removeRole(context,role_id) {
                        await http({
                                method: "post",
                                url: "/role/remove/" + role_id
                        });
                        context.commit('_removeRole',role_id)
                }
        }
}
