<template>
    <div>
        <el-tree
            :data="resultData"
            :props="props"
            show-checkbox
            @check-change="handleCheckChange">
        </el-tree>
    </div>
</template>
<script>
import { asyncRoutes, constantRoutes } from '@/router'

export default {
   data() {
      return {
        resultData:[],
        routes:[],
        props: {
          children: 'children',
          label: 'name'
        },
        count: 1
      };
    },
    methods: {
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
        this.routes.push(data)
        console.log(this.routes)
      }
    },
    mounted(){
        // console.log(asyncRoutes)

        this.resultData=asyncRoutes.slice(0,asyncRoutes.length-1)
    }
}
</script>
<style lang="scss" scoped>

</style>