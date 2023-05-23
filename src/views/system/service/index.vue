<template>
  <!--<h1>业务协议管理</h1>-->
  <div id="Agreement" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="协议标题" v-model="searchForm.agreeTitel" @keydown.enter.native="agreeContentList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.begen"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="起始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.endDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.channel' placeholder="请选择渠道" size="medium">
            <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="searchForm.agreeType" placeholder="请选择协议类型" size="medium">
            <el-option key="0" label="text" value="text"></el-option>
            <el-option key="1" label="html" value="html"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="searchForm.agreeStatus" placeholder="请选择启用/禁用" size="medium">
            <el-option key="0" label="禁用" value="0"></el-option>
            <el-option key="1" label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="agreeContentList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" type="success" @click="handleExport">导出</el-button>
        <el-button size="medium" @click="handleEdit(null)">添加业务协议内容</el-button>
        <el-button size="medium" type="danger" :disabled="!multipleSelection.length" @click="handleDelete(null)">删除业务协议内容</el-button>
        <el-button size="medium" :disabled="!multipleSelection.length" @click="handleEditChannel">修改所属渠道</el-button>
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
          <el-table-column label="渠道编号" prop="channel" min-width="180">
            <template slot-scope="scope">
              <div>{{scope.row.channel | channelMap}}</div>
            </template>
          </el-table-column>
          <el-table-column label="协议编号" prop="agreeCode" min-width="300"></el-table-column>
          <el-table-column label="协议标题" prop="agreeTitel" min-width="180"></el-table-column>
          <el-table-column label="协议类型" prop="agreeType" min-width="80"></el-table-column>
          <el-table-column label="协议内容" prop="agreeContent" min-width="600"></el-table-column>
          <el-table-column label="协议创建日期" prop="createDate" min-width="140"></el-table-column>
          <el-table-column label="协议组" prop="agreeGroup" min-width="140"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="120">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="启用" @click="handleState(scope.row.agreeStatus, scope.row.agreeId)" v-if="scope.row.agreeStatus === '1'">禁用</span>
              <span class="active-text mr-5" title="禁用" @click="handleState(scope.row.agreeStatus, scope.row.agreeId)" v-if="scope.row.agreeStatus === '0'">启用</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.agreeId)">删除</span>
              <!--<i class="table-icon disable-icon" @click="handleState(scope.row.agreeStatus, scope.row.agreeId)" v-if="scope.row.agreeStatus === '0'" title="禁用"></i>-->
              <!--<i class="table-icon enable-icon" @click="handleState(scope.row.agreeStatus, scope.row.agreeId)" v-if="scope.row.agreeStatus === '1'" title="启用"></i>-->
              <!--<i class="table-icon delete-icon" title="删除" @click="handleDelete(scope.row.agreeId)"></i>-->
              <!--<i class="table-icon edit-icon" title="编辑" @click="handleEdit(scope.row)"></i>-->
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
    <!--渠道修改弹出框-->
    <el-dialog title="设置渠道" :visible.sync="editChannel" width="400px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">渠道编号</div>
              <div class="ipt-medium">
                <el-select v-model="editChannelForm.channel" placeholder="请选择渠道编号" multiple size="medium">
                  <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editChannelForm.channel.length">渠道编号不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" @click="editChannel = false">取消</el-button>
          <!--<el-button size="medium" v-if="isReset" @click="channelReset">重置</el-button>-->
          <el-button size="medium" type="primary" @click="channelEdit">编辑</el-button>
        </div>
      </div>
    </el-dialog>
    <!--业务协议内容添加/修改弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="600px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">渠道编号</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.channel" placeholder="请选择渠道编号" multiple size="medium" collapse-tags>
                  <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.channel.length">渠道编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">协议标题</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="协议标题" v-model="editForm.agreeTitel" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.agreeTitel">协议标题不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">协议类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.agreeType" placeholder="请选择协议类型" size="medium">
                  <el-option key="0" label="text" value="text"></el-option>
                  <el-option key="1" label="html" value="html"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.agreeType">协议类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">启用/禁用</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.agreeStatus" placeholder="是否启用/禁用" size="medium">
                  <el-option key="0" label="禁用" value="0"></el-option>
                  <el-option key="1" label="启用" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.agreeStatus">启用/禁用不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">协议标识</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="协议标识" v-model="editForm.agreeLabel" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.agreeLabel">协议标识不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">协议内容</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="4" clearable placeholder="协议内容" v-model="editForm.agreeContent" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.agreeContent">协议内容不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">协议组</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="4" clearable placeholder="协议组" v-model="editForm.agreeGroup" size="medium"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <!--<el-button size="medium" type="primary" @click="popupEdit">{{isReset ? '提交' : '编辑'}}</el-button>-->
          <el-button size="medium" type="primary" @click="popupEdit">提交</el-button>
          <el-button size="medium" v-if="isReset" @click="popupReset">重置</el-button>
          <el-button size="medium" @click="editVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { queryAgreeContent, modifyAgreeContentChannel, addAgreeContent, updateAgreeContent, deleteAgreeContent, validityAgreeContent } from './api'
