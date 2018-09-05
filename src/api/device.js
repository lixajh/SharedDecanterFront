import request from '@/network/request'
import { post } from '@/network/post'

// export function getList(params) {
//   return request({
//     url: '/table/list',
//     method: 'get',
//     params
//   })
// }


export function getDeviceList(obj) {
  var params = obj.search;
  params.page = obj.page;
  params.size = obj.size;
  return post("/manager/device/list",params)
}

export function getDeviceDetail(id) {
//check_status = 1: 通过 2：不通过
  return post("/manager/device/detail",{'id':id})
}

