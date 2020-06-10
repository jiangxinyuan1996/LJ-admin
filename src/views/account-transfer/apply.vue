<template>
    <div class="transfer" style="padding-top:30px">
      <el-dialog
      title="调账信息确认"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form ref="form" :model="numberValidateForm" label-width="80px">
        <el-form-item label="转出方:">
          <span>{{numberValidateForm.outputer}}</span>
        </el-form-item>
        <el-form-item label="转入方:">
          <span>{{numberValidateForm.inputer}}</span>
        </el-form-item>
        <el-form-item label="金额:">
          <span style="color: rgb(238, 120, 0);">{{numberValidateForm.money}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
        <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item
            label="转出方"
            prop="outputer"
            :rules="[{ required: true, message: '请选择转出方', trigger: 'change' }]"
        >
         <el-select
            v-model="numberValidateForm.outputer"
            filterable
            placeholder="请输入关键词"
            >
            <el-option
            v-for="item in list"
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
            placeholder="请输入关键词"   
            >
            <el-option
            v-for="item in list"
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
            <el-input type="age" v-model.number="numberValidateForm.money" autocomplete="off" style="width:17%"></el-input>
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
        dialogVisible:false,
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
        submit(){
          this.dialogVisible=false
          this.$message({
            message:'调账成功',
            type:'success'
          })
        },
        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible=true
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
      handleClose(){
        this.dialogVisible=false
        this.$message({
          message:'调账已取消',
          type:'info'
        })
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