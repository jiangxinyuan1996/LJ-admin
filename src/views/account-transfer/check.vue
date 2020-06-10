<template>
  <div class="app-container">
    <div class="filter-container">
      <el-dialog
        title="提现信息确认"
        :visible.sync="dialogVisible1"
        width="30%"
        :before-close="handleClose"
      >
        <el-form ref="form" :model="tableData" label-width="90px">
          <el-form-item label="转出方:">
            <span>{{ temp.outputer }}</span>
          </el-form-item>
          <el-form-item label="转入方:">
            <span>{{ temp.inputer }}</span>
          </el-form-item>
          <el-form-item label="日期">
            <span>{{ temp.createtime }}</span>
          </el-form-item>
          <el-form-item label="金额:">
            <span style="color: rgb(238, 120, 0);">{{ temp.amount_show }}</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 搜索区 -->
      <div v-if="showSearch" id="searchBox" style="margin:40px">
        <span style="margin-right:15px">转出方:</span>
        <el-select
          v-model="listQuery.outputer"
          filterable
          placeholder="请输入关键词"
          size="mini"
        >
          <el-option
            v-for="item in list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span style="margin:0 15px">转入方:</span>
        <el-select
          v-model="listQuery.inputer"
          filterable
          placeholder="请输入关键词"
          size="mini"
        >
          <el-option
            v-for="item in list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- <span style="margin:0 15px 0 35px">状态:</span>
        <el-select size="mini" clearable v-model="listQuery.state" placeholder="状态" style="width: 130px" @keyup.enter.native="handleFilter">
          <el-option v-for="item in states" :key="item.key" :label="item.value" :value="item.key" />
        </el-select> -->
        <span style="margin:0 18px;padding-left:5px;">日期:</span>
        <el-date-picker
          v-model="listQuery.submit_time_start"
          size="mini"
          style="width:13%"
          type="date"
          placeholder="选择日期"
        />
        <span style="margin-right:15px;margin-left:15px;">至</span>
        <el-date-picker
          v-model="listQuery.submit_time_end"
          size="mini"
          style="width:13%"
          type="date"
          placeholder="选择日期"
        />

        <el-button type="primary" size="mini" style="margin-left:15px;" @click="handleFilter">
          查询
        </el-button>
      </div>
      <!-- <el-button size="mini" v-waves class="filter-item funcbtn" v-if="isShow" type="success" :disabled="disabled" @click="handleCommit">
        提交/复核
      </el-button>
      <el-button size="mini" v-if="isShow" v-waves class="filter-item funcbtn" type="danger" icon="el-icon-delete" @click="handleDeleteAll">
        批量删除
      </el-button>
      <el-button size="mini" v-if="isShow" v-waves class="filter-item funcbtn" type="primary" @click="handleCheckVerify">
        校验四要素
      </el-button>

      <el-button size="mini"  v-waves class="filter-item funcbtn" type="primary"  style="float:right;margin-left:15px;" @click="handleCommitAll">
        全部提交
      </el-button>
      <el-button size="mini"  v-waves class="filter-item funcbtn" type="warning"  style="float:right" @click="handleExport">
        导出
      </el-button> -->
    </div>
    <!-- 查询信息表格 -->
    <el-table
      v-loading="listLoading"
      size="mini"
      :data="tableData"
      show-summary
      :summary-method="getSummaries"
      border
      highlight-current-row
      style="width: 100%;margin-left:40px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        prop="id"
        label="流水号"
        sortable
        align="center"
        width="120"
      />
      <el-table-column
        prop="outputer"
        label="转出方"
        sortable
        align="center"
        width="120"
      />
      <el-table-column
        prop="inputer"
        label="转入方"
        sortable
        align="center"
        width="120"
      />
      <el-table-column
        prop="createtime"
        label="日期"
        sortable
        align="center"
        width="200"
      />
      <el-table-column
        prop="amount_show"
        label="金额(元)"
        sortable
        align="center"
        width="150"
      />
      <el-table-column
        label="操作"
        align="center"
        width="140"
      >
        <template slot-scope="{ $index,row }">
          <el-tooltip v-if="checkPermission(['机构管理员','复核员'])" class="item" effect="dark" content="调账审核" placement="top">
            <el-button type="success" icon="el-icon-check" circle size="mini" @click="open(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="margin-top:20px;"
      :small="true"
      :current-page="listQuery.page"
      :page-sizes="[5,10]"
      :page-size="10"
      layout="total, sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 修改表单提交 -->
    <el-dialog :close-on-click-modal="alwaysFalse" title="" :visible.sync="dialogFormVisible" width="45%" @close="clearfzData">
      <Editform :detail="detailToUpdate" @closeForm="clearfzData" @updateCommit="updataForm" />
    </el-dialog>
    <!-- 表单信息查看 -->
    <el-dialog :close-on-click-modal="alwaysFalse" :title="'订单详情'" :visible.sync="formCheck">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 400px; margin-left:50px;">
        <!-- <el-form-item label="ID" prop="ID">
          <div>{{temp.id}}</div>
        </el-form-item> -->
        <el-form-item label="请求流水号 :" prop="req_sn">
          <div>{{ temp.req_sn }}</div>
        </el-form-item>
        <el-form-item label="业务代码 :" prop="business_code">
          <div>{{ temp.business_code }}</div>
        </el-form-item>
        <el-form-item label="状态 :" prop="state">
          <div>{{ temp.state }}</div>
        </el-form-item>
        <el-form-item label="提交时间 :" prop="submit_time">
          <div>{{ temp.submit_time }}</div>
        </el-form-item>
        <el-form-item label="银行代码 :" prop="bank_code">
          <div>{{ temp.bank_code }}</div>
        </el-form-item>
        <el-form-item label="账号 :" prop="account_no">
          <div>{{ temp.account_no }}</div>
        </el-form-item>
        <el-form-item label="持卡人姓名 :" prop="account_name">
          <div>{{ temp.account_name }}</div>
        </el-form-item>
        <el-form-item label="金额(分) :" prop="amount">
          <div>{{ temp.amount }}</div>
        </el-form-item>
        <el-form-item label="货币类型 :" prop="currency">
          <div>{{ temp.currency }}</div>
        </el-form-item>
        <el-form-item label="手机号/小灵通 :" prop="tel">
          <div>{{ temp.tel }}</div>
        </el-form-item>
        <el-form-item v-for="item in tempData" v-show="tempData[0].num" :key="item.num" label="分账商户信息">
          <div>分账商户:{{ item.num }}</div>
          <div>分账金额:{{ item.amount }}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formCheck = false">
          返回
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import waves from '@/directive/waves'
import permission from '@/directive/permission/index.js'
import Editform from '@/components/accountForm'
import checkPermission from '@/utils/permission'
export default {

  directives: { waves, permission },
  components: {
    Editform
  },
  data() {
    return {
      dialogVisible1: false,
      isShow: false,
      alwaysFalse: false,
      downLoadUrl: '',
      showSearch: true,
      tableKey: 0,
      disabled: false,
      list: null,
      total: 11,
      listLoading: false,
      timeStr: [],
      dellist: [],
      list: [
        {
          value: '张三'
        },
        {
          value: '李四'
        },
        {
          value: '王五'
        }
      ],
      // 查询及分页参数
      listQuery: {
        page: 1,
        limit: 10,
        business_code: '',
        state: '',
        submit_time_start: '',
        submit_time_end: '',
        bank_code: '',
        account_no: '',
        account_name: ''
      },
      detailToUpdate: {
        account_name: '',
        account_no: '',
        bank_code: '',
        account_show: ''
      },
      // 修改列表参数
      temp: {},
      tempData: [],
      rules: {
        business_code: [{ required: true, message: '必填项', trigger: 'blur' }],
        bank_code: [{ required: true, message: '必填项', trigger: 'blur' }],
        account_type: [{ required: true, message: '必填项', trigger: 'blur' }],
        account_no: [{ required: true, message: '必填项', trigger: 'blur' }],
        account_name: [{ required: true, message: '必填项', trigger: 'blur' }],
        amount: [{ required: true, message: '必填项', trigger: 'blur' }],
        id: [{ required: true, message: '必填项', trigger: 'blur' }],
        id_type: [{ required: true, message: '必填项', trigger: 'blur' }],
        tel: [{ required: true, message: '必填项', trigger: 'blur' }],
        sub_data: [{ required: true, message: '必填项', trigger: 'blur' }]

      },
      updateRules: {
        title: [{ required: true, message: '必填项', trigger: 'change' }],
        author: [{ required: true, message: '必填项', trigger: 'change' }],
        count: [{ required: true, message: '必填项', trigger: 'change' }],
        status: [{ required: true, message: '必填项', trigger: 'change' }]
      },
      // 状态选项
      states: [
        {
          key: '0',
          value: '待提交'
        },
        {
          key: '1',
          value: '待审核'
        },
        {
          key: '2',
          value: '交易成功'
        }
      ],
      value1: '',
      value2: '',
      // mock数据
      tableData: [
        {
          outputer: '本公司',
          inputer: '张三',
          createtime: '2012-5-20 08:15:20',
          amount_show: '100'
        },
        {
          outputer: '合作伙伴1',
          inputer: '张三',
          createtime: '2020-5-20 08:15:20',
          amount_show: '100'
        }
      ],
      dialogFormVisible: false,
      formCheck: false,
      dialogStatus: '',
      multipleSelection: [],
      bankCodeOptions: [],
      businessCodeOptions: [],
      bankCode: {},
      businessCode: {},
      statesCode: {
        '-1': '异常',
        '0': '待提交',
        '1': '待审核',
        '2': '交易成功',
        '3': '交易失败'
      }
    }
  },
  methods: {
    checkPermission,
    handleFilter() {
      console.log('handlefilter')
    },
    handleUpdate(row) {
      // 数据更新（修改按钮）
      this.detailToUpdate = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleCommitOne() {
      console.log('handleCommitOne')
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.listQuery.page = val
      this.handleFilter()
      // 页码切换分页调用请求传值
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.listQuery.limit = val
      // console.log(this.listQuery.limit)
      this.handleFilter()
    },
    handleSelectionChange(val) {
      this.isShow = true
      //   console.log(val)
      this.multipleSelection = val
      if (val.length === 0) {
        this.isShow = false
      }
    },
    updataForm(data) {
      this.tableData = [data]
      this.dialogFormVisible = false
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    open(row) {
      this.dialogVisible1 = true
      console.log(row)
      this.temp = { ...row }
    },
    submit() {
      this.$message({
        message: '调账复核成功',
        type: 'success'
      })
      this.dialogVisible1 = false
    },
    clearfzData() {
      this.dialogFormVisible = false
      // this.handleFilter()
    },
    handleClose() {
      this.dialogVisible1 = false
      this.$message({
        message: '调账复核已取消',
        type: 'info'
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      // console.log(columns)
      console.log(data)

      const sums = []
      columns.forEach((column, index) => {
        console.log(column)
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 4) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              console.log(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += ''
          } else {
            sums[index] = 'N/A'
          }
        }
      })

      return sums
    }
  }
}
</script>
