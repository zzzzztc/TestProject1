<template>
  <div class="container">
    <!--<h1>缓存管理</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item fl">
          <el-date-picker
            type="date"
            class="date-picker"
            value-format="yyyy-MM-dd"
            placeholder="起始日期"
            v-model="searchForm.flightDate">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt fl">
          <el-input size="medium" clearable placeholder="出发城市" v-model="searchForm.from" @keydown.enter.native="querycacheList()"></el-input>
        </div>
        <div class="search-item search-ipt fl">
          <el-input size="medium" clearable placeholder="到达城市" v-model="searchForm.to" @keydown.enter.native="querycacheList()"></el-input>
        </div>
        <div class="search-item search-ipt fl">
          <el-button size="medium" type="primary" @click="querycacheList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="clearAll">清除全部缓存</el-button>
        <el-button size="medium" :disabled="!multipleSelection.length" @click="clearSelect">清除多个缓存</el-button>
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
          <el-table-column type="selection" width="46"></el-table-column>
          <el-table-column label="出发城市三字码" prop="from"></el-table-column>
          <el-table-column label="到达城市三字码" prop="to"></el-table-column>
          <el-table-column label="航班日期" prop="flightDate"></el-table-column>
        </el-table>
      </div>
    </div>
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
import { queryRedisRoute, flushRedis, clearRoute } from './api'
import { computeTableHeight, getCurrentDate } from '../../../utils/index'

export default {
  name: 'ClearCache',
  data () {
    return {
      searchForm: {
        flightDate: '',
        from: '',
        to: ''
      },
      tableList: [], // 展示表格数据
      multipleSelection: [], // 选中的表单数据
      dataViewHeight: null, // 表格高度
      loading: false // loading加载
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.getDateTerm()
    this.querycacheList(1, this.pagination.pageSize)
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    // 搜索框 -- 获取当前日期
    getDateTerm () {
      this.searchForm.flightDate = getCurrentDate(0)
    },
    // 搜索框 -- 重置
    handleReset () {
      this.searchForm = {}
      this.getDateTerm()
      this.querycacheList(1, this.pagination.pageSize)
    },
    // 表格 -- 分页导航
    handleSizeChange (pages) {
      this.querycacheList(null, pages)
    },
    handleCurrentChange (page) {
      this.querycacheList(page, null)
    },
    // 表格 -- 选择项数据
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 表格 -- 获取数据
    querycacheList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      queryRedisRoute(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
        this.tableParams()
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 表格 -- 数据处理
    tableParams () {
      let formList = this.tableList.rows
      for (let i = 0; i < formList.length; i++) {
        let params = {
          from: formList[i].split('-')[1],
          to: formList[i].split('-')[2],
          flightDate: this.$options.filters.dateFormater(formList[i].split('-')[3]),
          key: formList[i]
        }
        formList[i] = params
      }
    },
    // 表格 -- 清除全部缓存
    clearAll () {
      flushRedis().then(res => {
        // this.tableParams()
        this.querycacheList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 表格 -- 清除多个缓存
    clearSelect () {
      let key = ''
      for (let item of this.multipleSelection) {
        key += item.key + ','
      }
      key = key.substring(0, key.length - 1)
      clearRoute({ key: key }).then(res => {
        // this.tableParams()
        this.querycacheList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
