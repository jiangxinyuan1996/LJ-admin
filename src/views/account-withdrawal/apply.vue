<template>
  <div class="app-container">
    <div class="filter-container">
      <el-dialog
        title="提现申请信息"
        :visible.sync="dialogVisible1"
        width="30%"
        :before-close="handleClose"
      >
        <el-form ref="form" :model="temp" label-width="120px" :rules="formRules">
          <el-form-item
            label="提现账户名"
          >
            <span>{{ temp.nickname }}</span>
          </el-form-item>
          <el-form-item label="金额:" prop="amount">
            <!-- <span style="color: rgb(238, 120, 0);">{{ temp.amount_show }}</span> -->
            <el-input v-model.number="temp.amount" type="text" autocomplete="off" style="width:50%" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 搜索区 -->
      <div v-if="showSearch" id="searchBox" style="margin:40px">
        <span style="margin-right:15px">账户名:</span>
        <el-select
          v-model="listQuery.userid"
          filterable
          clearable
          size="mini"
          placeholder="请输入关键词"
        >
          <el-option
            v-for="item in createlist"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
          />
        </el-select>
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
        prop="nickname"
        label="账户名"
        sortable
        align="center"
        width="160"
      />
      <el-table-column
        prop="balance.allAmount"
        label="账户余额(元)"
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
          <el-tooltip v-if="checkPermission(['机构管理员','操作员'])" class="item" effect="dark" content="提现申请" placement="top">
            <el-button type="warning" icon="el-icon-check" circle size="mini" @click="open(row)" />
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
import { getUserList } from '@/api/tsyLj'
import { getWithdrawalList, addWithdrawal, applyWithdrawal } from '@/api/tsyaccount'

export default {
  directives: { waves, permission },
  data() {
    const validateAmount = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请填写金额'))
      }
      if (value > this.maxAmount) {
        callback(new Error('提现金额应小于可提现金额'))
      } else {
        callback()
      }
    }
    return {
      createWithdrawalDialogVisible: false,
      createWithdrawal: {
        userid: '',
        amount: ''
      },
      createlist: [],
      dialogVisible1: false,
      alwaysFalse: false,
      showSearch: true,
      total: 0,
      listLoading: false,
      list: [
        {
          value: '张三'
        },
        {
          value: '李四'
        },
        {
          value: '王五'
        }
      ],
      // 查询及分页参数
      listQuery: {
        page: 1,
        limit: 10,
        submit_time_start: '',
        submit_time_end: '',
        userid: ''
      },
      temp: {
        amount: ''
      },
      maxAmount: null,
      formRules: {
        userid: [{ required: true, message: '必填项', trigger: 'change' }],
        amount: [{ required: true, trigger: 'blur', validator: validateAmount }]
      },
      // mock数据
      tableData: [],
      dialogFormVisible: false
    }
  },
  mounted() {
    this.handleFilter()
    getUserList().then(res => {
      this.createlist = [...res.data.fromList, ...res.data.toList]
    })
  },
  methods: {
    checkPermission,
    handleFilter() {
      this.listLoading = true
      // console.log('handlefilter')
      getWithdrawalList({ userid: this.listQuery.userid, page: this.listQuery.page, limit: this.listQuery.limit }).then(res => {
        if (res.success === 1) {
          this.tableData = res.data
          this.total = Number(res.count)
          this.listLoading = false
        } else {
          this.listLoading = false
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addWithdrawal(this.temp).then(res => {
            console.log(res)
            if (res.success === 1) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.handleFilter()
              this.dialogVisible1 = false
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
              this.dialogVisible1 = false
            }
          })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.listQuery.page = val
      this.handleFilter()
      this.listQuery.page = 1
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
      this.temp = Object.assign(this.temp, row)
      this.temp.amount = row.balance.allAmount
      this.maxAmount = row.balance.allAmount
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
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 1) {
          const values = data.map(item => Number(item.balance.allAmount))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += ''
          } else {
            sums[index] = 'N/A'
          }
        }
      })

      return sums
    }
  }
}
</script>
