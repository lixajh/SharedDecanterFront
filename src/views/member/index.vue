<template>
  <div class="app-container">

     <!-- 搜索框 -->
    <el-input v-model="nicknameSearch" placeholder="按用户名搜索" class="search-box" @keyup.enter.native="fetchData"></el-input>
    <el-button  type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>

    <!-- 表格区域 -->

    <el-table class="table-frame"  :data="list" v-loading.body="listLoading" element-loading-text="加载中" border fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="用户昵称">
        <template slot-scope="scope">
          {{scope.row.nickname}}
        </template>
      </el-table-column>
      <el-table-column label="openId" >
        <template slot-scope="scope">
          {{scope.row.openId}}
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" >
        <template slot-scope="scope">
           <i class="el-icon-time"></i>
          <span>{{scope.row.lastLoginTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" >
        <template slot-scope="scope">
           <i class="el-icon-time"></i>
          <span>{{scope.row.createTime | formatDate}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作"  align="center" >
        <template slot-scope="scope">
        <el-button @click="detail(scope.row)" type="text" size="small">查看</el-button>
        
        <el-button @click="check(scope.row,true)" v-if="scope.row.check_status == 0 || scope.row.check_status == 3" type="text" size="small" :loading="scope.row.passLoading">通过</el-button>
        <el-button @click="check(scope.row,false)" v-if="scope.row.check_status == 0 || scope.row.check_status == 3" type="text" size="small"  :loading="scope.row.rejectLoading">拒绝</el-button>
      </template>
      </el-table-column>

    </el-table>

     <el-pagination class="page_right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 15, 20, 25, 30]"
      :page-size="page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize">
    </el-pagination>

    <el-dialog v-if="selectedRecord" title="详情" :visible.sync="dialogDetailVisible" width='800px'>
      <el-form v-if="selectedRecord" :model="selectedRecord">

    <el-row :gutter="40">
      <el-col :span="12">
        <el-form-item label="昵称：" :label-width="formLabelWidth" >
          <el-input v-model="selectedRecord.nickname"  :readonly = isReadonly ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="openId：" :label-width="formLabelWidth">
          <el-input v-model="selectedRecord.openId"  :readonly = isReadonly></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
          <el-form-item label="注册时间：" :label-width="formLabelWidth">
            <el-input :value="selectedRecord.createTime | formatDate"  :readonly = isReadonly></el-input>
          </el-form-item>
      </el-col>

      <el-col :span="12">
          <el-form-item label="最后登录：" :label-width="formLabelWidth">
            <el-input :value="selectedRecord.lastLoginTime | formatDate"  :readonly = isReadonly></el-input>
          </el-form-item>
      </el-col>

      <el-col :span="12">
          <el-form-item label="地区：" :label-width="formLabelWidth" >
            <el-input v-model="selectedRecord.address"  :readonly = isReadonly></el-input>
          </el-form-item>
      </el-col>

      </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogDetailVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogDetailVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {formatDate} from '@/utils/date.js';
import { getMemberList,getMemberDetail} from '@/api/member'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      page_size:10,
      currentPage: 1,
      totalSize: 1,
      dialogDetailVisible:false,
      selectedRecord:null,
      formLabelWidth: '90px',
      isReadonly:true,
     
    }
  },
  computed: {
    // ...mapGetters([
    //     'default_operator_id'
    //   ])
  },
  filters: {
    
      formatDate(time) {
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },
  },

  created() {

    this.page_size = localStorage.getItem('page_size')!=null ?   new Number(localStorage.getItem('page_size')) : 10;
    this.fetchData()
  },

  methods: {
    fetchData() {

      this.listLoading = true
      
      getMemberList({"page":this.currentPage, "size":this.page_size}).then(response => {
        var data = response.data.data;
        var dataList = data.list;
        this.list = dataList;
        this.listLoading = false;
        this.currentPage = data.pageNum;
        this.totalSize = data.total;
        this.page_size = data.pageSize;
      }).catch(e => {
        this.listLoading = false
      })
    },

    detail(data){
     
      this.selectedRecord=data;
      this.dialogDetailVisible = true;
      getMemberDetail(data.pkId).then(response => {
        
          this.selectedRecord=response.data.data;
       
      })
    },

    check(data,pass){
      if(data.passLoading||data.rejectLoading){
        return;
      }
      //check_status = 1: 通过 2：不通过
      var check_status=2
      if(pass){
        data.passLoading=true;
        check_status = 1
      }else{
        data.rejectLoading=true;
      }
      // checkVisitor(data.record_id,check_status,this.default_operator_id).then(response => {
      //     data.passLoading=false;
      //     data.rejectLoading=false;
      //   if(response.resultCode=='SUCCESS'){
      //     this.fetchData()
      //   }
      // }).catch(e =>{
      //     data.passLoading=false;
      //     data.rejectLoading=false;
      // })
    },
     handleSizeChange(val) {
       localStorage.setItem('page_size',val)
        this.page_size = val;
        this.fetchData();
        
      },
      handleCurrentChange(val) {
        
        this.currentPage = val;
        this.fetchData();
      }

  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    // default_operator_id: function (after, before) {
    //   this.answer = 'Waiting for you to stop typing...:'+after
    //   this.fetchData();
    // },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
    .page_right {
    float: right;
    margin: 30px;
    }
    .el-loading-mask {
    position: absolute;
    z-index: 1999;//复制这个类的目的是修改z-index的值小于2000，以满足在loading的时候不要覆盖导航栏的dropdown按钮。
    background-color: rgba(255,255,255,.9);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    -webkit-transition: opacity .3s;
    transition: opacity .3s;}
</style>