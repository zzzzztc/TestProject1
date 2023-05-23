<template>
  <div id="FlightDelayChannel" class="container">
    <!--<h1>航延证明数据配置</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.channel' placeholder="请选择渠道" size="medium" clearable>
            <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalId" :label="item.chalName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
            <el-input size="medium" clearable placeholder="客票有效期内" v-model="searchForm.limitTime" @keydown.enter.native="delayFlightDataList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="searchForm.chnlStatus" placeholder="开具权限" size="medium" clearable>
            <el-option key="0" label="禁用" value="0"></el-option>
            <el-option key="1" label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="delayFlightDataList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit">添加</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container" >
        <el-table
          v-loading="loading"
          :data="tableList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
          <el-table-column label="渠道编号" prop="channel">
            <template slot-scope="scope">
              <span v-if="scope.row.channel === '1'">手机客户端</span>
              <span v-if="scope.row.channel === '2'">小程序</span>
              <span v-if="scope.row.channel === '3'">微信公众号</span>
              <span v-if="scope.row.channel === '4'">官网</span>
            </template>
          </el-table-column>
          <el-table-column label="客票有效期内" prop="limitTime"></el-table-column>
          <el-table-column label="航班日期有效期内" prop="maxTime"></el-table-column>
          <el-table-column label="开具权限" prop="chnlStatus">
            <template slot-scope="scope">
              <span v-if="scope.row.chnlStatus === '0'">禁用</span>
              <span v-if="scope.row.chnlStatus === '1'">启用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="20">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="禁用" @click="handleState(scope.row.chnlStatus, scope.row.dealyChnlId)" v-if="scope.row.chnlStatus === '0'">启用</span>
              <span class="active-text mr-5" title="启用" @click="handleState(scope.row.chnlStatus, scope.row.dealyChnlId)" v-if="scope.row.chnlStatus === '1'">禁用</span>
              <!--<i class="table-icon disable-icon" @click="handleState(scope.row.chnlStatus, scope.row.dealyChnlId)" v-if="scope.row.chnlStatus === '0'" title="禁用"></i>-->
              <!--<i class="table-icon enable-icon" @click="handleState(scope.row.chnlStatus, scope.row.dealyChnlId)" v-if="scope.row.chnlStatus === '1'" title="启用"></i>-->
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
    <!-- 编辑弹出框 -->
    <el-dialog title="航延证明数据配置" :visible.sync="editVisible" width="560px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">渠道</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.channel" placeholder="请选择渠道类型" size="medium">
                  <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalId" :label="item.chalName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isReset && !editForm.channel">渠道类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">客票有效期内</div>
              <div class="ipt-medium">
                <el-input type="text" clearable v-model="editForm.limitTime" placeholder="客票有效期内" size="medium"></el-input>
                <div class="warning-info" v-if="isReset && !editForm.limitTime">客票有效期不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">航班日期有效期内</div>
              <div class="ipt-medium">
                <el-input type="text" clearable v-model="editForm.maxTime" placeholder="航班日期有效期内" size="medium"></el-input>
                <div class="warning-info" v-if="isReset && !editForm.maxTime">航班日期有效期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">开具权限</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.chnlStatus" placeholder="请选择开具权限" size="medium">
                  <el-option key="0" label="禁用" value="0"></el-option>
                  <el-option key="1" label="启用" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isReset && !editForm.chnlStatus">开具权限不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" @click="resetEdit">重置</el-button>
          <el-button size="medium" @click="editVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { queryFlightDelaydataList, updateFlightDelayChannel, addFlightDelayChannel } from './api'
import { getChannelList } from '../../../utils/index'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'FlightDelayChannel',
  data () {
    return {
      searchForm: {
        dealyChnlId: 'sdal',
        channel: '', // 渠道类型
        limitTime: '', // 客票有效期内
        chnlStatus: '' // 开具权限类型
      }, // 搜索框数据
      tableList: [], // 展示表格数据
      multipleSelection: [], // 选中的表单数据
      editForm: {
        channel: '', // 渠道类型
        limitTime: '', // 客票有效期内
        maxTime: '', // 航班日期有效期内
        chnlStatus: '' // 开具权限类型
      }, // 弹出框数据
      dataViewHeight: null, // 表格高度
      editVisible: false, // 弹出框显示隐藏
      isReset: false, // 弹出框表单判空
      loading: false // 加载
    }
  },
  created () {
    this.getChannelList()
    this.delayFlightDataList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      channelList: state => state.app.channelList, // 渠道
      tableAttributes: state => state.app.tableAttributes, // 表格
      pagination: state => state.app.pagination // 分页
    })
  },
  methods: {
    // 分页导航
    handleSizeChange (pages) {
      this.delayFlightDataList(null, pages)
    },
    handleCurrentChange (page) {
      this.delayFlightDataList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // channel没有则请求服务器
    getChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 获取表格数据
    delayFlightDataList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      queryFlightDelaydataList(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 重置
    handleReset () {
      this.searchForm = {
        page: 1
      }
      this.delayFlightDataList(1, this.pagination.pageSize)
    },
    // 添加
    handleEdit () {
      this.resetEdit()
      this.editVisible = true
    },
    // 更改禁用/启用 状态
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
        updateFlightDelayChannel({
          dealyChnlId: id,
          chnlStatus: status === '0' ? '1' : '0'
        }).then(res => {
          this.$message.success(res.message)
          this.delayFlightDataList(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },
    // 弹出框重置
    resetEdit () {
      this.editForm = {}
      this.isReset = false
    },
    // 弹出框编辑
    saveEdit () {
      if (this.editForm.channel && this.editForm.limitTime && this.editForm.maxTime && this.editForm.chnlStatus) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        addFlightDelayChannel(data).then(res => {
          this.editVisible = false
          this.$message.success(res.message)
          this.delayFlightDataList(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        this.isReset = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
