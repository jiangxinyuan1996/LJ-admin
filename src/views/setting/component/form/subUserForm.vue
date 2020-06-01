<template>
  <div>
    <el-form :model="createForm" size="mini" :rules="rules" label-width="100px">
      <el-form-item label="分账方名称" prop="name" style="margin-top:0;display: inline-block;">
        <el-input v-model="createForm.account_name" />
      </el-form-item>
      <el-form-item label="分账方类型" prop="type">
        <el-select v-model="createForm.id_type" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提现账户名" prop="bank_name" style="margin-top:0;display: inline-block;">
        <el-input v-model="createForm.id" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="银行卡号" prop="card_num">
        <el-input v-model="createForm.account_no" style="width:15vw;" @blur="getAccountInfo()" />
      </el-form-item>
      <el-form-item label="银行名称" prop="bank_code" style="margin-top:0;display: inline-block;">
        <el-select v-model="createForm.bank_code" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in bankCodeOptions"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
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
        bank_code: '',
        account_type: '',
        account_no: '',
        account_name: '',
        account_prop: '',
        id_type: '',
        id: '',
        tel: '',
        merrem: ''
      },
      rules: {
        bank_code: [
          { required: true, message: '请输入银行代码', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        account_type: [
          { required: true, message: '请输入账号类型', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        account_no: [
          { required: true, message: '请输入账号', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        account_name: [
          { required: true, message: '请输入账号名', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        account_prop: [
          { required: true, message: '请输入账号属性', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        id_type: [
          { required: true, message: '请输入开户证件类型', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        id: [
          { required: true, message: '请输入证件号', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        merrem: [
          { required: true, message: '请输入商户保留信息', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      bankCodeOptions: [],
      typeOptions: [{
        label: '分账方',
        value: '分账方'
      }, {
        label: '被分账方',
        value: '被分账方'
      }]
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
          bank_code: '',
          account_type: '',
          account_no: '',
          account_name: '',
          account_prop: '',
          id_type: '',
          id: '',
          tel: '',
          merrem: ''
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
  }
}
</script>

<style>

</style>
