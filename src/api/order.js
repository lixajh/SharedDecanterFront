import { post } from '@/network/post'

export function getOrderList(obj) {
  var params = obj.search;
  params.page = obj.page;
  params.size = obj.size;
  return post("/manager/order/list",params)
}

export function getOrderDetail(id) {
 
  return post("/manager/order/detail",{'id':id})
}

export function orderEdit(obj) {

    return post("/manager/order/update",obj)
}


