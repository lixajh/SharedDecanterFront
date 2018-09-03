<template>
<div>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click" style="cursor: pointer;">
      <!-- <div class="avatar-wrapper">
        <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
        <i class="el-icon-caret-bottom"></i>
      </div> -->
      <span class="el-dropdown-link" >
    {{ name}} <i class="el-icon-arrow-down el-icon--right"></i>
  </span>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item>
          <span @click="showChangePwdDialog = true" style="display:block;">重置密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
 </el-menu>
    <el-dialog title="修改密码" :visible.sync="showChangePwdDialog" width="600px">
      <el-form ref="form" :model="changePwdModel"  label-width="130px" >
        
          <el-form-item prop="oldPwd" label="旧密码：" :rules="filter_rules({required:true,type:'password'})"  >
            <el-input v-model="changePwdModel.oldPwd"  ></el-input>
          </el-form-item>
          <el-form-item prop="newPwd" label="新密码：" :rules="filter_rules({required:true,min:6,max:18,type:'password'})" >
            <el-input v-model="changePwdModel.newPwd"   ></el-input>
          </el-form-item>
          <el-form-item prop="ensureNewPwd" label="确认新密码：" :rules="ensurePwdRules" >
            <el-input v-model="changePwdModel.ensureNewPwd"   ></el-input>
          </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changePwd">确 定</el-button>
      </span>
</el-dialog>
</div>
 
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { validatePwd } from '@/utils/validate'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data(){
     
      var validateEnsurePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.changePwdModel.newPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      var customEnsurePwdRules = this.filter_rules({required:true,type:'mobile'});
      customEnsurePwdRules.push( { validator: validateEnsurePwd, trigger: 'blur' });

    return {
      //是否展示修改密码对话框
      showChangePwdDialog:false,
      //修改密码框数据
      changePwdModel:{
        oldPwd:'',
        newPwd:'',
        ensureNewPwd:''
      },
       ensurePwdRules: customEnsurePwdRules,
    
    }
  },
  created () {
    this.$store.dispatch('GetBasicInfo');
  },
  computed: {
    
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'default_operator_id'
    ]),
  
   
  },
  methods: {
    
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
     changePwd() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

