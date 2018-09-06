<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <el-input v-model="usernameSearch" placeholder="按用户名搜索" class="search-box" @keyup.enter.native="fetchData"></el-input>
    <el-button  type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>

    <!-- 表格区域 -->
    <el-table class="table-frame" :data="list" v-loading.body="listLoading" element-loading-text="加载中" border fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{scope.row.username}}
        </template>
      </el-table-column>
      <el-table-column label="手机号码" >
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" >
        <template slot-scope="scope">
           <i class="el-icon-time"></i>
          <span>{{scope.row.lastLoginTime | formatDate}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="审核状态" width="130" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.check_status | statusCssFilter">{{scope.row.check_status | statusFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作"  align="center" >
        <template slot-scope="scope">
        <el-button @click="detail(scope.row)" type="text" size="small">编辑</el-button>
        
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
      <el-form v-if="selectedRecord" ref="detail_form" :model="selectedRecord">

    <el-row :gutter="40">
      <el-col :span="12">
        <el-form-item label="用户名：" :label-width="formLabelWidth" prop="username"  :rules="filter_rules({required:true, min:3, max:10, type:'letterOrNumber'})"  >
          <el-input  v-model="selectedRecord.username"  ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="手机号码：" :label-width="formLabelWidth" prop="phone"  :rules="filter_rules({ type:'mobile'})">
          <el-input v-model="selectedRecord.phone"  ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
          <el-form-item label="创建时间：" :label-width="formLabelWidth">
            <el-input :value="selectedRecord.createTime | formatDate"   :readonly = true></el-input>
          </el-form-item>
      </el-col>

      <el-col :span="12">
          <el-form-item label="最后登录时间：" :label-width="formLabelWidth">
            <el-input :value="selectedRecord.lastLoginTime | formatDate"  :readonly = true></el-input>
          </el-form-item>
      </el-col>
     
      </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


import {formatDate} from '@/utils/date.js';
import { getAdminList,getAdminDetail,adminEdit } from '@/api/admin'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      page_size:10,   
      currentPage: 1,    
      formLabelWidth: '90px',
      usernameSearch:'',
     selectedRecord:{
       username:'',
       phone:''
     },
     totalSize: 0,
     dialogDetailVisible:false,
    }
  },
  filters: {
    statusCssFilter:function(status) {
      const statusCssMap = {
        0: 'danger',
        1: 'success',
        2: 'danger',
        3: 'warning',
        4: 'gray'
      }
      return statusCssMap[status]
    },

    statusFilter:function(status) {
      const statusMap = {
        0: '待审核',
        1: '通过',
        2: '拒绝',
        3: '待审核',//等待被访人审核
        4: '待管理员审核'
      }
      return statusMap[status]
    },
      formatDate(time) {
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm');
      },
  },

  created() {

    this.page_size = localStorage.getItem('page_size')!=null ?   new Number(localStorage.getItem('page_size')) : 10;
    this.fetchData()
  },

  methods: {
    fetchData() {

      this.listLoading = true
      getAdminList({"page":this.currentPage, "size":this.page_size,"username": this.usernameSearch}).then(response => {
        var data = response.data.data;
        var dataList = data.list;
        for (var i=0;i<dataList.length;i++){
          dataList[i].passLoading=false;
          dataList[i].rejectLoading=false;
        }
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
      getAdminDetail(data.pkId).then(response => {
          this.selectedRecord=response.data.data;
      })
    },
    edit(){
     
     this.$refs.detail_form.validate(valid => {
        if (valid) {
          this.listLoading = true
          adminEdit(this.selectedRecord).then(response => {
          if(response.data.code == 200){
            this.dialogDetailVisible = false;
            this.fetchData();
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          }
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
        } else {
          console.log('error submit!!')
        }
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