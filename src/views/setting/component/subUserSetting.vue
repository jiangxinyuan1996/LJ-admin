<template>
  <div id="sub-account">
    <el-dialog
      title="服务商配置"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <subUserForm :state="state" :data-to-modify="dataToModify" @createConfirm="createConfirm" @updateConfirm="updateConfirm" @close="closeDialog" @closeDialog="closeDialog" />
    </el-dialog>
    <el-dialog
      title="服务商导入"
      :close-on-click-modal="alwaysFalse"
      :visible.sync="uploadVisible"
      width="30%"
    >
      <el-upload
        ref="upload"
        style="margin-left: 10px;margin-top:10px;display: inline-block;"
        class="filter-item"
        :action="uploadUrl"
        :data="uploadData"
        :show-file-list="showFileList"
        :before-upload="handleUpload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="handleSuccess"
        :auto-upload="false"
        multiple
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确认上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
      </el-upload>
    </el-dialog>
    <div id="searchBox">
      <div id="buttonBox" style="margin:50px;">
        <span style="margin-right:10px">用户名 : </span><el-input v-model="query.id" size="mini" placeholder="单据流水号" style="width: 15vw;margin-right:15px;" class="filter-item" />

        <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" @click="init()">
          查询
        </el-button>
        <!-- <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="success" @click="create()">
          新建
        </el-button> -->
        <el-dropdown size="mini" split-button type="success" style="margin-left:15px" @click="create()" @command="handleCommand">
          新建
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{ cmd:'upload' }">
              导入
            </el-dropdown-item>
            <el-dropdown-item :command="{ cmd:'downLoad' }">下载模板</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
          prop="nickname"
          align="center"
          width="120"
          label="用户名"
        />
        <el-table-column
          prop="default_status"
          align="center"
          width="120"
          label="角色"
        />
        <el-table-column
          prop="name"
          align="center"
          width="110"
          label="账户名"
        />
        <el-table-column
          prop="phone"
          align="center"
          width="110"
          label="联系方式"
        />
        <el-table-column
          prop="bank"
          align="center"
          width="110"
          label="银行名称"
        />
        <el-table-column
          prop="card_no"
          align="center"
          width="170"
          label="提现账号"
        />

        <el-table-column label="操作" width="120" align="center">
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
import { getUserList, addUser, updateUser, deleteUser } from '@/api/tsyLj.js'
import subUserForm from './form/subUserForm'
export default {
  name: 'SubAccount',
  components: {
    subUserForm
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
      state: 'init',
      query: {
        id: ''
      },
      alwaysFalse: false,
      totalCount: 0,
      pageSize: 10,
      page: 1,
      dataToModify: {},
      tableData: [],
      currentPage: 1,
      dialogVisible: false,
      uploadVisible: false,
      loading: true,
      uploadUrl: '/TSY/home/upload/importExcel',
      uploadData: null,
      showFileList: true,
      fileList: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.uploadData = {
        flag: '服务商导入模板',
        sheet_num: '0'
      }
      this.loading = true
      getUserList().then(res => {
        console.log('getUserList---:', res)
        this.tableData = res.data.fromList.concat(res.data.toList)
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].default_status == 0) {
            this.tableData[i].default_status = '合作伙伴'
          } else if (this.tableData[i].default_status == 1) {
            this.tableData[i].default_status = '服务商'
          }
        }
        setTimeout(function() {
          this.loading = false // 改为self
        }.bind(this), 600)
      })
    },
    handleUpload(file, fileList) {
      console.log(file)
      console.log('------handleUpload------ ')
      this.uploadData.file = file
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccess(res, file, fileList) {
      console.log('===========handleSuccess=========')

      console.log('res----:', res)

      this.fileList = []
      this.init()
      if (res.success == 1) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    changeRatio(e) {
      console.log('changeRatio e---:', e)
      const subuser1Ratio = e.ratio.split(':')[0]
      const subuser2Ratio = e.ratio.split(':')[1]
      e.subuser1Account = e.account * subuser1Ratio / 10
      e.subuser2Account = e.account * subuser2Ratio / 10
    },
    modify(e) {
      console.log('edit')
      console.log('e--:', e)
      this.state = 'update'
      this.dataToModify = e
      this.dialogVisible = true
    },
    create() {
      this.state = 'create'
      this.dialogVisible = true
    },
    changePage() {
      console.log('changePage')
    },
    createConfirm(e) {
      console.log('==========createConfirm==========')
      console.log('e----:', e)
      addUser(e).then(res => {
        console.log('createVerifyInfo res=======:', res)
        this.dialogVisible = false
        this.state = 'init'
        this.dataToModify = null
        this.init()
      })
    },
    updateConfirm(e) {
      console.log('==========updateConfirm==========')
      delete e.submit_time
      delete e.state
      updateUser(e).then(res => {
        console.log('updateUser res=======:', res)
        this.dialogVisible = false
        this.state = 'init'
        this.dataToModify = null
        this.init()
      })
    },
    remove(e) {
      this.$confirm('确认删除该用户数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('========删除========')
        deleteUser({ id: e.id }).then(res => {
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
    closeDialog() {
      this.dialogVisible = false
      this.state = 'init'
      this.dataToModify = null
    },
    submitUpload() {
      this.$refs.upload.submit()
      this.uploadVisible = false
    },
    downLoadVerifyModule() {
      console.log('downLoadVerifyModule')
      window.location.href = '/mould/服务商导入模板0611.xlsx'
    },
    handleCommand(e) {
      if (e.cmd === 'downLoad') {
        this.downLoadVerifyModule()
      } else if (e.cmd === 'upload') {
        this.uploadVisible = true
      }
    }
  }
}
</script>
<style>
.el-divider--horizontal{
  margin: 5px 0;
}
.el-dialog{
  height: auto;
}
.el-dialog__body{
  height: auto;
}
</style>
