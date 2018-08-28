import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import router from '../router'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 60000 ,// 请求超时时间
  headers: {
    'Content-Type':'application/x-www-form-urlencoded;charset=utf-8',
    dataType:"json",
    // 'Access-Control-Allow-Origin': 'http://localhost:9528',
    // 'Access-Control-Allow-Credentials':  'true'
    // 'authKey': Lockr.get("authKey"),
}
})

// request拦截器
service.interceptors.request.use(request => {
  // if (store.getters.token) {
  //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  // }
  // console.log(request.headers)

  return request
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * resultCode为FAIL是抛错
  */
    const res = response.data
    

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.errorCode == -996) {
        MessageBox.confirm('你已被登出，点击确定重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.commit('SET_LOGIN_STATUS', -1)
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
        return Promise.reject('error')
      }
      if (res.errorCode == -997) {
        
        store.commit('SET_LOGIN_STATUS', -1)
        location.reload()
        return Promise.reject('error')
        
      }
      if (res.errorCode == -999) { 
        return Promise.reject('error')
        
      }
      if (res.errorCode == -796) { 
        Message({
          message: "前置机离线，请稍后再试",
          type: 'error',
          duration: 2 * 1000
        })
        return Promise.reject('error')
        
      }

      if (res.resultCode == 'FAIL') {
        Message({
          message: res.resultMsg,
          type: 'error',
          duration: 2 * 1000
        })

      return Promise.reject(res)
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error.code)// for debug
    Message({
      message: '系统错误，请稍后再试:'+error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)
// service.defaults.withCredentials = false
export default service
