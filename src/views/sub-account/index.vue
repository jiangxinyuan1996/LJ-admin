<template>
  <div id="sub-account">
    <div id="searchBox">
      <div id="buttonBox" style="margin:50px;">
        <span style="margin-right:10px">机器号 : </span><el-input v-model="query.id" size="mini" placeholder="机器号" style="width: 10vw;margin-right:15px;" class="filter-item" />
        <span style="margin-right:10px">单据流水号 : </span><el-input v-model="query.id" size="mini" placeholder="单据流水号" style="width: 15vw;margin-right:15px;" class="filter-item" />
        <span class="demonstration">单据时间 : </span>
        <el-date-picker
          v-model="value2"
          style="width: 12vw;"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span style="margin-right:10px;margin-left:10px;">至 </span>
        <el-date-picker
          v-model="value3"
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
        :data="tableData"
        size="mini"
        stripe
        border
        style="margin:20px;margin-left:50px;margin-right:50px;"
      >
        <el-table-column
          sortable
          prop="machine_no"
          align="center"
          width="120"
          label="机器号"
        />
        <el-table-column
          sortable
          prop="id"
          align="center"
          width="120"
          label="流水号"
        />
        <el-table-column
          sortable
          prop="createtime"
          align="center"
          width="170"
          label="时间"
        />
        <el-table-column
          sortable
          prop="account"
          align="center"
          width="110"
          label="金额(元)"
        />
        <el-table-column
          prop="subuser1"
          align="center"
          width="120"
          show-overflow-tooltip
          label="分账方"
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
          label="被分账方"
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
                :key="item.value"
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
        <el-table-column label="操作" width="90"align="center">

          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="提交" placement="top-end">
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
import { getUserList, getRuleList, submitSubResult } from '@/api/tsyLj.js'
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
      value2: '',
      value3: '',
      query: {
        id: ''
      },
      alwaysFalse: false,
      totalCount: 0,
      pageSize: 10,
      page: 1,
      tableData: [
        {
          machine_no: 'POS001',
          id: 'A100000001',
          createtime: '2020-05-26 15:02:35',
          account: '2000000',
          subuser1: '',
          subuser2: ''
        },
        {
          machine_no: 'POS002',
          id: 'A100000002',
          createtime: '2020-05-26 17:32:10',
          account: '50000',
          subuser1: '',
          subuser2: ''
        }
      ],
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
        setTimeout(function() {
          this.loading = false // 改为self
        }.bind(this), 600)
      })

      getRuleList().then(res => {
        console.log('getRuleList---:', res)
        for (let i = 0; i < res.data.length; i++) {
          const ratio = {}
          ratio.value = res.data[i].content
          ratio.label = res.data[i].content
          this.ratios.push(ratio)
        }
      })
    },
    changePage() {
      console.log('changePage')
    },
    exportCheck(){
      console.log('exportCheck')
      window.location.href = ''
    },
    changeRatio(e) {
      console.log('changeRatio e---:', e)
      if (e.ratio === '新建比例') {
        const url = '/setting/index/2'
        this.$router.push(url)
      }
      const subuser1Ratio = e.ratio.split(':')[0]
      const subuser2Ratio = e.ratio.split(':')[1]
      e.subuser1Account = e.account * subuser1Ratio / 10
      e.subuser2Account = e.account * subuser2Ratio / 10
    },
    commit(e) {
      if (!e.subuser1 && !e.subuser2) {
        this.$alert('请选择分账方与被分账方', '标题名称', {
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
          h('span', { style: 'color: rgb(238,120,0)' }, `${e.account}`),
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
    }
  }
}
</script>
<style>
.el-divider--horizontal{
  margin: 5px 0;
}
</style>
