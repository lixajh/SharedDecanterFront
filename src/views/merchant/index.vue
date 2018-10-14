<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <el-input v-model="search.name" placeholder="名称" class="search-box" @keyup.enter.native="fetchData"></el-input>
    <!-- <el-input v-model="search.name" placeholder="标题" class="search-box" @keyup.enter.native="fetchData"></el-input> -->
    
    <el-button  type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="toAdd">增加</el-button>
    <!-- <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="batchDelete">批量删除</el-button>
    <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="batchDelete">批量下架</el-button> -->
      
    <!-- 表格区域 -->
    <el-table class="table-frame"  :data="list" v-loading.body="listLoading" element-loading-text="加载中" border fit highlight-current-row @selection-change="handleSelectionChange">
    <!-- 勾选框 -->
    <el-table-column type="selection" width="55">
    </el-table-column>
      <el-table-column align="center" label='序号' width="95">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          {{scope.row.address}}
        </template>
      </el-table-column>
      <el-table-column label="设备数量">
        <template slot-scope="scope">
          {{scope.row.deviceCount}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" >
        <template slot-scope="scope">
           <i class="el-icon-time"></i>
          <span>{{scope.row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作"  align="center" >
        <template slot-scope="scope">
          <el-button @click="detail(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteRecord(scope.row)"  type="text" size="small" :loading="scope.row.deleteLoading">删除</el-button>
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

  <el-dialog v-if="action=='add' || action=='edit'" :title="action == 'add'?'增加':'编辑'" :visible.sync="dialogDetailVisible" width='800px'>
    <el-form ref="edit_form"  :model="selectedRecord">
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="名称：" :label-width="formLabelWidth" prop="name"  :rules="filter_rules({required:true, min:3, max:36})"  >
            <el-input v-model="selectedRecord.name"></el-input>
          </el-form-item>  
        </el-col>
        <el-col :span="12" v-if="isEdit">
          <el-form-item label="设备数量：" :label-width="formLabelWidth" prop="title">
            <el-input :value="selectedRecord.deviceCount"  :readonly = isEdit></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="12" v-if="isEdit">
          <el-form-item label="状态：" :label-width="formLabelWidth" >
            <el-input :value="selectedRecord.dataStatus | statusFilter"  :readonly = isEdit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人：" :label-width="formLabelWidth" prop="contact" :rules="filter_rules({required:true, max:30})" >
            <el-input v-model="selectedRecord.contact" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话：" :label-width="formLabelWidth" prop="phone" :rules="filter_rules({required:true, type:'mobile'})" >
            <el-input v-model="selectedRecord.phone"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="isEdit">
            <el-form-item label="创建时间：" :label-width="formLabelWidth">
              <el-input :value="selectedRecord.createTime | formatDate"  :readonly = isEdit></el-input>
            </el-form-item>
        </el-col>

        <el-col :span="24">
            <el-form-item label="地址：" :label-width="formLabelWidth"  prop="address" :rules="filter_rules({required:true, max:255})">
              <el-input v-model="selectedRecord.address"  type="textarea" ></el-input>
            </el-form-item>
        </el-col>

        <el-col :span="24">
            <el-form-item label="备注：" :label-width="formLabelWidth" >
              <el-input v-model="selectedRecord.remark"  type="textarea" ></el-input>
            </el-form-item>
        </el-col>

      </el-row>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="action = ''">取 消</el-button>
          <el-button type="primary" @click="addOrEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {formatDate} from '@/utils/date.js';
import { merchantAddOrEdit,getMerchantList,getMerchantDetail,deleteMerchants} from '@/api/merchant'
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      page_size:10,
      currentPage: 1,
      totalSize: 1,
      selectedRecord:{},
      formLabelWidth: '90px',
      multipleSelection:false,
      search:{
        name:""
      },
      action:""
    }
  },
  computed: {

    isEdit:function(){
      return this.action=='edit'
    },

    dialogDetailVisible:{
      get:function(){
        return this.action != null;
      },
      set:function(a){
          this.action = '';
      },
    }
  },
  filters: {
      formatDate(time) {
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },
      statusFilter:function(index) {
        const map = {
          0: '未上架',
          1: '已上架',
        }
         if(index > 1){
           return map[0]
         }
        return map[index]
       }
  },

  created() {
    this.page_size = localStorage.getItem('page_size')!=null ?   new Number(localStorage.getItem('page_size')) : 10;
    this.fetchData()
  },

  methods: {
    //获取列表
    fetchData() {
      this.listLoading = true
      getMerchantList({"page":this.currentPage, "size":this.page_size,"search":this.search}).then(response => {
        var data = response.data.data;
        var dataList = data.list;
        this.list = dataList;
        this.listLoading = false;
        this.currentPage = data.pageNum;
        this.totalSize = data.total;
        this.page_size = data.pageSize;
      }).catch(e => {
        this.listLoading = false;
      })
    },
//新增前清空实体
    toAdd(){
      this.action='add';
      this.selectedRecord = {};
    },
//获取详情
    detail(data){
     
      this.selectedRecord=data;
      this.action='edit';
      getMerchantDetail(data.pkId).then(response => {
        
          this.selectedRecord=response.data.data;
       
      })
    },
//新增或编辑（根据有没有pkId来判断）
    addOrEdit(data){
     this.$refs.edit_form.validate(valid => {
        if (valid) {
          this.listLoading = true;
          merchantAddOrEdit(this.selectedRecord).then(response => {
          if(response.data.code == 200){
            this.dialogDetailVisible = false;
            this.fetchData();
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          }
        this.listLoading = false;
      }).catch(e => {
        this.listLoading = false;
      })
        } else {
          console.log('error submit!!');
        }
      })
    },
//删除
  deleteRecord(data){
    data.deleteLoading = true;
    deleteMerchants([data.pkId]).then(response => {
          this.$message({
              message: '操作成功',
              type: 'success'
            });

        data.deleteLoading = false;
        this.fetchData();
      }).catch(e => {
         data.deleteLoading = false;
      })
  },
//批量删除
    batchDelete(){
        var seletedIds = this._.map(this.multipleSelection, 'pkId');
        this.listLoading = true;
        deleteMerchants(seletedIds).then(response => {
          this.$message({
              message: '操作成功',
              type: 'success'
            });

        this.listLoading = false;
        this.fetchData();
      }).catch(e => {
        this.listLoading = false;
      })
    },

     handleSizeChange(val) {
       //页面size发生变化
       localStorage.setItem('page_size',val);
        this.page_size = val;
        this.fetchData();
        
      },
      handleCurrentChange(val) {
        //翻页
        this.currentPage = val;
        this.fetchData();
      },
       handleSelectionChange(val) {
         //多选发生变化
        this.multipleSelection = val;
      }

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