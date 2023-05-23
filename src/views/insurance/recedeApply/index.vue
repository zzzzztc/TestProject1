<template>
<!--  <div>退保申请</div>-->
  <div id="InsuranceRefundApply" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="购保人名称" v-model="filter.insuredName" clearable @keydown.enter.native="getRecedeApply()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="保司保单号" v-model="filter.insOrderCode" clearable @keydown.enter.native="getRecedeApply()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="购保开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.enddate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="购保开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单号" v-model="filter.ordercode" clearable @keydown.enter.native="getRecedeApply()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="票号" v-model="filter.ticketNo" clearable @keydown.enter.native="getRecedeApply()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="保险状态" clearable v-model="filter.insStatus">
            <el-option label="购保处理中" value="0"></el-option>
            <el-option label="购买成功" value="1"></el-option>
            <el-option label="退保拒绝" value="2"></el-option>
            <el-option label="退保完成" value="5"></el-option>
            <el-option label="已改期" value="11"></el-option>
            <el-option label="购买失败" value="15"></el-option>
            <el-option label="理赔完成" value="16"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单类型" clearable v-model="filter.isFree">
            <el-option v-for="item in orderType" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道类型" v-model="filter.channel" clearable>
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getRecedeApply()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
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
          :height="dataViewHeight"
          :data="recedeApply.rows"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column key="0" label="订单编号" v-if="tableList.ordercode" prop="ordercode" min-width="160"></el-table-column>
          <el-table-column key="16" label="航联订单号" v-if="tableList.faiOrderId" prop="faiOrderId" min-width="200"></el-table-column>
          <el-table-column key="14" label="航班号" v-if="tableList.flightno" prop="flightno" min-width="80"></el-table-column>
          <el-table-column key="15" label="航段" v-if="tableList.afrom" min-width="100">
            <template slot-scope="scope">
              <div>{{ scope.row.afrom }}-{{ scope.row.ato }}</div>
            </template>
          </el-table-column>
          <el-table-column key="1" label="保险生效日期" v-if="tableList.instanceDate" min-width="160">
            <template slot-scope="scope">
              <div>{{ scope.row.flightDate }} {{ scope.row.flightTime }}</div>
            </template>
          </el-table-column>
          <el-table-column key="2" label="票号" v-if="tableList.ticketNo" prop="ticketNo" min-width="140"></el-table-column>
          <el-table-column key="3" label="单价" v-if="tableList.buyUnitPrice" prop="buyUnitPrice" min-width="60"></el-table-column>
          <el-table-column key="4" label="保险状态" v-if="tableList.status" min-width="100" prop="status"></el-table-column>
          <el-table-column key="5" label="购保人姓名" v-if="tableList.insuredName" prop="insuredName" min-width="100"></el-table-column>
          <el-table-column key="6" label="购保人手机" v-if="tableList.applicantMobile" prop="applicantMobile" min-width="120"></el-table-column>
          <el-table-column key="7" label="渠道类型" v-if="tableList.channel" min-width="120" prop="channel"></el-table-column>
          <el-table-column key="8" label="保险公司" v-if="tableList.insuranceCompanyName" prop="insuranceCompanyName" min-width="180"></el-table-column>
          <el-table-column key="9" label="保司保单号" v-if="tableList.insOrderCode" prop="insOrderCode" min-width="200"></el-table-column>
          <el-table-column key="10" label="保险产品" v-if="tableList.insuranceName" prop="insuranceName" min-width="240"></el-table-column>
          <el-table-column key="11" label="保单号" v-if="tableList.insNo" prop="insNo" min-width="160"></el-table-column>
          <el-table-column key="12" label="保险日期" v-if="tableList.createDate" prop="createDate" min-width="160"></el-table-column>
          <el-table-column key="13" fixed="right" label="操作" min-width="260" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text inl-block pr-5" v-if="scope.row.status === '购买成功'" @click="handleSingleCancelInsure(scope.row.ticketId, scope.row.insType)">单独退保</span>
              <span class="active-text inl-block pr-5" v-if="scope.row.status === '购买成功'" @click="handleCancelInsureByTicketNo(scope.row.ticketNo)">票号退保</span>
              <span class="active-text inl-block pr-5" v-if="scope.row.status === '购买失败'" @click="handlePlanPolicySchedule(scope.row.orderId)">重新购保</span>
              <span class="active-text inl-block pr-5" v-if="scope.row.status === '购买成功'" @click="switchPostpone(scope.row)">保险非自愿改期</span>
              <span class="active-text inl-block pr-5" v-if="scope.row.status === '购买成功'" @click="switchZiyuan(scope.row)">保险自愿改期</span>
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
          :total="recedeApply.total">
        </el-pagination>
      </div>
    </div>
    <!--非自愿改期-->
    <div>
      <el-dialog title="保险改期" :visible.sync="visible" width="360px">
        <div class="dialog-container" v-loading="postponeLoading">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">航班号</div>
                <div class="ipt-medium">
                  <el-input size="medium" readonly placeholder="例如: 3324" clearable v-model="postpone.flightNo"></el-input>
                  <div class="warning-info" v-if="formErr && !postpone.flightNo">请填写航班号</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">航班日期</div>
                <div class="ipt-medium">
                  <el-date-picker
                    readonly
                    v-model="postpone.flightDate"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                  <div class="warning-info" v-if="formErr && !postpone.flightDate">请选择日期</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">航班时间</div>
                <div class="ipt-medium">
                  <el-time-picker
                    readonly
                    v-model="postpone.flightTime"
                    placeholder="选择时间"
                    format="HH:mm"
                    value-format="HH:mm">
                  </el-time-picker>
                  <div class="warning-info" v-if="formErr && !postpone.flightTime">请选择时间</div>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="visible = false">取消</el-button>
            <el-button size="medium" @click="postponeDataJudge">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--自愿改期-->
    <div>
      <el-dialog :visible.sync="volVisible" title="自愿改期" width="860px">
        <div class="dialog-container" v-loading="postponeLoading">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入新票号" v-model="ticketNo" clearable></el-input>
                </div>
              </div>
              <div class="column">
                <div class="ipt-medium">
                  <el-button size="medium" :disabled="!ticketNo" @click="natureBefore(1)">查询</el-button>
                </div>
              </div>
            </div>
            <div class="row">
              <el-table :data="ziyuanList" border>
                <el-table-column label="类型" min-width="60" prop="type"></el-table-column>
                <el-table-column label="乘机人" min-width="80" prop="passengerName"></el-table-column>
                <el-table-column label="出发三字码" min-width="80" prop="depAirportCode"></el-table-column>
                <el-table-column label="到达三字码" min-width="80" prop="arrAirportCode"></el-table-column>
                <el-table-column label="航班时间" min-width="140" prop="depTime"></el-table-column>
                <el-table-column label="航班号" min-width="80" prop="flightNo"></el-table-column>
                <el-table-column label="票号" min-width="120" prop="ticketNo">
                  <template slot-scope="scope">
                    {{ scope.row.ticketNo | ticketNoFormat }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="volVisible = false">取消</el-button>
            <el-button size="medium" @click="natureApi">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelList, getCurrentDate } from '../../../utils/index'
