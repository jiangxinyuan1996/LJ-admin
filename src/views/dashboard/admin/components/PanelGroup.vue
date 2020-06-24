<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总进账
          </div>
          <count-to :start-val="0" :end-val="pay" :duration="2600" class="card-panel-num" :decimals="num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            已分账(本公司)
          </div>
          <count-to :start-val="0" :end-val="sub" :duration="3000" class="card-panel-num" :decimals="num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            已提现(本公司)
          </div>
          <count-to :start-val="0" :end-val="withdraw" :duration="3200" class="card-panel-num" :decimals="num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getHomeList } from '@/api/tsyaccount'
export default {
  components: {
    CountTo
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      pay: 0,
      sub: 0,
      withdraw: 0,
      num: 2
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.init()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    init() {
      this.pay = this.sub = this.withdraw = 0
      const payArr = this.data.newVisitis
      const subArr = this.data.messages
      const withdrawArr = this.data.purchases
      for (let i = 0; i < payArr.expectedData.length; i++) {
        this.pay += Number(payArr.expectedData[i])
        console.log('payArr.expectedData[i]---:', payArr.expectedData[i])
      }
      for (let i = 0; i < subArr.expectedData.length; i++) {
        this.sub += Number(subArr.expectedData[i])
        console.log('subArr.expectedData[i]---:', subArr.expectedData[i])
      }
      for (let i = 0; i < withdrawArr.expectedData.length; i++) {
        this.withdraw += Number(withdrawArr.expectedData[i])
        console.log('withdrawArr.expectedData[i]---:', withdrawArr.expectedData[i])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
