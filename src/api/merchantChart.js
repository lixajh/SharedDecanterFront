import { post } from '@/network/post'

export function getMerchantChartList(obj) {
  var params = obj.search;
  params.page = obj.page;
  params.size = obj.size;
  return post("/manager/merchantChart/list",params)
}

export function getMerchantChartDetail(id) {
 
  return post("/manager/merchantChart/detail",{'id':id})
}

export function merchantChartAddOrEdit(obj) {
  if(obj.pkId){
    return post("/manager/merchantChart/update",obj)
  }else{
    return post("/manager/merchantChart/add",obj)
  }
}

export function deleteMerchantCharts(ids) {
 
  return post("/manager/merchantChart/delete",{'ids':ids.join()})
}