import { fetchList, singleCancelInsure, cancelInsureByTicketNo, planPolicySchedule, insurancePostpone, natureBefore } from './api'
import fieldMap from './refer'
import { formatPriceMap, insuranceMap, channelMap } from '../../../filters/index'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'InsuranceRefundApply',
  data () {
    return {
      visible: false,
      postponeLoading: false,
      postpone: {
        flightNo: '',
        flightDate: '',
        flightTime: ''
      },
      postponeRow: null,
      componentName: 'insuranceRefundApply',
      filter: {
        insStatus: '1',
        queryType: '1',
        startdate: '',
        enddate: ''
      },
      loading: false,
      date: [],
      dataViewHeight: null,
      recedeApply: {},
      checkList: fieldMap,
      checkedAll: false,
      formErr: false,
      isIndeterminate: false,
      currentRow: {},
      volVisible: false, // 自愿改期弹框
      ticketNo: '',
      ziyuanList: [null, null],
      oldRow: {},
      newRow: {},
      tableList: {
        faiOrderId: false,
        flightno: true,
        afrom: true,
        instanceDate: true,
        applicantMobile: false,
        createDate: false,
        insuranceCompanyName: false,
        insOrderCode: false,
        ordercode: true,
        ticketNo: true,
        buyUnitPrice: true,
        status: true,
        insuredName: true,
        channel: true,
        insuranceName: true,
        insNo: true
      } //  表格展示的数据
    }
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getRecedeApply(1, this.pagination.pageSize)
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
  filters: {
    ticketNoFormat (no) {
      if (no && no.length === 13) {
        return no.slice(0, 3) + '-' + no.slice(3)
      }
      return no
    }
  },
  methods: {
    // 初始化时间a
    initDate () {
      this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.filter.startdate = this.date[0]
      this.filter.enddate = this.date[1]
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 获取列表数据
    getRecedeApply (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.recedeApply = res
        for (let i = 0; i < this.recedeApply.rows.length; i++) {
          this.recedeApply.rows[i].buyUnitPrice = formatPriceMap(this.recedeApply.rows[i].buyUnitPrice)
          this.recedeApply.rows[i].status = insuranceMap(this.recedeApply.rows[i].status)
          this.recedeApply.rows[i].channel = channelMap(this.recedeApply.rows[i].channel)
          this.recedeApply.rows[i].insuranceName = this.recedeApply.rows[i].insuranceCompanyName + this.recedeApply.rows[i].insuranceProductName
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.messages)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        insStatus: '1',
        queryType: '1',
        startdate: '',
        enddate: ''
      }
      this.initDate()
      this.getRecedeApply()
    },
    // 分页
    handleSizeChange (pages) {
      this.getRecedeApply(null, pages)
    },
    handleCurrentChange (page) {
      this.getRecedeApply(page, null)
    },
    // 单独退保
    handleSingleCancelInsure (id, type) {
      this.$confirm('是否确认单独退保？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        singleCancelInsure({ ticketId: id, type: type }).then(res => {
          this.$message({
            type: 'success',
            message: '退保成功，请稍后重新查询'
          })
          this.getRecedeApply()
        }).catch(err => {
          this.$message.error(err)
        })
      }).catch(() => {
        this.$message({
          message: '取消',
          type: 'info'
        })
      })
    },
    // 票号退保
    handleCancelInsureByTicketNo (ticketNo) {
      this.$confirm('是否确认票号退保？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelInsureByTicketNo({ ticketNo: ticketNo }).then(res => {
          this.getRecedeApply()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }).catch(err => {
          this.$message.error(err)
        })
      }).catch(() => {
        this.$message({
          message: '操作取消',
          type: 'info'
        })
      })
    },
    handlePlanPolicySchedule (orderId) {
      this.$confirm('是否确认重新购保？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        planPolicySchedule({ orderId: 'fdc857a5-c6c8-402c-bc2a-b0ad703f7daf' }).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getRecedeApply()
        }).catch(err => {
          this.$message.error(err)
        })
      }).catch(() => {
        this.$message({
          message: '操作取消',
          type: 'info'
        })
      })
    },
    // 保险改期
    async switchPostpone (row) {
      this.postponeRow = row
      this.currentRow = row
      await this.natureBefore(null, row.ticketNo)
      this.visible = true
      this.formErr = false
    },
    // 参数校验
    postponeDataJudge () {
      let data = {
        ticketid: this.postponeRow.ticketId,
        ticketNo: this.postponeRow.ticketNo
      }
      Object.assign(data, this.postpone)
      data.flightNo = data.flightNo.substring(2)
      if (this.postpone.flightNo && this.postpone.flightTime && this.postpone.flightDate) {
        // 验证通过
        this.postponeApi(data)
      } else {
        this.formErr = true
      }
    },
    // 调用改期接口
    postponeApi (data) {
      this.postponeLoading = true
      insurancePostpone(data).then(res => {
        this.$message({
          type: 'success',
          message: '保险改期成功'
        })
        this.postponeLoading = false
        this.visible = false
      }).catch(err => {
        this.postponeLoading = false
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    switchZiyuan (row) {
      this.ziyuanList = []
      this.currentRow = row
      this.volVisible = true
      this.ticketNo = null
      this.oldRow = {
        arrAirportCode: row.ato,
        depAirportCode: row.afrom,
        depTime: row.flightDate + ' ' + row.flightTime,
        flightNo: 'NS' + row.flightno,
        passengerName: row.insuredName,
        type: '旧',
        ticketNo: row.ticketNo
      }
      // this.natureBefore(null, row.ticketNo)
      this.ziyuanList = [this.oldRow]
    },
    // 查询改期数据
    natureBefore (type, ticketNo) {
      if (type && this.ticketNo === this.oldRow.ticketNo) {
        this.$message({
          type: 'warning',
          message: '新票号不可与旧票号一致'
        })
        return false
      }
      natureBefore({ tktNo: ticketNo || this.ticketNo, afrom: this.currentRow.afrom, ato: this.currentRow.ato })
        .then(res => {
          res.obj.ticketNo = ticketNo || this.ticketNo
          if (type) {
            // 新
            this.newRow = res.obj
            this.newRow.type = '新'
            this.newRow.depTime = this.newRow.depTime.substring(0, 16)
            this.ziyuanList = [this.oldRow, this.newRow]
          } else {
            // 旧
            this.oldRow = res.obj
            this.oldRow.type = '旧'
            this.postpone.flightNo = this.oldRow.flightNo
            this.postpone.flightDate = this.oldRow.depTime.substring(0, 10)
            if (this.oldRow.depTime) {
              this.postpone.flightTime = this.oldRow.depTime.substring(11, 16)
            }
            this.ziyuanList = [this.oldRow]
          }
        })
        .catch(err => {
          this.ziyuanList = [this.oldRow, null]
          this.$message({
            type: 'error',
            message: err.message
          })
        })
    },
    natureApi () {
      if (!this.ziyuanList[1] || !this.ziyuanList[1].depTime) {
        this.$message.error('未读取到票面航班信息不能进行改期！')
        return false
      }
      let data = {
        ticketid: this.currentRow.ticketId,
        ticketNo: this.ticketNo,
        flightNo: this.ziyuanList[1].flightNo.substring(2),
        flightDate: this.ziyuanList[1].depTime.substring(0, 10),
        flightTime: this.ziyuanList[1].depTime.substring(11, 16)
      }
      this.postponeApi(data)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
