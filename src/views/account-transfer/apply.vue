<template>
  <div class="transfer" style="padding-top:30px">
    <el-dialog
      title="调账信息确认"
      :visible.sync="dialogVisible"
      width="25%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="numberValidateForm" label-width="80px">
        <el-form-item label="转出方:">
          <span>{{ outputer }}</span>
        </el-form-item>
        <el-form-item label="转入方:">
          <span>{{ inputer }}</span>
        </el-form-item>
        <el-form-item label="金额:">
          <span style="color: rgb(238, 120, 0);">{{ numberValidateForm.money }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-form ref="numberValidateForm" :model="numberValidateForm" label-width="100px" class="demo-ruleForm">
      <el-form-item
        label="转出方"
        prop="outputer"
        :rules="[{ required: true, message: '请选择转出方', trigger: 'change' }]"
      >
         <el-select
            v-model="numberValidateForm.outputer"
            filterable
            clearable
            placeholder="请输入关键词"
            @change="change"
            >
            <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="账户余额:">
        <span style="color:blue">{{ amount }}</span><span> 元</span>
      </el-form-item>
      <el-form-item
        label="转入方"
        prop="inputer"
        :rules="[{ required: true, message: '请选择转入方', trigger: 'change' }]"
      >
         <el-select
            v-model="numberValidateForm.inputer"
            filterable
            clearable
            placeholder="请输入关键词"
            >
            <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="金额"
        prop="money"
        :rules="[
          { required: true, message: '金额不能为空'},
        ]"
      >
        <el-input v-model="numberValidateForm.money" type="text" autocomplete="off" style="width:17%" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('numberValidateForm')">提交</el-button>
        <el-button @click="resetForm('numberValidateForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getBalance, applyTransfer } from '@/api/tsyaccount'
import { getUserList } from '@/api/tsyLj'

export default {
  data() {
    return {
      dialogVisible: false,
      numberValidateForm: {
        inputer: '',
        outputer: '',
        money: ''
      },
      amount: 0,
      options: [],
      list: [],
      loading: false
    }
  },
  computed: {
    outputer() {
      const name = this.list.map(item => {
        if (item.id === this.numberValidateForm.outputer) {
          return item.nickname
        }
      }).join('')
      return name
    },
    inputer() {
      const name = this.list.map(item => {
        if (item.id === this.numberValidateForm.inputer) {
          return item.nickname
        }
      }).join('')
      return name
    }
  },
  mounted() {
    getUserList().then(res => {
      this.list = [...res.data.fromList, ...res.data.toList]
    })
  },
  methods: {
    change() {
      getBalance({ from_user_id: this.numberValidateForm.outputer }).then(res => {
        console.log('转出方余额', res)
        this.amount = res.data.allAmount
      })
    },
    submit() {
      this.dialogVisible = false
      this.loading=true
      applyTransfer({ from_user_id: this.numberValidateForm.outputer, to_user_id: this.numberValidateForm.inputer, amount: this.numberValidateForm.money }).then(res => {
        if (res.success === 1) {
          this.$message({
            message: res.message,
            type: 'success'
          })
        }else{
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
        this.loading=false
        this.resetForm('numberValidateForm')
          this.amount = 0
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(Number(this.amount)>=Number(this.numberValidateForm.money)){
              this.dialogVisible=true
            }else{
              console.log(this.amount>=Number(this.numberValidateForm.money))
              this.$message({
                message:'调账金额不能大于转出方账户余额',
                type:'warning'
              })
            }
          } else {
              this.$message({
                message: '请填写必要信息',
                type: 'warning'
                });
            console.log('error submit!!');
            return false;
          }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleClose() {
      this.dialogVisible = false
      this.$message({
        message: '调账已取消',
        type: 'info'
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.list.filter(item => {
            return item.label
              .indexOf(query) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
