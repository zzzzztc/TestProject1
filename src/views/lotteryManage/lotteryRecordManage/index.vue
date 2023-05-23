<template>
  <!--<div>抽奖记录</div>-->
  <div id="LotteryRecordManage" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="常旅客号" v-model="filter.userId" @keydown.enter.native="getRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="用户名" v-model="filter.username" @keydown.enter.native="getRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="filter.activityId" placeholder="活动名称" size="medium" clearable @keydown.enter.native="getRecordList()">
            <el-option v-for="item in themeTypeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="奖品类型" v-model="filter.prizeType" clearable>
            <el-option label="谢谢参与" value="0"></el-option>
            <el-option label="积分" value="1"></el-option>
            <el-option label="优惠券" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="开始时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.endDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="结束时间">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getRecordList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="!recordList.totalRows" @click="handleExport">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="recordList.contents"
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
          <el-table-column label="活动名称" v-if="tableList.activityName" prop="activityName" min-width="100"></el-table-column>
          <el-table-column label="奖品名称" v-if="tableList.prizeName" prop="prizeName" min-width="100"></el-table-column>
          <el-table-column label="奖品类型" v-if="tableList.prizeType" prop="prizeType" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.prizeType | prizeTypeMap}}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否绑定" v-if="tableList.exchange" prop="exchange" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.exchange === 0">未绑定</span>
              <span v-if="scope.row.exchange === 1">已绑定</span>
            </template>
          </el-table-column>
          <el-table-column label="是否使用" v-if="tableList.isUse" prop="isUse" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.isUse === 0">未使用</span>
              <span v-if="scope.row.isUse === 1">已使用</span>
            </template>
          </el-table-column>
          <el-table-column label="优惠券" v-if="tableList.couponId" prop="couponId" min-width="100"></el-table-column>
          <el-table-column label="兑换时间" v-if="tableList.createTime" prop="createTime" min-width="160"></el-table-column>
          <el-table-column label="备注" v-if="tableList.remark" prop="remark" min-width="160"></el-table-column>
          <el-table-column label="操作" min-width="120">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click='handleRemark(scope.row)' title="修改备注">修改备注</span>
              <span class="active-text mr-5" @click='handleBind(scope.row.id)' v-if="scope.row.exchange === 0" title="绑定">绑定</span>
            </template>
          </el-table-column>
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
            :total="recordList.totalRows">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--修改备注弹出框-->
    <el-dialog title="修改备注" :visible.sync="editVisible" width="350px" :close-on-click-modal="false">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">备注</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="4" clearable placeholder="备注" v-model="editForm.remark" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.remark">备注不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeList, excelList, getRouteName } from '../../../utils/index'
import { queryRecordList, queryBinding, queryUpdate } from './api'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'LotteryRecordManage',
  data () {
    return {
      loading: false, // 加载
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      filter: {
        userId: '',
        username: '',
        activityId: '',
        prizeType: '',
        prizeId: '',
        startDate: '',
        endDate: '',
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件列表
      tableList: {
        userId: true,
        username: true,
        channel: true,
        activityName: true,
        prizeName: true,
        prizeType: true,
        createTime: true,
        couponId: true,
        exchange: true,
        isUse: true,
        remark: true
      }, // 表格数据
      recordList: {}, // 表格展示数据
      editVisible: false, // 修改备注弹出框 -- 显示隐藏
      isEmpty: false, // 修改备注弹出框 -- 输入框判空
      editForm: {} // 修改备注弹出框 -- 数据表单
    }
  },
  created () {
    this.judgeChannelList()
    this.getRecordList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      themeTypeList: state => state.app.themeTypeList,
      prizeTypeList: state => state.app.prizeTypeList
    })
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      // if (!this.themeTypeList.length) {
      getThemeList()
      // }
      // if (!this.prizeTypeList.length) {
      //   getPrizeList()
      // }
    },
    // 分页导航
    handleSizeChange (pages) {
      this.getRecordList(null, pages)
    },
    handleCurrentChange (page) {
      this.getRecordList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getRecordList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.filter.isJson = true
      queryRecordList(this.filter).then(res => {
        this.recordList = res.data
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
      this.filter.activityId = ''
      this.filter.prizeType = ''
      this.filter.prizeId = ''
      this.filter.startDate = ''
      this.filter.endDate = ''
      this.filter.isJson = true
      this.getRecordList()
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
        url: '/luckdraw/v1/record/export',
        name: getRouteName('/lotteryRecordManage'),
        type: 'xls'
      }
      excelList(params, this)
    },
    // 绑定
    handleBind (id) {
      this.$confirm('是否确认绑定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        queryBinding(id).then(res => {
          this.getRecordList()
          this.$message.success('操作成功')
        }).catch(err => {
          this.$message.error(err.data || err.message)
        })
      })
    },
    // 修改备注弹出框 -- 显示隐藏
    handleRemark (param) {
      this.editForm = { remark: '' }
      this.editVisible = true
      this.editForm.id = param.id
      this.editForm.remark = param.remark
    },
    // 修改备注弹出框 -- 提交
    saveEdit () {
      if (this.editForm.remark) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        data.isJson = true
        queryUpdate(data).then(res => {
          this.editVisible = false
          this.$message.success(res.message)
          this.getRecordList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        this.isEmpty = true
      }
    }
  }
}
</script>

<style scoped>

</style>
