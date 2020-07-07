<template>
  <div class="dashboard-editor-container">
    <panel-group :data="lineChartData" @handleSetLineChartData="handleSetLineChartData" />
    <!-- <el-button @click="refresh()">刷新</el-button> -->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart ref="chart" :chart-data="showData" />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import { getHomeList } from '@/api/tsyaccount'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      lineChartData: {
        newVisitis: {
          expectedData: [],
          date: []
        },
        messages: {
          expectedData: [],
          date: []
        },
        purchases: {
          expectedData: [],
          date: []
        }
      },
      showData: {},
      page: 'newVisitis'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getHomeList().then(res => {
        console.log('getHomeList res---:', res)
        this.lineChartData = {
          newVisitis: {
            expectedData: [],
            date: []
          },
          messages: {
            expectedData: [],
            date: []
          },
          purchases: {
            expectedData: [],
            date: []
          }
        }
        console.log('null this.lineChartData---:', this.lineChartData)
        const now = new Date()
        const day = now.getDate()
        const dateList = []
        const dataList = []
        for (let i = 1; i <= day; i++) {
          let date = ''
          if (now.getMonth() < 9) {
            date = now.getFullYear() + '-0' + (now.getMonth() + 1)
          } else {
            date = now.getFullYear() + '-' + (now.getMonth() + 1)
          }

          if (i < 10) {
            date += '-0' + i
          } else {
            date += '-' + i
          }
          dataList.push(0)
          dateList.push(date)
        }
        console.log('初始数据---', dataList)
        console.log('初始日期---', dateList)

        this.lineChartData = {
          newVisitis: {
            expectedData: [].concat(dataList),
            date: [].concat(dateList)
          },
          messages: {
            expectedData: [].concat(dataList),
            date: [].concat(dateList)
          },
          purchases: {
            expectedData: [].concat(dataList),
            date: [].concat(dateList)
          }
        }
        for (let i = 0; i < res.data.pay.length; i++) {
          for (let j = 0; j < dateList.length; j++) {
            if (dateList[j] == res.data.pay[i].date) {
              const numStr = res.data.pay[i].amount.replace(/,/g, '')
              console.log('numStr----:', numStr)
              this.lineChartData.newVisitis.expectedData[j] = Number(numStr)
              console.log('Number---:', Number(numStr))
              break
            }
          }
        }
        console.log('newVisitis----:', this.lineChartData.newVisitis)
        for (let i = 0; i < res.data.sub.length; i++) {
          for (let j = 0; j < dateList.length; j++) {
            if (dateList[j] == res.data.sub[i].date) {
              const numStr = res.data.sub[i].amount.replace(/,/g, '')
              this.lineChartData.messages.expectedData[j] = Number(numStr)
              break
            }
          }
        }
        console.log('messages-----:', this.lineChartData.messages)
        for (let i = 0; i < res.data.withdraw.length; i++) {
          for (let j = 0; j < dateList.length; j++) {
            if (dateList[j] == res.data.withdraw[i].date) {
              const numStr = res.data.withdraw[i].amount.replace(/,/g, '')
              this.lineChartData.purchases.expectedData[j] = Number(numStr)
              break
            }
          }
        }
        console.log('purchases-----:', this.lineChartData.purchases)
        this.showData = this.lineChartData[this.page]

        console.log('this.showData---:', this.showData)
      })
    },
    handleSetLineChartData(type) {
      this.page = type
      this.init()
      this.showData = this.lineChartData[type]
      console.log('this.showData---:', this.showData)
    },
    refresh() {
      this.$refs.chart.setOptions(this.showData)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
