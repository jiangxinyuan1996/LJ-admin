<template>
  <div id="sub-account">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <subRatioForm :data-to-modify="dataToModify" :state="state" @Commit="handleCommit" @Close="handleClose" />
    </el-dialog>
    <div id="searchBox">
      <div id="buttonBox" style="margin:50px;">
        <!-- <span style="margin-right:10px">服务商名称 : </span><el-input v-model="query.id" size="mini" placeholder="单据流水号" style="width: 15vw;margin-right:15px;" class="filter-item" /> -->
        <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" @click="init()">
          查询
        </el-button>
        <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="success" @click="create()">
          新建
        </el-button>
      </div>
    </div>

    <div id="dataForm">
      <el-table
        v-loading="loading"
        :data="tableData"
        size="mini"
        stripe
        border
        style="margin:20px;margin-left:50px;margin-right:50px;"
      >
        <el-table-column
          prop="fromratio"
          align="center"
          width="120"
          label="服务商比例"
        />
        <el-table-column
          prop="toratio"
          align="center"
          width="120"
          label="合作伙伴比例"
        />

        <el-table-column label="操作" width="90"align="center">
          <template slot-scope="scope">
            <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="left">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="modify(scope.row)" />
            </el-tooltip> -->
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
import { getRuleList, addRule, deleteRule } from '@/api/tsyLj.js'
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
      tableData: [],
      currentPage: 1,
      dialogVisible: false,
      state: 'init',
      dataToModify: null,
      loading: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      getRuleList().then(res => {
        console.log('getRuleList res---:', res)
        this.tableData = res.data
        setTimeout(function() {
          this.loading = false // 改为self
        }.bind(this), 600)
      })
    },
    create() {
      this.dialogVisible = true
    },
    handleCommit(e) {
      addRule(e).then(res => {
        console.log('addRule res----:', res)
        this.init()
      })
      this.dialogVisible = false
    },
    handleClose() {
      this.dialogVisible = false
    },
    remove(e) {
      this.$confirm('确认删除该分账比例?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('========删除========')
        deleteRule({ id: e.id }).then(res => {
          console.log('deleteRule res---:', res)
          this.init()
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    changePage() {
      console.log('changePage')
    }
  }
}
</script>
<style>
.el-divider--horizontal{
  margin: 5px 0;
}
</style>
