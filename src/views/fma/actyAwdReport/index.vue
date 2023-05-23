<template>
  <div id="ActyAwdReport" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="活动代码"
            v-model="filter.actyCode"
            @keydown.enter.native="getActyAwdReport()"
            clearable></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="活动名称"
            v-model="filter.actyName"
            @keydown.enter.native="getActyAwdReport()"
            clearable></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="会员姓名"
            v-model="filter.realName"
            @keydown.enter.native="getActyAwdReport()"
            clearable></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="航班号"
            v-model="filter.fltNo"
            @keydown.enter.native="getActyAwdReport()"
            clearable></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.fltDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.endDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束时间">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getActyAwdReport()">查询</el-button>
          <el-button size="medium" @click="resetSearch">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="awdReport.total === 0" @click="exportReport">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          :data="awdReport.rows"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle"
          :height="dataViewHeight">
          <el-table-column label="活动代码" prop="actyCode" min-width="60"></el-table-column>
          <el-table-column label="活动名称" prop="actyName" min-width="80"></el-table-column>
          <el-table-column label="会员姓名" prop="realName" min-width="40"></el-table-column>
          <el-table-column label="航班号" prop="fltNo" min-width="40"></el-table-column>
          <el-table-column label="航班日期" prop="fltDate" min-width="80"></el-table-column>
          <el-table-column label="奖励金额" prop="awdAmount" min-width="40"></el-table-column>
          <el-table-column label="奖励日期" prop="awdCreatedTime" min-width="80"></el-table-column>
          <el-table-column label="奖励说明" prop="awdRemark" min-width="120"></el-table-column>
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
        :total="awdReport.total">></el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchList } from './api.js'
import { mapState } from 'vuex'
import { computWidth } from '../../../mixins/computWidt'
import { excelList, getRouteName } from '../../../utils'

export default {
  name: 'ActyAwdReport',
  data () {
    return {
      dataViewHeight: null,
      loading: false,
      filter: {
        actyCode: '', // 活动代码
        actyName: '', // 活动名称
        realName: '', // 姓名
        fltNo: '', // 航班号
        fltDate: '', // 航班日期
        startDate: '', // 开始时间
        endDate: '' // 结束时间
      },
      awdReport: {}
    }
  },
  mixins: [ computWidth ],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  created () {
    this.getActyAwdReport(1, this.pagination.pageSize)
  },
  methods: {
    // 查询奖励报表
    getActyAwdReport (page, pageSize) {
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.loading = true
      fetchList(this.filter)
        .then(res => {
          this.loading = false
          this.awdReport = res
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 重置
    resetSearch () {
      for (let key in this.filter) {
        this.filter[key] = ''
      }
      this.getActyAwdReport(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getActyAwdReport(null, pages)
    },
    handleCurrentChange (page) {
      this.getActyAwdReport(page, null)
    },
    exportReport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = 'fma/exportMarketAwardReport'
      let name = getRouteName('/actyAwdReport')
      let type = 'xls'
      data.start = 1
      data.end = this.awdReport.total
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
