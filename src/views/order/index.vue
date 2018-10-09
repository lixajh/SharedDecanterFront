<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <el-input v-model="search.name" placeholder="名称" class="search-box" @keyup.enter.native="fetchData"></el-input>
    <el-input v-model="search.title" placeholder="标题" class="search-box" @keyup.enter.native="fetchData"></el-input>
    
    <el-button  type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    <!-- <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="toAdd">增加</el-button>
    <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="batchDelete">批量删除</el-button>
    <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="batchStopSell">批量下架</el-button> -->
      
    <!-- 表格区域 -->
    <el-table class="table-frame"  :data="list" v-loading.body="listLoading" element-loading-text="加载中" border fit highlight-current-row @selection-change="handleSelectionChange">
    <!-- 勾选框 -->
    <!-- <el-table-column type="selection" width="55">
    </el-table-column> -->
      <el-table-column align="center" label='序号' width="95">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="订单号">
        <template slot-scope="scope">
          {{scope.row.orderNo}}
        </template>
      </el-table-column>
      <el-table-column label="设备编号" >
        <template slot-scope="scope">
          {{scope.row.deviceCode}}
        </template>
      </el-table-column>
      <el-table-column label="商品名称" >
        <template slot-scope="scope">
          {{scope.row.productName}}
        </template>
      </el-table-column>
      <el-table-column label="商家名称" >
        <template slot-scope="scope">
          {{scope.row.merchantName}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" >
        <template slot-scope="scope">
           <i class="el-icon-time"></i>
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" >
        <template slot-scope="scope">
           <i class="el-icon-time"></i>
          <span>{{scope.row.payTime}}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作"  align="center" >
        <template slot-scope="scope">
          <el-button @click="detail(scope.row)" type="text" size="small">详情</el-button>
          <!-- <el-button @click="deleteRecord(scope.row)"  type="text" size="small" >备注</el-button> -->
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

  <el-dialog v-if="action=='add' || action=='edit'" title="详情" :visible.sync="dialogDetailVisible" width='800px'>
    <el-form ref="edit_form"  :model="selectedRecord">
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="订单号：" :label-width="formLabelWidth">
            <el-input v-model="selectedRecord.orderNo" :readonly = true></el-input>
          </el-form-item>  
        </el-col>

        <el-col :span="12">
          <el-form-item label="设备编号：" :label-width="formLabelWidth" >
            <el-input v-model="selectedRecord.deviceCode" :readonly = true></el-input>
          </el-form-item>  
        </el-col>

        <el-col :span="12">
          <el-form-item label="商品名称：" :label-width="formLabelWidth"  >
            <el-input v-model="selectedRecord.productName" :readonly = true></el-input>
          </el-form-item>  
        </el-col>

        <el-col :span="12">
          <el-form-item label="商家名称" :label-width="formLabelWidth"  >
            <el-input v-model="selectedRecord.merchantName" :readonly = true></el-input>
          </el-form-item>  
        </el-col>
       
         <el-col :span="12" v-if="isEdit">
          <el-form-item label="状态：" :label-width="formLabelWidth" >
            <el-input :value="selectedRecord.orderStatus | statusFilter"  :readonly = true></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="isEdit">
            <el-form-item label="创建时间：" :label-width="formLabelWidth">
              <el-input :value="selectedRecord.createTime | formatDate"  :readonly = true></el-input>
            </el-form-item>
        </el-col>

        <el-col :span="12" v-if="isEdit">
            <el-form-item label="支付时间：" :label-width="formLabelWidth">
              <el-input :value="selectedRecord.payTime | formatDate"  :readonly = true></el-input>
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
import { orderEdit,getOrderList,getOrderDetail} from '@/api/order'
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
        name:"",
        title:""
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
          console.log('a'+a)
          this.action = '';
      },
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
      getOrderList({"page":this.currentPage, "size":this.page_size,"search":this.search}).then(response => {
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

//获取详情
    detail(data){
     
      this.selectedRecord=data;
      this.action='edit';
      getOrderDetail(data.pkId).then(response => {
        
          this.selectedRecord=response.data.data;
       
      })
    },
//新增或编辑（根据有没有pkId来判断）
    edit(data){
     this.$refs.edit_form.validate(valid => {
        if (valid) {
          this.listLoading = true;
          orderEdit(this.selectedRecord).then(response => {
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
  },
  filters: {
     
      statusFilter:function(index) {
        const map = {
          0: '待支付',
          1: '支付成功',
          2: '支付失败',
          3: '设备工作中',
          4: '设备故障',
          5: '完成',
        }
         if(index > 5){
           return map[0]
         }
        return map[index]
       }
  },
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