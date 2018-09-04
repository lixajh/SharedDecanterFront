import request from '@/network/request'
import { post } from '@/network/post'
import md5 from 'js-md5';
// export function getList(params) {
//   return request({
//     url: '/table/list',
//     method: 'get',
//     params
//   })
// }


export function getAdminList(params) {
  return post("/manager/admin/list",params)
}

export function changePwd(oldPwd,newPwd) {
  return post("/manager/admin/changePwd",{'oldPwd':md5(oldPwd), 'newPwd':md5(newPwd)})
}

export function getAdminDetail(id) {
  return post("/manager/admin/detail",{'id':id})
}

