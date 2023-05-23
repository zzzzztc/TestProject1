<template>
  <!--<div>补退款退票</div>-->
  <div id="RepairRefundRefund" class="container">
    <!--<h1>补退款退款</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.channel' placeholder="请选择渠道" size="medium">
            <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName" @keydown.enter.native="getRepairRefundList()"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="订单编号" v-model="searchForm.orderCode" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="银行订单号" v-model="searchForm.bankCode" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="退款申请单号" v-model="searchForm.applyNo" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="申请人" v-model="searchForm.applyOp" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="审核人" v-model="searchForm.auditOp" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="PNR" v-model="searchForm.pnr" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="乘客姓名" v-model="searchForm.passenger" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.applyDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.applyDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            unlink-panels-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="applyDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="申请开始日期"-->
<!--            end-placeholder="申请结束日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.auditDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="审核开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.auditDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="审核截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            unlink-panels-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="auditDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="审核开始日期"-->
<!--            end-placeholder="审核结束日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.refundDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="退款开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.refundDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="退款截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            unlink-panels-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="refundDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="退款开始日期"-->
<!--            end-placeholder="退款结束日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.payType' placeholder="支付方式" clearable size="medium">
            <el-option v-for="item in payPlatform" :key="item.id" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.refundStatus' placeholder="请选择退款状态" clearable size="medium">
            <el-option key="0" label="审核通过" value="2"></el-option>
            <el-option key="1" label="审核拒绝" value="3"></el-option>
            <el-option key="2" label="退款完成" value="6"></el-option>
            <el-option key="3" label="线下处理成功" value="7"></el-option>
            <el-option key="4" label="退款失败" value="8"></el-option>
            <el-option key="5" label="退款处理中" value="13"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="退款批次号" v-model="searchForm.refundBatchNo" @keydown.enter.native="getRepairRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="getRepairRefundList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
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
      <div class="btn-container">
        <el-button size="medium" type="success" :disabled="!tablelist.total" @click="exportExcel">导出</el-button>
        <el-button size="medium" type= 'danger' :disabled='multipleSelection.length === 0' @click="batchRefundSelf">批量退款</el-button>
      </div>
    </div>
    <!--表格展示-->
    <div class="main">
      <div class="column-btn" @click="switchColumn">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="table-container" >
        <el-table
          v-loading="loading"
          :data='tablelist.rows'
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
                  <span>{{ props.row.bankCode }}</span>
                </el-form-item>
                <el-form-item label="申请人">
                  <span>{{ props.row.applyOp }}</span>
                </el-form-item>
                <el-form-item label="申请人电话">
                  <span>{{ props.row.phone }}</span>
                </el-form-item>
                <el-form-item label="申请时间">
                  <span>{{ props.row.createDate }}</span>
                </el-form-item>
                <el-form-item label="申请备注">
                  <span>{{ props.row.auditRemark }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column type="selection" min-width="50" fixed="left"></el-table-column>
          <el-table-column label="渠道编号" v-if="tableList.channel" min-width="100">
            <template slot-scope="scope">
              <div>{{scope.row.channel | channelMap}}</div>
            </template>
          </el-table-column>
          <el-table-column label="订单编号" v-if="tableList.orderCode" prop="orderCode" min-width="180"></el-table-column>
          <el-table-column label="退款申请单号" v-if="tableList.applyNo" prop="applyNo" min-width="280"></el-table-column>
          <!--<el-table-column label="PNR" prop="pnr" min-width="100"></el-table-column>-->
          <!--<el-table-column label="银行订单号" prop="bankCode" min-width="180"></el-table-column>-->
          <el-table-column label="支付方式" v-if="tableList.payType" prop="payType">
            <template slot-scope="scope">
              <div>{{scope.row.payType | payTypeMap}}</div>
            </template>
          </el-table-column>
          <el-table-column label="支付金额" v-if="tableList.payAmounts" prop="payAmounts">
            <template slot-scope="scope">
              {{scope.row.payAmounts | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="补退款金额" v-if="tableList.refundAmounts" prop="refundAmounts" min-width="100">
            <template slot-scope="scope">
              {{scope.row.refundAmountsActual | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="红包退款" v-if="tableList.refundWalletActual" prop="refundWalletActual" min-width="100">
            <template slot-scope="scope">
              {{scope.row.actualRefundWallet}}
            </template>
          </el-table-column>
          <el-table-column label="乘客姓名" v-if="tableList.passenger" prop="passenger" min-width="140"></el-table-column>
          <!--<el-table-column label="申请人" prop="auditOp" min-width="140"></el-table-column>-->
          <!--<el-table-column label="申请人电话" prop="phone" min-width="140"></el-table-column>-->
          <!--<el-table-column label="申请时间" prop="createDate" min-width="180"></el-table-column>-->
          <!--<el-table-column label="申请备注" prop="auditRemark" min-width="200"></el-table-column>-->
          <el-table-column label="补退款状态" v-if="tableList.refundStatus" prop="refundStatus" min-width="100">
            <template slot-scope="scope">
                {{scope.row.refundStatus | refundStatusMap}}
            </template>
          </el-table-column>
          <el-table-column label="退款确认时间" v-if="tableList.refundAmountsDate" prop="refundAmountsDate" min-width="160"></el-table-column>
          <el-table-column label="退款失败原因" v-if="tableList.wx_refund_error_msg" prop="wx_refund_error_msg" min-width="120"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="140">
            <template slot-scope="scope">
              <div class="active-text" v-if="scope.row.refundStatus === '2' || scope.row.refundStatus === '8'" @click="handleTrial('refund', scope.row.refundId)">补退款审核</div>
              <div class="active-text" v-else @click="handleTrial('refund', scope.row.refundId)">查看详情</div>
              <div class="active-text" v-if="scope.row.refundStatus === '8'"   @click="refundAgain(scope.row)">重新退款</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 表格分页 -->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tablelist.total">
      </el-pagination>
    </div>
    <!-- 弹出框 -->
    <RepairRefund ref="repairRefundAby" :repairRefundList="repairRefundList" @refundList="getRepairRefundList"></RepairRefund>
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
                <el-table-column label="订单号" prop="orderCode"></el-table-column>
                <el-table-column label="退票状态" prop="status">
                  <template slot-scope="scope">
                    <div>{{ scope.row.refundStatus | refundStatusMap }}</div>
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
import { mapState } from 'vuex'
import RepairRefund from '../../../components/repairRefund'
import { queryRepairRefund, batchRefundHandle, refundPassAgain } from './api'
import { getCurrentDate, getChannelList, JsonToXls, getRouteName } from '../../../utils/index'
import { channelMap, refundStatusMap, payTypeMap } from '../../../filters/index'
import { computWidth } from '../../../mixins/computWidt'
import { checkAttrs } from '../../../mixins/index'
import fieldMap from './refer'
export default {
  name: 'RepairRefundRefund',
  data () {
    return {
	    componentName: 'RepairRefundRefund',
      batchVisible: false,
      batchRefundNo: '',
      dialogLoading: false,
      payResList: [],
      dataArr: [],
      searchForm: {
        channel: '', // 渠道
        condition: '1',
        orderCode: '', // 订单编号
        bankCode: '', // 银行订单号
        applyNo: '', // 退款申请单号
        applyOp: '', // 申请人
        auditOp: '', // 审核人
        pnr: '', // PNR
        passenger: '', // 乘客姓名
        applyDateStart: '', // 申请开始日期
        applyDateEnd: '', // 申请结束日期
        auditDateStart: '', // 审核开始日期
        auditDateEnd: '', // 审核结束日期
        refundDateStart: '', // 退款开始日期
        refundDateEnd: '', // 退款结束日期
        payType: '', // 支付方式
        refundStatus: '2', // 退款状态
        page: 1
      }, // 搜索框 -- 数据
      applyDate: [], // 搜索框 -- 申请日期
      auditDate: [], // 搜索框 -- 审核日期
      refundDate: [], // 搜索框 -- 退款日期
      tablelist: [], // 表格 -- 数据
      multipleSelection: [], // 表格 -- 选择项数据
      dataViewHeight: null, // 表格 -- 高度
      repairRefundList: {}, // 组件 -- 传参
      loading: false, // 加载 -- 数据加载时显示的动效
	    checkedAll: false, // 全选
	    checkList: fieldMap,
	    isIndeterminate: false,
	    tableList: {
		    channel: true,
		    orderCode: false,
		    applyNo: true,
		    payType: true,
		    payAmounts: true,
		    refundAmounts: false,
		    refundWalletActual: true,
		    passenger: false,
		    refundStatus: true,
		    refundAmountsDate: true,
		    wx_refund_error_msg: true
	    } //  表格展示的数据
    }
  },
  components: {
    RepairRefund
  },
  created () {
    this.getDateTerm()
    this.getChannelList()
    this.getRepairRefundList(1, this.pagination.pageSize)
  },
  mixins: [computWidth, checkAttrs],
  computed: {
    ...mapState({
      channelList: state => state.app.channelList, // 渠道
      tableAttributes: state => state.app.tableAttributes, // 表格1
      pagination: state => state.app.pagination, // 分页
      payPlatform: state => state.app.payPlatform
    })
  },
  methods: {
    // 批量退款确认框
    batchRefundSelf () {
      let ids = this.multipleSelection.map(item => {
        return item.refundId
      }).join(',')
      this.$confirm('是否确认提交退款 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleBatchRefund(ids)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    // 刷新回调列表
    batchRefundNoUpdate () {
      this.searchPayRes(this.batchRefundNo)
    },
    // 调用批量退款API
    handleBatchRefund (ids) {
      this.loading = true
      batchRefundHandle({ ids: ids }).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.loading = false
        this.getRepairRefundList()
        this.confirmSearchPayRes(res.obj)
      }).catch(err => {
        this.loading = false
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    // 是否需要查询退款结果
    confirmSearchPayRes (batchNo) {
      this.$confirm(`此次操作批次号：${batchNo}，是否需要查看退款结果？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.batchVisible = true
        this.batchRefundNo = batchNo
        this.searchPayRes(batchNo)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    // 查询批量退款结果
    searchPayRes (batchNo) {
      let filter = {
        page: 1,
        rows: 50,
        refundBatchNo: batchNo
      }
      queryRepairRefund(filter).then(res => {
        this.payResList = res.rows
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    // 渠道 -- 没有则请求服务器
    getChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 搜索框 --- 获取申请日期期限
    getDateTerm () {
      this.applyDate = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.searchForm.applyDateStart = this.applyDate[0]
      this.searchForm.applyDateEnd = this.applyDate[1]
    },
    // 搜索框 -- 重置
    handleReset () {
      this.searchForm = {
        applyDateStart: '',
        applyDateEnd: '',
        condition: '1',
        payType: '', // 支付方式
        refundStatus: '2' // 退款状态
      }
      this.getDateTerm()
      this.getChannelList()
      this.getRepairRefundList(1, this.pagination.pageSize)
    },
    // 表格 -- 分页导航
    handleSizeChange (pages) {
      this.getRepairRefundList(null, pages)
    },
    handleCurrentChange (page) {
      this.getRepairRefundList(page, null)
    },
    // 表格 -- 选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 表格 -- 获取数据
    getRepairRefundList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      // this.handleDate()
      queryRepairRefund(this.searchForm).then(res => {
        this.tablelist = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 表格 -- 入参日期处理
    handleDate () {
      // 申请日期
      if (this.applyDate && this.applyDate.length) {
        this.searchForm.applyDateStart = this.applyDate[0]
        this.searchForm.applyDateEnd = this.applyDate[1]
      } else {
        delete this.searchForm.applyDateStart
        delete this.searchForm.applyDateEnd
      }
      // 审核日期
      if (this.auditDate && this.auditDate.length) {
        this.searchForm.auditDateStart = this.auditDate[0]
        this.searchForm.auditDateEnd = this.auditDate[1]
      } else {
        delete this.searchForm.auditDateStart
        delete this.searchForm.auditDateEnd
      }
      // 退款日期
      if (this.refundDate && this.refundDate.length) {
        this.searchForm.refundDateStart = this.refundDate[0]
        this.searchForm.refundDateEnd = this.refundDate[1]
      } else {
        delete this.searchForm.refundDateStart
        delete this.searchForm.refundDateEnd
      }
    },
    // 表格 -- 查看详情/补退款审核
    handleTrial (type, id) {
      this.repairRefundList = {
        editVisible: true,
        type: type
      }
      this.$refs.repairRefundAby.getRepairRefundInfo(id)
    },
    exportExcel () {
      let data = JSON.parse(JSON.stringify(this.searchForm))
      data.rows = this.tablelist.total
      let arrJson = []
      queryRepairRefund(data).then(res => {
        if (res.rows.length > 65000) {
          this.$message.info('导出数据过多,请缩小范围')
        } else {
          for (let i = 0; i < res.rows.length; i++) {
            let obj = {}
            res.rows[i].channel = channelMap(res.rows[i].channel)
            obj = {
              渠道编号: res.rows[i].channel,
              订单编号: res.rows[i].orderCode,
              退款申请单号: res.rows[i].applyNo,
              支付方式: payTypeMap(res.rows[i].payType),
              支付金额: res.rows[i].payAmounts,
              补退款金额: res.rows[i].refundAmountsActual,
              红包退款: res.rows[i].actualRefundWallet,
              乘客姓名: res.rows[i].passenger,
              补退款状态: refundStatusMap(res.rows[i].refundStatus),
              PNR: res.rows[i].pnr,
              银行订单号: res.rows[i].bankCode,
              申请人: res.rows[i].applyOp,
              申请人电话: res.rows[i].phone,
              申请时间: res.rows[i].createDate,
              申请备注: res.rows[i].applyRemark
            }
            arrJson.push(obj)
          }
          JsonToXls([arrJson], ['sheet1'], getRouteName('/repairRefundRefund'))
        }
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    // 重新退款
	  refundAgain (param) {
      this.$prompt('请填写重新退款理由', '提示')
        .then(({ value }) => {
        	if (!value) {
        		this.$message('请填写重新退款理由')
            return false
          }
	        const data = {
		        refundId: param.refundId,
		        refundStatus: '6',
		        refundAmountsActual: param.refundAmountsActual,
		        actualRefundWallet: param.actualRefundWallet,
		        refundAmountsRemark: value
	        }
	        refundPassAgain(data)
	        .then(res => {
	        	this.$message('重新退款成功!')
          })
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
