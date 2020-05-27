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
          prop="subuser1"
          align="center"
          width="170"
          label="分账方"
        />
        <el-table-column
          prop="subuser1Account"
          align="center"
          width="110"
          label="分账金额(元)"
        />
        <el-table-column
          prop="subuser2"
          align="center"
          width="120"
          show-overflow-tooltip
          label="被分账方"
        />
        <el-table-column
          prop="subuser2Account"
          align="center"
          width="170"
          show-overflow-tooltip
          label="被分账金额(元)"
        />
        <el-table-column
          align="center"
          prop="detailNum"
          width="150"
          label="明细总数"
        />
        <el-table-column
          align="center"
          prop="account"
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
      tableData: [
        {
          id: 'A100000001',
          createtime: '2020-05-26 15:02:35',
          account: '800000',
          subuser1: '朗杰',
          subuser1Account: '500000',
          subuser2: '被分账方1',
          subuser2Account: '300000',
          detailNum: '2'
        },
        {
          id: 'A100000002',
          createtime: '2020-05-26 17:32:10',
          account: '180000',
          subuser1: '朗杰',
          subuser1Account: '100000',
          subuser2: '被分账方3',
          subuser2Account: '80000',
          detailNum: '3'
        }
      ],
      currentPage: 1,
      ratios: [{
        value: '10:0',
        label: '10:0'
      }, {
        value: '5:5',
        label: '5:5'
      }, {
        value: '3:7',
        label: '3:7'
      }],
      subuser2List: [
        {
          value: '1',
          label: '被分账方1'
        },
        {
          value: '2',
          label: '被分账方2'
        },
        {
          value: '3',
          label: '被分账方3'
        }
      ],
      subuser1List: [{
        value: '1',
        label: '朗杰'
      }]
    }
  },
  created() {
    for (let i = 0; i < this.tableData.length; i++) {
      const subuser1Ratio = this.tableData[i].ratio.split(':')[0]
      const subuser2Ratio = this.tableData[i].ratio.split(':')[1]
      this.tableData[i].subuser1Account = this.tableData[i].account * subuser1Ratio / 10
      this.tableData[i].subuser2Account = this.tableData[i].account * subuser2Ratio / 10
    }
  },
  methods: {
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
          h('span', { style: 'color: rgb(238,120,0)' }, `${e.account}`),
          h('span', null, `元`),
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
    },
    checkDetail(e){
      let url = '/subverify/detail'
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
