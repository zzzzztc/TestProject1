<template>
  <!--<div>退票二审</div>-->
  <div id="RefundAuditTwo" class="container">
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
            <el-option label="一审通过" value="2"></el-option>
            <el-option label="二审拒绝" value="5"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.enddate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请开始日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="applyDate"-->
<!--            type="daterange"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            range-separator="至"-->
<!--            start-placeholder="申请起始日期"-->
<!--            end-placeholder="申请截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
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
          <el-select size="medium" placeholder="自愿/非自愿" v-model="filter.nature">
            <el-option label="非自愿" value="0"></el-option>
            <el-option label="自愿" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="是否病退" v-model="filter.changeSelect" clearable>
            <el-option label="病退" value="1"></el-option>
            <el-option label="非病退" value="2"></el-option>
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
          <el-select size="medium" placeholder="行程单是否需回收" v-model="filter.printFlag" clearable>
            <el-option value="1" label="是"></el-option>
            <el-option value="2" label="否"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getAchangeList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="achangeList.total === 0" @click="exportPayDetail">导出</el-button>
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
          :data="achangeList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column key="1" label="订单日期" v-if="tableList.orderdate" prop="orderdate" min-width="160"></el-table-column>
          <el-table-column key="2" label="订单号" v-if="tableList.ordercode" prop="ordercode" min-width="180"></el-table-column>
          <el-table-column key="3" label="PNR" v-if="tableList.pnr" prop="pnr" min-width="100"></el-table-column>
          <el-table-column key="4" label="市场方" v-if="tableList.airways" prop="airways" min-width="100"></el-table-column>
          <el-table-column key="5" label="承运方" v-if="tableList.airline" prop="airline" min-width="100"></el-table-column>
          <el-table-column key="6" label="渠道类型" v-if="tableList.channel" min-width="120" prop="channel"></el-table-column>
          <el-table-column key="7" label="航段" v-if="tableList.sail" prop="sail" min-width="100"></el-table-column>
          <el-table-column key="8" label="旧票号" v-if="tableList.initialTktNo" prop="initialTktNo" min-width="180"></el-table-column>
          <el-table-column key="9" label="票号" v-if="tableList.eticketno" prop="eticketno" min-width="180"></el-table-column>
          <el-table-column key="10" label="旅客姓名" v-if="tableList.name" prop="name" min-width="100"></el-table-column>
          <el-table-column key="11" label="航班号" v-if="tableList.fnumber" prop="fnumber" min-width="100"></el-table-column>
          <el-table-column key="12" label="航意险" v-if="tableList.unexoInsr" prop="unexoInsr" min-width="100"></el-table-column>
          <el-table-column key="13" label="航延险" v-if="tableList.delayInsr" prop="delayInsr" min-width="100"></el-table-column>
          <el-table-column key="14" label="支付金额" v-if="tableList.paymoney" prop="paymoney" min-width="100"></el-table-column>
          <el-table-column key="15" label="附加商品金额" v-if="tableList.productMoney" prop="productMoney" min-width="120"></el-table-column>
          <el-table-column key="16" label="应退金额" v-if="tableList.actualRefundMoney" prop="actualRefundMoney" min-width="90"></el-table-column>
          <el-table-column key="17" label="支付积分" v-if="tableList.integralFare" prop="integralFare" min-width="100"></el-table-column>
          <el-table-column key="18" label="银行订单号" v-if="tableList.paybillno" prop="paybillno" min-width="180"></el-table-column>
          <el-table-column key="19" label="退票单号" v-if="tableList.refundNo" prop="refundNo" min-width="180"></el-table-column>
          <el-table-column key="20" label="退票性质" v-if="tableList.nature" min-width="100" prop="nature"></el-table-column>
          <el-table-column key="21" label="微信退款单号" v-if="tableList.wxrefundNo" min-width="120" prop="wxrefundNo"></el-table-column>
          <el-table-column key="22" label="退款失败原因" v-if="tableList.failReason" min-width="120" prop="failReason"></el-table-column>
          <el-table-column key="23" label="退票状态" v-if="tableList.tstatus" min-width="140" prop="tstatus"></el-table-column>
          <el-table-column key="30" label="二审拒绝原因" v-if="tableList.secondAuditReason" min-width="120" prop="secondAuditReason"></el-table-column>
          <el-table-column key="31" label="退票证明" v-if="tableList.picUrl" min-width="100">
            <template slot-scope="scope">
              <div class="link" size="mini"
                   @click="showPic(item)"
                   :title="item"
                   v-for="(item, index) in scope.row.imgList"
                   :key="item">退票证明({{ index + 1 }})</div>
            </template>
          </el-table-column>
          <el-table-column key="28" label="一审审核人" v-if="tableList.firstAuditOpid" prop="firstAuditOpid" min-width="120"></el-table-column>
          <el-table-column key="29" label="一审审核时间" v-if="tableList.firstAuditDate" prop="firstAuditDate" min-width="120"></el-table-column>
          <el-table-column key="24" label="国内/国际" v-if="tableList.isinter" min-width="100" prop="isinter"></el-table-column>
          <el-table-column key="25" label="申请退票时间" v-if="tableList.happendate" prop="happendate" min-width="160"></el-table-column>
          <el-table-column key="26" label="行程单是否需回收" v-if="tableList.printFlag" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.isprint === '1'">是</div>
              <div v-else>否</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="walletMoney"
            label="红包金额"
            v-if="tableList.walletMoney"
          >
          </el-table-column>
          <el-table-column
            prop="walletMoney"
            label="红包退款"
            v-if="tableList.actualRefundWallet"
          >
          </el-table-column>
          <el-table-column
            prop="refundWalletCharge"
            label="红包手续费"
            min-width="100"
            v-if="tableList.refundWalletCharge"
          >
          </el-table-column>
          <el-table-column key="33" label="疫情隔离险" v-if="tableList.epidemicInsr" prop="epidemicInsr" min-width="140"></el-table-column>
          <el-table-column key="34" label="航空退票险" v-if="tableList.refundTicketInsr" prop="refundTicketInsr" min-width="140"></el-table-column>
          <el-table-column key="27" label="操作" min-width="160" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" v-if="scope.row.status === '2' || scope.row.status === '5'" @click="switchDialog('second', 1, scope.row)">退票审核</span>
              <span class="active-text mr-5" v-else @click="switchDialog('detail',1, scope.row, scope.row.nature)">查看详情</span>
              <span class="active-text mr-5" @click="switchDialog('second', 0, scope.row)">审核记录</span>
              <!--<span class="active-text mr-5" v-if="scope.row.productCount && parseInt(scope.row.productCount)" @click="getSyncProductInfo(scope.row.ticketid)">附加商品详情</span>-->
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
        :total="achangeList.total">
       </el-pagination>
    </div>
    <!--审核记录-->
    <!--退票审核-->
    <div>
      <RefundDiaLog ref="refundAby" :changeSelect.sync="changeSelect" @tableList="closeDialog"></RefundDiaLog>
    </div>
    <!--同步商品详情 -->
    <div v-if="productVisible">
      <el-dialog :visible.sync="productVisible" title="附加商品详情">
        <div class="dialog-container">
          <div class="dialog-main">
            <sync-product-info :ticketId="ticketId"></sync-product-info>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RefundDiaLog from '../../../components/refundDiaLog'
