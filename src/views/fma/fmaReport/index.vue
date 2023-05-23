<template>
  <div id="FmaReport" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt w-180">
          <el-input size="mini" clearable placeholder="工号" v-model="filter.bndStaffNo" @keydown.enter.native="getReportList()"></el-input>
        </div>
        <div class="search-item search-ipt w-180">
          <el-input size="mini" clearable placeholder="员工姓名" v-model="filter.bndName" @keydown.enter.native="getReportList()"></el-input>
        </div>
        <div class="search-item search-ipt w-180">
          <el-input size="mini" clearable placeholder="部门" v-model="filter.bndStaffDept" @keydown.enter.native="getReportList()"></el-input>
        </div>
        <div class="search-item search-ipt w-180">
          <el-input size="mini" clearable placeholder="员工手机号" v-model="filter.bndMobileNo" @keydown.enter.native="getReportList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-button type="primary" size="mini" @click="getReportList()">查询</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" :disabled="!report.total" size="mini" @click="exportReport">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          :data="report.rows"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle"
          :height="dataViewHeight"
          v-loading="loading">
          <el-table-column label="工号" prop="bndStaffNo"></el-table-column>
          <el-table-column label="员工姓名" prop="bndName"></el-table-column>
          <el-table-column label="部门" prop="bndStaffDept"></el-table-column>
          <el-table-column label="参加时间" prop="bndCreatedTime"></el-table-column>
          <el-table-column label="推广数量" prop="pcount"></el-table-column>
          <el-table-column label="票面张数" prop="rcount"></el-table-column>
          <el-table-column label="票面金额" prop="rtsum"></el-table-column>
          <el-table-column label="成行奖励" prop="rasum"></el-table-column>
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
        :total="report.total">></el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchList } from './api.js'
import { mapState } from 'vuex'
import { computWidth } from '@/mixins/computWidt'
import { excelList, getRouteName } from '@/utils'
export default {
  name: 'FmaReport',
  data () {
    return {
      loading: false,
      filter: {},
      report: {},
      dataViewHeight: null
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
    this.getReportList(1, this.pagination.pageSize)
  },
  methods: {
    // 查询
    getReportList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter)
        .then(res => {
          this.loading = false
          this.report = res
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 分页
    handleSizeChange (pages) {
      this.getReportList(null, pages)
    },
    handleCurrentChange (page) {
      this.getReportList(page, null)
    },
    // 导出
    exportReport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      delete data.page
      delete data.rows
      data.start = 1
      data.end = this.report.total
      const url = 'fma/exportFmaReport'
      const name = getRouteName('/fmaReport')
      let type = 'csv'
      const obj = {
        data,
        url,
        name,
        type
      }
      excelList(obj)
    }
  }
}
</script>

<style scoped lang="scss"></style>
