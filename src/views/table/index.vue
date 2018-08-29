<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="加载中" border fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="来访人">
        <template slot-scope="scope">
          {{scope.row.visitor}}
        </template>
      </el-table-column>
      <el-table-column label="证件号码" >
        <template slot-scope="scope">
          {{scope.row.card_id}}
        </template>
      </el-table-column>
      <el-table-column label="到访时间" >
        <template slot-scope="scope">
           <i class="el-icon-time"></i>
          <span>{{scope.row.date}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="审核状态" width="130" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.check_status | statusCssFilter">{{scope.row.check_status | statusFilter}}</el-tag>
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
        <el-form-item label="访客名称：" :label-width="formLabelWidth" >
          <el-input v-model="selectedRecord.visitor"  :readonly = isReadonly ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="手机号码：" :label-width="formLabelWidth">
          <el-input v-model="selectedRecord.phone"  :readonly = isReadonly></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="证件类型：" :label-width="formLabelWidth" >
          <el-select  v-model="selectedRecord.card_type" placeholder="证件类型" :disabled=isReadonly>
            <el-option label="一代身份证" :value=1></el-option>
            <el-option label="驾照" :value=2></el-option>
            <el-option label="护照" :value=3></el-option>
            <el-option label="二代身份证" :value=4></el-option>
            <el-option label="护照机读码" :value=5></el-option>
            <el-option label="台胞证" :value=6></el-option>
            <el-option label="港澳通行证" :value=7></el-option>
            <el-option label="其他" :value=8></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
          <el-form-item label="证件号码：" :label-width="formLabelWidth">
            <el-input v-model="selectedRecord.idcard_no"   :readonly = isReadonly></el-input>
          </el-form-item>
      </el-col>

      <el-col :span="12">
          <el-form-item label="来访时间：" :label-width="formLabelWidth">
            <el-input v-model="selectedRecord.start_date"  :readonly = isReadonly></el-input>
          </el-form-item>
      </el-col>

      <el-col :span="12">
          <el-form-item label="结束时间：" :label-width="formLabelWidth">
            <el-input v-model="selectedRecord.end_date"  :readonly = isReadonly></el-input>
          </el-form-item>
      </el-col>

      <el-col :span="24">
          <el-form-item label="来访事由：" :label-width="formLabelWidth" >
            <el-input v-model="selectedRecord.reason"  :readonly = isReadonly type="textarea"></el-input>
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
import { getVisitorList,checkVisitor,getVisitorDetail } from '@/api/table'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      start_date:'', 
      end_date:'',
      page_size:10,
      row_index:0,
      currentPage: 1,
      totalSize: 1,
      dialogDetailVisible:false,
      selectedRecord:null,
      formLabelWidth: '90px',
      isReadonly:true,
      cardType:{
        1:''
      }
     
    }
  },
  computed: {
    // ...mapGetters([
    //     'default_operator_id'
    //   ])
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
  },

  created() {

    this.page_size = localStorage.getItem('page_size')!=null ?   new Number(localStorage.getItem('page_size')) : 10;
    this.fetchData()
  },

  methods: {
    fetchData() {

      this.listLoading = true
      this.row_index = (this.currentPage-1)*this.page_size
      if(this.row_index == null){
        this.row_index = 0;
      }
      
      // getVisitorList(this.start_date, this.end_date,this.page_size,this.row_index,this.default_operator_id).then(response => {
      //   var data = response.resultData;
      //   var dataList = data.dataList;
      //   for (var i=0;i<dataList.length;i++){
      //     dataList[i].passLoading=false;
      //     dataList[i].rejectLoading=false;
      //   }
      //   this.list = dataList;
      //   this.listLoading = false;
      //   this.currentPage = data.pageNow;
      //   this.totalSize = data.totalSize;
      //   this.page_size = data.pageSize;
      // }).catch(e => {
      //   this.listLoading = false
      // })
    },

    detail(data){
     
      this.selectedRecord=data;
      this.dialogDetailVisible = true;
      // getVisitorDetail(data.record_id,this.default_operator_id).then(response => {
      //   if(response.resultCode=='SUCCESS'){
      //     this.selectedRecord=response.resultData;
      //   }
      // })
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