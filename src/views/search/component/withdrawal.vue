<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索区 -->
      <div v-if="showSearch" id="searchBox" style="margin:40px">
        <span style="margin-right:15px">分账方姓名:</span>
        <el-select
          v-model="listQuery.account_no"
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
          style="width:13%"
          size="mini"
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
      border
      highlight-current-row
      style="width: 100%;margin-left:50px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        prop="account_name"
        label="分账方名称"
        align="center"
        width="100"
      />
      <el-table-column
        prop="name"
        label="提现账户名"
        align="center"
        width="100"
      />
      <el-table-column
        prop="account_no"
        label="账号"
        align="center"
        width="180"
      />
      <el-table-column
        prop="bank_code"
        label="银行代码"
        align="center"
        width="160"
      />
      <el-table-column
        prop="amount_show"
        label="金额(元)"
        align="center"
        width="150"
      />
      <!-- <el-table-column
        prop="business_code"
        label="业务代码"
        align="center"
        width="100"
      /> -->
      <!-- <el-table-column
        prop="submit_time"
        label="日期"
        align="center"
        width="160"
      />  -->
      <!-- <el-table-column
        prop="currency"
        label="货币类型"
        align="center"
        width="80"
      /> -->
      <!-- <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="160"
      >
        <template slot-scope="{ $index,row }">
          <el-tooltip   class="item" effect="dark" content="修改" placement="top">
            <el-button type="primary" icon="el-icon-edit" round size="mini" @click="handleUpdate(row)" />
          </el-tooltip>
          <el-tooltip   class="item" effect="dark" content="提交" placement="top">
            <el-button type="success" icon="el-icon-check" round size="mini" @click="handleCommitOne(row)" />
          </el-tooltip> -->
      <!-- <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button type="info" icon="el-icon-message" round size="mini" @click="handleCheck(row)" />
          </el-tooltip>
          <el-tooltip v-if="(row.state==='待提交'||row.state==='异常')?true:false" class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" round size="mini" @click="handleDel($index,row)" />
          </el-tooltip> -->
      <!-- </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="margin-top:20px"
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
    <el-dialog :close-on-click-modal="alwaysFalse" title="订单修改" :visible.sync="dialogFormVisible" width="45%" @close="clearfzData">
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
import Editform from '@/components/accountForm'
export default {
  directives: { waves },
  components: {
    Editform
  },
  data() {
    return {
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
      temp: {
        status: ''
      },
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
          key: '-1',
          value: '异常'
        },
        {
          key: '2',
          value: '交易成功'
        },
        {
          key: '3',
          value: '交易失败'
        }
      ],
      value1: '',
      value2: '',
      // mock数据
      tableData: [
        {
          account_name: '本公司',
          name: '张三',
          account_no: '6227336643994455',
          bank_code: '大连银行',
          amount_show: '100'
        },
        {
          account_name: '被分账方1',
          name: '李四',
          account_no: '6227336643994455',
          bank_code: '大连银行',
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
    },
    clearfzData() {
      this.dialogFormVisible = false
      // this.handleFilter()
    }
  }
}
</script>
