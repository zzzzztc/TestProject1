<template>
  <!--产品销售报表-->
  <div id="ProductSaleReport">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="产品名称"
            v-model="filter.productName"
            clearable
            @keydown.enter.native="getProductList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="产品编号"
            v-model="filter.productCode"
            clearable
            @keydown.enter.native="getProductList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="出发三字码"
            v-model="filter.afrom"
            clearable
            @keydown.enter.native="getProductList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="到达三字码"
            v-model="filter.ato"
            clearable
            @keydown.enter.native="getProductList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="航班号"
            v-model="filter.flightNo"
            clearable
            @keydown.enter.native="getProductList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="订单详情状态" v-model="filter.detailStatus">
            <el-option value="0" label="初始"></el-option>
            <el-option value="1" label="未支付"></el-option>
            <el-option value="2" label="已支付"></el-option>
            <el-option value="4" label="已取消"></el-option>
            <el-option value="5" label="已退货"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="机票号"
            v-model="filter.ticketNo"
            clearable
            @keydown.enter.native="getProductList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="产品订单号"
            v-model="filter.proOrdercode"
            clearable
            @keydown.enter.native="getProductList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="关联订单号"
            v-model="filter.ordercode"
            clearable
            @keydown.enter.native="getProductList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="批量退款批次号"
            v-model="filter.refundBatchNo"
            clearable
            @keydown.enter.native="getProductList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            style="width: 180px"
            v-model="filter.flightDate"
            value-format="yyyy-MM-dd"
            size="medium"
            type="date"
            placeholder="航班日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            style="width: 180px"
            v-model="filter.orderTimeStart"
            value-format="yyyy-MM-dd"
            size="medium"
            type="date"
            placeholder="销售开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            style="width: 180px"
            v-model="filter.orderTimeEnd"
            value-format="yyyy-MM-dd"
            size="medium"
            type="date"
            placeholder="销售截止日期">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getProductList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="list.total === 0" @click="exportProductList">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="list.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
            <el-table-column min-width="160" label="订单号" prop="proOrdercode"></el-table-column>
            <el-table-column min-width="160" label="关联订单号" prop="ordercode"></el-table-column>
            <el-table-column min-width="120" label="产品名称" prop="productName"></el-table-column>
            <el-table-column min-width="80" label="产品编号" prop="productCode"></el-table-column>
            <el-table-column min-width="80" label="数量" prop="saleNum"></el-table-column>
            <el-table-column min-width="80" label="单价" prop="salePrice"></el-table-column>
            <el-table-column min-width="80" label="总价" prop="paymoney"></el-table-column>
            <el-table-column min-width="100" label="出发三字码" prop="afrom"></el-table-column>
            <el-table-column min-width="100" label="到达三字码" prop="ato"></el-table-column>
            <el-table-column min-width="90" label="航班号" prop="flightNo"></el-table-column>
            <el-table-column min-width="140" label="机票号" prop="ticketNo"></el-table-column>
            <el-table-column min-width="120" label="航班日期">
              <template slot-scope="scope">
                <div>{{ scope.row.flightDate | dateFormater }}</div>
              </template>
            </el-table-column>
            <el-table-column min-width="160" label="销售日期" prop="orderTime"></el-table-column>
            <el-table-column min-width="120" label="订单详情状态">
              <template slot-scope="scope">
                <div>{{ scope.row.detailStatus | syncProductStatusMap }}</div>
              </template>
            </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filter.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchList } from './api'
import { computWidth } from '../../../mixins/computWidt'
import { excelList, getRouteName } from '../../../utils'

export default {
  name: 'ProductSaleReport',
  data () {
    return {
      filter: {},
      loading: false,
      list: {},
      dataViewHeight: null,
      dataArr: []
    }
  },
  mixins: [ computWidth ],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  created () {
    this.getProductList(1, this.pagination.pageSize)
  },
  methods: {
    // 重置查询条件
    resetFilter () {
      this.filter = {}
      this.getProductList(1, this.pagination.pageSize)
    },
    // 查询
    getProductList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter)
        .then(res => {
          this.list = res
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 分页
    handleSizeChange (pages) {
      this.getProductList(null, pages)
    },
    handleCurrentChange (page) {
      this.getProductList(page, null)
    },
    // 导出
    exportProductList () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = 'order/exportProductOrderDetail'
      let name = getRouteName('/productSaleReport')
      let type = 'xls'
      data.start = 1
      data.end = this.list.total
      delete data.page
      delete data.rows
      let obj = {
        data,
        url,
        name,
        type
      }
      excelList(obj, this)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
