<template>
  <div id="FmaSuperVise" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt w-180">
          <el-input
            size="mini"
            clearable
            placeholder="工号"
            v-model="filter.spvStaffNo"
            @keydown.enter.native="getSuperViseList()">
          </el-input>
        </div>
        <div class="search-item search-ipt w-180">
          <el-input
            size="mini"
            clearable
            placeholder="姓名"
            v-model="filter.bndName"
            @keydown.enter.native="getSuperViseList()">
          </el-input>
        </div>
        <div class="search-item search-ipt w-180">
          <el-input size="mini" clearable placeholder="手机号" v-model="filter.bndMobileNo" @keydown.enter.native="getSuperViseList()"></el-input>
        </div>
        <div class="search-item search-ipt w-180">
          <el-input size="mini" clearable placeholder="部门" v-model="filter.bndStaffDept" @keydown.enter.native="getSuperViseList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-button type="primary" size="mini" @click="getSuperViseList()">查询</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size='mini' :disabled="!list.total" @click="exportList">导出</el-button>
      </div>
    </div>
    <hbh-main @updateList="handleUpdate" :list.sync="list.rows" :loading.sync="loading" :dataViewHeight.sync="dataViewHeight"></hbh-main>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filter.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.total">></el-pagination>
    </div>
  </div>
</template>

<script>
import HbhMain from './components/main.vue'
import { fetchList } from './api.js'
import { computWidth } from '@/mixins/computWidt'
import { mapState } from 'vuex'
import { excelList, getRouteName } from '@/utils'
export default {
  name: 'FmaSuperVise',
  components: {
    HbhMain
  },
  computed: {
    ...mapState({
      pagination: state => state.app.pagination
    })
  },
  data () {
    return {
      loading: false,
      list: {},
      dataViewHeight: null,
      filter: {
        spvStaffNo: '',
        bndName: '',
        bndMobileNo: '',
        bndStaffDept: ''
      }
    }
  },
  mixins: [computWidth],
  created () {
    this.getSuperViseList(1, this.pagination.pageSize)
  },
  methods: {
    handleUpdate () {
      this.getSuperViseList(this.filter.page)
    },
    // 分页
    handleSizeChange (pages) {
      this.getSuperViseList(null, pages)
    },
    handleCurrentChange (page) {
      this.getSuperViseList(page, null)
    },
    // 查询列表数据
    getSuperViseList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
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
    // 导出
    exportList () {
      let data = JSON.parse(JSON.stringify(this.filter))
      delete data.page
      delete data.rows
      data.start = 1
      data.end = this.list.total
      const url = '/fma/exportFmaSupervise'
      const name = getRouteName('/fmaSuperVise')
      let type = 'csv'
      const obj = {
        data,
        url,
        name,
        type
      }
      excelList(obj)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
