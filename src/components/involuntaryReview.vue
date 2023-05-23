<template>
    <div>
      <el-dialog v-dialogDrag :title="dialogTitle" :visible.sync="dialogVisibleReport" width="80%">
        <div class="dialog-container">
          <div class="dialog-main" style="padding: 0">
            <el-collapse v-model="activeNamesReport">
              <el-collapse-item title="非自愿信息" name="report">
                <el-table
                  :data="reviewList"
                  :cell-style="tableAttributes.cellStyle">
                  <el-table-column label="客票状态" prop="tktStatus" min-width="140"></el-table-column>
                  <el-table-column label="延误类型" prop="delayType" min-width="120">
                    <template slot-scope="scope">
                      <span v-if="scope.row.delayType === '0'">无延误</span>
                      <span v-if="scope.row.delayType === '1'">计划性</span>
                      <span v-if="scope.row.delayType === '2'">临时性</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="未改期确认" prop="noChange" min-width="120">
                    <template slot-scope="scope">
                      <span v-if="scope.row.noChange === '0'">否</span>
                      <span v-if="scope.row.noChange === '1'">是</span>
                      <span v-if="scope.row.noChange === '2'">人工处理</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="处理状态" prop="operStatus" min-width="120">
                    <template slot-scope="scope">
                      <span v-if="scope.row.operStatus === '0'">初始</span>
                      <span v-if="scope.row.operStatus === '1'">延误</span>
                      <span v-if="scope.row.operStatus === '2'">不延误</span>
                      <span v-if="scope.row.operStatus === '4'">处理失败</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="处理次数" prop="operNum" min-width="120"></el-table-column>
                  <el-table-column label="旅客航后取位" prop="hhqw" min-width="120"></el-table-column>
                  <el-table-column label="航班变更时间" prop="pnrClearedTime" min-width="180"></el-table-column>
                  <el-table-column label="预报时间" prop="forecastTime" min-width="180"></el-table-column>
                  <el-table-column label="创建时间" prop="createDate" min-width="180"></el-table-column>
<!--                  <el-table-column label="未改期确认备注" prop="noChangeRemark" min-width="180"></el-table-column>-->
                </el-table>
              </el-collapse-item>
              <el-collapse-item title="航班信息（提交退票时）" name="detail">
                <el-table
                  :data="detailList"
                  :cell-style="tableAttributes.cellStyle">
<!--                  <el-table-column label="航班号" prop="fltNo" min-width="120"></el-table-column>-->
<!--                  <el-table-column label="创建时间" prop="createDate" min-width="180"></el-table-column>-->
<!--                  <el-table-column label="航班日期" prop="fltDate" min-width="180"></el-table-column>-->
<!--                  <el-table-column label="国际/国内" prop="dorI" min-width="120">-->
<!--                    <template slot-scope="scope">-->
<!--                      <span v-if="scope.row.dorI === 'I'">国际</span>-->
<!--                      <span v-if="scope.row.dorI === 'D'">国内</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="出发三字码" prop="depCity3Code" min-width="120"></el-table-column>-->
<!--                  <el-table-column label="到达三字码" prop="arrCity3Code" min-width="120"></el-table-column>-->
                  <el-table-column label="计飞" prop="std" min-width="180"></el-table-column>
                  <el-table-column label="预飞" prop="etd" min-width="180"></el-table-column>
                  <el-table-column label="实飞" prop="atd" min-width="180"></el-table-column>
                  <el-table-column label="计达" prop="sta" min-width="180"></el-table-column>
                  <el-table-column label="预达" prop="eta" min-width="180"></el-table-column>
                  <el-table-column label="实达" prop="ata" min-width="180"></el-table-column>
                  <el-table-column label="机型" prop="acType" min-width="120"></el-table-column>
                  <el-table-column label="延误标识" prop="flyDelay" min-width="120"></el-table-column>
                  <el-table-column label="取消标识" prop="flgCs" min-width="120"></el-table-column>
                  <el-table-column label="备降返航标识" prop="flgVR" min-width="180"></el-table-column>
                  <el-table-column label="备降返航标识补充" prop="flgVR1" min-width="180"></el-table-column>
                  <el-table-column label="撤轮档时间" prop="offWheelTime" min-width="180"></el-table-column>
                  <el-table-column label="挡轮挡时间" prop="onWheelTime" min-width="180"></el-table-column>
                  <el-table-column label="预计撤轮档时间" prop="eobt" min-width="180"></el-table-column>
                  <el-table-column label="不正常信息" prop="abnormalInfo" min-width="120"></el-table-column>
                  <el-table-column label="到达延误标识" prop="flgDepairportDelay" min-width="180"></el-table-column>
                  <el-table-column label="出发延误标识" prop="flgDepartureDelay" min-width="180"></el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="refundAudit" :disabled="disabled">退票审核</el-button>
            <el-button size="medium" @click="refundRefuse" :disabled="disabled">退票拒绝</el-button>
            <el-button size="medium" @click="dialogVisibleReport = false">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { queryInvoluntaryReview, queryfocFlightById, firstRefundPass, secondRefundPass, refusePass } from './api'
export default {
  name: 'index',
  data () {
    return {
      dialogTitle: '',
      reviewList: [],
      detailList: [],
      ityreviewParam: {},
      dialogVisibleReport: false,
      activeNamesReport: ['report', 'detail'],
      disabled: false
    }
  },
  props: {
    reviewParams: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    initComponent (param) {
      this.ityreviewParam = param
      this.dialogVisibleReport = true
      this.dialogTitle = '非自愿审核信息'
      this.getInvoluntaryReview(this.ityreviewParam.id)
    },

    // 获取非自愿审核
    getInvoluntaryReview (id) {
      this.reviewList = []
      queryInvoluntaryReview({ changeId: id }).then(res => {
        let focId = res.obj.focId
        this.reviewList.push(res.obj)
        this.getfocFlightById(focId)
        this.disabled = false
      }).catch(err => {
        this.$message.error(err.message)
        this.disabled = true
      })
    },
    // 获取航班信息
    getfocFlightById (focId) {
      this.detailList = []
      queryfocFlightById({ focId: focId }).then(res => {
        this.detailList.push(res.obj)
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
        if (this.ityreviewParam.refundType === 'first') {
          this.handleFirstRefund(this.reviewParams)
        } else {
          this.handleSecondRefund(this.reviewParams)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退票审核'
        })
      })
    },
    // 一审
    handleFirstRefund (data) {
      firstRefundPass(data).then(res => {
        this.$message({
          type: 'success',
          message: '审核成功'
        })
        this.dialogVisibleReport = false
        this.closeDialog()
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
        this.dialogVisibleReport = false
        this.closeDialog()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 退票拒绝
    refundRefuse () {
      let data = {
        idPara: this.ityreviewParam.id,
        refundRemark: this.ityreviewParam.refundRemark
      }
      this.$confirm('是否确认拒绝?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        refusePass(data).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.dialogVisibleReport = false
          this.closeDialog()
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
    // 关闭父层弹框
    closeDialog () {
      // 调用父层方法
      this.$emit('onCloseDialog')
    }
  }
}
</script>

<style scoped>

</style>
