<template>
<!--  <h1>营销活动</h1>-->
  <div id="MarketAction" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="活动编号" v-model="filter.activityCode" @keydown.enter.native="getSaleActivityList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="活动名称" v-model="filter.activityName" @keydown.enter.native="getSaleActivityList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="活动渠道" v-model="filter.channel" @keydown.enter.native="getSaleActivityList()">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="活动类型" v-model="filter.activityType" @keydown.enter.native="getSaleActivityList()">
            <el-option label="优惠券" value="1"></el-option>
            <el-option label="积分" value="2"></el-option>
            <el-option label="钱包" value="3"></el-option>
            <el-option label="地面服务" value="4"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.beginDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="活动开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.endDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="活动结束日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="审批状态" v-model="filter.approveStatus"  @keydown.enter.native="getSaleActivityList()">
            <el-option label="草稿" value="0"></el-option>
            <el-option label="审核中" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="废弃" value="4"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="启用/禁用" v-model="filter.activityStatus"  @keydown.enter.native="getSaleActivityList()">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getSaleActivityList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(), resetEdit()">添加</el-button>
        <el-button type="success" size="medium" :disabled="activityList.total === 0" @click="handleExport()">导出</el-button>
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
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="activityList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
<!--          <el-table-column type="selection"></el-table-column>-->
          <el-table-column label="活动编号" v-if="tableList.activityCode" prop="activityCode" min-width="120"></el-table-column>
          <el-table-column label="活动名称" v-if="tableList.activityName" prop="activityName" min-width="160"></el-table-column>
          <el-table-column label="活动渠道" v-if="tableList.channel" prop="channel" min-width="160">
            <template slot-scope="scope">
                <span v-if="scope.row.channel && scope.row.channel !== 'null'">
                  {{scope.row.channel | channelMap}}
                </span>
              <span v-else>全渠道</span>
            </template>
          </el-table-column>
          <el-table-column label="活动总金额" v-if="tableList.activityMoney" prop="activityMoney" min-width="100"></el-table-column>
          <el-table-column label="活动类型" v-if="tableList.activityType" prop="activityType" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.activityType === '1'">优惠券</span>
              <span v-if="scope.row.activityType === '2'">积分</span>
              <span v-if="scope.row.activityType === '3'">钱包</span>
              <span v-if="scope.row.activityType === '4'">地面服务</span>
            </template>
          </el-table-column>
          <el-table-column label="活动描述" v-if="tableList.activityContent" prop="activityContent" min-width="180"></el-table-column>
          <el-table-column label="活动链接" v-if="tableList.activityUrl" prop="activityUrl" min-width="200"></el-table-column>
          <el-table-column label="活动短链接" v-if="tableList.activityShortUrl" prop="activityShortUrl" min-width="200"></el-table-column>
          <el-table-column label="排除活动日期段" v-if="tableList.dateDisable" prop="dateDisable" min-width="200"></el-table-column>
          <el-table-column label="活动备注" v-if="tableList.remark" prop="remark" min-width="160"></el-table-column>
          <el-table-column label="创建时间" v-if="tableList.createTime" prop="createTime" min-width="160"></el-table-column>
          <el-table-column label="活动场景" v-if="tableList.cutPoint" prop="cutPointName" min-width="100">
          </el-table-column>
          <el-table-column label="审批状态" v-if="tableList.approveStatus" prop="approveStatus" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.approveStatus === '0'">草稿</span>
              <span v-if="scope.row.approveStatus === '1'">审核中</span>
              <span v-if="scope.row.approveStatus === '2'">审核通过</span>
              <span v-if="scope.row.approveStatus === '4'">废弃</span>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" v-if="tableList.activityStatus" prop="activityStatus" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.activityStatus === '0'">禁用</span>
              <span v-if="scope.row.activityStatus === '1'">启用</span>
            </template>
          </el-table-column>
          <el-table-column label="活动开始日期" v-if="tableList.beginDate" prop="beginDate" min-width="120"></el-table-column>
          <el-table-column label="活动结束日期" v-if="tableList.endDate" prop="endDate" min-width="120"></el-table-column>
          <el-table-column label="操作" min-width="220" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click='handleStatus(scope.row.activityId, scope.row.activityStatus)' v-if="scope.row.activityStatus === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handleStatus(scope.row.activityId, scope.row.activityStatus)' v-if="scope.row.activityStatus === '0'" title="禁用">启用</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="active-text mr-5" title="变更日志" @click="handleLogChange(scope.row.activityId)">变更日志</span>
              <span class="active-text mr-5" title="审批申请" v-if="scope.row.approveStatus === '0'" @click="handleApprove('apply', scope.row)">申请</span>
              <span class="active-text mr-5" title="废弃" v-if="scope.row.approveStatus === '0'" @click="handleApprove('discard', scope.row.approveId)">废弃</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="clearfix">
        <div class="fl">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filter.page"
            :page-sizes="pagination.pageSizes"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="activityList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--新增弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="800px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">活动编号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="活动编号" clearable v-model="editForm.activityCode"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.activityCode">活动编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">活动名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="活动名称" clearable v-model="editForm.activityName"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.activityName">活动名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">活动总金额</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="活动总金额" clearable v-model="editForm.activityMoney" @input="handleInput"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.activityMoney">活动总金额不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">渠道</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.channel" placeholder="请选择渠道类型" size="medium" clearable multiple collapse-tags>
                  <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.channel">渠道类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">活动场景</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.cutPoint" placeholder="请选择活动场景类型" size="medium">
                  <el-option v-for="item in dictsbyTypeList" :key="item.dincCode" :value="item.dincCode" :label="item.dincName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.cutPoint">活动场景不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">活动类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.activityType" placeholder="请选择活动类型" size="medium">
                  <el-option key="0" label="优惠券" value="1"></el-option>
                  <el-option key="1" label="积分" value="2"></el-option>
                  <el-option key="2" label="钱包" value="3"></el-option>
                  <el-option key="3" label="地面服务" value="4"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.activityType">活动类型不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">活动开始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="活动开始日期"
                  v-model="editForm.beginDate">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.beginDate">活动开始日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">活动结束日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="活动结束日期"
                  v-model="editForm.endDate">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.endDate">活动结束日期不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">排除活动日期段</div>
              <div class="ipt-medium">
                <el-input
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="排除活动日期段,例：2019-08-01#2019-08-10,2019-09-01#2019-09-10"
                  v-model="editForm.dateDisable">
                </el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">活动链接</div>
              <div class="ipt-medium">
                <el-input
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="活动链接"
                  v-model="editForm.activityUrl">
                </el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">活动短链接</div>
              <div class="ipt-medium">
                <el-input
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="活动短链接"
                  v-model="editForm.activityShortUrl">
                </el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">活动描述</div>
              <div class="ipt-medium">
                <el-input
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="活动描述"
                  v-model="editForm.activityContent">
                </el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">活动备注</div>
              <div class="ipt-medium">
                <el-input
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="活动备注"
                  v-model="editForm.remark">
                </el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" @click="resetEdit">重置</el-button>
        </div>
      </div>
    </el-dialog>
    <!--变更日志查询弹出框-->
    <ChangeLogDiaLog ref="changeLogAby"></ChangeLogDiaLog>
    <!--审批申请弹出框-->
    <el-dialog title="审批申请" :visible.sync="applyVisible" width="320px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label">审批编号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="审批编号" clearable v-model="applyForm.approveCode"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">审批流程编号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="审批流程编号" clearable v-model="applyForm.approveOaCode"></el-input>
                <div class="warning-info" v-if="isEmpty && !applyForm.approveOaCode">审批流程编号不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">审批流程说明</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="审批流程说明" clearable v-model="applyForm.approveOaRemark"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="handleSubmit">提交</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ChangeLogDiaLog from '../../../../components/ChangeLogDiaLog'
