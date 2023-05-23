<template>
  <!--<div>差错退票审核退款</div>-->
  <div id="MistakeAuditSure" class="container">
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
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="退款状态" clearable v-model="filter.refundStatus">
            <el-option key="0" label="审核通过" value="2"></el-option>
            <el-option key="1" label="审核拒绝" value="3"></el-option>
            <el-option key="2" label="退款完成" value="6"></el-option>
            <el-option key="3" label="线下处理成功" value="7"></el-option>
            <el-option key="4" label="退款失败" value="8"></el-option>
            <el-option key="5" label="退款处理中" value="13"></el-option>
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
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="银行订单号" v-model="filter.paybillno" clearable @keydown.enter.native="getRefundReview()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单类型" clearable v-model="filter.isFree">
            <el-option v-for="item in orderType" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="退款批次号" v-model="filter.refundBatchNo" clearable @keydown.enter.native="getRefundReview()"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getRefundReview()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" type="success" @click="exportExcel" :disabled="!refundReview.total" >导出</el-button>
        <el-button size="medium" type= 'danger' :disabled='dataArr.length === 0' @click="batchRefund">批量退款</el-button>
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
          :data="refundReview.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          @selection-change='handleSelectionChange'
          :cell-style="tableAttributes.cellStyle">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="订单编号" v-if="tableList.order_code" prop="order_code" min-width="160"></el-table-column>
          <el-table-column label="差错退款申请单号" v-if="tableList.apply_no" prop="apply_no" min-width="260"></el-table-column>
          <el-table-column label="渠道编号" v-if="tableList.channel" min-width="100" prop="channel"></el-table-column>
          <el-table-column label="PNR" v-if="tableList.pnr" prop="pnr" min-width="100"></el-table-column>
          <el-table-column label="支付方式" v-if="tableList.pay_type" min-width="110" prop="pay_type"></el-table-column>
          <el-table-column label="应退金额" v-if="tableList.refund_amounts" prop="refund_amounts" min-width="100"></el-table-column>
          <el-table-column label="退款金额" v-if="tableList.refund_amounts_actual" prop="refund_amounts_actual" min-width="100"></el-table-column>
          <el-table-column label="退款日期" v-if="tableList.refund_amounts_date" prop="refund_amounts_date" min-width="160"></el-table-column>
          <el-table-column label="退款状态" v-if="tableList.rstatus" prop="rstatus" min-width="120"></el-table-column>
