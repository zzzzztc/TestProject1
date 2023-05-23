<template>
  <div class="container">
    <!--<h1>系统操作日志查询</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item fl">
          <el-date-picker
            :clearable = "false"
            :editable = "false"
            unlink-panels
            class="date-picker-380"
            size="medium"
            v-model="operateDate"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="起始日期"
            end-placeholder="截止日期"
            align="right">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.data' placeholder="请选择类型" clearable size="medium">
            <el-option key="0" label="登陆系统" value="0"></el-option>
            <el-option key="1" label="退出系统" value="1"></el-option>
            <el-option key="2" label="添加" value="2"></el-option>
            <el-option key="3" label="修改" value="3"></el-option>
            <el-option key="4" label="删除" value="4"></el-option>
            <el-option key="5" label="查询" value="5"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="账号" v-model="searchForm.account" @keydown.enter.native="peratorLogList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="peratorLogList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="!tableList.total" @click="handleExport">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container" >
        <el-table
          v-loading="loading"
          :data='tableList.rows'
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
          <!--<el-table-column type="selection" width="46" fixed="left"></el-table-column>-->
          <el-table-column label="账号" prop="opaccount"></el-table-column>
          <el-table-column label="姓名" prop="opname"></el-table-column>
          <el-table-column label="时间" prop="createTime"></el-table-column>
          <el-table-column label="操作类型">
            <template slot-scope="scope">
              {{scope.row.logData | logDataMap}}
            </template>
          </el-table-column>
          <el-table-column label="内容" prop="logContent" min-width="160"></el-table-column>
        </el-table>
      </div>
    </div>
    <!--表格分页-->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableList.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { queryOperatorLogList } from './api'
import { computeTableHeight, getCurrentDate, excelList, getRouteName } from '../../../utils/index'

export default {
  name: 'OperatorLog',
  data () {
    return {
      searchForm: {
        data: '', // 类型
        account: '', // 账号
        startdate: '', // 起始日期
        enddate: '' // 截止日期
      }, // 搜索框 -- 数据
      operateDate: [], // 搜索框 -- 日期
      tableList: [], // 表格 -- 数据
      multipleSelection: [], // 表格 -- 选择项数据
      dataViewHeight: null, // 表格 -- 高度
      loading: false // 加载 -- 数据加载时显示的动效
    }
  },
  filters: {
    // 操作类型 -- 过滤器
    logDataMap (logData) {
      let logDataName = ''
      switch (logData) {
        case '0':
          logDataName = '登陆系统'
          break
        case '1':
          logDataName = '退出系统'
          break
        case '2':
          logDataName = '添加'
          break
        case '3':
          logDataName = '修改'
          break
        case '4':
          logDataName = '删除'
          break
        case '5':
          logDataName = '查询'
          break
        default:
          logDataName = '--'
      }
      return logDataName
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.getDateTerm()
    this.peratorLogList(1, this.pagination.pageSize)
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    // 搜索框 -- 获取日期期限
    getDateTerm () {
      this.operateDate = [getCurrentDate(0, '01'), getCurrentDate(0)]
    },
    // 搜索框 -- 重置
    handleReset () {
      this.searchForm = {}
      this.getDateTerm()
      this.peratorLogList(1, this.pagination.pageSize)
    },
    // 表格 -- 分页导航
    handleSizeChange (pages) {
      this.peratorLogList(null, pages)
    },
    handleCurrentChange (page) {
      this.peratorLogList(page, null)
    },
    // 表单 -- 选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 表格 -- 获取数据
    peratorLogList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      this.searchForm['sourceid'] = 'sdal'
      if (this.operateDate && this.operateDate.length) {
        this.searchForm.startdate = this.operateDate[0]
        this.searchForm.enddate = this.operateDate[1]
      }
      queryOperatorLogList(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 表格 -- 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.searchForm))
      data.start = 1
      data.end = this.tableList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'common/exportOperatorLog',
        name: getRouteName('/operatorLog'),
        type: 'xls'
      }
      excelList(params, this)
    }
  }
}
</script>

<style scoped>

</style>
