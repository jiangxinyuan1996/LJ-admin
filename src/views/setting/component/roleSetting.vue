<template>
  <div style="margin:50px 0 0 50px">
     <el-dialog
    :close-on-click-modal="alwaysFalse"
      :title="rolestatus==='create'?'业务人员创建':'业务角色修改'"
      :visible.sync="createWorkerDialogVisible"
      width="28%"
    >
      <el-form ref="createRoles" :model="createRoles" label-width="100px" class="demo-ruleForm" :rules="formRules">
        <el-form-item
          v-if="rolestatus==='create'"
          label="用户名称"
          prop="nickname"
        >
          <el-input v-model="createRoles.nickname" type="name" style="width:60%" />
        </el-form-item>
        <el-form-item
          v-if="rolestatus==='create'"
          label="登录账号"
          prop="account"
        >
          <el-input v-model="createRoles.account" type="account" style="width:60%" />
        </el-form-item>
        <el-form-item
          v-if="rolestatus==='create'"
          label="登录密码"
          prop="password"
        >
          <el-input v-model="createRoles.password" type="password" style="width:60%" />
        </el-form-item>
        <el-form-item
          v-if="rolestatus==='create'"
          label="确认密码"
          prop="confirmPassword"
        >
          <el-input v-model="createRoles.confirmPassword" type="password" style="width:60%" />
        </el-form-item>
        <el-form-item
          v-if="rolestatus==='create'"
          label="岗位名称"
          prop="duty"
        >
          <el-input v-model="createRoles.duty" type="text" style="width:60%" />
        </el-form-item>
        <!-- <el-form-item label="选择角色" prop="role_arr">
            <el-checkbox v-for="item in rolelist" v-model="createRoles.role_arr" :key="item.role_id" :label="item.role_id" name="type">{{ item.remark }}</el-checkbox>
        </el-form-item> -->
        <el-form-item label="选择角色" prop="roles">
        <el-select v-model="createRoles.roles" placeholder="请选择角色">
          <el-option
            v-for="item in rolelist"
            :key="item.role_id"
            :label="item.remark"
            :value="item.role_id">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('createRoles')">{{ rolestatus==='create'?'提交':'修改' }}</el-button>
          <el-button @click="resetForm('createRoles')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <span style="margin-right:15px">姓名:</span><el-input size="mini" v-model="query.nickname" placeholder="姓名" style="width: 200px;margin-right:15px" class="filter-item" />
            <!-- <span style="margin-right:15px">角色:</span> -->
            <!-- <el-input size="mini" v-model="query.roles" placeholder="角色" style="width: 200px;margin-right:15px" class="filter-item" /> -->
            <!-- <el-select size="mini" v-model="query.roles" placeholder="角色" class="filter-item" style="width:200px;margin-right:15px">
            <el-option v-for="item in rolelist" :key="item.role_id" :label="item.remark" :value="item.role_id" />
            </el-select> -->
            <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-search" @click="getUser">
              查询
            </el-button>
            <el-button type="success" size="mini" style="margin:10px;" @click="showCreateWorkerDialog()">新建</el-button>
            <el-table
              v-loading="loading"
              :data="workerData"
              stripe
              height="500"
              style="width:100%"
            >
              <el-table-column
                prop="nickname"
                label="姓名"
                width="300"
              />
              <el-table-column
                prop="roleList"
                label="角色"
                width="300"
              />
              <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                  <el-dropdown @command="handleEdit">
                    <span class="el-dropdown-link">
                      操作<i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="{ cmd:'edit', group: scope.row }">编辑</el-dropdown-item>
                      <el-dropdown-item :command="{ cmd:'remove', group: scope }" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>
</template>
<script>
import { addPeople,getPeopleList,getRoleList,updatePeople,delPeople} from '@/api/tsyaccount'
export default {
  data(){
     var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.createRoles.confirmPassword !== '') {
          this.$refs.createRoles.validateField('confirmPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.createRoles.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      createWorkerDialogVisible: false,
      alwaysFalse:false,
      admin_id:'',
      loading:false,
      rolestatus:'',
       createRoles: {
        nickname: '',
        account: '',
        password: '',
        confirmPassword: '',
        roles:'',
        role_arr: []
      },
      query: {
        nickname: '',
      },
      workerData: [],
      rolelist: [],
       formRules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [
          { validator: validatePass, trigger: 'blur' ,required: true,}
        ],
        confirmPassword: [
          { validator: validatePass2, trigger: 'blur' ,required: true,}
        ],
        role_arr: [{ type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }]
      }
    }
  },
  mounted(){
    this.getUser()
    getRoleList().then(res=>{
      console.log(res)
      this.rolelist=res.data
    })
  },
  methods:{
    showCreateWorkerDialog() {
      this.rolestatus = 'create'
      this.createWorkerDialogVisible = true
    },
    handleEdit(e) {
      if (e.cmd === 'downLoad') {
        this.downLoadVerifyModule()
      } else if (e.cmd === 'edit') {
        this.createWorkerDialogVisible = true
        this.rolestatus = 'update'
        const { admin_id, roles } = e.group
        this.admin_id=admin_id
        
      } else if (e.cmd === 'remove') {
        this.$confirm('此操作将删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(e.group)
          const delRole = { admin_id: e.group.row.admin_id }  
          delPeople(delRole).then(res=>{
            if(res.success===1){
              this.$message({
                message:res.message,
                type:'success'
              })
              this.workerData.splice(e.group.$index, 1)
            }else{
              this.$message({
                message:res.message,
                type:'error'
              })
            }
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    downLoadVerifyModule() {
      console.log('downLoadVerifyModule')
      window.location.href = '/mould/需求接口列表-0410.xlsx'
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(valid)
        if (valid) {
          if(this.rolestatus==='create'){
            this.createRoles.role_arr.push(this.createRoles.roles)
        console.log('表单提交',this.createRoles.role_arr)
          addPeople(this.createRoles).then(res=>{
            console.log('新增管理人员',res)
            if(res.success===1){
              this.getUser()
              this.createWorkerDialogVisible=false
              this.createRoles={
                nickname: '',
                account: '',
                password: '',
                confirmPassword: '',
                role_arr: []
              }
              this.$message({
                message:res.message,
                type:'success'
              })
            }else{
              this.$message({
                message:res.message,
                type:'error'
              })
            }
          })
        }else{
          this.createRoles.role_arr.push(this.createRoles.roles)
          updatePeople({admin_id:this.admin_id,role_arr:this.createRoles.role_arr}).then(res=>{
          console.log(res)
          if(res.success===1){
            this.$message({
              message:res.message,
              type:'success'
            })
            this.createRoles.role_arr=[]
            this.createWorkerDialogVisible=false
            this.getUser()
          }else{
            this.$message({
              message:res.message,
              type:'error'
            })
          }
        })

        }
        }
      })
      },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getUser(){
      console.log('获取角色列表')
      this.loading=true
      getPeopleList(this.query).then(res=>{
        console.log(res)
        this.loading=false
        this.workerData=res.data
        for(let i=0;i<this.workerData.length;i++){
          this.workerData[i].roleList=this.workerData[i].roleList.map(item=>{
            return item.remark
          }).join(',')
        }
      })
    }
  }
}
</script>

