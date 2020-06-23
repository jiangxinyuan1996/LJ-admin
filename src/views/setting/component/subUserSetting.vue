<template>
  <div id="sub-account">
    <el-dialog
      title="服务商配置"
      :visible.sync="dialogVisible"
      :close-on-click-modal="alwaysFalse"
      width="30%"
    >
      <subUserForm :state="state" :data-to-modify="dataToModify" @createConfirm="createConfirm" @updateConfirm="updateConfirm" @close="closeDialog" @closeDialog="closeDialog" />
    </el-dialog>
    <el-dialog
      title="激活服务商"
      :visible.sync="activateDialogVisible"
      width="30%"
    >
      <el-steps :active="active" finish-status="success">
        <el-step title="企业信息认证" />
        <el-step title="等待认证" />
        <el-step title="绑定手机" />
        <el-step title="绑定银行卡" />
        <el-step title="电子签约" />
      </el-steps>
      <div v-if="active==0" v-loading="activeLoading">
        <div style="margin-top:15px;">
          <span style="line-height:15px;">法人姓名 : </span><span>{{ activateObj.name }}</span>
        </div>
        <div style="margin-top:15px;">
          <span style="margin-top:15px;">法人证件号 : </span><span>{{ activateObj.identityno }}</span>
        </div>
        <el-button style="margin-top: 15px;" size="mini" @click="checkRealName()">下一步</el-button>
      </div>
      <div v-if="active==1" v-loading="activeLoading">
        <span v-show="!isCheckPass">验证中...</span>
        <span v-show="isCheckPass">验证通过!</span>
        </br>
        <el-button v-show="isCheckPass" style="margin-top: 15px;" size="mini" @click="next()">下一步</el-button>
      </div>
      <div v-if="active==2" v-loading="activeLoading">
        <span>手机号 : </span><span>{{ activateObj.phone }}</span>
        <el-button size="mini" class="filter-item" style="margin-left: 10px;margin-top:15px;" type="primary" @click="sendCode()">
          获取验证码
        </el-button>
        </br>
        <span>验证码 : </span><el-input v-model="verifyCode" size="mini" style="width:160px;margin-top:15px;" placeholder="请输入验证码" />
        </br>
        <el-button style="margin-top: 15px;" size="mini" @click="checkCode()">下一步</el-button>
      </div>

      <div v-if="active==3" v-loading="activeLoading">
        <div style="margin-top:15px;">
          <span style="line-height:15px;">姓名 : </span><span>{{ activateObj.name }}</span>
        </div>
        <div style="margin-top:15px;">
          <span style="margin-top:15px;">身份证 : </span><span>{{ activateObj.identityno }}</span>
        </div>
        <div style="margin-top:15px;">
          <span style="margin-top:15px;">银行预留手机号 : </span><span>{{ activateObj.bank_phone }}</span>
        </div>
        <div style="margin-top:15px;">
          <span style="margin-top:15px;">银行卡号 : </span><span>{{ activateObj.card_no }}</span>
        </div>
        <el-button style="margin-top: 15px;" size="mini" @click="checkBank()">下一步</el-button>
      </div>
      <div v-if="active==4" v-loading="activeLoading">
        <!-- <iframe id="iframe" style="width:100%;height:100%" scrolling="yes" :src="iframeUrl" /> -->
        <div style="text-align:center;margin-top:20px"><el-button type="primary" @click="jump()">点击跳转至电子签约页面</el-button></div>

        </br>
        <el-button style="margin-top: 15px;" size="mini" @click="next">{{ nextStr }}</el-button>
      </div>

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
        <span style="margin-right:10px">用户名 : </span><el-input v-model="query.id" size="mini" placeholder="用户名" style="width: 15vw;margin-right:15px;" class="filter-item" />
        <span style="margin-right:10px">状态 : </span>
        <el-select v-model="query.status" size="mini" clearable style="width: 8vw;" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
        style="width:90%;margin:0 5%"
      >
        <el-table-column
          prop="nickname"
          align="center"
          width="120"
          label="用户名"
        />
        <el-table-column
          prop="status"
          align="center"
          width="120"
          label="状态"
        >
          <template slot-scope="scope">
            <el-tag v-show="scope.row.step==4" type="success">已激活</el-tag>
            <el-tag v-show="scope.row.step!=4" type="warning">未激活</el-tag>
          </template>
        </el-table-column>
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

        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.step!=4" class="item" effect="dark" content="激活" placement="left">
              <el-button type="success" icon="el-icon-magic-stick" circle size="mini" @click="activate(scope.row)" />
            </el-tooltip>
            <el-tooltip v-if="scope.row.step==4" class="item" effect="dark" content="设置支付密码" placement="left">
              <el-button type="warning" icon="el-icon-s-goods" circle size="mini" @click="manageCode(scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
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
import { getUserListByAll, addUser, updateUser, deleteUser, getCode, bindPhone, setRealName, bindBankCard, signContract, getMemberInfo, passRealName, setPayPwd } from '@/api/tsyLj.js'
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
      fileList: [],
      options: [{
        label: '已激活',
        value: '3'
      }, {
        label: '未激活',
        value: '1'
      }, {
        label: '激活中',
        value: '2'
      }],
      activateDialogVisible: false,
      active: 0,
      nextStr: '下一步',
      activateObj: {},
      verifyCode: '',
      iframeUrl: '',
      isCheckPass: false,
      activeLoading: false
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
      getUserListByAll().then(res => {
        console.log('getUserListByAll---:', res)
        this.tableData = res.data
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
    activate(e) {
      console.log('activate e-----:', e)
      this.activateDialogVisible = true
      this.activateObj = e
      this.active = Number(e.step)
      if (this.active == 4) {
        const data = {
          bizUserId: this.activateObj.id
        }
        signContract(data).then(res => {
          console.log('signContract res---:', res)
          this.iframeUrl = res.data.url
          console.log('this.iframeUrl---:', this.iframeUrl)
          // const iframe = document.getElementById('iframe').contentWindow
          // const son = document.getElementById('iframe')
          // son.style.height = 500 + 'px'
        })
      } else if (this.active == 1) {
        this.isCheckPass = false
        getMemberInfo({ bizUserId: this.activateObj.id }).then(res => {
          console.log('getMemberInfo res---:', res)
          console.log('=====', (res.data.status == 2 || res.data.isIdentityChecked == true))
          if (res.data.status == 2 || res.data.isIdentityChecked == true) {
            this.isCheckPass = true
          }
        })
      }
      this.nextStr = '完成'
    },
    handleUpload(file, fileList) {
      console.log(file)
      console.log(typeof (file))
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
    next() {
      this.isCheckPass = false
      if (this.active == 1) {
        passRealName({ bizUserId: this.activateObj.id }).then(res => {
          console.log('passRealName res--:', res)
        })
        this.active++
        this.isCheckPass = false
      } else if (this.active == 3) {
        this.nextStr = '完成'
        this.active++
      } else if (this.active == 4) {
        this.activateDialogVisible = false
        this.init()
      } else {
        this.active++
      }
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
        if (res.success == 1) {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.dialogVisible = false
          this.state = 'init'
          this.dataToModify = null
          this.init()
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
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
      window.location.href = 'mould/服务商导入模板0611.xlsx'
    },
    handleCommand(e) {
      if (e.cmd === 'downLoad') {
        this.downLoadVerifyModule()
      } else if (e.cmd === 'upload') {
        this.uploadVisible = true
      }
    },
    sendCode() {
      console.log('==========sendCode==========')
      this.activeLoading = true
      const param = {
        bizUserId: this.activateObj.id,
        phone: this.activateObj.phone
      }
      getCode(param).then(res => {
        console.log('getCode res--:', res)
        this.activeLoading = false
      })
    },
    checkCode() {
      console.log('==========checkCode==========')
      this.activeLoading = true
      const param = {
        bizUserId: this.activateObj.id,
        phone: this.activateObj.phone,
        code: this.verifyCode
      }
      bindPhone(param).then(res => {
        console.log('bindPhone res--:', res)
        this.active++
        this.activeLoading = false
      })
    },
    checkRealName() {
      console.log('==========checkRealName==========')
      this.activeLoading = true
      const param = {
        bizUserId: this.activateObj.id,
        name: this.activateObj.name,
        identityNo: this.activateObj.identityno
      }
      setRealName(param).then(res => {
        console.log('setRealName res--:', res)
        this.active++
        getMemberInfo({ bizUserId: this.activateObj.id }).then(res => {
          console.log('getMemberInfo res---:', res)
          this.activeLoading = false
          console.log('=====', (res.data.status == 2 || res.data.isIdentityChecked == true))
          if (res.data.status == 2 || res.data.isIdentityChecked == true) {
            this.isCheckPass = true
          }
        })
      })
    },
    checkBank() {
      console.log('==========checkBank==========')
      this.activeLoading = true
      const param = {
        bizUserId: this.activateObj.id,
        name: this.activateObj.name,
        identityNo: this.activateObj.identityno,
        bank_phone: this.activateObj.bank_phone,
        card_no: this.activateObj.card_no
      }
      bindBankCard(param).then(res => {
        console.log('bindBankCard res--:', res)
        this.active++
        const data = {
          bizUserId: this.activateObj.id
        }
        signContract(data).then(res => {
          console.log('signContract res---:', res)
          this.iframeUrl = res.data.url
          console.log('this.iframeUrl---:', this.iframeUrl)
          this.activeLoading = false
          // const iframe = document.getElementById('iframe').contentWindow
          // const son = document.getElementById('iframe')
          // son.style.height = 500 + 'px'
        })
      })
    },
    jump() {
      window.open(this.iframeUrl, '_blank')
    },
    manageCode(e) {
      console.log('manageCode e------:', e)
      let param = {
        bizUserId:e.id
      }
      setPayPwd(param).then(res=>{
        console.log('setPayPwd res---:',res);
        let jumpUrl = res.data.url
        window.open(jumpUrl, '_blank')
      })
    }
  }
}
</script>
<style>
.el-divider--horizontal{
  margin: 5px 0;
}
.el-dialog{
  width: 50% !important;
  height: auto;
}
.el-dialog__body{
  margin: 20px;
  height: auto;
}
</style>
