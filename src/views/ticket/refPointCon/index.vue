<template>
  <!--<div>退积分确认</div>-->
  <div id="RefundIntegralConfirm" class="container">
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
            <el-option label="退票完成" value="6"></el-option>
            <el-option label="线下退票完成" value="7"></el-option>
            <el-option label="退款失败" value="8"></el-option>
          </el-select>
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
          <el-select size="medium" placeholder="自愿/非自愿" v-model="filter.nature">
            <el-option label="非自愿" value="0"></el-option>
            <el-option label="自愿" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="退票单号" v-model="filter.refundNo" clearable @keydown.enter.native="getAchangeList()"></el-input>
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
          <el-select size="medium" placeholder="退积分状态" v-model="filter.returnIntegralStatus" clearable>
            <el-option value="0" label="未退"></el-option>
            <el-option value="1" label="已退"></el-option>
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
          <el-table-column label="订单日期" v-if="tableList.orderdate" prop="orderdate" min-width="160"></el-table-column>
          <el-table-column label="订单号" v-if="tableList.ordercode" prop="ordercode" min-width="180"></el-table-column>
          <el-table-column label="PNR" v-if="tableList.pnr" prop="pnr" min-width="100"></el-table-column>
          <el-table-column label="市场方" v-if="tableList.airways"  prop="airways" min-width="100"></el-table-column>
          <el-table-column label="承运方" v-if="tableList.airline"  prop="airline" min-width="100"></el-table-column>
          <el-table-column label="渠道类型" v-if="tableList.channel"  min-width="120" prop="channel"></el-table-column>
          <el-table-column label="旧票号" v-if="tableList.initialTktNo" prop="initialTktNo" min-width="140"></el-table-column>
          <el-table-column label="票号" v-if="tableList.eticketno" prop="eticketno" min-width="140"></el-table-column>
          <el-table-column label="旅客姓名" v-if="tableList.name" prop="name" min-width="120"></el-table-column>
          <el-table-column label="航班号" v-if="tableList.fnumber" prop="fnumber" min-width="100"></el-table-column>
          <el-table-column label="航意险" v-if="tableList.unexoInsr" prop="unexoInsr" min-width="100"></el-table-column>
          <el-table-column label="航延险" v-if="tableList.delayInsr" prop="delayInsr" min-width="100"></el-table-column>
          <el-table-column label="支付金额" v-if="tableList.paymoney" prop="paymoney" min-width="100"></el-table-column>
          <el-table-column label="附加商品金额" v-if="tableList.productMoney" prop="productMoney" min-width="120"></el-table-column>
          <el-table-column label="支付积分" v-if="tableList.integralFare" prop="integralFare" min-width="100"></el-table-column>
          <el-table-column label="银行订单号" v-if="tableList.paybillno" prop="paybillno" min-width="180"></el-table-column>
          <el-table-column label="退票单号" v-if="tableList.refundNo" prop="refundNo" min-width="120"></el-table-column>
          <el-table-column label="退票性质" v-if="tableList.nature" min-width="100" prop="nature"></el-table-column>
          <el-table-column label="退票状态" v-if="tableList.fstatus" min-width="120" prop="fstatus"></el-table-column>
          <el-table-column label="退款失败原因" v-if="tableList.failReason" prop="failReason" min-width="160"></el-table-column>
          <el-table-column label="国内/国际" v-if="tableList.isinter" min-width="100" prop="isinter"></el-table-column>
          <el-table-column label="申请退票时间" v-if="tableList.happendate" prop="happendate" min-width="160"></el-table-column>
          <el-table-column label="退票审核时间" v-if="tableList.cresdatetime" prop="cresdatetime" min-width="160"></el-table-column>
          <el-table-column label="退款时间" v-if="tableList.creqdatetime" prop="creqdatetime" min-width="160"></el-table-column>
          <el-table-column label="退积分状态" v-if="tableList.returnStatus" min-width="110" prop="returnStatus"></el-table-column>
          <el-table-column label="票面处理状态" v-if="tableList.ticStatusRelation" min-width="110" prop="ticStatusRelation"></el-table-column>
          <el-table-column label="行程单是否需回收" v-if="tableList.printFlag" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.isprint === '1'">是</div>
              <div v-else>否</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="160" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" v-if="scope.row.returnIntegralStatus === '0' && scope.row.status === '4'" @click="handleConfirm(scope.row.id)">退积分确认</span>
              <span class="active-text mr-5" v-else @click="switchDialog('detail', 1, scope.row)">查看详情</span>
              <span class="active-text mr-5" @click="switchDialog('second', 0, scope.row)">审核记录</span>
              <span class="active-text mr-5" v-if="scope.row.productMoney && parseInt(scope.row.productMoney)" @click="getSyncProductInfo(scope.row.ticketid)">附加商品详情</span>
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
    <RefundDiaLog ref="refundAby" :refundAuditList="refundAuditList"></RefundDiaLog>
    <!--退积分确认弹出框-->
    <el-dialog title="退积分确认" :visible.sync="editVisible" width="350px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label">备注</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="4" clearable placeholder="备注" v-model="editForm.reason" size="medium"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="popupEdit">提交</el-button>
          <el-button size="medium" @click="editVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
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
import { fetchList, comfirmReturnIntegral } from './api'
import * as types from '../../../filters/index'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'RefundIntegralConfirm',
  data () {
    return {
      componentName: 'refundIntegralConfirm',
      loading: false,
      filter: {
        isintegral: '1',
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
      editVisible: false, // 退积分弹出框
      editForm: {
        id: '',
        reason: ''
      }, // 退积分弹出框数据
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        productMoney: false,
        orderdate: false,
        pnr: false,
        airways: false,
        airline: false,
        channel: false,
        initialTktNo: false,
        name: false,
        fnumber: false,
        unexoInsr: false,
        delayInsr: false,
        paymoney: false,
        paybillno: false,
        refundNo: false,
        nature: false,
        fstatus: false,
        failReason: false,
        isinter: false,
        happendate: false,
        cresdatetime: false,
        creqdatetime: false,
        ordercode: true,
        eticketno: true,
        integralFare: true,
        returnStatus: true,
        ticStatusRelation: true,
        printFlag: false
      }, //  表格展示的数据
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
      channelList: state => state.app.channelList
    })
  },
  methods: {
    // 查看同步商品详情
    getSyncProductInfo (id) {
      this.productVisible = true
      this.ticketId = id
    },
    exportPayDetail () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = 'refund/exportRefundConfirmData'
      let name = getRouteName('/refundIntegralConfirm')
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
      this.filter.startdate = getCurrentDate(0, '01')
      this.filter.enddate = date
      // this.applyDate = [getCurrentDate(0, '01'), date]
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
        this.loading = false
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
          this.achangeList.rows[i].fstatus = types.refundStatusMap(this.achangeList.rows[i].status)
          this.achangeList.rows[i].isinter = this.achangeList.rows[i].isinter === '0' ? '国内' : '国际'
          this.achangeList.rows[i].returnStatus = this.achangeList.rows[i].returnIntegralStatus === '0' ? '未退' : '已退'
          this.achangeList.rows[i].ticStatusRelation = this.achangeList.rows[i].ticStatusRelation === '1' ? '待处理' : '已处理'
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        isintegral: '1',
        dateType: '1',
        ticStatus: '4',
        statedate: '',
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
      this.$refs.refundAby.initComponent({ refundType: val, operateType: type, id: params.id, ticketid: params.ticketid })
    },
    // 退积分确认弹出框
    handleConfirm (id) {
      this.editVisible = true
      this.editForm.id = id
    },
    // 退积分确认弹出框 -- 提交
    popupEdit () {
      let data = JSON.parse(JSON.stringify(this.editForm))
      this.$confirm('是否确认退积分?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        comfirmReturnIntegral(data).then(res => {
          this.$message.success(res.message)
          this.editVisible = false
          this.getAchangeList(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消补退款审核')
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .check-ipt {
    width: 120px;
    margin-top: 10px;
  }
  .check-item {
    float: left;
    padding-left: 10px;
  }
</style>
