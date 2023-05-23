<template>
  <div class="container">
    <!--<h1>小程序消息推送模板</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
            <el-input size="medium" clearable placeholder="关键字" v-model="searchForm.msgKeys" @keydown.enter.native="MessageTemplatesList()"></el-input>
        </div>
        <div class="search-item search-ipt">
            <el-input size="medium" clearable placeholder="模板代码" v-model="searchForm.templetCode" @keydown.enter.native="MessageTemplatesList()"></el-input>
        </div>
        <div class="search-item search-ipt">
            <el-input size="medium" clearable placeholder="模板名称" v-model="searchForm.templetName" @keydown.enter.native="MessageTemplatesList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="searchForm.templetStatus" placeholder="请选择模板状态" size="medium" clearable>
            <el-option key="0" label="禁用" value="0"></el-option>
            <el-option key="1" label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="MessageTemplatesList(null, null)">查询</el-button>
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
<!--          <el-table-column label="序号" type="index" fixed="left" width="50"></el-table-column>-->
          <el-table-column label="关键字" prop="msgKeys" min-width="140"></el-table-column>
          <el-table-column label="模板代码" prop="templetCode" min-width="140"></el-table-column>
          <el-table-column label="模板名称" prop="templetName" min-width="140"></el-table-column>
          <el-table-column label="备注" prop="remark" min-width="140"></el-table-column>
          <el-table-column label="跳转页面" prop="toPage" min-width="140"></el-table-column>
          <el-table-column label="模板状态" prop="templetStatus" min-width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.templetStatus === '0'">禁用</div>
              <div v-if="scope.row.templetStatus === '1'">启用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="禁用" @click="handleState(scope.row.templetStatus, scope.row.msgTempletId)" v-if="scope.row.templetStatus === '0'">启用</span>
              <span class="active-text mr-5" title="启用" @click="handleState(scope.row.templetStatus, scope.row.msgTempletId)" v-if="scope.row.templetStatus === '1'">禁用</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.msgTempletId)">删除</span>
              <!--<i class="table-icon disable-icon" @click="handleState(scope.row.templetStatus, scope.row.msgTempletId)" v-if="scope.row.templetStatus === '0'" title="禁用"></i>-->
              <!--<i class="table-icon enable-icon" @click="handleState(scope.row.templetStatus, scope.row.msgTempletId)" v-if="scope.row.templetStatus === '1'" title="启用"></i>-->
              <!--<i class="table-icon delete-icon" title="删除" @click="handleDelete(scope.row.msgTempletId)"></i>-->
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
    <el-dialog title="添加" :visible.sync="editVisible" width="560px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">关键字</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="关键字" v-model="editForm.msgKeys" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.msgKeys">关键字不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">跳转页面</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="跳转页面" v-model="editForm.toPage" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.toPage">跳转页面不可为空</div>
              </div>
            </div>
          </div>
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
              <div class="label">备注</div>
              <div class="ipt-medium">
                <el-input type="textarea" clearable :rows="4" v-model="editForm.remark" size="medium"></el-input>
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
import { queryMessageTemplates, deleteMessageTemplate, addMessageTemplate, updateMessageTemplate, updateStatus } from './api'
import { computeTableHeight } from '../../../utils/index'
export default {
  name: 'MessageTemplate',
  data () {
    return {
      searchForm: { // 搜索表单数据
        sourceid: 'sdal',
        msgKeys: '', // 关键字
        templetCode: '', // 模板代码
        templetName: '', // 模板名称
        templetStatus: '' // 模板状态
      },
      tableList: [], // 展示表格数据
      editForm: { // 弹出框表单数据
        msgKeys: '', // 关键字
        toPage: '', // 跳转页面
        templetCode: '', // 模板代码
        templetName: '', // 模板名称
        remark: '', // 备注
        templetStatus: '' // 模板状态
      },
      // multipleSelection: [], // 选中的表单数据
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
    this.MessageTemplatesList(1, this.pagination.pageSize)
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
      this.MessageTemplatesList(null, pages)
    },
    handleCurrentChange (page) {
      this.MessageTemplatesList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    MessageTemplatesList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      queryMessageTemplates(this.searchForm).then(res => {
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
      this.MessageTemplatesList(1, this.pagination.pageSize)
    },
    // 添加/修改
    handleEdit (params) {
      this.editVisible = true
      this.isEmpty = false
      if (params) {
        this.isReset = false
        this.dataBind(params)
      } else {
        this.editForm = {}
        this.isReset = true
      }
    },
    // 数据处理
    dataBind (params) {
      this.editForm.msgTempletId = params.msgTempletId
      this.editForm.msgKeys = params.msgKeys
      this.editForm.toPage = params.toPage
      this.editForm.templetCode = params.templetCode
      this.editForm.templetName = params.templetName
      this.editForm.templetStatus = params.templetStatus
      this.editForm.remark = params.remark
    },
    // 弹出框数据 -- 保存
    saveEdit () {
      if (this.editForm.msgKeys && this.editForm.toPage && this.editForm.templetCode && this.editForm.templetName && this.editForm.templetStatus) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        if (this.isReset === false) {
          updateMessageTemplate(data).then(res => {
            this.editVisible = false
            this.MessageTemplatesList(1, this.pagination.pageSize)
            this.$message.success(res.message)
          }).catch(err => {
            this.$message.error(err.message)
          })
        } else {
          addMessageTemplate(data).then(res => {
            this.editVisible = false
            this.MessageTemplatesList(1, this.pagination.pageSize)
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
    resetEdit () {
      this.editForm = {}
      this.isEmpty = false
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
          msgTempletId: id,
          templetStatus: status === '0' ? '1' : '0'
        }).then(res => {
          this.$message.success(res.message)
          this.MessageTemplatesList(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },
    // 删除
    handleDelete (id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        // console.log(this.total)
        deleteMessageTemplate({ msgTempletId: id }).then(res => {
          this.$message.success(res.message)
          this.MessageTemplatesList(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
