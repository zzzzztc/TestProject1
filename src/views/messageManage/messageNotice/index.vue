<template>
  <div class="container">
    <!--<h1>客户消息通知</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
            <el-input v-model="searchForm.templetName" clearable placeholder="模板名称" size="medium" @keydown.enter.native="smsTemplatesList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="searchForm.templetStatus" placeholder="请选择模板状态" size="medium" clearable>
            <el-option key="0" label="禁用" value="0"></el-option>
            <el-option key="1" label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input v-model="searchForm.afrom" clearable placeholder="出发三字码" size="medium"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input v-model="searchForm.ato" clearable placeholder="到达三字码" size="medium"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="smsTemplatesList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(null)">添加</el-button>
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
<!--          <el-table-column label="序号" fixed="left" type="index" width="50"></el-table-column>-->
          <el-table-column label="模板代码" prop="templetCode" min-width="60"></el-table-column>
          <el-table-column label="模板名称" prop="templetName" min-width="80"></el-table-column>
          <el-table-column label="出发三字码" prop="afrom"></el-table-column>
          <el-table-column label="到达三字码" prop="ato"></el-table-column>
          <el-table-column label="每日次数" prop="maxTimes" min-width="60"></el-table-column>
          <el-table-column label="有效期" prop="validTime" min-width="40"></el-table-column>
          <el-table-column label="内容" prop="mcontent" min-width="180"></el-table-column>
          <el-table-column label="发送模式" prop="sendMode" min-width="50"></el-table-column>
          <el-table-column label="类型" prop="checkType" min-width="50">
            <template slot-scope="scope">
              <div v-if="scope.row.checkType === '0'">消息通知</div>
              <div v-if="scope.row.checkType === '1'">验证码</div>
            </template>
          </el-table-column>
          <el-table-column label="模板状态" prop="templetStatus" min-width="50">
            <template slot-scope="scope">
              <div v-if="scope.row.templetStatus === '0'">禁用</div>
              <div v-if="scope.row.templetStatus === '1'">启用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="80">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="禁用" @click="handleState(scope.row.templetStatus, scope.row.smsId)" v-if="scope.row.templetStatus === '0'">启用</span>
              <span class="active-text mr-5" title="启用" @click="handleState(scope.row.templetStatus, scope.row.smsId)" v-if="scope.row.templetStatus === '1'">禁用</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.smsId)">删除</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <!--<i class="table-icon disable-icon" @click="handleState(scope.row.templetStatus, scope.row.smsId)" v-if="scope.row.templetStatus === '0'" title="禁用"></i>-->
              <!--<i class="table-icon enable-icon" @click="handleState(scope.row.templetStatus, scope.row.smsId)" v-if="scope.row.templetStatus === '1'" title="启用"></i>-->
              <!--<i class="table-icon delete-icon" title="删除" @click="handleDelete(scope.row.smsId)"></i>-->
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
    <!--编辑弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="560px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">模板代码</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="模板代码" v-model="editForm.templetCode" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.templetCode">模板代码不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">模板名称</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="模板名称" v-model="editForm.templetName" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.templetName">模板名称不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">模板类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.checkType" placeholder="请选择模板类型" size="medium">
                  <el-option key="0" label="消息通知" value="0"></el-option>
                  <el-option key="1" label="验证码" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.checkType">模板类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">发送模式</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.sendMode" multiple placeholder="请选择发送模式" size="medium">
                  <el-option key="0" label="email" value="email"></el-option>
                  <el-option key="1" label="mobile" value="mobile"></el-option>
                  <el-option key="1" label="QQ" value="QQ"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.sendMode">发送模式不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">出发三字码</div>
              <div>
                <el-input size="medium" placeholder="出发三字码" clearable v-model="editForm.afrom"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">到达三字码</div>
              <div>
                <el-input size="medium" placeholder="到达三字码" clearable v-model="editForm.ato"></el-input>
              </div>
            </div>
          </div>
          <div class="row" v-if="editForm.checkType === '1'">
            <div class="column">
              <div class="label">每日次数</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="每日次数" v-model="editForm.maxTimes" size="medium"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">有效期</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="有效期" v-model="editForm.validTime" size="medium"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">模板状态</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.templetStatus" placeholder="请选择模板状态" size="medium">
                  <el-option key="0" label="禁用" value="0"></el-option>
                  <el-option key="1" label="启用" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.templetStatus">模板状态不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">内容</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="4" clearable placeholder="内容" v-model="editForm.mcontent" size="medium"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" v-if="isReset" @click="resetEdit">重置</el-button>
          <el-button size="medium" @click="editVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { querySmsTemplates, deleteSmsTemplate, addSmsTemplate, updateSmsTemplate, updateSmsTemplateStatus } from './api'
