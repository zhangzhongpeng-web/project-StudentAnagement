import {Loading, MessageBox} from 'element-ui';
import axios from 'axios';
import router from "../router"

let alwaysPendingPromise = new Promise(() => {});
let loadingInstance = null;
let loadingCount = 0;  // 记录当前还有几个ajax没结束

export default function(userOptions) {
        let defaultOptions = {
                method: "get",
                headers: {
                        "Content-Type": "application/json",
                        "Authorization": sessionStorage.getItem("token")
                }
        };
        let options = Object.assign({}, defaultOptions, userOptions);
        if(options.data) options.data = JSON.stringify(options.data);

                loadingCount++;
                loadingInstance = Loading.service({text: "loading...",background:"rgba(0,0,0,0.8)"});   //开启loading效果

        return axios(options)
                // 故意延时1秒做loading效果
                .then(response => {
                        return new Promise((resolve, reject) => {
                                setTimeout(() => {
                                        resolve(response);
                                }, 1000);
                        });
                })
                .then(async response => {
                        if(response.status === 200) {
                                switch(response.data.status) {
                                        case 200:
                                                loadingCount -- === 1 && loadingInstance.close(); //关闭loading效果
                                                return response.data.data;
                                        case 401:
                                                loadingCount -- === 1 && loadingInstance.close(); //关闭loading效果
                                                sessionStorage.removeItem("token");
                                                sessionStorage.removeItem("user_name");
                                                await MessageBox.alert("登录超时，请重新登录！", "提示", {type: "warning", showClose: false});
                                                router.replace('/login');
                                                return alwaysPendingPromise;
                                        case 199:
                                        case 404:
                                        case 500:
                                                throw new Error(response.data.message);
                                }
                        }
                })
                .catch(error => {
                        // 不管前面哪里错了，到我这里我希望收到一个错误对象，携带相关的错误信息，
                        // 我弹出来给用户看！！我兜底
                        loadingCount -- === 1 && loadingInstance.close(); //关闭loading效果
                       MessageBox.alert(error.message, "提示", {type: "warning"});
                        return alwaysPendingPromise; // 返回一个永远是pending的promise不要让后面的then执行
                });
};