<template>
  <div id="sub-account">
    <div id="searchBox">
      <div id="buttonBox" style="margin:50px;">
        <span style="margin-right:10px">操作人 : </span>
        <el-select v-model="query.userid" size="mini" placeholder="请选择">
          <el-option
            v-for="item in nameoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span style="margin-right:10px;margin-left:10px;" class="demonstration">操作时间 : </span>
        <el-date-picker
          v-model="query.start_time"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          :clearable="alwaysFalse"
        />
        <span>至</span>
        <el-date-picker
          v-model="query.end_time"
          size="mini"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          :clearable="alwaysFalse"
        />
        <span style="margin-right:10px;margin-left:10px;">操作类型 : </span>
        <el-select v-model="query.type" size="mini" placeholder="请选择">
          <el-option
            v-for="item in statusoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" @click="init()">
          查询
        </el-button>
      </div>
    </div>

    <div id="dataForm">
      <el-table
        :data="tableData"
        size="mini"
        stripe
        border
        style="margin:20px;margin-left:50px;margin-right:50px;width:80vw"
      >
        <el-table-column
          prop="admin_name"
          align="center"
          width="120"
          label="操作人"
        />
        <el-table-column
          prop="time"
          align="center"
          width="170"
          label="操作时间"
        />
        <el-table-column
          prop="type"
          align="center"
          width="110"
          label="操作类型"
        />
        <el-table-column
          prop="content"
          align="center"
          width="400"
          show-overflow-tooltip
          label="操作内容"
        />
      </el-table>
      <el-pagination
        :page-size="query.limit"
        :current-page="currentPage"
        layout="prev, pager, next"
        :total="totalCount"
        @prev-click="currentPage-=1"
        @next-click="currentPage+=1"
        @current-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { getLog, getPeopleList } from '@/api/tsyLj.js'
export default {
  name: 'OperationLog',
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      nameoptions: [],
      statusoptions: [
        {
          label: '分账',
          value: '分账'
        }, {
          label: '分账复核',
          value: '分账复核'
        }, {
          label: '调账申请',
          value: '调账申请'
        }, {
          label: '提现申请',
          value: '提现申请'
        }, {
          label: '调账复核',
          value: '调账复核'
        }, {
          label: '提现复核',
          value: '提现复核'
        }, {
          label: '参数配置',
          value: '参数配置'
        }
      ],
      alwaysFalse: false,
      totalCount: 0,
      tableData: [],
      currentPage: 1,
      query: {
        start_time: '',
        end_time: '',
        userid: '',
        type: '',
        limit: 10,
        page: 1
      }
    }
  },
  created() {
    getPeopleList().then(res => {
      console.log('getPeopleList res----:', res)
      if (res.data) {
        for (let i = 0; i < res.data.length; i++) {
          const obj = {}
          obj.label = res.data[i].nickname
          obj.value = res.data[i].admin_id
          this.nameoptions.push(obj)
        }
      }
    })
    this.init()
  },
  methods: {
    init() {
      if (this.query.start_time) {
        this.query.start_time = this.query.start_time.valueOf()
      }
      if (this.query.end_time) {
        this.query.end_time = this.query.end_time.valueOf()
      }
      getLog(this.query).then(res => {
        console.log('getLog res---:', res)
        if (res.data) {
          this.tableData = res.data
        } else {
          this.tableData = []
        }
      })
    },
    changePage(e) {
      this.query.page = e
      this.init()
    }
  }
}
</script>
<style>
.el-divider--horizontal{
  margin: 5px 0;
}
</style>
