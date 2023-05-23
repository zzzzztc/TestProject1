<template>
  <div id="PaymentDetail" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单编号" v-model="filter.ordercode" clearable @keydown.enter.native="getPaymentDetailList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="银行订单号" v-model="filter.paybillno" clearable @keydown.enter.native="getPaymentDetailList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="交易流水号" v-model="filter.payserial" clearable @keydown.enter.native="getPaymentDetailList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="联系人姓名" v-model="filter.username" clearable @keydown.enter.native="getPaymentDetailList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="机票号" v-model="filter.eticketno" clearable @keydown.enter.native="getPaymentDetailList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="PNR" v-model="filter.pnr" clearable @keydown.enter.native="getPaymentDetailList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="支付开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.enddate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="支付截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="payDate"-->
<!--            type="daterange"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            range-separator="至"-->
<!--            start-placeholder="购保开始日期"-->
<!--            end-placeholder="购保截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="支付提交结果" clearable v-model="filter.paystatus">
            <el-option label="未支付" value="0"></el-option>
            <el-option label="支付中" value="1"></el-option>
            <el-option label="支付成功" value="2"></el-option>
            <el-option label="支付失败" value="3"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="国内/国际" clearable v-model="filter.isInter">
            <el-option label="国内" value="0"></el-option>
            <el-option label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单类型" clearable v-model="filter.isFree">
            <el-option v-for="item in orderType" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="乘机人类型" clearable v-model="filter.rs">
            <el-option label="成人" value="0"></el-option>
            <el-option label="儿童" value="1"></el-option>
            <el-option label="婴儿" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道类型" clearable v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getPaymentDetailList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="payment.total === 0" @click="exportPayDetail">导出</el-button>
      </div>
      <div v-if="isColumn" class="search-container clearfix">
        <div class="check-item check-ipt">
          <el-checkbox @change="checkHanler" v-model="checkedAll" :indeterminate="isIndeterminate">全选</el-checkbox>
        </div>
        <div class="check-item check-ipt" v-for="item in checkList" :key="item.key">
          <el-checkbox-group v-model="checked" @change="handleCheck">
            <el-checkbox  :label="item.key" :key="item.key" @change="handleoneCheck(item.key)">{{item.label}}</el-checkbox>
          </el-checkbox-group>
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
          :data="payment.rows"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :height="dataViewHeight"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column key="1" v-if="tableList.username" label="联系姓名" prop="username" min-width="100"></el-table-column>
          <el-table-column key="2" v-if="tableList.mobile" label="联系电话" prop="mobile" min-width="120"></el-table-column>
          <el-table-column key="3" v-if="tableList.ordercode" label="订单号" min-width="160">
            <template slot-scope="scope">
              <div class="active-text" @click="switchDialog(1, scope.row)">
                {{scope.row.ordercode}}
              </div>
            </template>
          </el-table-column>
          <el-table-column key="4" v-if="tableList.channel" label="渠道类型" min-width="100">
            <template slot-scope="scope">
              {{scope.row.channel | channelMap}}
            </template>
          </el-table-column>
          <el-table-column key="5" v-if="tableList.isInter" label="国内/国际" min-width="100" prop="isInter">
            <template slot-scope="scope">
              <span v-if="scope.row.isInter === '0'">国内</span>
              <span v-if="scope.row.isInter === '1'">国际</span>
            </template>
          </el-table-column>
          <el-table-column key="6" v-if="tableList.paystate" label="支付方式" width="120">
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.paytype | payTypeMap }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column key="7" v-if="tableList.paybillno" label="银行订单号" prop="paybillno" min-width="180"></el-table-column>
          <el-table-column key="8" v-if="tableList.payserial" label="交易流水号" prop="payserial" min-width="260"></el-table-column>
          <el-table-column key="9" v-if="tableList.bankName" label="支付银行" prop="bankName" min-width="160"></el-table-column>
          <el-table-column key="10" v-if="tableList.accno" label="支付卡号" prop="accno" min-width="260"></el-table-column>
          <el-table-column key="11" v-if="tableList.paymoney" label="支付金额" prop="paymoney" min-width="100">
            <template slot-scope="scope">
              {{scope.row.paymoney | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column key="15" v-if="tableList.walletAmount" label="钱包支付金额" prop="walletAmount"></el-table-column>
          <el-table-column key="12" v-if="tableList.remark" label="备注" prop="remark"></el-table-column>
          <el-table-column key="13" v-if="tableList.paydate" label="支付时间" prop="paydate" min-width="160"></el-table-column>
          <el-table-column key="14" v-if="tableList.paystatus" label="支付结果" prop="paystatus" min-width="120">
            <template slot-scope="scope">
              {{scope.row.paystatus | payStatusMap }}
            </template>
          </el-table-column>
          <el-table-column min-width="90" label="操作" v-if="checked.length">
            <template slot-scope="scope">
              <span class="inl-block active-text" @click="switchDialog(0, scope.row)">详情</span>
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
        :total="payment.total">
       </el-pagination>
    </div>
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogDetail" width="600px">
        <div class="dialog-container">
          <div class="dialog-main">
            <div class="row">
              <span class="form-label">联系人姓名</span>
              <span class="form-value">{{currentItem.username}}</span>
            </div>
            <div class="row">
              <span class="form-label">联系人手机</span>
              <span class="form-value">{{currentItem.mobile}}</span>
            </div>
            <div class="row">
              <span class="form-label">订单号</span>
              <span class="form-value">{{currentItem.ordercode}}</span>
            </div>
            <div class="row">
              <span class="form-label">国内/国际</span>
              <span class="form-value">{{currentItem.isInter === '0' ? '国内' : '国际'}}</span>
            </div>
            <div class="row">
              <span class="form-label">支付金额</span>
              <span class="form-value">{{currentItem.paymoney}}</span>
            </div>
            <div class="row">
              <span class="form-label">钱包支付金额</span>
              <span class="form-value">{{currentItem.walletAmount}}</span>
            </div>
            <div class="row">
              <span class="form-label">支付方式</span>
              <span class="form-value">{{currentItem.paytype | payTypeMap}}</span>
            </div>
            <div class="row">
              <span class="form-label">支付方式</span>
              <span class="form-value">{{currentItem.paytype | payTypeMap}}支付</span>
            </div>
            <div class="row">
              <span class="form-label">支付银行</span>
              <span class="form-value">{{currentItem.bankName}}</span>
            </div>
            <div class="row">
              <span class="form-label">银行订单号</span>
              <span class="form-value">{{currentItem.paybillno}}</span>
            </div>
            <div class="row">
              <span class="form-label">交易流水号</span>
              <span class="form-value">{{currentItem.payserial}}</span>
            </div>
            <div class="row">
              <span class="form-label">支付提交时间</span>
              <span class="form-value">{{currentItem.paydate}}</span>
            </div>
            <div class="row">
              <span class="form-label">支付返回时间</span>
              <span class="form-value">{{currentItem.paytime}}</span>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--订单信息弹出框-->
    <OrderDetail ref="orderAby" :orderDetilList="orderDetilList" @tableList="getPaymentDetailList"></OrderDetail>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelList, getCurrentDate, excelList, getRouteName } from '../../../utils/index'
import { fetchList } from './api.js'
import OrderDetail from '../../../components/orderDetail'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'PaymentDetail',
  data () {
    return {
      componentName: 'paymentDetail',
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        walletAmount: false,
        username: true,
        mobile: false,
        ordercode: true,
        channel: true,
        isInter: true,
        // paytype: false,
        paystate: false,
        paybillno: true,
        payserial: false,
        bankName: false,
        accno: false,
        paymoney: true,
        remark: true,
        paydate: false,
        paystatus: false
      },
      filter: {
        sourceid: 'sdal',
        startdate: '',
        enddate: ''
      },
      loading: false,
      dataViewHeight: null,
      payDate: [],
      payment: {},
      dialogDetail: false,
      dialogTitle: '',
      currentItem: {},
      orderDetilList: {}
    }
  },
  created () {
    this.judgeChannelList()
    this.initDate()
    this.getPaymentDetailList(1, this.pagination.pageSize)
    // this.locCheck()
  },
  mixins: [checkAttrs, computWidth],
  components: {
    OrderDetail
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
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    initDate () {
      this.payDate = [getCurrentDate(0), getCurrentDate(0)]
      this.filter.startdate = this.payDate[0]
      this.filter.enddate = this.payDate[1]
    },
    // 获取列表数据
    getPaymentDetailList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.payment = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        startdate: '',
        enddate: ''
      }
      this.initDate()
      this.getPaymentDetailList(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getPaymentDetailList(null, pages)
    },
    handleCurrentChange (page) {
      this.getPaymentDetailList(page, null)
    },
    // 导出
    exportPayDetail () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = 'pay/exportAccountPayList'
      let name = getRouteName('/paymentDetail')
      let type = 'xls'
      data.start = 1
      data.end = this.payment.total
      delete data.page
      delete data.rows
      // let total = this.payment.total
      let obj = {
        data,
        url,
        name,
        type
      }
      excelList(obj, this)
    },
    switchDialog (type, params) {
      if (type === 0) {
        // 详情弹框
        this.dialogDetail = true
        this.dialogTitle = '支付明细详情'
        this.currentItem = params
      } else {
        // 订单详情弹框
        let enddate = params.paydate.split(' ')[0]
        let paydate = enddate.replace(/-/g, '')
        this.orderDetilList = {
          orderVisible: true,
          dialogTitle: '机票订单详情数据',
          type: 'payDetail',
          payserial: params.payserial,
          payId: params.paybillno
        }
        // console.log(params)
        this.$refs.orderAby.getOrderData({ orderId: params.accid, orderDate: paydate }) // 订单信息
        this.$refs.orderAby.getFirstPassageData({ orderId: params.accid, orderDate: paydate, segid: '1' }) // 第一航段乘客
        this.$refs.orderAby.getUpgradeData({ orderId: params.accid }) // 升舱订单列表
        this.$refs.orderAby.getCheckFlightSegment({ orderId: params.accid, orderDate: paydate, segid: '2' }) // 第二航段
        // this.$refs.orderAby.getInsuranceInfoData({ ordercode: params.ordercode }) // 保险信息
        // this.$refs.orderAby.getTravelMailData({ orderCode: params.ordercode, page: 1, rows: 20 }) // 行程单信息
        // this.$refs.orderAby.getOrderProcessingList({ orderid: params.accid }) // 订单操作日志
      }
    }
  }
}
</script>

<style scoped>

</style>
