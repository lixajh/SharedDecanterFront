import request from '@/network/request'
import { post } from '@/network/post'

export function getDeviceList(obj) {
  var params = obj.search;
  params.page = obj.page;
  params.size = obj.size;
  return post("/manager/device/list",params)
}

export function getDeviceDetail(id) {
 
  return post("/manager/device/detail",{'id':id})
}

export function addOrEdit(obj) {
  if(obj.pkId){
    return post("/manager/device/update",obj)
  }else{
    return post("/manager/device/add",obj)
  }
}

export function deleteDevices(ids) {
 
  return post("/manager/device/delete",{'ids':ids.join()})
}

