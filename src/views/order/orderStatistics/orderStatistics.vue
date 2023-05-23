<template>
  <!--<div>订单管理</div>-->
  <div class="container" id="QueryOrder">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="订单编号" v-model="filter.orderCode" @keydown.enter.native="getOrderList()"></el-input>
        </div>
        <div class="search-item ">
          <el-date-picker
            class="date-picker-380"
            size="medium"
            v-model="orderDate"
            :clearable="false"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="订单起始日期"
            end-placeholder="订单截止日期"
            align="right">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="旅客姓名" v-model="filter.passengerName" @keydown.enter.native="getOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.passengerType" placeholder="客户类型" clearable @keydown.enter.native="getOrderList()">
            <el-option label="普通会员" value="0"></el-option>
            <el-option label="常旅客" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="客户姓名" v-model="filter.userName" @keydown.enter.native="getOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="客户编号" v-model="filter.passengerCode" @keydown.enter.native="getOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="联系人手机" v-model="filter.mobile" @keydown.enter.native="getOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="票号" v-model="filter.ticketCode" @keydown.enter.native="getOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="PNR" v-model="filter.pnr" @keydown.enter.native="getOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="银行订单号" v-model="filter.paybillno" @keydown.enter.native="getOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="优惠券编码" v-model="filter.couponCode" @keydown.enter.native="getOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="订单状态" v-model="filter.orderStatus">
            <el-option label="已订座" value="1"></el-option>
            <el-option label="已出票" value="2"></el-option>
            <el-option label="已取消" value="4"></el-option>
            <el-option label="出票失败" value="3"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="支付状态" v-model="filter.orderPayStatus">
            <el-option label="未支付" value="0"></el-option>
            <el-option label="支付中" value="1"></el-option>
            <el-option label="支付成功" value="2"></el-option>
            <el-option label="支付失败" value="3"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="渠道" v-model="filter.isWeb">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="国内/国际" v-model="filter.isInter">
            <el-option label="国内" value="0"></el-option>
            <el-option label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="是否有保险" v-model="filter.isInsurance">
            <el-option label="无" value="0"></el-option>
            <el-option label="有" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="订单类型" v-model="filter.isFree">
            <el-option v-for="item in orderType" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="市场方" v-model="filter.airways" @keydown.enter.native="getOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="承运方" v-model="filter.airline" @keydown.enter.native="getOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="乘机人类型" v-model="filter.passerType">
            <el-option label="成人" value="0"></el-option>
            <el-option label="儿童" value="1"></el-option>
            <el-option label="婴儿" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="是否空轨订单" v-model="filter.isAirrAilway">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getOrderList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" @click="exportOrderInfo" :disabled="orderList.total === 0">导出</el-button>
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
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="orderList.rows"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          :height="dataViewHeight">
          <el-table-column key="1" label="订单编号" v-if="tableList.orderCode" min-width="180">
            <template slot-scope="scope">
              <div class="active-text" @click="switchDialog(scope.row)">{{scope.row.orderCode}}</div>
            </template>
          </el-table-column>
          <el-table-column key="2" label="PNR" prop="pnr" min-width="120" v-if="tableList.pnr"></el-table-column>
          <el-table-column key="3" label="市场方" v-if="tableList.airways" prop="airways" min-width="100"></el-table-column>
          <el-table-column key="4" label="承运方" v-if="tableList.airline" prop="airline" min-width="100"></el-table-column>
          <el-table-column ley="5" label="产品名称" v-if="tableList.productName" prop="productName" min-width="160"></el-table-column>
          <el-table-column key="6" label="航班号" v-if="tableList.allFnumber" prop="allFnumber" min-width="120"></el-table-column>
          <el-table-column key="7" label="航段" v-if="tableList.allSail" prop="allSail" min-width="120"></el-table-column>
          <!--<el-table-column label="舱位" prop="seat" min-width="100"></el-table-column>-->
          <el-table-column key="8" label="票面价" v-if="tableList.allFare" prop="allFare" min-width="100"></el-table-column>
          <el-table-column key="9" label="机建" v-if="tableList.allairportTax" prop="allairportTax" min-width="100"></el-table-column>
          <el-table-column key="10" label="燃油" v-if="tableList.allfuelTax" prop="allfuelTax" min-width="100"></el-table-column>
          <el-table-column key="11" label="保险金额" v-if="tableList.insuranceTotalPrice" prop="insuranceTotalPrice" min-width="100"></el-table-column>
          <el-table-column key="12" label="国际票总税" v-if="tableList.taxPrice" prop="taxPrice" min-width="120"></el-table-column>
          <el-table-column key="13" label="支付金额" prop="paymoney" v-if="tableList.paymoney" min-width="120"></el-table-column>
          <el-table-column key="25" label="附加商品金额" prop="productMoney" v-if="tableList.productMoney" min-width="120"></el-table-column>
          <el-table-column key="14" label="积分值" v-if="tableList.integralValue" prop="integralValue" min-width="120"></el-table-column>
          <el-table-column key="15" label="订单时间" v-if="tableList.creadate" prop="creadate" min-width="160"></el-table-column>
          <el-table-column key="16" label="订单状态" v-if="tableList.orderStatus" prop="orderStatus" min-width="160"></el-table-column>
          <el-table-column key="17" label="订单类型" v-if="tableList.orderType" prop="orderType" min-width="140"></el-table-column>
          <el-table-column key="18" label="支付状态" v-if="tableList.orderPayStatus" prop="orderPayStatus" min-width="140"></el-table-column>
          <el-table-column key="19" label="联系人" v-if="tableList.userName" prop="userName" min-width="140"></el-table-column>
          <el-table-column key="20" label="联系电话" v-if="tableList.mobile" prop="mobile" min-width="140"></el-table-column>
          <el-table-column key="21" label="客户类型" v-if="tableList.passengerType" prop="passengerType" min-width="100"></el-table-column>
          <el-table-column key="22" label="客户编号" v-if="tableList.passengerCode" prop="passengerCode" min-width="120"></el-table-column>
          <el-table-column key="23" label="订单来源" min-width="120" v-if="tableList.channel" prop="channel"></el-table-column>
          <el-table-column key="24" label="国内国际" v-if="tableList.isInter" min-width="102" prop="isInter"></el-table-column>
          <el-table-column key="24" label="红包金额" v-if="tableList.walletMoney" min-width="102" prop="walletMoney"></el-table-column>
          <el-table-column label="操作" min-width="160" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-20" @click="handleConfirm(scope.row.orderId, scope.row.pnr)">重订PNR</span>
              <span class="active-text mr-20" @click="switchDialog(scope.row)">查看详情</span>
              <span class="active-text mr-5" v-if="scope.row.railwayMoney > '0'" @click="switchSubway(scope.row.orderCode)">地铁详情</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="clearfix">
        <div class="fl">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filter.page"
            :page-sizes="pagination.pageSizes"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="orderList.total">
          </el-pagination>
        </div>
        <div class="statistics-info fr mr-10">
          <span>机票总数:</span>
          <span class="danger-text ml-5 mr-5">{{orderStatistics.tickedCount}}</span>
          <span class="mr-20">张</span>
          <span>交易总额:</span>
          <span class="danger-text ml-5 mr-5">{{orderStatistics.allmoney | formatPriceMap}}</span>
          <span>元</span>
        </div>
      </div>
    </div>
    <!--订单信息弹出框-->
    <OrderDetail @upgrad="switchD" ref="orderAby" :orderDetilList="orderDetilList" @tableList="getOrderList"></OrderDetail>
    <!--铁路信息弹出框-->
    <SubwayDetailDiaLog ref="subWayAby"></SubwayDetailDiaLog>
    <!--同步商品详情 -->
    <div v-if="productVisible">
      <el-dialog :visible.sync="productVisible" title="附加商品详情">
        <div class="dialog-container">
          <div class="dialog-main">
            <sync-product-info :orderId="orderId"></sync-product-info>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import OrderDetail from '../../../components/orderDetail'
