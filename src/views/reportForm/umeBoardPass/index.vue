<template>
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item">
          <el-date-picker
            class="date-picker-380"
            size="medium"
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="起始日期"
            end-placeholder="截止日期"
            align="right">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-date-picker
            v-model="filter.flightDate"
            value-format="yyyy-MM-dd"
            size="medium"
            style="width: 180px"
            type="date"
            placeholder="航班日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="航班号" v-model="filter.flightNo" clearable @keydown.enter.native="getData()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="出发城市" v-model="filter.deptAirport" clearable>
            <el-option v-for="item in cityTree" :label="item.text" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="出发城市" v-model="filter.arriAirport" clearable>
            <el-option v-for="item in cityTree" :label="item.text" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="姓名" v-model="filter.cnName" clearable @keydown.enter.native="getData()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="手机号" v-model="filter.mobile" clearable @keydown.enter.native="getData()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="证件号" v-model="filter.idCard" clearable @keydown.enter.native="getData()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="票号" v-model="filter.eticketNo" clearable @keydown.enter.native="getData()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道类型" clearable v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getData()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="!umeBoardPass.total" @click="handleExport">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="umeBoardPass.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column label="渠道" min-width="120">
              <template slot-scope="scope">
                {{scope.row.channel | channelMap}}
              </template>
            </el-table-column>
            <el-table-column label="航班日期" prop="flightDate" min-width="120"></el-table-column>
            <el-table-column label="航班号" prop="flightNo" min-width="120"></el-table-column>
            <el-table-column label="起飞时间" prop="flightTime" min-width="120"></el-table-column>
            <el-table-column label="出发地" prop="deptAirportName" min-width="120"></el-table-column>
            <el-table-column label="到达地" prop="arriAirportName" min-width="120"></el-table-column>
            <el-table-column label="姓名" prop="cnName" min-width="120"></el-table-column>
            <el-table-column label="手机号" prop="mobile" min-width="120"></el-table-column>
            <el-table-column label="证件号" prop="idCard" min-width="140"></el-table-column>
            <el-table-column label="票号" prop="eticketNo" min-width="120"></el-table-column>
            <el-table-column label="验讫章" min-width="100">
              <template slot-scope="scope">
                <span class="inl-block active-text" @click="handleSee(scope.row.chapterUrl)">查看</span>
              </template>
            </el-table-column>
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
        :total="umeBoardPass.total">
       </el-pagination>
    </div>
    <el-dialog title="验讫章" :visible.sync="editVisible" width="350px">
      <div class="dialog-container">
        <div class="dialog-main">
          <img :src="chapterUrl" alt="验讫章" style="width: 100%; padding-bottom: 20px;">
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { computeTableHeight, getChannelList, getCurrentDate, excelList } from '../../../utils/index'
import { fetchList, fetchCities } from './api.js'

export default {
  name: 'UmeBoardingReport',
  data () {
    return {
      filter: {
        eticketNo: ''
      },
      loading: false,
      date: [],
      cityTree: [],
      dataViewHeight: null,
      umeBoardPass: {},
      editVisible: false,
      chapterUrl: ''
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getCityTree()
    this.getData(1, this.pagination.pageSize)
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
    },
    // 获取城市列表
    getCityTree () {
      fetchCities().then(res => {
        this.cityTree = res.treeList
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取列表数据
    getData (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.judgeFilterDate()
      fetchList(this.filter).then(res => {
        this.umeBoardPass = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    judgeFilterDate () {
      if (this.date.length) {
        this.filter.startDate = this.date[0]
        this.filter.endDate = this.date[1]
      } else {
        delete this.filter.startDate
        delete this.filter.endDate
      }
    },
    // 重置
    resetFilter () {
      this.filter = {
        eticketNo: ''
      }
      this.date = []
      this.initDate()
      this.judgeChannelList()
      this.getCityTree()
      this.getData(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getData(null, pages)
    },
    handleCurrentChange (page) {
      this.getData(page, null)
    },
    handleSee (url) {
      this.editVisible = true
      this.chapterUrl = url
    },
    // 表格 -- 导出
    handleExport () {
      let params = {
        data: JSON.parse(JSON.stringify(this.filter)),
        url: 'report/exportUmeBoardPassList',
        name: '二维码通关',
        type: 'csv',
        total: this.umeBoardPass.total
      }
      excelList(params)
    }
  }
}
</script>

<style scoped>
</style>
