<template>
  <div id="sub-account">
    <div id="searchBox">
      <div id="buttonBox" style="margin-top:50px;margin-left:50px;">
        <span style="margin-right:10px">机器号 : </span><el-input v-model="query.termid" size="mini" placeholder="机器号" style="width: 8vw;margin-right:5px;" class="filter-item" />
        <span style="margin-right:10px">单据流水号 : </span><el-input v-model="query.bizOrderNo" size="mini" placeholder="单据流水号" style="width: 8vw;margin-right:5px;" class="filter-item" />
        <span class="demonstration">单据时间 : </span>
        <el-date-picker
          v-model="query.start_time"
          style="width: 8.5vw;"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span style="margin-left:5px;margin-right:5px;">至 </span>
        <el-date-picker
          v-model="query.end_time"
          style="width: 8.5vw;"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span style="margin-top:15px;margin-right:10px;margin-left:5px;" class="demonstration">服务商 : </span>
        <el-select v-model="query.sub1_user_id" style="margin-top:15px;width: 8vw;" size="mini" filterable placeholder="请选择">
          <el-option
            v-for="item in subuser1List"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span style="margin-top:15px;margin-right:10px;margin-left:5px;" class="demonstration">合作伙伴 : </span>
        <el-select v-model="query.sub2_user_id" style="margin-top:15px;width: 8vw;" size="mini" filterable placeholder="请选择">
          <el-option
            v-for="item in subuser2List"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        </br>
        <el-button size="mini" class="filter-item" style="margin-left: 5px;margin-top:15px;" type="primary" @click="init()">
          查询
        </el-button>
        <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="warning" @click="exportCheck()">
          导出
        </el-button>
        <el-button v-show="selectionList.length>0" size="mini" class="filter-item" style="margin-left: 57vw;margin-top:15px;" type="warning" @click="refuseList">
          批量驳回
        </el-button>
        <el-button v-show="selectionList.length>0" size="mini" class="filter-item" style="margin-left: 5px;margin-top:15px;" type="success" @click="checkList">
          批量复核
        </el-button>
      </div>
    </div>
    <div id="dataForm">
      <el-table
        :data="tableData"
        size="mini"
        stripe
        border
        show-summary
        style="margin:20px;margin-left:50px;margin-right:50px;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          sortable
          prop="termid"
          align="center"
          width="120"
          label="机器号"
        />
        <el-table-column
          prop="bizorderno"
          sortable
          align="center"
          width="120"
          label="流水号"
        />
        <el-table-column
          prop="create_time"
          align="center"
          width="150"
          sortable
          label="时间"
        />
        <el-table-column
          prop="amount"
          align="center"
          width="100"
          sortable
          label="金额(元)"
        />
        <el-table-column
          prop="sub1_user_name"
          align="center"
          sortable
          width="100"
          show-overflow-tooltip
          label="服务商"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.sub1_user_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sub1_account"
          align="center"
          sortable
          width="120"
          show-overflow-tooltip
          label="服务商金额"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.sub1_account }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sub2_user_name"
          align="center"
          width="100"
          sortable
          show-overflow-tooltip
          label="合作伙伴"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.sub2_user_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sub2_account"
          align="center"
          width="120"
          sortable
          show-overflow-tooltip
          label="合作伙伴金额"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.sub2_account }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="rule"
          width="150"
          sortable
          label="比例"
        />
        <el-table-column label="操作" width="120"align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="驳回" placement="left">
              <!-- <el-button class="el-icon-edit" @click="modifyData(scope.row)"></el-button> -->
              <el-button type="warning" icon="el-icon-refresh-left" circle size="mini" @click="refuse(scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="复核" placement="right">
              <!-- <el-button class="el-icon-edit" @click="modifyData(scope.row)"></el-button> -->
              <el-button type="success" icon="el-icon-check" circle size="mini" @click="commit(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
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
import { getCheckResultDetail, getUserList, refusedCheckResult, batchCheckResultByNo } from '@/api/tsyLj.js'
export default {
  name: 'SubAccount',
  data() {
    return {
      query: {
        termid: '',
        bizOrderNo: '',
        start_time: '',
        end_time: '',
        sub1_user_id: '',
        sub2_user_id: ''
      },
      alwaysFalse: false,
      totalCount: 0,
      pageSize: 10,
      page: 1,
      tableData: [],
      currentPage: 1,
      subuser2List: [],
      subuser1List: [],
      selectionList: [],
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
      }
    }
  },
  created() {
    this.init()

    console.log(this.tableData)
  },
  methods: {
    init() {
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
      })
      this.query.start_time = this.query.start_time.valueOf()
      this.query.end_time = this.query.end_time.valueOf()
      getCheckResultDetail(this.query).then(res => {
        console.log('getCheckResultDetail res--:', res)
        this.tableData = res.data
        setTimeout(function() {
          this.loading = false // 改为self
        }.bind(this), 600)
      })
    },
    exportCheck() {
      console.log('exportCheck')
      // window.location.href = 'mould/对账单导出模板.xlsx'
      import('@/vendor/Export2Excel').then(excel => {
        // 表格的表头列表
        console.log('Export2Excel')
        const tHeader = ['机器号', '流水号', '时间', '金额(元)', '服务商', '服务商金额(元)', '合作伙伴', '合作伙伴金额(元)', '比例']
        // 与表头相对应的数据里边的字段
        const filterVal = ['termid', 'bizorderno', 'create_time', 'amount', 'sub1_user_name', 'sub1_account', 'sub2_user_name', 'sub2_account', 'rule']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        console.log('Export data', data)
        // 这里还是使用export_json_to_excel方法比较好，方便操作数据
        excel.export_json_to_excel(tHeader, data, '待复核明细导出数据')
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
    handleSelectionChange(rows) {
      console.log('handleSelectionChange')
      this.selectionList = rows
    },
    refuseList() {
      console.log('==========refuse===========')
      const h = this.$createElement
      this.$msgbox({
        title: '信息确认',
        message: h('p', null, [
          h('span', null, `是否确认驳回这`),
          h('span', { style: 'color: rgb(250,190,0)' }, `${this.selectionList.length}`),
          h('span', null, `条数据?`)
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'

            const bizordernoList = []
            for (let i = 0; i < this.selectionList.length; i++) {
              bizordernoList.push(this.selectionList[i].bizorderno)
            }
            refusedCheckResult({ order_list: bizordernoList }).then(res => {
              console.log('refusedCheckResult res---:', res)
              if(res.success==0){
                this.$message({
                  type: 'error',
                  message: res.message
                })
              }else{
                this.$message({
                  type: 'success',
                  message: res.message
                })
              }
              this.init()
            })
            done()
            setTimeout(() => {
              instance.confirmButtonLoading = false
            }, 300)
          } else {
            done()
          }
        }
      })
    },
    checkList() {
      console.log('==========refuse===========')
      const h = this.$createElement
      this.$msgbox({
        title: '信息确认',
        message: h('p', null, [
          h('span', null, `是否确认复核这`),
          h('span', { style: 'color: rgb(250,190,0)' }, `${this.selectionList.length}`),
          h('span', null, `条数据?`)
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            const bizordernoList = []
            for (let i = 0; i < this.selectionList.length; i++) {
              bizordernoList.push(this.selectionList[i].bizorderno)
            }
            batchCheckResultByNo({order_list:bizordernoList}).then(res=>{
              console.log('batchCheckResultByNo res--:',res);
              if(res.success==0){
                this.$message({
                  type: 'error',
                  message: res.message
                })
              }else{
                this.$message({
                  type: 'success',
                  message: res.message
                })
              }

            })
            done()
            setTimeout(() => {
              instance.confirmButtonLoading = false
            }, 300)
          } else {
            done()
          }
        }
      })
    },
    changePage() {
      console.log('changePage')
    },
    refuse(e) {
      console.log('==========refuse===========')
      const h = this.$createElement
      this.$msgbox({
        title: '信息确认',
        message: h('p', null, [
          h('span', null, `是否确认驳回? `)
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            const bizordernoList = []
            bizordernoList.push(e.bizorderno)
            refusedCheckResult({ order_list: bizordernoList }).then(res => {
              console.log('refusedCheckResult res---:', res)
              if(res.success==0){
                this.$message({
                  type: 'error',
                  message: res.message
                })
              }else{
                this.$message({
                  type: 'success',
                  message: res.message
                })
              }
              this.init()
            })
            done()
            setTimeout(() => {
              instance.confirmButtonLoading = false
            }, 300)
          } else {
            done()
          }
        }
      })
    },

    commit(e) {
      const h = this.$createElement
      this.$msgbox({
        title: '信息确认',
        message: h('p', null, [
          h('span', { style: 'color: rgb(238,120,0)' }, `${e.amount}`),
          h('span', null, `元`),
          h('br', null, ''),
          h('span', null, `将以`),
          h('span', { style: 'color: rgb(250,190,0)' }, `${e.rule}`),
          h('span', null, `的比例`),
          h('br', null, ''),
          h('span', null, `分给 `),
          h('span', { style: 'color: rgb(0,113,190)' }, `${e.sub1_user_name} `),
          h('span', { style: 'color: rgb(238,120,0)' }, `${e.sub1_account}`),
          h('span', null, `元`),
          h('br', null, ''),
          h('span', null, `分给 `),
          h('span', { style: 'color: rgb(0,113,190)' }, `${e.sub2_user_name} `),
          h('span', { style: 'color: rgb(238,120,0)' }, `${e.sub2_account}`),
          h('span', null, `元`),
          h('span', null, `是否继续?`)
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            const bizordernoList = []
            bizordernoList.push(e.bizorderno)
            batchCheckResultByNo({order_list:bizordernoList}).then(res=>{
              console.log('batchCheckResultByNo res--:',res);
              if(res.success==0){
                this.$message({
                  type: 'error',
                  message: res.message
                })
              }else{
                this.$message({
                  type: 'success',
                  message: res.message
                })
              }
            })
            setTimeout(() => {
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            }, 3000)
          } else {
            done()
          }
        }
      })
    }
  }
}
</script>
<style>
.el-divider--horizontal{
  margin: 5px 0;
}
</style>
