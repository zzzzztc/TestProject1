<template>
  <div id="MistakeReport" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道类型" clearable v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="差错退款申请单号" v-model="filter.applyNo" clearable @keydown.enter.native="getRefundReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单编号" v-model="filter.ordercode" clearable @keydown.enter.native="getRefundReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="申请人" v-model="filter.applyOp" clearable @keydown.enter.native="getRefundReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="审核人" v-model="filter.auditOp" clearable @keydown.enter.native="getRefundReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="联系人" v-model="filter.passengerName" clearable @keydown.enter.native="getRefundReport()"></el-input>
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
<!--            start-placeholder="申请开始日期"-->
<!--            end-placeholder="申请截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
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
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="退款完成" value="6"></el-option>
            <el-option label="线下处理成功" value="7"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="PNR" v-model="filter.pnr" clearable @keydown.enter.native="getRefundReport()"></el-input>
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
          <el-input size="medium" placeholder="银行订单号" v-model="filter.paybillno" clearable @keydown.enter.native="getRefundReport()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单类型" clearable v-model="filter.isFree">
            <el-option v-for="item in orderType" :key="item.id" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getRefundReport()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" type="success" :disabled="refundReport.total === 0" @click="exportPayDetail">导出</el-button>
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
    </div>
    <div class="main">
      <div class="column-btn" @click="switchColumn">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="refundReport.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column v-if="tableList.orderCode" label="订单编号" prop="ordercode" min-width="180"></el-table-column>
          <el-table-column v-if="tableList.apply_no" label="差错退款申请单号" prop="apply_no" min-width="280"></el-table-column>
          <el-table-column v-if="tableList.channel" label="渠道编号" min-width="120">
            <template slot-scope="scope">
              {{scope.row.channel | channelMap}}
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.PNR" label="PNR" prop="pnr" min-width="100"></el-table-column>
          <el-table-column v-if="tableList.payType" label="支付方式" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.paytype | payTypeMap }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.refund_amounts" label="应退金额" prop="refund_amounts" min-width="100">
            <template slot-scope="scope">
              {{scope.row.refund_amounts | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.refund_amounts_actual" label="退款金额" prop="refund_amounts_actual" min-width="100">
            <template slot-scope="scope">
              {{scope.row.refund_amounts_actual | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.refund_amounts_date" label="退款日期" prop="refund_amounts_date" min-width="160"></el-table-column>
          <el-table-column v-if="tableList.refund_status" label="退款状态" min-width="140">
            <template slot-scope="scope">
              {{scope.row.refund_status | refundStatusMap}}
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.passenger" label="联系人姓名" prop="passenger" min-width="100"></el-table-column>
          <el-table-column v-if="tableList.phone" label="联系人电话" prop="phone" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.paybillno" label="银行订单号" prop="paybillno" min-width="180"></el-table-column>
          <el-table-column v-if="tableList.paymoney" label="支付金额" prop="paymoney">
            <template slot-scope="scope">
              {{scope.row.paymoney | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.paystatus" label="支付状态">
            <template slot-scope="scope">
              {{scope.row.paystatus | payStatusMap}}
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.apply_date" label="申请时间" prop="apply_date" min-width="160"></el-table-column>
          <el-table-column v-if="tableList.apply_op" label="申请人" prop="apply_op" min-width="160"></el-table-column>
          <el-table-column v-if="tableList.apply_remark" label="申请备注" prop="apply_remark" min-width="180"></el-table-column>
          <el-table-column v-if="tableList.audit_date" label="审核时间" prop="audit_date" min-width="160"></el-table-column>
          <el-table-column v-if="tableList.audit_op" label="审核人" prop="audit_op" min-width="160"></el-table-column>
          <el-table-column v-if="tableList.audit_remark" label="审核备注" prop="audit_remark" min-width="180"></el-table-column>
          <el-table-column v-if="tableList.wallet_money" label="红包金额" prop="wallet_money" min-width="80"></el-table-column>
          <el-table-column v-if="tableList.actual_refund_wallet" label="红包退款" prop="actual_refund_wallet" min-width="80"></el-table-column>
          <el-table-column label="操作" min-width="100" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text" @click="switchDialog(scope.row.refund_id)">查看详情</span>
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
          :total="refundReport.total">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="800px">
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
                    <div class="table-cell">{{reviewdetail.wallet_money}}</div>
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
                    <div class="table-cell" :title="reviewdetail
.apply_no">{{reviewdetail.apply_no}}</div>
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
                    <div class="table-cell">{{reviewdetail.refund_amounts_remark}}</div>
                    <div class="table-cell">{{reviewdetail.refund_amounts_op}}</div>
                    <div class="table-cell">{{reviewdetail.refund_amounts_remark}}</div>
                    <div class="table-cell">{{reviewdetail.refund_amounts_actual}}</div>
                    <div class="table-cell">{{reviewdetail.actual_refund_wallet}}</div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelList, getCurrentDate, excelList, getRouteName } from '../../../utils/index'
import { fetchList, fetchRefundById } from './api'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'MistakeReport',
  data () {
    return {
      componentName: 'mistakeReport',
      isIndeterminate: false,
      checkList: fieldMap,
      checkedAll: false,
      tableList: {
        orderCode: true,
        apply_no: true,
        channel: true,
        PNR: true,
        payType: false,
        refund_amounts: false,
        refund_amounts_actual: true,
        refund_amounts_date: true,
        refund_status: true,
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
	      actual_refund_wallet: false
      }, //  表格展示的数据
      dataViewHeight: null,
      filter: {
        condition: '1',
        refundStatus: '6',
        applyDateBegin: '',
        applyDateEnd: ''
      },
      loading: false,
      dialogTitle: '',
      dialogVisible: false,
      applyDate: [],
      refundDate: [],
      reviewDate: [],
      reviewdetail: {},
      activeNames: ['order', 'pay', 'refund', 'review'],
      refundReport: {}
    }
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getRefundReport(1, this.pagination.pageSize)
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
    // 判断channelList是否存在
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 初始化时间
    initDate () {
      this.applyDate = [getCurrentDate(0, '01'), getCurrentDate(0)]
    },
    // 获取列表数据
    getRefundReport (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      // this.judgeFilterDate()
      fetchList(this.filter).then(res => {
        this.refundReport = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        refundStatus: '6',
        applyDateBegin: '',
        applyDateEnd: ''
      }
      this.initDate()
      this.getRefundReport(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getRefundReport(null, pages)
    },
    handleCurrentChange (page) {
      this.getRefundReport(page, null)
    },
    judgeFilterDate () {
      if (this.applyDate.length) {
        this.filter.applyDateBegin = this.applyDate[0]
        this.filter.applyDateEnd = this.applyDate[1]
      } else {
        delete this.filter.applyDateBegin
        delete this.filter.applyDateEnd
      }
      if (this.refundDate.length) {
        this.filter.refundDateBegin = this.refundDate[0]
        this.filter.refundDateEnd = this.refundDate[1]
      } else {
        delete this.filter.refundDateBegin
        delete this.filter.refundDateEnd
      }
      if (this.reviewDate.length) {
        this.filter.auditDateBegin = this.reviewDate[0]
        this.filter.auditDateEnd = this.reviewDate[1]
      } else {
        delete this.filter.auditDateBegin
        delete this.filter.auditDateEnd
      }
    },
    // 切换弹框
    switchDialog (id) {
      this.dialogVisible = true
      this.dialogTitle = '差错退款详情'
      this.getRefundDetail(id)
    },
    // 获取详情数据
    getRefundDetail (id) {
      fetchRefundById({ refundId: id }).then(res => {
        this.reviewdetail = res.rows[0]
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    //  导出
    exportPayDetail () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = 'errorRefunds/exportErrorRefund'
      let name = getRouteName('/mistakeReport')
      let type = 'xls'
      data.start = 1
      data.end = this.refundReport.total
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

<style scoped>

</style>
