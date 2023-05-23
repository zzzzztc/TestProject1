<template>
<!--  <div>优惠券短信</div>-->
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="短信模板" v-model="filter.templetCode" @keydown.enter.native="getMetCouponSmsList()">
            <el-option v-for="item in smsDictsbyTypeList" :key="item.dincCode" :label="item.dincName" :value="item.dincCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="手机号" v-model="filter.mobile" @keydown.enter.native="getMetCouponSmsList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="发送状态" v-model="filter.smsStatus"  @keydown.enter.native="getMetCouponSmsList()">
            <el-option label="未发送" value="0"></el-option>
            <el-option label="已发送" value="1"></el-option>
            <el-option label="发送失败" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="操作人" v-model="filter.userCode" @keydown.enter.native="getMetCouponSmsList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.sendTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="发送时间开始">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.sendTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="发送时间结束">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getMetCouponSmsList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleResend()" :disabled="!multipleSelection.length">短信重发</el-button>
        <el-button type="success" size="medium" :disabled="couponSmsList.total === 0" @click="handleExport()">导出</el-button>
      </div>
    </div>
    <div class="main">
      <el-table
        key="Math.random()"
        :cell-style= "tableAttributes.cellStyle"
        :stripe="tableAttributes.stripe"
        :border="tableAttributes.border"
        :data="couponSmsList.rows"
        v-loading="loading"
        :height="dataViewHeight"
        @selection-change="handleSelectionChange">
<!--        <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="手机号" v-if="tableList.mobile" prop="mobile" min-width="120"></el-table-column>
        <el-table-column label="信息内容" v-if="tableList.msg" prop="msg" min-width="160"></el-table-column>
        <el-table-column label="创建时间" v-if="tableList.createTime" prop="createTime" min-width="160"></el-table-column>
        <el-table-column label="模板名称" v-if="tableList.templetName" prop="templetName" min-width="120"></el-table-column>
        <el-table-column label="发送状态" v-if="tableList.smsStatus" prop="smsStatus" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.smsStatus | smsStatusMap}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" v-if="tableList.userCode" prop="userCode" min-width="120"></el-table-column>
        <el-table-column label="发送时间" v-if="tableList.sendTime" prop="sendTime" min-width="160"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100">
          <template slot-scope="scope">
            <span class="active-text mr-5" title="短信重发" @click="handleResend(scope.row.smsId)">短信重发</span>
          </template>
        </el-table-column>
      </el-table>
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
            :total="couponSmsList.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { computeTableHeight, getCurrentDate, getChannelList, getSmsDictsByType, excelList, getRouteName, filterIds } from '../../../../utils'
import { queryMidSmsListByTempletCode, queryAgainSend } from './api'
export default {
  name: 'CouponMessage',
  data () {
    return {
      loading: false,
      dataViewHeight: null,
      filter: {
        templetCode: '300101', // 短信模板
        mobile: '', // 手机号
        smsStatus: '', // 发送状态 0未发送，1已发送，2发送失败
        userCode: '', // 操作人
        sendTimeStart: '', // 发送时间开始
        sendTimeEnd: '', // 发送时间结束
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询数据表单
      couponSmsList: {}, // 表格数据表单
      tableList: {
        msg: true, // 信息内容
        mobile: true, // 手机号
        createTime: true, // 创建时间
        templetName: true, // 模板名称
        smsStatus: true, // 发送状态
        userCode: true, // 操作人
        sendTime: true // 发送时间
      }, // 表格展示数据表单
      multipleSelection: [] // 表格选择数据表单
    }
  },

  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      smsDictsbyTypeList: state => state.app.smsDictsbyTypeList
    })
  },

  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },

  created () {
    this.initDate()
    this.judgeTypeList()
    this.getMetCouponSmsList(1, this.pagination.pageSize)
  },

  methods: {
    // state没有则请求服务器
    judgeTypeList () {
      if (!this.channelList.length) {
        getChannelList()
      }
      if (!this.smsDictsbyTypeList.length) {
        getSmsDictsByType()
      }
    },

    // 默认日期处理
    initDate () {
      this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.filter.sendTimeStart = this.date[0]
      this.filter.sendTimeEnd = this.date[1]
    },

    // 分页导航
    handleSizeChange (pages) {
      this.getMetCouponSmsList(null, pages)
    },
    handleCurrentChange (page) {
      this.getMetCouponSmsList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getMetCouponSmsList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      queryMidSmsListByTempletCode(this.filter).then(res => {
        this.couponSmsList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },

    // 查询条件重置
    resetFilter () {
      this.filter = {
        templetCode: '300101',
        mobil: '',
        smsStatus: '',
        userCode: '',
        sendTimeStart: '',
        sendTimeEnd: ''
      }
      this.initDate()
      this.getMetCouponSmsList(1, this.pagination.pageSize)
    },

    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.couponSmsList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'midSms/exportByTempletCode',
        name: getRouteName('/couponMessage'),
        type: 'xls'
      }
      excelList(params, this)
    },

    // 短信重发
    handleResend (id) {
      let ids = ''
      let list = []
      if (id) {
        ids = id
      } else {
        ids = id || filterIds(this.multipleSelection, 'smsId').join(',')
        list = ids.split(',')
      }
      this.$confirm('是否重发短信?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        if (list.length < 10) {
          this.resendData(ids)
        } else {
          this.$message.error('选择数量不得超过10条')
        }
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },

    resendData (id) {
      queryAgainSend({ ids: id }).then(res => {
        this.$message.success(res.message)
        this.getMetCouponSmsList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
