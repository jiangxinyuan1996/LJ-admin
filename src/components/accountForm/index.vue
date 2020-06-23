<template>
  <div id="accountForm">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-- <el-form-item label="服务商姓名" prop="account_name">
        <el-input v-model="ruleForm.account_name"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="account_no">
        <el-input v-model="ruleForm.account_no"></el-input>
      </el-form-item>
      <el-form-item label="银行代码" prop="bank_code">
        <el-input v-model="ruleForm.bank_code"></el-input>
      </el-form-item> -->
      <el-form-item label="金额(分)" prop="amount_show">
        <el-input v-model="ruleForm.amount_show" style="width:40%" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCloseDialog()">取 消</el-button>
      <el-button type="primary" @click="handleCommitDialog">修 改</el-button>
    </span>
  </div>
</template>
<script>
export default {
  props: ['detail'],
  data() {
    return {
      ruleForm: {
        account_name: '',
        account_no: '',
        bank_code: '',
        amount_show: ''
      },
      rules: {
        account_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        account_no: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        bank_code: [
          { required: true, message: '请输入银行代码', trigger: 'blur' }
        ],
        amount_show: [
          { required: true, message: '请输入银行代码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.ruleForm = this.detail
  },
  methods: {
    handleCloseDialog() {
      this.$emit('closeForm')
    },
    handleCommitDialog() {
      this.$emit('updateCommit', this.ruleForm)
    }
  }
}
</script>
