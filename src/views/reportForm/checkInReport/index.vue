<template>
  <div id="CheckInReport" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startDate"
            :clearable="false"
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
            :clearable="false"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道编号" clearable v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="是否无纸化通关" clearable v-model="filter.isUmeBoarding">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="值机状态" clearable v-model="filter.checkInStatus">
            <el-option label="已值机" value="1"></el-option>
            <el-option label="已取消值机" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="filter.mobile" @keydown.enter.native="getCheckInReport()" placeholder="手机号"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getCheckInReport()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" type="success" :disabled="!checkInReport.total" @click="exportExcel">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="checkInReport.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
            <el-table-column key="1" label="票号" prop="eticket_no" min-width="120"></el-table-column>
            <el-table-column key="2" label="渠道编号">
              <template slot-scope="scope">
                <div>{{scope.row.channel | channelMap}}</div>
              </template>
            </el-table-column>
            <el-table-column key="3" label="航班号" prop="flight_no"></el-table-column>
            <el-table-column key="4" label="出发地" prop="dept_airport_name"></el-table-column>
            <el-table-column key="5" label="到达地" prop="arri_airport_name"></el-table-column>
            <el-table-column key="6" label="值机人" prop="cn_name"></el-table-column>
            <el-table-column key="7" label="座位号" prop="seat_no"></el-table-column>
            <el-table-column key="8" label="证件号" prop="id_card" min-width="140"></el-table-column>
            <el-table-column key="9" label="手机号" prop="mobile" min-width="140"></el-table-column>
            <el-table-column key="10" label="是否无纸化通关" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.ume_board_id === 0">否</span>
                <span v-else>是</span>
              </template>
            </el-table-column>
            <el-table-column key="11" label="值机状态">
              <template slot-scope="scope">
                <span v-show="scope.row.check_in_status === '1'">已值机</span>
                <span v-show="scope.row.check_in_status === '2'">取消值机</span>
              </template>
            </el-table-column>
            <el-table-column key="12" label="值机时间" prop="create_date" min-width="140"></el-table-column>
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
        :total="checkInReport.total">
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
  name: 'CheckInReport',
  data () {
    return {
      loading: false,
      filter: {
        startDate: '',
        endDate: '',
        channel: '',
        isUmeBoarding: '',
        checkInStatus: '',
        mobile: ''
      },
      dataViewHeight: null,
      date: [],
      checkInReport: {}
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  mixins: [computWidth],
  created () {
    this.initDate()
    this.judgeChannelList()
    // this.getCheckInReport(1, this.pagination.pageSize)
  },
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
    getCheckInReport (page, pageSize) {
      // 查询时间最长支持92天
      const startDate = new Date(this.filter.startDate).getTime()
      const endDate = new Date(this.filter.endDate).getTime()
      const day = (endDate - startDate) / (1000 * 60 * 60 * 24)
      if (day > 92) {
        this.$message.error({ message: '查询时间最长支持92天, 请重新选择' })
        return false
      }
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      // if (this.date.length) {
      //   this.filter.startDate = this.date[0]
      //   this.filter.endDate = this.date[1]
      // } else {
      //   delete this.filter.startDate
      //   delete this.filter.endDate
      // }
      fetchList(this.filter).then(res => {
        this.checkInReport = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        endDate: '',
        startDate: ''
      }
      this.initDate()
      this.getCheckInReport(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getCheckInReport(null, pages)
    },
    handleCurrentChange (page) {
      this.getCheckInReport(page, null)
    },
    // 表格 -- 导出
    exportExcel () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.checkInReport.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'report/exportCheckInReport',
        name: getRouteName('/checkInReport'),
        type: 'xls',
        total: this.checkInReport.total
      }
      excelList(params, this)
    }
  }
}
</script>

<style scoped>

</style>
