<template>
  <div id="password">
    <el-form ref="form" style="margin:15px;" :rules="rules" :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
      <el-form-item label="请输入登录密码" prop="password" style="width: 20vw;">
        <el-input v-model="formLabelAlign.password" type="password" />
      </el-form-item>
      <el-form-item label="请输入提现密码" prop="pay_pwd">
        <el-input v-model="formLabelAlign.pay_pwd" style="width: 20vw;" type="password" />
      </el-form-item>
      <el-form-item label="请确认提现密码" prop="confirm_pay_pwd">
        <el-input v-model="formLabelAlign.confirm_pay_pwd" style="width: 20vw;" type="password" />
      </el-form-item>
    </el-form>
    <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="success" @click="submitForm('form')">
      修改密码
    </el-button>
  </div>
</template>

<script>
import { setPassword } from '@/api/tsyaccount'
export default {
  name: 'Password',
  data() {
    return {
      formLabelAlign: {
        password: '',
        pay_pwd: '',
        confirm_pay_pwd: ''
      },
      labelPosition: 'top',
      rules: {
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ],
        pay_pwd: [
          { required: true, message: '请输入提现密码', trigger: 'blur' }
        ],
        confirm_pay_pwd: [
          { required: true, message: '请确认提现密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          setPassword(this.formLabelAlign).then(res => {
            if (res.success === 1) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.formLabelAlign = {
                password: '',
                pay_pwd: '',
                confirm_pay_pwd: ''
              }
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            message: '请填写必要信息',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style>
</style>
