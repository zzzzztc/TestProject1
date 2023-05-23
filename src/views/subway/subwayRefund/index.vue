<template>
  <!--  <div>地铁退票管理</div>-->
  <div class="container" id="SubwayRefund">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="订单号" v-model="filter.batchOrderNo" @keydown.enter.native="getRailwayList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="机票号" v-model="filter.eticketno" @keydown.enter.native="getRailwayList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.useDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="使用开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.useDateEnd"
            class="w-180"
            type="date"
            value-format="yyyy-MM-dd"
            size="medium"
            placeholder="使用截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.applyDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="退票开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.applyDateEnd"
            class="w-180"
            type="date"
            value-format="yyyy-MM-dd"
            size="medium"
            placeholder="退票截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.refundStatus" placeholder="地铁退票状态" clearable>
            <el-option label="已申请" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="审核拒绝" value="3"></el-option>
            <el-option label="退款完成" value="6"></el-option>
            <el-option label="线下退款完成" value="7"></el-option>
            <el-option label="退款失败" value="8"></el-option>
            <el-option label="退款处理中" value="13"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="渠道" v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="退款批次号" v-model="filter.refundBatchNo" @keydown.enter.native="getRailwayList()"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getRailwayList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="danger" @click="ticketMoney" size="medium" :disabled='dataArr.length === 0'>批量退款</el-button>
        <el-button type="success" size="medium" @click="excel()">导出</el-button>
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
          :data="refundList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          @selection-change='handleSelectionChange'
          :cell-style="tableAttributes.cellStyle">
          <!--          <el-table-column label="序号" type="index"></el-table-column>-->
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="订单号" v-if="tableList.batchOrderNo" prop="batchOrderNo" min-width="160"></el-table-column>
          <el-table-column label="渠道" v-if="tableList.channel" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.channel | channelMap }}
            </template>
          </el-table-column>
          <el-table-column label="乘车人姓名" v-if="tableList.pname" prop="pname" min-width="100"></el-table-column>
          <el-table-column label="证件号" v-if="tableList.idnumber" prop="idnumber" min-width="180"></el-table-column>
          <el-table-column label="联系方式" v-if="tableList.checkedMobile" prop="checkedMobile" min-width="120"></el-table-column>
          <el-table-column label="票号" v-if="tableList.eticketno" prop="eticketno" min-width="140"></el-table-column>
          <el-table-column label="机票航段" v-if="tableList.afrom" min-width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.afrom }}-{{scope.row.ato}}</div>
            </template>
          </el-table-column>
          <el-table-column label="地铁票行程" v-if="tableList.startStationName" min-width="140">
            <template slot-scope="scope">
              <div>{{ scope.row.startStationName }} - {{ scope.row.endStationName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="审核人" v-if="tableList.auditOp" prop="auditOp" min-width="160"></el-table-column>
          <el-table-column label="审核人工号" v-if="tableList.auditAccount" prop="auditAccount" min-width="160"></el-table-column>
          <el-table-column label="购票时间" v-if="tableList.createDate" prop="createDate" min-width="160"></el-table-column>
          <el-table-column label="使用时间" v-if="tableList.checkedDate" prop="checkedDate" min-width="120"></el-table-column>
          <el-table-column label="退票时间" v-if="tableList.applyDate" prop="applyDate" min-width="160"></el-table-column>
          <el-table-column label="地铁票车费" v-if="tableList.payAmount" prop="payAmount" min-width="100">
            <template slot-scope="scope">
              {{scope.row.payAmount | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="地铁退票状态" v-if="tableList.transStatus" prop="transStatus" min-width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.refundStatus | subwayStateMap }}</div>
            </template>
          </el-table-column>
          <el-table-column label="退款确认时间" v-if="tableList.refundAmountsDate" prop="refundAmountsDate" min-width="160"></el-table-column>
          <el-table-column label="退款失败原因" v-if="tableList.wxRefundErrorMsg" props="wxRefundErrorMsg" min-width="120"></el-table-column>
          <el-table-column label="退款批次号" v-if="tableList.refundBatchNo" props="refundBatchNo" min-width="120"></el-table-column>
          <el-table-column label="操作" min-width="220">
            <template slot-scope="scope">
              <div>
                <span class="active-text mr-5" v-if="scope.row.refundStatus === '1'" @click="refundConfirm(1, scope.row)">审核通过</span>
                <span class="active-text mr-5" v-if="scope.row.refundStatus === '1'" @click="refundConfirm(0, scope.row)">审核拒绝</span>
                <span class="active-text mr-5" v-if="scope.row.refundStatus === '2'" @click="refundConfirm(2, scope.row)">确认退款</span>
                <span class="active-text mr-5" v-if="scope.row.refundStatus === '2' || scope.row.refundStatus === '8'" @click="switchUnderLineRefund(scope.row)">线下退款</span>
                <span class="active-text mr-5" v-if="scope.row.refundStatus === '8'" @click="ticketRefundConformAgain(scope.row)">重新退款</span>
              </div>
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
        :total="refundList.total">
      </el-pagination>
    </div>
    <div>
      <el-dialog :visible.sync="batchVisible" title="退款结果" width="680px">
        <div class="dialog-container" v-loading="dialogLoading">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <span>退款批次号：</span>
                <span>{{ batchRefundNo }}</span>
              </div>
              <div class="column">
                <span>本次处理条数：</span>
                <span>{{ payResList.length }}</span>
              </div>
              <div class="active-text batchRefundNoUpdate" @click="batchRefundNoUpdate">刷新</div>
            </div>
            <div>
              <el-table :data="payResList"
                        :border="tableAttributes.border"
                        :stripe="tableAttributes.stripe"
                        :cell-style="tableAttributes.cellStyle">
                <el-table-column label="票号" prop="eticketno" min-width="140"></el-table-column>
                <el-table-column label="地铁票行程" min-width="140">
                  <template slot-scope="scope">
                    <div>{{ scope.row.startStationName }} - {{ scope.row.endStationName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="退票状态" prop="status">
                  <template slot-scope="scope">
                    <div>{{ scope.row.refundStatus | subwayStateMap }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="退款失败原因">
                  <template slot-scope="scope">
                    <div v-if="scope.row.refundStatus === '8'">{{ scope.row.wxRefundErrorMsg }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="batchVisible = false">关闭</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--    线下退款选择时间-->
    <div>
      <el-dialog title="线下处理" :visible.sync="underLineVisible" width="480px">
        <div class="dialog-container" v-loading="underLineLoading">
          <div class="dialog-main">
            <div>
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
            <el-button size="medium" :disabled="!underLineTime" @click="refundOffline">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchList, refundPass, refundRefuse, refund, batchRefund, underLineRefund, TicketRefundConformAgain } from './api'
import { excelList, getChannelList, getRouteName } from '../../../utils'
import { computWidth } from '../../../mixins/computWidt'
import { checkAttrs } from '../../../mixins'
import fieldMap from './refer'
export default {
  name: 'SubwayRefund',
  data () {
    return {
      componentName: 'SubwayRefund',
      batchVisible: false,
      dialogLoading: false,
      batchRefundNo: '',
      loading: false,
      filter: {
        refundBatchNo: ''
      },
      currentOrder: {},
      refundList: {},
      dataViewHeight: null,
      dataArr: [],
      payResList: [],
      underLineLoading: false,
      underLineVisible: false,
      underLineTime: '',
      underLineParam: null,
      checkedAll: false, // 全选
      checkList: fieldMap,
      isIndeterminate: false,
      tableList: {
        batchOrderNo: true,
        channel: false,
        pname: true,
        idnumber: true,
        checkedMobile: true,
        eticketno: false,
        afrom: true,
        startStationName: false,
	      auditOp: false,
	      auditAccount: false,
        createDate: true,
        checkedDate: true,
        applyDate: true,
        payAmount: false,
        transStatus: false,
        refundAmountsDate: false,
        wxRefundErrorMsg: false,
        refundBatchNo: false
      } //  表格展示的数据
    }
  },
  created () {
    this.judgeChannelList()
    this.getRailwayList(1, this.pagination.pageSize)
  },
  mixins: [computWidth, checkAttrs],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  methods: {
    // 列表选择
    handleSelectionChange (val) {
      this.dataArr = val
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 重置操作
    resetFilter () {
      this.filter = {
        refundBatchNo: ''
      }
      this.getRailwayList(1, this.pagination.pageSize)
    },
    // 获取列表数据
    getRailwayList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.filter.orderType = 2
      fetchList(this.filter).then(res => {
        this.refundList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 分页
    handleSizeChange (page) {
      this.getRailwayList(null, page)
    },
    handleCurrentChange (page) {
      this.getRailwayList(page, null)
    },
    // 导出
	  excel () {
    	const that = this
		  let data = JSON.parse(JSON.stringify(this.filter))
		  let url = 'airRailwayTicket/exportAirRailwayTicketList'
		  let name = getRouteName('/subwayRefund')
		  let type = 'xls'
		  data.start = 1
		  data.end = parseInt(that.dataArr.length)
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
    // 退款确认
    refundConfirm (type, param) {
      this.currentOrder = param
      // type 0,type 1
      let text = ''
      if (type === 1) {
        // 通过
        text = '是否确认审核通过？'
      } else if (type === 0) {
        // 拒绝
        text = '是否确认审核拒绝？'
      } else {
        text = '是否确认退款？'
      }
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (type === 1) {
          this.refundPassHandle()
        } else if (type === 0) {
          this.refundRefuseHandle()
        } else {
          this.refund()
        }
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 审核通过
    refundPassHandle () {
      this.loading = true
      refundPass({ airId: this.currentOrder.airId, refundAmounts: this.currentOrder.payAmount }).then(() => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '审核成功'
        })
        this.getRailwayList()
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 审核拒绝
    refundRefuseHandle () {
      this.loading = true
      refundRefuse({ airId: this.currentOrder.airId }).then(() => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '审核成功'
        })
        this.getRailwayList()
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 退款确认
    refund () {
      this.loading = true
      refund({ airId: this.currentOrder.airId }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getRailwayList()
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 批量退款
    ticketMoney () {
      let ids = this.dataArr.map(item => {
        return item.airId
      }).join(',')
      this.delList(ids)
    },
    // 批量退款操作
    delList (ids) {
      this.$confirm('是否确认提交退款？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.batchRefundApi(ids)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 调用批量退款按钮
    batchRefundApi (ids) {
      this.loading = true
      batchRefund({ ids: ids }).then(res => {
        this.$message({
          message: '退款成功',
          type: 'success'
        })
        this.confirmSearchPayRes(res.obj)
        this.getRailwayList(null, null)
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 是否需要查询退款结果
    confirmSearchPayRes (refundBatchNo) {
      this.$confirm(`此次操作批次号：${refundBatchNo} ，是否需要查看退款结果？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.batchVisible = true
        // 查询批次号
        this.batchRefundNo = refundBatchNo
        this.searchPayRes(refundBatchNo)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 根据批次号查询支付结果
    searchPayRes (refundBatchNo) {
      let filter = {
        page: 1,
        rows: 50,
        orderType: 2,
        refundBatchNo: refundBatchNo
      }
      fetchList(filter).then(res => {
        this.payResList = res.rows
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    // 刷新支付回调结果
    batchRefundNoUpdate () {
      this.searchPayRes(this.batchRefundNo)
    },
    switchUnderLineRefund (param) {
      this.underLineParam = param
      this.underLineVisible = true
    },
    // 线下退款
    refundOffline () {
      this.$confirm('是否确认线下退款？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.underLineRefundApi()
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 调用线下退款api
    underLineRefundApi () {
      this.underLineLoading = true
      underLineRefund({ airId: this.underLineParam.airId, refundAmountsDate: this.underLineTime }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.underLineLoading = false
        this.underLineVisible = false
        this.getRailwayList()
      }).catch(err => {
        this.underLineLoading = false
        this.$message.error(err.message)
      })
    },
    // 重新退款
    ticketRefundConformAgain (param) {
    	// console.log(param)
      this.$confirm('确认要重新退款吗？', '提示')
        .then(() => {
          const data = {
            airId: param.airId
          }
          TicketRefundConformAgain(data)
            .then(res => {})
            .catch(err => {
              this.$message({
                message: err.message,
                type: 'error'
              })
            })
        })
        .catch(() => [
          this.$message('取消操作')
        ])
    }
  }
}
</script>

<style scoped lang="scss">
  .dialog-container {
    .row {
      display: flex;
      justify-content: space-between;
      .column{
        flex: 1;
      }
    }
  }
  .again-refund {
    color: #e6a23c;
    cursor: pointer;
  }
  .row {
    position: relative;
  }
  .batchRefundNoUpdate {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
