<template>
  <div id="password">
    <el-form style="margin:15px;" :rules="rules" :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
      <el-form-item label="请输入登录密码" prop="passWord" style="width: 20vw;">
        <el-input v-model="passWord" />
      </el-form-item>
      <el-form-item label="请输入旧密码">
        <el-input v-model="formLabelAlign.oldPassWord" style="width: 20vw;" type="password" prop="oldPassWord" />
      </el-form-item>
      <el-form-item label="请输入新密码">
        <el-input v-model="newPassWord" style="width: 20vw;" type="password" prop="newPassWord" />
      </el-form-item>
      <el-form-item label="请确认新密码">
        <el-input v-model="confirmPassword" style="width: 20vw;" type="password" prop="confirmPassword" />
      </el-form-item>
    </el-form>
    <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="success" @click="modify()">
      修改密码
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'Password',
  data() {
    return {
      formLabelAlign: {},
      passWord: '',
      oldPassWord: '',
      newPassWord: '',
      confirmPassword: '',
      labelPosition: 'top',
      rules: {
        passWord: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ], oldPassWord: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ], newPassWord: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ], confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    modify() {
      console.log('modify', this.formLabelAlign.oldPassWord)
      const h = this.$createElement
      this.$msgbox({
        title: '信息确认',
        message: h('p', null, [
          h('span', null, `是否确认修改密码? `)
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            setTimeout(() => {
              done()
              instance.confirmButtonLoading = false
            }, 300)
          } else {
            done()
          }
        }
      }).then(action => {
        this.$message({
          type: 'info',
          message: 'action: ' + action
        })
      })
    }
  }
}
</script>
<style>
</style>
