'<template>
  <div>
    <!--<h1>退票审核弹出框</h1>-->
    <!--退票审核-->
    <el-dialog v-dialogDrag :title="dialogTitle" :visible.sync="dialogVisible" width="80%">
      <div class="dialog-container">
        <div class="dialog-main" style="padding: 0">
          <el-collapse v-model="activeNamesRefund">
            <el-collapse-item title="退款航段参照表" name="order">
              <el-table
                :data="reviewdetail"
                border
                :header-cell-style="tableAttributes.selfHeaderCellStyle"
                :cell-style="tableAttributes.selfCellStyle">
                <el-table-column label="订单类型" prop="orderType"></el-table-column>
                <el-table-column label="航班号" prop="fnumber" min-width="80"></el-table-column>
                <el-table-column label="航段" prop="sail" min-width="100"></el-table-column>
                <el-table-column label="起飞日期" prop="fdate" min-width="120"></el-table-column>
                <el-table-column label="起飞时间" prop="ftime" min-width="120"></el-table-column>
                <el-table-column label="舱位" prop="seat"></el-table-column>
                <el-table-column label="票面价" porp="fare">
                  <template slot-scope="scope">
                    {{scope.row.fare | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="机建" prop="airporttax">
                  <template slot-scope="scope">
                    {{scope.row.airporttax | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="燃油" prop="fueltax">
                  <template slot-scope="scope">
                    {{scope.row.fueltax | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="航意险" prop="unexoInsr">
                  <template slot-scope="scope">
                    {{scope.row.unexoInsr | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="航延险" prop="delayInsr">
                  <template slot-scope="scope">
                    {{scope.row.delayInsr | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="地铁票金额" min-width="110" prop="fmoney">
                  <template slot-scope="scope">
                    {{scope.row.railwayMoney | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="优惠金额" prop="fmoney">
                  <template slot-scope="scope">
                    {{scope.row.fmoney | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="支付金额" prop="paymoney">
                  <template slot-scope="scope">
                    {{scope.row.paymoney | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="红包金额" prop="walletMoney"></el-table-column>
                <el-table-column label="支付积分" prop="integralFare"></el-table-column>
                <el-table-column label="疫情隔离险" prop="epidemicInsr" min-width="140"></el-table-column>
                <el-table-column label="航空退票险" prop="refundTicketInsr" min-width="140"></el-table-column>
                <el-table-column label="退改签描述" fixed="left" min-width="140">
                  <template slot-scope="scope">
                    <el-popover
                      placement="top-start"
                      title="退改签描述"
                      width="200"
                      trigger="hover"
                      :content="scope.row.chgroledesc">
                      <span class="active-text" slot="reference">退改签描述</span>
                    </el-popover>

                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="退款票面信息" name="pay">
              <el-table
                :data="reviewdetail"
                border
                :header-cell-style="tableAttributes.selfHeaderCellStyle"
                :cell-style="tableAttributes.selfCellStyle">
                <el-table-column label="订单日期" prop="orderdate" min-width="120"></el-table-column>
                <el-table-column label="订单号" prop="ordercode" min-width="180"></el-table-column>
                <el-table-column label="PNR" prop="pnr" min-width="120"></el-table-column>
                <el-table-column label="原票号" prop="initialTktNo" min-width="180"></el-table-column>
                <el-table-column label="票号" prop="eticketno" min-width="140"></el-table-column>
                <el-table-column label="旅客姓名" prop="name" min-width="140"></el-table-column>
                <el-table-column label="退票状态" min-width="140">
                  <template slot-scope="scope">
                    {{scope.row.status | refundStatusMap}}
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="退款支付详情" name="refund">
              <el-table
                :data="reviewdetail"
                border
                :header-cell-style="tableAttributes.selfHeaderCellStyle"
                :cell-style="tableAttributes.selfCellStyle">
                <el-table-column label="支付通道" prop="paytypename" min-width="120">
                  <template slot-scope="scope">
                    <span>{{scope.row.paytypename | payTypeMap}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="支付方式" prop="paymethodname" min-width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.paymethodname === 'null'"></span>
                    <span v-else>{{scope.row.paymethodname}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="支付银行" prop="bankname" min-width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.bankname === 'null'"></span>
                    <span v-else>{{scope.row.bankName}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="支付卡号" prop="a1ccno" min-width="160"></el-table-column>
                <el-table-column label="支付订单号" prop="paybillno" min-width="180"></el-table-column>
                <el-table-column label="不退保险费" prop="refundChargeInsurance" min-width="120"></el-table-column>
                <el-table-column label="现金退款" prop="actualRefundMoney" min-width="140">
                  <template slot-scope="scope">
                    <el-input size="medium" v-model.number="scope.row.actualRefundMoney" placeholder="现金退款" clearable></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="现金手续费" prop="refundCharge" v-if="refundParam.refundType === 'first' || refundParam.refundType === 'second'" min-width="160">
                  <template slot-scope="scope">
                    <div>
                      <el-input placeholder="现金手续费" size="medium" v-model.number="scope.row.refundCharge" clearable></el-input>
                    </div>
                  </template>
                </el-table-column>
                <!-- 把退票手续费改为现金手续费 -->
                <el-table-column label="现金手续费" prop="refundCharge" min-width="160" v-else>
                  <template slot-scope="scope">
                    {{scope.row.refundCharge | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="红包退款" prop="actualRefundWallet" min-width="160">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.actualRefundWallet" placeholder="红包退款" clearable></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="红包手续费" prop="refundWalletCharge" min-width="160" v-if="refundParam.refundType === 'first' || refundParam.refundType === 'second'">
                  <template slot-scope="scope">
                    <div>
                      <el-input placeholder="红包手续费" size="medium" v-model.number="scope.row.refundWalletCharge"  clearable></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="红包手续费" prop="refundWalletCharge" min-width="160" v-else>
                  <template slot-scope="scope">{{scope.row.refundWalletCharge}}</template>
                </el-table-column>
                <el-table-column label="退票手续费(积分)" prop="refundChargeIntegral" v-if="refundParam.refundType === 'first' || refundParam.refundType === 'second'" min-width="160">
                <template slot-scope="scope" v-if="refundParam.refundType === 'first' || refundParam.refundType === 'second'">
                  <div>
                    <el-input clearable size="medium" v-model.number.trim="scope.row.refundChargeIntegral" @change="computeActualRefundIntegral"></el-input>
                  </div>
                </template>
              </el-table-column>
                <el-table-column label="退票手续费(积分)" prop="refundChargeIntegral" min-width="160" v-else></el-table-column>
                <el-table-column label="实际退款(积分)" prop="actualRefundIntegral" min-width="140"></el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="退款申请详情" name="review">
              <el-table
                :data="reviewdetail"
                border
                :header-cell-style="tableAttributes.selfHeaderCellStyle"
                :cell-style="tableAttributes.selfCellStyle">
                <el-table-column label="退票申请时间" prop="happendate" min-width="180">
                  <template slot-scope="scope">
                    {{scope.row.happendate | dateFormater}} {{scope.row.happendtime}}
                  </template>
                </el-table-column>
                <el-table-column label="pnr取消时间" prop="pnrClearTime" min-width="180"></el-table-column>
                <el-table-column label="pnr取消时间差" prop="clearTimeDiff" min-width="180"></el-table-column>
                <el-table-column label="联系人" prop="username" min-width="180"></el-table-column>
                <el-table-column label="联系电话" prop="mobile" min-width="120"></el-table-column>
                <el-table-column label="退票性质" prop="nature" min-width="160">
                  <template slot-scope="scope">
                    <span v-if="scope.row.nature === '0'">
                      非自愿
                      <span v-if="changeSelect">/{{ changeSelect }}</span>
                    </span>
                    <span v-if="scope.row.nature === '1'">自愿</span>
                  </template>
                </el-table-column>
                <el-table-column label="退票原因" prop="reason" min-width="140"></el-table-column>
                <el-table-column label="退款备注" prop="refundRemark" min-width="160">
                  <template slot-scope="scope">
                    <div>
                      <el-input placeholder="退款备注" size="medium" v-model="scope.row.refundRemark" clearable></el-input>
                    </div>
                  </template>
                </el-table-column>
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
            <el-collapse-item title="退款详情" name="detail" v-if="refundParam.refundType === 'confirm' || refundParam.refundType === 'point'">
              <el-table
                :data="reviewdetail"
                :cell-style="tableAttributes.cellStyle">
                <el-table-column label="微信退款单号" prop="wxrefundNo" min-width="180">
                  <template slot-scope="scope">
                    <span v-if="scope.row.wxrefundNo === ''">--</span>
                    <span v-else>{{scope.row.wxrefundNo}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="微信退款失败原因" prop="failReason" min-width="180">
                  <template slot-scope="scope">
                    <span v-if="scope.row.failReason === ''">--</span>
                    <span v-else>{{scope.row.failReason}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <!--附加商品详情-->
            <el-collapse-item title="附加商品详情" name="productInfo">
              <el-table
                :data="productInfo"
                border
                :header-cell-style="tableAttributes.selfHeaderCellStyle"
                :cell-style="tableAttributes.selfCellStyle">
                <el-table-column label="商品名称" prop="productName" min-width="140"></el-table-column>
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
          <el-button size="medium" v-if="refundParam.refundType === 'first' || refundParam.refundType === 'second'" @click="refundAudit">退票审核</el-button>
          <el-button size="medium" v-if="(refundParam.refundType === 'first' || refundParam.refundType === 'second')" @click="refundRefuse">退票拒绝</el-button>
          <el-button size="medium" v-if="(refundParam.refundType === 'first' || refundParam.refundType === 'second') && refundParam.nature === '非自愿'" @click="involuntaryReview">非自愿审核</el-button>
          <el-button size="medium" v-if="refundParam.refundType === 'second'" @click="voluntaryConversion">非自愿转自愿</el-button>
          <el-button size="medium" v-if="refundParam.refundType === 'confirm'" @click="reexamine">重新审核</el-button>
          <el-button size="medium" v-if="refundParam.refundType === 'confirm'" @click="refundConfirm">退款确认</el-button>
          <el-button size="medium" v-if="refundParam.refundType === 'confirm'" @click="lineHandleScs">线下处理成功</el-button>
          <el-button size="medium" @click="dialogVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <!--审核记录-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisibleReport" width="800px">
      <div class="dialog-container">
        <div class="dialog-main" style="padding: 0">
          <el-collapse v-model="activeNamesReport">
            <el-collapse-item title="审核记录" name="report">
              <el-table
                :data="reviewReport"
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
    <!--非自愿审核-->
    <involuntary-dialog @onCloseDialog="closeParentDialog" ref="involuntaryRve" :reviewParams="reviewParams"></involuntary-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import InvoluntaryDialog from '../components/involuntaryReview'
import { getInvolCardInfo, queryOrderProcessingList, queryAchangeInfo, firstRefundPass, secondRefundPass, refusePass, involTOVol, redoRefundPass, refundConform, underLineRefund } from './api'
import { queryProductOrderDetailList } from '../api'
export default {
  name: 'refundDialog',
  data () {
    return {
      activeNamesReport: ['report'],
      activeNamesRefund: ['order', 'pay', 'refund', 'review', 'detail', 'productInfo', 'involBankCard'],
	    reviewdetail: [], // 退款审核数据
      reviewReport: [], // 审核记录
      refundParam: {},
      productInfo: [],
      dialogVisible: false, // 退款审核弹出框
      dialogVisibleReport: false, // 审核记录弹出框
      dialogTitle: '', // 弹出框标题
      reviewParams: {
	      refundCharge: '0',
	      paymoney: '0',
	      actualRefundMoney: '0'
      },
      disabledAudit: false,
      disabledRefuse: false,
      disabled: false,
      // 不退保险费
      refundChargeInsurance: '',
      involCardInfo: [] // 退款账户信息
    }
  },
  props: {
    changeSelect: {
      default: ''
    }
  },
  components: {
    InvoluntaryDialog
  },
  mounted () {

  },
  created () {
  },
  computed: {
    refundChargeInsuranceCompute: function () {
      let ins = 0
      if (this.reviewdetail && this.reviewdetail[0] && this.reviewdetail[0].refundChargeInsurance) {
        ins = parseFloat(this.reviewdetail[0].refundChargeInsurance)
        // console.log(ins)
      }
      return ins
    },
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    closeParentDialog () {
      this.dialogVisible = false
      this.$emit('closeParentDialog')
    },
    initComponent (param) {
      this.refundParam = param
      if (this.refundParam.operateType === 0) {
        this.dialogVisibleReport = true
        this.dialogTitle = '审核记录'
        this.getReviewReport(this.refundParam.ticketid)
      } else {
        this.dialogVisible = true
        this.dialogTitle = '退票审核'
        this.getReviewDetail(this.refundParam)
        this.queryProductInfoByTicketId(param.ticketid)
        this.queryInvolCardInfo()
      }
    },
    // 根据involCardId查询退款账户信息
    queryInvolCardInfo () {
      if (!this.refundParam.involCardId) {
        this.involCardInfo = []
        return false
      }
      getInvolCardInfo({ involCardId: this.refundParam.involCardId })
        .then(res => {
          console.log(res)
          this.involCardInfo = [res.obj]
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message
          })
        })
    },
    // 根据ticketId获取附加商品数据
    queryProductInfoByTicketId (ticketId) {
      queryProductOrderDetailList({ ticketid: ticketId, page: 1, rows: 500 })
        .then(res => {
          this.productInfo = res.rows
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取审核记录
    getReviewReport (id) {
      queryOrderProcessingList({ ticketid: id }).then(res => {
        this.reviewReport = res.rows
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取审核详情
    getReviewDetail (params) {
      queryAchangeInfo({ idPara: params.id }).then(res => {
        this.reviewdetail = JSON.parse(JSON.stringify(res.rows))
        if (params.isairrailway === '1' && params.payAmount) {
          this.reviewdetail[0].isairrailway = params.isairrailway
          this.reviewdetail[0].payAmount = params.payAmount
        }
        for (let i = 0; i < this.reviewdetail.length; i++) {
          let item = this.reviewdetail[i]
          if (item.refundChargeInsurance) {
            // item.actualRefundMoney = parseInt(item.actualRefundMoney) - parseInt(item.refundChargeInsurance)
            // console.log(i)
          }
        }
        this.handlerefundParam()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 退票审核
    refundAudit () {
      this.$confirm('已确认退票手续费和实际退款，并提交审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
      	this.handlerefundParam()
        let data = JSON.parse(JSON.stringify(this.reviewParams))
        if (this.refundParam.refundType === 'first') {
          this.handleFirstRefund(data)
        } else {
          this.handleSecondRefund(data)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退款审核'
        })
      })
    },
    handlerefundParam () {
      if (this.refundParam.refundType === 'first') {
        let data = {
          idPara: this.reviewdetail[0].id,
          refundCharge: this.reviewdetail[0].refundCharge,
          actualRefundMoney: this.reviewdetail[0].actualRefundMoney,
          refundRemark: this.reviewdetail[0].refundRemark,
          actualRefundIntegral: this.reviewdetail[0].actualRefundIntegral,
          refundChargeIntegral: this.reviewdetail[0].refundChargeIntegral,
	        actualRefundWallet: this.reviewdetail[0].actualRefundWallet,
	        paymoney: this.reviewdetail[0].paymoney,
	        refundWalletCharge: this.reviewdetail[0].refundWalletCharge,
	        walletMoney: this.reviewdetail[0].walletMoney
        }
        this.reviewParams = data
      } else {
        let data = {
          idPara: this.reviewdetail[0].id,
          initialTktNo: this.reviewdetail[0].initialTktNo,
          refundCharge: this.reviewdetail[0].refundCharge,
          actualRefundMoney: this.reviewdetail[0].actualRefundMoney,
          refundRemark: this.reviewdetail[0].refundRemark,
          paymoney: this.reviewdetail[0].paymoney,
          integralFare: this.reviewdetail[0].integralFare,
          actualRefundIntegral: this.reviewdetail[0].actualRefundIntegral,
          refundChargeIntegral: this.reviewdetail[0].refundChargeIntegral,
	        actualRefundWallet: this.reviewdetail[0].actualRefundWallet,
	        refundWalletCharge: this.reviewdetail[0].refundWalletCharge,
	        walletMoney: this.reviewdetail[0].walletMoney
        }
        this.reviewParams = data
        // console.log(this.reviewParams)
      }
    },
    // 一审
    handleFirstRefund (data) {
      firstRefundPass(data).then(res => {
        this.$message({
          type: 'success',
          message: '审核成功'
        })
        this.dialogVisible = false
        this.$emit('tableList', 1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 二审
    handleSecondRefund (data) {
      secondRefundPass(data).then(res => {
        this.$message({
          type: 'success',
          message: '审核成功'
        })
        this.dialogVisible = false
        this.$emit('tableList', 1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 退票拒绝
    refundRefuse () {
      let data = {
        idPara: this.reviewdetail[0].id,
        refundRemark: this.reviewdetail[0].refundRemark
      }
      this.$prompt('请填写拒绝原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(({ value }) => {
        if (this.refundParam.refundType === 'first') {
          // 一审
          data.firstAuditReason = value
        } else if (this.refundParam.refundType === 'second') {
          data.secondAuditReason = value
        }
        refusePass(data).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.dialogVisible = false
          this.$emit('tableList', 1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退票拒绝'
        })
      })
    },
    // 非自愿转自愿
    voluntaryConversion () {
      let data = {
        idPara: this.reviewdetail[0].id
      }
      this.$confirm('是否确认转换?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        involTOVol(data).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.dialogVisible = false
          this.$emit('tableList', 1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消非自愿转自愿'
        })
      })
    },
    // 切换弹框
    involuntaryReview () {
      let changeId = this.reviewdetail[0].id
      let refundType = this.refundParam.refundType
      let refundRemark = this.reviewdetail[0].refundRemark
      this.$refs.involuntaryRve.initComponent({ id: changeId, refundType: refundType, refundRemark: refundRemark })
    },
    // 重新审核
    reexamine () {
      let data = {
        idPara: this.reviewdetail[0].id,
        refundRemark: this.reviewdetail[0].refundRemark
      }
      this.$confirm('是否确认重新审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        redoRefundPass(data).then(res => {
          // console.log(1112)
          this.$message({
            type: 'success',
            message: res.message
          })
          this.dialogVisible = false
          this.$emit('tableList', 1, this.pagination.pageSize)
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
        idPara: this.reviewdetail[0].id,
        ticketNo: this.reviewdetail[0].eticketno,
        flightNo: this.reviewdetail[0].fnumber,
        refundRemark: this.reviewdetail[0].refundRemark
      }
      this.$confirm('是否确认提交退款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        refundConform(data).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.dialogVisible = false
          this.$emit('tableList', 1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交退款'
        })
      })
    },
    // 线下处理成功
    lineHandleScs () {
      let data = {
        idPara: this.reviewdetail[0].id,
        ticketNo: this.reviewdetail[0].eticketno,
        flightNo: this.reviewdetail[0].fnumber,
        refundRemark: this.reviewdetail[0].refundRemark
      }
      this.$confirm('是否确认线下处理成功?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        underLineRefund(data).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.dialogVisible = false
          this.$emit('tableList', 1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消线下处理成功'
        })
      })
    },
    // 计算实际退款
    // computeActualRefundMoney () {
    //   let reviewdetail = this.reviewdetail[0]
    //   if (reviewdetail.paymoney === '') {
    //     if (reviewdetail.refundCharge > 0) {
    //       reviewdetail.refundCharge = parseInt(reviewdetail.refundCharge)
    //       reviewdetail.actualRefundMoney = '-' + parseInt(reviewdetail.refundCharge)
    //       this.reviewParams.refundCharge = parseInt(reviewdetail.refundCharge)
    //       this.reviewParams.actualRefundMoney = '-' + parseInt(reviewdetail.refundCharge)
    //     } else if (reviewdetail.refundCharge === '0') {
    //       reviewdetail.refundCharge = '0'
    //       reviewdetail.actualRefundMoney = '0'
    //       this.reviewParams.refundCharge = '0'
    //       this.reviewParams.actualRefundMoney = '0'
    //     }
    //   } else {
    //     if (reviewdetail.refundCharge === '') {
    //       reviewdetail.refundCharge = ''
    //       this.reviewParams.refundCharge = ''
    //       if (reviewdetail.isairrailway === '1' && reviewdetail.payAmount) {
    //         reviewdetail.actualRefundMoney = parseInt(reviewdetail.paymoney) - parseInt(reviewdetail.payAmount)
    //         this.reviewParams.actualRefundMoney = parseInt(reviewdetail.paymoney) - parseInt(reviewdetail.payAmount)
    //       } else {
    //         reviewdetail.actualRefundMoney = parseInt(reviewdetail.paymoney)
    //         this.reviewParams.actualRefundMoney = parseInt(reviewdetail.paymoney)
    //       }
    //     } else {
    //       reviewdetail.refundCharge = parseInt(reviewdetail.refundCharge)
    //       this.reviewParams.refundCharge = parseInt(reviewdetail.refundCharge)
    //       if (reviewdetail.isairrailway === '1' && reviewdetail.payAmount) {
    //         reviewdetail.actualRefundMoney = parseInt(reviewdetail.paymoney) - parseInt(reviewdetail.refundCharge) - parseInt(reviewdetail.payAmount)
    //         this.reviewParams.actualRefundMoney = parseInt(reviewdetail.paymoney) - parseInt(reviewdetail.refundCharge) - parseInt(reviewdetail.payAmount)
    //       } else {
    //         reviewdetail.actualRefundMoney = parseInt(reviewdetail.paymoney) - parseInt(reviewdetail.refundCharge)
    //         this.reviewParams.actualRefundMoney = parseInt(reviewdetail.paymoney) - parseInt(reviewdetail.refundCharge)
    //       }
    //     }
    //   }
    //   if (reviewdetail.refundChargeInsurance) {
    //     reviewdetail.actualRefundMoney = parseInt(reviewdetail.actualRefundMoney) - parseInt(reviewdetail.refundChargeInsurance)
    //     this.reviewParams.actualRefundMoney = parseInt(reviewdetail.actualRefundMoney) - parseInt(reviewdetail.refundChargeInsurance)
    //   }
    //   // console.log(this.reviewParams)
    // },
    // 计算实际退积分
    computeActualRefundIntegral () {
      let reviewdetail = this.reviewdetail[0]
      if (reviewdetail.integralFare === '') {
        if (reviewdetail.refundChargeIntegral > 0) {
          reviewdetail.refundChargeIntegral = parseInt(reviewdetail.refundChargeIntegral)
          reviewdetail.actualRefundIntegral = '-' + parseInt(reviewdetail.refundChargeIntegral)
          this.reviewParams.refundChargeIntegral = parseInt(reviewdetail.refundChargeIntegral)
          this.reviewParams.actualRefundIntegral = '-' + parseInt(reviewdetail.refundChargeIntegral)
        } else if (reviewdetail.refundChargeIntegral === '0') {
          reviewdetail.refundChargeIntegral = '0'
          reviewdetail.actualRefundIntegral = '0'
          this.reviewParams.refundChargeIntegral = '0'
          this.reviewParams.actualRefundIntegral = '0'
        }
      } else {
        if (reviewdetail.refundChargeIntegral === '') {
          reviewdetail.refundChargeIntegral = parseInt(reviewdetail.refundChargeIntegral)
          reviewdetail.actualRefundIntegral = parseInt(reviewdetail.integralFare)
          this.reviewParams.refundChargeIntegral = parseInt(reviewdetail.refundChargeIntegral)
          this.reviewParams.actualRefundIntegral = parseInt(reviewdetail.integralFare)
        } else {
          reviewdetail.refundChargeIntegral = parseInt(reviewdetail.refundChargeIntegral)
          reviewdetail.actualRefundIntegral = parseInt(reviewdetail.integralFare) - parseInt(reviewdetail.refundChargeIntegral)
          this.reviewParams.refundChargeIntegral = parseInt(reviewdetail.refundChargeIntegral)
          this.reviewParams.actualRefundIntegral = parseInt(reviewdetail.integralFare) - parseInt(reviewdetail.refundChargeIntegral)
        }
      }
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
</style>
