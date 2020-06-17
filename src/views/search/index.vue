<template>
  <div class="search">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <el-menu-item index="1">
        明细查询 </el-menu-item>
      <!-- <el-menu-item index="2">分账查询 </el-menu-item> -->
      <el-menu-item index="3" v-permission="['机构管理员','操作员','分账复核员','提现复核员','总查看员']">调账查询 </el-menu-item>
      <el-menu-item index="4" v-permission="['机构管理员','操作员','分账复核员','提现复核员','总查看员']">提现查询 </el-menu-item>
      <el-menu-item index="5" v-permission="['机构管理员','操作员','分账复核员','提现复核员','总查看员']">操作日志 </el-menu-item>
      <el-menu-item index="6">对账查询 </el-menu-item>
    </el-menu>
    <account v-if="activeIndex2==='1'" />
    <!-- <verify v-if="activeIndex2==='2'" /> -->
    <transfer v-if="activeIndex2==='3'" />
    <withdrawal v-if="activeIndex2==='4'" />
    <operationLog v-if="activeIndex2==='5'" />
    <check v-if="activeIndex2==='6'" />
  </div>
</template>
<script>
import account from './component/sub-account'
// import verify from './component/sub-verify'
import operationLog from './component/operationLog'
import withdrawal from './component/withdrawal'
import transfer from './component/transfer'
import check from './component/check'
import permission from '@/directive/permission/index.js' // 权限判断指令
export default {
  directives: { permission },
  components: {
    withdrawal,
    transfer,
    account,
    // verify,
    operationLog,
    check
  },
  data() {
    return {
      activeIndex2: '1'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex2 = key
    }
  }
}
</script>
