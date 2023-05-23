<template>
  <div id="LoginRecord" class="container">
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
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="操作类型" clearable v-model="params.operateType">
            <el-option v-for="item in typsList" :key="item.id" :label="item.dincName" :value="item.dincCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="params.operateTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="params.operateTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item">-->
<!--          <el-date-picker-->
<!--            v-model="dates"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            start-placeholder="开始日期"-->
<!--            class="date-picker-380"-->
<!--            @change="getTime"-->
<!--            aligin="right"-->
<!--            style="height: 36px"-->
<!--            clearable-->
<!--            format="yyyy-MM-dd"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            end-placeholder="结束日期">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select v-model='params.channel' clearable placeholder='渠道类型' size='medium' title="渠道类型">
            <el-option
              v-for='item in channelList'
              :key='item.chalId'
              :label='item.chalName'
              :value='item.chalCode'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="params.terminalType" placeholder="终端类型" title="终端类型"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="params.terminalCode" placeholder="设备编号" title="设备编号"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="登录方式" v-model="params.loginType">
            <el-option label="微信授权手机号登陆" value="微信授权手机号登录"></el-option>
            <el-option label="本机号码一键登录" value="本机号码一键登录"></el-option>
            <el-option label="微信登录" value="微信登录"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="实名认证" v-model="params.memberStatus">
            <el-option label="未认证" value="0"></el-option>
            <el-option label="已认证" value="1"></el-option>
          </el-select>
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
          <el-table-column label="操作类型" prop="operateType" :formatter="initType" min-width="160"></el-table-column>
          <el-table-column label="登录名" prop="username" min-width="180"></el-table-column>
          <el-table-column label="操作时间" prop="operateTime" min-width="160"></el-table-column>
          <el-table-column label="IP地址" min-width="160">
            <template slot-scope='scope'>
                <!--<el-button type="text" @click="open(scope.row)">{{scope.row.ipAddress}}</el-button>-->
                <span>{{scope.row.ipAddress}}</span>
            </template>
          </el-table-column>
          <el-table-column label="渠道" prop="channel" min-width="160">
            <template slot-scope='scope'>
              <span>{{scope.row.channel | channelMap}}</span>
            </template>
          </el-table-column>
          <el-table-column label="终端类型" prop="terminalType" min-width="160"></el-table-column>
          <el-table-column label="终端型号" prop="terminalModel" min-width="160"></el-table-column>
          <el-table-column label="设备编号" prop="terminalCode" min-width="160"></el-table-column>
          <el-table-column label="会员手机号" prop="memberMobile" min-width="160"></el-table-column>
          <el-table-column label="常客卡号" prop="memberFfpCardNo" min-width="160"></el-table-column>
          <el-table-column label="邮箱" prop="memberEmail" min-width="160"></el-table-column>
          <el-table-column label="微信昵称" prop="nickName" min-width="160"></el-table-column>
          <el-table-column label="登录方式" prop="loginType" min-width="160"></el-table-column>
          <!--<el-table-column label='操作'  align='left' width="140" fixed="right">-->
            <!--<template slot-scope='scope'>-->
              <!--<span class="active-text mr-5" @click='handledit({ ids: scope.row.recordId, validity: scope.row.memberMobile })' title="号码归属地查询">号码归属地查询</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
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
import { getChannelList, excelList, getRouteName } from '../../../utils/index'
import * as types from './api'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'LoginRecord',
  data () {
    return {
      dataViewHeight: null,
      params: {
        userType: '1', //  用户类型
        userNo: '', //  用户编号
        operateType: '', //  操作类型
        operateTimeStart: '', //  开始结束时间
        operateTimeEnd: '',
        channel: '', //  渠道
        terminalType: '', //  终端类型
        terminalCode: '' //  设备号码
      },
      dates: [],
      total: 0,
      list: {},
      dataArr: [],
      loading: false,
      typsList: [],
      text: ''
    }
  },
  created () {
    this.getType()
    this.judgeChannelList()
    this.initData(1, this.pagination.pageSize)
  },
  methods: {
    initType (row, value, cellvalue) {
      return this.initUser(row.operateType)
    },
    initUser (id) {
      for (let i = 0; i < this.typsList.length; i++) {
        if (id === this.typsList[i].dincCode) {
          return this.typsList[i].dincName
        }
      }
    },
    //  获取渠道
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    //  获取用户类型
    getType () {
      types.querydictsByType({ type: 'MEMBER_OPERATE_TYPE' }).then(res => {
        this.typsList = res.rows
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getTime () {},
    search () {
      this.initData(1, this.pagination.pageSize)
    },
    initrefer () {
      this.params = {}
      this.params.userType = '1'
      this.initData(1, this.pagination.pageSize)
    },
    excel () {
      let data = JSON.parse(JSON.stringify(this.params))
      let url = 'member/exportMemberOperateRecord'
      let name = getRouteName('/loginRecord')
      let type = 'xls'
      // let total = this.list.total
      data.start = 1
      data.end = this.list.total
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
      types.getMemberOperateRecordList(this.params).then(res => {
        this.loading = false
        this.list = res
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    handleSelectionChange (row) {
      this.dataArr = row
    },
    handleSizeChange (pages) {
      this.initData(null, pages)
    },
    handleCurrentChange (page) {
      this.initData(page, null)
    },
    handledit (data) {}
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList, //  渠道
      treeList: state => state.app.city //  城市对
    })
  }
}
</script>
<style scoped lang="scss">
</style>
