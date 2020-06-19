<template>
  <div>
    <el-form :model="createForm" size="mini" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="nickname" style="margin-top:0;display: inline-block;">
        <el-input v-model="createForm.nickname" />
      </el-form-item>
      <el-form-item label="角色" prop="default_status">
        <el-select v-model="createForm.default_status" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="账户名" prop="name" style="margin-top:0;display: inline-block;">
        <el-input v-model="createForm.name" :disabled="state=='update'" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="createForm.phone" :disabled="state=='update'" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="身份证" prop="identityno">
        <el-input v-model="createForm.identityno" :disabled="state=='update'" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="银行卡号" prop="card_no">
        <el-input v-model="createForm.card_no" :disabled="state=='update'" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="预留手机号" prop="bank_phone">
        <el-input v-model="createForm.bank_phone" :disabled="state=='update'" style="width:15vw;" />
      </el-form-item>
      <el-divider />
      <el-form-item label="银行名称" prop="bank" style="margin-top:0;display: inline-block;">
        <el-select v-model="createForm.bank" :disabled="state=='update'" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in bankCodeOptions"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="企业名称" prop="companyName">
        <el-input v-model="createForm.companyName" :disabled="state=='update'" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="统一社会信用" prop="uniCredit">
        <el-input v-model="createForm.uniCredit" :disabled="state=='update'" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="开户行支行" prop="subbranch">
        <el-input v-model="createForm.subbranch" :disabled="state=='update'" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="支行行号" prop="unionBank">
        <el-input v-model="createForm.unionBank" :disabled="state=='update'" style="width:15vw;" />
      </el-form-item>
      <el-form-item v-if="state=='create'" label="营业执照" prop="business_license">
        <el-upload
          ref="imgBroadcastUpload"
          :auto-upload="false"
          multiple
          :file-list="businessLicenseList"
          :on-change="businessLicenseChange"
          :on-remove="businessLicenseRemove"
          :limit="1"
          action=""
        >
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <!-- <el-form-item v-if="state=='create'" label="银行开户证明"prop="account_opening_permit">
        <el-upload
          ref="imgBroadcastUpload"
          :auto-upload="false"
          multiple
          :file-list="accountOpeningPermitList"
          :on-change="accountOpeningPermitChange"
          :on-remove="accountOpeningPermitRemove"
          :limit="1"
          action=""
        >
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item> -->
      <el-form-item v-if="state=='create'" label="身份证(正)"prop="id_card_f">
        <el-upload
          ref="imgBroadcastUpload"
          :auto-upload="false"
          multiple
          :file-list="idCardFList"
          :on-change="idCardFChange"
          :on-remove="idCardFRemove"
          :limit="1"
          action=""
        >
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="state=='create'" label="身份证(反)"prop="id_card_b">
        <el-upload
          ref="imgBroadcastUpload"
          :auto-upload="false"
          multiple
          :file-list="idCardBList"
          :on-change="idCardBChange"
          :on-remove="idCardBRemove"
          :limit="1"
          action=""
        >
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCloseDialog()">取 消</el-button>
      <el-button type="primary" @click="handleCommitDialog">确 定</el-button>
    </span>
  </div>
