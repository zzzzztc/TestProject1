<template>
  <!--<div>因公免票审核查询</div>-->
  <div id="TicketApplyQuery" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="工号" v-model="filter.jobNo" @keydown.enter.native="getTicketApplyList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="出发地" v-model="filter.afrom" @keydown.enter.native="getTicketApplyList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="到达地" v-model="filter.ato" @keydown.enter.native="getTicketApplyList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="航班号" v-model="filter.flightNo" @keydown.enter.native="getTicketApplyList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.flightDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="审批编号" v-model="filter.oaApplyCode" @keydown.enter.native="getTicketApplyList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select placeholder="审批状态" v-model='filter.applyStatus' size="medium" clearable>
            <el-option key="0" label="初始" value="0"></el-option>
            <el-option key="1" label="通过" value="2"></el-option>
            <el-option key="2" label="取消" value="4"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getTicketApplyList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="ticketApplyList.total === 0" @click="handleExport()">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="ticketApplyList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column label="工号" prop="jobNo" min-width="100"></el-table-column>
          <el-table-column label="出发地" prop="afrom" min-width="100"></el-table-column>
          <el-table-column label="到达地" prop="ato" min-width="100"></el-table-column>
          <el-table-column label="航班号" prop="flightNo" min-width="100"></el-table-column>
          <el-table-column label="航班日期" prop="flightDate" min-width="100"></el-table-column>
          <el-table-column label="事由" prop="cause" min-width="100"></el-table-column>
          <el-table-column label="审批编号" prop="oaApplyCode" min-width="100"></el-table-column>
          <el-table-column label="审批状态" prop="applyStatus" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.applyStatus === '0'">初始</span>
              <span v-if="scope.row.applyStatus === '2'">通过</span>
              <span v-if="scope.row.applyStatus === '4'">取消</span>
            </template>
          </el-table-column>
          <el-table-column label="出发地名称" prop="afromName" min-width="100"></el-table-column>
          <el-table-column label="到达地名称" prop="atoName" min-width="100"></el-table-column>
          <el-table-column label="创建日期" prop="createDate" min-width="100"></el-table-column>
          <el-table-column label="创建人" prop="createOpid" min-width="120"></el-table-column>
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
            :total="ticketApplyList.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { computWidth } from '../../../mixins/computWidt'
import { excelList, getRouteName } from '../../../utils'
import { queryDTicketApplyList } from './api'
export default {
  name: 'TicketApplyQuery',
  data () {
    return {
      componentName: 'TicketApplyQuery',
      loading: false,
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      filter: {
        airways: 'NS', // 航司二字码
        jobNo: '', // 工号
        afrom: '', // 出发地
        ato: '', // 到达地
        flightNo: '', // 航班号
        flightDate: '', // 航班日期
        oaApplyCode: '', // OA 审批编号
        applyStatus: '', // 审批状态
        page: '', // 开始页
        rows: '' // 页面展示数量
      },
      ticketApplyList: {} //  表格数据
    }
  },
  created () {
    this.getTicketApplyList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
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
    // 分页导航
    handleSizeChange (pages) {
      this.getTicketApplyList(null, pages)
    },
    handleCurrentChange (page) {
      this.getTicketApplyList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    getTicketApplyList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.filter.afrom = this.$options.filters.upper(this.filter.afrom)
      this.filter.ato = this.$options.filters.upper(this.filter.ato)
      queryDTicketApplyList(this.filter).then(res => {
        this.ticketApplyList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 查询条件 -- 重置
    resetFilter () {
      this.filter.airways = 'NS'
      this.filter.jobNo = ''
      this.filter.afrom = ''
      this.filter.ato = ''
      this.filter.flightNo = ''
      this.filter.flightDate = ''
      this.filter.oaApplyCode = ''
      this.filter.applyStatus = ''
      this.getTicketApplyList()
    },
    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.ticketApplyList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'dticketapply/exportDTicketApply',
        name: getRouteName('/ticketApplyQuery'),
        type: 'xls'
      }
      excelList(params, this)
    }
  }
}
</script>

<style scoped>

</style>
