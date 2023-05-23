<template>
  <div class="container"></div>
</template>

<script>
import { queryUpgradOrderInfo, queryOrderInfoByOrderId } from './api'
export default {
  name: 'orderInfo',
  data () {
    return {
      orderId: '2c00fb0f-9933-458d-8d67-323146367f3b',
      orderDate: '20190325',
      upgradOrderInfo: {},
      orderInfo: {}
    }
  },
  created () {
    this.getUpgradOrderinfo()
    this.getOrderInfoByOrderId()
  },
  methods: {
    // 获取升舱数据
    getUpgradOrderinfo () {
      queryUpgradOrderInfo({ orderId: this.orderId }).then(res => {
        this.upgradOrderInfo = res
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取订单详情
    getOrderInfoByOrderId () {
      queryOrderInfoByOrderId({ orderId: this.orderId, orderDate: this.orderDate }).then(res => {
        this.orderInfo = res
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
