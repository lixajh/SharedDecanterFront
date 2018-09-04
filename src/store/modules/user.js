import { login, logout, getBasicInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    login_status: 0,//0:未知 -1：未登录 1：登陆
    name: '',
    avatar: '',
  },

  mutations: {
    SET_LOGIN_STATUS: (state, login_status) => {
      state.login_status = login_status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(data => {
          // const data = response.data
          // setToken(data.token)
           commit('SET_LOGIN_STATUS', 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetBasicInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getBasicInfo().then(response => {

          const data = response.data.data
          var memberInfo = data
          // commit('SET_ROLES', data.roles)
          commit('SET_LOGIN_STATUS', 1)
      
          commit('SET_NAME', memberInfo.username)
          commit('SET_AVATAR', memberInfo.username)
          resolve(response)
        }).catch(error => {  
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_LOGIN_STATUS', -1)
          // removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_LOGIN_STATUS', -1)
        // removeToken()
        resolve()
      })
    }
  }
}

export default user
