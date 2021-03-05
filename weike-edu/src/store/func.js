import http from '../utils/http.js'

export default {
        namespaced: true,
        state: {
                list: [],
                isInit: false
        },
        getters: {
                listToTree(state){
                        let result = [];
                        state.list.filter(item => item.func_fid === 0).forEach(item =>{
                                let node = Object.assign({}, item);
                                let children = state.list.filter(func => func.func_fid === item.func_id);
                                if(children.length > 0){
                                        node.children = [];
                                        children.forEach(func => node.children.push(Object.assign({}, func)));

                                }
                                result.push(node);
                        });
                        return result;
                }
        },
        mutations: {
                _init(state, list){
                        state.list = list;
                        state.isInit = true;
                },
                _removeFunc(state, func_id){
                        let i = state.list.findIndex(item => item.func_id === func_id);
                        state.list.splice(i, 1);
                },
                _addFunc(state, func){
                        state.list.push(func);
                },
                _updateFunc(state, func){
                        let i = state.list.findIndex(item => item.func_id === func.func_id);
                        state.list.splice(i, 1, func);
                }
        },
        actions: {
                async init(context){
                        if(context.state.isInit) return;
                        let list = await http({url: "/function/all"});
                        context.commit('_init', list)
                },
                async removeFunc(context, func_id){
                        await http({url: "/function/remove/" + func_id, method: "post"});
                        context.commit("_removeFunc", func_id)
                },
                async addFunc(context, func){
                        func.func_id = await  http({
                                method: "post",
                                url: "/function/add",
                                data: func
                        });
                        context.commit("_addFunc", func);
                },
                async updateFunc(context, func){
                        await http({method: "post", url: "/function/update", data: func});
                        context.commit("_updateFunc", func)
                }
        }
}