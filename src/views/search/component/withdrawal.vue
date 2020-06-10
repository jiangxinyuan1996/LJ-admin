<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索区 -->
      <div v-if="showSearch" id="searchBox" style="margin:40px">
        <span style="margin-right:15px">用户名:</span>
        <el-select
          v-model="listQuery.userid"
          filterable
          placeholder="请输入关键词"
          size="mini"
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
          @change="startchange"
          placeholder="选择日期"
        />
        <span style="margin-right:15px;margin-left:15px;">至</span>
        <el-date-picker
          v-model="end_time"
          style="width:13%"
          size="mini"
          type="date"
          value-format="timestamp"
          @change="endchange"
          placeholder="选择日期"
        />
        <el-button type="primary" size="mini" style="margin-left:15px;" @click="handleFilter">
          查询
        </el-button>
      </div>
      <!-- <el-button size="mini" v-waves class="filter-item funcbtn" v-if="isShow" type="success" :disabled="disabled" @click="handleCommit">
        提交/复核
      </el-button>
      <el-button size="mini" v-if="isShow" v-waves class="filter-item funcbtn" type="danger" icon="el-icon-delete" @click="handleDeleteAll">
        批量删除
      </el-button>
      <el-button size="mini" v-if="isShow" v-waves class="filter-item funcbtn" type="primary" @click="handleCheckVerify">
        校验四要素
      </el-button>

      <el-button size="mini"  v-waves class="filter-item funcbtn" type="primary"  style="float:right;margin-left:15px;" @click="handleCommitAll">
        全部提交
      </el-button>
      <el-button size="mini"  v-waves class="filter-item funcbtn" type="warning"  style="float:right" @click="handleExport">
        导出
      </el-button> -->
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
      style="width: 100%;margin-left:50px"
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
        label="分账方名称"
        sortable
        align="center"
        width="140"
      />
      <el-table-column
         prop="name"
         label="银行户名"
         sortable
         align="center"
         width="110"
       />
       <el-table-column
         prop="time"
         label="日期"
         sortable
         align="center"
         width="160"
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
        label="金额(元)"
        sortable
        align="center"
        width="150"
      />
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="margin-top:20px"
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
import { getReviewList } from '@/api/tsyaccount'
import { getUserList } from '@/api/tsyLj'

export default {
  directives: { waves },
  data() {
    return {
      isShow: false,
      alwaysFalse: false,
      showSearch: true,
      total: 11,
      listLoading: false,
      list: [],
      start_time:'',
      end_time:'',
      // 查询及分页参数
      listQuery: {
        page: 1,
        limit: 10,
        userid:'',
        start_time: '',
        end_time: ''
      },
      temp: {
        status: ''
      },
      rules: {
        business_code: [{ required: true, message: '必填项', trigger: 'blur' }],
        bank_code: [{ required: true, message: '必填项', trigger: 'blur' }],
        account_type: [{ required: true, message: '必填项', trigger: 'blur' }],
        account_no: [{ required: true, message: '必填项', trigger: 'blur' }],
        account_name: [{ required: true, message: '必填项', trigger: 'blur' }],
        amount: [{ required: true, message: '必填项', trigger: 'blur' }],
        id: [{ required: true, message: '必填项', trigger: 'blur' }],
        id_type: [{ required: true, message: '必填项', trigger: 'blur' }],
        tel: [{ required: true, message: '必填项', trigger: 'blur' }],
        sub_data: [{ required: true, message: '必填项', trigger: 'blur' }]

      },
      // 状态选项
      states: [
        {
          key: '0',
          value: '待提交'
        },
        {
          key: '1',
          value: '待审核'
        },
        {
          key: '-1',
          value: '异常'
        },
        {
          key: '2',
          value: '交易成功'
        },
        {
          key: '3',
          value: '交易失败'
        }
      ],
      // mock数据
      tableData: [],
      dialogFormVisible: false,
      bankCodeOptions: [],
      businessCodeOptions: [],
      bankCode: {},
      businessCode: {}
    }
  },
  mounted(){
    getUserList().then(res=>{
      this.list=[...res.data.fromList,...res.data.toList]
    })
  },
  methods:{
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
      handleFilter(){
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
        getReviewList(this.listQuery).then(res=>{
          console.log(res.data)
          if(res.success===1){
            this.listLoading=false
            this.tableData=res.data
          }else{
            this.listLoading=false
            this.$message({
              message:res.message,
              type:'error'
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
    },
    clearfzData() {
      this.dialogFormVisible = false
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
    //
  }
}
</script>