import SyncProductInfo from '../../../components/syncProductInfo'
import { getChannelList, getCurrentDate, excelList, getRouteName } from '../../../utils'
import { fetchList } from './api'
import * as types from '../../../filters/index'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'RefundAuditTwo',
  data () {
    return {
      componentName: 'refundAuditTwo',
      loading: false,
      filter: {
        ticStatus: '2',
        startdate: '',
        enddate: '',
        printFlag: '2'
      },
      applyDate: [],
      dataViewHeight: null,
      achangeList: {},
      refundAuditList: {},
      dialogVisible: false,
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        productMoney: false,
        actualRefundMoney: false,
        airways: false,
        airline: false,
        initialTktNo: false,
        name: false,
        fnumber: false,
        unexoInsr: false,
        delayInsr: false,
        integralFare: false,
        paybillno: false,
        refundNo: false,
        nature: false,
        isinter: false,
        happendate: false,
        orderdate: true,
        ordercode: true,
        pnr: true,
        channel: true,
        firstAuditOpid: false,
        firstAuditDate: false,
	      secondAuditOpname: false,
	      secondAuditAccount: false,
        sail: true,
        eticketno: true,
        tstatus: true,
        paymoney: true,
        wxrefundNo: false,
        failReason: false,
        printFlag: false,
        picUrl: false,
        secondAuditReason: false,
        walletMoney: false,
        actualRefundWallet: false,
	      refundWalletCharge: false,
	      epidemicInsr: false,
	      refundTicketInsr: false
      }, //  表格展示的数据
      changeSelect: '',
      productVisible: false,
      ticketId: null
    }
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getAchangeList(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  components: {
    RefundDiaLog,
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
    // 查看退票证明
    showPic (url) {
      window.open(url, '_blank')
    },
    // 查看同步商品详情
    getSyncProductInfo (id) {
      this.productVisible = true
      this.ticketId = id
    },
    // 关闭弹框并刷新页面
    closeDialog () {
      this.getAchangeList()
    },
    exportPayDetail () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = 'refund/exportRefundData'
      let name = getRouteName('/refundAuditTwo')
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
    initDate () {
      let date = getCurrentDate(0)
      this.applyDate = [date, date]
      this.filter.startdate = this.applyDate[0]
      this.filter.enddate = this.applyDate[1]
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 获取数据
    getAchangeList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.achangeList = res
        for (let i = 0; i < this.achangeList.rows.length; i++) {
          let y = this.achangeList.rows[i].happendate.substring(0, 4)
          let m = this.achangeList.rows[i].happendate.substring(4, 6)
          let d = this.achangeList.rows[i].happendate.substring(6, 8)
          this.achangeList.rows[i].happendate = y + '-' + m + '-' + d + ' ' + this.achangeList.rows[i].happendtime
          this.achangeList.rows[i].channel = types.channelMap(this.achangeList.rows[i].channel)
          this.achangeList.rows[i].unexoInsr = types.formatPriceMap(this.achangeList.rows[i].unexoInsr)
          this.achangeList.rows[i].delayInsr = types.formatPriceMap(this.achangeList.rows[i].delayInsr)
          this.achangeList.rows[i].paymoney = types.formatPriceMap(this.achangeList.rows[i].paymoney)
          this.achangeList.rows[i].nature = this.achangeList.rows[i].nature === '0' ? '非自愿' : '自愿'
          this.achangeList.rows[i].tstatus = types.refundStatusMap(this.achangeList.rows[i].status)
          this.achangeList.rows[i].isinter = this.achangeList.rows[i].isinter === '0' ? '国内' : '国外'
          if (this.achangeList.rows[i].picUrl) {
            this.$set(this.achangeList.rows[i], 'imgList', this.achangeList.rows[i].picUrl.split(','))
          } else {
            this.$set(this.achangeList.rows[i], 'imgList', [])
          }
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        ticStatus: '2',
        startdate: '',
        enddate: '',
        printFlag: '2'
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
    switchDialog (val, type, params) {
      this.changeSelect = params.changeSelect
      this.$refs.refundAby.initComponent({
        refundType: val,
        operateType: type,
        id: params.id,
        nature: params.nature,
        isairrailway: params.isairrailway,
        payAmount: params.payAmount,
        ticketid: params.ticketid,
        involCardId: params.involCardId
      })
    }
  }
}
</script>

<style scoped>

</style>
