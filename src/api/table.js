import request from '@/utils/request'
import { post } from '@/utils/post'

// export function getList(params) {
//   return request({
//     url: '/table/list',
//     method: 'get',
//     params
//   })
// }


export function getVisitorList(start_date, end_date,page_size,row_index,sys_id) {

  return post("/api/visitor/v2/getVisitList",{'start_date':start_date
            , 'end_date':end_date,'page_size':page_size,'row_index':row_index,'sys_id':sys_id})
}

export function checkVisitor(record_id,check_status,sys_id) {
//check_status = 1: 通过 2：不通过
  return post("/api/visitor/check",{'record_id':record_id, 'check_status':check_status, 'sys_id':sys_id})
}

export function getVisitorDetail(record_id,sys_id) {
  //check_status = 1: 通过 2：不通过
    return post("/api/visitor/getVisitDetail",{'record_id':record_id, 'sys_id':sys_id})
  }