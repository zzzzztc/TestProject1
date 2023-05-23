<template>
  <!--<div>差错退款申请</div>-->
  <div id="MistakeApply" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道编号" v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单编号" v-model="filter.ordercode" clearable @keydown.enter.native="getRefundApply()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="银行订单号" v-model="filter.paybillno" clearable @keydown.enter.native="getRefundApply()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="联系人姓名" v-model="filter.passengerName" clearable @keydown.enter.native="getRefundApply()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="联系人手机号" v-model="filter.passengerMobile" clearable @keydown.enter.native="getRefundApply()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.orderDateBegin"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="订单开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.orderDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="订单截止日期">
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
<!--            start-placeholder="订单开始日期"-->
<!--            end-placeholder="订单截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="PNR" v-model="filter.pnr" clearable @keydown.enter.native="getRefundApply()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单状态" clearable v-model="filter.order_status">
            <el-option label="等待提交" value="0"></el-option>
            <el-option label="已订座" value="1"></el-option>
            <el-option label="已出票" value="2"></el-option>
            <el-option label="出票失败" value="3"></el-option>
            <el-option label="已取消" value="4"></el-option>
            <el-option label="已出票" value="5"></el-option>
            <el-option label="航信防占座" value="6"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="支付方式" clearable v-model="filter.paytype">
            <el-option v-for="item in payPlatform" :key="item.id" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单类型" clearable v-model="filter.isFree">
            <el-option v-for="item in orderType" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="getRefundApply()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" type="success" @click="exportExcel" :disabled="!refundApply.total" >导出</el-button>
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
          :data="refundApply.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column label="渠道编号" v-if="tableList.channel" prop="channel" min-width="140">
            <template slot-scope="scope">
              <span>{{ scope.row.channel | channelMap }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单编号" v-if="tableList.ordercode" prop="ordercode" min-width="160"></el-table-column>
          <el-table-column label="订单日期" v-if="tableList.creadate" prop="creadate" min-width="120"></el-table-column>
          <el-table-column label="PNR" v-if="tableList.pnr" prop="pnr" min-width="100"></el-table-column>
          <el-table-column label="联系人姓名" v-if="tableList.conts_name" prop="conts_name" min-width="100"></el-table-column>
          <el-table-column label="联系人电话" v-if="tableList.conts_mobile" prop="conts_mobile" min-width="140"></el-table-column>
          <el-table-column label="订单状态" v-if="tableList.order_status" prop="order_status" min-width="100"></el-table-column>
          <el-table-column label="支付方式" v-if="tableList.paytype" prop="paytype" min-width="100"></el-table-column>
          <el-table-column label="支付状态" v-if="tableList.paystatus" prop="paystatus" min-width="100"></el-table-column>
          <el-table-column label="银行订单号" v-if="tableList.paybillno" prop="paybillno" min-width="180"></el-table-column>
          <el-table-column label="支付金额" v-if="tableList.pmoney" prop="pmoney" min-width="100"></el-table-column>
          <el-table-column label="可退金额" v-if="tableList.refund_money" prop="refund_money" min-width="100"></el-table-column>
          <el-table-column label="差错退款状态" v-if="tableList.refund_status" prop="refund_status" min-width="140"></el-table-column>
          <el-table-column label="红包金额" v-if="tableList.wallet_money" prop="wallet_money" min-width="140"></el-table-column>
          <el-table-column label="操作" min-width="140" v-if="checked.length">
            <template slot-scope="scope">
              <span class="inl-block active-text" @click="switchDialog(scope.row)">支付差错退款申请</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="filter.page"
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="refundApply.total">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="320px">
        <div v-loading="applyLoading" class="dialog-container">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label">
                  现金退款
                </div>
                <div class="ipe-medium">
                  <el-input size="medium" placeholder="" v-model="errorRefundInfo.refundAmounts"></el-input>
                </div>
              </div>
              <div class="column">
                <div class="label">红包退款</div>
                <div class="ipe-medium">
                  <el-input size="mini" placeholder="" v-model="errorRefundInfo.actualRefundWallet"></el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label">备注</div>
                <div class="ipt-medium">
                  <el-input size="medium" type="textarea" v-model="errorRefundInfo.applyRemark" :rows="4" clearable></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" type="primary" @click="handleApplyErrorRefund">提交</el-button>
            <el-button size="medium" @click="dialogVisible = false">取消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelList, payPlatform, getCurrentDate, JsonToXls, judgeOutTicketStatus, getRouteName } from '../../../utils/index'