</template>
<script>
import bankCodeOptionsConstant from '@/constant/bank.js'
import { uploadImgToBase64 } from '@/utils/imgToBase64' // 导入本地图片转base64的方法
export default {
  props: {
    dataToModify: {
      type: Object,
      default: {}
    },
    state: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      createForm: {
        nickname: '',
        name: '',
        bank: '',
        default_status: '',
        card_no: '',
        phone: '',
        bank_phone: '',
        companyName: '',
        uniCredit: '',
        subbranch: '',
        unionBank: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入账户名', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        identityNo: [
          { required: true, message: '请输入身份证', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        bank_phone: [
          { required: true, message: '请输入预留手机号', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        default_status: [
          { required: true, message: '请输入角色', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        card_no: [
          { required: true, message: '请输入银行卡号', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      bankCodeOptions: [],
      typeOptions: [{
        label: '服务商',
        value: '1'
      }, {
        label: '合作伙伴',
        value: '0'
      }],
      businessLicenseList: [],
      accountOpeningPermitList: [],
      idCardFList: [],
      idCardBList: [],
      uploadUrl: '/TSY/home/user/addUser',
      uploadData: null,
      showFileList: true
    }
  },
  watch: {
    state: function(val, oldVal) {
      // 外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if (val === 'update') {
        this.createForm = Object.assign({}, this.dataToModify)
      } else if (val === 'create') {
        this.createForm = {
          nickname: '',
          name: '',
          bank: '',
          default_status: '',
          card_no: '',
          phone: '',
          bank_phone: '',
          companyName: '',
          uniCredit: '',
          subbranch: '',
          unionBank: ''
        }
      }
    }
  },
  created() {
    this.bankCodeOptions = bankCodeOptionsConstant
    if (this.dataToModify) {
      this.createForm = Object.assign({}, this.dataToModify)
    }
  },
  methods: {
    async handleCommitDialog() {
      console.log('handleCommitDialog')
      let bankCode = this.createForm.bank
      for (let i = 0; i < bankCodeOptionsConstant.length; i++) {
        if (bankCode == bankCodeOptionsConstant[i].key) {
          bankCode = bankCodeOptionsConstant[i].value
          this.createForm.bank = bankCode
          break
        }
      }
      console.log('bankCode---:', bankCode)
      if (this.createForm.default_status == '合作伙伴') {
        this.createForm.default_status = 0
      } else if (this.createForm.default_status == '服务商') {
        this.createForm.default_status = 1
      }

      await this.submitDialogData('business_license', this.businessLicenseList)
      // await this.submitDialogData('account_opening_permit', this.accountOpeningPermitList)
      await this.submitDialogData('id_card_f', this.idCardFList)
      await this.submitDialogData('id_card_b', this.idCardBList)

      console.log('this.createForm---:', this.createForm)

      if (this.state === 'create') {
        this.testList = []
        this.$emit('createConfirm', this.createForm)
      } else if (this.state === 'update') {
        this.testList = []
        this.$emit('updateConfirm', this.createForm)
      }
    },
    handleCloseDialog() {
      this.testList = []
      this.$emit('closeDialog')
    },
    businessLicenseChange(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 2 // 上传头像图片大小不能超过 1MB
      if (!isLt2M) {
        this.businessLicenseList = fileList.filter(v => v.uid !== file.uid)
        this.$message.error('图片选择失败，每张图片大小不能超过 1MB,请重新选择!')
      } else {
        this.businessLicenseList.push(file)
      }
    },
    businessLicenseRemove(file, fileList) {
      this.businessLicenseList = fileList
    },
    accountOpeningPermitChange(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 2 // 上传头像图片大小不能超过 1MB
      if (!isLt2M) {
        this.accountOpeningPermitList = fileList.filter(v => v.uid !== file.uid)
        this.$message.error('图片选择失败，每张图片大小不能超过 1MB,请重新选择!')
      } else {
        this.accountOpeningPermitList.push(file)
      }
    },
    // 有图片移除后 触发
    accountOpeningPermitRemove(file, fileList) {
      this.accountOpeningPermitList = fileList
    },
    idCardFChange(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 2 // 上传头像图片大小不能超过 1MB
      if (!isLt2M) {
        this.idCardFList = fileList.filter(v => v.uid !== file.uid)
        this.$message.error('图片选择失败，每张图片大小不能超过 1MB,请重新选择!')
      } else {
        this.idCardFList.push(file)
      }
    },
    // 有图片移除后 触发
    idCardFRemove(file, fileList) {
      this.idCardFList = fileList
    },
    idCardBChange(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 2 // 上传头像图片大小不能超过 1MB
      if (!isLt2M) {
        this.idCardBList = fileList.filter(v => v.uid !== file.uid)
        this.$message.error('图片选择失败，每张图片大小不能超过 1MB,请重新选择!')
      } else {
        this.idCardBList.push(file)
      }
    },
    // 有图片移除后 触发
    idCardBRemove(file, fileList) {
      this.idCardBList = fileList
    },
    async submitDialogData(name, imgList) {
      const imgBroadcastListBase64 = []
      console.log('图片转base64开始...')
      // 并发 转码轮播图片list => base64
      const filePromises = imgList.map(async file => {
        const response = await uploadImgToBase64(file.raw)
        // return response.result.replace(/.*;base64,/, '') // 去掉data:image/jpeg;base64,
        return response.result // 去掉data:image/jpeg;base64,
      })
      // 按次序输出 base64图片
      for (const textPromise of filePromises) {
        imgBroadcastListBase64.push(await textPromise)
      }
      console.log('图片转base64结束..., ', imgBroadcastListBase64)
      if (imgBroadcastListBase64.length > 0) {
        this.createForm[name] = imgBroadcastListBase64[0]
      } else {
        this.createForm[name] = ''
      }
    }
  }
}
</script>

<style>
</style>
