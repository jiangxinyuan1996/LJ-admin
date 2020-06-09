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
      <el-menu-item index="1">分账方配置 </el-menu-item>
      <el-menu-item index="2">分账比例配置 </el-menu-item>
      <el-menu-item index="3">角色配置</el-menu-item>
      <el-menu-item index="4">交易密码配置</el-menu-item>
    </el-menu>
    <SubUser v-if="activeIndex2==='1'" />
    <subRatio v-if="activeIndex2==='2'" />
    <role v-if="activeIndex2==='3'" />
    <transpwd v-if="activeIndex2==='4'" ></transpwd>
  </div>
</template>
<script>
import SubUser from './component/subUserSetting'
import subRatio from './component/subRatioSetting'
import role from './component/roleSetting'
import transpwd from './component/password'

export default {
  components: {
    SubUser,
    subRatio,
    role,
    transpwd
  },
  data() {
    return {
      activeIndex2: '1'
    }
  },
  created() {
    console.log(this.$route.params.page)
    if (this.$route.params.page && this.$route.params.page !== ':page') {
      this.activeIndex2 = this.$route.params.page
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex2 = key
    }
  }
}
</script>
