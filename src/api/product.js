import { post } from '@/network/post'

export function getProductList(obj) {
  var params = obj.search;
  params.page = obj.page;
  params.size = obj.size;
  return post("/manager/product/list",params)
}

export function getProductDetail(id) {
 
  return post("/manager/product/detail",{'id':id})
}

export function productAddOrEdit(obj) {
  if(obj.pkId){
    return post("/manager/product/update",obj)
  }else{
    return post("/manager/product/add",obj)
  }
}

export function deleteProducts(ids) {
 
  return post("/manager/product/delete",{'ids':ids.join()})
}
export function startSellProducts(ids) {
 
  return post("/manager/product/startSell",{'ids':ids.join()})
}
export function stopSellProducts(ids) {
 
  return post("/manager/product/stopSell",{'ids':ids.join()})
}

