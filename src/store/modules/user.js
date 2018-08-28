import { login, logout, getBasicInfo,getCardList } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    login_status: 0,//0:位置 -1：未登录 1：登陆
    name: '',
    avatar: '',
    roles: [],
    cards: [],
    default_operator_id:''
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
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_CARDS: (state, cards) => {
      state.cards = cards
    },
    SET_DEFAULT_OPERATOR_ID: (state, default_operator_id) => {
      state.default_operator_id = default_operator_id
    }
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
          // const data = response.resultData
          // var memberInfo = data.member_info
          // commit('SET_ROLES', data.roles)
          commit('SET_LOGIN_STATUS', 1)
          // commit('SET_NAME', memberInfo.nickName)
          // commit('SET_AVATAR', memberInfo.phone)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取卡列表
    GetCardList({ commit, state }) {
      return new Promise((resolve, reject) => {
        getCardList().then(response => {
          const data = response.resultData
          var cardList = data.list       
          commit('SET_CARDS', cardList)
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
          commit('SET_ROLES', [])
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
