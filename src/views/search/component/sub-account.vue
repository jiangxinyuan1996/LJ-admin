<template>
  <div id="sub-account">
    <div id="searchBox">
      <div id="buttonBox" style="margin:50px;">
        <span style="margin-right:10px">单据流水号 : </span><el-input v-model="query.id" size="mini" placeholder="单据流水号" style="width: 12vw;margin-right:15px;" class="filter-item" />
        <span class="demonstration">单据时间 : </span>
        <el-date-picker
        style="width: 12vw;"
          v-model="value2"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span style="margin-right:10px;margin-left:10px;">至 </span>
        <el-date-picker
        style="width: 12vw;"
          v-model="value3"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
        />
        <span style="margin-right:10px">单据状态 : </span>
        <el-select size="mini" style="width: 8vw;" v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" @click="clickSearch()">
          查询
        </el-button>
      </div>
    </div>

    <div id="dataForm">
      <el-table
        :data="tableData"
        size="mini"
        stripe
        border
        style="margin:20px;margin-left:50px;margin-right:50px;"
      >
        <el-table-column
          prop="id"
          align="center"
          width="120"
          sortable
          label="流水号"
        />
        <el-table-column
          prop="createtime"
          align="center"
          width="170"
          sortable
          label="时间"
        />
        <el-table-column
          prop="account"
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
          prop="subuser1"
          align="center"
          width="120"
          show-overflow-tooltip
          label="分账方"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.subuser1 }}</span>
            <el-divider />
            <span>{{ scope.row.subuser1Account }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="subuser2"
          align="center"
          width="170"
          sortable
          show-overflow-tooltip
          label="被分账方"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.subuser2 }}</span>
            <el-divider />
            <span>{{ scope.row.subuser2Account }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="ratio"
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
      value:'',
      value2:'',
      value3:'',
      options:[{
        label:"未提交",
        value:"未提交"
      },{
        label:"待审核",
        value:"待审核"
      }],
      query: {
        id: ''
      },
      alwaysFalse: false,
      totalCount: 0,
      pageSize: 10,
      page: 1,
      tableData: [
        {
          id: 'A100000001',
          createtime: '2020-05-26 15:02:35',
          status:'未提交',
          account: '2000000',
          subuser1: '',
          subuser2: '',
          ratio: ''
        },
        {
          id: 'A100000002',
          createtime: '2020-05-26 17:32:10',
          status:'待审核',
          account: '50000',
          subuser1: '本公司',
          subuser2: '被分账方3',
          ratio: '3:5'
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
          value: '被分账方1',
          label: '被分账方1'
        },
        {
          value: '被分账方2',
          label: '被分账方2'
        },
        {
          value: '被分账方3',
          label: '被分账方3'
        }
      ],
      subuser1List: [{
        value: '1',
        label: '本公司'
      }]
    }
  },
  created() {
    for (let i = 0; i < this.tableData.length; i++) {
      if(this.tableData[i].ratio!=''&&this.tableData[i].ratio!=null){
        const subuser1Ratio = this.tableData[i].ratio.split(':')[0]
        const subuser2Ratio = this.tableData[i].ratio.split(':')[1]
        this.tableData[i].subuser1Account = this.tableData[i].account * subuser1Ratio / 10
        this.tableData[i].subuser2Account = this.tableData[i].account * subuser2Ratio / 10
      }
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
      // this.$confirm(
      //   h('p', null, [
      //       h('span', null, '内容可以是 '),
      //       h('i', { style: 'color: teal' }, 'VNode')
      //     ]),
      //   // `将以${e.ratio}的比例分给${e.subuser1} ${e.subuser1Account}元<br>分给${e.subuser2} ${e.subuser2Account}元, 是否继续?`,
      //   '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   console.log('========提交========')
      //   this.$message({
      //     type: 'success',
      //     message: '提交成功!'
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })

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
