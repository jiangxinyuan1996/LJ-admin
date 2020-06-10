<template>
  <div class="app-container">
    <div class="filter-container">
      <el-dialog
        title="复核信息确认"
        :visible.sync="dialogVisible1"
        width="30%"
        :before-close="handleClose"
      >
        <el-form ref="form" :model="temp" label-width="90px">
          <el-form-item label="流水号:">
            <span>{{ temp.bizorderno }}</span>
          </el-form-item>
          <el-form-item label="转出方:">
            <span>{{ outputer }}</span>
          </el-form-item>
          <el-form-item label="转入方:">
            <span>{{ inputer }}</span>
          </el-form-item>
          <el-form-item label="日期">
              <span>{{temp.time}}</span>
          </el-form-item>
          <el-form-item label="金额:">
            <span style="color: rgb(238, 120, 0);">{{ temp.amount }}</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 搜索区 -->
      <div v-if="showSearch" id="searchBox" style="margin:40px">
        <span style="margin-right:15px">转出方:</span>
        <el-select
            v-model="listQuery.from_user_id"
            filterable
            placeholder="请输入关键词"
            size="mini"
            >
            <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.nickname"
            :value="item.id">
            </el-option>
        </el-select>
        <span style="margin:0 15px">转入方:</span>
        <el-select
            v-model="listQuery.to_user_id"
            filterable
            placeholder="请输入关键词"
            size="mini"
            >
            <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.nickname"
            :value="item.id">
            </el-option>
        </el-select>
        <!-- <span style="margin:0 15px 0 35px">状态:</span>
        <el-select size="mini" clearable v-model="listQuery.state" placeholder="状态" style="width: 130px" @keyup.enter.native="handleFilter">
          <el-option v-for="item in states" :key="item.key" :label="item.value" :value="item.key" />
        </el-select> -->
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
        <el-button v-show="multipleSelection.length>0" size="mini" style="margin-left: 5px;" type="warning" @click="refuseList">
          批量驳回
        </el-button>
        <el-button v-show="multipleSelection.length>0" size="mini" style="margin-left: 5px;" type="success" @click="checkList">
          批量复核
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
      type="selection"
      width="55"
    />
    <el-table-column
        prop="bizorderno"
        label="流水号"
        sortable
        align="center"
        width="220"
      />
      <el-table-column
        prop="from_user_name"
        label="转出方"
        sortable
        align="center"
        width="120"
      />
      <el-table-column
        prop="to_user_name"
        label="转入方"
        sortable
        align="center"
        width="120"
      />
      <el-table-column
        prop="time"
        label="日期"
        sortable
        align="center"
        width="200"
      />
       <el-table-column
        prop="amount"
        label="金额(元)"
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
          <el-tooltip v-if="checkPermission(['机构管理员','复核员'])" class="item" effect="dark" content="驳回" placement="left">
            <el-button type="warning" icon="el-icon-refresh-left" circle size="mini" @click="refuse(row)" />
          </el-tooltip>
          <el-tooltip v-if="checkPermission(['机构管理员','复核员'])" class="item" effect="dark" content="复核" placement="right">
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
import { getTransferList,submitTransfer } from '@/api/tsyaccount'
import { getUserList } from '@/api/tsyLj'
export default {
  directives: { waves,permission },
  data() {
    return {
      dialogVisible1: false,
      alwaysFalse: false,
      showSearch: true,
      total: 11,
      listLoading: false,
      list: [],
      // 查询及分页参数
      start_time:'',
      end_time:'',
      listQuery: {
        page: 1,
        limit: 10,
        from_user_id:'',
        to_user_id:'',
        start_time: '',
        end_time: '',
      },
      // 修改列表参数
      temp: {},
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
      tableData: [],
      dialogFormVisible: false,
      multipleSelection: [],
      bankCodeOptions: [],
      businessCodeOptions: [],
      bankCode: {},
      businessCode: {},
    }
  },
  computed:{
   outputer(){
        let name = this.list.map(item=>{
          if(item.id===this.temp.from_user_id){
            return item.nickname
          }
        }).join('')
        return  name
      },
      inputer(){
        let name = this.list.map(item=>{
          if(item.id===this.temp.to_user_id){
            return item.nickname
          }
        }).join('')
        return  name
      }
    },
  mounted(){
    getUserList().then(res=>{
        this.list=[...res.data.fromList,...res.data.toList]
        // console.log(res.data)
    })
    this.handleFilter()
  },
  methods: {
    checkPermission,
    refuseList(){
      console.log('==========refuse===========')
      const h = this.$createElement
      this.$msgbox({
        title: '信息确认',
        message: h('p', null, [
          h('span', null, `是否确认驳回这`),
          h('span', { style: 'color: rgb(250,190,0)' }, `${this.multipleSelection.length}`),
          h('span', null, `条数据?`)
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            done()
            setTimeout(() => {
              instance.confirmButtonLoading = false
            }, 300)
          } else {
            done()
          }
        }
      }).then(action => {
        this.$message({
          type: 'info',
          message: 'action: ' + action
        })
      })
    },
    checkList(){

        console.log('==========refuse===========')
        const h = this.$createElement
        this.$msgbox({
          title: '信息确认',
          message: h('p', null, [
            h('span', null, `是否确认复核这`),
            h('span', { style: 'color: rgb(250,190,0)' }, `${this.multipleSelection.length}`),
            h('span', null, `条数据?`)
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            } else {
              done()
            }
          }
        }).then(action => {
          this.$message({
            type: 'info',
            message: 'action: ' + action
          })
        })
    },
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
    refuse(e){
      console.log('refuse');
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
      getTransferList(this.listQuery).then(res=>{
        console.log('待复核列表',res)
        if(res.success===1){
          this.listLoading=false
          this.tableData=res.data
        }else{
          this.$message({
            message:res.message,
            type:'error'
          })
          this.listLoading=false
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
      this.dialogVisible1 = true
      console.log(row)
      this.temp = { ...row }
    },
    submit() {
      submitTransfer({bizOrderNo:this.temp.bizorderno}).then(res=>{
        if(res.success===1){
          this.$message({
                message:res.message,
                type: 'success'
          })
        }else{
          this.$message({
                message: res.message,
                type: 'error'
          })
        }
          this.dialogVisible1 = false
          this.handleFilter()
      })
    },
    clearfzData() {
      this.dialogFormVisible = false
      // this.handleFilter()
    },
    handleClose() {
      this.dialogVisible1 = false
      this.$message({
        message: '调账复核已取消',
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
          if(index===4){
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
