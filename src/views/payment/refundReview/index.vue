<template>
  <!--<div>差错退款审核</div>-->
  <div id="MistakeAudit" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道类型" v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="差错退款申请单号" v-model="filter.applyNo" clearable @keydown.enter.native="getRefundReview()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单编号" v-model="filter.ordercode" clearable @keydown.enter.native="getRefundReview()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="申请人" v-model="filter.applyOp" clearable @keydown.enter.native="getRefundReview()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="审核人" v-model="filter.auditOp" clearable @keydown.enter.native="getRefundReview()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="联系人" v-model="filter.passengerName" clearable @keydown.enter.native="getRefundReview()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.applyDateBegin"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.applyDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.refundDateBegin"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="退款开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.refundDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="退款截止日期">
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
<!--            start-placeholder="退款开始日期"-->
<!--            end-placeholder="退款截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="退款状态" clearable v-model="filter.refundStatus">
            <el-option label="已申请" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="审核拒绝" value="3"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="PNR" v-model="filter.pnr" clearable @keydown.enter.native="getRefundReview()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.auditDateBegin"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="审核开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.auditDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="审核截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="reviewDate"-->
<!--            type="daterange"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            range-separator="至"-->
<!--            start-placeholder="审核开始日期"-->
<!--            end-placeholder="审核截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="银行订单号" v-model="filter.paybillno" clearable @keydown.enter.native="getRefundReview()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单类型" clearable v-model="filter.isFree">
            <el-option v-for="item in orderType" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getRefundReview()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" @click="exportExcel" :disabled="!refundReview.total" >导出</el-button>
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
      <!--<div class="btn-container"></div>-->
    </div>
    <div class="main">
      <div class="column-btn" @click="switchColumn">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="refundReview.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column label="订单编号" v-if="tableList.order_code" prop="order_code" min-width="160"></el-table-column>
          <el-table-column label="差错退款申请单号" v-if="tableList.apply_no" prop="apply_no" min-width="260"></el-table-column>
          <el-table-column label="渠道编号" v-if="tableList.channel" min-width="100" prop="channel"></el-table-column>
          <el-table-column label="PNR" v-if="tableList.pnr" prop="pnr" min-width="100"></el-table-column>
          <el-table-column label="支付方式" v-if="tableList.pay_type" min-width="100" prop="pay_type"></el-table-column>
          <el-table-column label="应退金额" v-if="tableList.refund_amounts" prop="refund_amounts" min-width="100"></el-table-column>
          <el-table-column label="退款金额" v-if="tableList.refund_amounts_actual" prop="refund_amounts_actual" min-width="100"></el-table-column>
          <el-table-column label="退款日期" v-if="tableList.refund_amounts_date" prop="refund_amounts_date" min-width="160"></el-table-column>
          <el-table-column label="退款状态" v-if="tableList.rstatus" prop="rstatus" min-width="120"></el-table-column>
          <el-table-column label="联系人姓名" v-if="tableList.passenger" prop="passenger" min-width="100"></el-table-column>
          <el-table-column label="联系人电话" v-if="tableList.phone" prop="phone" min-width="120"></el-table-column>
          <el-table-column label="银行订单号" v-if="tableList.paybillno" prop="paybillno" min-width="200"></el-table-column>
          <el-table-column label="支付金额" v-if="tableList.paymoney" prop="paymoney" min-width="100"></el-table-column>
          <el-table-column label="支付状态" v-if="tableList.paystatus" min-width="100" prop="paystatus"></el-table-column>
          <el-table-column label="申请时间" v-if="tableList.apply_date" prop="apply_date" min-width="160"></el-table-column>
          <el-table-column label="申请人" v-if="tableList.apply_op" prop="apply_op" min-width="140"></el-table-column>
          <el-table-column label="申请备注" v-if="tableList.apply_remark" prop="apply_remark" min-width="120"></el-table-column>
          <el-table-column label="审核时间" v-if="tableList.audit_date" prop="audit_date" min-width="160"></el-table-column>
          <el-table-column label="审核人" v-if="tableList.audit_op" prop="audit_op" min-width="140"></el-table-column>
          <el-table-column label="审核备注" v-if="tableList.audit_remark" prop="audit_remark" min-width="160"></el-table-column>
          <el-table-column label="红包金额" v-if="tableList.wallet_money" prop="wallet_money" min-width="160"></el-table-column>
          <el-table-column label="退款失败原因" v-if="tableList.wx_refund_error_msg" prop="wx_refund_error_msg" min-width="160"></el-table-column>
          <el-table-column label="操作" min-width="160" v-if="checked.length">
            <template slot-scope="scope">
              <span v-if="scope.row.refund_status === '1'" class="inl-block active-text" @click="switchDialog(0, scope.row.refund_id)">差错退款审核</span>
              <span v-else class="inl-block active-text" @click="switchDialog(1, scope.row.refund_id)">查看详情</span>
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
          :total="refundReview.total">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog v-dialogDrag :title="dialogTitle" :visible.sync="dialogVisible" width="800px">
        <div class="dialog-container">
          <div class="dialog-main" style="padding: 0">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="订单信息" name="order">
                <div class="table">
                  <div class="table-header">
                    <div class="table-cell">订单编号</div>
                    <div class="table-cell">渠道编号</div>
                    <div class="table-cell">PNR</div>
                    <div class="table-cell">乘客姓名</div>
                    <div class="table-cell">乘客电话</div>
                  </div>
                  <div class="table-body">
                    <div class="table-cell">{{reviewdetail.order_code}}</div>
                    <div class="table-cell">{{reviewdetail.channel | channelMap}}</div>
                    <div class="table-cell">{{reviewdetail.pnr}}</div>
                    <div class="table-cell">{{reviewdetail.passenger}}</div>
                    <div class="table-cell">{{reviewdetail.phone}}</div>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="支付信息" name="pay">
                <div class="table">
                  <div class="table-header">
                    <div class="table-cell">银行订单编号</div>
                    <div class="table-cell">支付方式</div>
                    <div class="table-cell">支付金额</div>
                    <div class="table-cell">红包金额</div>
                    <div class="table-cell">可退金额</div>
                    <div class="table-cell">支付状态</div>
                  </div>
                  <div class="table-body">
                    <div class="table-cell">{{reviewdetail.bank_code}}</div>
                    <div class="table-cell">{{reviewdetail.pay_type | payTypeMap}}</div>
                    <div class="table-cell">{{reviewdetail.pay_amounts}}</div>
                    <div class="table-cell">{{reviewdetail.actualRefundWallet}}</div>
                    <div class="table-cell">{{reviewdetail.refundable}}</div>
                    <div class="table-cell">{{reviewdetail.paystatus | payStatusMap}}</div>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="退款信息" name="refund">
                <div class="table">
                  <div class="table-header">
                    <div class="table-cell">差错退款申请单号</div>
                    <div class="table-cell">申请时间</div>
                    <div class="table-cell">退款原因</div>
                    <div class="table-cell">应退金额</div>
                    <div class="table-cell">申请人</div>
                  </div>
                  <div class="table-body">
                    <div class="table-cell" :title="reviewdetail.apply_no">{{reviewdetail.apply_no}}</div>
                    <div class="table-cell">{{reviewdetail.apply_date | dateFormat}}</div>
                    <div class="table-cell">{{reviewdetail.apply_remark}}</div>
                    <div class="table-cell">{{reviewdetail.refund_amounts}}</div>
                    <div class="table-cell">{{reviewdetail.apply_op}}</div>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="审核信息" name="review">
                <div class="table">
                  <div class="table-header">
                    <div class="table-cell">审核时间</div>
                    <div class="table-cell">审核人</div>
                    <div class="table-cell">审核备注</div>
                    <div class="table-cell">退款人</div>
                    <div class="table-cell">退款备注</div>
                    <div class="table-cell">现金退款</div>
                    <div class="table-cell">红包退款</div>
                  </div>
                  <div class="table-body">
                    <div class="table-cell">{{reviewdetail.audit_date}}</div>
                    <div class="table-cell">{{reviewdetail.audit_op}}</div>
                    <div class="table-cell">
                      <span class="doubClick" @dblclick="doubClicks" v-if="doubState && !reviewInfo.auditRemark">双击录入</span>
                      <span class="doubClick" @dblclick="doubClicks" v-if="doubState && reviewInfo.auditRemark">{{reviewInfo.auditRemark}}</span>
                      <el-input size="medium" placeholder="" v-if="!doubState" v-model="reviewInfo.auditRemark" ref="counts" @blur='shoState'></el-input>
                    </div>
                    <div class="table-cell">{{reviewdetail.refund_amounts_op}}</div>
                    <div class="table-cell">{{reviewdetail.refund_amounts_remark}}</div>
                    <div class="table-cell">
                      <el-input size="mini" placeholder="" v-if="doubPrice" ref="price" @blur='priceState' v-model="reviewInfo.refundAmountsActual"></el-input>
                    </div>
                    <div class="table-cell">
                      <el-input size="mini" placeholder="" v-if="doubPrice" ref="price" @blur='priceState' v-model="reviewdetail.actual_refund_wallet"></el-input>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="handleConfirm('2')">差错退款通过</el-button>
            <el-button size="medium" @click="handleConfirm('3')">差错退款拒绝</el-button>
            <el-button size="medium" @click="dialogVisible = false">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  getChannelList,
  getCurrentDate,
  JsonToXls,
  getRouteName
} from '../../../utils/index'
import { fetchList, fetchRefundById, auditErrorRefund } from './api'
import * as types from '../../../filters/index'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'MistakeAudit',
  data () {
    return {
      componentName: 'mistakeAudit',
      loading: false,
      filter: { // 过滤条件
        condition: 1,
        refundStatus: '1',
        applyDateBegin: '',
        applyDateEnd: ''
      },
      dataViewHeight: null,
      applyDate: [],
      refundDate: [],
      reviewDate: [],
      refundReview: {},
      dialogVisible: false,
      dialogTitle: '',
      isReview: false,
      activeNames: ['order', 'pay', 'refund', 'review'],
      reviewdetail: {}, // 详情数据
      reviewInfo: {
        refundId: '',
        refundStatus: '',
        auditRemark: '',
        refundAmountsActual: ''
      },
      screenWidth: document.documentElement.clientWidth,
      doubState: true,
      doubPrice: true,
      onePrice: null,
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        order_code: false,
        apply_no: false,
        channel: true,
        pnr: true,
        pay_type: false,
        refund_amounts: true,
        refund_amounts_actual: false,
        refund_amounts_date: false,
        rstatus: true,
        passenger: true,
        phone: false,
        paybillno: false,
        paymoney: false,
        paystatus: false,
        apply_date: false,
        apply_op: false,
        apply_remark: false,
        audit_date: false,
        audit_op: false,
        audit_remark: false,
	      wallet_money: false,
	      wx_refund_error_msg: false
      } //  表格展示的数据
    }
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getRefundReview(1, this.pagination.pageSize)
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
    doubClicks () {
      this.doubState = false
      setTimeout(() => {
        this.$refs.counts.focus()
      }, 0)
    },
    shoState () {
      this.doubState = true
    },
    doubPrices () {
      this.doubPrice = false
      setTimeout(() => {
        this.$refs.price.focus()
      }, 0)
    },
    priceState () {
      this.doubPrice = true
      if (!this.reviewInfo.refundAmountsActual) {
        this.reviewInfo.refundAmountsActual = this.onePrice
      }
    },
    // 判断channelList是否存在
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    initDate () {
      this.applyDate = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.filter.applyDateBegin = this.applyDate[0]
      this.filter.applyDateEnd = this.applyDate[1]
    },
    // 获取数据
    getRefundReview (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      // this.judgeDate()
      fetchList(this.filter).then(res => {
        this.refundReview = res
        for (let i = 0; i < this.refundReview.rows.length; i++) {
          this.refundReview.rows[i].channel = types.channelMap(this.refundReview.rows[i].channel)
          this.refundReview.rows[i].pay_type = types.payTypeMap(this.refundReview.rows[i].pay_type)
          this.refundReview.rows[i].refund_amounts = types.formatPriceMap(this.refundReview.rows[i].refund_amounts)
          this.refundReview.rows[i].refund_amounts_actual = types.formatPriceMap(this.refundReview.rows[i].refund_amounts_actual)
          this.refundReview.rows[i].rstatus = types.refundStatusMap(this.refundReview.rows[i].refund_status)
          this.refundReview.rows[i].paymoney = types.formatPriceMap(this.refundReview.rows[i].paymoney)
          this.refundReview.rows[i].paystatus = types.payStatusMap(this.refundReview.rows[i].paystatus)
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
        condition: 1,
        refundStatus: '1',
        applyDateBegin: '',
        applyDateEnd: ''
      }
      this.initDate()
      this.getRefundReview(1, this.pagination.pageSize)
    },
    // 时间赋值
    judgeDate () {
      if (this.applyDate) {
        this.filter.applyDateBegin = this.applyDate[0]
        this.filter.applyDateEnd = this.applyDate[1]
      } else {
        delete this.filter.applyDateBegin
        delete this.filter.applyDateEnd
      }
      if (this.refundDate) {
        this.filter.refundDateBegin = this.refundDate[0]
        this.filter.refundDateEnd = this.refundDate[1]
      } else {
        delete this.filter.refundDateBegin
        delete this.filter.refundDateEnd
      }
      if (this.reviewDate) {
        this.filter.auditDateBegin = this.reviewDate[0]
        this.filter.auditDateEnd = this.reviewDate[1]
      } else {
        delete this.filter.auditDateBegin
        delete this.filter.auditDateEnd
      }
    },
    // 分页与总数异常
    // 分页
    handleSizeChange (pages) {
      this.getRefundReview(null, pages)
    },
    handleCurrentChange (page) {
      this.getRefundReview(page, null)
    },
    switchDialog (type, id) {
      // type 0审核， 1查看
      this.dialogVisible = true
      this.dialogTitle = '差错退款详情'
      this.getRefundById(id)
    },
    // 获取详情数据
    getRefundById (id) {
      fetchRefundById({ refundId: id }).then(res => {
        this.reviewdetail = res.rows[0]
        this.onePrice = this.reviewdetail.refund_amounts
        this.reviewInfo.refundAmountsActual = this.reviewdetail.refund_amounts
        this.reviewInfo.auditRemark = this.reviewdetail.audit_remark
        this.reviewInfo.actualRefundWallet = this.reviewdetail.actual_refund_wallet
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    handleConfirm (type) {
      let title = ''
      if (type === '2') {
        // 通过
        title = '是否确定通过审核？'
      } else if (type === '3') {
        // 拒绝
        title = '是否确定拒绝？'
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleAuditErrorRefund(type)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 差错退款审核
    handleAuditErrorRefund (type) {
      this.reviewInfo.refundStatus = type
      this.reviewInfo.refundId = this.reviewdetail.refund_id
      this.reviewInfo.actualRefundWallet = this.reviewdetail.actual_refund_wallet
      auditErrorRefund(this.reviewInfo).then(() => {
        this.$message.success('操作成功')
        this.getRefundReview()
        this.dialogVisible = false
      }).catch(err => {
        this.$message.error(err.messages)
      })
    },
    exportExcel () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.rows = this.refundReview.total
      let arrJson = []
      fetchList(data).then(res => {
        if (res.rows.length > 65000) {
          this.$message.info('导出数据过多，请缩小范围')
        } else {
          for (let i = 0; i < res.rows.length; i++) {
            let obj = {}
            res.rows[i].channel = types.channelMap(res.rows[i].channel)
            res.rows[i].pay_type = types.payTypeMap(res.rows[i].pay_type)
            res.rows[i].rstatus = types.refundStatusMap(res.rows[i].refund_status)
            res.rows[i].paystatus = types.payStatusMap(res.rows[i].paystatus)
            for (let j = 0; j < this.checkList.length; j++) {
              obj[this.checkList[j].label] = res.rows[i][this.checkList[j].key]
            }
            arrJson.push(obj)
          }
          JsonToXls([arrJson], ['sheet1'], getRouteName('/mistakeAudit'))
        }
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.doubClick{
  cursor: pointer;
  font-weight: bold;
  color: #409EFF;
}
  .color{
    color: #fa5e5f;
  }
</style>
