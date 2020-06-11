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
        <el-input v-model="createForm.name" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="createForm.phone" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="身份证" prop="id">
        <el-input v-model="createForm.id" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="银行卡号" prop="card_no">
        <el-input v-model="createForm.card_no" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="预留手机号" prop="tel">
        <el-input v-model="createForm.tel" style="width:15vw;" />
      </el-form-item>
      <el-divider />
      <el-form-item label="银行名称" prop="bank" style="margin-top:0;display: inline-block;">
        <el-select v-model="createForm.bank" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in bankCodeOptions"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="企业名称" prop="company_name">
        <el-input v-model="createForm.company_name" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="统一社会信用" prop="company_id">
        <el-input v-model="createForm.company_id" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="开户行支行" prop="subbranch">
        <el-input v-model="createForm.subbranch" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="支行行号" prop="subbranch_num">
        <el-input v-model="createForm.subbranch_num" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="营业执照" prop="business_license">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="businessLicenseOnChange"
          :file-list="testList"
          :limit="1"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="开户许可证" prop="account_opening_permit">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="accountOpeningPermitOnChange"
          :file-list="testList"
          :limit="1"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="身份证(正)" prop="id_card_f">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="idCardFOnChange"
          :file-list="testList"
          :limit="1"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="身份证(反)" prop="id_card_b">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="idCardBOnChange"
          :file-list="testList"
          :limit="1"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
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
import bankCodeOptionsConstant from '@/constant/bankCodeList.js'
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
        tel: '',
        company_name: '',
        company_id: '',
        subbranch: '',
        subbranch_num: ''
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
        id: [
          { required: true, message: '请输入身份证', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        tel: [
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
      testList: []
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
          tel: '',
          company_name: '',
          company_id: '',
          subbranch: '',
          subbranch_num: ''
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
    handleCommitDialog() {
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
    businessLicenseOnChange(file, fileList) {
      console.log('testList---:', this.testList)
      console.log('businessLicenseOnChange--:', file, fileList)
      this.createForm.businessLicense = file
    },
    accountOpeningPermitOnChange(file, fileList) {
      console.log('accountOpeningPermitOnChange--:', file, fileList)
      this.createForm.accountOpeningPermit = file
    },
    idCardFOnChange(file, fileList) {
      console.log('idCardFOnChange--:', file, fileList)
      this.createForm.idCardF = file
    },
    idCardBOnChange(file, fileList) {
      console.log('idCardBOnChange--:', file, fileList)
      this.createForm.idCardB = file
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    }
  }
}
</script>

<style>
</style>
