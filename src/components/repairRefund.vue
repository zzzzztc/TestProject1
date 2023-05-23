<template>
  <div>
    <!--<h1>补退票弹出框</h1>-->
    <el-dialog v-dialogDrag title="补退款详情" :visible.sync="repairRefundList.editVisible" width="80%">
      <div class="dialog-container" v-loading="loading">
        <div class="dialog-main" style="padding: 0">
          <el-collapse v-model="activeName">
            <el-collapse-item title="订单信息" name="order">
              <el-table
                :data="frameList"
                :cell-style="tableAttributes.cellStyle">
                <el-table-column label="订单编号" prop="order_code" min-width="120"></el-table-column>
                <el-table-column label="渠道编号" prop="channel" min-width="100">
                  <template slot-scope="scope">
                    <div>{{scope.row.channel | channelMap}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="PNR" prop="pnr" min-width="100"></el-table-column>
                <el-table-column label="乘客姓名" prop="passenger" min-width="100"></el-table-column>
                <el-table-column label="乘客电话" prop="phone" min-width="100"></el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="支付信息" name="payment">
              <el-table
                :data="frameList"
                :cell-style="tableAttributes.cellStyle">
                <el-table-column label="银行订单编号" min-width="120">
                  <template>
                    {{ row.bank_code }}
                  </template>
                </el-table-column>
                <el-table-column label="支付方式" prop="pay_type" min-width="100">
                  <template>
                    <span>{{row.pay_type | payTypeMap}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="PNR" prop="pnr" min-width="100"></el-table-column>
                <el-table-column label="支付金额" prop="pay_amounts" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.pay_amounts | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="支付状态" prop="paystatus" min-width="100">
                  <template slot-scope="scope">
                   {{scope.row.paystatus | payStatusMap}}
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item :title="refundInfoTitle" name="refund">
              <el-table
                :data="frameList"
                :cell-style="tableAttributes.cellStyle">
                <el-table-column :label="refundInfoLabel" prop="apply_no" min-width="260"></el-table-column>
                <el-table-column label="申请时间" prop="apply_date" min-width="120">
                  <template slot-scope="scope">
                    {{scope.row.apply_date | dateFormater}}
                  </template>
                </el-table-column>
                <el-table-column label="退款原因" prop="apply_remark" min-width="120"></el-table-column>
                <el-table-column label="补退款状态" prop="refund_status" min-width="140">
                  <template slot-scope="scope">
                    {{scope.row.refund_status | refundStatusMap}}
                  </template>
                </el-table-column>
                <el-table-column label="退款失败原因" prop="wx_refund_error_msg"></el-table-column>
                <el-table-column label="补退款金额" prop="refund_amounts" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.refund_amounts_actual | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="红包退款" prop="actual_refund_wallet" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.actual_refund_wallet}}
                  </template>
                </el-table-column>
                <el-table-column label="可退红包" prop="refundable_wallet_money" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.refundable_wallet_money}}
                  </template>
                </el-table-column>
                <el-table-column label="申请人" prop="apply_op" min-width="120"></el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="审核信息" name="audity">
              <el-table
                :data="frameList"
                :cell-style="tableAttributes.cellStyle">
                <el-table-column label="审核时间" prop="audit_date" min-width="160"></el-table-column>
                <el-table-column label="审核人" prop="audit_op" min-width="120"></el-table-column>
                <el-table-column label="审核备注" prop="audit_remark" min-width="180">
                  <template slot-scope="scope">
                      <el-input v-if="repairRefundList.type === 'audity'" placeholder="审核备注" size="medium" v-model="scope.row.audit_remark" clearable></el-input>
                      <div v-else>{{scope.row.audit_remark}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="退款人" prop="refund_amounts_op" min-width="120"></el-table-column>
                <el-table-column label="退款备注" prop="refund_amounts_remark" min-width="180">
                  <template slot-scope="scope">
                    <el-input v-if="repairRefundList.type === 'refund'" placeholder="退款备注" size="medium" v-model="scope.row.refund_amounts_remark" clearable></el-input>
                    <div v-else>{{scope.row.refund_amounts_remark}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="退款金额" prop="refund_amounts" min-width="100">
                  <template slot-scope="scope">
                    <el-input v-if="repairRefundList.type === 'audity' && repairRefundList.type === 'refund'" placeholder="退款金额" size="medium" v-model="scope.row.refund_amounts" clearable></el-input>
                    <div v-else>{{scope.row.refund_amounts | formatPriceMap}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="可退款金额" prop="refundable" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.refundable | formatPriceMap}}
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="退款申请详情" name="apply" v-if="repairRefundList.type !== 'apply'">
              <el-table
                :data="frameList"
                :cell-style="tableAttributes.cellStyle">
                <el-table-column label="退款申请单号" prop="apply_no_t" min-width="180"></el-table-column>
                <el-table-column label="申请时间" prop="apply_date_t" min-width="120">
                  <template slot-scope="scope">
                    {{scope.row.apply_date_t | dateFormater}}
                  </template>
                </el-table-column>
                <el-table-column label="申请备注" prop="apply_remark_t" min-width="180"></el-table-column>
                <el-table-column label="应退金额" prop="refund_amounts_t" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.refund_amounts_t | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="退款金额" prop="refund_amounts_actual_t" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.refund_amounts_actual_t | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="退款状态" prop="refund_status_t" min-width="120">
                  <template slot-scope="scope">
                    {{scope.row.refund_status_t | refundStatusMap}}
                  </template>
                </el-table-column>
                <el-table-column label="退款款完成时间" prop="refund_amounts_date" min-width="180"></el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="dialog-footer">
          <el-button size="medium" v-if="repairRefundList.type === 'apply'" @click="handleApply(0, null)">补退款申请</el-button>
          <el-button size="medium" v-if="repairRefundList.type === 'audity'" @click="handleAudity">补退款审核</el-button>
          <el-button size="medium" v-if="repairRefundList.type === 'audity'" @click="handleRepairRefuse">补退款拒绝</el-button>
          <el-button size="medium" v-if="repairRefundList.type === 'refund'" @click="handleAdopt">退款通过</el-button>
          <el-button size="medium" v-if="repairRefundList.type === 'refund'" @click="underLineVisible = true">线下退款通过</el-button>
          <el-button size="medium" v-if="repairRefundList.type === 'refund'" @click="handleRefuse">退款拒绝</el-button>
          <el-button size="medium" @click="repairRefundList.editVisible = false">取消</el-button>
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
            <el-button size="medium" :disabled="!underLineTime" @click="handleLineAdopt">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </el-dialog>
    <!--申请补退款弹出框-->
    <el-dialog title="申请补退款" :visible.sync="refundVisible" width="350px">
      <div v-loading="loading" class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">现金退款</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="现金退款" v-model="refundAmountsActual" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !refundAmountsActual">现金退款不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">红包退款</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="红包退款" v-model="actualRefundWallet" size="medium"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">申请备注</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="4" clearable placeholder="申请备注" v-model="applyRemark" size="medium"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" @click="refundVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { refundInfo, apply, repairRefundInfo, auditPass, auditRefuse, refundPass, refundRefuse } from './api'
import { underLineRefund } from '../views/repairRefundManage/repairRefundRefund/api'

export default {

  name: 'index',
  data () {
    return {
      activeName: ['order', 'payment', 'refund', 'audity', 'apply'],
      frameList: [], // 弹出框表格数据
      refundAmountsActual: '', // 输入补退款金额
	    actualRefundWallet: '', // 红包退款
      applyRemark: '', // 申请备注
      refundInfoTitle: '', // 退款信息/补退款 标题
      refundInfoLabel: '', // 退款申请单号/补退款申请单号 名称
      refundVisible: false, // 申请补退款弹出框显示隐藏
      isEmpty: false, // 判空
      editForm: {},
      loading: false,
      underLineLoading: false,
      underLineTime: '', // 线下退款处理时间
      underLineVisible: false
    }
  },
  props: {
    repairRefundList: {
      type: Object,
      required: true
    },
    row: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  filters: {
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
    // ------------ 补退款申请 -------------------
    // 退款详情 -- 获取数据
    getRefundInfo (data) {
      this.refundInfoTitle = '退款信息'
      this.refundInfoLabel = '退款申请单号'
      refundInfo(data).then(res => {
        this.frameList = res.rows
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 补退款申请 -- 弹出框
    handleApply (type, val) {
      if (type === 0) {
        this.editForm = JSON.parse(JSON.stringify(this.repairRefundList.editForm))
        if (this.repairRefundList.refundVisible) {
          this.refundVisible = this.repairRefundList.refundVisible
        } else {
          this.refundVisible = true
        }
      } else {
        this.editForm = JSON.parse(JSON.stringify(val.editForm))
        if (val.refundVisible) {
          this.refundVisible = val.refundVisible
        } else {
          this.refundVisible = true
        }
      }
      this.dataReset()
    },
    // 补退款申请 -- 提交
    saveEdit () {
      this.loading = true
      this.editForm.refundAmountsActual = this.refundAmountsActual
      this.editForm.actualRefundWallet = this.actualRefundWallet || 0
      this.editForm.applyRemark = this.applyRemark
      if (this.refundAmountsActual) {
        this.getApply(this.editForm)
      } else {
        this.isEmpty = true
      }
    },
    // 补退款申请 -- 数据接口
    getApply (data) {
      apply(data).then(res => {
        this.repairRefundList.editVisible = false
        this.refundVisible = false
        this.$emit('refundList', 1, this.pagination.pageSize)
        this.$message.success(res.message)
        this.loading = false
      }).catch(err => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
    // 补退款申请 -- 重置弹出框表单
    dataReset () {
      this.refundAmountsActual = ''
      this.applyRemark = ''
    },
    // ------------ 补退款审核/退款/报表 弹出框数据详情 -------------------
    // 获取数据
    getRepairRefundInfo (id) {
      this.refundInfoTitle = '补退款信息'
      this.refundInfoLabel = '补退款申请单号'
      repairRefundInfo({ refundId: id }).then(res => {
        this.frameList = res.rows
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // ------------ 补退款审核 -------------------
    // 补退款审核
    handleAudity () {
      let data = {
        refundId: this.frameList[0].refund_id,
        auditRemark: this.frameList[0].audit_remark,
	      actualRefundWallet: this.frameList[0].actual_refund_wallet,
	      refundAmountsActual: this.frameList[0].refund_amounts_actual
      }
      this.$confirm('是否通过补退款审核？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        auditPass(data).then(res => {
          this.$message.success(res.message)
          this.repairRefundList.editVisible = false
          this.$emit('refundList', 1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消补退款审核')
      })
    },
    // 退款拒绝
    handleRepairRefuse () {
      let data = {
        refundId: this.frameList[0].refund_id,
        refundStatus: this.frameList[0].refundType,
        auditRemark: this.frameList[0].audit_remark,
        refundAmountsActual: this.frameList[0].refund_amounts_actual
      }
      this.$confirm('确认拒绝补退款审核？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        auditRefuse(data).then(res => {
          this.$message.success(res.message)
          this.repairRefundList.editVisible = false
          this.$emit('refundList', 1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消拒绝补退款审核')
      })
    },
    // ------------ 补退款退款 -------------------
    // 退款通过
    handleAdopt () {
      let data = {
        refundId: this.frameList[0].refund_id,
        refundStatus: 6,
        refundAmountsRemark: this.frameList[0].refund_amounts_remark,
        refundAmountsActual: this.frameList[0].refund_amounts_actual,
	      actualRefundWallet: this.frameList[0].actual_refund_wallet
      }
      this.$confirm('是否确认完成补退款？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.refundPassData(data)
      }).catch(() => {
        this.$message.info('已取消补退款')
      })
    },
    // 线下退款通过
    handleLineAdopt () {
      let data = {
        refundId: this.frameList[0].refund_id,
        refundStatus: 7,
        refundAmountsRemark: this.frameList[0].refund_amounts_remark,
        refundAmountsDate: this.underLineTime
      }
      this.$confirm('确认线下处理成功？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.underLineLoading = true
        underLineRefund(data).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.underLineLoading = false
          this.underLineVisible = false
          this.repairRefundList.editVisible = false
          this.$emit('refundList', 1, this.pagination.pageSize)
        }).catch(() => {
          this.underLineLoading = false
        })
      }).catch(() => {
        this.underLineLoading = false
        this.$message.info('操作取消')
        this.loading = false
      })
    },
    // 退款拒绝
    handleRefuse () {
      if (this.frameList[0].refund_amounts_remark) {
        this.editVisible = true
        let data = {
          refundId: this.frameList[0].refund_id,
          refundStatus: this.frameList[0].refund_status_t,
          refundAmountsRemark: this.frameList[0].refund_amounts_remark
        }
        this.$confirm('是否确认拒绝补退款？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.refundRefuseData(data)
        }).catch(() => {
          this.$message.info('已取消补退款拒绝')
        })
      } else {
        this.$message.error('退款备注不能为空')
      }
    },
    // 退款通过 -- 接口
    refundPassData (data) {
      this.loading = true
      refundPass(data).then(res => {
        this.$message.success(res.message)
        this.loading = false
        this.repairRefundList.editVisible = false
        this.$emit('refundList', 1, this.pagination.pageSize)
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 退款拒绝 -- 接口
    refundRefuseData (data) {
      refundRefuse(data).then(res => {
        this.$message.success(res.message)
        this.repairRefundList.editVisible = false
        this.$emit('refundList', 1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