<!--          <el-table-column label="退款确认时间" v-if="tableList.refundAmountsDate" prop="refundAmountsDate" min-width="160"></el-table-column>-->
          <el-table-column label="退款失败原因" v-if="tableList.failReason" prop="wx_refund_error_msg" min-width="120"></el-table-column>
          <el-table-column label="退款批次号" v-if="tableList.refundBatchNo" prop="refund_batch_no" min-width="160"></el-table-column>
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
          <el-table-column label="操作" min-width="240" v-if="checked.length">
            <template slot-scope="scope">
              <span v-if="scope.row.refund_status === '2'" class="inl-block active-text" @click="switchDialog(0, scope.row.refund_id)">差错退款审核</span>
              <span v-else class="inl-block active-text" @click="switchDialog(1, scope.row.refund_id)">查看详情</span>
              <span class="inl-block active-text" v-if="scope.row.refund_status==='8'"  @click="errorRefundConformAgain(scope.row)">重新退款</span>
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
      <el-dialog v-dialogDrag :title="dialogTitle" :visible.sync="dialogVisible" width="1000px">
        <div class="dialog-container" v-loading="dialogLoading">
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
                    <div class="table-cell">可退金额</div>
                    <div class="table-cell">支付状态</div>
                  </div>
                  <div class="table-body">
                    <div class="table-cell">{{reviewdetail.bank_code}}</div>
                    <div class="table-cell">{{reviewdetail.pay_type | payTypeMap}}</div>
                    <div class="table-cell">{{reviewdetail.pay_amounts}}</div>
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
                    <div class="table-cell">红包金额</div>
                    <div class="table-cell">申请人</div>
                  </div>
                  <div class="table-body">
                    <div class="table-cell" :title="reviewdetail.apply_no">{{reviewdetail.apply_no}}</div>
                    <div class="table-cell">{{reviewdetail.apply_date | dateFormat}}</div>
                    <div class="table-cell">{{reviewdetail.apply_remark}}</div>
                    <div class="table-cell">{{reviewdetail.refund_amounts}}</div>
                    <div class="table-cell">{{reviewdetail.wallet_money}}</div>
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
                    <div class="table-cell">退款失败原因</div>
                  </div>
                  <div class="table-body">
                    <div class="table-cell">{{reviewdetail.audit_date}}</div>
                    <div class="table-cell">{{reviewdetail.audit_op}}</div>
                    <div class="table-cell">
                      {{reviewInfo.refundAmountsRemark}}
                    </div>
                    <div class="table-cell">
                      {{reviewdetail.refund_amounts_op}}
                    </div>
                    <div class="table-cell">
                      <span class="doubClick" @dblclick="doubClicks" v-if="doubState && !reviewdetail.refund_amounts_remark">双击录入</span>
                      <span class="doubClick" @dblclick="doubClicks" v-if="doubState && reviewdetail.refund_amounts_remark">{{reviewdetail.refund_amounts_remark}}</span>
                      <el-input size="medium" placeholder="" v-if="!doubState" v-model="reviewdetail.refund_amounts_remark"  ref="counts" @blur='shoState'></el-input>
                    </div>
                    <div class="table-cell">
                      <el-input size="mini" placeholder="" v-model="reviewInfo.refundAmountsActual"  v-if="doubPrice" ref="price" @blur='priceState'></el-input>
                    </div>
                    <div class="table-cell">
                      <el-input size="mini" placeholder="" v-model="reviewdetail.refundablewalletmoney"  v-if="doubPrice" ref="price" @blur='priceState'></el-input>
                    </div>
                    <div class="table-cell">
                      <span>{{ reviewdetail.wx_refund_error_msg }}</span>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" v-if="refundReview.refund_status === '2'" @click="handleConfirm('6')">退款完成</el-button>
            <el-button size="medium" v-if="reviewdetail.refund_status === '2' || reviewdetail.refund_status === '8'" @click="underLineVisible = true">线下退款完成</el-button>
            <el-button size="medium" v-if="refundReview.refund_status === '2'" @click="handleConfirm('1')">退款拒绝</el-button>
            <el-button size="medium" @click="dialogVisible = false">返回</el-button>
          </div>
        </div>
        <!--线下退款处理弹框-->
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
              <el-button size="medium" :disabled="!underLineTime" @click="underLineRefund">提交</el-button>
            </div>
          </div>
        </el-dialog>
      </el-dialog>
    </div>
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
                <el-table-column label="订单号" prop="ordercode"></el-table-column>
                <el-table-column label="退票状态" prop="status">
                  <template slot-scope="scope">
                    <div>{{ scope.row.refund_status | refundStatusMap }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="退款失败原因">
                  <template slot-scope="scope">
                    <div v-if="scope.row.refund_status === '8'">{{ scope.row.wx_refund_error_msg }}</div>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelList, getCurrentDate, getRouteName, JsonToXls } from '../../../utils/index'
