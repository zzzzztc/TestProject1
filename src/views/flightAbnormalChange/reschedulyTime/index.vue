<template>
  <div id="ReschedulyTime" class="container">
    <!--<h1>改期时间管理</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.channel' clearable placeholder="请选择渠道" size="medium">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.timeType' clearable placeholder='延误时间类型' size='medium'>
            <el-option label="出港延误时间" value="1"></el-option>
            <el-option label="到港延误时间" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input v-model="searchForm.delayTime" clearable placeholder="延误时间" size="medium" @keydown.enter.native="getQueryAbnormalTime()"></el-input>
        </div>
        <div class="search-item search-ipt">
        <el-select v-model='searchForm.status' clearable placeholder='启用/禁用状态' size='medium'>
          <el-option label="禁用" value="0"></el-option>
          <el-option label="启用" value="1"></el-option>
        </el-select>
      </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="getQueryAbnormalTime(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset('query')">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(null)">添加</el-button>
        <el-button size="medium" type="danger" :disabled="!multipleSelection.length" @click="handleDelete(null)">批量删除</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column label="渠道" prop="channel" min-width="160">
            <template slot-scope="scope">
              {{scope.row.channel | channelMap}}
            </template>
          </el-table-column>
          <el-table-column label="延误时间类型" prop="timeType" align="center" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.timeType === '1'">出港延误时间</span>
              <span v-if="scope.row.timeType === '2'">到港延误时间</span>
            </template>
          </el-table-column>
          <el-table-column label="延误时间(分钟)" prop="delayTime" min-width="120"></el-table-column>
          <el-table-column label="创建人" prop="createOpid" min-width="140"></el-table-column>
          <el-table-column label="创建时间" prop="createDate" min-width="160"></el-table-column>
          <el-table-column label="修改人" prop="modifyOpid" min-width="140"></el-table-column>
          <el-table-column label="修改时间" prop="modiftDate" min-width="160"></el-table-column>
          <el-table-column label="状态" prop="discountStatus" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.timeStatus === '0'">禁用</span>
              <span v-if="scope.row.timeStatus === '1'">启用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="140">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="禁用" @click="handleState(scope.row.timeStatus, scope.row.timeId)" v-if="scope.row.timeStatus === '0'">启用</span>
              <span class="active-text mr-5" title="启用" @click="handleState(scope.row.timeStatus, scope.row.timeId)" v-if="scope.row.timeStatus === '1'">禁用</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.timeId)">删除</span>
            </template>
          </el-table-column>
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
    <!--编辑弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="560px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">延误时间类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.timeType" placeholder="请选择时间类型" size="medium">
                  <el-option key="0" label="出港延误时间" value="1"></el-option>
                  <el-option key="1" label="到港延误时间" value="2"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.timeType">时间类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">延误时间(分钟)</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="延误时间" v-model="editForm.delayTime" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.delayTime">延误时间不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">渠道类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.channel" placeholder="请选择渠道类型" multiple collapse-tags size="medium">
                  <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.channel.length">渠道类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">启用/禁用</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.timeStatus" placeholder="请选择启用/禁用" size="medium">
                  <el-option key="0" label="禁用" value="0"></el-option>
                  <el-option key="1" label="启用" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.timeStatus">启用/禁用不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="handleSubmit">提交</el-button>
          <el-button size="medium" v-if="isReset" @click="handleReset('popup')">重置</el-button>
          <el-button size="medium" @click="editVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { queryAbnormalTimeList, queryUpdateStatus, queryAddAbnormalTimeList, queryUpdateAbnormalTimeList, queryDeleteAbnormalTimeList } from './api'
