<template>
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单号" v-model="filter.orderCode" clearable @keydown.enter.native="getFinanceReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="银行订单号" v-model="filter.pillBillNo" clearable @keydown.enter.native="getFinanceReport()"></el-input>
        </div>
        <div class="search-item">
          <el-date-picker
            class="date-picker-380"
            size="medium"
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="起始日期"
            end-placeholder="截止日期"
            align="right">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道" v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="支付方式" v-model="filter.payType">
            <el-option v-for="item in payPlatform" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="核对结果" v-model="filter.match">
            <el-option label="匹配" value="1"></el-option>
            <el-option label="不匹配" value="0"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getFinanceReport()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="financeReport.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column label="订单号" prop="ordercode" min-width="160"></el-table-column>
          <el-table-column label="渠道编号" min-width="120">
            <template slot-scope="scope">
              {{scope.row.channel | channelMap}}
            </template>
          </el-table-column>
          <el-table-column label="支付方式" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.paytype | payTypeMap }}</span>
            </template>
          </el-table-column>
          <el-table-column label="支付金额" prop="paymoney" min-width="100">
            <template slot-scope="scope">
              {{scope.row.paymoney | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="订单金额" prop="ordermoney" min-width="100">
            <template slot-scope="scope">
              {{scope.row.ordermoney | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="核对结果" prop="match" min-width="100"></el-table-column>
          <el-table-column label="支付日期" prop="paydate" min-width="160"></el-table-column>
          <el-table-column label="银行订单号" prop="paybillno" min-width="170"></el-table-column>
          <el-table-column label="有无退款" prop="ishasrefund" min-width="100"></el-table-column>
          <el-table-column label="退款金额" prop="refund_money" min-width="100">
            <template slot-scope="scope">
              {{scope.row.refund_money | formatPriceMap}}
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
        :total="financeReport.total">
       </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { computeTableHeight, getChannelList, getCurrentDate } from '../../../utils/index'
import { fetchList } from './api.js'

export default {
  name: 'FinanceReport',
  data () {
    return {
      loading: false,
      filter: {},
      dataViewHeight: null,
      date: [],
      financeReport: []
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      payPlatform: state => state.app.payPlatform
    })
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getFinanceReport(1, this.pagination.pageSize)
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    initDate () {
      this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
    },
    // 获取列表数据
    getFinanceReport (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      if (this.date.length) {
        this.filter.startDate = this.date[0]
        this.filter.endDate = this.date[1]
      } else {
        delete this.filter.startDate
        delete this.filter.endDate
      }
      fetchList(this.filter).then(res => {
        this.financeReport = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    resetFilter () {
      this.filter = {}
      this.getFinanceReport(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getFinanceReport(null, pages)
    },
    handleCurrentChange (page) {
      this.getFinanceReport(page, null)
    }
  }
}
</script>

<style scoped>

</style>
