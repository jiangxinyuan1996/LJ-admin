<template>
  <div id="sub-account">
    <div id="searchBox">
      <div id="buttonBox" style="margin:50px;">
        <span style="margin-right:10px">机器号 : </span><el-input v-model="query.termid" size="mini" placeholder="机器号" style="width: 8vw;margin-right:5px;" class="filter-item" />
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
        :data="tableData"
        size="mini"
        stripe
        border
        style="margin:20px;margin-left:50px;margin-right:50px;"
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
          align="center"
          width="110"
          label="状态"
          sortable
        />
        <el-table-column
          prop="sub1_user_name"
          align="center"
          width="120"
          show-overflow-tooltip
          label="分账方"
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
          label="被分账方"
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
        :page-size="10"
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
import {getSubResult} from '@/api/tsyLj.js'
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
        termid:'',
        trxid:'',
        start_time:'',
        end_time:'',
        status:''
      },
      alwaysFalse: false,
      totalCount: 0,
      pageSize: 10,
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
    init(){
      this.query.start_time = this.query.start_time.valueOf()
      this.query.end_time = this.query.end_time.valueOf()
      getSubResult(this.query).then(res=>{
        console.log('getSubResult res--:',res);
        this.tableData = res.data
      })
    },
    exportCheck() {
      console.log('exportCheck')
      window.location.href = 'mould/对账单导出模板.xlsx'
    },
    changePage(){
      console.log(changePage);
    }
  }
}
</script>
<style>
.el-divider--horizontal{
  margin: 5px 0;
}
</style>
