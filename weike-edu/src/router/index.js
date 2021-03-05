import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../pages/Login';
import Home from '../pages/Home'
Vue.use(VueRouter);
let router = new VueRouter({
        routes: [
                {path: "/", redirect: "/login"},
                {path:"/login", component: Login},
                {path: "/home",component: Home}
        ]
});

router.beforeEach((to,from,next) => {
        if(to.path === "/home" && !sessionStorage.getItem("token")) {
                next("/login");
        }
        next()
});
export default router;
