<template>
  <div id="PayReport" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单号" v-model="filter.orderCode" clearable @keydown.enter.native="getPayReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="PNR" v-model="filter.pnr" clearable @keydown.enter.native="getPayReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="银行订单号" v-model="filter.payBillNo" clearable @keydown.enter.native="getPayReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="支付方式" v-model="filter.payType">
            <el-option v-for="item in payPlatform" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="起始时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.endDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="截止时间">
          </el-date-picker>
        </div>
<!--        <div class="search-item">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="date"-->
<!--            type="daterange"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            range-separator="至"-->
<!--            start-placeholder="起始日期"-->
<!--            end-placeholder="截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道名称" clearable v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单类型" v-model="filter.isintegral">
            <el-option v-for="item in orderType" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getPayReport()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="!payReport.total" @click="exportExcel">导出</el-button>
      </div>
      <div class="search-container clearfix flex">
        <div class="check-ipt">
          <el-checkbox @change="checkHanler" v-model="checkedAll" :indeterminate="isIndeterminate">全选</el-checkbox>
        </div>
        <div>
          <div class="check-item check-ipt" v-for="item in checkList" :key="item.key">
            <el-checkbox-group v-model="checked" @change="handleCheck">
              <el-checkbox  :label="item.key" :key="item.key" @change="handleoneCheck(item.key)">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="payReport.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
            <el-table-column v-if="tableList.ordercode" label="订单号" prop="ordercode" min-width="180"></el-table-column>
            <el-table-column v-if="tableList.pnr" label="PNR" prop="pnr" min-width="100"></el-table-column>
            <el-table-column v-if="tableList.channel" label="渠道编号" min-width="120">
              <template slot-scope="scope">
                {{scope.row.channel | channelMap}}
              </template>
            </el-table-column>
            <el-table-column v-if="tableList.paytype" label="支付方式" min-width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.paytype | payTypeMap }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="tableList.order_status" label="订单状态">
              <template slot-scope="scope">
                {{scope.row.order_status | orderStatusMap}}
              </template>
            </el-table-column>
            <el-table-column v-if="tableList.paymoney" label="支付金额" prop="paymoney">
              <template slot-scope="scope">
                {{scope.row.paymoney | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column v-if="tableList.paydate" label="支付创建的日期" prop="paydate" min-width="160"></el-table-column>
            <el-table-column v-if="tableList.paytime" label="支付返回的日期" prop="paytime" min-width="160"></el-table-column>
            <el-table-column v-if="tableList.paybillno" label="银行订单号" prop="paybillno" min-width="180"></el-table-column>
            <el-table-column v-if="tableList.bank" label="支付银行" prop="bank" min-width="120"></el-table-column>
            <el-table-column v-if="tableList.integral_value" label="支付积分值" prop="integral_value" min-width="100"></el-table-column>
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
        :total="payReport.total">
       </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelList, getCurrentDate, excelList, getRouteName } from '../../../utils/index'
import { fetchList } from './api.js'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'PayReport',
  data () {
    return {
      componentName: 'payReport',
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        ordercode: false,
        pnr: true,
        channel: true,
        paytype: true,
        order_status: true,
        paymoney: true,
        paydate: false,
        paytime: false,
        paybillno: true,
        bank: false,
        integral_value: false
      },
      loading: false,
      filter: {
        startDate: '',
        endDate: ''
      },
      date: [],
      dataViewHeight: null,
      payReport: {}
    }
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getPayReport(1, this.pagination.pageSize)
    // this.locCheck()
  },
  mixins: [checkAttrs, computWidth],
  filters: {
    orderStatusMap (type) {
      let statusName = ''
      switch (type) {
        case '1':
          statusName = '未支付'
          break
        case '2':
          statusName = '已出票'
          break
        case '3':
          statusName = '未取票'
          break
        case '4':
          statusName = '已取消'
          break
        case '5':
          statusName = '已改升'
          break
      }
      return statusName
    }
  },
  computed: {
    // TODO过滤支付平台字段
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      orderType: state => state.app.orderType,
      payPlatform: state => state.app.payPlatform
    })
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
      this.filter.startDate = this.date[0] + ' 00:00:00'
      this.filter.endDate = this.date[1] + ' 23:59:59'
    },
    // 获取列表数据
    getPayReport (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (this.filter.startDate) {
        this.filter.startDate = this.filter.startDate.substring(0, 10) + ' 00:00:00'
      }
      if (this.filter.endDate) {
        this.filter.endDate = this.filter.endDate.substring(0, 10) + ' 23:59:59'
      }
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.payReport = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        startDate: '',
        endDate: ''
      }
      this.initDate()
      this.getPayReport(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getPayReport(null, pages)
    },
    handleCurrentChange (page) {
      this.getPayReport(page, null)
    },
    judgeOrderStatus (type) {
      let statusName = ''
      switch (type) {
        case '1':
          statusName = '未支付'
          break
        case '2':
          statusName = '已支付'
          break
        case '3':
          statusName = '未取票'
          break
        case '4':
          statusName = '已出票'
          break
        case '5':
          statusName = '已取消'
          break
      }
      return statusName
    },
    exportExcel () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.payReport.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'report/exportPayReport',
        name: getRouteName('/payReport'),
        type: 'xls'
      }
      excelList(params, this)
    }
  }
}
</script>

<style scoped>

</style>
