<template>
  <div style="margin:50px 0 0 50px">
    <el-dialog
      :close-on-click-modal="alwaysFalse"
      :title="rolestatus==='create'?'业务人员创建':'业务角色修改'"
      :visible.sync="createWorkerDialogVisible"
      :before-close="handleClose"
      width="32%"
    >
      <el-form ref="createRoles" :model="createRoles" label-width="100px" class="demo-ruleForm" :rules="formRules">
        <el-form-item
          v-if="rolestatus==='create'"
          label="用户名称"
          prop="nickname"
        >
          <el-input v-model="createRoles.nickname" type="name" style="width:40%" />
        </el-form-item>
        <el-form-item
          v-if="rolestatus==='create'"
          label="登录账号"
          prop="account"
        >
          <el-input v-model="createRoles.account" type="account" style="width:40%" />
        </el-form-item>
        <el-form-item
          v-if="rolestatus==='create'"
          label="登录密码"
          prop="password"
        >
          <el-input v-model="createRoles.password" type="password" style="width:40%" />
        </el-form-item>
        <el-form-item
          v-if="rolestatus==='create'"
          label="确认密码"
          prop="confirmPassword"
        >
          <el-input v-model="createRoles.confirmPassword" type="password" style="width:40%" />
        </el-form-item>
        <el-form-item
          label="岗位名称"
          prop="post_name"
        >
          <el-input v-model="createRoles.post_name" type="text" style="width:40%" />
        </el-form-item>
        <el-form-item label="选择角色" prop="roles" >
          <!-- <el-checkbox-group v-model="createRoles.roles"> -->
            <el-checkbox  v-for="item in rolelist" v-model="createRoles.role_arr"  :key="item.role_id" :label="item.role_id" name="type" @change="changeClear">{{ item.remark }}</el-checkbox>
          <!-- </el-checkbox-group> -->
        </el-form-item>
        <!-- <el-form-item label="选择角色" prop="roles">
          <el-select v-model="createRoles.roles" placeholder="请选择角色">
            <el-option
              v-for="item in rolelist"
              :key="item.role_id"
              :label="item.remark"
              :value="item.role_id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item  label="选择所属机构" v-if="createRoles.role_arr.join('').includes('RI1005')">
          <el-radio-group  v-model="radio"  @change="changeClear1">
            <el-radio :label="1">服务商</el-radio>
            <el-radio :label="0">合作伙伴</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  label="选择服务商" v-if="createRoles.role_arr.join('').includes('RI1005')">
          <el-select v-if="radio===1" v-model="createRoles.userid"  placeholder="请选择服务商">
            <el-option
              v-for="item in fromList"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
          <el-select v-else v-model="createRoles.userid"  placeholder="请选择合作伙伴">
            <el-option
              v-for="item in toList"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('createRoles')">{{ rolestatus==='create'?'提交':'修改' }}</el-button>
          <el-button @click="resetForm('createRoles')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <span style="margin-right:15px">姓名:</span><el-input size="mini" v-model="query.nickname" placeholder="姓名" style="width: 200px;margin-right:15px" class="filter-item" />
            <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-search" @click="getUser">
              查询
            </el-button>
            <el-button type="success" size="mini" style="margin:10px;" @click="showCreateWorkerDialog()">新建</el-button>
            <el-table
              v-loading="loading"
              :data="workerData"
              stripe
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
              <el-table-column
                prop="idList"
                label="角色"
                width="300"
                v-if="false"
              />
              <el-table-column
                prop="post_name"
                label="岗位"
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
             <!-- 分页 -->
            <el-pagination
              style="margin-top:20px;"
              :small="true"
              :current-page="query.page"
              :page-sizes="[5,10]"
              :page-size="10"
              layout="total, sizes, prev, pager, next"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
</template>
<script>
import { addPeople, getPeopleList, getRoleList, updatePeople, delPeople } from '@/api/tsyaccount'
import { getUserList } from '@/api/tsyLj'

