<template>
  <div id="sub-verify">
    <div id="searchBox">
      <div id="buttonBox" style="margin:50px;">
        <span class="demonstration">单据时间 : </span>
        <el-date-picker
          v-model="query.start_time"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span class="demonstration">至</span>
        <el-date-picker
          v-model="query.end_time"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />

        <span style="margin-left:15px;" class="demonstration">服务商 : </span>
        <el-select v-model="query.subuser1" size="mini" filterable placeholder="请选择">
          <el-option
            v-for="item in subuser1List"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span style="margin-left:15px;" class="demonstration">合作伙伴 : </span>
        <el-select v-model="query.subuser2" size="mini" filterable placeholder="请选择">
          <el-option
            v-for="item in subuser2List"
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
        v-loading="loading"
        show-summary
        :data="tableData"
        size="mini"
        stripe
        border
        style="margin:20px;margin-left:50px;margin-right:50px;"
      >
        <el-table-column
          prop="sub1_user_name"
          align="center"
          sortable
          width="170"
          label="服务商"
        />
        <el-table-column
          prop="sub1_account"
          align="center"
          width="130"
          sortable
          label="分账金额(元)"
        />
        <el-table-column
          prop="sub2_user_name"
          align="center"
          sortable
          width="120"
          show-overflow-tooltip
          label="合作伙伴"
        />
        <el-table-column
          prop="sub2_account"
          align="center"
          sortable
          width="170"
          show-overflow-tooltip
          label="被分账金额(元)"
        />
        <el-table-column
          align="center"
          prop="count"
          sortable
          width="150"
          label="明细总数"
        />
        <el-table-column
          align="center"
          prop="total"
          sortable
          width="150"
          label="总金额"
        />
        <el-table-column label="操作" width="120"align="center">

          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="复核" placement="left">
              <!-- <el-button class="el-icon-edit" @click="modifyData(scope.row)"></el-button> -->
              <el-button type="success" icon="el-icon-check" circle size="mini" @click="commit(scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看明细" placement="right">
              <el-button type="primary" icon="el-icon-search" size="mini" circle @click="checkDetail(scope.row)" />
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
import { getCheckResult, batchCheckResult, getUserList } from '@/api/tsyLj.js'
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
      query: {
        start_time: '',
        end_timeL: '',
        sub1_user_id: '',
        sub2_user_id: ''
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
      loading: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
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
      getCheckResult().then(res => {
        console.log('getCheckResult res--:', res)
        this.tableData = res.data

        for(let i=0;i<this.tableData.length;i++){
          this.tableData[i].amount = this.tableData[i].amount.replace(/,/g, '')
        }
        setTimeout(function() {
          this.loading = false // 改为self
        }.bind(this), 600)
      })
    },
    exportCheck() {
      console.log('exportCheck')
      window.location.href = 'mould/对账单导出模板.xlsx'
    },
    changeRatio(e) {
      console.log('changeRatio e---:', e)
      const subuser1Ratio = e.ratio.split(':')[0]
      const subuser2Ratio = e.ratio.split(':')[1]
      e.subuser1Account = e.account * subuser1Ratio / 10
      e.subuser2Account = e.account * subuser2Ratio / 10
    },
    commit(e) {
      const h = this.$createElement
      this.$msgbox({
        title: '信息确认',
        message: h('p', null, [
          h('span', { style: 'color: rgb(238,120,0)' }, `${e.total}`),
          h('span', null, `元`),
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
          h('br', null, ''),
          h('span', null, `是否确认复核?`)
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            const param = {}
            param.start_time = this.value2
            param.end_time = this.value3
            param.sub1_user_id = e.sub1_user_id
            param.sub2_user_id = e.sub2_user_id
            console.log('param---', param)
            batchCheckResult(param).then(res => {
              console.log('submitSubResult res---:', res)
              if (res.success === 1) {
                this.$message({
                  type: 'success',
                  message: res.message
                })
              }
              instance.confirmButtonLoading = false
              done()
            })
          } else {
            done()
          }
        }
      })
    },
    changePage() {
      console.log('changePage')
    },
    checkDetail(e) {
      const url = '/subverify/detail'
      this.$router.push(url)
    }
  }
}
</script>
<style>
.el-divider--horizontal{
  margin: 5px 0;
}
</style>
