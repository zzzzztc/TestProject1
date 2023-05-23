<template>
  <!--<div>积分兑换记录</div>-->
  <div id="PointExchangeRecord" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="常旅客号" v-model="filter.userId" @keydown.enter.native="getUserpointList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="用户名字" v-model="filter.username" @keydown.enter.native="getUserpointList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="filter.pointId" placeholder="可兑换积分名称" size="medium" clearable @keydown.enter.native="getUserpointList()">
            <el-option v-for="item in changeTypeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getUserpointList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="!userPointList.totalRows" @click="handleExport">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="userPointList.contents"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column label="常旅客号" v-if="tableList.userId" prop="userId" min-width="100"></el-table-column>
          <el-table-column label="常旅客名称" v-if="tableList.username" prop="username" min-width="100"></el-table-column>
          <el-table-column label="渠道编号" v-if="tableList.channel" min-width="140">
            <template slot-scope="scope">
              <div>{{scope.row.channel | channelMap}}</div>
            </template>
          </el-table-column>
          <el-table-column label="活动名称" v-if="tableList.activityName" prop="activityName" min-width="120"></el-table-column>
          <el-table-column label="可兑换积分名称" v-if="tableList.pointName" prop="pointName" min-width="140"></el-table-column>
          <el-table-column label="兑换积分" v-if="tableList.point" prop="point" min-width="100"></el-table-column>
          <el-table-column label="兑换次数" v-if="tableList.num" prop="num" min-width="100"></el-table-column>
          <el-table-column label="类型" v-if="tableList.timeTypeName" prop="timeTypeName" min-width="100"></el-table-column>
          <el-table-column label="已使用次数" v-if="tableList.timeLeft" prop="timeLeft" min-width="100"></el-table-column>
          <el-table-column label="状态名称" v-if="tableList.statusName" prop="statusName" min-width="100"></el-table-column>
          <el-table-column label="创建时间" v-if="tableList.createTime" prop="createTime" min-width="160"></el-table-column>
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
            :total="userPointList.totalRows">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { excelList, getRouteName, getExchangeList } from '../../../utils/index'
import { queryUserpointList } from './api'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'PointExchangeRecord',
  data () {
    return {
      loading: false, // 加载
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      filter: {
        userId: '',
        username: '',
        pointId: '',
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件列表
      tableList: {
        userId: true,
        username: true,
        channel: true,
        activityName: true,
        pointName: true,
        point: true,
        num: true,
        timeTypeName: true,
        timeLeft: true,
        statusName: true,
        createTime: true
      }, // 表格数据
      userPointList: {} // 表格展示数据
    }
  },
  created () {
    this.judgeChannelList()
    this.getUserpointList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      changeTypeList: state => state.app.changeTypeList
    })
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.changeTypeList.length) {
        getExchangeList()
      }
    },

    // 分页导航
    handleSizeChange (pages) {
      this.getUserpointList(null, pages)
    },
    handleCurrentChange (page) {
      this.getUserpointList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getUserpointList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.filter.isJson = true
      queryUserpointList(this.filter).then(res => {
        this.userPointList = res.data
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.data || err.message)
      })
    },

    // 查询条件重置
    resetFilter () {
      this.filter.userId = ''
      this.filter.username = ''
      this.filter.pointId = ''
      this.filter.isJson = true
      this.getUserpointList()
    },
    // 表格 -- 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.tableList.totalRows
      data.isJson = true
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: '/luckdraw/v1/userpoint/export',
        name: getRouteName('/pointExchangeRecord'),
        type: 'xls'
      }
      excelList(params, this)
    }
  }
}
</script>

<style scoped>

</style>
