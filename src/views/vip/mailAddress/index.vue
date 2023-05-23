<template>
  <div id="MailAddress" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="params.userType" title='用户类型'  placeholder="用户类型">
            <el-option label="手机" value="1"></el-option>
            <el-option label="邮箱" value="2"></el-option>
            <el-option label="身份证" value="3"></el-option>
            <el-option label="常旅客" value="4"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="params.userNo" placeholder="用户编号" title="用户编号"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="initrefer">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" @click="excel" :disabled='list.total === 0'>导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          :cell-style="tableAttributes.cellStyle"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          row-key="lowestpriceid"
          ref="refTable"
          v-loading="loading"
          @selection-change='handleSelectionChange'
          :height="dataViewHeight"
          :data="list.rows">
<!--          <el-table-column label='序号' width="50" fixed="left" type='index'></el-table-column>-->
          <el-table-column label="会员手机号" prop="memberMobile" min-width="160"></el-table-column>
          <el-table-column label="常客号" prop="memberFfpCardNo" min-width="160"></el-table-column>
          <el-table-column label="邮箱" prop="memberEmail" min-width="160"></el-table-column>
          <el-table-column label="国家" prop="countryName" min-width="160"></el-table-column>
          <el-table-column label="省" prop="provinceName" min-width="160"></el-table-column>
          <el-table-column label="市" prop="cityName" min-width="160"></el-table-column>
          <el-table-column label="区/县" prop="countyName" min-width="160"></el-table-column>
          <el-table-column label="详细地址" prop="address" min-width="160"></el-table-column>
          <el-table-column label="邮编" prop="zipCode" min-width="160"></el-table-column>
          <el-table-column label="收件人姓名" prop="addressee" min-width="160"></el-table-column>
          <el-table-column label='收件人手机号'  prop="mobile" width="140"></el-table-column>
          <el-table-column label='创建时间'  prop='createTime' width="180"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { excelList, getRouteName } from '../../../utils/index'
import * as types from './api'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'MailAddress',
  data () {
    return {
      dataViewHeight: null,
      params: {
        userType: '1', //  用户类型
        userNo: '' //  用户编号
      },
      list: {},
      total: 0,
      dataArr: [],
      loading: false
    }
  },
  created () {
    this.initData(1, this.pagination.pageSize)
  },
  methods: {
    search () {
      this.initData(1, this.pagination.pageSize)
    },
    initrefer () {
      this.params.userType = '1'
      this.params.userNo = ''
      this.initData(1, this.pagination.pageSize)
    },
    excel () {
      let data = JSON.parse(JSON.stringify(this.params))
      let url = 'postAddress/exportPostAddress'
      let name = getRouteName('/mailAddress')
      let type = 'xls'
      data.start = 1
      data.end = this.list.total
      delete data.page
      delete data.rows
      // let total = this.list.total
      let temp = null
      let obj = {
        data,
        url,
        name,
        type,
        temp
      }
      excelList(obj, this)
    },
    initData (page, pageSize) {
      this.loading = true
      if (page) this.params.page = page
      if (pageSize) this.params.rows = pageSize
      types.queryPostAddressInfoList(this.params).then(res => {
        this.loading = false
        this.list = res
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    handleSizeChange (pages) {
      this.initData(null, pages)
    },
    handleCurrentChange (page) {
      this.initData(page, null)
    },
    handleSelectionChange (selected) {
      this.dataArr = selected
    }
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList //  渠道
    })
  }
}
</script>
<style scoped lang="scss">
</style>
