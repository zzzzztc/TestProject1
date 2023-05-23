<template>
  <div id="ProductRefund">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input
            clearable
            placeholder="产品名称"
            size="medium"
            v-model="filter.productName"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            clearable
            placeholder="产品编号"
            size="medium"
            v-model="filter.productCode"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            clearable
            placeholder="出发三字码"
            size="medium"
            v-model="filter.afrom"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            clearable
            placeholder="到达三字码"
            size="medium"
            v-model="filter.ato"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            clearable
            placeholder="航班号"
            size="medium"
            v-model="filter.flightNo"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select
            size="medium"
            placeholder="退改状态"
            clearable
            v-model="filter.refundStatus">
            <el-option label="已申请" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="审核拒绝" value="3"></el-option>
            <el-option label="退款完成" value="6"></el-option>
            <el-option label="线下退款完成" value="7"></el-option>
            <el-option label="退款失败" value="8"></el-option>
            <el-option label="退款处理中" value="13"></el-option>
          </el-select>
        </div>
<!--        <div class="search-item search-ipt">-->
<!--          <el-select-->
<!--            size="medium"-->
<!--            placeholder="订单类型"-->
<!--            clearable-->
<!--            v-model="filter.orderType">-->
<!--            <el-option value="1" label="单独购"></el-option>-->
<!--            <el-option value="2" label="随票购"></el-option>-->
<!--          </el-select>-->
<!--        </div>-->
<!--        <div class="search-item search-ipt">-->
<!--          <el-select-->
<!--            size="medium"-->
<!--            placeholder="订单详情状态"-->
<!--            clearable-->
<!--            v-model="filter.detailStatus"></el-select>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-input
            clearable
            placeholder="机票号"
            size="medium"
            v-model="filter.ticketNo"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            clearable
            placeholder="产品订单号"
            size="medium"
            v-model="filter.proOrdercode"></el-input>
        </div>
<!--        <div class="search-item search-ipt">-->
<!--          <el-input-->
<!--            clearable-->
<!--            placeholder="关联订单号"-->
<!--            size="medium"-->
<!--            v-model="filter.ordercode"></el-input>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-input
            clearable
            placeholder="退款批次号"
            size="medium"
            v-model="filter.refundBatchNo"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.flightDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班日期">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="danger" @click="ticketMoney" size="medium" :disabled='dataArr.length === 0'>批量退款</el-button>
        <el-button type="success" size="medium" @click="exportList">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="list.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          @selection-change='handleSelectionChange'
          :cell-style="tableAttributes.cellStyle">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="产品名称" min-width="120" prop="productName"></el-table-column>
          <el-table-column label="产品编号" min-width="100" prop="productCode"></el-table-column>
          <el-table-column label="出发三字码" min-width="100" prop="afrom"></el-table-column>
          <el-table-column label="到达三字码" min-width="100" prop="ato"></el-table-column>
          <el-table-column label="航班号" min-width="80" prop="flightNo"></el-table-column>
          <el-table-column label="数量" min-width="80" prop="saleNum"></el-table-column>
          <el-table-column label="单价" min-width="80" prop="salePrice"></el-table-column>
          <el-table-column label="支付金额" min-width="100" prop="paymoney"></el-table-column>
          <el-table-column label="退货数量" min-width="100">
            <template slot-scope="scope">
              {{ parseInt(scope.row.refundAmounts / scope.row.salePrice) }}
            </template>
          </el-table-column>
          <el-table-column label="退款金额" min-width="100" prop="refundAmounts"></el-table-column>
          <el-table-column label="订单状态" min-width="100" prop="detailStatus">
            <template slot-scope="scope">
              <div>{{ scope.row.detailStatus | syncProductStatusMap }}</div>
            </template>
          </el-table-column>
          <el-table-column label="退款状态" min-width="100">
            <template slot-scope="scope">
              <div>{{ scope.row.refundStatus | refundStatusMap }}</div>
            </template>
          </el-table-column>
          <el-table-column label="机票号" min-width="140" prop="ticketNo"></el-table-column>
          <el-table-column label="航班日期" min-width="100" prop="flightDate"></el-table-column>
          <el-table-column label="产品订单号" min-width="160" prop="proOrdercode"></el-table-column>
          <el-table-column label="关联订单号" min-width="160" prop="ordercode"></el-table-column>
          <el-table-column label="支付银行订单号" min-width="170" prop="paybillno"></el-table-column>
          <el-table-column label="批量退款批次号" min-width="120" prop="refundBatchNo"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="200">
            <template slot-scope="scope">
              <div>
                <span
                  class="active-text mr-5"
                  v-if="scope.row.refundStatus === '1'"
                  @click="refundConfirm(1, scope.row)">审核通过</span>
                <span
                  class="active-text mr-5"
                  v-if="scope.row.refundStatus === '1'"
                  @click="refundConfirm(0, scope.row)">审核拒绝</span>
                <span
                  class="active-text mr-5"
                  v-if="scope.row.refundStatus === '2'"
                  @click="refundConfirm(2, scope.row)">确认退款</span>
                <span class="active-text mr-5" @click="refundConfirm(3, scope.row)">重新审核</span>
                <span
                  class="active-text mr-5"
                  v-if="scope.row.refundStatus === '2' || scope.row.refundStatus === '8'"
                  @click="switchUnderLineRefund(scope.row)">线下退款</span>
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
        :total="list.total">
      </el-pagination>
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
                <el-table-column label="票号" prop="ticketNo"></el-table-column>
                <el-table-column label="产品名称" prop="productName"></el-table-column>
                <el-table-column label="产品编号" prop="productCode"></el-table-column>
                <el-table-column label="出发三字码" prop="afrom"></el-table-column>
                <el-table-column label="到达三字码" prop="ato"></el-table-column>
                <el-table-column label="退款状态" prop="status">
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
  </div>
