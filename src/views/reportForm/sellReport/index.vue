<template>
  <div id="SaleReport" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="起始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.enddate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.soutdatetime"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="出票开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.eoutdatetime"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="出票截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.sfdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="起飞开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.efdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="起飞截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道编号" v-model="filter.channel">
            <el-option v-for="item in channelList" :label="item.chalName" :value="item.chalCode" :key="item.chalId"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单号" v-model="filter.ordercode" clearable @keydown.enter.native="getSellReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="PNR" v-model="filter.pnr" clearable @keydown.enter.native="getSellReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="票价级别" v-model="filter.fbc" clearable @keydown.enter.native="getAchangeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="机票号" v-model="filter.eticketno" clearable @keydown.enter.native="getSellReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="出发地" v-model="filter.afrom" clearable @keydown.enter.native="getSellReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="到达地" v-model="filter.ato" clearable @keydown.enter.native="getSellReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="银行订单号" v-model="filter.paybillno" clearable @keydown.enter.native="getSellReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="乘机人类型" clearable v-model="filter.passerType">
            <el-option v-for="item in passerType" :label="item.label" :value="item.value" :key="item.id"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单类型" clearable v-model="filter.orderType">
            <el-option v-for="item in orderType" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="是否空轨订单" v-model="filter.isAirrAilway">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <!--clearable @keydown.enter.native=""-->
          <el-select size="medium" v-model="filter.saleType" placeholder="用户类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="联系人" value="1"></el-option>
            <el-option label="联系电话" value="2"></el-option>
            <el-option label="购票人电话" value="3"></el-option>
            <el-option label="购票人证件号" value="4"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="用户编号" v-model="filter.saleNo" :disabled="filter.saleType === ''" clearable @keydown.enter.native="getSellReport()"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getSellReport()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" @click="exportOrderInfo" :disabled="sellReport.total === 0">导出</el-button>
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
          v-loading="loading"
          :data="sellReport.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--            <el-table-column label="序号" type="index" width="50"></el-table-column>-->
            <el-table-column key="1" v-if="tableList.channel" label="渠道来源" min-width="120">
              <template slot-scope="scope">
                {{scope.row.channel | channelMap}}
              </template>
            </el-table-column>
            <el-table-column key="2" v-if="tableList.ticketNo" label="票号" prop="ticketNo" min-width="140"></el-table-column>
            <el-table-column key="3" v-if="tableList.isinter" label="国内/国际" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.isinter === '0'">国内</span>
                <span v-if="scope.row.isinter === '1'">国际</span>
              </template>
            </el-table-column>
            <el-table-column key="4" v-if="tableList.productName" label="产品名称" prop="productName" min-width="140"></el-table-column>
            <el-table-column key="5" v-if="tableList.pname" label="旅客姓名" prop="pname" min-width="120"></el-table-column>
            <el-table-column key="6" v-if="tableList.passerType" label="旅客类型" min-width="120">
              <template slot-scope="scope">
                {{scope.row.passerType | passerTypeMap  }}
              </template>
            </el-table-column>
            <el-table-column key="7" v-if="tableList.idType" label="证件类型" min-width="140">
              <template slot-scope="scope">
                {{scope.row.idType | idTypeMap}}
              </template>
            </el-table-column>
            <el-table-column key="8" v-if="tableList.idNumber" label="证件号码" prop="idNumber" min-width="180"></el-table-column>
            <el-table-column key="9" v-if="tableList.pnr" label="pnr" prop="pnr" min-width="120"></el-table-column>
            <el-table-column key="60" v-if="tableList.fbc" label="票价级别" prop="fbc" min-width="100"></el-table-column>
            <el-table-column key="61" v-if="tableList.contsName" label="联系人" prop="contsName" min-width="120"></el-table-column>
            <el-table-column key="62" v-if="tableList.contsMobile" label="联系电话" prop="contsMobile" min-width="120"></el-table-column>
            <el-table-column key="63" v-if="tableList.memberMobile" label="购票人电话" prop="memberMobile" min-width="120"></el-table-column>
            <el-table-column key="64" v-if="tableList.memberIdnumber" label="购票人证件号" prop="memberIdnumber" min-width="120"></el-table-column>
            <el-table-column key="10" v-if="tableList.airways" label="市场方" prop="airways" min-width="100"></el-table-column>
            <el-table-column key="11" v-if="tableList.carrier" label="承运方" prop="carrier" min-width="100"></el-table-column>
            <el-table-column key="12" v-if="tableList.outDate" label="出票日期" prop="outDate" min-width="120"></el-table-column>
            <el-table-column key="13" v-if="tableList.flightDate" label="航班日期" prop="flightDate" min-width="120"></el-table-column>
            <el-table-column key="14" v-if="tableList.flightNumber" label="航班号" prop="flightNumber" min-width="100"></el-table-column>
            <el-table-column key="15" v-if="tableList.afrom" label="出发地" prop="afrom" min-width="120"></el-table-column>
            <el-table-column key="16" v-if="tableList.ato" label="到达地" prop="ato" min-width="120"></el-table-column>
            <el-table-column key="17" v-if="tableList.seat" label="舱位" prop="seat" min-width="80"></el-table-column>
            <el-table-column key="18" v-if="tableList.initialTicketNo" label="变更前票号" prop="initialTicketNo" min-width="160"></el-table-column>
            <el-table-column key="19" v-if="tableList.initialSeat" label="变更前舱位" prop="initialSeat" min-width="120"></el-table-column>
            <el-table-column key="20" v-if="tableList.initialFlightDate" label="变更前航班日期" prop="initialFlightDate" min-width="120"></el-table-column>
            <el-table-column key="21" v-if="tableList.initialFlightNumber" label="变更前航班号" prop="initialFlightNumber" min-width="120"></el-table-column>
            <el-table-column key="22" v-if="tableList.price" label="票面价" prop="price" min-width="80">
              <template slot-scope="scope">
                {{scope.row.price | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="23" v-if="tableList.airport" label="机建税" prop="airport" min-width="80">
              <template slot-scope="scope">
                {{scope.row.airport | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="24" v-if="tableList.fuel" label="燃油税" prop="fuel" min-width="80">
              <template slot-scope="scope">
                {{scope.row.fuel | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="25" v-if="tableList.taxprice" label="国际票总税" prop="taxprice" min-width="100">
              <template slot-scope="scope">
                {{scope.row.taxprice | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="26" v-if="tableList.unexpInsurance" label="航意险" prop="unexpInsurance">
              <template slot-scope="scope">
                {{scope.row.unexpInsurance | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="27" v-if="tableList.delayInsurance" label="航延险" prop="delayInsurance">
              <template slot-scope="scope">
                {{scope.row.delayInsurance | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="28" v-if="tableList.insurance" label="保险总额" prop="insurance">
              <template slot-scope="scope">
                {{scope.row.insurance | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="29" v-if="tableList.fMoney" label="优惠金额" prop="fMoney">
              <template slot-scope="scope">
                {{scope.row.fMoney | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="30" v-if="tableList.upgrandmoney" label="升舱补差价" prop="upgrandmoney" min-width="100">
              <template slot-scope="scope">
                {{scope.row.upgrandmoney | formatPriceMap}}
              </template>
            </el-table-column>
<!--          <el-table-column key="31" v-if="tableList.priceAndUpgrand" label="票价（含升舱价差）" prop="priceAndUpgrand" min-width="160">-->
<!--            <template slot-scope="scope">-->
<!--              {{scope.row.priceAndUpgrand | formatPriceMap}}-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column key="31" v-if="tableList.changeMoney" label="改期手续费" prop="changeMoney" min-width="160">
              <template slot-scope="scope">
                {{scope.row.changeMoney | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="32" v-if="tableList.allPriceWithout" label="总收入（不含税）" prop="allPriceWithout" min-width="140">
              <template slot-scope="scope">
                {{scope.row.allPriceWithout | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="33" v-if="tableList.allPrice" label="总收入" prop="allPrice">
              <template slot-scope="scope">
                {{scope.row.allPrice | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="52" v-if="tableList.productMoney" label="同步商品金额" prop="productMoney" min-width="120"></el-table-column>
            <el-table-column key="34" v-if="tableList.ticketType" label="订单类型" prop="ticketType" min-width="100"></el-table-column>
            <el-table-column key="35" v-if="tableList.orderCode" label="订单号" prop="orderCode" min-width="160">
              <template slot-scope="scope">
                <span class="active-text" @click="switchDialog(scope.row)">{{scope.row.orderCode}}</span>
              </template>
            </el-table-column>
            <el-table-column key="36" v-if="tableList.initialOrderCode" label="变更前订单号" prop="initialOrderCode" min-width="160"></el-table-column>
            <el-table-column key="37" v-if="tableList.paytype" label="支付方式" prop="paytype" min-width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.paytype | payTypeMap }}</span>
              </template>
            </el-table-column>
            <el-table-column key="38" v-if="tableList.paybillno" label="银行订单号" prop="paybillno" min-width="180"></el-table-column>
            <el-table-column key="39" v-if="tableList.refundNum" label="退票量" prop="refundNum"></el-table-column>
            <el-table-column key="40" v-if="tableList.refAirport" label="退机建税" prop="refAirport">
              <template slot-scope="scope">
                {{scope.row.refAirport | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="41" v-if="tableList.refFuel" label="退燃油税" prop="refFuel">
              <template slot-scope="scope">
                {{scope.row.refFuel | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="42" v-if="tableList.refpmprice" label="退税总" prop="refpmprice">
              <template slot-scope="scope">
                {{scope.row.refpmprice | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="43" v-if="tableList.refinsurance" label="退保险总额" prop="refinsurance" min-width="100">
              <template slot-scope="scope">
                {{scope.row.refinsurance | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="44" v-if="tableList.charge" label="现金手续费" prop="charge" min-width="100">
              <template slot-scope="scope">
                {{scope.row.charge | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="45" v-if="tableList.refundmoney" label="退款总金额" prop="refundmoney" min-width="100">
              <template slot-scope="scope">
                {{scope.row.refundmoney | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="46" v-if="tableList.startStationName" label="地铁航段" min-width="160">
              <template slot-scope="scope">
                <div>{{scope.row.startStationName}}-{{scope.row.endStationName}}</div>
              </template>
            </el-table-column>
            <el-table-column key="47" v-if="tableList.payAmount" label="地铁票价格" prop="payAmount" min-width="100">
              <template slot-scope="scope">
                {{scope.row.payAmount | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="48" v-if="tableList.transStatus" label="地铁票状态" prop="transStatus" min-width="100">
              <template slot-scope="scope">
                <div>{{ scope.row.transStatus | transStatusMap }}</div>
              </template>
            </el-table-column>
            <el-table-column key="49" v-if="tableList.iatatax" label="杂项税" prop="iatatax" min-width="180"></el-table-column>
            <el-table-column key="50" v-if="tableList.walletMoney" label="红包金额" prop="walletMoney" min-width="80"></el-table-column>
            <el-table-column key="51" v-if="tableList.refundWallet" label="红包退款" prop="refundWallet" min-width="80"></el-table-column>
            <el-table-column key="52" prop="refundWalletCharge" label="红包手续费" v-if="tableList.refundWalletCharge" min-width="80"
          >
          </el-table-column>
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
        :total="sellReport.total">
       </el-pagination>
    </div>
    <!--订单信息弹出框-->
    <OrderDetail ref="orderAby" :orderDetilList="orderDetilList" @tableList="getSellReport"></OrderDetail>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import OrderDetail from '../../../components/orderDetail'
import { getChannelList, getDataDictionary, excelList, getCurrentDate, getRouteName } from '../../../utils/index'
import { fetchList } from './api.js'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'SaleReport',
  data () {
    return {
      componentName: 'saleReport',
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        channel: true,
        ticketNo: true,
        isinter: false,
        productName: false,
        pname: true,
        passerType: false,
        idType: false,
        idNumber: false,
        pnr: true,
        fbc: false,
        contsName: false,
        contsMobile: false,
        memberMobile: false,
        memberIdnumber: false,
        airways: false,
        carrier: false,
        outDate: false,
        flightDate: true,
        flightNumber: true,
        afrom: false,
        ato: false,
        seat: false,
        initialTicketNo: false,
        initialSeat: false,
        initialFlightDate: false,
        initialFlightNumber: false,
        price: false,
        airport: false,
        fuel: false,
        taxprice: false,
        unexpInsurance: false,
        delayInsurance: false,
        insurance: false,
        fMoney: false,
        upgrandmoney: false,
        changeMoney: false,
        allPriceWithout: false,
        allPrice: true,
        productMoney: false,
        ticketType: false,
        orderCode: false,
        initialOrderCode: false,
        paytype: false,
        paybillno: false,
        refundNum: false,
        refAirport: false,
        refFuel: false,
        refpmprice: false,
        refinsurance: false,
        charge: false,
        refundmoney: false,
        startStationName: true,
        payAmount: true,
        transStatus: true,
        iatatax: false,
	      walletMoney: false,
	      refundWallet: false,
	      epidemicInsr: false,
	      refundTicketInsr: false
      },
      loading: false,
      filter: {
        sourceid: 'sdal',
        startdate: '',
        enddate: '',
        saleType: '',
        saleNo: ''
      },
      dataViewHeight: null,
      date: [], // 起始时间
      ticketDate: [],
      flightDate: [],
      sellReport: {},
      orderDetilList: {}
    }
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.judgeProductName()
    this.getSellReport(1, this.pagination.pageSize)
    // this.locCheck()
  },
  mixins: [checkAttrs, computWidth],
  filters: {
    // 操作类型 -- 过滤器
    ticketMap (ticketType) {
      let ticketTypeName = ''
      switch (ticketType) {
        case '0':
          ticketTypeName = '普通订单'
          break
        case '1':
          ticketTypeName = '积分订单'
          break
        case 'upgrad':
          ticketTypeName = '升舱订单'
          break
        default:
          ticketTypeName = '--'
      }
      return ticketTypeName
    }
  },
  components: {
    OrderDetail
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      passerType: state => state.app.passerType,
      orderType: state => state.app.orderType,
      dataDictionary: state => state.app.dataDictionary
    })
  },
  methods: {
    exportOrderInfo () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.sellReport.total
      delete data.page
      delete data.rows
      let url = 'report/exportSaleInfoReport'
      let name = getRouteName('/saleReport')
      let type = 'xls'
      let obj = {
        data,
        url,
        name,
        type
      }
      excelList(obj, this)
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 判断产品列表
    judgeProductName () {
      if (this.dataDictionary.PRODUCTNAME.length) {
        getDataDictionary('PRODUCTNAME')
      }
    },
    initDate () {
      this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.filter.startdate = this.date[0]
      this.filter.enddate = this.date[1]
    },
    // 获取列表数据
    getSellReport (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      // this.judgeFilterDate()
      fetchList(this.filter).then(res => {
        this.sellReport = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        sourceid: 'sdal',
        startdate: '',
        enddate: '',
        saleType: ''
      }
      this.initDate()
      this.ticketDate = []
      this.flightDate = []
      this.getSellReport(1, this.pagination.pageSize)
    },
    // 过滤时间判断
    judgeFilterDate () {
      if (this.date.length) {
        // 接口文档该字段错误
        this.filter.startdate = this.date[0]
        this.filter.enddate = this.date[1]
      } else {
        delete this.filter.startDate
        delete this.filter.enddate
      }
      if (this.ticketDate.length) {
        this.filter.soutdatetime = this.ticketDate[0]
        this.filter.eoutdatetime = this.ticketDate[1]
      } else {
        delete this.filter.soutdatetime
        delete this.filter.eoutdatetime
      }
      if (this.flightDate.length) {
        this.filter.sfdate = this.flightDate[0]
        this.filter.efdate = this.flightDate[1]
      } else {
        delete this.filter.sfdate
        delete this.filter.efdate
      }
    },
    // 分页
    handleSizeChange (pages) {
      this.getSellReport(null, pages)
    },
    handleCurrentChange (page) {
      this.getSellReport(page, null)
    },
    // 切换弹框
    switchDialog (params) {
      // console.log(this.filter)
      let startdate = this.filter.startdate
      let enddate = this.filter.startdate.replace(/-/g, '')
      this.orderDetilList = {
        orderVisible: true,
        dialogTitle: '订单信息'
      }
      this.$refs.orderAby.getOrderData({ orderId: params.orderId, orderDate: enddate }) // 订单信息
      this.$refs.orderAby.getFirstPassageData({ orderId: params.orderId, orderDate: enddate, segid: '1' }) // 第一航段
      this.$refs.orderAby.getCheckFlightSegment({ orderId: params.orderId, orderDate: enddate, segid: '2' }) // 第二航段
      this.$refs.orderAby.getInsuranceInfoData({ ordercode: params.orderCode, startdate: startdate, enddate: enddate }) // 保险信息
      this.$refs.orderAby.getTravelMailData({ orderCode: params.orderCode, page: 1, rows: 20 }) // 行程单信息
      this.$refs.orderAby.getUpgradeData({ orderId: params.orderId }) // 升舱订单列表
      this.$refs.orderAby.getOrderProcessingList({ orderid: params.orderId }) // 订单操作日志
    }
  }
}
</script>

<style scoped lang="scss">

</style>
