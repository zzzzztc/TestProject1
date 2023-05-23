<template>
  <div id="UpgradTime" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="产品编码" v-model="searchForm.upgradCode" @keydown.enter.native="getTimeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="产品名称" v-model="searchForm.upgradName" @keydown.enter.native="getTimeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.channel' placeholder="请选择渠道" size="medium">
            <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.timeStatus' clearable placeholder='启用/禁用' size='medium'>
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="getTimeList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(null)">添加</el-button>
        <el-button size="medium" type="danger" :disabled="!multipleSelection.length" @click="handleDelects">批量删除</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container" >
        <el-table
          v-loading="loading"
          :data="timeList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" fixed="left" min-width="46"></el-table-column>
          <el-table-column label="产品编码" fixed="left" min-width="80">
            <template slot-scope="scope">
              <div class="">{{scope.row.upgradcode}}</div>
            </template>
          </el-table-column>
          <el-table-column label="产品名称" prop='upgradname' min-width="100"></el-table-column>
          <el-table-column label="时间类型" prop='timetype' min-width="160">
            <template slot-scope="scope">
              <span>
                {{scope.row.timetype == 0 ? '航班计划离站时间前' :  ''}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="时间起" prop='timestart' :formatter="timeStartFormatter" min-width="140"></el-table-column>
          <el-table-column label="时间止" prop='timeend' :formatter="timeEndFormatter" min-width="140"></el-table-column>
          <el-table-column label="渠道类型" prop='channel' min-width="160">
            <template slot-scope="scope">
              <div>{{scope.row.channel | channelMap}}</div>
            </template>
          </el-table-column>
          <el-table-column label="支付时间" prop='paylimit' :formatter="paylimitFormatter" min-width="140">
            <!--<template slot-scope="scope">-->
              <!--<div>{{scope.row.paylimit + '分'}}</div>-->
            <!--</template>-->
          </el-table-column>
          <el-table-column label="备注" prop='timeremark' min-width="100"></el-table-column>
          <el-table-column label="启用状态" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.timestatus === '1'">启用</span>
              <span v-else >禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="120">
              <template slot-scope="scope">
                <span class="active-text mr-5" title="禁用" @click="handleState(scope.row.timestatus, scope.row.timeid)" v-if="scope.row.timestatus === '0'">启用</span>
                <span class="active-text mr-5" title="启用" @click="handleState(scope.row.timestatus, scope.row.timeid)" v-if="scope.row.timestatus === '1'">禁用</span>
                <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
                <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.timeid)">删除</span>
                <!--<i class="table-icon disable-icon" @click="handleState(scope.row.timestatus, scope.row.timeid)" v-if="scope.row.timestatus === '0'" title="禁用"></i>-->
                <!--<i class="table-icon enable-icon" @click="handleState(scope.row.timestatus, scope.row.timeid)" v-if="scope.row.timestatus === '1'" title="启用"></i>-->
                <!--<i class="table-icon delete-icon" title="删除" @click="handleDelete(scope.row.timeid)"></i>-->
                <!--<i class="table-icon edit-icon" title="编辑" @click="handleEdit(scope.row)"></i>-->
              </template>
          </el-table-column>
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
        :total="timeList.total">
      </el-pagination>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog :title="editVisibleTiTle" :visible.sync="editVisible" width="580px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label">升舱产品</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.upgradId" placeholder="升舱产品" size="medium" filterable>
                  <el-option v-for="item in upgradList" :key="item.upgradId" :label="item.upgradName" :value="item.upgradId"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">时间类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.timetype" placeholder="时间类型" size="medium">
                  <el-option key="0" label="航班计划离站时间前" value="0"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column" style="width: 480px;">
              <div class="label">时间起</div>
              <div class="ipt-medium">
                <div class="clearfix">
                  <el-input class="fl" size="medium" clearable placeholder="天" style="width: 100px" v-model="editForm.startDay"></el-input>
                  <div class="fl" style="padding: 8px 10px;">天</div>
                  <el-input class="fl" size="medium" clearable placeholder="小时" style="width: 100px" v-model="editForm.startHour"></el-input>
                  <div class="fl" style="padding: 8px 10px;">小时</div>
                  <el-input class="fl" size="medium" clearable placeholder="分钟" style="width: 100px" v-model="editForm.startMin"></el-input>
                  <div class="fl" style="padding: 8px 10px;">分钟</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column" style="width: 480px;">
              <div class="label">时间止</div>
              <div class="fl ipt-medium">
                <div class="clearfix">
                  <el-input class="fl" size="medium" clearable placeholder="天" style="width: 100px" v-model="editForm.endDay"></el-input>
                  <div class="fl" style="padding: 8px 10px;">天</div>
                  <el-input class="fl" size="medium" clearable placeholder="小时" style="width: 100px" v-model="editForm.endHour"></el-input>
                  <div class="fl" style="padding: 8px 10px;">小时</div>
                  <el-input class="fl" size="medium" clearable placeholder="分钟" style="width: 100px" v-model="editForm.endMin"></el-input>
                  <div class="fl" style="padding: 8px 10px;">分钟</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">渠道类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.channel" clearable multiple size="medium" collapse-tags>
                  <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
                </el-select>
                <div class="warning-info" v-if="judgeShow && !editForm.channel.length">渠道类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">支付时间(分钟)</div>
              <div class="ipt-medium">
                <el-input size="medium" clearable v-model="editForm.paylimit"></el-input>
                <div class="warning-info" v-if="judgeShow && !editForm.paylimit">支付时间不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">启用/禁用</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.timestatus" size="medium">
                  <el-option label="禁用" value="0"></el-option>
                  <el-option label="启用" value="1"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">备注</div>
              <div class="ipt-medium">
                <el-input type="textarea" clearable :rows="4" size="medium" v-model="editForm.timeremark"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <!--<el-button size="medium" type="primary" @click="saveEdit">{{isReset ? '提交' : '编辑'}}</el-button>-->
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" v-if="isReset" @click="resetEdit">重置</el-button>
          <el-button size="medium" @click="editVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { upgradTimeList, delTimeList, editTimeList, addTimeList, updateStatus, getUpgradProductList } from './api'