import { fetchList, applyErrorRefund } from './api'
import * as types from '../../../filters/index'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'MistakeApply',
  data () {
    return {
      componentName: 'mistakeApply',
      loading: false,
      applyLoading: false,
      filter: {
        orderDateBegin: '',
        orderDateEnd: ''
      },
      dataViewHeight: null,
      date: [],
      refundApply: {},
      dialogTitle: '',
      dialogVisible: false,
      errorRefundInfo: {
        applyRemark: '',
        refundAmounts: null,
	      actualRefundWallet: 0
      },
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        channel: true,
        ordercode: false,
        creadate: true,
        pnr: true,
        conts_name: true,
        conts_mobile: false,
        order_status: true,
        paytype: false,
        paystatus: true,
        paybillno: true,
        pmoney: true,
        refund_money: false,
        refund_status: false,
	      wallet_money: false
      } //  表格展示的数据
    }
  },
  created () {
    this.judgeChannelList()
    this.initDate()
    this.getRefundApply(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  filters: {
    refundStatusMap (refundStatus) {
      let statusName = ''
      switch (refundStatus) {
        case '1':
          statusName = '已申请'
          break
        case '2':
          statusName = '一审通过'
          break
        case '3':
          statusName = '一审拒绝'
          break
        case '4':
          statusName = '二审通过'
          break
        case '5':
          statusName = '二审拒绝'
          break
        case '6':
          statusName = '退款完成'
          break
        default:
          statusName = '--'
      }
      return statusName
    }
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
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    initDate () {
      this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.filter.orderDateBegin = this.date[0]
      this.filter.orderDateEnd = this.date[1]
    },
    // 获取列表数据
    getRefundApply (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.refundApply = res
        for (let i = 0; i < this.refundApply.rows.length; i++) {
          // this.refundApply.rows[i].channel = types.channelMap(this.refundApply.rows[i].channel)
          switch (this.refundApply.rows[i].order_status) {
            case '0':
              this.refundApply.rows[i].order_status = '预订失败'
              break
            case '1':
              this.refundApply.rows[i].order_status = '已订座'
              break
            case '2':
              this.refundApply.rows[i].order_status = '已出票'
              break
            case '3':
              this.refundApply.rows[i].order_status = '出票失败'
              break
            case '4':
              this.refundApply.rows[i].order_status = '已取消'
              break
            case '5':
              this.refundApply.rows[i].order_status = '已出票'
              break
            case '6':
              this.refundApply.rows[i].order_status = '航信防占座'
              break
          }
          this.refundApply.rows[i].paytype = types.payTypeMap(this.refundApply.rows[i].paytype)
          this.refundApply.rows[i].paystatus = types.payStatusMap(this.refundApply.rows[i].paystatus)
          this.refundApply.rows[i].pmoney = types.formatPriceMap(this.refundApply.rows[i].paymoney)
          this.refundApply.rows[i].refund_money = types.formatPriceMap(this.refundApply.rows[i].refund_money)
          this.refundApply.rows[i].refund_status = types.refundStatusMap(this.refundApply.rows[i].refund_status)
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        orderDateBegin: '',
        orderDateEnd: ''
      }
      this.initDate()
      this.getRefundApply(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getRefundApply(null, pages)
    },
    handleCurrentChange (page) {
      this.getRefundApply(page, null)
    },
    // 切换弹框状态
    switchDialog (param) {
      this.dialogVisible = true
      this.dialogTitle = '差错退款申请'
      this.errorRefundInfo.applyRemark = ''
      this.errorRefundInfo.orderid = param.orderid
      this.errorRefundInfo.bankCode = param.paybillno
      this.errorRefundInfo.refundAmounts = param.paymoney
      this.errorRefundInfo.actualRefundWallet = param['refundable_wallet_money']
      this.errorRefundInfo.refund_money = param.refund_money
    },
    // 差错退款申请
    handleApplyErrorRefund () {
      this.applyLoading = true
      applyErrorRefund(this.errorRefundInfo).then(() => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.getRefundApply()
        this.applyLoading = false
      }).catch(err => {
        this.$message.error(err.message)
        this.applyLoading = false
      })
    },
    exportExcel () {
      // console.log(this.refundApply)
      let data = JSON.parse(JSON.stringify(this.filter))
      data.rows = this.refundApply.total
      // console.log(data)
      let arrJson = []
      fetchList(data).then(res => {
        if (res.rows.length > 65000) {
          this.$message.info('导出数据过多，请缩小范围')
        } else {
          for (let i = 0; i < res.rows.length; i++) {
            let obj = {}
            res.rows[i].order_status = judgeOutTicketStatus(res.rows[i].order_status)
            res.rows[i].paytype = payPlatform(res.rows[i].paytype)
            res.rows[i].paystatus = types.payStatusMap(res.rows[i].paystatus)
            res.rows[i].refund_status = types.refundStatusMap(res.rows[i].refund_status)
            res.rows[i].channel = types.channelMap(res.rows[i].channel)
            for (let j = 0; j < this.checkList.length; j++) {
              obj[this.checkList[j].label] = res.rows[i][this.checkList[j].key]
            }
            arrJson.push(obj)
          }
          JsonToXls([arrJson], ['sheet1'], getRouteName('/mistakeApply'))
        }
      }).catch(err => {
        // console.log(err)
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
