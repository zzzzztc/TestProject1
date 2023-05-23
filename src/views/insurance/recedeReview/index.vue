<template>
  <!--  <div>退保审核</div>-->
  <div id="InsuranceRefundAudit" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="购保人名称" v-model="filter.insuredName" clearable @keydown.enter.native="getRecedeReview()"></el-input>
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
            placeholder="购保截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单号" v-model="filter.ordercode" clearable @keydown.enter.native="getRecedeReview()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="票号" v-model="filter.ticketNo" clearable @keydown.enter.native="getRecedeReview()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="保司保单号" v-model="filter.insOrderCode" clearable @keydown.enter.native="getRecedeReview()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="保险状态" clearable v-model="filter.insStatus">
            <el-option label="购保处理中" value="0"></el-option>
            <el-option label="购买成功" value="1"></el-option>
            <el-option label="退保拒绝" value="2"></el-option>
            <el-option label="退保申请中" value="3"></el-option>
            <el-option label="退保审核" value="4"></el-option>
            <el-option label="退保完成" value="5"></el-option>
            <el-option label="线下退保完成" value="6"></el-option>
            <el-option label="线下理赔" value="7"></el-option>
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
          <el-select size="medium" placeholder="退保类型"  v-model="filter.refType">
            <el-option label="单独退保" value="1"></el-option>
            <!--<el-option label="退票退保" value="2"></el-option>
            <el-option label="保险改期" value="3"></el-option>-->
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道类型" clearable  v-model="filter.channel">
            <!--<el-option label="全部" value=""></el-option>-->
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getRecedeReview()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" @click="handleExportAchangeList" :disabled="recedeReview.total === 0">导出</el-button>
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
          :data="recedeReview.rows"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column key="0" label="订单编号" v-if="tableList.ordercode" prop="ordercode" min-width="180"></el-table-column>
          <el-table-column key="1" label="航联订单号" v-if="tableList.faiOrderId" prop="faiOrderId" min-width="200"></el-table-column>
          <el-table-column key="2" label="保险生效日期" v-if="tableList.instanceDate" min-width="160">
            <template slot-scope="scope">
              <div>{{ scope.row.flightDate }} {{ scope.row.flightTime }}</div>
            </template>
          </el-table-column>
          <el-table-column key="3" label="票号" v-if="tableList.ticketNo" prop="ticketNo" min-width="140"></el-table-column>
          <el-table-column key="4" label="单价" v-if="tableList.buyUnitPrice" prop="buyUnitPrice" min-width="90"></el-table-column>
          <el-table-column key="5" label="保险状态" v-if="tableList.statusName" min-width="100" prop="statusName"></el-table-column>
          <el-table-column key="6" label="购保人姓名" v-if="tableList.insuredName" prop="insuredName" min-width="110"></el-table-column>
          <el-table-column key="7" label="购保人手机" v-if="tableList.insuredMobile" prop="insuredMobile" min-width="130"></el-table-column>
          <el-table-column key="8" label="渠道类型" v-if="tableList.channel" min-width="110" prop="channel"></el-table-column>
          <el-table-column key="9" label="保险公司" v-if="tableList.insuranceCompanyName" prop="insuranceCompanyName" min-width="180"></el-table-column>
          <el-table-column key="10" label="保险产品" v-if="tableList.insuranceProductName" prop="insuranceName" min-width="200"></el-table-column>
          <el-table-column key="11" label="保单号" v-if="tableList.insNo" prop="insNo" min-width="150"></el-table-column>
          <el-table-column key="12" label="保司保单号" v-if="tableList.insOrderCode" prop="insOrderCode" min-width="200"></el-table-column>
          <el-table-column key="13" label="支付平台代码" v-if="tableList.payCode" prop="payCode" min-width="180"></el-table-column>
          <el-table-column key="14" label="保险单唯一序列码" v-if="tableList.payOrdercode" prop="payOrdercode" min-width="300"></el-table-column>
          <el-table-column key="15" label="保险日期" v-if="tableList.createDate" prop="createDate" min-width="160"></el-table-column>
          <el-table-column key="17" label="审核人" v-if="tableList.auditName" prop="auditName" min-width="180"></el-table-column>
          <el-table-column key="18" label="审核人工号" v-if="tableList.auditAccount" prop="auditAccount" min-width="180"></el-table-column>
          <el-table-column key="16" label="操作" min-width="230" v-if="checked.length">
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.status === '2' || scope.row.status === '3'">
                  <span class="active-text inl-block pr-5" @click="handleFirstInsurancePass(scope.row.insuraId)">退保审核</span>
                  <span class="active-text inl-block pr-5" @click="handleFirstInsuranceRefuse(scope.row.insuraId)">退保拒绝</span>
                  <span class="active-text inl-block pr-5" @click="getOrderProcessingList(scope.row.insuraId, scope.row.ticketNo)">审核记录</span>
                </div>
                <div v-else>
                  <span class="active-text inl-block pr-5" @click="getOrderProcessingList(scope.row.insuraId, scope.row.ticketNo)">审核记录</span>
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
          :total="recedeReview.total">
        </el-pagination>
      </div>
    </div>
    <div class="">
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="800px">
        <div class="dialog-container">
          <div class="dialog-main">
            <el-table :data="reviewList.rows" :border="tableAttributes.border" :stripe="tableAttributes.stripe">
              <el-table-column label="处理时间" prop="creatime"></el-table-column>
              <el-table-column label="处理类型" prop="prcsType">
                <template slot-scope="scope">
                  <span>{{scope.row.prcsType | insuranceRefundMap}}</span>
                </template>
              </el-table-column>
              <el-table-column label="记录类型" prop="prcsContent"></el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
	import { mapState } from 'vuex'
	import { computeTableHeight, getChannelList, getCurrentDate, excelList, getRouteName } from '../../../utils/index'
	import { fetchList, firstInsurancePass, firstInsuraceRefuse, queryOrderProcessingList } from './api'
	import * as types from '../../../filters/index'
	import fieldMap from './refer'
	import { checkAttrs } from '../../../mixins'
	import { computWidth } from '../../../mixins/computWidt'

	export default {
		name: 'InsuranceRefundAudit',
		data () {
			return {
				componentName: 'insuranceRefundAudit',
				loading: false,
				filter: {
					insStatus: '3',
					queryType: '2',
					startdate: '',
					enddate: '',
          refType: '1'
				},
				date: [],
				dataViewHeight: null,
				recedeReview: {},
				dialogTitle: '审核记录',
				dialogVisible: false,
				reviewList: [], // 审核记录
				checkList: fieldMap,
				checkedAll: false,
				isIndeterminate: false,
				tableList: {
					faiOrderId: false,
					instanceDate: true,
					flightDate: true,
					payCode: false,
					payOrdercode: false,
					insuredMobile: false,
					createDate: false,
					insOrderCode: false,
					insuranceCompanyName: false,
					ordercode: true,
					ticketNo: true,
					buyUnitPrice: true,
					statusName: true,
					insuredName: true,
					channel: true,
					insuranceProductName: true,
					insNo: true,
					auditName: false,
					auditAccount: false
				} //  表格展示的数据
			}
		},
		mounted () {
			this.dataViewHeight = computeTableHeight(this, 'header')
		},
		created () {
			this.judgeChannelList()
			this.initDate()
			this.getRecedeReview(1, this.pagination.pageSize)
			// this.locCheck()
		},
		mixins: [checkAttrs, computWidth],
		computed: {
			...mapState({
				pagination: state => state.app.pagination,
				tableAttributes: state => state.app.tableAttributes,
				channelList: state => state.app.channelList,
				orderType: state => state.app.orderType
			})
		},
		methods: {
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
			// 获取数据
			getRecedeReview (page, pageSize) {
				this.loading = true
				this.filter.page = page || 1
				if (pageSize) this.filter.rows = pageSize
				fetchList(this.filter).then(res => {
					this.recedeReview = res
					for (let i = 0; i < this.recedeReview.rows.length; i++) {
						this.recedeReview.rows[i].buyUnitPrice = types.formatPriceMap(this.recedeReview.rows[i].buyUnitPrice)
						this.recedeReview.rows[i].statusName = types.insuranceMap(this.recedeReview.rows[i].status)
						this.recedeReview.rows[i].channel = types.channelMap(this.recedeReview.rows[i].channel)
						this.recedeReview.rows[i].insuranceName = this.recedeReview.rows[i].insuranceCompanyName + this.recedeReview.rows[i].insuranceProductName
					}
					this.loading = false
				}).catch(err => {
					this.loading = false
					this.$message.error(err.messages)
				})
			},
			// 重置过滤条件
			resetFilter () {
				this.filter = {
					queryType: '2',
					startdate: '',
					enddate: '',
					insStatus: '3',
          refType: '1'
				}
				this.initDate()
				this.getRecedeReview(1, this.pagination.pageSize)
			},
			// 分页
			handleSizeChange (pages) {
				this.getRecedeReview(null, pages)
			},
			handleCurrentChange (page) {
				this.getRecedeReview(page, null)
			},
			// 导出
			handleExportAchangeList () {
				let data = JSON.parse(JSON.stringify(this.filter))
				let url = 'refund/exportAchangeList'
				let name = getRouteName('/insuranceRefundAudit')
				let type = 'xls'
				data.start = 1
				data.end = this.recedeReview.total
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
			// 退保审核
			handleFirstInsurancePass (id) {
				this.$confirm('是否确认提交审核？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					firstInsurancePass({ insrId: id }).then(() => {
						this.getRecedeReview()
						this.$message({
							type: 'success',
							message: '操作成功'
						})
					}).catch(err => {
						this.$message.error(err)
					})
				}).catch(() => {
					this.$message.info('操作取消')
				})
			},
			// 退保拒绝
			handleFirstInsuranceRefuse (id) {
				this.$confirm('是否确认拒绝 ?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					firstInsuraceRefuse({ insrId: id }).then(() => {
						this.getRecedeReview()
						this.$message.success('操作成功')
					}).catch(err => {
						this.$message.error(err)
					})
				}).catch(() => {
					this.$message.info('操作取消')
				})
			},
			// 审核记录
			getOrderProcessingList (id, no) {
				this.dialogVisible = true
				this.dialogTitle = '审核记录'
				queryOrderProcessingList({ ticketid: id, eticketno: no }).then(res => {
					this.reviewList = res
				}).catch(err => {
					this.$message.error(err)
				})
			}
		}
	}
</script>

<style scoped lang="scss">
</style>
