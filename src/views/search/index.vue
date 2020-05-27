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
        </el-menu>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);

      }
    }
  }
</script>