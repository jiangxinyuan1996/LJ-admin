<template>
   <div id="wrap" style="margin-top:20px">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="交易密码" prop="transpwd" style="width:80%">
        <el-input type="password" v-model="ruleForm.transactionPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
    data(){
        return{
            ruleForm:{
                transactionPassword:''
            },
            rules:{
               transpwd: [{ required: true, message: "请输入交易密码", trigger: "blur" }],
            }
        }
    },
    methods:{
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {

                }else{
                    
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
