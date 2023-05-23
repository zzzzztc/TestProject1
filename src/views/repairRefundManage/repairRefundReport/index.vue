<template>
  <div id="RepairRefundForm" class="container">
    <!--<h1>补退款报表</h1>-->
    <div class="header" ref="header">
      <!-- 搜索框 -- 查询 -->
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.channel' placeholder="请选择渠道" size="medium">
            <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="订单编号" v-model="searchForm.orderCode" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="银行订单号" v-model="searchForm.bankCode" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="退款申请单号" v-model="searchForm.applyNo" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="申请人" v-model="searchForm.applyOp" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="审核人" v-model="searchForm.auditOp" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="PNR" v-model="searchForm.pnr" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="乘客姓名" v-model="searchForm.passenger" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.applyDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.applyDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请结束日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            unlink-panels-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="applyDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="申请开始日期"-->
<!--            end-placeholder="申请结束日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.auditDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="审核开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.auditDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="审核结束日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            unlink-panels-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="auditDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="审核开始日期"-->
<!--            end-placeholder="审核结束日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.refundDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="退款开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.refundDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="退款截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            unlink-panels-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="refundDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="退款开始日期"-->
<!--            end-placeholder="退款结束日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.payType' placeholder="支付方式" clearable size="medium">
            <el-option v-for="item in payPlatform" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.refundStatus' placeholder="请选择退款状态" clearable size="medium">
            <el-option key="0" label="已申请" value="1"></el-option>
            <el-option key="1" label="已审核" value="2"></el-option>
            <el-option key="2" label="已拒绝" value="3"></el-option>
            <el-option key="3" label="已退款" value="6"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="getRepairRefundList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <!--导出-->
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="!tableList.total" @click="handleExport">导出</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="main">
      <div class="table-container" >
        <el-table
          v-loading="loading"
          :data='tableList.rows'
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
          <el-table-column fixed="left" type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="PNR">
                  <span>{{ props.row.pnr }}</span>
                </el-form-item>
                <el-form-item label="银行订单号">
                  <span>{{ props.row.bankCode }}</span>
                </el-form-item>
                <el-form-item label="申请人">
                  <span>{{ props.row.applyOp }}</span>
                </el-form-item>
                <el-form-item label="申请人电话">
                  <span>{{ props.row.phone }}</span>
                </el-form-item>
                <el-form-item label="申请时间">
                  <span>{{ props.row.createDate }}</span>
                </el-form-item>
                <el-form-item label="申请备注">
                  <span>{{ props.row.auditRemark }}</span>
                </el-form-item>
                <el-form-item label="审核人">
                  <span>{{ props.row.refundAmountsOp }}</span>
                </el-form-item>
                <el-form-item label="审核时间">
                  <span>{{ props.row.refundAmountsDate }}</span>
                </el-form-item>
                <el-form-item label="审核备注">
                  <span>{{ props.row.refundAmountsRemark }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <!--<el-table-column type="selection" min-width="50" fixed="left"></el-table-column>-->
          <el-table-column label="渠道编号" min-width="120">
            <template slot-scope="scope">
              <div>{{scope.row.channel | channelMap}}</div>
            </template>
          </el-table-column>
          <el-table-column label="订单编号" prop="orderCode" min-width="180"></el-table-column>
          <el-table-column label="退款申请单号" prop="applyNo" min-width="280"></el-table-column>
          <!--<el-table-column label="PNR" prop="pnr" min-width="100"></el-table-column>-->
          <!--<el-table-column label="银行订单号" prop="bankCode" min-width="180"></el-table-column>-->
          <el-table-column label="支付方式">
            <template slot-scope="scope">
              <div>{{scope.row.payType | payTypeMap}}</div>
            </template>
          </el-table-column>
          <el-table-column label="支付金额" prop="payAmounts">
            <template slot-scope="scope">
              {{scope.row.payAmounts | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="应退金额" prop="refundAmounts">
            <template slot-scope="scope">
              {{scope.row.refundAmounts | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="乘客姓名" prop="passenger" min-width="140"></el-table-column>
          <!--<el-table-column label="申请人" prop="auditOp" min-width="140"></el-table-column>-->
          <!--<el-table-column label="申请人电话" prop="phone" min-width="140"></el-table-column>-->
          <!--<el-table-column label="申请时间" prop="createDate" min-width="180"></el-table-column>-->
          <!--<el-table-column label="申请备注" prop="auditRemark" min-width="200"></el-table-column>-->
          <!--<el-table-column label="审核人" prop="refundAmountsOp" min-width="140"></el-table-column>-->
          <!--<el-table-column label="审核时间" prop="refundAmountsDate" min-width="180"></el-table-column>-->
          <!--<el-table-column label="审核备注" prop="refundAmountsRemark"></el-table-column>-->
          <el-table-column label="现金退款" prop="refundAmountsActual">
            <template slot-scope="scope">
              {{scope.row.refundAmountsActual | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="红包退款" prop="actual_refund_wallet">
            <template slot-scope="scope">
              {{scope.row.actualRefundWallet}}
            </template>
          </el-table-column>
          <el-table-column label="退款日期" prop="refundDate" min-width="180"></el-table-column>
          <el-table-column label="退款状态" prop="refundStatus" min-width="140">
            <template slot-scope="scope">
              {{scope.row.refundStatus | refundStatusMap}}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="140">
            <template slot-scope="scope">
              <div class="active-text" @click="handleDetails('report', scope.row.refundId)">查看详情</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--表格分页-->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableList.total">
      </el-pagination>
    </div>
    <!--编辑弹出框-->
    <RepairRefund ref="repairRefundAby" :repairRefundList="repairRefundList" @refundList="getRepairRefundList"></RepairRefund>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RepairRefund from '../../../components/repairRefund'
import { queryRepairRefund } from './api'
import { getCurrentDate, getChannelList, excelList, getRouteName } from '../../../utils/index'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'RepairRefundForm',
  data () {
    return {
      searchForm: {
        channel: '', // 渠道
        condition: '1',
        orderCode: '', // 订单编号
        bankCode: '', // 银行订单号
        applyNo: '', // 退款申请单号
        applyOp: '', // 申请人
        auditOp: '', // 审核人
        pnr: '', // PNR
        passenger: '', // 乘客姓名
        applyDateStart: '', // 申请开始日期
        applyDateEnd: '', // 申请结束日期
        auditDateStart: '', // 审核开始日期
        auditDateEnd: '', // 审核结束日期
        refundDateStart: '', // 退款开始日期
        refundDateEnd: '', // 退款结束日期
        payType: '', // 支付方式
        refundStatus: '6', // 退款状态
        page: 1
      }, // 搜索框 -- 数据
      applyDate: [], // 搜索框 -- 申请日期
      auditDate: [], // 搜索框 -- 审核日期
      refundDate: [], // 搜索框 -- 退款日期
      tableList: [], // 表格 -- 数据
      multipleSelection: [], // 表格 -- 选择项数据
      dataViewHeight: null, // 表格 -- 高度
      repairRefundList: {}, // 组件 -- 传参
      loading: false // 加载 -- 数据加载时显示的动效
    }
  },
  components: {
    RepairRefund
  },
  mixins: [computWidth],
  filters: {
    // 退款状态 -- 数据过滤
    refundStatusMap (refundStatus) {
      let statusName = ''
      switch (refundStatus) {
        case '1':
          statusName = '已申请'
          break
        case '2':
          statusName = '已审核'
          break
        case '3':
          statusName = '已拒绝'
          break
        case '6':
          statusName = '已退款'
          break
        case '7':
          statusName = '线下退款完成'
          break
        case '8':
          statusName = '退款失败'
          break
        default:
          statusName = '--'
      }
      return statusName
    }
  },
  created () {
    this.getDateTerm()
    this.getChannelList()
    this.getRepairRefundList(1, this.pagination.pageSize)
  },
  computed: {
    ...mapState({
      channelList: state => state.app.channelList, // 渠道
      tableAttributes: state => state.app.tableAttributes, // 表格
      pagination: state => state.app.pagination, // 分页
      payPlatform: state => state.app.payPlatform
    })
  },
  methods: {
    // 渠道 -- 没有则请求服务器
    getChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 搜索框 -- 获取申请日期期限
    getDateTerm () {
      this.applyDate = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.searchForm.applyDateStart = this.applyDate[0]
      this.searchForm.applyDateEnd = this.applyDate[1]
    },
    // 搜索框 -- 重置
    handleReset () {
      this.searchForm = {
        condition: '1',
        payType: '',
        refundStatus: '6',
        applyDateStart: '',
        applyDateEnd: ''
      }
      this.getDateTerm()
      this.getChannelList()
      this.getRepairRefundList(1, this.pagination.pageSize)
    },
    // 表格 -- 分页导航
    handleSizeChange (pages) {
      this.getRepairRefundList(null, pages)
    },
    handleCurrentChange (page) {
      this.getRepairRefundList(page, null)
    },
    // 表格 -- 选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 表格 -- 获取数据
    getRepairRefundList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      // this.handleDate()
      queryRepairRefund(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 表格 -- 入参日期处理
    handleDate () {
      // 申请日期
      if (this.applyDate && this.applyDate.length) {
        this.searchForm.applyDateStart = this.applyDate[0]
        this.searchForm.applyDateEnd = this.applyDate[1]
      } else {
        delete this.searchForm.applyDateStart
        delete this.searchForm.applyDateEnd
      }
      // 审核日期
      if (this.auditDate && this.auditDate.length) {
        this.searchForm.auditDateStart = this.auditDate[0]
        this.searchForm.auditDateEnd = this.auditDate[1]
      } else {
        delete this.searchForm.auditDateStart
        delete this.searchForm.auditDateEnd
      }
      // 退款日期
      if (this.refundDate && this.refundDate.length) {
        this.searchForm.refundDateStart = this.refundDate[0]
        this.searchForm.refundDateEnd = this.refundDate[1]
      } else {
        delete this.searchForm.refundDateStart
        delete this.searchForm.refundDateEnd
      }
    },
    // 表格 -- 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.searchForm))
      data.start = 1
      data.end = this.tableList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'repairRefund/exportRepairRefundForm',
        name: getRouteName('/repairRefundForm'),
        type: 'xls'
      }
      excelList(params, this)
    },
    // 表格 -- 查看详情
    handleDetails (type, id) {
      this.repairRefundList = {
        editVisible: true,
        type: type
      }
      this.$refs.repairRefundAby.getRepairRefundInfo(id)
    }
  }
}
</script>

<style scoped>

</style>
