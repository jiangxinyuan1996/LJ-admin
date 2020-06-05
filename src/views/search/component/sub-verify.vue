<template>
  <div id="sub-verify">
    <div id="searchBox">
      <div id="buttonBox" style="margin:50px;">
        <span class="demonstration">单据时间 : </span>
        <el-date-picker
          v-model="value2"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span class="demonstration">至</span>
        <el-date-picker
          v-model="value3"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />

        <span style="margin-left:15px;" class="demonstration">分账方 : </span>
        <el-select v-model="subuser1" size="mini" filterable placeholder="请选择">
          <el-option
            v-for="item in subuser1List"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span style="margin-left:15px;" class="demonstration">被分账方 : </span>
        <el-select v-model="subuser2" size="mini" filterable placeholder="请选择">
          <el-option
            v-for="item in subuser2List"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
          prop="fromsubuser"
          align="center"
          width="170"
          sortable
          label="分账方"
        />
        <el-table-column
          prop="fromaccount"
          align="center"
          sortable
          width="130"
          label="分账金额(元)"
        />
        <el-table-column
          prop="tosubuser"
          align="center"
          sortable
          width="120"
          show-overflow-tooltip
          label="被分账方"
        />
        <el-table-column
          prop="toamount"
          align="center"
          sortable
          width="170"
          show-overflow-tooltip
          label="被分账金额(元)"
        />
        <el-table-column
          align="center"
          sortable
          prop="count"
          width="150"
          label="明细总数"
        />
        <el-table-column
          align="center"
          prop="account"
          sortable
          width="150"
          label="总金额"
        />
        <el-table-column label="操作" width="120"align="center">
          <template slot-scope="scope">
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
import { getCheckResult , getUserList} from '@/api/tsyLj.js'
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
      loading:true
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
          this.loading = false  //改为self
        }.bind(this), 600)
      })
      getCheckResult().then(res => {
        console.log('getCheckResult res--:', res)
        this.tableData = res.data
      })

    },
    checkDetail(e) {
      const url = '/subverify/detail'
      this.$router.push(url)
    },
    exportCheck() {
      console.log('exportCheck')
      window.location.href = '/mould/对账单导出模板.xlsx'
    }
  }
}
</script>
<style>
.el-divider--horizontal{
  margin: 5px 0;
}
</style>
