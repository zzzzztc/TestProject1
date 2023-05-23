<template>
  <!--<div>员工配额查询</div>-->
  <div id="StaffLimitQuery" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="工号" v-model="filter.jobNo" @keydown.enter.native="getTaffLimitList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="姓名" v-model="filter.cnName" @keydown.enter.native="getTaffLimitList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="年度" v-model="filter.jobYear" @keydown.enter.native="getTaffLimitList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="票类型" v-model="filter.ticketType" @keydown.enter.native="getTaffLimitList()">
            <el-option v-for="item in ticketTypeList" :key="item.dincId" :label="item.dincName" :value="item.dincCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getTaffLimitList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="taffLimitList.total === 0" @click="handleExport()">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="taffLimitList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column label="年度" prop="jobYear" min-width="100"></el-table-column>
          <el-table-column label="工号" prop="jobNo" min-width="100"></el-table-column>
          <el-table-column label="姓名" prop="cnName" min-width="100"></el-table-column>
          <el-table-column label="票类型" prop="ticketTypeName" min-width="100"></el-table-column>
          <el-table-column label="关系" prop="relationship" min-width="100"></el-table-column>
          <el-table-column label="已用配额" prop="useLimit" min-width="100"></el-table-column>
          <el-table-column label="国际已用配额" prop="useInterLimit" min-width="100"></el-table-column>
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
            :total="taffLimitList.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { computWidth } from '../../../mixins/computWidt'
import { excelList, getRouteName, getTicketType } from '../../../utils'
import { queryDStaffLimitList } from './api'
export default {
  name: 'StaffLimitQuery',
  data () {
    return {
      componentName: 'StaffLimitQuery',
      loading: false,
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      filter: {
        jobNo: '', // 工号
        cnName: '', // 姓名
        jobYear: '', // 年度
        airways: 'NS', // 航司二字码
        ticketType: '', // 票类型
        page: '', // 开始页
        rows: '' // 页面展示数量
      },
      taffLimitList: {} //  表格数据
    }
  },
  created () {
    this.judgeChannelList()
    this.getTaffLimitList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      ticketTypeList: state => state.app.ticketTypeList
    })
  },
  filters: {
    upper (value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    }
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.ticketTypeList.length) {
        getTicketType()
      }
    },
    // 分页导航
    handleSizeChange (pages) {
      this.getTaffLimitList(null, pages)
    },
    handleCurrentChange (page) {
      this.getTaffLimitList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    getTaffLimitList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      queryDStaffLimitList(this.filter).then(res => {
        this.taffLimitList = res
        this.loading = false
        this.handleFilterData(res.rows)
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    handleFilterData (data) {
      for (let item of data) {
        for (let it of this.ticketTypeList) {
          if (item.ticketType === it.dincCode) {
            item.ticketTypeName = it.dincName
          }
        }
      }
    },
    // 查询条件 -- 重置
    resetFilter () {
      this.filter.jobNo = ''
      this.filter.cnName = ''
      this.filter.jobYear = ''
      this.filter.airways = 'NS'
      this.filter.ticketType = ''
      this.getTaffLimitList()
    },
    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.taffLimitList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'dstafflimit/exportDStaffLimit',
        name: getRouteName('/staffLimitQuery'),
        type: 'xls'
      }
      excelList(params, this)
    }
  }
}
</script>

<style scoped>

</style>