import { getChannelList, excelList, getRouteName } from '../../../utils/index'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'Agreement',
  data () {
    return {
      searchForm: {
        agreeTitel: '', // 协议标题
        begen: '', // 起始日期
        channel: '', // 渠道编号
        agreeType: '', // 协议类型
        agreeStatus: '', // 启用/禁用
        endDate: '' // 截止日期
      }, // 搜索框数据
      editForm: {
        channel: [], // 渠道编号
        agreeTitel: '', // 协议标题
        agreeType: '', // 协议类型
        agreeLabel: '', // 协议标识
        agreeContent: '', // 协议内容
        agreeGroup: '', // 协议组
        agreeStatus: '' // 启用/禁用
      }, // 添加/修改数据
      editChannelForm: {
        channel: [],
        ids: ''
      }, // 渠道编号数据
      popupTitle: '', // 弹出框标题
      createDate: [], // 起始/截止日期
      tableList: [], // 展示表格数据
      multipleSelection: [], // 选中的表单数据
      dataViewHeight: null, // 表格高度
      editChannel: false, // 渠道修改弹出框显示隐藏
      editVisible: false, // 弹出框显示隐藏
      isReset: false, // 切换添加/修改
      isEmpty: false, // 输入框判空
      loading: false // 加载
    }
  },
  created () {
    this.getChannelList()
    this.agreeContentList(1, this.pagination.pageSize)
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
    // 分页导航
    handleSizeChange (pages) {
      this.agreeContentList(null, pages)
    },
    handleCurrentChange (page) {
      this.agreeContentList(page, null)
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
    agreeContentList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      // if (this.createDate && this.createDate.length) {
      //   this.searchForm.begen = this.createDate[0]
      //   this.searchForm.endDate = this.createDate[1]
      // } else {
      //   delete this.searchForm.begen
      //   delete this.searchForm.endDate
      // }
      queryAgreeContent(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 重置
    handleReset () {
      this.searchForm = {}
      this.agreeContentList(1, this.pagination.pageSize)
    },
    // 修改所属渠道
    handleEditChannel () {
      this.editChannel = true
      this.isEmpty = false
      let agreeId = ''
      if (this.multipleSelection.length > 1) {
        this.editChannelForm = {
          channel: []
        }
      } else {
        this.editChannelForm.channel = this.multipleSelection[0].channel.split(',')
      }
      for (let item of this.multipleSelection) {
        agreeId += item.agreeId + ','
      }
      this.editChannelForm.ids = agreeId.substring(0, agreeId.length - 1)
    },
    // 渠道修改弹出框 - 保存
    channelEdit () {
      if (this.editChannelForm.channel.length) {
        // console.log(this.editChannelForm.channel)
        let data = JSON.parse(JSON.stringify(this.editChannelForm))
        if (data.channel.length) {
          data.channel = data.channel.join(',')
        }
        modifyAgreeContentChannel(data).then(res => {
          this.editChannel = false
          this.agreeContentList(1, this.pagination.pageSize)
          this.$message.success(res.message)
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        this.isEmpty = true
      }
    },
    // 添加/修改
    handleEdit (params) {
      this.editVisible = true
      this.isEmpty = false
      if (params) {
        this.popupTitle = '修改'
        this.isReset = false
        this.dataBind(params)
      } else {
        this.popupTitle = '添加'
        this.popupReset()
        this.isReset = true
      }
    },
    // 弹出框数据 -- 保存
    popupEdit () {
      if (this.editForm.channel.length && this.editForm.agreeTitel &&
          this.editForm.agreeType && this.editForm.agreeLabel &&
          this.editForm.agreeContent && this.editForm.agreeStatus) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        if (data.channel.length) {
          data.channel = data.channel.join(',')
        }
        if (this.isReset === false) {
          updateAgreeContent(data).then(res => {
            this.editVisible = false
            this.agreeContentList(1, this.pagination.pageSize)
            this.$message.success(res.message)
          }).catch(err => {
            this.$message.error(err.message)
          })
        } else {
          addAgreeContent(data).then(res => {
            this.editVisible = false
            this.agreeContentList(1, this.pagination.pageSize)
            this.$message.success(res.message)
          }).catch(err => {
            this.$message.error(err.message)
          })
        }
      } else {
        this.isEmpty = true
      }
    },
    // 弹出框数据 -- 重置
    popupReset () {
      this.editForm = {
        agreeTitel: '',
        agreeType: '',
        agreeLabel: '',
        agreeContent: '',
        agreeGroup: '',
        agreeStatus: '',
        channel: []
      }
      this.isEmpty = false
    },
    // 删除
    handleDelete (id) {
      let agreeIds = ''
      if (id) {
        agreeIds = id
      } else {
        for (let item of this.multipleSelection) {
          agreeIds += item.agreeId + ','
        }
        agreeIds = agreeIds.substring(0, agreeIds.length - 1)
      }
      this.$confirm('是否确认删除 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteAgreeContent({ ids: agreeIds }).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.agreeContentList(1, this.pagination.pageSize)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
        validityAgreeContent({
          ids: id,
          validity: status === '0' ? '1' : '0'
        }).then(res => {
          this.$message.success(res.message)
          this.agreeContentList(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },
    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.searchForm))
      data.start = 1
      data.end = this.tableList.total
      delete data.page
      delete data.rows
      let params = {
        data: JSON.parse(JSON.stringify(this.searchForm)),
        url: 'agreeContent/ExportAgreeContent',
        name: getRouteName('/agreement'),
        type: 'xls'
      }
      excelList(params, this)
    },
    // 数据处理
    dataBind (params) {
      this.editForm.agreeId = params.agreeId
      this.editForm.channel = params.channel.split(',')
      this.editForm.agreeTitel = params.agreeTitel
      this.editForm.agreeType = params.agreeType
      this.editForm.agreeLabel = params.agreeLabel
      this.editForm.agreeContent = params.agreeContent
      this.editForm.agreeGroup = params.agreeGroup
      this.editForm.agreeStatus = params.agreeStatus
    }
  }
}
</script>

<style scoped lang="scss">
</style>
