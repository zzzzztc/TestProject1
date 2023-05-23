<template>
  <div id="RefundReport" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="旅客姓名" v-model="filter.name" clearable @keydown.enter.native="getAchangeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="PNR" v-model="filter.pnr" clearable @keydown.enter.native="getAchangeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="退票状态" v-model="filter.ticStatus" clearable>
            <el-option label="二审通过" value="4"></el-option>
            <el-option label="退票完成" value="6"></el-option>
            <el-option label="线下退票完成" value="7"></el-option>
            <el-option label="退款失败" value="8"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="航班号" v-model="filter.fnumber" clearable @keydown.enter.native="getAchangeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单号" v-model="filter.orderCode" clearable @keydown.enter.native="getAchangeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="银行订单号" v-model="filter.paybillno" clearable @keydown.enter.native="getAchangeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="国内/国际" clearable v-model="filter.isInter">
            <el-option label="国内" value="0"></el-option>
            <el-option label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="机票号" v-model="filter.eticketno" clearable @keydown.enter.native="getAchangeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="查询时间" v-model="filter.dateType">
            <el-option label="申请时间" value="1"></el-option>
            <el-option label="审核时间" value="2"></el-option>
            <el-option label="退款时间" value="3"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            style="width: 180px"
            v-model="filter.startdate"
            value-format="yyyy-MM-dd"
            size="medium"
            type="date"
            placeholder="选择开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            style="width: 180px"
            v-model="filter.enddate"
            size="medium"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="自愿/非自愿" v-model="filter.nature">
            <el-option label="非自愿" value="0"></el-option>
            <el-option label="自愿" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="退票单号" v-model="filter.refundNo" clearable @keydown.enter.native="getAchangeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单类型" clearable v-model="filter.isintegral">
            <el-option v-for="item in orderType" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="退票来源" v-model="filter.refundType" clearable>
            <el-option label="自营渠道退票" value="0"></el-option>
            <el-option label="全渠道非自愿退票" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="票价级别" v-model="filter.fbc" clearable @keydown.enter.native="getAchangeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="市场方" v-model="filter.airways" clearable @keydown.enter.native="getAchangeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="承运方" v-model="filter.airline" clearable @keydown.enter.native="getAchangeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="乘机人类型" v-model="filter.passerType">
            <el-option label="成人" value="0"></el-option>
            <el-option label="儿童" value="1"></el-option>
            <el-option label="婴儿" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道" clearable v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="是否空轨订单" v-model="filter.isAirrAilway">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getAchangeList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" type="success" :disabled="achangeList.total === 0" @click="exportPayDetail">导出</el-button>
      </div>
      <div v-if="isColumn " class="search-container clearfix flex">
        <div class=" check-ipt">
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
          :data="achangeList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          @selection-change='handleSelectionChange'
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
<!--          <el-table-column type='selection' fixed="left"></el-table-column>-->
          <el-table-column key="0" v-if="tableList.channel" label="渠道类型" min-width="120">
            <template slot-scope="scope">
              {{scope.row.channel | channelMap}}
            </template>
          </el-table-column>
          <el-table-column key="1" v-if="tableList.ordercode" label="订单号" prop="ordercode" min-width="160"></el-table-column>
          <el-table-column key="2" v-if="tableList.refundNo" label="退票单号" prop="refundNo" min-width="160"></el-table-column>
          <el-table-column key="3" v-if="tableList.initialTktNo" label="旧票号" prop="initialTktNo" min-width="160"></el-table-column>
          <el-table-column key="4" v-if="tableList.eticketno" label="票号" prop="eticketno" min-width="160"></el-table-column>
          <el-table-column key="5" v-if="tableList.pnr" label="PNR" prop="pnr" min-width="100"></el-table-column>
          <el-table-column key="60" v-if="tableList.fbc" label="票价级别" prop="fbc" min-width="100"></el-table-column>
          <el-table-column key="6" v-if="tableList.airways" label="市场方" prop="airways" min-width="100"></el-table-column>
          <el-table-column key="7" v-if="tableList.airline" label="承运方" prop="airline" min-width="100"></el-table-column>
          <el-table-column key="8" v-if="tableList.orderdate" label="订单日期" prop="orderdate" min-width="160"></el-table-column>
          <el-table-column key="9" v-if="tableList.paybillno" label="银行订单号" prop="paybillno" min-width="180"></el-table-column>
          <el-table-column key="42" v-if="tableList.outRefundNo" label="退款银行订单" prop="outRefundNo" min-width="180"></el-table-column>
          <el-table-column key="10" v-if="tableList.name" label="旅客姓名" prop="name" min-width="160"></el-table-column>
          <el-table-column key="11" v-if="tableList.fnumber" label="航班号" prop="fnumber" min-width="100"></el-table-column>
          <el-table-column key="12" v-if="tableList.sail" label="航段" prop="sail" min-width="100"></el-table-column>
          <el-table-column key="13" v-if="tableList.unexoInsr" label="航意险" prop="unexoInsr" min-width="100">
            <template slot-scope="scope">
              {{scope.row.unexoInsr | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column key="14" v-if="tableList.delayInsr" label="航延险" prop="delayInsr" min-width="100">
            <template slot-scope="scope">
              {{scope.row.delayInsr | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column key="15" v-if="tableList.fmoney" label="优惠金额">
            <template slot-scope="scope">
              {{scope.row.fmoney | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column key="16" v-if="tableList.paymoney" label="支付金额" prop="paymoney" min-width="100">
            <template slot-scope="scope">
              {{scope.row.paymoney | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column key="17" v-if="tableList.integralFare" label="支付积分" prop="integralFare" min-width="100"></el-table-column>
          <el-table-column key="18" v-if="tableList.isinter" label="国内/国际" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.isinter === '0'">国内</span>
              <span v-else>国际</span>
            </template>
          </el-table-column>
          <el-table-column key="19" v-if="tableList.nature" label="退票性质" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.nature === '0'">非自愿</span>
              <span v-else>自愿</span>
            </template>
          </el-table-column>
          <el-table-column key="20" v-if="tableList.status" label="退票状态" min-width="100">
            <template slot-scope="scope">
              {{scope.row.status | refundStatusMap}}
            </template>
          </el-table-column>
          <el-table-column key="21" v-if="tableList.failReason" label="退款失败原因" prop="failReason" min-width="200"></el-table-column>
          <el-table-column key="22" v-if="tableList.happendate" label="申请退票时间" min-width="160">
            <template slot-scope="scope">
              {{scope.row.happendate | dateFormater }} {{scope.row.happendtime}}
            </template>
          </el-table-column>
          <el-table-column key="56" v-if="tableList.pnrClearTime" label="pnr取消时间" prop="pnrClearTime" min-width="160"></el-table-column>
          <el-table-column key="23" v-if="tableList.clearTimeDiff" label="pnr取消时间差" prop="clearTimeDiff" min-width="160"></el-table-column>
          <el-table-column key="57" v-if="tableList.firstAuditOpname" label="一审审核人" prop="firstAuditOpname" min-width="120"></el-table-column>
          <el-table-column key="58" v-if="tableList.firstAuditAccount" label="一审审核人工号" prop="firstAuditAccount" min-width="120"></el-table-column>
          <el-table-column key="35" v-if="tableList.secondAuditOpname" label="二审审核人" prop="secondAuditOpname" min-width="120"></el-table-column>
          <el-table-column key="36" v-if="tableList.secondAuditAccount" label="二审审核人工号" prop="secondAuditAccount" min-width="120"></el-table-column>
          <el-table-column key="55" v-if="tableList.cresdatetime" label="退票审核时间" prop="cresdatetime" min-width="160"></el-table-column>
          <el-table-column key="24" v-if="tableList.creqdatetime" label="退款时间" prop="creqdatetime" min-width="160"></el-table-column>
          <el-table-column key="25" v-if="tableList.returnIntegralStatus" label="退积分状态" min-width="110">
            <template slot-scope="scope">
              <span v-if="scope.row.returnIntegralStatus === '0'">未退</span>
              <span v-if="scope.row.returnIntegralStatus === '1'">已退</span>
            </template>
          </el-table-column>
          <el-table-column key="26" v-if="tableList.ticStatusRelation" label="票面处理状态" min-width="110">
            <template slot-scope="scope">
              <span v-if="scope.row.ticStatusRelation === '1'">待处理</span>
              <span v-if="scope.row.ticStatusRelation === '2'">已处理</span>
            </template>
          </el-table-column>
          <el-table-column key="27" v-if="tableList.startStationName" label="地铁航段" min-width="160">
            <template slot-scope="scope">
              <div>{{scope.row.startStationName}}-{{scope.row.endStationName}}</div>
            </template>
          </el-table-column>
          <el-table-column key="28" v-if="tableList.payAmount" label="地铁票价格" prop="payAmount" min-width="100">
            <template slot-scope="scope">
              {{scope.row.payAmount | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column key="29" v-if="tableList.transStatus" label="地铁票状态" prop="transStatus" min-width="100">
            <template slot-scope="scope">
              <div>{{ scope.row.transStatus | transStatusMap }}</div>
            </template>
          </el-table-column>
          <el-table-column key="30" v-if="tableList.iatatax" label="杂项税" min-width="160" prop="iatatax"></el-table-column>
          <el-table-column key="31" v-if="tableList.railwayMoney" label="地铁票金额" prop="railwayMoney" min-width="100"></el-table-column>
          <el-table-column key="32" v-if="tableList.upgradMoney" label="票价差金额" prop="upgradMoney" min-width="100"></el-table-column>
          <el-table-column key="33" v-if="tableList.outdatetime" label="变更时间" prop="outdatetime" min-width="150"></el-table-column>
          <el-table-column key="34" v-if="tableList.changeFee" label="变更费率" prop="changeFee" min-width="80"></el-table-column>
          <el-table-column key="35" v-if="tableList.changeMoney" label="改期费金额" prop="changeMoney" min-width="100"></el-table-column>
          <el-table-column key="36" v-if="tableList.initialChannel" label="原票销售渠道" min-width="120">
              <template slot-scope="scope">
                  {{ scope.row.initialChannel | channelMap }}
              </template>
          </el-table-column>
          <el-table-column key="37" v-if="tableList.initialOffice" label="原票代理人航协号" prop="initialOffice" min-width="140"></el-table-column>
          <el-table-column key="38" v-if="tableList.initialFare" label="原票票面金额" prop="initialFare" min-width="120"></el-table-column>
          <el-table-column key="39" v-if="tableList.initialAirportTax" label="原票机建" prop="initialAirportTax" min-width="100"></el-table-column>
          <el-table-column key="40" v-if="tableList.initialFuelTax" label="原票燃油" prop="initialFuelTax" min-width="100"></el-table-column>
          <el-table-column key="41" v-if="tableList.agencyFee" label="原票代理费金额" prop="agencyFee" min-width="120"></el-table-column>
          <el-table-column key="42" v-if="tableList.walletMoney" label="红包金额" prop="walletMoney" min-width="120"></el-table-column>
          <el-table-column key="53" label="疫情隔离险" v-if="tableList.epidemicInsr" prop="epidemicInsr" min-width="140"></el-table-column>
          <el-table-column key="54" label="航空退票险" v-if="tableList.refundTicketInsr" prop="refundTicketInsr" min-width="140"></el-table-column>
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
        :total="achangeList.total">
       </el-pagination>
    </div>
    <!--审核记录-->
    <!--退票审核-->
    <!--<RefundDiaLog ref="refundAby" :refundAuditList="refundAuditList"></RefundDiaLog>-->
    <confirmDiaLog ref="refundAby" :refundAuditList="refundAuditList"></confirmDiaLog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelList, getCurrentDate, excelList, getRouteName } from '../../../utils'
import confirmDiaLog from '../../../components/refundConfirm'
import { fetchList } from './api'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'RefundReport',
  data () {
    return {
      componentName: 'refundReport',
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        outRefundNo: false,
        orderdate: true,
        ordercode: true,
        pnr: true,
        fbc: false,
        airways: false,
        airline: false,
        channel: true,
        sail: true,
        initialTktNo: false,
        eticketno: true,
        name: false,
        fnumber: false,
        unexoInsr: false,
        delayInsr: false,
        fmoney: false,
        paymoney: true,
        integralFare: false,
        paybillno: false,
        refundNo: false,
        nature: false,
        status: true,
        failReason: false,
        isinter: false,
        iatatax: false,
        happendate: false,
	      pnrClearTime: false,
	      clearTimeDiff: false,
        cresdatetime: false,
        creqdatetime: false,
        returnIntegralStatus: false,
        ticStatusRelation: false,
        railwayMoney: false,
        upgradMoney: false,
        outdatetime: false,
        changeFee: false,
        changeMoney: false,
        initialChannel: false,
        initialOffice: false,
        initialFare: false,
        initialAirportTax: false,
        initialFuelTax: false,
        agencyFee: false,
	      walletMoney: false,
	      epidemicInsr: false,
	      refundTicketInsr: false,
	      firstAuditOpname: false,
	      firstAuditAccount: false,
	      secondAuditOpname: false,
	      secondAuditAccount: false
      },
      loading: false,
      filter: {
        dateType: '1',
        ticStatus: '4',
        startdate: '',
        enddate: ''
      },
      applyDate: [],
      dataViewHeight: null,
      achangeList: {},
      refundAuditList: {},
      dataArr: []
    }
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getAchangeList(1, this.pagination.pageSize)
    // this.locCheck()
  },
  mixins: [checkAttrs, computWidth],
  components: {
    // RefundDiaLog
    confirmDiaLog
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      orderType: state => state.app.orderType
    })
  },
  methods: {
    handleSelectionChange (val) {
      this.dataArr = val
    },
    exportPayDetail () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = 'refund/exportRefundConfirmData'
      let name = getRouteName('/refundReport')
      let type = 'xls'
      // let total = this.achangeList.total
      data.start = 1
      data.end = this.achangeList.total
      delete data.page
      delete data.rows
      let obj = {
        data,
        url,
        name,
        type
      }
      excelList(obj, this)
    },
    // 初始化时间
    initDate () {
      let date = getCurrentDate(0)
      this.startdate = getCurrentDate(0, '01')
      this.enddate = date
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    getAchangeList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.achangeList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    //   重置
    resetFilter () {
      this.filter = {
        dateType: '1',
        ticStatus: '4'
      }
      this.initDate()
      this.getAchangeList(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getAchangeList(null, pages)
    },
    handleCurrentChange (page) {
      this.getAchangeList(page, null)
    },
    // 切换弹框
    // switchDialog (val, type, id) {
    //   if (type === 0) {
    //     // 获取审核记录
    //     this.refundAuditList = {
    //       dialogVisibleReport: true,
    //       dialogTitle: '审核记录',
    //       type: val
    //     }
    //     this.$refs.refundAby.getReviewReport(id)
    //   } else {
    //     // 退票审核
    //     this.refundAuditList = {
    //       dialogVisibleRefund: true,
    //       dialogTitle: '退票审核',
    //       type: val
    //     }
    //     this.$refs.refundAby.getReviewDetail(id)
    //   }
    // }
    // 切换弹框
    switchDialog (val, type, params) {
      // console.log(params)
      if (type === 0) {
        // 获取审核记录
        this.refundAuditList = {
          dialogVisibleReport: true,
          dialogTitle: '审核记录',
          type: val
        }
        this.$refs.refundAby.getHistoryData({ ticketid: params })
      } else {
        // 退票审核
        this.refundAuditList = {
          editVisible: true,
          dialogTitle: '退票审核',
          type: val
        }
        this.$refs.refundAby.getrefundData({ idPara: params.id })
        this.$refs.refundAby.getHistoryData({ ticketid: params.ticketid })
      }
    }
  }
}
</script>

<style scoped>

</style>
