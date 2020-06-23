<template>
  <div id="sub-account">
    <div id="dataForm">
      <el-table
        :data="tableData"
        size="mini"
        stripe
        border
        show-summary
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
          label="金额(分)"
        />
        <el-table-column
          prop="subuser1"
          align="center"
          sortable
          width="100"
          show-overflow-tooltip
          label="服务商"
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
          label="服务商金额"
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
          label="合作伙伴"
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
          label="合作伙伴金额"
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
import { getCheckResultDetail } from '@/api/tsyLj.js'
export default {
  name: 'SubAccount',
  data() {
    return {
      query: {
        id: ''
      },
      alwaysFalse: false,
      totalCount: 0,
      pageSize: 10,
      page: 1,
      tableData: [],
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
          value: '合作伙伴1',
          label: '合作伙伴1'
        },
        {
          value: '合作伙伴2',
          label: '合作伙伴2'
        },
        {
          value: '合作伙伴3',
          label: '合作伙伴3'
        }
      ],
      subuser1List: [{
        value: '1',
        label: '本公司'
      }]
    }
  },
  created() {
    this.init()

    console.log(this.tableData)
  },
  methods: {
    init() {
      getCheckResultDetail().then(res => {
        console.log('getCheckResultDetail res--:', res)
        this.tableData = res.data
        for (let i = 0; i < this.tableData.length; i++) {
          const subuser1Ratio = this.tableData[i].ratio.split(':')[0]
          const subuser2Ratio = this.tableData[i].ratio.split(':')[1]
          this.tableData[i].subuser1Account = this.tableData[i].account * subuser1Ratio / 10
          this.tableData[i].subuser2Account = this.tableData[i].account * subuser2Ratio / 10
        }
      })
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
