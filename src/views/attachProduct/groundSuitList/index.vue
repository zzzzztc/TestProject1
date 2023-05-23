<template>
  <div class="" id="GroundSuitList">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.flightDate"
            class="w-180"
            size="medium"
            value-format="yyyyMMdd"
            type="date"
            placeholder="航班日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="filter.flightNo" placeholder="航班号"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="list.total === 0" @click="exportList">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="list.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="商品名称" prop="productName"></el-table-column>
          <el-table-column label="商品编号" prop="productCode"></el-table-column>
          <el-table-column label="数量" prop="saleNum"></el-table-column>
          <el-table-column label="航班号" prop="flightNo"></el-table-column>
          <el-table-column label="航班日期">
            <template slot-scope="scope">
              <div>{{ scope.row.flightDate | dateFormater }}</div>
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
        :total="list.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { computWidth } from '../../../mixins/computWidt'
import { mapState } from 'vuex'
import { fetchList } from './api'
import { excelList, getRouteName } from '../../../utils'
export default {
  name: 'GroundSuitList',
  data () {
    return {
      dataViewHeight: null,
      loading: false,
      filter: {},
      list: {}
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  mixins: [ computWidth ],
  created () {
    this.getList(1, this.pagination.pageSize)
  },
  methods: {
    // 查询
    getList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.loading = true
      fetchList(this.filter)
        .then(res => {
          this.loading = false
          this.list = res
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 重置
    resetFilter () {
      this.filter = {}
      this.getList(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getList(null, pages)
    },
    handleCurrentChange (page) {
      this.getList(page, null)
    },
    exportList () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.list.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'order/exportProductOrderDetailGroupInfo',
        name: getRouteName('/groundSuitList'),
        type: 'xls',
        total: this.list.total
      }
      excelList(params, this)
    }
  }
}
</script>

<style scoped>

</style>