</template>

<script>
import { computWidth } from '../../../mixins/computWidt'
import { mapState } from 'vuex'
import { fetchList, refundConfirm, refundPass, refundRefuse, againApply, batchRefundConfirm, underLineRefund } from './api'
import { excelList, getRouteName } from '../../../utils'

export default {
  name: 'ProductRefund',
  data () {
    return {
      loading: false,
      filter: {
        refundStatus: '1',
        orderType: '1'
      },
      list: {},
      dataViewHeight: null,
      currentRow: {},
      underLineParam: {},
      underLineVisible: false,
      underLineLoading: false,
      dataArr: [],
      batchVisible: false,
      payResList: [],
      dialogLoading: false,
      underLineTime: '',
      batchRefundNo: ''
    }
  },
  mixins: [ computWidth ],
  created () {
    this.getList(1, this.pagination.pageSize)
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  methods: {
    // 查询
    getList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter)
        .then(res => {
          this.loading = false
          this.list = res
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 重置查询条件
    resetFilter () {
      this.filter = {
        refundStatus: '1',
        orderType: '1'
      }
      this.getList(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getList(null, pages)
    },
    handleCurrentChange (page) {
      this.getList(page, null)
    },
    // 确认框
    refundConfirm (type, param) {
      this.currentRow = param
      let text = ''
      if (type === 1) {
        // 通过
        text = '是否确认审核通过？'
      } else if (type === 0) {
        // 拒绝
        text = '是否确认审核拒绝'
      } else if (type === 3) {
        text = '是否确认重新审核？'
      } else {
        text = '是否确认退款？'
      }
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          if (type === 1) {
            // 审核通过
            this.refundPassHandle()
          } else if (type === 0) {
            // 审核拒绝
            this.refundRefuseHandle()
          } else if (type === 3) {
            this.handleAgainApply()
          } else {
            // 退款确认
            this.refund()
          }
        })
    },
    // 审核通过
    refundPassHandle () {
      this.loading = true
      refundPass({ detailId: this.currentRow.detailId, refundAmounts: this.currentRow.refundAmounts })
        .then(() => {
          // this.loading = false
          this.$message({
            type: 'success',
            message: '审核通过'
          })
          this.getList(this.filter.page)
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 审核拒绝
    refundRefuseHandle () {
      this.loading = true
      refundRefuse({ detailId: this.currentRow.detailId })
        .then(() => {
          // this.loading = false
          this.$message({
            type: 'success',
            message: '审核通过'
          })
          this.getList(this.filter.page)
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 退款确认
    refund () {
      this.loading = true
      refundConfirm({ detailId: this.currentRow.detailId })
        .then(() => {
          // this.loading = false
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getList(this.filter.page)
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 重新审核
    handleAgainApply () {
      againApply({ detailId: this.currentRow.detailId })
        .then(() => {
          // this.loading = false
          this.$message({
            type: 'success',
            message: '审核通过'
          })
          this.getList(this.filter.page)
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 线下退款
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
      underLineRefund({ detailId: this.underLineParam.detailId, refundAmountsDate: this.underLineTime }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.underLineLoading = false
        this.underLineVisible = false
        this.getList()
      }).catch(err => {
        this.underLineLoading = false
        this.$message.error(err.message)
      })
    },
    // 列表选择
    handleSelectionChange (val) {
      this.dataArr = val
    },
    // 批量退款
    ticketMoney () {
      let ids = this.dataArr.map(item => {
        return item.detailId
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
      batchRefundConfirm({ ids: ids }).then(res => {
        this.$message({
          message: '退款成功',
          type: 'success'
        })
        this.confirmSearchPayRes(res.obj)
        this.getList()
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
        orderType: 1,
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
    // 导出
    exportList () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = 'order/exportProductOrderDetail'
      let name = getRouteName('/productRefund')
      let type = 'xls'
      data.start = 1
      data.end = this.list.total
      delete data.page
      delete data.rows
      let obj = {
        data,
        url,
        name,
        type
      }
      excelList(obj, this)
    }
  }
}
</script>

<style scoped>

</style>
