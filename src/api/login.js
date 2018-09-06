import { post ,postWithoutCookie} from '@/network/post'
import md5 from 'js-md5';

export function login(username, password) {

  return postWithoutCookie("/manager/admin/login",{'username':username, 'password':md5(password)})
}


export function getBasicInfo() {
  return post("/manager/admin/detail",null)
}



export function logout() {
  return post("/manager/admin/logout",null)
}
