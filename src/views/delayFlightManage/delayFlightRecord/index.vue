<template>
  <div id="FlightDelayProveList" class="container">
    <!--<h1>航延证明记录列表查询</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.channel' placeholder="请选择渠道" size="medium" clearable>
            <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
          </el-select>
        </div>refundAudit
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="航延证明编号" v-model="searchForm.proveCode" @keydown.enter.native="delayFlightRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.delayType' placeholder="请选择延误类型" size="medium" clearable>
            <el-option key="0" label="延误" value="0"></el-option>
            <el-option key="1" label="取消" value="1"></el-option>
            <el-option key="2" label="备降" value="2"></el-option>
            <el-option key="3" label="返航" value="3"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="会员号码" v-model="searchForm.memMobile" @keydown.enter.native="delayFlightRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="联系人姓名" v-model="searchForm.contName" @keydown.enter.native="delayFlightRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="联系人号码" v-model="searchForm.contMmobile" @keydown.enter.native="delayFlightRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="旅客姓名" v-model="searchForm.passger" @keydown.enter.native="delayFlightRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="证件号" v-model="searchForm.cardno" @keydown.enter.native="delayFlightRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="票号" v-model="searchForm.ticketno" @keydown.enter.native="delayFlightRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="航班号" v-model="searchForm.flightNo" @keydown.enter.native="delayFlightRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.startDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开具开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.endDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开具截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            :clearable = "false"-->
