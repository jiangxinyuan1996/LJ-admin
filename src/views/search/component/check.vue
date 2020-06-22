<template>
  <div id="sub-verify">
    <div id="searchBox">
      <div id="buttonBox" style="margin:50px;">
        <span class="demonstration">查询时间 : </span>
        <el-date-picker
          v-model="query.start_time"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span style="margin-left:10px;margin-right:10px;" class="demonstration">至</span>
        <el-date-picker
          v-model="query.end_time"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span style="margin-left:15px;" class="demonstration">服务商 : </span>
        <el-select v-model="subuser2" size="mini" filterable placeholder="请选择">
          <el-option
            key="本公司"
            label="本公司"
            value="本公司"
          />
          <el-option
            v-for="item in subuser2List"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" @click="search()">
          查询
        </el-button>
        <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="warning" @click="exportCheck()">
          导出
        </el-button>
      </div>
    </div>

    <div id="dataForm">
      <el-table
        v-loading="loading"
        show-summary
        :summary-method="getSummaries"
        :data="tableData"
        size="mini"
        stripe
        sortable
        border
        style="margin:20px;margin-left:50px;margin-right:50px;"
      >
        <el-table-column
          prop="datetime"
          align="center"
          sortable
          width="130"
          label="时间"
        />
        <el-table-column
          prop="amount"
          align="center"
          sortable
          width="120"
          show-overflow-tooltip
          label="进账总额"
        />
        <el-table-column
          prop="rule"
          align="center"
          sortable
          width="170"
          show-overflow-tooltip
          label="分账比例"
        />
        <el-table-column
          align="center"
          sortable
          prop="sub_amount"
          width="150"
          label="分账金额"
        />
        <el-table-column
          align="center"
          sortable
          prop="name"
          width="150"
          label="合作伙伴名称"
        />
        <el-table-column
          align="center"
          prop="income"
          sortable
          width="150"
          label="本公司分账金额"
        />
        <el-table-column
          align="center"
          prop="wd_amount"
          sortable
          width="150"
          label="提现金额"
        />
        <el-table-column
          align="center"
          prop="in_amount"
          sortable
          width="150"
          label="转入金额"
        />
        <el-table-column
          align="center"
          prop="out_amount"
          sortable
          width="150"
          label="转出金额"
        />
        <el-table-column
          align="center"
          prop="getter"
          sortable
          width="150"
          label="未提现账户"
        />
        <el-table-column
          align="center"
          prop="username"
          sortable
          width="150"
          label="备注"
        />
      </el-table>
      <el-pagination
        :page-size="50"
        :current-page="currentPage"
        layout="prev, pager, next"
        :total="totalCount"
        @prev-click="currentPage-=1"
        @next-click="currentPage+=1"
        @current-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { getStatementByPartner, getStatementByServer, getUserList, getBalanceById } from '@/api/tsyLj.js'
export default {
  name: 'SubVerify',
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      value2: '',
      value3: '',
      subuser1: '',
      subuser2: '',
      alwaysFalse: false,
      totalCount: 0,
      pageSize: 10,
      page: 1,
      tableData: [],
      currentPage: 1,
      ratios: [],
      subuser2List: [],
      subuser1List: [],
      loading: true,
      query: {
        start_time: '',
        end_time: ''
      },
      money: 0
    }
  },
  created() {
    // this.search()
    this.query.end_time = new Date()
    this.query.start_time = new Date() - (3 * 3600 * 24 * 1000)
    getUserList().then(res => {
      console.log('getUserList---:', res)
      const fromList = res.data.fromList
      const toList = res.data.toList
      for (let i = 0; i < fromList.length; i++) {
        const subuser1 = {}
        subuser1.value = fromList[i].id
        subuser1.label = fromList[i].nickname
        this.subuser1List.push(subuser1)
      }

      for (let i = 0; i < toList.length; i++) {
        const subuser2 = {}
        subuser2.value = toList[i].id
        subuser2.label = toList[i].nickname
        this.subuser2List.push(subuser2)
      }
      this.loading = false
    })
  },
  methods: {
    search() {
      this.loading = true
      if (this.subuser2 == '' || this.subuser2 == null) {
        this.$message({
          type: 'error',
          message: '请选择分账方'
        })
        this.loading = false // 改为self
      } else if (this.subuser2 != '本公司') {
        this.query.start_time = this.query.start_time.valueOf()
        this.query.end_time = this.query.end_time.valueOf()
        this.query.bizUserId = this.subuser2
        this.query.limit = this.pageSize
        this.query.page = this.page
        getStatementByPartner(this.query).then(res => {
          console.log('getStatementByPartner res----:', res)
          this.tableData = res.data
          this.money = res.amount
          this.loading = false // 改为self
        })
      } else {
        console.log('==========本公司============')
        this.query.start_time = this.query.start_time.valueOf()
        this.query.end_time = this.query.end_time.valueOf()
        this.query.limit = this.pageSize
        this.query.page = this.page
        getStatementByServer(this.query).then(res => {
          console.log('getStatementByPartner res----:', res)
          this.tableData = res.data
          this.money = res.amount
          this.loading = false // 改为self
        })
      }
    },
    exportCheck() {
      console.log('exportCheck')
      this.search()
      import('@/vendor/Export2Excel').then(excel => {
        // 表格的表头列表
        console.log('Export2Excel')
        const tHeader = ['时间', '进账总额', '分账比例', '分账金额', '合作伙伴名称', '本公司分账金额', '提现金额(元)', '转入金额', '转出金额(元)', '备注']
        // 与表头相对应的数据里边的字段
        const filterVal = ['datetime', 'amount', 'rule', 'sub_amount', 'name', 'income', 'wd_amount', 'in_amount', 'out_amount', 'username']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)

        data.push(['未提现余额', this.money])
        console.log('Export data', data)
        // 这里还是使用export_json_to_excel方法比较好，方便操作数据
        excel.export_json_to_excel(tHeader, data, '对账单导出数据')
      })
    },
    changePage() {
      console.log('changePage')
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
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        } else if (index === 9) {
          sums[index] = this.money + '元'
          return
        } else if (index === 10) {
          return
        }
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
          sums[index] += ' 元'
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums
    }
  }
}
</script>
<style>
.el-divider--horizontal{
  margin: 5px 0;
}
</style>