import {
  fetchList,
  fetchRefundById,
  auditErrorRefund,
  underLineRefund,
  batchRefund,
	errorRefundConformAgain
} from './api'
import * as types from '../../../filters/index'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'MistakeAuditSure',
  data () {
    return {
      batchVisible: false,
      batchRefundNo: '',
      dialogLoading: false,
      payResList: [],
      dataArr: [],
      underLineVisible: false,
      underLineLoading: false,
      underLineTime: '',
      componentName: 'mistakeAuditSure',
      loading: false,
      filter: { // 过滤条件
        condition: 1,
        refundStatus: '2',
        applyDateEnd: '',
        applyDateBegin: ''
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
        refundAmountsRemark: '',
        refundAmountsActual: ''
      },
      doubState: true,
      doubPrice: true,
      onePrice: null,
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        refundBatchNo: false,
        order_code: false,
        apply_no: false,
        channel: true,
        pnr: true,
        pay_type: false,
        refund_amounts: true,
        refund_amounts_actual: false,
        refund_amounts_date: false,
        rstatus: true,
        refundAmountsDate: false,
        failReason: false,
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
	      wallet_money: false
      } //  表格展示的数据
    }
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getRefundReview(1, this.pagination.pageSize)
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
    handleSelectionChange (val) {
      this.dataArr = val
    },
    // 批量退款确认框
    batchRefund () {
      let ids = this.dataArr.map(item => {
        return item.refund_id
      }).join(',')
      this.$confirm('是否确认提交退款 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleBatchRefund(ids)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    // 刷新回调列表
    batchRefundNoUpdate () {
      this.searchPayRes(this.batchRefundNo)
    },
    // 调用批量退款API
    handleBatchRefund (ids) {
      this.loading = true
      batchRefund({ ids: ids }).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.loading = false
        this.getRefundReview()
        this.confirmSearchPayRes(res.obj)
      }).catch(err => {
        this.loading = false
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    // 是否需要查询退款结果
    confirmSearchPayRes (batchNo) {
      this.$confirm(`此次操作批次号：${batchNo}，是否需要查看退款结果？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.batchVisible = true
        this.batchRefundNo = batchNo
        this.searchPayRes(batchNo)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    // 查询批量退款结果
    searchPayRes (batchNo) {
      let filter = {
        page: 1,
        rows: 50,
        refundBatchNo: batchNo
      }
      fetchList(filter).then(res => {
        this.payResList = res.rows
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
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
        refundStatus: '2',
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
      this.dialogTitle = '差错退款审核退款详情'
      this.getRefundById(id)
    },
    // 获取详情数据
    getRefundById (id) {
      fetchRefundById({ refundId: id }).then(res => {
        this.reviewdetail = res.rows[0]
        this.onePrice = this.reviewdetail.refund_amounts_actual
        this.reviewInfo.refundAmountsActual = this.reviewdetail.refund_amounts_actual
        this.reviewInfo.refundAmountsRemark = this.reviewdetail.audit_remark
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    handleConfirm (type) {
      let title = ''
      if (type === '6') {
        // 通过
        title = '退款完成？'
      } else if (type === '7') {
        // 拒绝
        title = '线下退款完成？'
      } else if (type === '1') {
        title = '是否确认拒绝？'
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
    // 差错退款审核退款
    handleAuditErrorRefund (type) {
      this.reviewInfo.refundStatus = type
      this.reviewInfo.refundId = this.reviewdetail.refund_id
      this.reviewInfo.refundablewalletmoney = this.reviewdetail.refundablewalletmoney
      this.dialogLoading = true
      auditErrorRefund(this.reviewInfo).then(() => {
        this.$message.success('操作成功')
        this.getRefundReview()
        this.dialogVisible = false
        this.dialogLoading = false
      }).catch(err => {
        this.dialogLoading = false
        this.$message.error(err.messages)
      })
    },
    // 导出
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
          JsonToXls([arrJson], ['sheet1'], getRouteName('/mistakeAuditSure'))
        }
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    // 线下退款处理
    underLineRefund () {
      let data = {
        refundId: this.reviewdetail.refund_id,
        refundStatus: '7',
        refundAmountsRemark: this.reviewdetail.audit_remark,
        refundAmountsActual: this.reviewdetail.refund_amounts_actual,
        refundAmountsDate: this.underLineTime
      }
      this.$confirm('是否确认线下处理成功?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.underLineLoading = true
        underLineRefund(data).then(() => {
          this.underLineLoading = false
          this.underLineVisible = false
          this.dialogVisible = false
          this.getRefundReview()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        }).catch((err) => {
          console.log(err)
          this.underLineLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    // 重新退款
	  errorRefundConformAgain (param) {
    	console.log(param)
		  this.$prompt('请填写重新退款理由', '提示')
		  .then(({ value }) => {
			  if (!value) {
				  this.$message('请填写重新退款理由')
				  return false
			  }
			  const data = {
				  refundId: param.refund_id,
				  refundStatus: '6',
				  refundAmountsActual: param.refund_amounts_actual,
				  actualRefundWallet: param.actual_refund_wallet,
				  refundAmountsRemark: value
			  }
			  errorRefundConformAgain(data)
			  .then(res => {})
			  .catch(err => {
				  this.$message({
					  message: err.message,
					  type: 'error'
				  })
			  })
		  })
		  .catch(() => [
			  this.$message('取消操作')
		  ])
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
  .inl-block {
    padding-left: 10px;
  }
</style>
