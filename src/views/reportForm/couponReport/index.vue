<template>
  <div id="CouponReport" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select v-model="filter.activityId" placeholder="请选择活动名称" size="medium">
            <el-option v-for="item in activityTypeList" :key="item.activityId" :value="item.activityId" :label="item.activityName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="模板编号" v-model="filter.templetCode" @keydown.enter.native="getMetCouponTempletDataAnalysis()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="模板名称" v-model="filter.templetName" @keydown.enter.native="getMetCouponTempletDataAnalysis()"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getMetCouponTempletDataAnalysis()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="couponReportList.total === 0" @click="handleExport()">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="couponReportList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="模板名称" v-if="tableList.templetName" prop="templetName" min-width="140"></el-table-column>
          <el-table-column label="模板编号" v-if="tableList.templetCode" prop="templetCode" min-width="120">
            <template slot-scope="scope">
              <div class="active-text" @click="switchDialog(scope.row.templetId)">{{scope.row.templetCode}}</div>
            </template>
          </el-table-column>
          <el-table-column label="优惠券面额" v-if="tableList.price" prop="price" min-width="100">
            <template slot-scope="scope">
              {{scope.row.price | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="发放量" v-if="tableList.successNum" prop="successNum" min-width="100"></el-table-column>
          <el-table-column label="发放金额" v-if="tableList.successPrice" prop="successPrice" min-width="100">
            <template slot-scope="scope">
              {{scope.row.successPrice | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="已使用数量" v-if="tableList.useNum" prop="useNum" min-width="100"></el-table-column>
          <el-table-column label="未使用数量" v-if="tableList.notUseNum" prop="notUseNum" min-width="100"></el-table-column>
          <el-table-column label="过期数量" v-if="tableList.outDateNum" prop="outDateNum" min-width="100"></el-table-column>
          <el-table-column label="作废数量" v-if="tableList.zfNum" prop="zfNum" min-width="100"></el-table-column>
          <el-table-column label="使用率" v-if="tableList.useNumZb" prop="useNumZb" min-width="100"></el-table-column>
          <el-table-column label="过期率" v-if="tableList.outDateNumZb" prop="outDateNumZb" min-width="100"></el-table-column>
          <el-table-column label="作废率" v-if="tableList.zfNumZb" prop="zfNumZb" min-width="100"></el-table-column>
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
        :total="couponReportList.total">
      </el-pagination>
    </div>
    <!--模板详情弹出框-->
    <TempletDiaLog ref="templetAby"></TempletDiaLog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TempletDiaLog from '../../../components/couponTempletDetail'
import { excelList, getRouteName } from '../../../utils/index'
import { queryMetCouponTempletDataAnalysis } from './api.js'
import { queryActivityType } from '../../../api/index'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'CouponReport',
  data () {
    return {
      loading: false,
      dataViewHeight: null,
      filter: {
        templetCode: '', // 模板编号
        templetName: '', // 模板名称
        activityId: '', // 活动ID
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件列表
      couponReportList: {}, // 表格数据列表
      tableList: {
        templetName: true,
        templetCode: true,
        price: true,
        successNum: true,
        successPrice: true,
        useNum: true,
        notUseNum: true,
        outDateNum: true,
        zfNum: true,
        useNumZb: true,
        outDateNumZb: true,
        zfNumZb: true

      }, // 表格展示数据列表
      activityTypeList: []
    }
  },
  created () {
    this.judgeChannelList()
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  mixins: [computWidth],
  components: {
    TempletDiaLog
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      queryActivityType().then(res => {
        this.activityTypeList = res.rows
        this.filter.activityId = res.rows[0].activityId
        this.getMetCouponTempletDataAnalysis(1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 分页
    handleSizeChange (pages) {
      this.getMetCouponTempletDataAnalysis(null, pages)
    },
    handleCurrentChange (page) {
      this.getMetCouponTempletDataAnalysis(page, null)
    },

    // 获取列表数据
    getMetCouponTempletDataAnalysis (page, pageSize) {
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.loading = true
      queryMetCouponTempletDataAnalysis(this.filter).then(res => {
        this.couponReportList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },

    // 重置查询条件
    resetFilter () {
      this.filter = {
        templetCode: '',
        templetName: '',
        activityId: this.activityTypeList[0].activityId
      }
      this.getMetCouponTempletDataAnalysis()
    },

    // 优惠券模板详情
    switchDialog (id) {
      this.$refs.templetAby.initComponent(id)
    },

    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.couponReportList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'metCouponTemplet/exportMetCouponTempletDataAnalysis',
        name: getRouteName('/couponReport'),
        type: 'xls'
      }
      excelList(params, this)
    }
  }
}
</script>

<style scoped>

</style>
