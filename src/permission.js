import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  
  if (store.getters.login_status == 0){
    store.dispatch('GetBasicInfo').then(() =>{
      if (store.getters.login_status == 1) {
        if (to.path === '/login') {
          next({ path: '/' })
        } else {
          next()
        }
      } else {
        if (whiteList.indexOf(to.path) != -1) {
          next()
        } else {
          next('/login')
          NProgress.done()
        }
      }
    }).catch(e => {
      console.log(e)
      NProgress.done()
      // next('/login')
    })
  }else if(store.getters.login_status == -1){
    if (whiteList.indexOf(to.path) != -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }else if(store.getters.login_status == 1){
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  }else{
    next()
  }
  
  
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
