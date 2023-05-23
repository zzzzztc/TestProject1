<template>
  <div id="ActivityReport" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select v-model="filter.cutPoint" placeholder="请选择活动场景" size="medium" clearable>
            <el-option v-for="item in dictsbyTypeList" :key="item.dincCode" :value="item.dincCode" :label="item.dincName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="活动编号" v-model="filter.activityCode" @keydown.enter.native="getSaleActivityDataAnalysis()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="审批流程编号" v-model="filter.approveOaCode" @keydown.enter.native="getSaleActivityDataAnalysis()"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getSaleActivityDataAnalysis()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="activityReportList.total === 0" @click="handleExport()">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="activityReportList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="活动编号" v-if="tableList.activityCode" prop="activityCode" min-width="120"></el-table-column>
          <el-table-column label="活动名称" v-if="tableList.activityName" prop="activityName" min-width="120"></el-table-column>
          <el-table-column label="活动总金额" v-if="tableList.activityMoney" prop="activityMoney" min-width="100">
            <template slot-scope="scope">
              {{scope.row.activityMoney | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="活动类型" v-if="tableList.activityType" prop="activityType" min-width="100">
            <template slot-scope="scope">
              {{scope.row.activityType | activityTypeMap}}
            </template>
          </el-table-column>
          <el-table-column label="优惠券数量" v-if="tableList.totalNum" prop="totalNum" min-width="100"></el-table-column>
          <el-table-column label="已领取数量" v-if="tableList.allotNum" prop="allotNum" min-width="100"></el-table-column>
          <el-table-column label="领取率" v-if="tableList.allotZb" prop="allotZb" min-width="100"></el-table-column>
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
        :total="activityReportList.total">
      </el-pagination>
    </div>
    <!--模板详情弹出框-->
    <TempletDiaLog ref="templetAby"></TempletDiaLog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TempletDiaLog from '../../../components/couponTempletDetail'
import { getDictsByType, excelList, getRouteName } from '../../../utils/index'
import { querySaleActivityDataAnalysis } from './api.js'
import { computWidth } from '../../../mixins/computWidt'
export default {
  name: 'ActivityReport',
  data () {
    return {
      loading: false,
      dataViewHeight: null,
      filter: {
        activityCode: '', // 活动编号
        approveOaCode: '', // 审批流程编号
        cutPoint: '', // 活动场景
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件列表
      activityReportList: {}, // 表格数据列表
      tableList: {
        activityCode: true,
        activityName: true,
        activityMoney: true,
        activityType: true,
        totalNum: true,
        allotNum: true,
        allotZb: true
      } // 表格展示数据列表
    }
  },
  created () {
    this.judgeChannelList()
    this.getSaleActivityDataAnalysis(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      dictsbyTypeList: state => state.app.dictsbyTypeList
    })
  },
  components: {
    TempletDiaLog
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.dictsbyTypeList.length) {
        getDictsByType()
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
    getSaleActivityDataAnalysis (page, pageSize) {
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.loading = true
      querySaleActivityDataAnalysis(this.filter).then(res => {
        this.activityReportList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },

    // 重置查询条件
    resetFilter () {
      this.filter = {
        activityCode: '',
        approveOaCode: '',
        cutPoint: ''
      }
      this.getSaleActivityDataAnalysis(1, this.pagination.pageSize)
    },

    // 优惠券模板详情
    switchDialog (id) {
      this.$refs.templetAby.initComponent(id)
    },

    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.activityReportList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'saleActivity/exportSaleActivityDataAnalysis',
        name: getRouteName('/activityReport'),
        type: 'xls'
      }
      excelList(params, this)
    }
  }
}
</script>

<style scoped>

</style>