<!--            :editable = "false"-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="openDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="开具开始日期"-->
<!--            end-placeholder="开具截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.startflightDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.endflightDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请开始日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="flightDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="航班开始日期"-->
<!--            end-placeholder="航班截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="起飞地" v-model="searchForm.dept" @keydown.enter.native="delayFlightRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="目的地" v-model="searchForm.arrive" @keydown.enter.native="delayFlightRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.delayStatus' clearable placeholder="请选择开具状态" size="medium">
            <el-option key="1" label="失败" value="0"></el-option>
            <el-option key="0" label="成功" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="delayFlightRecordList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="!flightRecordList.total" @click="exportPolicyRecordXls">导出</el-button>
        <!--<el-button size="medium">发送邮件</el-button>-->
      </div>
      <div v-if="isColumn" class="search-container clearfix flex">
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
    <div class="main">
      <div class="column-btn" @click="switchColumn">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="table-container" >
        <el-table
          v-loading="loading"
          :data="flightRecordList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column fixed="left" type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="计划起飞时间">
                  <span>{{ props.row.planDtime }}</span>
                </el-form-item>
                <el-form-item label="实际起飞时间">
                  <span>{{ props.row.actDtime }}</span>
                </el-form-item>
                <el-form-item label="计划到达时间">
                  <span>{{ props.row.planDtime }}</span>
                </el-form-item>
                <el-form-item label="实际到达时间">
                  <span>{{ props.row.actAtime }}</span>
                </el-form-item>
                <el-form-item label="延误原因">
                  <span>{{ props.row.delayReason }}</span>
                </el-form-item>
                <el-form-item label="邮箱地址">
                  <span>{{ props.row.email }}</span>
                </el-form-item>
                <el-form-item label="呼叫中心是否通知">
                  <span v-if="props.row.clctNotice === ''">--</span>
                  <span v-if="props.row.clctNotice === '1'">是</span>
                  <span v-if="props.row.clctNotice === '2'">否</span>
                </el-form-item>
                <el-form-item label="呼叫中心通知类型">
                  <span v-if="props.row.clctNoticeType === ''">--</span>
                  <span v-if="props.row.clctNoticeType === '1'">时刻调整</span>
                  <span v-if="props.row.clctNoticeType === '2'">取消调整</span>
                </el-form-item>
                <el-form-item label="开具时间">
                  <span>{{ props.row.createTime }}</span>
                </el-form-item>
                <el-form-item label="失败原因">
                  <span>{{ props.row.delayFailReason }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
          <!--<el-table-column type="selection" min-width="46" fixed="left"></el-table-column>-->
          <el-table-column v-if="tableList.channel" label="渠道编号" prop="channel" min-width="180">
            <template slot-scope="scope">
              <div>{{scope.row.channel | channelMap}}</div>
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.proveCode" label="航延证明编号" prop="proveCode" min-width="180"></el-table-column>
          <el-table-column v-if="tableList.delayStatus" label="开具状态" prop="delayStatus">
            <template slot-scope="scope">
              <div v-if="scope.row.delayStatus === '0'">失败</div>
              <div v-if="scope.row.delayStatus === '1'">成功</div>
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.delayType" label="延误类型" prop="delayType">
            <template slot-scope="scope">
              <div v-if="scope.row.delayType === '0'">延误</div>
              <div v-if="scope.row.delayType === '1'">取消</div>
              <div v-if="scope.row.delayType === '2'">备降</div>
              <div v-if="scope.row.delayType === '3'">返航</div>
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.memType" label="会员类别" prop="memType" min-width="120">
            <template slot-scope="scope">
              <div>{{scope.row.memType | memTypeMap}}</div>
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.memMobile" label="会员号码" prop="memMobile" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.contName" label="联系人姓名" prop="contName" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.contMmobile" label="联系人号码" prop="contMmobile" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.passger" label="旅客姓名" prop="passger" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.cardno" label="证件号" prop="cardno" min-width="180"></el-table-column>
          <el-table-column v-if="tableList.ticketno" label="票号" prop="ticketno" min-width="180"></el-table-column>
          <el-table-column v-if="tableList.flightNo" label="航班号" prop="flightNo" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.flightDate" label="航班日期" prop="flightDate" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.dept" label="起飞地" prop="dept" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.arrive" label="目的地" prop="arrive" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.spareLand" label="备降地" prop="spareLand" min-width="120"></el-table-column>
          <!--<el-table-column label="计划起飞时间" prop="planDtime" min-width="180"></el-table-column>-->
          <!--<el-table-column label="实际起飞时间" prop="actDtime" min-width="180"></el-table-column>-->
          <!--<el-table-column label="计划到达时间" prop="planDtime" min-width="180"></el-table-column>-->
          <!--<el-table-column label="实际到达时间" prop="actAtime" min-width="180"></el-table-column>-->
          <!--<el-table-column label="延误原因" prop="delayReason" min-width="120"></el-table-column>-->
          <!--<el-table-column label="邮箱地址" prop="email" min-width="180"></el-table-column>-->
          <!--<el-table-column label="呼叫中心是否通知" prop="clctNotice" min-width="180">-->
            <!--<template slot-scope="scope">-->
              <!--<div v-if="scope.row.clctNotice === ''">&#45;&#45;</div>-->
              <!--<div v-if="scope.row.clctNotice === '1'">是</div>-->
              <!--<div v-if="scope.row.clctNotice === '2'">否</div>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="呼叫中心通知类型" prop="clctNoticeType" min-width="180">-->
            <!--<template slot-scope="scope">-->
              <!--<div v-if="scope.row.clctNoticeType === ''">&#45;&#45;</div>-->
              <!--<div v-if="scope.row.clctNoticeType === '1'">时刻调整</div>-->
              <!--<div v-if="scope.row.clctNoticeType === '2'">取消调整</div>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="开具时间" prop="createTime" min-width="180"></el-table-column>-->
          <!--<el-table-column label="失败原因" prop="delayFailReason" min-width="280"></el-table-column>-->
          <el-table-column label="操作" min-width="160" v-if="checked.length">
            <template slot-scope="scope">
                <span class="active-text mr-5" @click="handleEmail(scope.row.proveCode)">发送邮件</span>
                <span class="active-text mr-5" @click="handleDetail(scope.row.proveId)">查看详情</span>
            <!--<i class="table-icon delete-icon" title="删除" @click="handleDelete(scope.row.policyId)"></i>-->
            <!--<i class="table-icon edit-icon" title="编辑" @click="handleEdit(scope.row)"></i>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="flightRecordList.total">
      </el-pagination>
    </div>
    <el-dialog title="航延证明详情" :visible.sync="editVisible" width="800px">
      <div class="dialog-container">
        <div class="dialog-main">
          <el-table
            :data="frameList"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="航延证明编号" prop="proveCode" min-width="120"></el-table-column>
            <el-table-column label="渠道编号" prop="channel" min-width="100">
              <template slot-scope="scope">
                <div>{{scope.row.channel | channelMap}}</div>
              </template>
            </el-table-column>
            <el-table-column label="延误类型" prop="delayType" min-width="100">
              <template slot-scope="scope">
                <div>{{scope.row.delayType | delayTypeMap}}</div>
              </template>
            </el-table-column>
            <el-table-column label="会员类别" prop="memType" min-width="100">
              <template slot-scope="scope">
                <div>{{scope.row.memType | memTypeMap}}</div>
              </template>
            </el-table-column>
            <el-table-column label="会员号码" prop="memMobile" min-width="100"></el-table-column>
          </el-table>
          <el-table
            :data="frameList"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="联系人姓名" prop="contName" min-width="120"></el-table-column>
            <el-table-column label="联系人号码" prop="contMmobile" min-width="100"></el-table-column>
            <el-table-column label="旅客姓名" prop="passger" min-width="100"></el-table-column>
            <el-table-column label="证件号" prop="cardno" min-width="100"></el-table-column>
          </el-table>
          <el-table
            :data="frameList"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="票号" prop="ticketno" min-width="120"></el-table-column>
            <el-table-column label="航班号" prop="flightNo" min-width="100"></el-table-column>
            <el-table-column label="航班日期" prop="flightDate" min-width="100"></el-table-column>
            <el-table-column label="起飞地" prop="dept" min-width="100"></el-table-column>
            <el-table-column label="目的地" prop="arrive" min-width="100"></el-table-column>
          </el-table>
          <el-table
            :data="frameList"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="计划起飞时间" prop="planDtime" min-width="120"></el-table-column>
            <el-table-column label="实际起飞时间" prop="actDtime" min-width="100"></el-table-column>
            <el-table-column label="计划到达时间" prop="planDtime" min-width="100"></el-table-column>
            <el-table-column label="实际到达时间" prop="actAtime" min-width="100"></el-table-column>
          </el-table>
          <el-table
            :data="frameList"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="邮箱地址" prop="email" min-width="120"></el-table-column>
            <el-table-column label="延误原因" prop="delayReason" min-width="100"></el-table-column>
            <el-table-column label="呼叫中心是否通知" prop="clctNotice" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.clctNotice === '1'">是</span>
                <span v-if="scope.row.clctNotice === '2'">否</span>
              </template>
            </el-table-column>
            <el-table-column label="呼叫中心通知类型" prop="clctNoticeType" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.clctNoticeType === '1'">时刻调整</span>
                <span v-if="scope.row.clctNoticeType === '2'">取消调整</span>
              </template>
            </el-table-column>
            <el-table-column label="开具时间" prop="createTime" min-width="120"></el-table-column>
          </el-table>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" @click="editVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { queryFlightDelayProveList, delaySendEmail, queryFlightDelayProveInfo } from './api'
import { getCurrentDate, getChannelList, excelList, getRouteName } from '../../../utils/index'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'FlightDelayProveList',
  data () {
    return {
      componentName: 'flightDelayProveList',
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        channel: true,
        proveCode: true,
        delayStatus: true,
        delayType: false,
        memType: false,
        memMobile: false,
        contName: false,
        contMmobile: false,
        passger: true,
        cardno: false,
        ticketno: true,
        flightNo: false,
        flightDate: true,
        dept: false,
        arrive: false,
        spareLand: false
        // spareLand: false,
        // planDtime: true,
        // actDtime: false,
        // planDtime: false,
        // actAtime: false,
        // delayReason: false,
        // email: false,
        // clctNotice: false,
        // clctNoticeType: false,
        // createTime: false,
        // delayFailReason: false
      },
      searchForm: {
        condition: 1,
        channel: '', // 渠道类型
        proveCode: '', // 航延证明编号
        delayType: '', // 延误类型
        memMobile: '', // 会员号码
        contName: '', // 联系人姓名
        contMmobile: '', // 联系人号码
        passger: '', // 旅客姓名
        cardno: '', // 证件号
        ticketno: '', // 票号
        flightNo: '', // 航班号
        startDate: '', // 开具开始日期
        endDate: '', // 开具截止日期
        startflightDate: '', // 航班开始时间
        endflightDate: '', // 航班截止时间
        dept: '', // 起飞地
        arrive: '', // 目的地
        delayStatus: '', // 开具状态
        page: 1
      },
      openDate: [], // 开具开始/结束日期
      flightDate: [], // 航班开始/结束日期
      flightRecordList: {}, // 展示表格数据
      frameList: [], // 航延证明详情数据
      multipleSelection: [], // 选中的表单数据
      dataViewHeight: null, // 表格高度
      editVisible: false, // 弹出框显示隐藏
      loading: false
    }
  },
  created () {
    this.getDate()
    this.getChannelList()
    this.delayFlightRecordList(1, this.pagination.pageSize)
    // this.locCheck()
  },
  mixins: [checkAttrs, computWidth],
  filters: {
    // 延误类型
    delayTypeMap (delayType) {
      let delayTypeName = ''
      switch (delayType) {
        case '1':
          delayTypeName = '延误'
          break
        case '2':
          delayTypeName = '取消'
          break
        case '3':
          delayTypeName = '备降'
          break
        case '4':
          delayTypeName = '返航'
          break
        default:
          delayTypeName = '--'
      }
      return delayTypeName
    },
    // 会员类别
    memTypeMap (memType) {
      let memTypeName = ''
      switch (memType) {
        case '1':
          memTypeName = '手机登录会员'
          break
        case '2':
          memTypeName = '常旅客会员'
          break
        default:
          memTypeName = '--'
      }
      return memTypeName
    }
  },
  computed: {
    ...mapState({
      channelList: state => state.app.channelList, // 渠道
      tableAttributes: state => state.app.tableAttributes, // 表格
      pagination: state => state.app.pagination // 分页
    })
  },
  methods: {
    // 获取当前日期
    getDate () {
      this.openDate = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.searchForm.startDate = this.openDate[0]
      this.searchForm.endDate = this.openDate[1]
    },
    // 分页导航
    handleSizeChange (pages) {
      this.delayFlightRecordList(null, pages)
    },
    handleCurrentChange (page) {
      this.delayFlightRecordList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // channel没有则请求服务器
    getChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 获取表格数据
    delayFlightRecordList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      // this.handleDate()
      queryFlightDelayProveList(this.searchForm).then(res => {
        this.flightRecordList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 日期处理
    handleDate () {
      // 开具日期
      if (this.openDate && this.openDate.length) {
        this.searchForm.startDate = this.openDate[0]
        this.searchForm.endDate = this.openDate[1]
      } else {
        delete this.searchForm.startDate
        delete this.searchForm.endDate
      }
      // 航班日期
      if (this.flightDate && this.flightDate.length) {
        this.searchForm.startflightDate = this.flightDate[0]
        this.searchForm.endflightDate = this.flightDate[1]
      } else {
        delete this.searchForm.startflightDate
        delete this.searchForm.endflightDate
      }
    },
    // 重置
    handleReset () {
      this.searchForm = {
        startDate: '',
        endDate: ''
      }
      this.openDate = []
      this.flightDate = []
      this.flightRecordList = {}
      this.frameList = []
      this.getDate()
      this.getChannelList()
      this.delayFlightRecordList(1, this.pagination.pageSize)
    },
    // 导出
    exportPolicyRecordXls () {
      let data = JSON.parse(JSON.stringify(this.searchForm))
      data.start = 1
      data.end = this.flightRecordList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'flightDelayProve/exportFlightDelayProve',
        name: getRouteName('/flightDelayProveList'),
        type: 'xls',
        total: this.flightRecordList.total
      }
      excelList(params, this)
    },
    // 发送邮件
    handleEmail (code) {
      this.$prompt('邮箱地址', '发送邮箱', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '邮箱格式不正确'
      }).then(({ value }) => {
        delaySendEmail({
          delayCode: code,
          email: value
        }).then(res => {
          this.$message.success(res.message)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('取消发送邮件')
      })
    },
    // 查看详情
    handleDetail (id) {
      this.editVisible = true
      queryFlightDelayProveInfo({ proveId: id }).then(res => {
        this.frameList = res.rows
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
    // 删除
    // handleDelects () {}
  }
}
</script>

<style scoped lang="scss">

</style>
