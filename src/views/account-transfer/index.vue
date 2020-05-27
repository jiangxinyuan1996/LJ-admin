<template>
    <div class="transfer" style="padding-top:30px">
        <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item
            label="转出方"
            prop="outputer"
            :rules="[{ required: true, message: '请选择转出方', trigger: 'change' }]"
        >
         <el-select
            v-model="numberValidateForm.outputer"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
            >
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        </el-form-item>
         <el-form-item
            label="转入方"
            prop="inputer"
            :rules="[{ required: true, message: '请选择转入方', trigger: 'change' }]"
        >
         <el-select
            v-model="numberValidateForm.inputer"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
            >
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        </el-form-item>
         <el-form-item
            label="金额"
            prop="money"
            :rules="[
            { required: true, message: '金额不能为空'},
            { type: 'number', message: '金额必须为数字值'}
            ]"
        >
            <el-input type="age" v-model.number="numberValidateForm.money" autocomplete="off" style="width:15%"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('numberValidateForm')">提交</el-button>
            <el-button @click="resetForm('numberValidateForm')">重置</el-button>
        </el-form-item>
        </el-form>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        numberValidateForm:{
            inputer: '',
            outputer: '',
            money:''
        },
        options: [],
        list: [],
        loading: false,
        states: ["张一","张三","张二","王一","王三","王二","孙一","孙三","孙二","周一","周三","周二"]
      }
    },
    mounted() {
      this.list = this.states.map(item => {
        return { value: `${item}`, label: `${item}` };
      });
    },
    methods: {
        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('提交成功!');
            console.log(this.numberValidateForm)
          } else {
              this.$message({
                message: '请填写必要信息',
                type: 'warning'
                });
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options = this.list.filter(item => {
              return item.label
                .indexOf(query) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>