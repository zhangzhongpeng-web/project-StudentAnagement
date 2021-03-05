export default {
        namespaced: true,
        state: {
                list: [],
                isInit: false
        },
        getters: {
               //获取字典表里的员工类型
                getGroupByKey(state){
                       //通过计算属性返回一个函数，并传参，groupKey可以是自己想要的参数
                        return function(groupKey){
                                return state.list.filter(item => item.dic_group_key === groupKey)
                        };
                }
        },
        mutations: {
                _Init(state, list){
                        state.list = list;
                        state.isInit = true;
                }
        },
        actions: {
               async Init({state,commit,rootState}) {
                        if(state.isInit) return;
                        let list = await rootState.http({url: "/dictionary/all"});
                        commit("_Init",list)
                }
        }
}