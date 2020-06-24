<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索区 -->
      <div v-if="showSearch" id="searchBox" style="margin:40px">
        <span style="margin-right:15px">用户名:</span>
        <el-select
          v-model="listQuery.userid"
          clearable
          filterable
          placeholder="请输入关键词"
          size="mini"
          style="marginBottom:10px"
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
          clearable
          size="mini"
          style="width:13%;marginBottom:10px"
          type="date"
          value-format="timestamp"
          placeholder="选择日期"
          @change="startchange"
        />
        <span style="margin-right:15px;margin-left:15px;">至</span>
        <el-date-picker
          v-model="end_time"
          clearable
          style="width:13%;marginBottom:10px"
          size="mini"
          type="date"
          value-format="timestamp"
          placeholder="选择日期"
          @change="endchange"
        />

        <span style="margin:0 15px">状态:</span>
        <el-select
          v-model="listQuery.status"
          clearable
          filterable
          style="width:10%;marginBottom:10px"
          placeholder="请选择状态"
          size="mini"
        >
          <el-option
            v-for="item in states"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>

        <el-button type="primary" size="mini" style="margin-left:15px;" @click="handleFilter">
          查询
        </el-button>
        <el-button v-permission="['机构管理员','操作员','总查看员','提现复核员','分账复核员']" size="mini" style="margin-left: 10px;" type="warning" @click="exportCheck()">
          导出
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
      style="width: 94%;margin:0 3%"
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
        prop="status"
        label="状态"
        sortable
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="信息"
            width="200"
            trigger="hover"
            :content="scope.row.errormsg"
          >
            <el-tag slot="reference" :type="scope.row.status==='待复核'?'info':scope.row.status==='提现成功'?'success':'danger'">{{ scope.row.status }}</el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="用户名"
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
      <!-- <el-table-column
        prop="bank"
        label="开户行"
        sortable
        align="center"
        width="160"
      /> -->
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
import permission from '@/directive/permission/index.js' // 权限判断指令
import { getReviewList } from '@/api/tsyaccount'
import { getUserList } from '@/api/tsyLj'

export default {
  directives: { waves, permission },
  data() {
    return {
      isShow: false,
      alwaysFalse: false,
      showSearch: true,
      total: 0,
      listLoading: false,
      list: [],
      start_time: '',
      end_time: '',
      // 查询及分页参数
      listQuery: {
        page: 1,
        limit: 10,
        userid: '',
        start_time: '',
        end_time: '',
        status: ''
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
          key: '1',
          value: '待复核'
        },
        {
          key: '2',
          value: '提现成功'
        },
        {
          key: '-1',
          value: '提现失败'
        },
        {
          key: '-2',
          value: '被驳回'
        }
      ],
      // mock数据
      tableData: [],
      status: {
        '1': '待复核',
        '2': '提现成功',
        '-1': '提现失败',
        '-2': '被驳回'
      },
      dialogFormVisible: false,
      bankCodeOptions: [],
      businessCodeOptions: [],
      bankCode: {},
      businessCode: {}
    }
  },
  mounted() {
    getUserList().then(res => {
      this.list = [...res.data.fromList, ...res.data.toList]
    })
    this.handleFilter()
  },
  methods: {
    // 导出
    exportCheck() {
      console.log('exportCheck')
      // window.location.href = 'mould/对账单导出模板.xlsx'
      getReviewList(this.listQuery).then(res => {
        console.log('getSubResult res--:', res)
        this.tableData = res.data
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].amount = Number(this.tableData[i].amount)
          this.tableData[i].status = this.status[this.tableData[i].status]
        }
        console.log('this.tableData---:', this.tableData)
        import('@/vendor/Export2Excel').then(excel => {
          // 表格的表头列表
          console.log('Export2Excel')
          const tHeader = ['流水号', '状态', '用户名', '银行户名', '日期', '账号', '金额(元)']
          // 与表头相对应的数据里边的字段
          const filterVal = ['bizorderno', 'status', 'nickname', 'name', 'time', 'card_no', 'amount']
          const list = this.tableData
          const data = this.formatJson(filterVal, list)
          console.log('Export data', data)
          // 这里还是使用export_json_to_excel方法比较好，方便操作数据
          excel.export_json_to_excel(tHeader, data, '提现导出数据')
        })
      })
    },
    formatJson(filterVal, jsonData) {
      console.log('formatJson')
      return jsonData.map(v =>
        filterVal.map(j => {
          console.log('v[j]-----:', v[j])
          return v[j]
        })
      )
    },
    startchange(e) {
      if (e == null) {
        this.start_time = ''
      }
    },
    endchange(e) {
      if (e == null) {
        this.end_time = ''
      }
    },
    handleFilter() {
      this.listLoading = true
      if (this.start_time !== null && this.start_time !== '') {
        this.listQuery.start_time = this.start_time
      } else {
        this.listQuery.start_time = ''
      }
      if (this.end_time !== null && this.end_time !== '') {
        this.listQuery.end_time = this.end_time - (-1 * 3600 * 24 * 1000)
      } else {
        this.listQuery.end_time = ''
      }
      getReviewList(this.listQuery).then(res => {
        if (res.success === 1) {
          this.listLoading = false
          this.tableData = res.data
          this.total = Number(res.count)
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].amount = Number(this.tableData[i].amount)
            this.tableData[i].status = this.status[this.tableData[i].status]
          }
        } else {
          this.listLoading = false
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
      this.listQuery.page = 1
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
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 7) {
          const values = data.map(item => Number(item[column.property]))
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
    //
  }
}
</script>
