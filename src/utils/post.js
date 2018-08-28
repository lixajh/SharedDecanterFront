import request from '@/utils/request'
import qs from 'qs';
import Cookies from 'js-cookie'

export function post(url,data){
    // alert(JSON.stringify(data))
    return request({
      url: url,
      method: 'post',
      data: 
      qs.stringify({'params':JSON.stringify(data)})
      
    })
  }

  export function postWithoutCookie(url,data){
    let sid = Cookies.get('sid');
    // console.log("aaa:"+sid)
    // console.log("aba:"+Cookies.get('siid'))
    // Cookies.remove('sid');
    // var date = new Date();
    // date.setTime(date.getTime() -1000);
    // let expires = date.toGMTString();
    // console.log(expires)
    // Cookies.set('expires',expires);
    // Cookies.set('max-age',1);
    // alert(JSON.stringify(data))
    return request({
      // headers:{
      //   'Content-Type':'application/x-www-form-urlencoded',
      // },
      withCredentials: false,
      url: url,
      method: 'post',
      data: 
      qs.stringify({'params':JSON.stringify(data)})
      
    })
  }
  