import { getChannelList } from '../../../utils/index'
import { mapState } from 'vuex'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'UpgradTime',
  data () {
    return {
      searchForm: {
        upgradCode: '', // 产品编号
        upgradName: '', // 产品名称
        channel: '', // 渠道类型 下拉框
        timeStatus: '' // 启用/禁用 下拉框
      }, // 搜索表单数据
      isReset: false, // 弹出框重置按钮的显示隐藏
      editVisible: false, // 弹出框显示隐藏
      addShow: false, // true为添加，false为修改
      judgeShow: false, // 判空提示显示隐藏
      dataViewHeight: null, // 表格高度
      timeList: {}, // 表格数据
      upgradList: [], // 升舱产品数据列表
      editForm: {
        timeid: '',
        upgradname: '1',
        timestart: '',
        timeend: '',
        upgradId: '',
        timetype: '0',
        paylimit: '10',
        timestatus: '1',
        startDay: '',
        startHour: '',
        startMin: '',
        endDay: '',
        endHour: '',
        endMin: '',
        channel: ['app']
      }, // 弹框编辑表格
      multipleSelection: [], // 选中的表格数据
      loading: false,
      editVisibleTiTle: ''
    }
  },
  created () {
    this.getChannelList()
    this.getTimeList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      channelList: state => state.app.channelList, // 渠道
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    // 获取渠道列表
    // channel没有则请求服务器
    getChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 获取升舱产品列表
    getUpgradList () {
      getUpgradProductList().then(res => {
        this.upgradList = res.obj
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getTimeList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      let data = JSON.parse(JSON.stringify(this.searchForm))
      data['timeStatus'] = this.searchForm.timeStatus === '' ? '-1' : this.searchForm.timeStatus
      upgradTimeList(data).then(res => {
        this.timeList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 分页导航
    handleSizeChange (pages) {
      this.getTimeList(null, pages)
    },
    handleCurrentChange (page) {
      this.getTimeList(page, null)
    },
    // 时间起
    timeStartFormatter (row, column, cellValue, index) {
      let times = this.times(cellValue)
      let str = ''
      if (times.day > 0) {
        str = times.day + '天'
      }
      if (times.hour > 0) {
        str += times.hour + '小时'
      }
      if (times.min > 0) {
        str += times.min + '分'
      }
      return str
    },
    // 时间止
    timeEndFormatter (row, column, cellValue, index) {
      let times = this.times(cellValue)
      let str = ''
      if (times.day > 0) {
        str = times.day + '天'
      }
      if (times.hour > 0) {
        str += times.hour + '小时'
      }
      if (times.min > 0) {
        str += times.min + '分'
      }
      return str
    },
    // 支付时间
    paylimitFormatter (row, column, cellValue, index) {
      let times = this.times(cellValue)
      let str = ''
      if (times.day > 0) {
        str = times.day + '天'
      }
      if (times.hour > 0) {
        str += times.hour + '小时'
      }
      if (times.min > 0) {
        str += times.min + '分'
      }
      return str
    },
    times (val) {
      let day = parseInt(val / 60 / 24)
      let hour = parseInt(val / 60 % 24)
      let min = parseInt(val % 60)
      let time = { day, hour, min }
      return time
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
        updateStatus({
          id: id,
          status: status === '0' ? '1' : '0'
        }).then(res => {
          this.$message.success(res.message)
          this.getTimeList(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },
    // 编辑弹出框
    handleEdit (params) {
      this.editVisible = true
      this.getUpgradList()
      if (params) {
        // 修改
        this.addShow = false
        this.isReset = false
        this.editVisibleTiTle = '修改'
        this.dataBind(params)
      } else {
        // 新增
        this.addShow = true
        this.isReset = true
        this.editVisibleTiTle = '添加'
        this.resetEdit()
      }
    },
    dataBind (params) {
      this.editForm.timeid = params.timeid
      this.editForm.timestart = params.timestart
      this.editForm.timeend = params.timeend
      this.editForm.upgradId = params.upgradid
      this.editForm.timetype = params.timetype
      this.editForm.paylimit = params.paylimit
      this.editForm.timestatus = params.timestatus
      this.editForm.channel = params.channel.split(',')
      this.editForm.startDay = this.times(params.timestart).day
      this.editForm.startHour = this.times(params.timestart).hour
      this.editForm.startMin = this.times(params.timestart).min
      this.editForm.endDay = this.times(params.timeend).day
      this.editForm.endHour = this.times(params.timeend).hour
      this.editForm.endMin = this.times(params.timeend).min
    },

    // 保存编辑
    saveEdit () {
      if (!this.editForm.startDay && !this.editForm.startHour && !this.editForm.startMin) {
        this.$message.error('时间起至少填写一项')
        return false
      }
      if (!this.editForm.endDay && !this.editForm.endHour && !this.editForm.endMin) {
        this.$message.error('时间止至少填写一项')
        return false
      }
      if (this.editForm.paylimit || !this.editForm.channel.length) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        if (data.channel.length) {
          data.channel = data.channel.join(',')
        }
        // console.log()
        data.timestart = parseInt((parseInt(data.startDay * 24 * 60) || 0) + (parseInt(data.startHour * 60) || 0) + (parseInt(data.startMin) || 0))
        data.timeend = parseInt((parseInt(data.endDay * 24 * 60) || 0) + (parseInt(data.endHour * 60) || 0) + (parseInt(data.endMin) || 0))
        if (this.addShow === false) {
          editTimeList({
            timeId: data.timeid,
            upgradId: data.upgradId,
            timeType: data.timetype,
            timeStart: data.timestart,
            timeEnd: data.timeend,
            channel: data.channel,
            payLimit: data.paylimit,
            timeStatus: data.timestatus
          }).then(res => {
            this.editVisible = false
            this.addShow = false
            this.getTimeList(1, this.pagination.pageSize)
            this.$message.success(res.message)
          }).catch(err => {
            this.$message.error(err.message)
          })
        } else {
          addTimeList({
            upgradId: '1',
            timeType: data.timetype,
            timeStart: data.timestart,
            timeEnd: data.timeend,
            channel: data.channel,
            payLimit: data.paylimit,
            timeStatus: data.timestatus
          }).then(res => {
            this.editVisible = false
            this.getTimeList(1, this.pagination.pageSize)
            this.$message.success(res.message)
          }).catch(err => {
            this.$message.error(err.message)
          })
          this.editVisible = false
          this.addShow = false
        }
      } else {
        this.judgeShow = true
      }
    },
    // 重置弹出框
    resetEdit () {
      this.editForm = {
        upgradId: '1',
        upgradname: '1',
        timetype: '0',
        paylimit: '10',
        timestatus: '1',
        channel: ['app']
      }
      this.judgeShow = false
    },
    // 单行删除
    handleDelete (id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        delTimeList({ timeIds: id }).then(res => {
          this.$message.success(res.message)
          this.getTimeList(1, this.pagination.pageSize)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 全页重置
    handleReset () {
      this.searchForm = {
        upgradCode: '',
        upgradName: '',
        channel: '',
        timeStatus: '1',
        page: 1,
        rows: 10
      }
      this.getTimeList(1, this.pagination.pageSize)
    },
    // 选择删除
    handleDelects () {
      let timeIds = ''
      for (let item of this.multipleSelection) {
        // console.log(item)
        timeIds += item.timeid + ','
      }
      timeIds = timeIds.substring(0, timeIds.length - 1)
      this.handleDelete(timeIds)
    },
    // 获取表格选中后的数据
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped lang='scss'>

</style>
