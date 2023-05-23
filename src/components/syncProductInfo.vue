<template>
  <div v-loading="loading">
    <el-table
      :data="list.rows"
      :border="tableAttributes.border"
      :cell-style= "tableAttributes.cellStyle"
      :stripe="tableAttributes.stripe">
      <el-table-column label="商品名称" prop="productName" min-width="80"></el-table-column>
      <el-table-column label="数量" prop="saleNum" min-width="60"></el-table-column>
      <el-table-column label="单价" prop="salePrice" min-width="60"></el-table-column>
      <el-table-column label="支付金额" prop="paymoney" min-width="80"></el-table-column>
      <el-table-column label="领取人" prop="receiveName" min-width="80"></el-table-column>
      <el-table-column label="领取人电话" prop="receiveMobile" min-width="120"></el-table-column>
      <el-table-column label="领取人座位号" prop="receiveSeatno" min-width="120"></el-table-column>
      <el-table-column label="机票号" min-width="140" prop="ticketNo"></el-table-column>
      <el-table-column label="订单状态" min-width="80">
        <template slot-scope="scope">
          <div>{{ scope.row.detailStatus | syncProductStatusMap }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryProductOrderDetailList, queryProductOrderByOrderid } from '../api/index'
import { mapState } from 'vuex'
export default {
  name: 'SyncProductInfo',
  props: {
    ticketId: {
      type: String,
      default: null
    },
    orderId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      list: {},
      loading: false
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes
    })
  },
  created () {
    if (this.ticketId) {
      this.queryProductInfoByTicketId()
    } else {
      this.queryProductInfoByOrderId()
    }
  },
  methods: {
    // 获取附加商品数据根据ticketId
    queryProductInfoByTicketId () {
      this.loading = true
      queryProductOrderDetailList({ ticketid: this.ticketId, page: 1, rows: 500 })
        .then(res => {
          this.list = res
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          this.$message({
            type: 'error',
            message: err.message
          })
        })
    },
    // 获取附加商品数据根据orderId
    queryProductInfoByOrderId () {
	    // console.log('调取了接口')
      this.loading = true
      queryProductOrderByOrderid({ orderid: this.orderId, page: 1, rows: 500 })
        .then(res => {
	        // console.log('orderid',this.orderId)
          let arr = []
          res.rows.forEach(item => {
            item.productOrderDetailBeanList.forEach(val => {
              arr.push(val)
            })
          })
          // console.log(arr)
          this.list = {
            rows: arr
          }
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          this.$message({
            type: 'error',
            message: err.message
          })
        })
    }
  }
}
</script>

<style scoped>

</style>
