import request from '@/network/request'
import { post } from '@/network/post'

// export function getList(params) {
//   return request({
//     url: '/table/list',
//     method: 'get',
//     params
//   })
// }


export function getMemberList() {

  return post("/manager/member/list",{})
}

export function checkVisitor(record_id,check_status,sys_id) {
//check_status = 1: 通过 2：不通过
  return post("/api/visitor/check",{'record_id':record_id, 'check_status':check_status, 'sys_id':sys_id})
}

