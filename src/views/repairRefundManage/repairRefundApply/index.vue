<template>
  <!--<div>补退款申请</div>-->
  <div id="RepairRefundApply" class="container">
    <!--<h1>补退款申请</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.channel' clearable placeholder="请选择渠道"  size="medium">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="订单编号" v-model="searchForm.orderCode" @keydown.enter.native="refundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="银行订单号" v-model="searchForm.bankCode" @keydown.enter.native="refundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="退款申请单号" v-model="searchForm.applyNo" @keydown.enter.native="refundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="PNR" v-model="searchForm.pnr" @keydown.enter.native="refundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="乘客姓名" v-model="searchForm.passenger" @keydown.enter.native="refundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.startDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="订单开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.endDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="订单截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            :clearable = "false"-->
<!--            unlink-panels-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="orderDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="订单开始日期"-->
<!--            end-placeholder="订单结束日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.payType' placeholder="支付方式" clearable size="medium">
            <el-option v-for="item in payPlatform" :key="item.id" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        <!--<div class="search-item search-ipt">-->
          <!--<el-select v-model='searchForm.isFree' placeholder="请选择订单类型" clearable size="medium">-->
            <!--<el-option key="0" label="现金订单" value="0"></el-option>-->
            <!--<el-option key="1" label="积分订单" value="1"></el-option>-->
          <!--</el-select>-->
        <!--</div>-->
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="refundList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" type="success" :disabled="!tableList.total" @click="exportExcel">导出</el-button>
      </div>
    </div>
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
                  <span>{{ props.row.bank_code }}</span>
                </el-form-item>
                <el-form-item label="联系人姓名">
                  <span>{{ props.row.passenger }}</span>
                </el-form-item>
                <el-form-item label="联系人电话">
                  <span>{{ props.row.phone }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <!--<el-table-column type="selection" width="50" fixed="left"></el-table-column>-->
          <el-table-column label="渠道编号" min-width="140">
            <template slot-scope="scope">
              <div>{{scope.row.channel | channelMap}}</div>
            </template>
          </el-table-column>
          <el-table-column label="订单编号" prop="order_code" min-width="180"></el-table-column>
          <el-table-column label="退款申请单号" prop="apply_no" min-width="180"></el-table-column>
          <el-table-column label="订单日期" prop="create_datetime" min-width="180"></el-table-column>
          <!--<el-table-column label="PNR" prop="pnr" min-width="120"></el-table-column>-->
          <!--<el-table-column label="银行订单号" prop="bank_code" min-width="180"></el-table-column>-->
          <el-table-column label="支付方式" prop="pay_type" min-width="100">
            <template slot-scope="scope">
              <div>{{scope.row.pay_type | payTypeMap}}</div>
            </template>
          </el-table-column>
          <el-table-column label="支付金额" prop="pay_amounts" min-width="90">
            <template slot-scope="scope">
              {{scope.row.pay_amounts | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="可退金额" prop="refundable" min-width="90">
            <template slot-scope="scope">
              {{scope.row.refundable | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="可退红包" prop="refundable_wallet_money" min-width="90">
            <template slot-scope="scope">
              {{scope.row.refundable_wallet_money}}
            </template>
          </el-table-column>
          <el-table-column label="红包金额" prop="wallet_money" min-width="90">
            <template slot-scope="scope">
              {{scope.row.wallet_money}}
            </template>
          </el-table-column>
          <!--<el-table-column label="联系人姓名" prop="passenger" min-width="140"></el-table-column>-->
          <!--<el-table-column label="联系人电话" prop="phone" min-width="140"></el-table-column>-->
          <el-table-column label="订单状态" prop="order_status" min-width="90">
            <template slot-scope="scope">
              {{scope.row.order_status| outTicketStatusMap}}
            </template>
          </el-table-column>
          <el-table-column label="支付状态" prop="paystatus" min-width="90">
            <template slot-scope="scope">
              {{scope.row.paystatus | payStatusMap}}
            </template>
          </el-table-column>
          <el-table-column label="退款状态" prop="refund_status" min-width="90">
            <template slot-scope="scope">
              {{scope.row.refund_status | refundStatusMap}}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="180">
            <template slot-scope="scope">
              <div class="active-text inl-block mr-5" @click="handleTrial(0, null, scope.row)">补退款申请</div>
              <div class="active-text inl-block" @click="handleTrial(1, 'apply', scope.row)">查看详情</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
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
    <RepairRefund ref="repairRefundAby" :row.sync="row" :repairRefundList="repairRefundList" @refundList="refundList"></RepairRefund>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RepairRefund from '../../../components/repairRefund'
import { queryRefundList } from './api'
import { getChannelList, getCurrentDate, getRouteName, JsonToXls } from '../../../utils/index'
import { channelMap, payStatusMap, payTypeMap, outTicketStatusMap, refundStatusMap } from '../../../filters/index'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'RepairRefundApply',
  data () {
    return {
      row: {},
      searchForm: {
        channel: '', // 渠道
        condition: '1',
        orderCode: '', // 订单编号
        bankCode: '', // 银行订单号
        applyNo: '', // 退款申请单号
        pnr: '', // PNR
        passenger: '', // 乘客姓名
        startDate: '', // 订单开始日期
        endDate: '', // 订单结束日期
        payType: '', // 支付方式
        isFree: '', // 订单类型
        page: 1
      }, // 搜索框 -- 数据
      orderDate: [], // 搜索框 -- 订单日期
      tableList: [], // 表格 -- 数据
      editForm: {}, // 申请补退款弹出框数据
      multipleSelection: [], // 选中的表单数据
      dataViewHeight: null, // 表格高度
      repairRefundList: {}, // 父传子
      loading: false // 加载
    }
  },
  components: {
    RepairRefund
  },
  created () {
    this.getDateTerm()
    this.getChannelList()
    this.refundList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      channelList: state => state.app.channelList, // 渠道
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
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
    // 搜索框 -- 获取订单日期期限
    getDateTerm () {
      this.orderDate = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.searchForm.startDate = this.orderDate[0]
      this.searchForm.endDate = this.orderDate[1]
    },
    // 搜索框 -- 重置
    handleReset () {
      this.searchForm = {
        startDate: '',
        endDate: ''
      }
      this.getDateTerm()
      this.refundList(1, this.pagination.pageSize)
    },
    // 表格 -- 分页导航
    handleSizeChange (pages) {
      this.refundList(null, pages)
    },
    handleCurrentChange (page) {
      this.refundList(page, null)
    },
    // 表格 -- 选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 表格 -- 获取数据
    refundList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      queryRefundList(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 表格 -- 查看详情
    handleTrial (index, type, params) {
      this.dataBind(params)
      this.row = params
      if (index === 0) {
        let data = {
          editForm: this.editForm,
          refundVisible: true
        }
        this.$refs.repairRefundAby.handleApply(1, data)
      } else {
        let data = {
          refundId: params.refund_id,
          tableName: params.table_name
        }
        this.repairRefundList = {
          editForm: this.editForm,
          editVisible: true,
          type: type
        }
        this.$refs.repairRefundAby.getRefundInfo(data)
      }
    },
    // 弹出框 -- 数据处理
    dataBind (params) {
      this.editForm.ticketid = params.ticketid
      this.editForm.payid = params.payid
      this.editForm.applyOp = params.apply_op
      this.editForm.channel = params.channel
      this.editForm.applyNo = params.apply_no
      this.editForm.orderCode = params.order_code
      this.editForm.pnr = params.pnr
      this.editForm.bankCode = params.bank_code
      this.editForm.payType = params.pay_type
      this.editForm.payAmounts = params.pay_amounts
      this.editForm.refundAmounts = params.refundable
      this.editForm.passenger = params.passenger
      this.editForm.phone = params.phone
      this.editForm.applyRemark = params.apply_remark
      this.editForm.eticketno = params.eticketno
      this.editForm.orderid = params.orderid
    },
    exportExcel () {
      let data = JSON.parse(JSON.stringify(this.searchForm))
      data.rows = this.tableList.total
      let arrJson = []
      queryRefundList(data).then(res => {
        if (res.rows.length > 65000) {
          this.$message.info('导出数据过多,请缩小范围')
        } else {
          for (let i = 0; i < res.rows.length; i++) {
            let obj = {}
            res.rows[i].channel = channelMap(res.rows[i].channel)
            obj = {
              渠道编号: res.rows[i].channel,
              订单编号: res.rows[i].order_code,
              退款申请单号: res.rows[i].apply_no,
              订单日期: res.rows[i].create_datetime,
              支付方式: payTypeMap(res.rows[i].pay_type),
              支付金额: res.rows[i].pay_amounts,
              可退金额: res.rows[i].refundable,
              订单状态: outTicketStatusMap(res.rows[i].order_status),
              支付状态: payStatusMap(res.rows[i].paystatus),
              退款状态: refundStatusMap(res.rows[i].refund_status),
              PNR: res.rows[i].pnr,
              银行订单号: res.rows[i].bank_code,
              联系人姓名: res.rows[i].passenger,
              联系电话: res.rows[i].phone,
              红包金额: res.rows[i].wallet_money,
              可退红包: res.rows[i].refundable_wallet_money
            }
            arrJson.push(obj)
          }
          JsonToXls([arrJson], ['sheet1'], getRouteName('/repairRefundApply'))
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

<style scoped>

</style>