import { computeTableHeight } from '../../../utils/index'
export default {
  name: 'SmsTemplate',
  data () {
    return {
      searchForm: {
        sourceid: 'sdal',
        templetName: '', // 模板名称
        templetStatus: '' // 模板状态
      },
      tableList: [], // 展示表格数据
      editForm: { // 弹出框表单数据
        afrom: '',
        ato: '',
        templetCode: '', // 模板代码
        templetName: '', // 模板名称
        checkType: '', // 类型
        maxTimes: '', // 每日次数
        validTime: '', // 有效期
        mcontent: '', // 内容
        sendMode: [], // 发送模式
        templetStatus: '' // 模板状态
      },
      popupTitle: '', // 弹出框标题
      dataViewHeight: null, // 表格高度
      editVisible: false, // 弹出框显示隐藏
      isReset: false, // 切换添加/修改
      isEmpty: false, // 输入框判空
      loading: false
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.smsTemplatesList(1, this.pagination.pageSize)
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes, // 表格
      pagination: state => state.app.pagination // 分页
    })
  },
  methods: {
    // 分页导航
    handleSizeChange (pages) {
      this.smsTemplatesList(null, pages)
    },
    handleCurrentChange (page) {
      this.smsTemplatesList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.smsTemplatesList = val
    },
    // 获取表格数据
    smsTemplatesList (page, pageSize) {
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      querySmsTemplates(this.searchForm).then(res => {
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
      this.smsTemplatesList(1, this.pagination.pageSize)
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
        this.editForm = {
          afrom: '',
          ato: '',
          templetCode: '', // 模板代码
          templetName: '', // 模板名称
          checkType: '', // 类型
          maxTimes: '', // 每日次数
          validTime: '', // 有效期
          mcontent: '', // 内容
          sendMode: [], // 发送模式
          templetStatus: '' // 模板状态
        }
        this.isReset = true
      }
    },
    // 数据处理
    dataBind (params) {
      this.editForm.smsId = params.smsId
      this.editForm.templetCode = params.templetCode
      this.editForm.templetName = params.templetName
      this.editForm.checkType = params.checkType
      this.editForm.maxTimes = params.maxTimes
      this.editForm.validTime = params.validTime
      this.editForm.mcontent = params.mcontent
      this.editForm.sendMode = params.sendMode.split(',')
      this.editForm.templetStatus = params.templetStatus
      this.editForm.afrom = params.afrom
      this.editForm.ato = params.ato
    },
    // 删除
    handleDelete (id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteSmsTemplate({ smsId: id }).then(res => {
          this.$message.success(res.message)
          this.smsTemplatesList(1, this.pagination.pageSize)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 启用/禁用
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
        updateSmsTemplateStatus({
          smsId: id,
          templetStatus: status === '0' ? '1' : '0'
        }).then(res => {
          this.$message.success(res.message)
          this.smsTemplatesList(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },
    // 弹出框数据 -- 重置
    resetEdit () {
      this.editForm = {}
      this.isEmpty = false
    },
    // 弹出框数据 -- 保存
    saveEdit () {
      if (this.editForm.templetCode && this.editForm.templetName && this.editForm.checkType && this.editForm.mcontent && this.editForm.sendMode && this.editForm.templetStatus) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        data.sendMode = data.sendMode.join(',')
        if (this.isReset === false) {
          updateSmsTemplate(data).then(res => {
            this.editVisible = false
            this.smsTemplatesList(1, this.pagination.pageSize)
            this.$message.success(res.message)
          }).catch(err => {
            this.$message.error(err.message)
          })
        } else {
          addSmsTemplate(data).then(res => {
            this.editVisible = false
            this.smsTemplatesList(1, this.pagination.pageSize)
            this.$message.success(res.message)
          }).catch(err => {
            this.$message.error(err.message)
          })
        }
      } else {
        this.isEmpty = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
