import { post } from '@/network/post'

export function getMerchantList(obj) {
  var params = obj.search;
  params.page = obj.page;
  params.size = obj.size;
  return post("/manager/merchant/list",params)
}

export function getMerchantDetail(id) {
 
  return post("/manager/merchant/detail",{'id':id})
}

export function merchantAddOrEdit(obj) {
  if(obj.pkId){
    return post("/manager/merchant/update",obj)
  }else{
    return post("/manager/merchant/add",obj)
  }
}

export function deleteMerchants(ids) {
 
  return post("/manager/merchant/delete",{'ids':ids.join()})
}

