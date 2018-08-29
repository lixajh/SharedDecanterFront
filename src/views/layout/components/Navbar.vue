<template>
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
        <!-- <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
           {{ name }}
          </el-dropdown-item>
        </router-link> -->
        <!-- <el-dropdown-item divided> -->
        <el-dropdown-item>
          <span @click="dialogTableVisible = true" style="display:block;">切换运营商</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- <el-dialog title="切换运营商" :visible.sync="dialogTableVisible"  width='400px'>
      <el-radio v-for="item in operators" :key="item.operatorId" v-model="defaultOperatorId" :label=item.operatorId >{{item.company_name}}</el-radio>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="changeDefaultOp">确 定</el-button>
  </span>
</el-dialog> -->

  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data(){
    return {
      dialogTableVisible:false,
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

