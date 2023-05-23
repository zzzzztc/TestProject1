<template>
<!--  <div>活动发放统计</div>-->
  <div id="IssueStatistics" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="客户类型" v-model="filter.memberType" @keydown.enter.native="getSaleApplyRecordList()">
            <el-option label="会员" value="0"></el-option>
            <el-option label="常旅客" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="活动名称" v-model="filter.activityName" @keydown.enter.native="getSaleIssueDataList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="活动编号" v-model="filter.activityCode" @keydown.enter.native="getSaleIssueDataList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="活动类型" v-model="filter.activityType" @keydown.enter.native="getSaleIssueDataList()">
            <el-option label="优惠券" value="1"></el-option>
            <el-option label="积分" value="2"></el-option>
            <el-option label="钱包" value="3"></el-option>
            <el-option label="地面服务" value="4"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="领取渠道" v-model="filter.allotChannel" @keydown.enter.native="getSaleIssueDataList()">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="发放方式" v-model="filter.cutPoint" @keydown.enter.native="getSaleIssueDataList()">
            <el-option v-for="item in dictsbyTypeList" :key="item.dincCode" :value="item.dincCode" :label="item.dincName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.allotDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="发放时间开始">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.allotDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="发放时间结束">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getSaleIssueDataList()">查询</el-button>
          <el-button size="medium" @click="resetEdit()">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="issueDataList.total === 0" @click="handleExport()">导出</el-button>
      </div>
    </div>
    <div class="main">
      <el-table
        key="Math.random()"
        :cell-style= "tableAttributes.cellStyle"
        :stripe="tableAttributes.stripe"
        :border="tableAttributes.border"
        :data="issueDataList.rows"
        v-loading="loading"
        :height="dataViewHeight"
        @selection-change="handleSelectionChange">
<!--        <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
<!--        <el-table-column type="selection" fixed="left"></el-table-column>-->
        <el-table-column label="客户类型" v-if="tableList.memberType" prop="memberType" min-width="100">
          <template slot-scope="scope">
           <span v-if="scope.row.memberType && scope.row.memberType !== 'null'">
              {{scope.row.memberType | memberTypeMap}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="领取渠道" v-if="tableList.allotChannel" prop="allotChannel" min-width="140">
          <template slot-scope="scope">
                <span v-if="scope.row.allotChannel && scope.row.allotChannel !== 'null'">
                  {{scope.row.allotChannel | channelMap}}
                </span>
            <span v-else>全渠道</span>
          </template>
        </el-table-column>
        <el-table-column label="活动编号" v-if="tableList.activityCode" prop="activityCode" min-width="120"></el-table-column>
        <el-table-column label="活动名称" v-if="tableList.activityName" prop="activityName" min-width="140"></el-table-column>
        <el-table-column label="审批流程编号" v-if="tableList.approveOaCode" prop="approveOaCode" min-width="140"></el-table-column>
        <el-table-column label="发放时间" v-if="tableList.allotDate" prop="allotDate" min-width="160"></el-table-column>
        <el-table-column label="活动总金额" v-if="tableList.activityMoney" prop="activityMoney" min-width="100"></el-table-column>
        <el-table-column label="活动类型" v-if="tableList.activityType" prop="activityType" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.activityType === '1'">优惠券</span>
            <span v-if="scope.row.activityType === '2'">积分</span>
            <span v-if="scope.row.activityType === '3'">钱包</span>
            <span v-if="scope.row.activityType === '4'">地面服务</span>
          </template>
        </el-table-column>
        <el-table-column label="发放方式" v-if="tableList.cutPoint" prop="cutPoint" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.cutPoint | dictsByTypeMap}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <span class="active-text mr-5" title="安全查询" v-if="scope.row.memId" @click="handleSafety(scope.row)">安全查询</span>
          </template>
        </el-table-column>
      </el-table>
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
            :total="issueDataList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--安全查询弹出框-->
    <SafetyInquireDiaLog ref="safetyInquireAby"></SafetyInquireDiaLog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SafetyInquireDiaLog from '../../../../components/safetyInquireDiaLog'
import { getCurrentDate, getChannelList, excelList, getRouteName, getDictsByType } from '../../../../utils/index'
import { querySaleActivityAnalysis } from './api'
import { computWidth } from '../../../../mixins/computWidt'

export default {
  name: 'IssueStatistics',
  data () {
    return {
      loading: false,
      dataViewHeight: null,
      filter: {
        memberType: '', // 客户类型
        activityName: '', // 活动名称
        allotChannel: '', // 领取渠道
        activityCode: '', // 活动编号
        allotDateStart: '', // 发放时间开始
        allotDateEnd: '', // 发放时间结束
        activityType: '', // 活动类型
        cutPoint: '', // 发放方式
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询数据表单
      issueDataList: {}, // 表格数据表单
      tableList: {
        memberType: true, // 客户类型（0会员、1常旅客）
        allotChannel: true, // 领取渠道
        activityName: true, // 活动名称
        activityCode: true, // 活动编号
        approveOaCode: true, // 审批流程编号
        allotDate: true, // 发放时间
        activityMoney: true, // 活动总金额
        activityType: true, // 活动类型
        cutPoint: true // 发放方式
      }
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      dictsbyTypeList: state => state.app.dictsbyTypeList
    })
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getSaleIssueDataList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  components: {
    SafetyInquireDiaLog
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
      if (!this.dictsbyTypeList.length) {
        getDictsByType()
      }
    },

    // 默认日期处理
    initDate () {
      this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.filter.allotDateStart = this.date[0]
      this.filter.allotDateEnd = this.date[1]
    },

    // 分页导航
    handleSizeChange (pages) {
      this.getSaleIssueDataList(null, pages)
    },
    handleCurrentChange (page) {
      this.getSaleIssueDataList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getSaleIssueDataList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      querySaleActivityAnalysis(this.filter).then(res => {
        this.issueDataList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },

    // 查询条件重置
    resetEdit () {
      this.filter = {
        memberType: '',
        activityName: '',
        allotChannel: '',
        activityCode: '',
        allotDateStart: '',
        allotDateEnd: '',
        activityType: '',
        cutPoint: ''
      }
      this.initDate()
      this.getSaleIssueDataList(1, this.pagination.pageSize)
    },

    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.issueDataList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'saleActivityAnalysis/exportSaleActivityAnalysis',
        name: getRouteName('/IssueStatistics'),
        type: 'xls'
      }
      excelList(params, this)
    },

    // 安全查询
    handleSafety (params) {
      this.$refs.safetyInquireAby.initComponent({ memId: params.memId, memberType: params.memberType })
    }
  }
}
</script>

<style scoped lang="scss"></style>