import { getChannelList } from '../../../utils/index'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'ReschedulyTime',
  data () {
    return {
      searchForm: {
        channel: '', // 渠道
        timeType: '', // 延误时间类型
        delayTime: '', // 延误时间
        status: '' // 启用/禁用状态
      }, // 查询 -- 条件数据
      tableList: {}, // 表格 -- 数据展示
      multipleSelection: [], // 表格 -- 选择项
      dataViewHeight: null, // 表格 -- 高度
      editForm: {
        channel: [], // 渠道类型
        timeType: '', // 延误时间类型
        delayTime: '', // 延误时间
        timeStatus: '1' // 启用/禁用状态
      }, // 添加/修改弹出框 -- 数据
      popupTitle: '', // 添加/修改弹出框 -- 标题
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: false, // 添加/修改弹出框 -- 切换添加/修改
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      loading: false // 加载状态
    }
  },
  mixins: [computWidth],
  created () {
    this.getChannelList()
    this.getQueryAbnormalTime(1, this.pagination.pageSize)
  },
  computed: {
    ...mapState({
      channelList: state => state.app.channelList, // 渠道
      tableAttributes: state => state.app.tableAttributes, // 表格
      pagination: state => state.app.pagination // 分页
    })
  },
  methods: {
    // channel没有则请求服务器
    getChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 表格 -- 分页导航
    handleSizeChange (pages) {
      this.getQueryAbnormalTime(null, pages)
    },
    handleCurrentChange (page) {
      this.getQueryAbnormalTime(page, null)
    },
    // 表格 -- 选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 表格 -- 展示数据
    getQueryAbnormalTime (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      queryAbnormalTimeList(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 表格 -- 启用/禁用状态更改
    handleState (status, id) {
      let title = ''
      if (status === '0') {
        title = '是否确认启用?'
      } else {
        title = '是否确认禁用?'
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        queryUpdateStatus({
          id: id,
          status: status === '0' ? '1' : '0'
        }).then(res => {
          this.$message.success(res.message)
          this.getQueryAbnormalTime(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },
    // 表格 -- 删除
    handleDelete (id) {
      let timeId = ''
      if (id) {
        timeId = id
      } else {
        for (let item of this.multipleSelection) {
          timeId += item.timeId + ','
        }
        timeId = timeId.substring(0, timeId.length - 1)
      }
      this.$confirm('是否确认删除 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        queryDeleteAbnormalTimeList({ ids: timeId }).then(res => {
          this.$message.success(res.message)
          this.getQueryAbnormalTime(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 添加/修改弹出框 -- 显示隐藏
    handleEdit (params) {
      this.editVisible = true
      if (params) {
        this.isReset = false
        this.popupTitle = '修改'
        this.handleParams(params)
      } else {
        this.isReset = true
        this.popupTitle = '添加'
        this.handleReset('popup')
      }
    },
    // 修改弹出框 -- 数据处理
    handleParams (params) {
      this.editForm.timeId = params.timeId
      this.editForm.channel = params.channel.split(',')
      this.editForm.timeType = params.timeType
      this.editForm.delayTime = params.delayTime
      this.editForm.timeStatus = params.timeStatus
    },
    // 添加/修改弹出框 -- 提交
    handleSubmit () {
      if (this.editForm.channel.length && this.editForm.timeType && this.editForm.delayTime && this.editForm.timeStatus) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        if (data.channel.length) {
          data.channel = data.channel.join(',')
        }
        if (this.isReset === false) {
          this.updateData(data)
        } else {
          this.addData(data)
        }
      } else {
        this.isEmpty = true
      }
    },
    // 修改弹出框 -- 提交接口
    updateData (data) {
      queryUpdateAbnormalTimeList(data).then(res => {
        this.editVisible = false
        this.$message.success(res.message)
        this.getQueryAbnormalTime(1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 添加弹出框 -- 提交接口
    addData (data) {
      queryAddAbnormalTimeList(data).then(res => {
        this.editVisible = false
        this.$message.success(res.message)
        this.getQueryAbnormalTime(1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 查询/添加弹出框 -- 重置
    handleReset (type) {
      if (type === 'query') {
        this.searchForm = {}
        this.getQueryAbnormalTime(1, this.pagination.pageSize)
      } else if (type === 'popup') {
        this.editForm = {
          channel: [],
          timeStatus: '1'
        }
        this.isEmpty = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