export default {
  data() {
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
      alwaysFalse: false,
      isShow:false,
      admin_id: '',
      str:'',
      loading: false,
      rolestatus: '',
      radio: 0,
      total:0,
      fromList: [],
      toList: [],
      createRoles: {
        nickname: '',
        account: '',
        password: '',
        confirmPassword: '',
        post_name:'',
        roles: '',
        role_arr: [],
        userid: ''
      },
      query: {
        nickname: '',
        page:1,
        limit:10
      },
      workerData: [],
      rolelist: [],
      formRules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        confirmPassword: [
          { validator: validatePass2, trigger: 'blur', required: true }
        ],
        role_arr: [{ type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getUser()
    getRoleList().then(res => {
      console.log(res)
      this.rolelist = res.data
    })
    getUserList().then(res => {
      this.fromList = res.data.fromList
      this.toList = res.data.toList
      console.log(this.fromList)
    })
  },
  methods: {
    handleClose(){
      this.createWorkerDialogVisible=false
      this.createRoles={
        nickname: '',
        account: '',
        password: '',
        confirmPassword: '',
        post_name:'',
        roles: '',
        role_arr: [],
        userid: ''
      }
    },
    changeClear() {
      if(!this.createRoles.role_arr.join('').includes('RI1005')){
        this.createRoles.userid = ''
      }
    },
    changeClear1() {
        this.createRoles.userid = ''
    },
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
        this.admin_id = e.group.admin_id
        this.createRoles.post_name=e.group.post_name        
        this.createRoles.role_arr=e.group.idList.split(',')
        this.createRoles.userid=e.group.userInfo.userid
        this.radio=parseInt(e.group.userInfo.default_status)
        console.log(this.radio)
        console.log(e.group)
      } else if (e.cmd === 'remove') {
        this.$confirm('此操作将删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const delRole = { admin_id: e.group.row.admin_id }
          delPeople(delRole).then(res => {
            if (res.success === 1) {
              this.getUser()
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.workerData.splice(e.group.$index, 1)
            } else {
              this.$message({
                message: res.message,
                type: 'error'
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
      console.log(this.createRoles)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // if (this.rolestatus === 'create') {
          //   this.createRoles.role_arr.push(this.createRoles.roles)
            // if (this.createRoles.roles !== 'RI1005') {
            //   this.createRoles.userid = ''
            // }
            if(this.rolestatus==='create'){
            addPeople(this.createRoles).then(res => {
              if (res.success === 1) {
                this.getUser()
                this.createWorkerDialogVisible = false
                this.createRoles = {
                  nickname: '',
                  account: '',
                  password: '',
                  confirmPassword: '',
                  role_arr: [],
                  roles: '',
                  userid: ''
                }
                this.$message({
                  message: res.message,
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
              }
            })
            }else{
              // this.createRoles.role_arr.push(this.createRoles.roles)
              // if (this.createRoles.roles !== 'RI1005') {
              //   this.createRoles.userid = ''
              // }
              updatePeople({ admin_id: this.admin_id, role_arr: this.createRoles.role_arr, userid: this.createRoles.userid,post_name:this.createRoles.post_name}).then(res => {
                console.log(res)
                if (res.success === 1) {
                  this.$message({
                    message: res.message,
                    type: 'success'
                  })
                  this.createRoles={
                    nickname: '',
                    account: '',
                    password: '',
                    confirmPassword: '',
                    role_arr: [],
                    roles: '',
                    userid: ''
                  }
                  this.createWorkerDialogVisible = false
                  this.getUser()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'error'
                  })
                }
              })
            }
          } else {
          // }
        }
      })
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.query.page = val
      this.getUser()
      this.query.page=1
      // 页码切换分页调用请求传值
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.query.limit = val
      // console.log(this.listQuery.limit)
      this.getUser()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getUser() {
      console.log('获取角色列表')
      this.loading = true
      getPeopleList(this.query).then(res => {
        if(res.success===1){
        this.loading = false
        this.workerData = JSON.parse(JSON.stringify(res.data))
        this.total=Number(res.count)
        for (let i = 0; i < res.data.length; i++) {
          this.workerData[i].roleList = res.data[i].roleList.map(item => {
            return item.remark
          }).join(',')
          this.workerData[i].idList = res.data[i].roleList.map(item => {
            return item.role_id
          }).join(',')
        }
        }else{
          this.loading=false
          this.$message({
            message:res.message,
            type:'error'
          })
        }
      })
    }
  }
}
</script>
