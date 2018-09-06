import { post } from '@/network/post'

export function getMemberList(params) {

  return post("/manager/member/list",params)
}

export function getMemberDetail(id) {
//check_status = 1: 通过 2：不通过
  return post("/manager/member/detail",{'id':id})
}

