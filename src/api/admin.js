import { post } from '@/network/post'
import md5 from 'js-md5';

export function getAdminList(params) {
  return post("/manager/admin/list",params)
}

export function changePwd(oldPwd,newPwd) {
  return post("/manager/admin/changePwd",{'oldPwd':md5(oldPwd), 'newPwd':md5(newPwd)})
}

export function getAdminDetail(id) {
  return post("/manager/admin/detail",{'id':id})
}

export function adminEdit(obj) {
  var params = {}
  params.username = obj.username;
  params.phone = obj.phone;
  params.pkId = obj.pkId;
  return post("/manager/admin/update",params)
}