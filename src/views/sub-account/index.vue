<template>
  <div id="sub-amount">
    <div id="searchBox">
      <div id="buttonBox" style="margin:40px;">
        <span style="margin-top:10px;margin-bottom:10px;margin-right:10px">机器号 : </span><el-input v-model="query.termid" size="mini" placeholder="机器号" style="width: 10vw;margin-right:15px;margin-top:10px;margin-bottom:10px;" class="filter-item" />
        <span style="margin-right:10px">单据流水号 : </span><el-input v-model="query.trxid" size="mini" placeholder="单据流水号" style="width: 15vw;margin-right:15px;" class="filter-item" />
        <span class="demonstration">单据时间 : </span>
        <el-date-picker
          v-model="query.start_time"
          style="width: 12vw;"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span style="margin-right:10px;margin-left:10px;">至 </span>
        <el-date-picker
          v-model="query.end_time"
          style="width: 12vw;"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
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
        v-loading="loading"
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
          sortable
          prop="trxid"
          align="center"
          width="120"
          label="流水号"
        />
        <el-table-column
          sortable
          prop="paytime"
          align="center"
          width="170"
          label="时间"
        />
        <el-table-column
          sortable
          prop="amount"
          align="center"
          width="110"
          label="金额(元)"
        />
        <el-table-column
          prop="subuser1"
          align="center"
          width="120"
          show-overflow-tooltip
          label="服务商"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.subuser1" size="mini" filterable placeholder="请选择">
              <el-option
                v-for="item in subuser1List"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-divider />
            <span>{{ scope.row.subuser1Account }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="subuser2"
          align="center"
          width="170"
          show-overflow-tooltip
          label="合作伙伴"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.subuser2" size="mini" filterable placeholder="请选择">
              <el-option
                v-for="item in subuser2List"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-divider />
            <span>{{ scope.row.subuser2Account }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="ratio"
          width="150"
          label="比例"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.ratio" size="mini" filterable placeholder="请选择" @change="changeRatio(scope.row)">
              <el-option
                v-for="item in ratios"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
              <el-divider />
              <el-option
                key="新建比例"
                label="新建比例"
                value="新建比例"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" align="center">

          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="提交" placement="top-end">
              <el-button type="success" icon="el-icon-check" circle size="mini" @click="commit(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-dialog
        title="确认支付"
        :visible.sync="dialogVisible"
        width="60%"
      >
      <el-button type="primary" @click='jump()'>点击跳转至支付页面</el-button>
        <!-- <iframe style="width:100%;height:100%" :src="jumpUrl" /> -->
      </el-dialog>

      <el-pagination
        :page-size="query.limit"
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
import { getUserList, getRuleList, submitSubResult, getPayResult } from '@/api/tsyLj.js'
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
      query: {
        trxid: '',
        termid: '',
        start_time: '',
        end_time: '',
        page: 1,
        limit: 10
      },
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
      jumpForm: {
        sysid: '',
        timestamp: '',
        sign: '',
        req: ''
      },
      jumpUrl: '',
      dialogVisible: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      this.query.page = this.page
      this.query.start_time = this.query.start_time.valueOf()
      this.query.end_time = this.query.end_time.valueOf()
      getPayResult(this.query).then(res => {
        console.log('getPayResult res---:', res)
        this.totalCount = parseInt(res.count)
        console.log('this.totalCount----:', this.totalCount)
        this.tableData = res.data

        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].amount = this.tableData[i].amount.replace(/,/g, '')
        }
      })
      getUserList().then(res => {
        console.log('getUserList---:', res)
        const fromList = res.data.fromList
        const toList = res.data.toList
        this.subuser1List = []
        this.subuser2List = []
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
        setTimeout(function() {
          this.loading = false // 改为self
        }.bind(this), 600)
      })

      getRuleList().then(res => {
        this.ratios = []
        console.log('getRuleList---:', res)
        for (let i = 0; i < res.data.length; i++) {
          const ratio = {}
          ratio.value = res.data[i].content
          ratio.label = res.data[i].content
          this.ratios.push(ratio)
        }
      })
    },
    changePage(e) {
      this.page = e
      this.init()
    },
    exportCheck() {
      let param = Object.assign({}, this.query)
      param.option = 'export'
      getPayResult(param).then(res => {
        console.log('getPayResult res---:', res)
        let exportList = res.data

        console.log('exportCheck')
        // window.location.href = 'mould/对账单导出模板.xlsx'
        import('@/vendor/Export2Excel').then(excel => {
          // 表格的表头列表
          console.log('Export2Excel')
          const tHeader = ['机器号', '流水号', '时间', '金额(元)', '状态', '服务商', '服务商金额(元)', '合作伙伴', '合作伙伴金额(元)', '比例']
          // 与表头相对应的数据里边的字段
          const filterVal = ['termid', 'trxid', 'paytime', 'amount', 'status', 'sub1_user_name', 'sub1_account', 'sub2_user_name', 'sub2_account', 'rule']
          const list = exportList
          const data = this.formatJson(filterVal, list)
          console.log('Export data', data)
          // 这里还是使用export_json_to_excel方法比较好，方便操作数据
          excel.export_json_to_excel(tHeader, data, '待分账明细导出数据')
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
    changeRatio(e) {
      console.log('changeRatio e---:', e)
      if (e.ratio === '新建比例') {
        const url = '/setting/index/2'
        this.$router.push(url)
      }
      const subuser1Ratio = e.ratio.split(':')[0]
      const subuser2Ratio = e.ratio.split(':')[1]
      e.subuser1Account = e.amount * subuser1Ratio / 10
      e.subuser2Account = e.amount * subuser2Ratio / 10
    },
    commit(e) {
      if (!e.subuser1 && !e.subuser2) {
        this.$alert('请选择服务商与合作伙伴', '标题名称', {
          confirmButtonText: '确定',
          callback: action => {

          }
        })
        return
      }

      if (!e.ratio) {
        this.$alert('请选择分账比例', '提示', {
          confirmButtonText: '确定',
          callback: action => {

          }
        })
        return
      }

      let name1 = ''
      let name2 = ''
      console.log('value2---:', this.value2)
      console.log('e.subuser1', e.subuser1)
      console.log('this.subuser1List', this.subuser1List)
      for (let i = 0; i < this.subuser1List.length; i++) {
        if (e.subuser1 === this.subuser1List[i].value) {
          console.log('111111')
          name1 = this.subuser1List[i].label
          break
        }
      }

      for (let i = 0; i < this.subuser2List.length; i++) {
        if (e.subuser2 === this.subuser2List[i].value) {
          console.log('222222')
          name2 = this.subuser2List[i].label
          break
        }
      }
      console.log('name1', name1)
      const h = this.$createElement
      this.$msgbox({
        title: '信息确认',
        message: h('p', null, [
          h('span', { style: 'color: rgb(238,120,0)' }, `${e.amount}`),
          h('span', null, `元`),
          h('br', null, ''),
          h('span', null, `将以`),
          h('span', { style: 'color: rgb(250,190,0)' }, `${e.ratio}`),
          h('span', null, `的比例`),
          h('br', null, ''),
          h('span', null, `分给 `),
          h('span', { style: 'color: rgb(0,113,190)' }, `${name1} `),
          h('span', { style: 'color: rgb(238,120,0)' }, `${e.subuser1Account}`),
          h('span', null, `元`),
          h('br', null, ''),
          h('span', null, `分给 `),
          h('span', { style: 'color: rgb(0,113,190)' }, `${name2} `),
          h('span', { style: 'color: rgb(238,120,0)' }, `${e.subuser2Account}`),
          h('span', null, `元`),
          h('br', null, ''),
          h('span', null, `是否提交?`)
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            const param = e
            console.log('param---', param)
            submitSubResult(param).then(res => {
              console.log('submitSubResult res---:', res)
              if (res.success === 1) {
                this.jumpForm = res.data
                this.jumpUrl = res.data.url
                this.init()
                window.open(this.jumpUrl, '_blank')
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
              }
              instance.confirmButtonLoading = false
              done()
              this.dialogVisible = true
            })
          } else {
            done()
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
    }
  }
}
</script>
<style>
.el-divider--horizontal{
  margin: 5px 0;
}
/* .el-dialog{
  height: 70%;
} */
/* .el-dialog__body{
  height: 90%;
} */
</style>
