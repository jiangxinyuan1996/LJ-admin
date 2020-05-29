<template>
  <div id="sub-account">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <subRatioForm />
    </el-dialog>
    <div id="searchBox">
      <div id="buttonBox" style="margin:50px;">
        <span style="margin-right:10px">分账方名称 : </span><el-input v-model="query.id" size="mini" placeholder="单据流水号" style="width: 15vw;margin-right:15px;" class="filter-item" />

        <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" @click="clickSearch()">
          查询
        </el-button>
        <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="success" @click="create()">
          新建
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
          prop="ratio1"
          align="center"
          width="120"
          label="分账方比例"
        />
        <el-table-column
          prop="ratio2"
          align="center"
          width="120"
          label="被分账方比例"
        />

        <el-table-column label="操作" width="90"align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="left">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="modify(scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="right">
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="remove(scope.row)" />
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
import { getFromSubUserList, getToSubUserList } from '@/api/tsyLj.js'
import subRatioForm from './form/subRatioForm'
export default {
  name: 'SubAccount',
  components: {
    subRatioForm
  },
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
      query: {
        id: ''
      },
      alwaysFalse: false,
      totalCount: 0,
      pageSize: 10,
      page: 1,
      tableData: [
        {
          ratio1: '3',
          ratio2: '7'
        },
        {
          ratio1: '5',
          ratio2: '5'
        },
        {
          ratio1: '10',
          ratio2: '0'
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
      }],
      dialogVisible: false
    }
  },
  created() {
    getFromSubUserList().then(res => {
      console.log('getFromSubUserList---:', res)
    })
    for (let i = 0; i < this.tableData.length; i++) {
      if (this.tableData[i].ratio != '' && this.tableData[i].ratio != null) {
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
    modify(e) {
      this.dialogVisible = true
    },
    create() {
      this.dialogVisible = true
    }
  }
}
</script>
<style>
.el-divider--horizontal{
  margin: 5px 0;
}
</style>
