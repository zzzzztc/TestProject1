<template>
  <!--<div>用户管理</div>-->
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="用户真实名称" v-model="filter.name" @keydown.enter.native="getUserList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="常旅客号" v-model="filter.id" @keydown.enter.native="getUserList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="filter.activityId" placeholder="活动名称" clearable size="medium" @keydown.enter.native="getUserList()">
            <el-option v-for="item in themeTypeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getUserList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="userList.contents"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column label="常旅客号" v-if="tableList.id" prop="id" min-width="100"></el-table-column>
          <el-table-column label="用户名字" v-if="tableList.name" prop="name" min-width="100"></el-table-column>
          <el-table-column label="抽奖次数" v-if="tableList.times" prop="times" min-width="100"></el-table-column>
          <el-table-column label="免费次数" v-if="tableList.freeTimes" prop="freeTimes" min-width="100"></el-table-column>
          <el-table-column label="活动名称" v-if="tableList.activityName" prop="activityName" min-width="100"></el-table-column>
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
            :total="userList.totalRows">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { computeTableHeight, getThemeList } from '../../../utils/index'
import { queryUserList } from './api'

export default {
  name: 'UserManage',
  data () {
    return {
      loading: false, // 加载
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      filter: {
        name: '',
        id: '',
        activityId: '',
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件列表
      tableList: {
        id: true,
        name: true,
        times: true,
        freeTimes: true,
        activityName: true
      }, // 表格数据
      userList: {} // 表格展示数据
    }
  },
  mounted () {
    this.judgeChannelList()
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.getUserList(1, this.pagination.pageSize)
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      themeTypeList: state => state.app.themeTypeList
    })
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      // if (!this.themeTypeList.length) {
      getThemeList()
      // }
    },

    // 分页导航
    handleSizeChange (pages) {
      this.getUserList(null, pages)
    },
    handleCurrentChange (page) {
      this.getUserList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getUserList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.filter.isJson = true
      queryUserList(this.filter).then(res => {
        this.userList = res.data
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.data || err.message)
      })
    },

    // 查询条件重置
    resetFilter () {
      this.filter.name = ''
      this.filter.id = ''
      this.filter.activityId = ''
      this.filter.isJson = true
      this.getUserList()
    }
  }
}
</script>

<style scoped>

</style>
