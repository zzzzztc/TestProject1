<template>
  <!--<div>退票确认</div>-->
  <div id="RefundConfirm" class="container">
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
            <el-option label="退款完成" value="6"></el-option>
            <el-option label="线下退款完成" value="7"></el-option>
            <el-option label="退款失败" value="8"></el-option>
            <el-option label="退款处理中" value="13"></el-option>
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
          <el-select size="medium" placeholder="支付方式" v-model="filter.paytype" clearable>
            <el-option v-for="item in payPlatform" :key="item.id" :value="item.value" :label="item.label"></el-option>
          </el-select>
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
          <el-input size="medium" placeholder="退款批次号" v-model="filter.refundBatchNo" clearable @keydown.enter.native="getAchangeList()"></el-input>
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
        <el-button size="medium" type= 'danger' :disabled='dataArr.length === 0' @click="ticktMoney()">批量退款</el-button>
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
          @selection-change='handleSelectionChange'
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column type='selection' v-if="checked"></el-table-column>
          <el-table-column label="订单日期" v-if="tableList.orderdate" prop="orderdate" min-width="160"></el-table-column>
          <el-table-column label="订单号" v-if="tableList.ordercode" prop="ordercode" min-width="160"></el-table-column>
          <el-table-column label="PNR" v-if="tableList.pnr" prop="pnr" min-width="100"></el-table-column>
          <el-table-column label="市场方" v-if="tableList.airways" prop="airways" min-width="100"></el-table-column>
          <el-table-column label="承运方" v-if="tableList.airline" prop="airline" min-width="100"></el-table-column>
          <el-table-column label="销售渠道" v-if="tableList.channel" min-width="120" prop="channel"></el-table-column>
          <el-table-column label="航段" v-if="tableList.sail" prop="sail" min-width="100"></el-table-column>
          <el-table-column label="旧票号" v-if="tableList.initialTktNo" prop="initialTktNo" min-width="160"></el-table-column>
          <el-table-column label="票号" v-if="tableList.eticketno" prop="eticketno" min-width="160"></el-table-column>
          <el-table-column label="旅客姓名" v-if="tableList.name" prop="name" min-width="160"></el-table-column>
          <el-table-column label="航班号" v-if="tableList.fnumber" prop="fnumber" min-width="100"></el-table-column>
          <el-table-column label="航意险" v-if="tableList.unexoInsr" prop="unexoInsr" min-width="100"></el-table-column>
          <el-table-column label="航延险" v-if="tableList.delayInsr" prop="delayInsr" min-width="100"></el-table-column>
          <el-table-column label="优惠金额" v-if="tableList.fmoney" prop="fmoney"></el-table-column>
          <el-table-column label="支付金额" v-if="tableList.paymoney" prop="paymoney" min-width="100"></el-table-column>
          <el-table-column label="附加商品金额" v-if="tableList.productMoney" prop="productMoney" min-width="120"></el-table-column>
          <el-table-column label="应退金额" v-if="tableList.actualRefundMoney" prop="actualRefundMoney" min-width="90"></el-table-column>
          <el-table-column label="支付积分" v-if="tableList.integralFare" prop="integralFare" min-width="100"></el-table-column>
          <el-table-column label="支付方式" v-if="tableList.paytype" prop="paytype" min-width="100"></el-table-column>
          <el-table-column label="银行订单号" v-if="tableList.paybillno" prop="paybillno" min-width="180"></el-table-column>
          <el-table-column label="退款银行订单号" v-if="tableList.outRefundNo" prop="outRefundNo" min-width="180"></el-table-column>
          <el-table-column label="退票单号" v-if="tableList.refundNo" prop="refundNo" min-width="160"></el-table-column>
          <el-table-column label="退票性质" v-if="tableList.nature" min-width="100" prop="nature"></el-table-column>
          <el-table-column label="退票状态" v-if="tableList.tstatus" min-width="100" prop="tstatus"></el-table-column>
          <el-table-column label="二审审核人" v-if="tableList.secondAuditOpid" prop="secondAuditOpid" min-width="120"></el-table-column>
          <el-table-column label="二审审核时间" v-if="tableList.secondAuditDate" prop="secondAuditDate" min-width="120"></el-table-column>
          <el-table-column label="退款失败原因" v-if="tableList.failReason" prop="failReason" min-width="200"></el-table-column>
          <el-table-column label="国内/国际" v-if="tableList.isinter" min-width="100" prop="isinter"></el-table-column>
          <el-table-column label="退票申请时间" v-if="tableList.happendate" min-width="160" prop="happendate"></el-table-column>
          <el-table-column label="退票审核时间" v-if="tableList.cresdatetime" prop="cresdatetime" min-width="160"></el-table-column>
          <el-table-column label="财务退款时间" v-if="tableList.creqdatetime" prop="creqdatetime" min-width="160"></el-table-column>
          <el-table-column label="退积分状态" v-if="tableList.returnIntegralStatus" min-width="110" prop="returnIntegralStatus"></el-table-column>
          <el-table-column label="票面处理状态" v-if="tableList.ticStatusRelation" min-width="110" prop="ticStatusRelation"></el-table-column>
          <el-table-column label="退款批次号" v-if="tableList.refundBatchNo" min-width="110" prop="refundBatchNo"></el-table-column>
          <el-table-column label="行程单是否需回收" v-if="tableList.printFlag" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.isprint === '1'">是</div>
              <div v-else>否</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="walletMoney"
            label="红包金额"
            v-if="tableList.walletMoney"
          ></el-table-column>
          <el-table-column
            prop="actualRefundWallet"
            label="红包退款"
            v-if="tableList.actualRefundWallet"
          ></el-table-column>
          <el-table-column
            prop="refundWalletCharge"
            label="红包手续费"
            v-if="tableList.refundWalletCharge"
          ></el-table-column>
          <el-table-column key="33" label="疫情隔离险" v-if="tableList.epidemicInsr" prop="epidemicInsr" min-width="140"></el-table-column>
          <el-table-column key="34" label="航空退票险" v-if="tableList.refundTicketInsr" prop="refundTicketInsr" min-width="140"></el-table-column>
          <el-table-column label="操作" min-width="200" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" v-if="scope.row.status === '2' || scope.row.status === '5'" @click="switchDialog('confirm', 1, scope.row)">退票审核</span>
              <span class="again-refund mr-5" v-if="scope.row.status === '8'" @click="refundAgain(scope.row, 1)">重新退款</span>
              <span class="active-text mr-5" v-else-if="scope.row.status === '4'" @click="switchDialog('confirm', 1, scope.row)">退款确认</span>
              <span class="active-text mr-5" v-else @click="switchDialog('confirmDetail', 1, scope.row)">查看详情</span>
              <span class="active-text mr-5" @click="switchDialog('second', 0, scope.row.ticketid)">审核记录</span>
              <span class="active-text mr-5" v-if="scope.row.status === '4' || scope.row.status === '8'" @click="underLineDialog(scope.row)">线下处理</span>
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
    <confirmDiaLog ref="refundAby" :refundAuditList="refundAuditList" @closeRefundDialog="closeDialog"></confirmDiaLog>
    <div>
      <el-dialog :visible.sync="batchVisible" title="退款结果" width="680px">
        <div class="dialog-container" v-loading="dialogLoading">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <span>退款批次号：</span>
                <span>{{ batchRefundNo }}</span>
              </div>
              <div class="column">
                <span>本次处理条数：</span>
                <span>{{ payResList.length }}</span>
              </div>
              <div class="active-text batchRefundNoUpdate" @click="batchRefundNoUpdate">刷新</div>
            </div>
            <div>
              <el-table :data="payResList"
                        :border="tableAttributes.border"
                        :stripe="tableAttributes.stripe"
                        :cell-style="tableAttributes.cellStyle">
                <el-table-column label="票号" prop="eticketno"></el-table-column>
                <el-table-column label="退票状态" prop="status">
                  <template slot-scope="scope">
                    <div>{{ scope.row.status | statusMap }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="退款失败原因">
                  <template slot-scope="scope">
                    <div v-if="scope.row.status === '8'">{{ scope.row.failReason }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status === '8'" class="again-refund" @click="refundAgain(scope.row, 2)">重新退款</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="batchVisible = false">关闭</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="线下处理" :visible.sync="underLineVisible" append-to-body width="480px">
        <div class="dialog-container" v-loading="underLineLoading">
          <div class="dialog-main">
            <div class="row">
              <div class="required">线下处理时间</div>
              <div class="mt-10">
                <el-date-picker
                  v-model="underLineTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="underLineVisible = false">取消</el-button>
            <el-button size="medium" :disabled="!underLineTime" @click="handleUnderLineRefund">提交</el-button>
          </div>
        </div>
      </el-dialog>
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
import { getChannelList, getCurrentDate, excelList, getRouteName } from '../../../utils'
import confirmDiaLog from '../../../components/refundConfirm'
import SyncProductInfo from '../../../components/syncProductInfo'
import { fetchList, batchRefundConform, refundAgainApi, underLineRefund } from './api'
import * as types from '../../../filters/index'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'RefundConfirm',
  data () {
    return {
      underLineVisible: false,
      underLineTime: '',
      underLineLoading: '',
      underLineRow: null,
      componentName: 'refundConfirm',
      loading: false,
      dialogLoading: false,
      batchVisible: false, // 根据批次号查询支付结果弹框1
      filter: {
        dateType: '1',
        ticStatus: '4',
        startdate: '',
        enddate: '',
        printFlag: '2'
      },
      applyDate: [],
      dataViewHeight: null,
      achangeList: {},
      refundAuditList: {},
      dataArr: [],
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      payResList: [],
      batchRefundNo: '', // 退款批次号
      tableList: {
        outRefundNo: false,
        productMoney: false,
        actualRefundMoney: false,
        orderdate: true,
        ordercode: true,
        pnr: true,
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
        paytype: false,
        paybillno: false,
        refundNo: false,
        nature: false,
        tstatus: true,
        failReason: false,
        isinter: false,
        happendate: false,
        cresdatetime: false,
        creqdatetime: false,
        returnIntegralStatus: false,
        ticStatusRelation: false,
        refundBatchNo: false,
        printFlag: false,
        secondAuditOpid: false,
        secondAuditDate: false,
        walletMoney: false,
	      actualRefundWallet: false,
	      refundWalletCharge: false,
	      epidemicInsr: false,
	      refundTicketInsr: false
      }, //  表格展示的数据
      productVisible: false,
      ticketId: null
    }
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getAchangeList(1, this.pagination.pageSize)
    // this.locCheck()
  },
  filters: {
    statusMap: function (status) {
      return types.refundStatusMap(status)
    }
  },
  mixins: [checkAttrs, computWidth],
  components: {
    confirmDiaLog,
    SyncProductInfo
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      orderType: state => state.app.orderType,
      payPlatform: state => state.app.payPlatform
    })
  },
  methods: {
    // 查看同步商品详情
    getSyncProductInfo (id) {
      this.productVisible = true
      this.ticketId = id
    },
    // 线下处理弹框
    underLineDialog (row) {
      this.underLineVisible = true
      this.underLineRow = row
    },
    // 线下处理
    handleUnderLineRefund () {
      let data = {
        idPara: this.underLineRow.id,
        ticketNo: this.underLineRow.eticketno,
        flightNo: this.underLineRow.fnumber,
        refundRemark: this.underLineRow.refundRemark,
        creqdatetime: this.underLineTime
      }
      this.$confirm('是否确认线下处理成功？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.underLineLoading = true
        underLineRefund(data).then(() => {
          this.underLineLoading = false
          this.underLineVisible = false
          this.getAchangeList()
        }).catch(err => {
          this.underLineLoading = false
          this.$message({
            type: 'error',
            message: err.message
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    // 关闭弹框并刷新页面
    closeDialog () {
      this.getAchangeList()
    },
    ticktMoney () {
      let ids = this.dataArr.map((item) => {
        return item.id
      }).join(',')
      this.delList(ids)
    },
    // 批量退款
    delList (ids) {
      this.$confirm('是否确认提交退款 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.loading = true
        batchRefundConform({ ids: ids }).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.confirmSearchPayRes(res.obj)
          this.getAchangeList(1, this.pagination.pageSize)
        }).catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    // 是否需要查询退款结果
    confirmSearchPayRes (refundBatchNo) {
      this.$confirm(`此次操作批次号：${refundBatchNo} ，是否需要查看退款结果？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.batchVisible = true
        // 查询批次号
        this.batchRefundNo = refundBatchNo
        this.searchPayRes(refundBatchNo)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 根据批次号查询支付结果
    searchPayRes (refundBatchNo) {
      let filter = {
        page: 1,
        rows: 50,
        refundBatchNo: refundBatchNo
      }
      fetchList(filter).then(res => {
        this.payResList = res.rows
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    handleSelectionChange (val) {
      this.dataArr = val
    },
    // 导出
    exportPayDetail () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = 'refund/exportRefundConfirmData'
      let name = getRouteName('/refundConfirm')
      let type = 'xls'
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
      this.startdate = getCurrentDate(0, '01')
      this.enddate = date
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
          this.achangeList.rows[i].channel = types.channelMap(this.achangeList.rows[i].channel)
          this.achangeList.rows[i].unexoInsr = types.formatPriceMap(this.achangeList.rows[i].unexoInsr)
          this.achangeList.rows[i].delayInsr = types.formatPriceMap(this.achangeList.rows[i].delayInsr)
          this.achangeList.rows[i].fmoney = types.formatPriceMap(this.achangeList.rows[i].fmoney)
          this.achangeList.rows[i].paymoney = types.formatPriceMap(this.achangeList.rows[i].paymoney)
          this.achangeList.rows[i].paytype = types.payTypeMap(this.achangeList.rows[i].paytype)
          this.achangeList.rows[i].tstatus = types.refundStatusMap(this.achangeList.rows[i].status)
          this.achangeList.rows[i].happendate = types.dateFormater(this.achangeList.rows[i].happendate) + this.achangeList.rows[i].happendtime
          this.achangeList.rows[i].nature = this.achangeList.rows[i].nature === '0' ? '非自愿' : '自愿'
          this.achangeList.rows[i].isinter = this.achangeList.rows[i].isinter === '0' ? '国内' : '国外'
          this.achangeList.rows[i].returnIntegralStatus = this.achangeList.rows[i].returnIntegralStatus === '0' ? '未退' : this.achangeList.rows[i].returnIntegralStatus === '1' ? '已退' : this.achangeList.rows[i].returnIntegralStatus
          if (this.achangeList.rows[i].ticStatusRelation === '0') {
            this.achangeList.rows[i].ticStatusRelation = '无需处理'
          } else if (this.achangeList.rows[i].ticStatusRelation === '1') {
            this.achangeList.rows[i].ticStatusRelation = '待处理'
          } else if (this.achangeList.rows[i].ticStatusRelation === '2') {
            this.achangeList.rows[i].ticStatusRelation = '已处理'
          }
        }
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
        ticStatus: '4',
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
        this.$refs.refundAby.queryInvolCardInfo({ involCardId: params.involCardId })
        if (params.productCount && parseInt(params.productCount)) {
          this.$refs.refundAby.queryProductInfoByTicketId(params.ticketid)
        }
      }
    },
    // 再次退款
    refundAgain (param, type) {
      this.$confirm(`上次退款失败原因：${param.failReason} ，是否重新退款？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.handleRefundAgain(param, type)
      }).catch(() => {
        this.$message('操作取消')
      })
    },
    handleRefundAgain (param, type) {
      let data = {
        idPara: param.id,
        ticketNo: param.eticketno,
        flightNo: param.fnumber,
        refundRemark: ''
      }
      if (type === 1) {
        // 列表中退
        this.loading = true
      } else if (type === 2) {
        // 弹框中退
        this.dialogLoading = true
      }
      refundAgainApi(data).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.loading = false
        this.dialogLoading = false
        this.getAchangeList(null, null)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.message
        })
        this.loading = false
        this.dialogLoading = false
      })
    },
    // 刷新支付回调结果
    batchRefundNoUpdate () {
      this.searchPayRes(this.batchRefundNo)
    }
  }
}
</script>

<style scoped lang="scss">
  .dialog-container {
    .row {
      display: flex;
      justify-content: space-between;
      .column{
        flex: 1;
      }
    }
  }
  .again-refund {
    color: #e6a23c;
    cursor: pointer;
  }
  .row {
    position: relative;
  }
  .batchRefundNoUpdate {
    position: absolute;
    top: 0;
    right: 0;
  }

</style>
