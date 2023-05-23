<template>
  <div id="InsuranceReport" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单号" v-model="filter.ordercode" clearable @keydown.enter.native="getInsuranceReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="航班号" v-model="filter.flightNo" clearable @keydown.enter.native="getInsuranceReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="被保人" v-model="filter.applicantName" clearable @keydown.enter.native="getInsuranceReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="证件号" v-model="filter.idCard" clearable @keydown.enter.native="getInsuranceReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="购保开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.enddate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="购保结束日期">
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
<!--            start-placeholder="购保开始日期"-->
<!--            end-placeholder="购保结束日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.refStartDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.refEndDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.refundDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="退保开始时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.refundDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="退保结束时间">
          </el-date-picker>
        </div>
<!--        <div class="search-item">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="refundDate"-->
<!--            type="daterange"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            range-separator="至"-->
<!--            start-placeholder="退保开始日期"-->
<!--            end-placeholder="退保结束日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="保险状态"  clearable v-model="filter.insStatus">
            <el-option v-for="item in insStatus" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="保险种类"  clearable v-model="filter.insType">
            <el-option label="航意险" value="hangyi"></el-option>
            <el-option label="航延险" value="hangyan"></el-option>
            <el-option label="疫情隔离险" value="epidemicInsr"></el-option>
            <el-option label="航空退票险" value="refundTicketInsr"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="保司保单号" v-model="filter.insOrderCode" clearable @keydown.enter.native="getInsuranceReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单类型" clearable v-model="filter.isFree">
            <el-option v-for="item in orderType" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道类型" clearable v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getInsuranceReport()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="!insuranceReport.total" @click="handleExport">导出</el-button>
      </div>
      <div v-if="isColumn" class="search-container clearfix flex">
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
      <div class="column-btn" @click="switchColumn">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="insuranceReport.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--            <el-table-column label="序号" type="index" width="50"></el-table-column>-->
            <el-table-column v-if="tableList.ordercode" label="订单编号" prop="ordercode" min-width="160"></el-table-column>
            <el-table-column v-if="tableList.payOrdercode" label="订单编号" prop="payOrdercode" min-width="300"></el-table-column>
            <el-table-column v-if="tableList.insNo" label="保单号" prop="insNo" min-width="160"></el-table-column>
            <el-table-column v-if="tableList.insuredName" label="被保人" prop="insuredName" min-width="100"></el-table-column>
            <el-table-column v-if="tableList.idcard" label="证件号" prop="idcard" min-width="220"></el-table-column>
            <el-table-column v-if="tableList.flightno" label="航班号" prop="flightno" min-width="80"></el-table-column>
            <el-table-column v-if="tableList.segid" label="航段序号" prop="segid" min-width="100"></el-table-column>
            <el-table-column v-if="tableList.afrom" label="航段" min-width="100">
              <template slot-scope="scope">
                {{scope.row.afrom}}-{{scope.row.ato}}
              </template>
            </el-table-column>
            <el-table-column v-if="tableList.channel" label="渠道类型" prop="channel" min-width="100">
              <template slot-scope="scope">
                <div>{{scope.row.channel | channelMap  }}</div>
              </template>
            </el-table-column>
            <el-table-column v-if="tableList.flightDate" label="乘机日期" prop="flightDate" min-width="100"></el-table-column>
            <el-table-column v-if="tableList.createDate" label="承保时间" prop="createDate" min-width="160"></el-table-column>
            <el-table-column v-if="tableList.refundDate" label="退保时间" prop="refundDate" min-width="160"></el-table-column>
            <el-table-column v-if="tableList.buyTotalPrice" label="保单费用" prop="buyTotalPrice" min-width="100">
              <template slot-scope="scope">
                {{scope.row.buyTotalPrice | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column v-if="tableList.insType" label="保险种类" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.insType === 'hangyi'">航意险</span>
                <span v-else-if="scope.row.insType === 'hangyan'">航延险</span>
                <span v-else-if="scope.row.insType.indexOf('yiqing') >= 0">疫情隔离险</span>
                <span v-else-if="scope.row.insType === 'refundTicket'">航空退票险</span>
              </template>
            </el-table-column>
            <el-table-column v-if="tableList.insuranceCompanyName" label="保险公司" prop="insuranceCompanyName" min-width="220"></el-table-column>
            <el-table-column v-if="tableList.insStatus" label="保险状态" prop="insStatus" min-width="120">
              <template slot-scope="scope">
                <div>{{scope.row.insStatus | insuranceMap  }}</div>
              </template>
            </el-table-column>
            <el-table-column v-if="tableList.insOrderCode" label="保司保单号" prop="insOrdercode" width="140"></el-table-column>
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
        :total="insuranceReport.total">
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
  name: 'InsuranceReport',
  data () {
    return {
      componentName: 'insuranceReport',
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        insOrderCode: false,
        ordercode: true,
        payOrdercode: false,
        insNo: true,
        insuredName: true,
        idcard: true,
        flightno: true,
        segid: false,
        afrom: false,
        channel: false,
        flightDate: true,
        createDate: false,
        refundDate: false,
        buyTotalPrice: false,
        insType: true,
        insuranceCompanyName: false,
        insStatus: false
      },
      filter: {
        startdate: '',
        enddate: ''
      },
      loading: false,
      date: [],
      refundDate: [],
      dataViewHeight: null,
      insuranceReport: {},
      insStatus: [
        { id: '1', label: '购保处理中', value: '0' },
        { id: '2', label: '购买成功', value: '1' },
        { id: '3', label: '退保拒绝', value: '2' },
        { id: '4', label: '退保申请中', value: '3' },
        { id: '5', label: '退保审核中', value: '4' },
        { id: '6', label: '退保完成', value: '5' },
        { id: '7', label: '线下退保完成', value: '6' },
        { id: '8', label: '线下理赔', value: '7' }
      ]
    }
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getInsuranceReport(1, this.pagination.pageSize)
    // this.locCheck()
  },
  mixins: [checkAttrs, computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      orderType: state => state.app.orderType
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
      this.filter.startdate = this.date[0]
      this.filter.enddate = this.date[1]
    },
    // 获取列表数据
    getInsuranceReport (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      // this.judgeFilterDate()
      fetchList(this.filter).then(res => {
        this.insuranceReport = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    judgeFilterDate () {
      if (this.date.length) {
        this.filter.startdate = this.date[0]
        this.filter.enddate = this.date[1]
      } else {
        delete this.filter.startdate
        delete this.filter.enddate
      }
      if (this.refundDate.length) {
        this.filter.refStartDate = this.refundDate[0]
        this.filter.refEndDate = this.refundDate[1]
      } else {
        delete this.filter.refStartDate
        delete this.filter.refEndDate
      }
    },
    // 重置
    resetFilter () {
      this.filter = {
        startdate: '',
        enddate: ''
      }
      this.initDate()
      this.getInsuranceReport(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getInsuranceReport(null, pages)
    },
    handleCurrentChange (page) {
      this.getInsuranceReport(page, null)
    },
    // 表格 -- 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.insuranceReport.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'report/exportInsuranceInfoList',
        name: getRouteName('/insuranceReport'),
        type: 'xls'
      }
      excelList(params, this)
    }
  }
}
</script>

<style scoped>

</style>
