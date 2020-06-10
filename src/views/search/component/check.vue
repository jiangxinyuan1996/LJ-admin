<template>
  <div id="sub-verify">
    <div id="searchBox">
      <div id="buttonBox" style="margin:50px;">
        <span class="demonstration">查询时间 : </span>
        <el-date-picker
          v-model="value2"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span style="margin-left:10px;margin-right:10px;" class="demonstration">至</span>
        <el-date-picker
          v-model="value3"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" @click="clickSearch()">
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
        :data="tableData"
        size="mini"
        stripe
        sortable
        border
        style="margin:20px;margin-left:50px;margin-right:50px;"
      >
        <el-table-column
          prop="id"
          align="center"
          width="170"
          sortable
          label="流水号"
        />
        <el-table-column
          prop="type"
          align="center"
          sortable
          width="130"
          label="业务类型"
        />
        <el-table-column
          prop="createtime"
          align="center"
          sortable
          width="120"
          show-overflow-tooltip
          label="时间"
        />
        <el-table-column
          prop="account"
          align="center"
          sortable
          width="170"
          show-overflow-tooltip
          label="金额(元)"
        />
        <el-table-column
          align="center"
          sortable
          prop="payer"
          width="150"
          label="支付方"
        />
        <el-table-column
          align="center"
          prop="getter"
          sortable
          width="150"
          label="收款方"
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
// import { getCheckResult , getUserList} from '@/api/tsyLj.js'
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
      loading: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      this.tableData = [{
        id: 'A000001',
        type: '分账',
        createtime: '2020/6/5  8:30:00',
        account: '10000',
        payer: '',
        getter: '本公司'
      },
      {
        id: 'A000002',
        type: '转账',
        createtime: '2020/6/5  8:30:00',
        account: '-10000',
        payer: '本公司',
        getter: '合作伙伴1'
      },
      {
        id: 'A000003',
        type: '转账',
        createtime: '2020/6/5  8:30:00',
        account: '20000',
        payer: '合作伙伴2',
        getter: '本公司'
      },
      {
        id: 'A000004',
        type: '提现',
        createtime: '2020/6/5  8:30:00',
        account: '-10000',
        payer: '',
        getter: '本公司'
      }]
      this.value3 = new Date()
      this.value2 = new Date() - (3 * 3600 * 24 * 1000)
      setTimeout(function() {
        this.loading = false // 改为self
      }.bind(this), 600)
    },
    exportCheck() {
      console.log('exportCheck')
      window.location.href = 'mould/对账单导出模板.xlsx'
    }
  }
}
</script>
<style>
.el-divider--horizontal{
  margin: 5px 0;
}
</style>
