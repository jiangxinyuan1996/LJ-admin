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
            <el-menu-item index="1">分账方配置 </el-menu-item>
            <el-menu-item index="2"  >分账比例配置 </el-menu-item>
            <el-menu-item index="3" >角色配置</el-menu-item>
        </el-menu>
        <SubUser v-if="activeIndex2==='1'"></SubUser>
        <subRatio v-if="activeIndex2==='2'"></subRatio>
        <role v-if="activeIndex2==='3'"></role>
    </div>
</template>
<script>
import SubUser from './component/subUserSetting'
import subRatio from './component/subRatioSetting'
import role from './component/roleSetting'
  export default {
      components:{
          SubUser,
          subRatio,
          role
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
