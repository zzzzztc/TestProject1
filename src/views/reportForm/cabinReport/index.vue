<template>
  <div id="ShippingReport" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
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
            placeholder="开始日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="date"-->
<!--            type="daterange"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            range-separator="至"-->
<!--            start-placeholder="起始日期"-->
<!--            end-placeholder="截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道" clearable v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="舱位" v-model="filter.cabin" clearable @keydown.enter.native="getCabin()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="查询时间" v-model="filter.dateType">
            <el-option label="销售时间" value="1"></el-option>
            <el-option label="起飞时间" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getCabin()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="!cabin.total" @click="exportExcel">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="cabin.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
            <el-table-column label="舱位" prop="seat"></el-table-column>
            <el-table-column label="渠道编号">
              <template slot-scope="scope">
                <span v-if="scope.row.channel && scope.row.channel !== 'null'">
                  {{scope.row.channel | channelMap}}
                </span>
                <span v-else>全渠道</span>
              </template>
            </el-table-column>
            <el-table-column label="销售量" prop="num"></el-table-column>
            <el-table-column label="票面价" prop="price">
              <template slot-scope="scope">
                {{scope.row.price | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column label="退票量" prop="refundnum"></el-table-column>
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
        :total="cabin.total">
       </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelList, getCurrentDate, excelList, getRouteName } from '../../../utils/index'
import { fetchList } from './api.js'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'ShippingReport',
  data () {
    return {
      loading: false,
      filter: {
        dateType: '1',
        channel: '',
        cabin: '',
        startDate: '',
        endDate: ''
      },
      dataViewHeight: null,
      date: [],
      cabin: {}
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  created () {
    this.judgeChannelList()
    this.initDate()
    this.getCabin(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    initDate () {
      this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.filter.startDate = this.date[0]
      this.filter.endDate = this.date[1]
    },
    // 获取列表数据
    getCabin (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.cabin = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.messages)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        dateType: '1',
        startDate: '',
        endDate: ''
      }
      this.initDate()
      this.getCabin(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getCabin(null, pages)
    },
    handleCurrentChange (page) {
      this.getCabin(page, null)
    },
    exportExcel () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.cabin.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'report/exportCabin',
        name: getRouteName('/shippingReport'),
        type: 'xls'
      }
      excelList(params, this)
    }
  }
}
</script>

<style scoped>

</style>
