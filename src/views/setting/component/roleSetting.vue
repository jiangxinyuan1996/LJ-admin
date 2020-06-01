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
          prop="name"
        >
          <el-input v-model="createRoles.name" type="name" style="width:60%" />
        </el-form-item>
        <el-form-item
          v-if="rolestatus==='create'"
          label="登录名称"
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
        <el-form-item label="选择角色" prop="roles">
            <el-checkbox v-for="item in rolelist" v-model="createRoles.roles" :key="item.key" :label="item.key" name="type">{{ item.value }}</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('createRoles')">{{ rolestatus==='create'?'提交':'修改' }}</el-button>
          <el-button @click="resetForm('createRoles')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <span style="margin-right:15px">姓名:</span><el-input size="mini" v-model="query.user_name" placeholder="姓名" style="width: 200px;margin-right:15px" class="filter-item" />
            <span style="margin-right:15px">角色:</span>
            <!-- <el-input size="mini" v-model="query.roles" placeholder="角色" style="width: 200px;margin-right:15px" class="filter-item" /> -->
            <el-select size="mini" v-model="query.roles" placeholder="角色" class="filter-item" style="width:200px;margin-right:15px">
            <el-option v-for="item in rolelist" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
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
                prop="user_name"
                label="姓名"
                width="300"
              />
              <el-table-column
                prop="roles"
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

      loading:false,
      rolestatus:'',
       createRoles: {
        name: '',
        account: '',
        password: '',
        confirmPassword: '',
        roles: []
      },
      query: {
        user_name: '',
        roles:[]
      },
      workerData: [{
        user_name:'张三',
        roles:'客服'
      },
      {
        user_name:'李四',
        roles:'客服'
      }
      ],
      rolelist: [
        // {
        //   key: 1,
        //   value: '机构管理员'
        // },
        {
          key: 2,
          value: '操作员'
        },
        {
          key: 3,
          value: '复核人员'
        },
        {
          key: 4,
          value: '浏览人员'
        }
      ],
       formRules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        roles: [{ type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }]
      },
    }
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
        const { user_id, roles } = e.group
        this.user_id = user_id

      } else if (e.cmd === 'remove') {
        this.$confirm('此操作将删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(e.group)
          const delRole = { user_id: e.group.row.user_id }  
              this.workerData.splice(e.group.$index, 1)
          
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
        if (valid) {
          console.log('表单提交')
        }
      })
      },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getUser(){
      console.log('获取角色列表')
    }
  }
}
</script>

