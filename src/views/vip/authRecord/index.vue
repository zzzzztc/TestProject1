<template>
  <div id="AuthRecord" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="searchForm.idCard" placeholder="身份证号" title="身份证号"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="searchForm.mobile" placeholder="手机号" title="手机号"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="实名认证类型" v-model="searchForm.authType">
            <el-option label="运营商认证" value="01"></el-option>
            <el-option label="银联认证" value="02"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="searchForm.authWay" placeholder="实名认证方式" title="实名认证方式"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="实名认证结果" v-model="searchForm.authResult">
            <el-option label="成功" value="success"></el-option>
            <el-option label="失败" value="fail"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="接口调用结果" v-model="searchForm.callResult">
            <el-option label="成功" value="success"></el-option>
            <el-option label="失败" value="fail"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.createTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="起始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.createTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="截止日期">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="resetQuery">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" @click="handleExport" :disabled="!dataList.total || dataList.total == '0'">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          :data="dataList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          v-loading="loading"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <!--<el-table-column type="selection" width="50" fixed="left"></el-table-column>-->
          <el-table-column label="姓名" prop="realName" min-width="60"></el-table-column>
          <el-table-column label="身份证号" prop="idCard" min-width="120"></el-table-column>
          <el-table-column label="手机号" prop="mobile" min-width="90"></el-table-column>
          <el-table-column label="银行卡号" prop="bankCardNo" min-width="140"></el-table-column>
          <el-table-column label="实名认证类型" prop="authType" min-width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.authType === '02'">银联认证</span>
              <span v-if="scope.row.authType === '01'">运营商认证</span>
            </template>
          </el-table-column>
          <el-table-column label="实名认证方式" prop="authWay" min-width="90"></el-table-column>
          <el-table-column label="实名认证结果" prop="authResult" min-width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.authResult === 'success'">成功</span>
              <span v-if="scope.row.authResult === 'fail'">失败</span>
            </template>
          </el-table-column>
          <el-table-column label="接口调用结果" prop="callResult" min-width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.callResult === 'success'">成功</span>
              <span v-if="scope.row.callResult === 'fail'">失败</span>
            </template>
          </el-table-column>
          <el-table-column label="调用时间" prop="createTime" min-width="120"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataList.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as types from './api'
import { excelList, getRouteName } from '../../../utils/index'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'AuthRecord',
  data () {
    return {
      searchForm: {}, // 查询条件 -- 数据
      dataViewHeight: null, // 表格 -- 高度
      loading: false, // 加载状态
      dataList: {}
    }
  },
  created () {},
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes, // 表格
      pagination: state => state.app.pagination // 分页
    })
  },
  methods: {
    initData (page, pageSize) {
      // 查询时间最长支持92天
      const startDate = new Date(this.searchForm.createTimeStart).getTime()
      const endDate = new Date(this.searchForm.createTimeEnd).getTime()
      const day = (endDate - startDate) / (1000 * 60 * 60 * 24)
      if (day > 92) {
        this.$message.error({ message: '查询时间最长支持92天, 请重新选择' })
        return false
      }
      this.loading = true
      if (page) this.searchForm.page = page
      if (pageSize) this.searchForm.rows = pageSize
      types.getMetChinaareaList(this.searchForm).then(res => {
        this.loading = false
        this.dataList = res
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 表格 -- 分页
    handleSizeChange (pages) {
      this.initData(null, pages)
    },
    handleCurrentChange (page) {
      this.initData(page, null)
    },
    // 查询条件 -- 重置
    resetQuery () {
      this.searchForm = {}
      this.initData(1, this.pagination.pageSize)
    },
    search () {
      this.initData(1, this.pagination.pageSize)
    },
    // 表格 -- 选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 表格 -- 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.searchForm))
      let url = 'memberAuthRecord/exportMemberAuthRecord'
      let name = getRouteName('/authRecord')
      let type = 'xls'
      data.start = 1
      data.end = this.dataList.total
      delete data.page
      delete data.rows
      let temp = null
      let obj = {
        data,
        url,
        name,
        type,
        temp
      }
      excelList(obj)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
