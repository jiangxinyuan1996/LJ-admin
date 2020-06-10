<template>
  <div class="app-container">
    <div class="filter-container">
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible2"
        width="30%"
        center>
        <span>您还没有交易密码,点击设置跳转页面配置交易密码</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="handleDump">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="提现信息确认"
        :visible.sync="dialogVisible1"
        width="30%"
        :before-close="handleClose"
      >
        <el-form ref="form" :model="temp" label-width="90px" :rules="rules">
          <el-form-item label="流水号:">
            <span>{{ temp.bizorderno }}</span>
          </el-form-item>
          <el-form-item label="分账方姓名:">
            <span>{{ temp.nickname }}</span>
          </el-form-item>
          <el-form-item label="银行户名:">
            <span>{{ temp.name }}</span>
          </el-form-item>
          <el-form-item label="账号:">
            <span>{{ temp.card_no }}</span>
          </el-form-item>
          <el-form-item label="银行:">
            <span>{{ temp.bank }}</span>
          </el-form-item>
          <el-form-item label="金额:">
            <span>{{ temp.amount }}</span>
          </el-form-item>
          <el-form-item label="提现密码:" prop="payPwd">
            <el-input type="password" v-model.number="temp.payPwd" autocomplete="off" style="width:50%"></el-input>  
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 搜索区 -->
      <div v-if="showSearch" id="searchBox" style="margin:40px">
        <span style="margin-right:15px">用户名:</span>
        <el-select
          v-model="listQuery.userid"
          filterable
          size="mini"
          placeholder="请输入关键词"
        >
          <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
          />
        </el-select>
        <span style="margin:0 18px;padding-left:5px;">日期:</span>
        <el-date-picker
          v-model="start_time"
          size="mini"
          style="width:13%"
          type="date"
          value-format="timestamp"
          placeholder="选择日期"
          @change="startchange"
        />
        <span style="margin-right:15px;margin-left:15px;">至</span>
        <el-date-picker
          v-model="end_time"
          size="mini"
          style="width:13%"
          type="date"
          value-format="timestamp"
          placeholder="选择日期"
          @change="endchange"
        />
        <el-button type="primary" size="mini" style="margin-left:15px;" @click="handleFilter">
          查询
        </el-button>
      </div>
    </div>
    <!-- 查询信息表格 -->
    <el-table
      v-loading="listLoading"
      size="mini"
      :data="tableData"
      show-summary
      :summary-method="getSummaries"
      border
      highlight-current-row
      style="width: 100%;margin-left:40px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        prop="bizorderno"
        label="流水号"
        sortable
        align="center"
        width="220"
      />
      <el-table-column
        prop="nickname"
        label="用户名"
        sortable
        align="center"
        width="160"
      />
      <el-table-column
        prop="time"
        label="日期"
        sortable
        align="center"
        width="160"
      />
      <el-table-column
         prop="name"
         label="银行户名"
          sortable
         align="center"
         width="100"
       />
      <el-table-column
        prop="card_no"
        label="账号"
        sortable
        align="center"
        width="180"
      />
      <el-table-column
        prop="bank"
        label="开户行"
        sortable
        align="center"
        width="160"
      />
      <el-table-column
        prop="amount"
        label="提现金额(元)"
        sortable
        align="center"
        width="150"
      />
      <el-table-column
        label="操作"
        align="center"
        width="140"
      >
        <template slot-scope="{ $index,row }">
          <el-tooltip  v-if="checkPermission(['机构管理员','复核员'])" class="item" effect="dark" content="提现审核" placement="top">
            <el-button type="success" icon="el-icon-check" circle size="mini" @click="open(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="margin-top:20px;"
      :small="true"
      :current-page="listQuery.page"
      :page-sizes="[5,10]"
      :page-size="10"
      layout="total, sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import waves from '@/directive/waves'
import permission from '@/directive/permission/index.js'
import checkPermission from '@/utils/permission'
import { getReviewList,getTrancpwd,transactionReview } from '@/api/tsyaccount'
import { getUserList } from '@/api/tsyLj'

export default {
  directives: { waves,permission },
  data() {
    return {
      dialogVisible1: false,
      dialogVisible2: false,
      alwaysFalse: false,
      showSearch: true,
      start_time:'',
      end_time:'',
      total: 11,
      listLoading: false,
      list: [],
      // 查询及分页参数
      listQuery: {
         page: 1,
        limit: 10,
        start_time: '',
        end_time: '',
        userid: ''
      },
      detailToUpdate: {
        account_name: '',
        account_no: '',
        bank_code: '',
        account_show: ''
      },
      // 修改列表参数
      temp: {},
      rules: {
        payPwd: [{ required: true, message: '请填写交易密码', trigger: 'blur' }],
      },
      // mock数据
      tableData: [],
      dialogFormVisible: false,
    }
  },
  mounted(){
    this.handleFilter()
    getUserList().then(res=>{
      this.list=[...res.data.fromList,...res.data.toList]
    })
  },
  methods: {
    checkPermission,
    startchange(e){
      if(e==null){
        this.start_time=''
      }
    },
    endchange(e){
      if(e==null){
        this.end_time=''
      }
    },
    handleFilter() {
      this.listLoading=true
       if(this.start_time!==null&&this.start_time!==''){
          this.listQuery.start_time=this.start_time
        }else{
          this.listQuery.start_time=''
        }
        if(this.end_time!==null&&this.end_time!==''){
          this.listQuery.end_time=this.end_time- (-1 * 3600 * 24 * 1000)
        }else{
          this.listQuery.end_time=''
        }
      getReviewList({...this.listQuery,status:'1'}).then(res=>{
        if(res.success===1){
          this.tableData=res.data
          this.listLoading=false
        }else{
          this.listLoading=false
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.listQuery.page = val
      this.handleFilter()
      // 页码切换分页调用请求传值
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.listQuery.limit = val
      // console.log(this.listQuery.limit)
      this.handleFilter()
    },
    handleSelectionChange(val) {
      this.isShow = true
      //   console.log(val)
      this.multipleSelection = val
      if (val.length === 0) {
        this.isShow = false
      }
    },
    updataForm(data) {
      this.tableData = [data]
      this.dialogFormVisible = false
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    open(row) {
      console.log(row)
       getTrancpwd().then(res=>{
        if(res.success===1){
          this.dialogVisible1 = true
          this.temp = { ...row }
          console.log(this.temp)
        }else{
          this.dialogVisible2=true
        }
        })
    },
    handleDump(){
      this.$router.push({
            name:'setting',
            params:{
              page:'4'
            }
          })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          transactionReview({bizOrderNo:this.temp.bizorderno,payPwd:this.temp.payPwd}).then(res=>{
            if(res.success===1){
              this.$message({
                message:res.message,
                type:'success'
              })
              this.handleFilter()
              this.dialogVisible1=false
            }else{
              this.$message({
                message:res.message,
                type:'error'
              })
              this.dialogVisible1=false
            }
          })
        }
      })
     },
    clearfzData() {
      this.dialogFormVisible = false
      // this.handleFilter()
    },
    handleClose() {
      this.dialogVisible1 = false
      this.$message({
        message: '提现已取消',
        type: 'info'
      })
    },
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if(index===6){
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += '';
            } else {
              sums[index] = 'N/A';
            }
          }
      })
      return sums
    }
  }
}
</script>
