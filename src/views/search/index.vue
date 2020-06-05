<template>
    <div class="search">
        <el-menu
            :default-active="activeIndex2"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="1">
             明细查询 </el-menu-item>
            <el-menu-item index="2" >分账查询 </el-menu-item>
            <el-menu-item index="3"  >转账查询 </el-menu-item>
            <el-menu-item index="4" >提现查询 </el-menu-item>
            <el-menu-item index="5" >操作日志 </el-menu-item>
            <el-menu-item index="6" >对账查询 </el-menu-item>
        </el-menu>
        <account v-if="activeIndex2==='1'"></account>
        <verify v-if="activeIndex2==='2'"></verify>
        <transfer v-if="activeIndex2==='3'"></transfer>
        <withdrawal v-if="activeIndex2==='4'"></withdrawal>
        <operationLog v-if="activeIndex2==='5'"></operationLog>
        <check v-if="activeIndex2==='6'"></check>
    </div>
</template>
<script>
import account from './component/sub-account'
import verify from './component/sub-verify'
import operationLog from './component/operationLog'
import withdrawal from './component/withdrawal'
import transfer from './component/transfer'
import check from './component/check'
  export default {
      components:{
          withdrawal,
          transfer,
          account,
          verify,
          operationLog,
          check
      },
    data() {
      return {
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        this.activeIndex2=key
      }
    }
  }
</script>
