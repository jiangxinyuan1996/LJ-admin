<template>
  <div>
    <el-form :model="createForm" size="mini" :rules="rules" label-width="100px">
      <el-form-item label="分账方名称" prop="nickname" style="margin-top:0;display: inline-block;">
        <el-input v-model="createForm.nickname" />
      </el-form-item>
      <el-form-item label="分账方类型" prop="default_status">
        <el-select v-model="createForm.default_status" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提现账户名" prop="name" style="margin-top:0;display: inline-block;">
        <el-input v-model="createForm.name" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="createForm.phone" style="width:15vw;" />
      </el-form-item>
      <el-form-item label="银行卡号" prop="card_no">
        <el-input v-model="createForm.card_no" style="width:15vw;" />
      </el-form-item>
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
        phone: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入分账方名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入提现账户名', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        bank: [
          { required: true, message: '请输入银行', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        default_status: [
          { required: true, message: '请输入分账方类型', trigger: 'blur' }
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
        label: '分账方',
        value: '1'
      }, {
        label: '被分账方',
        value: '0'
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
          nickname: '',
          name: '',
          bank: '',
          default_status: '',
          card_no: '',
          phone: ''
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
    handleCommitDialog(){
      console.log('handleCommitDialog')
      let bankCode = this.createForm.bank
      for(let i=0;i<bankCodeOptionsConstant.length;i++){
        if(bankCode==bankCodeOptionsConstant[i].key){
          bankCode = bankCodeOptionsConstant[i].value
          this.createForm.bank = bankCode
          break
        }
      }
      console.log('bankCode---:',bankCode);
      if(this.createForm.default_status=='被分账方'){
        this.createForm.default_status=0
      }else if (this.createForm.default_status=='分账方') {
        this.createForm.default_status=1
      }
      if (this.state === 'create') {
        this.$emit('createConfirm', this.createForm)
      } else if (this.state === 'update') {
        this.$emit('updateConfirm', this.createForm)
      }
    }
  }
}
</script>

<style>

</style>
