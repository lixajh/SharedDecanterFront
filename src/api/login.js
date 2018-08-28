import request from '@/utils/request'
import { post ,postWithoutCookie} from '@/utils/post'
import md5 from 'js-md5';

// export function login(username, password) {
//   return request({
//     url: '/user/login',
//     method: 'post',
//     data: {
//       username,
//       password
//     }
//   })
// }

export function login(username, password) {

  return postWithoutCookie("/manager/admin/login",{'username':username, 'password':md5(password)})
}


export function getBasicInfo() {
  return post("/api/user/getBasicInfo",null)
}

export function getCardList() {
  return post("/api/card/getSysList",null)
}

export function logout() {
  return post("/api/user/logout",null)
  // return request({
  //   url: '/user/logout',
  //   method: 'post'
  // })
}
