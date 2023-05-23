<template>
<!--  <div>保险统计查询</div>-->
  <div id="InsuranceQuery" class="container">
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
          <el-input size="medium" placeholder="保险公司名称" v-model="filter.insuranceCompanyName" clearable @keydown.enter.native="getInsuranceReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="保司保单号" v-model="filter.insOrderCode" clearable @keydown.enter.native="getInsuranceReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="银行订单号" v-model="filter.paybillno" clearable></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="票号" v-model="filter.ticketNo" clearable @keydown.enter.native="getInsuranceReport()"></el-input>
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
            type="date"
            value-format="yyyy-MM-dd"
            size="medium"
            placeholder="购保截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="buyDate"-->
<!--            type="daterange"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            range-separator="至"-->
<!--            start-placeholder="购保开始日期"-->
<!--            end-placeholder="购保截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.refStartDate"
            class="w-180"
            type="date"
            value-format="yyyy-MM-dd"
            size="medium"
            placeholder="退保开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.refEndDate"
            class="w-180"
            type="date"
            value-format="yyyy-MM-dd"
            size="medium"
            placeholder="退保截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item">-->
<!--          <el-date-picker-->
<!--            style="width: 180px"-->
<!--            size="medium"-->
<!--            v-model="refDate"-->
<!--            type="daterange"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            range-separator="至"-->
<!--            start-placeholder="退保开始日期"-->
<!--            end-placeholder="退保截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="保险状态" v-model="filter.insStatus" clearable>
            <el-option v-for="item in insuranceStatus" :key="item.id"  :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="保险种类" v-model="filter.insType" clearable>
            <el-option v-for="item in insuranceTypes" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="订单类型" v-model="filter.isFree">
            <el-option v-for="item in orderType" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="渠道类型" v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getInsuranceReport()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" @click="exportInsuranceList" :disabled="insuranceReport.total === 0">导出</el-button>
      </div>
      <div v-if="isColumn">
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
      </div>
    <div class="main">
      <div class="column-btn" @click="switchColumn">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="table-container">
        <el-table
          :data="insuranceReport.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          v-loading="loading"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column :key="Math.random()" label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column :key="Math.random()" label="订单编号" v-if="tableList.ordercode" prop="ordercode" min-width="180"></el-table-column>
          <el-table-column :key="Math.random()" label="航联订单号" v-if="tableList.faiOrderId" prop="faiOrderId" min-width="200"></el-table-column>
          <el-table-column :key="Math.random()" label="保险生效日期" v-if="tableList.flightDate" min-width="160">
            <template slot-scope="scope">
              <div>{{ scope.row.flightDate }} {{ scope.row.flightTime }}</div>
            </template>
          </el-table-column>
          <el-table-column :key="Math.random()" label="票号" prop="ticketNo" v-if="tableList.ticketNo" min-width="160"></el-table-column>
          <el-table-column :key="Math.random()" label="商户订单号" v-if="tableList.payOrdercode" prop="payOrdercode" min-width="300"></el-table-column>
          <el-table-column :key="Math.random()" label="保单号" v-if="tableList.insNo" prop="insNo" min-width="180"></el-table-column>
          <el-table-column :key="Math.random()" label="保司保单号" v-if="tableList.insOrdercode" prop="insOrdercode" min-width="200"></el-table-column>
          <el-table-column :key="Math.random()" label="银行订单号" v-if="tableList.paybillno" prop="paybillno" min-width="200"></el-table-column>
          <el-table-column :key="Math.random()" label="证件号" v-if="tableList.idcard" prop='idcard' min-width="200"></el-table-column>
          <el-table-column :key="Math.random()" label="被保人" v-if="tableList.insuredName" prop="insuredName" min-width="100"></el-table-column>
          <el-table-column :key="Math.random()" label="渠道类型" v-if="tableList.channel" min-width="120" prop="channel"></el-table-column>
          <el-table-column :key="Math.random()" label="航班号" v-if="tableList.flightno" prop="flightno" min-width="100"></el-table-column>
          <el-table-column :key="Math.random()" label="保单费用" v-if="tableList.buyTotalPrice" prop="buyTotalPrice" min-width="100"></el-table-column>
          <el-table-column :key="Math.random()" label="航段" min-width="100" v-if="tableList.afrom" prop="afromAto"></el-table-column>
          <el-table-column :key="Math.random()" label="航段序号" v-if="tableList.segid" min-width="100" prop="segid"></el-table-column>
          <el-table-column :key="Math.random()" label="保险种类" v-if="tableList.insType" min-width="150" prop="insType">
            <template slot-scope="scope">
              <div>{{ scope.row.insType | insuranceTypesFilter(insuranceTypes) }}</div>
            </template>
          </el-table-column>
          <el-table-column :key="Math.random()" label='保险状态' v-if="tableList.insStatus" prop="insStatus" min-width="140"></el-table-column>
          <el-table-column :key="Math.random()" label="承保时间" v-if="tableList.createDate" min-width="160" prop="createDate"></el-table-column>
          <el-table-column :key="Math.random()" label="退保时间" v-if="tableList.refundDate" min-width="160" prop="refundDate"></el-table-column>
          <el-table-column :key="Math.random()" label="保险公司" v-if="tableList.insuranceCompanyName" min-width="220" prop="insuranceCompanyName"></el-table-column>
          <el-table-column :key="Math.random()" label="疫情隔离险" v-if="tableList.epidemicInsr" min-width="140"></el-table-column>
          <el-table-column :key="Math.random()" label="航空退票险" v-if="tableList.refundTicketInsr" prop="refundTicketInsr" min-width="140"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div>
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
  </div>
