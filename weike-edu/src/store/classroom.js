import http from '../utils/http.js'

export default {
        namespaced: true,
        state: {
                list: [],
                isInit: false
        },
        getters: {
                getNameById(state) {
                        return clsr_id => state.list.length > 0 ? state.list.find(item => item.clsr_id === clsr_id).clsr_name : '';
                }
        },
        mutations: {
                toggleStatus(state, clsr_id) {          // 教室占用或闲置状态切换
                        console.log(clsr_id)
                        let i = state.list.findIndex(item => item.clsr_id === clsr_id);
                        let obj = Object.assign({}, state.list[i]);
                        obj.clsr_occupy = obj.clsr_occupy === 1 ? 0 : 1;
                        state.list.splice(i, 1, obj);
                },
                _Init(state,list) {
                        state.list = list;
                        state.isInit = true;
                },
                _addClassroom(state,clsr){
                        clsr.clsr_occupy = 0;
                        console.log(clsr);
                        state.list.push(clsr);

                },
                _updateClassroom(state,clsr) {
                        let i = state.list.findIndex(item => item.clsr_id === clsr.clsr_id);
                        state.list.splice(i,1,clsr);
                },
                _removeClassroom(state,clsr_id) {
                        let i = state.list.findIndex(item => item.clsr_id === clsr_id);
                        state.list.splice(i,1);
                }
        },
        actions: {
                async Init(context) {
                        if(context.state.isInit) return;
                        let list = await http({url: "/classroom/all"});
                        context.commit('_Init',list)
                },
                async addClassroom(context,clsr) {
                        let id = await http({
                                method: "post",
                                url: "/classroom/add",
                                data: clsr
                        });
                        clsr.clsr_id = id;
                        context.commit('_addClassroom',clsr)
                },
                async updateClassroom(context,clsr) {
                        await http({
                                method: "post",
                                url: "/classroom/update",
                                data: clsr
                        });
                        context.commit('_updateClassroom',clsr)
                },
                async removeClassroom(context,clsr_id){
                        await http({
                                url: "/classroom/remove/" + clsr_id
                        });
                        context.commit('_removeClassroom',clsr_id)
                }
        }
}