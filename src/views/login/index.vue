<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">通商云分账管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="chooseRoles"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button  type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="chooseRoles">登录</el-button>
      <el-dialog :visible.sync="dialogFormVisible" style="width:80%;margin-left:150px;" :before-close="handleClose">
        <el-form
          ref="dataForm"
          :rules="rolerules"
          :model="temp"
          label-position="left"
          label-width="70px"
          style="width: 100%; margin-left:50px;"
        >
        <el-form-item label="选择角色" prop="roles">
            <el-select
              v-model="temp.role_id"
              class="filter-item"
              placeholder="请选择"
              style="width:90%"
            >
              <el-option
                v-for="item in formData"
                :key="item.role_id"
                :label="item.remark"
                :value="item.role_id"
              ><i :class="item==='管理员'?'el-icon-user-solid':'el-icon-user'" style="fontSize:20px" />{{ item.remark }}</el-option>
            </el-select>
          </el-form-item>
        </el-form>
          <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible=false">取消</el-button>
          <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin">确认</el-button>
        </div>
      </el-dialog>
      <!-- <div style="position:relative">
        <div class="tips">
          <span>Username : admin</span>
          <span>Password : any</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">Username : editor</span>
          <span>Password : any</span>
        </div>

        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
          Or connect with
        </el-button>
      </div> -->
    </el-form>

    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import SocialSign from './components/SocialSignin'
import { setRoles,login } from '@/api/user'
import { setUsername } from '@/utils/auth'
export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePassword = (rule, value, callback) => {
      if(value.length===0){
        callback(new Error('请填写密码'))
      }
      if (value.length < 6) {
        callback(new Error('密码至少六位'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible:false,
      rolerules: {
        roles: [{ required: true, message: '必填项', trigger: 'blur' }],
      },
      temp:{
        role_id:''
      },
      formData:[],
      loginForm: {
        username: 'dladmin',
        password: '12345678'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message:'请输入用户名' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    handleClose(){
      this.dialogFormVisible=false
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    chooseRoles(){
      if(this.loginForm.username!==''&&this.loginForm.password!==''){
      login({account:this.loginForm.username,password:this.loginForm.password}).then(res=>{
        if(res.success===1){
          this.dialogFormVisible=true
          this.formData=res.data
        }else{
          this.$message({
                message:res.message,
                type:'error'
              })
        }
      })
      }else{
        
        if(this.loginForm.username===''){
          this.$message({
                message:'请输入账号',
                type:'warning'
              })
        }
        else if(this.loginForm.password===''){
          this.$message({
                message:'请输入密码',
                type:'warning'
              })
        }
      }
        

      //  this.loading = true

          // this.$store.dispatch('user/login', this.loginForm)
          //   .then(() => {
          //     console.log('1')

          //     this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          //     this.loading = false
          //   })
          //   .catch(() => {
          //     this.loading = false
          //   })
    },
    handleLogin() {
      if(this.temp.role_id!==''){

      setRoles({role_id:this.temp.role_id}).then((res)=>{
            if(res.success===1){
               this.loading = true
               console.log('setRoles',res.data)
          setUsername(res.data)
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$message({
                message:'登录成功',
                type:'success'
              })
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
            }else{
              console.log(1111)
              this.$message({
                message:res.message,
                type:'error'
              })
            }
          })
      }else{
        this.$message({
          message:'请选择角色信息',
          type:'warning'
        })
      }
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-dialog__body {
    width: 80%;
    .el-form-item--medium {
      background-color: white;
      .el-input__inner {
        color: black;
      }
      .el-form-item__label {
        color: black;
        line-height: 50px;
        width:80px !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
