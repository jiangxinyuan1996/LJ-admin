<template>
  <div id="sub-account">
    <div id="searchBox">
      <div id="buttonBox" style="margin-top:50px;margin-left:50px;">
        <span style="margin-right:10px">机器号 : </span><el-input v-model="query.machine_no" size="mini" placeholder="机器号" style="width: 8vw;margin-right:5px;" class="filter-item" />
        <span style="margin-right:10px">单据流水号 : </span><el-input v-model="query.id" size="mini" placeholder="单据流水号" style="width: 8vw;margin-right:5px;" class="filter-item" />
        <span class="demonstration">单据时间 : </span>
        <el-date-picker
          v-model="value2"
          style="width: 8.5vw;"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span style="margin-left:5px;margin-right:5px;">至 </span>
        <el-date-picker
          v-model="value3"
          style="width: 8.5vw;"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span style="margin-top:15px;margin-right:10px;margin-left:5px;" class="demonstration">分账方 : </span>
        <el-select v-model="subuser1" style="margin-top:15px;width: 8vw;" size="mini" filterable placeholder="请选择">
          <el-option
            v-for="item in subuser1List"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span style="margin-top:15px;margin-right:10px;margin-left:5px;" class="demonstration">被分账方 : </span>
        <el-select v-model="subuser2" style="margin-top:15px;width: 8vw;" size="mini" filterable placeholder="请选择">
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
        <el-button v-show="selectionList.length>0" size="mini" class="filter-item" style="margin-left: 57vw;margin-top:15px;" type="warning" >
          批量驳回
        </el-button>
        <el-button v-show="selectionList.length>0" size="mini" class="filter-item" style="margin-left: 5px;margin-top:15px;" type="success" >
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
          prop="machine_no"
          align="center"
          width="120"
          label="机器号"
        />
        <el-table-column
          prop="id"
          sortable
          align="center"
          width="120"
          label="流水号"
        />
        <el-table-column
          prop="createtime"
          align="center"
          width="150"
          sortable
          label="时间"
        />
        <el-table-column
          prop="account"
          align="center"
          width="100"
          sortable
          label="金额(元)"
        />
        <el-table-column
          prop="subuser1"
          align="center"
          sortable
          width="100"
          show-overflow-tooltip
          label="分账方"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.fromsubuser }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="subuser1Account"
          align="center"
          sortable
          width="120"
          show-overflow-tooltip
          label="分账方金额"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.subuser1Account }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="subuser2"
          align="center"
          width="100"
          sortable
          show-overflow-tooltip
          label="被分账方"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.tosubuser }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="subuser2Account"
          align="center"
          width="120"
          sortable
          show-overflow-tooltip
          label="被分账方金额"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.subuser2Account }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="ratio"
          width="150"
          sortable
          label="比例"
        />
        <el-table-column label="操作" width="120"align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="驳回" placement="left">
              <!-- <el-button class="el-icon-edit" @click="modifyData(scope.row)"></el-button> -->
              <el-button type="warning" icon="el-icon-refresh-left" circle size="mini" @click="commit(scope.row)" />
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
import { getCheckResultDetail, getUserList } from '@/api/tsyLj.js'
export default {
  name: 'SubAccount',
  data() {
    return {
      query: {
        id: '',
        machine_no: ''
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
      getCheckResultDetail().then(res => {
        console.log('getCheckResultDetail res--:', res)
        this.tableData = res.data
        for (let i = 0; i < this.tableData.length; i++) {
          const subuser1Ratio = this.tableData[i].ratio.split(':')[0]
          const subuser2Ratio = this.tableData[i].ratio.split(':')[1]
          this.tableData[i].subuser1Account = this.tableData[i].account * subuser1Ratio / 10
          this.tableData[i].subuser2Account = this.tableData[i].account * subuser2Ratio / 10
        }
        setTimeout(function() {
          this.loading = false // 改为self
        }.bind(this), 600)
      })
    },
    exportCheck() {
      console.log('exportCheck')
      window.location.href = ''
    },
    handleSelectionChange(rows) {
      console.log('handleSelectionChange')
      this.selectionList = rows
    },
    changePage() {
      console.log('changePage')
    },
    commit(e) {
      const h = this.$createElement
      this.$msgbox({
        title: '信息确认',
        message: h('p', null, [
          h('span', { style: 'color: rgb(238,120,0)' }, `${e.account}`),
          h('span', null, `元`),
          h('br', null, ''),
          h('span', null, `将以`),
          h('span', { style: 'color: rgb(250,190,0)' }, `${e.ratio}`),
          h('span', null, `的比例`),
          h('br', null, ''),
          h('span', null, `分给 `),
          h('span', { style: 'color: rgb(0,113,190)' }, `${e.subuser1} `),
          h('span', { style: 'color: rgb(238,120,0)' }, `${e.subuser1Account}`),
          h('span', null, `元`),
          h('br', null, ''),
          h('span', null, `分给 `),
          h('span', { style: 'color: rgb(0,113,190)' }, `${e.subuser2} `),
          h('span', { style: 'color: rgb(238,120,0)' }, `${e.subuser2Account}`),
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
      }).then(action => {
        this.$message({
          type: 'info',
          message: 'action: ' + action
        })
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