import SubwayDetailDiaLog from '../../../components/subwayDetailDiaLog'
import SyncProductInfo from '../../../components/syncProductInfo'
import { filterIds, getChannelList, getCurrentDate, excelList, judgeOrderType, getRouteName } from '../../../utils/index'
import { fetchList, reorderPnr, orderInfoStatistics } from './api'
import * as types from '../../../filters/index'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'QueryOrder',
  data () {
    return {
      filter: {
        orderCode: '',
        orderQsrq: '',
        orderZzrq: '',
        passengerName: '',
        passengerType: '',
        userName: '',
        passengerCode: '',
        mobile: '',
        ticketCode: '',
        pnr: '',
        paybillno: '',
        couponCode: '',
        orderStatus: '',
        orderPayStatus: '',
        isWeb: '',
        isInter: '',
        isInsurance: '',
        isFree: '',
        airways: '',
        airline: '',
        passerType: '',
        isAirrAilway: '',
        page: 1,
        rows: 20
      },
      loading: false,
      dataViewHeight: null,
      orderDate: [],
      orderList: {}, // table数据
      // currentItem: {}, // 当前选中列
      orderStatistics: {}, // 统计数据
      orderDetilList: {},
      multipleSelection: [],
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        productMoney: false,
        allairportTax: false,
        allfuelTax: false,
        airways: false,
        airline: false,
        productName: false,
        allFnumber: false,
        allSail: false,
        allFare: false,
        insuranceTotalPrice: false,
        taxPrice: false,
        integralValue: false,
        creadate: false,
        orderStatus: false,
        orderType: false,
        orderPayStatus: false,
        userName: false,
        mobile: false,
        passengerType: false,
        passengerCode: false,
        isInter: false,
        orderCode: true,
        pnr: true,
        paymoney: true,
        channel: true,
	      walletMoney: false
      }, //  表格展示的数据
      componentName: 'queryOrder',
      productVisible: false,
      orderId: null
    }
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getOrderList(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  components: {
    SubwayDetailDiaLog,
    OrderDetail,
    SyncProductInfo
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
    // 查看同步商品详情
    getSyncProductInfo (id) {
      this.productVisible = true
      this.orderId = id
    },
    //  改期二次弹窗
    switchD (params) {
      let startdate = this.filter.orderQsrq
      let enddate = params.creadate.split(' ')[0]
      let orderDate = enddate.replace(/-/g, '')
      this.orderDetilList = {
        orderVisible: true,
        dialogTitle: '机票订单详细信息',
        upgrad: '1'
      }
      this.$refs.orderAby.getOrderData({ orderId: params.orderid, orderDate: orderDate }) // 订单信息
      this.$refs.orderAby.getFirstPassageData({ orderId: params.orderid, orderDate: orderDate, segid: '1' }) // 第一航段
      this.$refs.orderAby.getCheckFlightSegment({ orderId: params.orderid, orderDate: orderDate, segid: '2' }, '1') // 第二航段
      this.$refs.orderAby.getInsuranceInfoData({ ordercode: params.ordercode, startdate: startdate, enddate: enddate }) // 保险信息
      this.$refs.orderAby.getTravelMailData({ orderCode: params.ordercode, page: 1, rows: 20 }) // 行程单信息
      this.$refs.orderAby.getOrderProcessingList({ orderid: params.orderid }) // 订单操作日志
    },
    initDate () {
      this.orderDate = [getCurrentDate(0), getCurrentDate(0)]
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 获取订单数据
    getOrderList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.judgeFilterDate()
      fetchList(this.filter).then(res => {
        this.orderList = res
        for (let i = 0; i < this.orderList.rows.length; i++) {
          this.orderList.rows[i].allSail = types.sailMap(this.orderList.rows[i].allSail)
          this.orderList.rows[i].allFare = types.formatPriceMap(this.orderList.rows[i].allFare)
          this.orderList.rows[i].insuranceTotalPrice = types.formatPriceMap(this.orderList.rows[i].insuranceTotalPrice)
          this.orderList.rows[i].taxPrice = types.formatPriceMap(this.orderList.rows[i].taxPrice)
          this.orderList.rows[i].paymoney = types.formatPriceMap(this.orderList.rows[i].paymoney)
          this.orderList.rows[i].orderStatus = types.outTicketStatusMap(this.orderList.rows[i].orderStatus)
          if (this.orderList.rows[i].orderStatus === '出票失败') {
            this.orderList.rows[i].orderStatus = this.orderList.rows[i].orderStatus + '(' + this.orderList.rows[i].orderType + ')'
          }
          this.orderList.rows[i].orderPayStatus = types.payStatusMap(this.orderList.rows[i].orderPayStatus)
          this.orderList.rows[i].passengerType = this.orderList.rows[i].passengerType === '0' ? '普通会员' : '常旅客'
          this.orderList.rows[i].channel = types.channelMap(this.orderList.rows[i].channel)
          this.orderList.rows[i].isInter = this.orderList.rows[i].isInter === '0' ? '国内' : '国际'
          this.orderList.rows[i].orderType = /^\d+$/.test(this.orderList.rows[i].orderType) ? judgeOrderType(this.orderList.rows[i].orderType) : this.orderList.rows[i].orderType
        }
        this.loading = false
        this.getOrderInfoStatistics()
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 获取订单统计数据
    getOrderInfoStatistics () {
      let data = JSON.parse(JSON.stringify(this.filter))
      delete data.page
      delete data.rows
      orderInfoStatistics(data).then(res => {
        this.orderStatistics = res.obj
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 判断过滤时间
    judgeFilterDate () {
      if (this.orderDate.length) {
        this.filter.orderQsrq = this.orderDate[0]
        this.filter.orderZzrq = this.orderDate[1]
      } else {
        delete this.filter.orderQsrq
        delete this.filter.orderZzrq
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 重置
    resetFilter () {
      this.initDate()
      this.filter = {
        orderCode: '',
        orderQsrq: '',
        orderZzrq: '',
        passengerName: '',
        passengerType: '',
        userName: '',
        passengerCode: '',
        mobile: '',
        ticketCode: '',
        pnr: '',
        paybillno: '',
        couponCode: '',
        orderStatus: '',
        orderPayStatus: '',
        isWeb: '',
        isInter: '',
        isInsurance: '',
        isFree: '',
        airways: '',
        airline: '',
        passerType: '',
        isAirrAilway: '',
        page: 1,
        rows: 20
      }
      this.getOrderList(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getOrderList(null, pages)
    },
    handleCurrentChange (page) {
      this.getOrderList(page, null)
    },
    // 重订pnr
    handleConfirm (id, pnr) {
      let ids = id || filterIds(this.multipleSelection, 'orderId').join(',')
      let pnrs = pnr || filterIds(this.multipleSelection, 'pnr').join(',')
      this.$confirm('是否确定重订PNR ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleReOrderPnr(ids, pnrs)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    handleReOrderPnr (id, pnr) {
      reorderPnr({ orderId: id, PNR: pnr }).then(() => {
        this.$message.success('操作成功')
        this.getOrderList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 切换弹框
    switchDialog (params) {
      let startdate = this.filter.orderQsrq
      let enddate = params.creadate.split(' ')[0]
      let orderDate = enddate.replace(/-/g, '')
	    // console.log('点击详情传参',params.proOrderId)
      this.orderDetilList = {
        orderVisible: true,
        dialogTitle: '机票订单详细信息'
      }
      this.$refs.orderAby.getOrderData({ orderId: params.orderId, orderDate: orderDate }) // 订单信息
      this.$refs.orderAby.getFirstPassageData({ orderId: params.orderId, orderDate: orderDate, segid: '1' }) // 第一航段
      this.$refs.orderAby.getCheckFlightSegment({ orderId: params.orderId, orderDate: orderDate, segid: '2' }) // 第二航段
      this.$refs.orderAby.getInsuranceInfoData({ ordercode: params.orderCode, startdate: startdate, enddate: enddate }) // 保险信息
      this.$refs.orderAby.getTravelMailData({ orderCode: params.orderCode, page: 1, rows: 20 }) // 行程单信息
      this.$refs.orderAby.getUpgradeData({ orderId: params.orderId }) // 升舱订单列表
      this.$refs.orderAby.getOrderProcessingList({ orderid: params.orderId }) // 订单操作日志
      this.$refs.orderAby.getKSeatList({ pnr: params.pnr }) // K座位记录
      this.$refs.orderAby.queryRefund({ orderCode: params.orderCode })
      if (params.proOrderId) {
        this.$refs.orderAby.queryProductInfoByOrderId(params.orderId) // 附加商品详情
      } else {
	      this.$refs.orderAby.queryProductInfoReset() // 重置附加商品详情
      }
    },

    switchSubway (code) {
      this.$refs.subWayAby.initComponent({ orderCode: code }) // 订单信息
    },
    // 导出
    exportOrderInfo () {
      let data = JSON.parse(JSON.stringify(this.filter))
      delete data.page
      delete data.rows
      data.start = 1
      data.end = this.orderList.total
      let url = 'order/exportOrderInfoList'
      let name = getRouteName('/queryOrder')
      let type = 'csv'
      let obj = {
        data,
        url,
        name,
        type
      }
      excelList(obj)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
