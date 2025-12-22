import axios from 'axios'
import { ElMessage } from 'element-plus'

const http = axios.create({
  baseURL: 'https://v3pz.itndedu.com/v3pz',
  timeout: 10000
})

//添加拦截器
// 添加请求拦截器
http.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = localStorage.getItem('pz_token')
  //不需要token的白名单
  const whiteUrl = ['/login', '/get/code', '/user/authenticate']
  if (token && !whiteUrl.includes(config.url)) {
    config.headers['x-token'] = token
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  //对接口异常的数据，给用户提示
  if (response.data.code !== -1) {
    ElMessage.warning(response.data.message)
  }
  //token过期处理
  if (response.data.code === -2) {
    ElMessage.warning('登录过期，请重新登录')
    //删除token
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')
    //跳转到登录页
    // window.location.href = '/login'
    window.location.href = window.location.origin
  }
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default http