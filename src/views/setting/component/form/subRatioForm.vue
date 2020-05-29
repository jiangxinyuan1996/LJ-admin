<template>
  <div>
    <el-form :model="createForm" size="mini" :rules="rules" label-width="100px" >
      <el-form-item label="分账方比例" prop="name" style="margin-top:0;display: inline-block;">
        <el-input-number v-model="num1" :precision="2" :step="0.01" :max="10"></el-input-number>
      </el-form-item>
      <el-form-item label="被分账方比例" prop="name" style="margin-top:0;display: inline-block;">
        <el-input-number v-model="num2" disabled :precision="2" :step="0.01" :max="10"></el-input-number>
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
      num1:0,
      num2:10,
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
      typeOptions:[{
        label:'分账方',
        value:'分账方'
      },{
        label:'被分账方',
        value:'被分账方'
      }]
    }
  },
  watch: {
    state: function(val, oldVal) {
      // 外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if (val === 'update') {
        this.createForm = Object.assign({},this.dataToModify)
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
    if( this.dataToModify ){
      this.createForm = Object.assign({},this.dataToModify)
    }

  },
  methods: {
  },
  watch:{
    num1: function (val, oldVal) {
      this.num2 = 10-val
    }
  }
}
</script>

<style>

</style>
