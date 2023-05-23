<template>
  <div id="UpgradeNumReport" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.accessDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.accessDateEnd"
            class="w-180"
            type="date"
            value-format="yyyy-MM-dd"
            size="medium"
            placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="活动渠道" v-model="filter.channel" @keydown.enter.native="getSaleActivityList()">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getUpgradDataAnalysis()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="upgradeReportList.total === 0" @click="handleExport()">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="upgradeReportList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="日期" v-if="tableList.accessDate" prop="accessDate" min-width="140"></el-table-column>
          <el-table-column label="渠道" v-if="tableList.channel" prop="channel" min-width="120">
            <template slot-scope="scope">
                <span v-if="scope.row.channel && scope.row.channel !== 'null'">
                  {{scope.row.channel | channelMap}}
                </span>
              <span v-else>全渠道</span>
            </template>
          </el-table-column>
          <el-table-column label="访问次数" v-if="tableList.accessCount" prop="accessCount" min-width="100"></el-table-column>
          <el-table-column label="查询次数" v-if="tableList.tripCount" prop="tripCount" min-width="100"></el-table-column>
          <el-table-column label="出价次数" v-if="tableList.bookCount" prop="bookCount" min-width="100"></el-table-column>
          <el-table-column label="出票数量" v-if="tableList.tticketCount" prop="tticketCount" min-width="100"></el-table-column>
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
        :total="upgradeReportList.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelList, excelList, getRouteName } from '../../../utils/index'
import { queryUpgradDataAnalysis } from './api.js'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'UpgradeNumReport',
  data () {
    return {
      loading: false,
      dataViewHeight: null,
      filter: {
        accessDateStart: '', // 开始日期
        accessDateEnd: '', // 结束日期
        channel: '', // 渠道
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件列表
      upgradeReportList: {}, // 表格数据列表
      tableList: {
        accessDate: true,
        channel: true,
        accessCount: true,
        tripCount: true,
        bookCount: true,
        tticketCount: true

      } // 表格展示数据列表
    }
  },
  created () {
    this.judgeChannelList()
    this.getUpgradDataAnalysis(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 分页
    handleSizeChange (pages) {
      this.getSaleReport(null, pages)
    },
    handleCurrentChange (page) {
      this.getSaleReport(page, null)
    },

    // 获取列表数据
    getUpgradDataAnalysis (page, pageSize) {
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.loading = true
      queryUpgradDataAnalysis(this.filter).then(res => {
        this.upgradeReportList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },

    // 重置查询条件
    resetFilter () {
      this.filter = {
        accessDateStart: '',
        accessDateEnd: '',
        channel: ''
      }
      this.getUpgradDataAnalysis(1, this.pagination.pageSize)
    },

    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.upgradeReportList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'report/exportUpgradDataAnalysis',
        name: getRouteName('/upgradeNumReport'),
        type: 'xls'
      }
      excelList(params, this)
    }
  }
}
</script>

<style scoped>

</style>