import { getChannelList, excelList, getRouteName, getDictsByType } from '../../../../utils/index'
import { querySaleActivityList, queryAddSaleActivity, queryUpdateSaleActivity, queryUpdateStatus, querySaleApproveApply, querySaleApproveStatus } from './api'
import fieldMap from './refer'
import { checkAttrs } from '../../../../mixins'
import { computWidth } from '../../../../mixins/computWidt'

export default {
  name: 'MarketAction',
  data () {
    return {
      loading: false,
      filter: {
        activityCode: '', // 活动编号
        activityName: '', // 活动名称
        channel: '', // 活动渠道
        activityType: '', // 活动类型
        beginDate: '', // 活动开始日期
        endDate: '', // 活动结束日期
        approveStatus: '', // 审批状态
        activityStatus: '', // 启用状态
        page: 1, // 当前页
        rows: '' // 每页查询数量
      },
      editForm: {},
      activityList: {}, //  表格数据
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      applyVisible: false, // 审批申请弹出框 -- 显示隐藏
      // isEmpty: false, // 审批申请弹出框 -- 判空
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: false, // 添加/修改弹出框 -- 切换添加/修改
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      popupTitle: '', // 添加/修改弹出框 -- 标题
      fileList: [],
      filepath: '',
      tableList: {
        activityCode: true,
        activityName: true,
        channel: true,
        activityMoney: true,
        activityType: true,
        activityContent: false,
        activityUrl: false,
        activityShortUrl: false,
        dateDisable: false,
        remark: false,
        createTime: false,
        beginDate: true,
        endDate: true,
        cutPoint: true,
        activityStatus: true,
        approveStatus: true
      }, // 表格展示数据
      // dictsByTypeList: [], // 活动场景数据
      applyForm: {}, // 审核申请表单
      componentName: 'marketAction'
    }
  },
  created () {
    // this.initDate()
    this.judgeChannelList()
  },
  mixins: [checkAttrs, computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      dictsbyTypeList: state => state.app.dictsbyTypeList
    })
  },
  components: {
    ChangeLogDiaLog
  },
  methods: {
    // state没有则请求服务器
    async judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
      if (!this.dictsbyTypeList.length) {
        await getDictsByType()
      }
      this.getSaleActivityList(1, this.pagination.pageSize)
    },

    // 分页导航
    handleSizeChange (pages) {
      this.getSaleActivityList(null, pages)
    },
    handleCurrentChange (page) {
      this.getSaleActivityList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    handleInput (e) {
      this.editForm.activityMoney = e.replace(/[^\d]/g, '')
    },

    // 获取表格数据
    getSaleActivityList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      querySaleActivityList(this.filter).then(res => {
        this.activityList = res
        this.loading = false
        if (this.dictsbyTypeList && this.dictsbyTypeList.length) {
          this.activityList.rows.forEach(item => {
            item.cutPointName = this.resolveDincName(item.cutPoint)
          })
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    resolveDincName (type) {
      for (let i = 0; i < this.dictsbyTypeList.length; i++) {
        let item = this.dictsbyTypeList[i]
        if (item.dincCode === type) {
          return item.dincName
        }
      }
    },
    // 重置搜索条件
    resetFilter () {
      this.filter = {
        activityCode: '',
        activityName: '',
        channel: '',
        activityType: '',
        beginDate: '',
        endDate: '',
        approveStatus: '',
        activityStatus: ''
      }
      // this.initDate()
      this.getSaleActivityList(1, this.pagination.pageSize)
    },

    // 禁用/启用
    handleStatus (id, status) {
      let title = ''
      if (status === '0') {
        title = '是否确认启用?'
      } else {
        title = '是否确认禁用?'
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let data = {
          id: id,
          status: status === '0' ? '1' : '0'
        }
        queryUpdateStatus(data).then(res => {
          this.$message.success(res.message)
          this.getSaleActivityList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },

    // 添加/修改弹出框
    handleEdit (params) {
      this.editVisible = true
      this.resetEdit()
      if (params) {
        this.isReset = false
        this.popupTitle = '修改'
        this.hangdleParams(params)
      } else {
        this.isReset = true
        this.popupTitle = '添加'
      }
    },

    // 添加/修改弹出框 -- 数据处理
    hangdleParams (params) {
      this.editForm.activityId = params.activityId
      this.editForm.activityCode = params.activityCode
      this.editForm.activityName = params.activityName
      this.editForm.channel = params.channel.split(',')
      this.editForm.activityMoney = params.activityMoney
      this.editForm.activityType = params.activityType
      this.editForm.beginDate = params.beginDate
      this.editForm.endDate = params.endDate
      this.editForm.activityContent = params.activityContent
      this.editForm.activityUrl = params.activityUrl
      this.editForm.activityShortUrl = params.activityShortUrl
      this.editForm.dateDisable = params.dateDisable
      this.editForm.remark = params.remark
      this.editForm.cutPoint = params.cutPoint
    },

    // 添加弹出框提交
    saveEdit () {
      if (this.editForm.activityCode && this.editForm.activityName && this.editForm.channel && this.editForm.activityMoney && this.editForm.activityType && this.editForm.beginDate && this.editForm.endDate && this.editForm.cutPoint) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        data.channel = data.channel.join(',')
        if (this.isReset === false) {
          this.updateParamsData(data)
        } else {
          this.addParamsData(data)
        }
      } else {
        this.isEmpty = true
      }
    },

    // 添加弹出框 -- 提交接口
    addParamsData (data) {
      queryAddSaleActivity(data).then(res => {
        this.editVisible = false
        this.getSaleActivityList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 修改弹出框 -- 提交接口
    updateParamsData (data) {
      queryUpdateSaleActivity(data).then(res => {
        this.editVisible = false
        this.getSaleActivityList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 添加弹出框重置
    resetEdit () {
      this.editForm = {
        activityCode: '',
        activityName: '',
        channel: '',
        activityMoney: '',
        activityType: '',
        beginDate: '',
        endDate: '',
        activityContent: '',
        activityUrl: '',
        activityShortUrl: '',
        dateDisable: '',
        remark: '',
        cutPoint: ''
      }
      this.isEmpty = false
    },

    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.activityList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'saleActivity/exportSaleActivity',
        name: getRouteName('/marketAction'),
        type: 'xls'
      }
      excelList(params, this)
    },

    // 日志变更查询
    handleLogChange (id) {
      let url = '/saleActivity/getUpdateLog'
      this.$refs.changeLogAby.initComponent(url, id)
    },

    // 审批申请
    handleApprove (type, params) {
      if (type === 'apply') {
        this.applyVisible = true
        this.isEmpty = false
        this.handleReset()
        this.applyForm.approveId = params.approveId
        this.applyForm.approveCode = params.approveCode
        this.applyForm.approveOaCode = params.approveOaCode
        this.applyForm.approveOaRemark = params.approveOaRemark
      } else {
        // 废弃
        let title = '是否确认废弃审核?'
        let data = {
          id: params,
          status: '4'
        }
        this.handleApproveData(title, data)
      }
    },

    // 审批状态处理
    handleApproveData (title, data) {
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        querySaleApproveStatus(data).then(res => {
          this.$message.success(res.message)
          this.getSaleActivityList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },

    // 审核申请弹出框 -- 重置
    handleReset () {
      this.applyForm = {
        approveCode: '',
        approveOaCode: '',
        approveOaRemark: ''
      }
      this.isEmpty = false
    },

    // 审核申请弹出框 -- 提交
    handleSubmit () {
      if (this.applyForm.approveOaCode) {
        let data = JSON.parse(JSON.stringify(this.applyForm))
        querySaleApproveApply(data).then(res => {
          this.reviewList = res
          this.applyVisible = false
          this.getSaleActivityList()
          this.$message.success(res.message)
        }).catch(err => {
          this.$message.error(err)
        })
      } else {
        this.isEmpty = true
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
