<template>
  <!--<div>异常订单管理</div>-->
  <div class="container" id="OutTicket">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="旅客姓名" v-model="filter.name" clearable @keydown.enter.native="getOutTicket()"></el-input>
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
        <!--            start-placeholder="支付起始日期"-->
        <!--            end-placeholder="支付截止日期"-->
        <!--            align="right">-->
        <!--          </el-date-picker>-->
        <!--        </div>-->
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="航班号" v-model="filter.fnumber" clearable @keydown.enter.native="getOutTicket()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单号" v-model="filter.orderCode" clearable @keydown.enter.native="getOutTicket()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="支付单号" v-model="filter.payBillNo" clearable @keydown.enter.native="getOutTicket()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="PNR" v-model="filter.pnr" clearable @keydown.enter.native="getOutTicket()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单状态" clearable v-model="filter.orderStatus">
            <el-option label="已支付，未出票" value="1"></el-option>
            <el-option label="已人工出票" value="10"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="国内/国际" clearable v-model="filter.inInter">
            <el-option label="国内" value="0"></el-option>
            <el-option label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道" v-model="filter.channel" clearable>
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="市场方" v-model="filter.airways" clearable @keydown.enter.native="getOutTicket()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="承运方" v-model="filter.airline" clearable @keydown.enter.native="getOutTicket()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单类型" v-model="filter.isFree" clearable>
            <el-option v-for="item in orderType" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="乘机人类型" v-model="filter.passerType" clearable>
            <el-option label="成人" value="0"></el-option>
            <el-option label="儿童" value="1"></el-option>
            <el-option label="婴儿" value="2"></el-option>
          </el-select>
        </div>
        <div class="div search-item">
          <el-button size="medium" type="primary" @click="getOutTicket()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" type="success" :disabled="outTicket.total === 0" @click="exportPayDetail">导出</el-button>
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
          :data="outTicket.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column label="订单时间" min-width="100" v-if="tableList.orderDate">
            <template slot-scope="scope">
              {{scope.row.orderDate | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="订单号" prop="orderCode" min-width="180" v-if="tableList.orderCode"></el-table-column>
          <el-table-column label="PNR" prop="pnr" min-width="100" v-if="tableList.pnr"></el-table-column>
          <el-table-column label="市场方" v-if="tableList.airways" prop="airways" min-width="100"></el-table-column>
          <el-table-column label="承运方" v-if="tableList.airline" prop="airline" min-width="100"></el-table-column>
          <el-table-column label="联系人" v-if="tableList.contactName" prop="contactName" min-width="100"></el-table-column>
          <el-table-column label="联系号码" v-if="tableList.contactMobile" prop="contactMobile" min-width="120"></el-table-column>
          <el-table-column label="支付通道" v-if="tableList.payChannelName" prop="payChannelName" min-width="100"></el-table-column>
          <el-table-column label="支付订单号" v-if="tableList.paybillno" prop="paybillno" min-width="180"></el-table-column>
          <el-table-column label="订座状态" prop="status" v-if="tableList.orderStatus" min-width="100"></el-table-column>
          <el-table-column label="支付状态" min-width="100" prop="pstatus" v-if="tableList.payStatus"></el-table-column>
          <el-table-column label="国内/国际" prop="isInter" v-if="tableList.isInter" min-width="100"></el-table-column>
          <el-table-column label="操作" min-width="120" v-if="checked.length">
            <template slot-scope="scope">
              <span class="inl-block mr-5" v-if="scope.row.isHandIssue === '1'">已人工出票</span>
              <span class="inl-block mr-5" v-if="scope.row.orderStatus === '2' || scope.row.orderStatus === '5'">已出票</span>
              <span class="active-text" v-if="scope.row.orderStatus === '1' && scope.row.payStatus === '2'" @click="getOutTicketByOrderId(scope.row)">人工出票</span>
              <span class="" v-if="scope.row.payStatus !== '2'">未支付</span>
              <span class="danger-text" @click="cancelOrderConfirm(scope.row.orderId)">取消订单</span>
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
        :total="outTicket.total">
      </el-pagination>
    </div>
    <div>
      <el-dialog v-dialogDrag :title="dialogTitle" :visible.sync="dialogVisible" width="80%">
        <div class="dialog-container">
          <div class="dialog-main">
            <el-table :data="ticketInfo" :border="tableAttributes.border" :stripe="tableAttributes.stripe" :cell-style="tableAttributes.cellStyle">
              <el-table-column label="旅客名" prop="pname"></el-table-column>
              <el-table-column label="航班号" prop="fnumber"></el-table-column>
              <el-table-column label="航段" prop="sail" min-width="100"></el-table-column>
              <el-table-column label="起飞日期" prop="fdate" min-width="110"></el-table-column>
              <el-table-column label="起飞时间" prop="ftime" min-width="100"></el-table-column>
              <el-table-column label="舱位" prop="seat"></el-table-column>
              <el-table-column label="票面价" prop="money"></el-table-column>
              <el-table-column label="机建税" prop="airportTax"></el-table-column>
              <el-table-column label="燃油税" prop="fuelTax"></el-table-column>
              <el-table-column label="优惠金额" prop="fmoney"></el-table-column>
              <el-table-column label="支付金额" prop="paymoney"></el-table-column>
              <el-table-column label="订单状态">
                <template slot-scope="scope">
                  {{scope.row.status | outTicketStatusMap}}
                </template>
              </el-table-column>
              <el-table-column label="支付状态">
                <template slot-scope="scope">
                  {{scope.row.paystatus | payStatusMap}}
                </template>
              </el-table-column>
              <el-table-column label="PNR" min-width="100">
                <template slot-scope="scope">
                  <el-input size="medium" placeholder="" ref="pnrs" v-model="scope.row.pnr" ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="票号" prop="eticketno" min-width="180">
                <template slot-scope="scope">
                  <el-input size="medium" placeholder="录入票号" v-model="scope.row.eticketno" clearable></el-input>
                  <div class="warning-info" v-if="formErr && !scope.row.eticketno">录入票号</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="outTicketByHandConfirm">确认出票</el-button>
            <el-button size="medium" @click="dialogVisible = false">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelList, getCurrentDate, excelList, getRouteName } from '../../../utils'
import { fetchList, queryOutTicketByOrderId, outTicketByHand, cancelOrderApi } from './api'
import fieldMap from './refer'
import * as types from '../../../filters/index'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'OutTicket',
  data () {
    return {
      componentName: 'outTicket',
      filter: {
        sourceid: 'sdal',
        orderStatus: '1',
        startdate: '',
        enddate: ''
      },
      loading: false,
      payDate: [],
      dataViewHeight: null,
      outTicket: {},
      dialogVisible: false,
      dialogTitle: '人工出票',
      formErr: false,
      currentTicket: {}, // 人工出票取参
      ticketInfo: [], // 人工出票弹框数据
      checkList: fieldMap,
      // checked: [],
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        orderDate: true,
        orderCode: true,
        pnr: true,
        airways: false,
        airline: false,
        contactName: false,
        contactMobile: false,
        payChannelName: false,
        paybillno: true,
        orderStatus: false,
        payStatus: true,
        isInter: false
      } //  表格展示的数据
    }
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getOutTicket(1, this.pagination.pageSize)
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
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    initDate () {
      let date = getCurrentDate(0)
      this.payDate = [date, date]
      this.filter.startdate = this.payDate[0]
      this.filter.enddate = this.payDate[1]
    },
    // 获取数据
    getOutTicket (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.outTicket = res
        for (let i = 0; i < this.outTicket.rows.length; i++) {
          // this.outTicket.rows[i].orderDate = types.dateFormat(this.outTicket.rows[i].orderDate)
          this.outTicket.rows[i].status = types.outTicketStatusMap(this.outTicket.rows[i].orderStatus)
          this.outTicket.rows[i].pstatus = types.payStatusMap(this.outTicket.rows[i].payStatus)
          // this.outTicket.status = types.outTicketStatusMap(this.outTicket.status)
          this.outTicket.rows[i].isInter = this.outTicket.rows[i].isInter === '0' ? '国内' : '国际'
        }
        // console.log(this.outTicket)
        this.loading = false
      }).catch(err => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        sourceid: 'sdal',
        orderStatus: '1',
        startdate: '',
        enddate: ''
      }
      this.initDate()
      this.getOutTicket(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getOutTicket(null, pages)
    },
    handleCurrentChange (page) {
      this.getOutTicket(page, null)
    },
    // 获取人工出票数据并显示弹框
    getOutTicketByOrderId (param) {
      this.currentTicket = param
      this.dialogVisible = true
      queryOutTicketByOrderId({ orderid: param.orderId }).then(res => {
        this.ticketInfo = res.rows
        this.ticketInfo = res.rows.map((item) => {
          item['flag'] = false
          return item
        })
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 出票确认
    outTicketByHandConfirm () {
      this.$confirm('是否确认出票', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleOutTicket()
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 人工出票
    handleOutTicket () {
      this.formErr = false
      let idPara = `${this.ticketInfo[0].orderid};`
      for (let i = 0; i < this.ticketInfo.length; i++) {
        if (!this.ticketInfo[i].eticketno) {
          this.formErr = true
        } else {
          idPara += `${this.ticketInfo[i].ticketid},${this.ticketInfo[i].eticketno},${this.ticketInfo[i].pnr}:`
        }
      }
      if (!this.formErr) {
        outTicketByHand({ idPara: idPara }).then(() => {
          this.$message.success('人工出票成功')
          this.getOutTicket()
          this.dialogVisible = false
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    },
    exportPayDetail () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = 'refund/exportOutTicketList'
      let name = getRouteName('/outTicket')
      let type = 'xls'
      data.start = 1
      data.end = this.outTicket.total
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
    // 取消订单
    cancelOrderConfirm (id) {
      this.$confirm('是否确认取消订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.cancelOrderHandler(id)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    cancelOrderHandler (id) {
      cancelOrderApi({ orderid: id })
        .then(() => {
          this.$message.success('操作成功')
          this.getOutTicket()
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message
          })
        })
    }
  }
}
</script>

<style  scoped lang='scss'>
.pnr{
  cursor: pointer;
}
</style>
