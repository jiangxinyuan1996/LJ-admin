<template>
  <div id="sub-account">
    <div id="searchBox">
      <div v-show="showQuery">
        <span style="margin-right:15px;margin-left:30px;">所属银行:</span>
        <el-select v-model="query.bank_code" size="mini" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in bankCodeOptions"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
        <span style="margin-right:15px;margin-left:30px;">银行卡号:</span><el-input v-model="query.account_no" size="mini" placeholder="银行卡号" style="width: 11vw;margin-right:15px" class="filter-item" />
        <span style="margin-right:15px">持卡人姓名:</span><el-input v-model="query.account_name" size="mini" placeholder="持卡人姓名" style="width: 6vw;margin-right:15px;" class="filter-item" />
        <span style="margin-right:15px">持卡人电话:</span><el-input v-model="query.tel" size="mini" placeholder="持卡人电话" style="width: 8vw;" class="filter-item" />
        </p>
        <span style="margin-left:30px;margin-right:15px; ">创建日期:</span>
        <el-date-picker
          v-model="query.startTime"
          size="mini"
          style="width:9vw"
          type="date"
          placeholder="选择日期"
        />
        <span style="margin-right:15px;margin-left:15px;">至</span>
        <el-date-picker
          v-model="query.endTime"
          size="mini"
          style="width:9vw"
          type="date"
          placeholder="选择日期"
        />
        <!-- <el-tooltip class="item" effect="dark" content="查询当天数据请多选一天!" placement="right">
          <i class="el-icon-warning-outline"></i>
        </el-tooltip> -->
        <span style="margin-right:15px;margin-left:30px;">是否验证成功:</span>
        <el-select v-model="query.state" size="mini"style="width:6vw" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in isSuccess"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
        <el-tooltip style="margin-left:30px;" class="item" effect="dark" content="收起" placement="right">
          <i class="el-icon-arrow-up" @click="showQuery=false" />
        </el-tooltip>
      </div>
      <div id="buttonBox" style="margin-left:30px;">
        <el-dropdown size="mini" split-button type="success" style="float:right;margin-right:15vw" @click="showCreateDialog()" @command="handleCommand">
          新建
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{ cmd:'upload' }">
              导入
            </el-dropdown-item>
            <el-dropdown-item :command="{ cmd:'downLoad' }">下载模板</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown split-button type="primary" size="mini" style="" @click="clickSearch()" @command="handleCommand">
          查询
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{ cmd:'checkSuccess' }">高级查询</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-button v-if="showDelete" size="mini" class="filter-item" style="margin-left: 10px;" type="danger" @click="removeVerifyList()">
          删除
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
