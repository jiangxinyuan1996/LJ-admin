<template>
  <div id="sub-account">
    <div id="searchBox">
      <div id="buttonBox" style="margin:40px;">
        <span style="margin-right:10px;margin-top:10px;margin-bottom:10px;">机器号 : </span><el-input v-model="query.termid" size="mini" placeholder="机器号" style="width: 8vw;margin-right:5px;margin-top:10px;margin-bottom:10px;" class="filter-item" />
        <span style="margin-right:10px">流水号 : </span><el-input v-model="query.trxid" size="mini" placeholder="单据流水号" style="width: 12vw;margin-right:15px;" class="filter-item" />
        <span class="demonstration">时间 : </span>
        <el-date-picker
          v-model="query.start_time"
          style="width: 12vw;"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span>至 </span>
        <el-date-picker
          v-model="query.end_time"
          style="width: 12vw;"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span style="margin-right:10px">状态 : </span>
        <el-select v-model="query.status" size="mini" clearable style="width: 8vw;" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" @click="init()">
          查询
        </el-button>
        <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="warning" @click="exportCheck()">
          导出
        </el-button>
      </div>
    </div>

    <div id="dataForm">
      <el-table
        show-summary
        :summary-method="getSummaries"
        :data="tableData"
        size="mini"
        stripe
        border
        style="margin:20px;margin-left:50px;margin-right:50px;width:80vw"
      >
        <el-table-column
          sortable
          prop="termid"
          align="center"
          width="120"
          label="机器号"
        />
        <el-table-column
          prop="trxid"
          align="center"
          width="120"
          sortable
          label="流水号"
        />
        <el-table-column
          prop="paytime"
          align="center"
          width="170"
          sortable
          label="时间"
        />
        <el-table-column
          prop="amount"
          align="center"
          width="110"
          sortable
          label="金额(元)"
        />
        <el-table-column
          prop="status"
          label="状态"
          sortable
          align="center"
          width="110"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status=='已分账'" slot="reference" type="success">{{ scope.row.status }}</el-tag>
            <el-tag v-if="scope.row.status=='待复核'" slot="reference" type="warning">{{ scope.row.status }}</el-tag>
            <el-tag v-if="scope.row.status=='未分账'" slot="reference" type="info">{{ scope.row.status }}</el-tag>
            <el-tag v-if="scope.row.status=='进行中'" slot="reference">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="sub1_user_name"
          align="center"
          width="120"
          show-overflow-tooltip
          label="服务商"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.sub1_user_name }}</span>
            <el-divider />
            <span>{{ scope.row.sub1_account }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sub2_user_name"
          align="center"
          width="170"
          sortable
          show-overflow-tooltip
          label="合作伙伴"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.sub2_user_name }}</span>
            <el-divider />
            <span>{{ scope.row.sub2_account }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="rule"
          sortable
          width="150"
          label="比例"
        />
      </el-table>
      <el-pagination
        :page-size="limit"
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
import { getSubResult } from '@/api/tsyLj.js'
export default {
  name: 'SubAccount',
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
      options: [{
        label: '未分账',
        value: '0'
      }, {
        label: '待审核',
        value: '1'
      }, {
        label: '处理中',
        value: '2'
      }, {
        label: '已完成',
        value: '3'
      }],
      query: {
        termid: '',
        trxid: '',
        start_time: '',
        end_time: '',
        status: '',
        limit: 10,
        page: 1
      },
      alwaysFalse: false,
      totalCount: 0,
      limit: 10,
      page: 1,
      tableData: [],
      currentPage: 1,
      ratios: [],
      subuser2List: [],
      subuser1List: [{
        value: '1',
        label: '本公司'
      }]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.query.start_time = this.query.start_time.valueOf()
      this.query.end_time = this.query.end_time.valueOf()
      this.query.page = this.page
      this.query.limit = this.limit
      getSubResult(this.query).then(res => {
        console.log('getSubResult res--:', res)
        this.totalCount = parseInt(res.count)
        this.tableData = res.data
        for (var i = 0; i < this.tableData.length; i++) {
          this.tableData[i].amount = this.tableData[i].amount.replace(/,/g, '')
          switch (this.tableData[i].status) {
            case '0':this.tableData[i].status = '未分账'
              break
            case '1':this.tableData[i].status = '待复核'
              break
            case '2':this.tableData[i].status = '处理中'
              break
            case '3':this.tableData[i].status = '已分账'
              break
          }
        }
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
          if (index === 1) {
            sums[index] = '';
            return;
          }
          if(index===3){
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return (prev*10 + curr*10)/10;
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
    },
    exportCheck() {
      console.log('exportCheck')
      // window.location.href = 'mould/对账单导出模板.xlsx'
      let param = Object.assign({}, this.query)
      param.option = 'export'
      getSubResult(param).then(res => {
        console.log('getSubResult res--:', res)
        let data = res.data
        for (var i = 0; i < data.length; i++) {
          switch (data[i].status) {
            case '0':data[i].status = '未分账'
              break
            case '1':data[i].status = '待复核'
              break
            case '2':data[i].status = '处理中'
              break
            case '3':data[i].status = '已分账'
              break
          }
        }
        console.log('data---:', data)
        import('@/vendor/Export2Excel').then(excel => {
          // 表格的表头列表
          console.log('Export2Excel')
          const tHeader = ['机器号', '流水号', '时间', '金额(元)', '状态', '服务商', '服务商金额(元)', '合作伙伴', '合作伙伴金额(元)', '比例']
          // 与表头相对应的数据里边的字段
          const filterVal = ['termid', 'trxid', 'paytime', 'amount', 'status', 'sub1_user_name', 'sub1_account', 'sub2_user_name', 'sub2_account', 'rule']
          const list = data
          const dataList = this.formatJson(filterVal, list)
          console.log('Export dataList', dataList)
          // 这里还是使用export_json_to_excel方法比较好，方便操作数据
          excel.export_json_to_excel(tHeader, dataList, '分账明细导出数据')
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
    changePage(e) {
      this.page = e
      this.init()
    }
  }
}
</script>
<style>
.el-divider--horizontal{
  margin: 5px 0;
}
</style>
