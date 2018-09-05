//https://www.cnblogs.com/xuewuhen/p/7788189.html


export default{ 
    
    install(Vue, options) {

        /**
     * 注意:  定义type 规则时 不用做非空验证 
     *        只需要传入 required:true 即可
     * */
    /*必须为大小字母小写字母或数字*/
    const isLetterOrNum = (rule, value, callback) => {
        if(value != null && value != "") {
            const reg = /^[A-Za-z0-9_]+$/
            if (!reg.test(value)) {
            callback(new Error('该字段必须为字母数字或下划线!'))
            } else {
                callback()
            }
        }
        else{
            callback();
        }
        callback(new Error('该字段必须为字母数字或下划线!'))
    }

            
    const isPhone = (rule, value, callback) => {
        console.log("isphone")
        if(value != null && value != "") {
           
            const reg =  /^1\d{10}$/
            if (!reg.test(value)) {
            callback(new Error('请输入合法的手机号!'))
            } else {
                callback()
            }
        }
        else{
            callback();
        }
        callback(new Error('请输入合法的手机号!'))
    }

    
        Vue.prototype.filter_rules = function (item){
            
            let rules = [];
            if(item.required){
               rules.push({ required: true, message: '该输入项为必填项!', trigger: 'blur' });
            }
            if(item.maxLength){
               rules.push({ min:1,max:item.maxLength, message: '最多输入'+item.maxLength+'个字符!', trigger: 'blur' })
            }
            if(item.min&&item.max){       
               rules.push({ min:item.min,max:item.max, message: '字符长度在'+item.min+'至'+item.max+'之间!', trigger: 'blur' })
            }
            if(item.type){
                let type = item.type;
                switch(type) {
                    case 'email':
                        rules.push({ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'  });
                        break;
                    case 'letterOrNumber':
                        rules.push( { validator: isLetterOrNum, trigger: 'blur' });
                        break;    
                    case 'mobile':
                        rules.push( { validator: isPhone, trigger: 'blur' });
                        break;    
                    default:
                        rules.push({});
                        break;
                }
            }
            return rules;
        };
    
    
    // /*验证QQ号码*/
    // const isvalidateQQ= (rule, value, callback) => {        
    //     if(value != null && value != "") {
    //         if(!qq(value)) {
    //             callback(new Error('您输入的QQ号不正确!'))
    //         } else {
    //             callback()
    //         }
    //     }
    //     else{
    //         callback();
    //     }
    // }
    // /*验证手机号*/
    //    const isvalidateMobile= (rule, value, callback) => {        
    //     if(value != null && value != "") {
    //         if(!mobile(value)) {
    //             callback(new Error('您输入的手机号不正确!'))
    //         } else {
    //             callback()
    //         }
    //     }
    //     else{
    //         callback();
    //     }
    // }
       
    //    /*含有非法字符(只能输入字母、汉字)*/
    //    const isvalidateRegexn= (rule, value, callback) => {        
    //     if(value != null && value != "") {
    //         if(!regexn(value)) {
    //             callback(new Error('含有非法字符(只能输入字母、汉字)!'))
    //         } else {
    //             callback()
    //         }
    //     }
    //     else{
    //         callback();
    //     }
    // }
    //     /*请输入正整数*/
    //    const isvalidateInteger= (rule, value, callback) => {        
    //     if(value != null && value != "") {
    //         if(!integer(value)) {
    //             callback(new Error('请输入正整数!'))
    //         } else {
    //             callback()
    //         }
        // }
        // else{
        //     callback();
        // }
    }
    
}
   
    