</template>

<script>
import { fetchList } from './api'
import { mapState } from 'vuex'
import { getChannelList, getCurrentDate, excelList, getRouteName } from '../../../utils/index'
import { insuranceStatus, insuranceTypes } from '../parameter'
import fieldMap from './refer'
import * as types from '../../../filters/index'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'InsuranceQuery',
  data () {
    return {
      componentName: 'insuranceQuery',
      filter: {
        startdate: '',
        enddate: ''
      },
      loading: false,
      buyDate: [],
      refDate: [],
      insuranceStatus: insuranceStatus,
      insuranceTypes: insuranceTypes,
      insuranceReport: {},
      dataViewHeight: null,
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      aaa: [],
      tableList: {
        payOrdercode: false,
        faiOrderId: false,
        idcard: false,
        flightno: false,
        segid: false,
        afrom: false,
        flightDate: true,
        createDate: false,
        refundDate: false,
        insuranceCompanyName: false,
        ordercode: true,
        ticketNo: true,
        insNo: true,
        insOrdercode: false,
        insuredName: true,
        channel: true,
        buyTotalPrice: true,
        insType: true,
        insStatus: true,
	      epidemicInsr: false,
	      refundTicketInsr: false,
	      paybillno: true
      } //  表格展示的数据
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
  filters: {
	  insuranceTypesFilter (value, list) {
	  	const array = list.filter(item => {
	  		return item.value === value
      })
      if (array && array.length) {
      	return array[0].label
      } else {
      	return value
      }
    }
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    initDate () {
      this.buyDate = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.filter.startdate = this.buyDate[0]
      this.filter.enddate = this.buyDate[1]
    },
    // 获取列表数据
    getInsuranceReport (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.insuranceReport = res
        for (let i = 0; i < this.insuranceReport.rows.length; i++) {
          this.insuranceReport.rows[i].afromAto = this.insuranceReport.rows[i].afrom + '-' + this.insuranceReport.rows[i].ato
          this.insuranceReport.rows[i].channel = types.channelMap(this.insuranceReport.rows[i].channel)
          this.insuranceReport.rows[i].buyTotalPrice = types.formatPriceMap(this.insuranceReport.rows[i].buyTotalPrice)
          this.insuranceReport.rows[i].insStatus = types.insuranceMap(this.insuranceReport.rows[i].insStatus)
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 日期判断
    judgeDate () {},
    // 重置
    resetFilter () {
      this.filter = {}
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
    // 导出
    exportInsuranceList () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = 'report/exportInsuranceInfoList'
      let name = getRouteName('/insuranceQuery')
      let type = 'xls'
      data.start = 1
      data.end = this.insuranceReport.total
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

<style scoped  lang="scss">
</style>
