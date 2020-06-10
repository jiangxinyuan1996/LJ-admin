<template>
  <div>
    <el-form :model="createForm" size="mini" label-width="100px">
      <el-form-item label="服务商比例" prop="fromratio" style="margin-top:0;display: inline-block;">
        <el-input-number v-model="fromratio" :precision="0" :step="1" :min="0" :max="10" />
      </el-form-item>
      <el-form-item label="合作伙伴比例" prop="toratio" style="margin-top:0;display: inline-block;">
        <el-input-number v-model="toratio" disabled :precision="0" :step="1" :min="0" :max="10" />
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCloseDialog()">取 消</el-button>
      <el-button type="primary" @click="handleCommitDialog">确 定</el-button>
    </span>
  </div>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
      createForm: {
        fromratio: 10,
        toratio: 0
      },
      fromratio: 5,
      toratio: 5
    }
  },
  watch: {
    fromratio: function(val, oldVal) {
      this.toratio = 10 - this.fromratio
    }
  },
  created() {
  },
  methods: {
    init() {
      this.fromratio = 5,
      this.toratio = 5
    },
    handleCommitDialog() {
      console.log('Commit')
      this.createForm = {
        fromratio: this.fromratio,
        toratio: this.toratio
      }
      this.init()
      this.$emit('Commit', this.createForm)
    },
    handleCloseDialog() {
      console.log('Close')
      this.init()
      this.$emit('Close')
    }
  }
}
</script>

<style>

</style>
