<template>
  <div class="container">
    <!--<h1>退款确认弹出框</h1>-->
    <el-dialog v-dialogDrag :title="refundAuditList.dialogTitle" :visible.sync="refundAuditList.editVisible" width="80%">
      <div class="dialog-container" v-loading="loading">
        <div class="dialog-main" style="padding: 0">
          <el-collapse v-model="activeName">
            <el-collapse-item title="订单信息" name="order">
              <el-table
                :data="refundList"
                border
                :header-cell-style="tableAttributes.selfHeaderCellStyle"
                :cell-style="tableAttributes.selfCellStyle">
                <el-table-column label="订单编号" prop="ordercode" min-width="160"></el-table-column>
                <el-table-column label="渠道编号" prop="channel" min-width="100">
                  <template slot-scope="scope">
                    <div>{{scope.row.channel | channelMap}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="订单类型" prop="orderType"></el-table-column>
                <el-table-column label="PNR" prop="pnr" min-width="100"></el-table-column>
                <el-table-column label="订单时间" prop="orderdate" min-width="160"></el-table-column>
<!--                <el-table-column label="订单类型" prop="isIntegral" min-width="100"></el-table-column>-->
                <el-table-column label="产品名称" prop="productName" min-width="100"></el-table-column>
                <el-table-column label="票面总额" prop="fare" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.fare | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="税费总额" prop="" min-width="100">
                  <!--<template slot-scope="scope">-->
                    <!--{{scope.row.fare | formatPriceMap}}-->
                  <!--</template>-->
                </el-table-column>
                <el-table-column label="订单总额" prop="" min-width="100">
                  <!--<template slot-scope="scope">-->
                    <!--{{scope.row.fare | formatPriceMap}}-->
                  <!--</template>-->
                </el-table-column>
                <el-table-column label="支付总额" prop="paymoney" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.paymoney | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="支付平台" prop="paymethodname" min-width="100">
                  <template slot-scope="scope">
                    <span>{{scope.row.paymethodname | payTypeMap}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="国际/国内" prop="isinter" min-width="100">
                  <template slot-scope="scope">
                    <span>{{scope.row.isinter | isInnerMap}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="联系人" prop="username" min-width="100"></el-table-column>
                <el-table-column label="联系电话" prop="mobile" min-width="120"></el-table-column>
                <el-table-column label="客户类型" prop="passertype" min-width="120">
                  <!--<template slot-scope="scope">-->
                  <!--</template>-->
                </el-table-column>
                <el-table-column label="客户编号" prop="" min-width="100"></el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="退审历史信息" name="history">
              <el-table
                :data="historyList"
                border
                :header-cell-style="tableAttributes.selfHeaderCellStyle"
                :cell-style="tableAttributes.selfCellStyle">
                <el-table-column label="操作人" prop="opAccount" min-width="100"></el-table-column>
                <el-table-column label="操作时间" prop="creatime" min-width="140"></el-table-column>
                <el-table-column label="备注信息" prop="prcsContent" min-width="200"></el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item :title="refundInfoTitle" name="passage">
              <el-table
                :data="refundList"
                border
                :header-cell-style="tableAttributes.selfHeaderCellStyle"
                :cell-style="tableAttributes.selfCellStyle">
                <el-table-column label="退单编号" prop="refundNo" min-width="120"></el-table-column>
                <el-table-column label="退单渠道" prop="" min-width="120">
                  <template slot-scope="scope">
                    <span>{{scope.row.channel | channelMap}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="退票类型" prop="orderType" min-width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.orderType === '0'">普通订单</span>
                    <span v-if="scope.row.orderType === '1'">积分订单</span>
                    <span v-if="scope.row.orderType === '2'">升舱订单</span>
                  </template>
                </el-table-column>
                <el-table-column label="退票备注" prop="refundRemark" min-width="100"></el-table-column>
                <el-table-column label="原票号" prop="initialTktNo" min-width="180"></el-table-column>
                <el-table-column label="票号" prop="eticketno" min-width="180"></el-table-column>
                <el-table-column label="市场方" prop="airways" min-width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.airways === '' || scope.row.airways === null">NS</span>
                    <span v-else>{{scope.row.airways}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="承运方" prop="airline" min-width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.airline === '' || scope.row.airline === null">NS</span>
                    <span v-else>{{scope.row.airways}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="mt-10">
                <el-table
                  :data="refundList"
                  border
                  :header-cell-style="tableAttributes.selfHeaderCellStyle"
                  :cell-style="tableAttributes.selfCellStyle">
                  <el-table-column label="旅客姓名" prop="name" min-width="120"></el-table-column>
                  <el-table-column label="旅客类型" prop="passertype" min-width="120">
                    <template slot-scope="scope">
                      <span>{{scope.row.passertype | passerTypeMap}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="出发" prop="afrom" min-width="120"></el-table-column>
                  <el-table-column label="到达" prop="ato" min-width="120"></el-table-column>
                  <el-table-column label="航段" prop="sail" min-width="120"></el-table-column>
                  <el-table-column label="舱位" prop="seat" min-width="120"></el-table-column>
                  <el-table-column label="国际/国内" prop="isinter" min-width="120">
                    <template slot-scope="scope">
                      <span>{{scope.row.isinter | isInnerMap}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="航班计划出发时间" prop="fdate" min-width="160"></el-table-column>
                  <el-table-column label="退单申请时间" prop="happendate" min-width="140"></el-table-column>
                  <el-table-column label="退票时间差" prop="timeDif" min-width="140"></el-table-column>
                  <el-table-column label="退改文本" prop="reason" min-width="120"></el-table-column>
                  <el-table-column label="航段票面价" prop="fare" min-width="120">
                    <template slot-scope="scope">
                      {{scope.row.fare | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="退票基准" prop="" min-width="120"></el-table-column>
                  <el-table-column label="退票基准价格" prop="" min-width="120">
                    <!--<template slot-scope="scope">-->
                    <!--{{scope.row.paymoney | formatPriceMap}}-->
                    <!--</template>-->
                  </el-table-column>
                  <el-table-column label="退票手续费率" prop="" min-width="120"></el-table-column>
                  <el-table-column label="退票手续费" prop="refundCharge" min-width="120">
                    <template slot-scope="scope">
                      {{scope.row.refundCharge | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="应退票面金额" prop="paymoney" min-width="120">
                    <template slot-scope="scope">
                      {{scope.row.paymoney | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="延误险" prop="delayInsr" min-width="120">
                    <template slot-scope="scope">
                      {{scope.row.delayInsr | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="应退延误险" prop="delayInsr" min-width="120">
                    <template slot-scope="scope">
                      {{scope.row.delayInsr | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="航意险" prop="unexoInsr" min-width="120">
                    <template slot-scope="scope">
                      {{scope.row.unexoInsr | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="应退航意险金额" prop="unexoInsr" min-width="120">
                    <template slot-scope="scope">
                      {{scope.row.unexoInsr | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="地铁票费" prop="railwayMoney" min-width="120">
                    <template slot-scope="scope">
                      {{scope.row.railwayMoney | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="应退地铁票费" prop="railwayRefundMoney" min-width="120">
                    <template slot-scope="scope">
                      {{scope.row.railwayRefundMoney | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="航段机建" prop="airporttax" min-width="120">
                    <template slot-scope="scope">
                      {{scope.row.airporttax | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="应退机建" prop="airporttax" min-width="120">
                    <template slot-scope="scope">
                      {{scope.row.airporttax | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="航段燃油" prop="fueltax" min-width="120">
                    <template slot-scope="scope">
                      {{scope.row.fueltax | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="应退燃油" prop="fueltax" min-width="120">
                    <template slot-scope="scope">
                      {{scope.row.fueltax | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="红包金额" prop="walletMoney" min-width="120">
                    <template slot-scope="scope">
                      {{scope.row.walletMoney}}
                    </template>
                  </el-table-column>
                  <el-table-column label="审核备注" prop="refundRemark" min-width="120"></el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
            <el-collapse-item title="退票单信息" name="refund">
              <el-table
                :data="refundList"
                border
                :header-cell-style="tableAttributes.selfHeaderCellStyle"
                :cell-style="tableAttributes.selfCellStyle">
                <el-table-column label="退单编号" prop="refundNo" min-width="160"></el-table-column>
                <el-table-column label="旅客姓名" prop="name" min-width="120"></el-table-column>
                <el-table-column label="票号" prop="eticketno" min-width="180"></el-table-column>
                <el-table-column label="航段" prop="sail" min-width="120"></el-table-column>
                <el-table-column label="舱位" prop="seat" min-width="180"></el-table-column>
                <el-table-column label="航段总价" prop="paymoney" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.paymoney | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="退票总手续费" prop="refundCharge" min-width="120">
                  <template slot-scope="scope">
                    {{scope.row.refundCharge | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="应退总额" prop="actualRefundMoney" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.actualRefundMoney | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="财务退款时间" min-width="160">
                  <template slot-scope="scope">
                    <div>{{ scope.row.creqdatetime }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="退款支付信息" name="payment">
              <el-table
                :data="refundList"
                border
                :header-cell-style="tableAttributes.selfHeaderCellStyle"
                :cell-style="tableAttributes.selfCellStyle">
                <el-table-column label="退单编号" prop="refundNo" min-width="180"></el-table-column>
                <el-table-column label="支付通道" prop="paytypename" min-width="180">
                  <template slot-scope="scope">
                    <span>{{scope.row.paytypename | payTypeMap}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="支付方式" prop="paymethodname" min-width="120">
                  <template slot-scope="scope">
                    <span>{{scope.row.paymethodname | payTypeMap}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="支付银行" prop="bankname" min-width="180">
                  <template slot-scope="scope">
                    <span v-if="scope.row.bankname === 'null'"></span>
                    <span v-else>{{scope.row.bankName}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="支付卡号" prop="accno" min-width="100"></el-table-column>
                <el-table-column label="支付订单号" prop="paybillno" min-width="180"></el-table-column>
                <el-table-column label="订单支付总额" prop="paymoney" min-width="120"></el-table-column>
                <div v-if="!statusFlag">
                  <!-- 把退票手续费改为现金手续费 -->
                  <el-table-column label="现金手续费" prop="refundCharge" min-width="120">
                    <template slot-scope="scope">
                      <span>{{ scope.row.refundCharge }}</span>
<!--                      <el-input placeholder="手续费" size="medium" v-model="scope.row.refundCharge" clearable></el-input>-->
                    </template>
                  </el-table-column>
                  <el-table-column label="退票手续费(积分)" prop="refundChargeIntegral" min-width="160">
                    <template slot-scope="scope">
<!--                      <el-input clearable size="medium" v-model="scope.row.refundChargeIntegral" @change="computeActualRefundIntegral"></el-input>-->
                      <span>{{ scope.row.refundChargeIntegral }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="应退金额" prop="actualRefundMoney" min-width="120">
                    <template slot-scope="scope">
                      <span>{{ scope.row.actualRefundMoney }}</span>
<!--                      <el-input clearable size="medium" v-model="scope.row.actualRefundMoney"></el-input>-->
                    </template>
                  </el-table-column>
                  <el-table-column label="实退金额" prop="actualRefundMoney" min-width="120"></el-table-column>
                  <!-- 增加红包退款 -->
                   <el-table-column label="红包退款" min-width="120" prop="actualRefundWallet">
                     <template slot-scope="scope">
                       <span>{{scope.row.actualRefundWallet}}</span>
                     </template>
                   </el-table-column>
                   <!-- 增加红包手续费 -->
                   <el-table-column label="红包手续费" min-width="120" prop="refundWalletCharge">
                     <template slot-scope="scope">
                       <span>{{scope.row.refundWalletCharge}}</span>
                     </template>
                   </el-table-column>
                  <el-table-column label="退款备注" prop="refundRemark" min-width="120">
                    <template slot-scope="scope">
                      <el-input size="medium" v-model="scope.row.refundRemark"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="应退积分" prop="actualRefundIntegral" min-width="120"></el-table-column>
                  <el-table-column label="实退积分" prop="actualRefundIntegral" min-width="120"></el-table-column>
                  <el-table-column label="疫情隔离险" prop="epidemicInsr" min-width="140"></el-table-column>
                  <el-table-column label="航空退票险" prop="refundTicketInsr" min-width="140"></el-table-column>
                </div>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="退款账户信息" name="involBankCard">
              <el-table
                :data="involCardInfo"
                border
                :header-cell-style="tableAttributes.selfHeaderCellStyle"
                :cell-style="tableAttributes.selfCellStyle">
                <el-table-column label="姓名" prop="accountName"></el-table-column>
                <el-table-column label="退款银行" prop="bankName"></el-table-column>
                <el-table-column label="银行卡号" prop="accountNumber"></el-table-column>
                <el-table-column label="银行预留手机号" prop="cardMobile"></el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="附加商品详情" name="production">
              <el-table
                :data="productInfo"
                border
                :header-cell-style="tableAttributes.selfHeaderCellStyle"
                :cell-style="tableAttributes.selfCellStyle">
                <el-table-column label="商品名称" prop="productName" min-width="80"></el-table-column>
                <el-table-column label="数量" prop="saleNum" min-width="60"></el-table-column>
                <el-table-column label="单价" prop="salePrice" min-width="60"></el-table-column>
                <el-table-column label="支付金额" prop="paymoney" min-width="80"></el-table-column>
                <el-table-column label="领取人" prop="receiveName" min-width="80"></el-table-column>
                <el-table-column label="领取人电话" prop="receiveMobile" min-width="120"></el-table-column>
                <el-table-column label="领取人座位号" prop="receiveSeatno" min-width="120"></el-table-column>
                <el-table-column label="机票号" min-width="140" prop="ticketNo"></el-table-column>
                <el-table-column label="订单状态" min-width="80">
                  <template slot-scope="scope">
                    <div>{{ scope.row.detailStatus | syncProductStatusMap }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="dialog-footer">
          <!--<el-button size="medium" v-if="refundAuditList.type === 'first' || refundAuditList.type === 'second'" @click="refundAudit">退票审核</el-button>-->
          <!--<el-button size="medium" v-if="refundAuditList.type === 'first' || refundAuditList.type === 'second'" @click="refundRefuse">退票拒绝</el-button>-->
          <!--<el-button size="medium" v-if="refundAuditList.type === 'second'" @click="voluntaryConversion">非自愿转自愿</el-button>-->
          <el-button size="medium" v-if="refundAuditList.type === 'confirm'" @click="reexamine">重新审核</el-button>
          <el-button size="medium" v-if="refundAuditList.type === 'confirm'" @click="refundConfirm">退款确认</el-button>
          <el-button size="medium" v-if="refundAuditList.type === 'confirm'" @click="underLineVisible = true">线下处理成功</el-button>
          <el-button size="medium" @click="refundAuditList.editVisible = false">返回</el-button>
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
            <el-button size="medium" :disabled="!underLineTime" @click="lineHandleScs">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </el-dialog>
    <!--审核记录-->
    <el-dialog :title="refundAuditList.dialogTitle" :visible.sync="refundAuditList.dialogVisibleReport" width="800px">
      <div class="dialog-container">
        <div class="dialog-main" style="padding: 0">
          <el-collapse v-model="activeNamesReport">
            <el-collapse-item title="审核记录" name="report">
              <el-table
                :data="historyList"
                :cell-style="tableAttributes.cellStyle">
                <el-table-column label="处理人" prop="opAccount" min-width="180">
                </el-table-column>
                <el-table-column label="处理时间" prop="creatime" min-width="180"></el-table-column>
                <el-table-column label="处理类型" prop="prcsType" min-width="180">
                  <template slot-scope="scope">
                    <span v-if="scope.row.prcsType === '2'">退票审核</span>
                  </template>
                </el-table-column>
                <el-table-column label="记录内容" prop="prcsContent" min-width="180"></el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  getInvolCardInfo,
  queryAchangeInfo,
  queryOrderProcessingList,
  redoRefundPass,
  refundConform,
  underLineRefund
} from './api'
import { queryProductOrderDetailList } from '../api'

export default {
  name: 'refundConfirm',
  data () {
    return {
      activeName: ['order', 'history', 'passage', 'refund', 'payment', 'productInfo', 'involBankCard'],
      activeNamesReport: ['report'],
      refundList: [], // 订单详情
      historyList: [], // 退审历史信息
      productInfo: [], // 附加商品详情
      refundInfoTitle: '', // 航段标题
      statusFlag: false,
      loading: false,
      underLineTime: '',
      underLineVisible: false,
      underLineLoading: false,
      involCardInfo: []
    }
  },
  props: {
    refundAuditList: {
      type: Object,
      required: true
    }
  },
  mounted () {
  },
  created () {
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    queryInvolCardInfo (data) {
      if (!data.involCardId) {
        this.involCardInfo = []
        return false
      }
      getInvolCardInfo(data)
        .then(res => {
          this.involCardInfo = [res.obj]
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message
          })
        })
    },
    // 获取附加商品数据根据ticketId
    queryProductInfoByTicketId (ticketId) {
      queryProductOrderDetailList({ ticketid: ticketId, page: 1, rows: 500 })
        .then(res => {
          console.log(res)
          this.productInfo = res.rows
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取订单详情
    getrefundData (data) {
      queryAchangeInfo(data).then(res => {
        this.refundList = res.rows
        this.refundInfoTitle = '航段：' + this.refundList[0].afrom + '-' + this.refundList[0].ato
        this.dataParams(this.refundList)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取退审历史信息
    getHistoryData (data) {
      queryOrderProcessingList(data).then(res => {
        this.historyList = res.rows
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    dataParams (params) {
      if (params[0].status === '6' || params[0].status === '7') {
        this.statusFlag = true
      } else {
        this.statusFlag = false
      }
    },
    // 计算实际退款
    // computeActualRefundMoney () {
    //   let reviewdetail = this.refundList[0]
    //   if (reviewdetail.paymoney === '') {
    //     if (reviewdetail.refundCharge > 0) {
    //       reviewdetail.actualRefundMoney = '-' + parseInt(reviewdetail.refundCharge)
    //     } else if (reviewdetail.refundCharge === '0') {
    //       reviewdetail.actualRefundMoney = '0'
    //     }
    //   } else {
    //     if (reviewdetail.refundCharge === '') {
    //       reviewdetail.actualRefundMoney = parseInt(reviewdetail.paymoney)
    //     } else {
    //       reviewdetail.actualRefundMoney = parseInt(reviewdetail.paymoney) - parseInt(reviewdetail.refundCharge)
    //     }
    //   }
    // },
    // 计算实际退积分
    computeActualRefundIntegral () {
      let reviewdetail = this.refundList[0]
      if (reviewdetail.integralFare === '') {
        if (reviewdetail.refundChargeIntegral > 0) {
          reviewdetail.actualRefundIntegral = '-' + parseInt(reviewdetail.refundChargeIntegral)
        } else if (reviewdetail.refundChargeIntegral === '0') {
          reviewdetail.actualRefundIntegral = '0'
        }
      } else {
        if (reviewdetail.refundChargeIntegral === '') {
          reviewdetail.actualRefundIntegral = reviewdetail.integralFare
        } else {
          reviewdetail.actualRefundIntegral = parseInt(reviewdetail.integralFare) - parseInt(reviewdetail.refundChargeIntegral)
        }
      }
    },
    // 重新审核
    reexamine () {
      let data = {
        idPara: this.refundList[0].id,
        refundRemark: this.refundList[0].refundRemark
      }
      this.$confirm('是否确认重新审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        redoRefundPass(data).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.refundAuditList.editVisible = false
          this.$emit('closeRefundDialog')
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重新审核'
        })
      })
    },
    // 退款确认
    refundConfirm () {
      let data = {
        idPara: this.refundList[0].id,
        ticketNo: this.refundList[0].eticketno,
        flightNo: this.refundList[0].fnumber,
        refundRemark: this.refundList[0].refundRemark
      }
      this.$confirm('是否确认提交退款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.loading = true
        refundConform(data).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.$emit('closeRefundDialog')
          this.refundAuditList.editVisible = false
        }).catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退款确认'
        })
      })
    },
    // 线下处理弹框
    switchDialog () {
      this.underLineVisible = true
    },
    // 线下处理成功
    lineHandleScs () {
      let data = {
        idPara: this.refundList[0].id,
        ticketNo: this.refundList[0].eticketno,
        flightNo: this.refundList[0].fnumber,
        refundRemark: this.refundList[0].refundRemark,
        creqdatetime: this.underLineTime
      }
      this.$confirm('是否确认线下处理成功?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.underLineLoading = true
        underLineRefund(data).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.underLineLoading = false
          this.underLineVisible = false
          this.refundAuditList.editVisible = false
          this.$emit('closeRefundDialog')
        }).catch(err => {
          this.underLineLoading = false
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消线下处理成功'
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
