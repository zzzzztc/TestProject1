<template>
  <!--<div>退保退款</div>-->
  <div id="InsuranceRefundConfirm" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="购保人名称" v-model="filter.insuredName" clearable @keydown.enter.native="getRefundList()"></el-input>
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
          <el-input size="medium" placeholder="订单号" v-model="filter.ordercode" clearable @keydown.enter.native="getRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="票号" v-model="filter.ticketNo" clearable @keydown.enter.native="getRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="保司保单号" v-model="filter.insOrderCode" clearable @keydown.enter.native="getRefundList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="保险状态" clearable v-model="filter.insStatus">
            <el-option label="退保审核中" value="4"></el-option>
            <el-option label="退保完成" value="5"></el-option>
            <el-option label="线下退款完成" value="6"></el-option>
            <el-option label="退款失败" value="8"></el-option>
            <el-option label="退款处理中" value="13"></el-option>
            <el-option label="退保处理中" value="10"></el-option>
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
          <el-select size="medium" placeholder="退保类型" clearable v-model="filter.refType">
            <el-option label="单独退保" value="1"></el-option>
            <el-option label="退票退保" value="2"></el-option>
            <el-option label="保险改期" value="3"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道类型" v-model="filter.no">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getRefundList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" type="success" @click="handleExportAchangeList" :disabled="refundList.total === 0">导出</el-button>
        <el-button size="medium" type= 'danger' :disabled='multipleSelection.length === 0' @click="batchRefundSelf">批量退款</el-button>
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
      <!--<div class="btn-container">-->
        <!--<el-button size="medium">单独退保</el-button>-->
        <!--<el-button size="medium">票号退保</el-button>-->
        <!--<el-button size="medium">重新购保</el-button>-->
      <!--</div>-->
    </div>
    <div class="main">
      <div class="column-btn" @click="switchColumn">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="table-container">
        <el-table
          v-loading="loading"
          :height="dataViewHeight"
          :data="refundList.rows"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          style="width: 100%"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column type="selection" min-width="50" v-if="tableListSelected" fixed="left"></el-table-column>
          <el-table-column key="0" label="订单编号" v-if="tableList.ordercode" prop="ordercode" min-width="160px"></el-table-column>
          <el-table-column key="17" label="航联订单号" v-if="tableList.faiOrderId" prop="faiOrderId" min-width="200"></el-table-column>
          <el-table-column key="16" label="保险生效日期" v-if="tableList.instanceDate" min-width="160">
            <template slot-scope="scope">
              <div>{{ scope.row.flightDate }} {{ scope.row.flightTime }}</div>
            </template>
          </el-table-column>
          <el-table-column key="1" label="票号" v-if="tableList.ticketNo" prop="ticketNo" min-width="140"></el-table-column>
          <el-table-column key="2" label="单价" v-if="tableList.buyUnitPrice" prop="buyUnitPrice" min-width="60"></el-table-column>
          <el-table-column key="3" label="保险状态" v-if="tableList.status" min-width="100" prop="status"></el-table-column>
          <el-table-column key="4" label="购保人姓名" v-if="tableList.insuredName" prop="insuredName" min-width="100"></el-table-column>
          <el-table-column key="5" label="购保人手机" v-if="tableList.applicantMobile" prop="applicantMobile" min-width="120"></el-table-column>
          <el-table-column key="6" label="渠道类型" v-if="tableList.channel" min-width="120" prop="channel"></el-table-column>
          <el-table-column key="7" label="保险公司" v-if="tableList.insuranceCompanyName" prop="insuranceCompanyName" min-width="180"></el-table-column>
          <el-table-column key="8" label="保险产品" v-if="tableList.insuranceName" min-width="200" prop="insuranceName"></el-table-column>
          <el-table-column key="9" label="保单号" v-if="tableList.insNo" prop="insNo" min-width="160"></el-table-column>
          <el-table-column key="9.5" label="保司保单号" v-if="tableList.insOrderCode" prop="insOrderCode" min-width="200"></el-table-column>
          <el-table-column key="10" label="支付平台代码" v-if="tableList.payCode" prop="payCode" min-width="180"></el-table-column>
          <el-table-column key="11" label="保险单唯一序列码" v-if="tableList.payOrdercode" prop="payOrdercode" min-width="300"></el-table-column>
          <el-table-column key="12" label="保险日期" v-if="tableList.createDate" prop="createDate" min-width="180"></el-table-column>
          <el-table-column key="17" label="退款确认时间" v-if="tableList.refundAmountsDate" prop="refundAmountsDate" min-width="160"></el-table-column>
          <el-table-column key="13" label="退款失败原因" v-if="tableList.wxRefundErrorMsg" prop="wxRefundErrorMsg" min-width="180"></el-table-column>
          <el-table-column key="15" label="操作" min-width="260" v-if="checked.length">
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.status === '退保审核'">
                  <span class="inl-block active-text pr-5" @click="handleInsuranceConfirm(scope.row.insuraId, '5')">退款确认</span>
                  <span class="inl-block active-text pr-5" @click="handleQueryOrderProcessingList(scope.row.insuraId)">审核记录</span>
                </div>
                <div v-else>
                  <span class="inl-block active-text pr-5" @click="handleQueryOrderProcessingList(scope.row.insuraId)">审核记录</span>
                </div>
                <div v-if="scope.row.status === '退保审核' || scope.row.status === '退款失败'">
                  <span class="inl-block active-text pr-5" @click="switchUnderLineRefund(scope.row)">线下退款确认</span>
                </div>
                <div>
                  <span class="inl-block active-text pr-5" @click="insuranceConfirmAgain(scope.row)" v-if="scope.row.status==='退款失败'">重新退款</span>
                </div>
              </div>
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
          :total="refundList.total">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="800">
        <div class="dialog-container">
          <div class="dialog-main">
            <el-table :data="reviewList.rows" :border="tableAttributes.border" :stripe="tableAttributes.stripe">
              <el-table-column label="处理时间" prop="creatime"></el-table-column>
              <el-table-column label="处理类型" prop="prcsType">
                <template slot-scope="scope">
                  <span>{{ scope.row.prcsType | insuranceRefundMap }}</span>
                </template>
              </el-table-column>
              <el-table-column label="记录类型" prop="prcsContent">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--批量退款弹框-->
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
                <el-table-column label="订单号" prop="ordercode"></el-table-column>
                <el-table-column label="退票状态" prop="status">
                  <template slot-scope="scope">
                    <div>{{ scope.row.status | insuranceMap }}</div>
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
import { getChannelList, getCurrentDate, excelList, getRouteName } from '../../../utils/index'
import { fetchList, insuranceConfirm, queryOrderProcessingList, underRefund, insuranceConfirmAgain, batchInsuranceConfirm, queryInsuranceInfoList } from './api'
import { formatPriceMap, insuranceMap, channelMap } from '../../../filters/index'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'InsuranceRefundConfirm',
  data () {
    return {
      underLineParam: null,
      underLineLoading: false,
      underLineTime: '',
      underLineVisible: false,
      componentName: 'insuranceRefundConfirm',
      filter: {
        queryType: '3',
        refType: '1',
        insStatus: '4',
        startdate: '',
        enddate: ''
      },
      loading: false,
      date: [],
      dataViewHeight: null,
      refundList: {},
      dialogVisible: false,
      dialogTitle: '',
      reviewList: {},
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
	    multipleSelection: [], // 表格选批量退款
	    batchVisible: false, // 批量退款弹窗
	    dialogLoading: false, // loading框
	    batchRefundNo: false, // 退款单号
	    payResList: [], // 退款处理条数
      tableList: {
        faiOrderId: false,
        instanceDate: true,
        applicantMobile: false,
        insuranceCompanyName: false,
        payCode: false,
        payOrdercode: false,
        createDate: false,
        ordercode: true,
        ticketNo: true,
        buyUnitPrice: true,
        insOrderCode: false,
        status: true,
        insuredName: true,
        channel: true,
        insuranceName: true,
        insNo: true,
	      wxRefundErrorMsg: false,
        refundAmountsDate: false
      } //  表格展示的数据
    }
  },
  created () {
    this.judgeChannelList()
    this.initDate()
    this.getRefundList(1, this.pagination.pageSize)
    // this.locCheck()
  },
  mixins: [checkAttrs, computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      orderType: state => state.app.orderType
    }),
	  tableListSelected () {
    	return Object.values(this.tableList).some(item => {
    		return item
      })
    }
  },
  methods: {
  	// 批量退款
	  batchRefundSelf () {
		  let ids = this.multipleSelection.map(item => {
			  return item.insuraId
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
		  batchInsuranceConfirm({ ids: ids }).then(res => {
			  this.$message({
				  type: 'success',
				  message: '操作成功'
			  })
			  this.loading = false
			  this.getRefundList()
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
		  queryInsuranceInfoList(filter).then(res => {
			  this.payResList = res.rows
		  }).catch(err => {
			  this.$message({
				  type: 'error',
				  message: err.message
			  })
		  })
	  },
  	// 表格选择项
	  handleSelectionChange (val) {
		  this.multipleSelection = val
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 初始化时间
    initDate () {
      this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.filter.startdate = this.date[0]
      this.filter.enddate = this.date[1]
    },
    // 获取列表数据
    getRefundList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.refundList = res
        for (let i = 0; i < this.refundList.rows.length; i++) {
          this.refundList.rows[i].buyUnitPrice = formatPriceMap(this.refundList.rows[i].buyUnitPrice)
          this.refundList.rows[i].status = insuranceMap(this.refundList.rows[i].status)
          this.refundList.rows[i].channel = channelMap(this.refundList.rows[i].channel)
          this.refundList.rows[i].insuranceName = this.refundList.rows[i].insuranceCompanyName + this.refundList.rows[i].insuranceProductName
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.messages)
      })
    },
    // 重置查询
    resetFilter () {
      this.filter = {
        refType: '1',
        insStatus: '4',
        queryType: '3'
      }
      this.initDate()
      this.getRefundList()
    },
    // 分页
    handleSizeChange (pages) {
      this.getRefundList(null, pages)
    },
    handleCurrentChange (page) {
      this.getRefundList(page, null)
    },
    // 退款确认
    handleInsuranceConfirm (id, type) {
      // type: 5退款确认，6线下退款确认
      this.$confirm('是否确认提交退款？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        insuranceConfirm({ insrId: id, insStatus: type }).then(() => {
          this.$message.success('操作成功')
          this.loading = true
          this.getRefundList()
        }).catch(err => {
          this.$message.error(err)
        })
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 审核记录
    handleQueryOrderProcessingList (id) {
      this.dialogTitle = '审核记录'
      this.dialogVisible = true
      queryOrderProcessingList({ ticketid: id }).then(res => {
        this.reviewList = res
      }).catch(err => {
        this.$message.error(err)
      })
    },
    handleExportAchangeList () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = 'refund/exportAchangeList'
      let name = getRouteName('/insuranceRefundConfirm')
      let type = 'xls'
      data.start = 1
      data.end = this.refundList.total
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
    // 线下退款弹框
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
      underRefund({ insrId: this.underLineParam.insuraId, insStatus: 6, refundAmountsDate: this.underLineTime }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.underLineLoading = false
        this.underLineVisible = false
        this.getRefundList()
      }).catch(err => {
        this.underLineLoading = false
        this.$message.error(err.message)
      })
    },
    // 重新退款
	  insuranceConfirmAgain (param) {
    	// console.log(param)
		  this.$confirm('确认要重新退款吗？', '提示')
		  .then(() => {
			  const data = {
				  insrId: param.insuraId
			  }
			  insuranceConfirmAgain(data)
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
</style>
