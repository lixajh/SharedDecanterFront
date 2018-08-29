import request from '@/utils/request'
import qs from 'qs';
import Cookies from 'js-cookie'

export function post(url,data){
    // alert(JSON.stringify(data))
    return request({
      url: url,
      method: 'post',
      data: 
      // qs.stringify({'params':JSON.stringify(data)})
      qs.stringify({data})
      
    })
  }

  export function postWithoutCookie(url,data){
    return request({
      // headers:{
      //   'Content-Type':'application/x-www-form-urlencoded',
      // },
      withCredentials: false,
      url: url,
      method: 'post',
      data: qs.stringify(data)
      // qs.stringify({'params':JSON.stringify(data)})
      
      
    })
  }
  