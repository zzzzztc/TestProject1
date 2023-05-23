<template>
  <div class="container">
    <!--<h1>APP消息推送模板</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="标题" v-model="searchForm.titel" @keydown.enter.native="appmsgTempletList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="appmsgTempletList(null, null)">查询</el-button>
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
          <el-table-column label="标题" prop="titel" min-width="140"></el-table-column>
          <el-table-column label="内容" prop="content"></el-table-column>
          <el-table-column label="模板名称" prop="templetName"></el-table-column>
          <el-table-column label="说明" prop="remark"></el-table-column>
          <el-table-column label="消息类型" prop="msgType">
            <template slot-scope="scope">
              <div v-if="scope.row.msgType === '0'">预定成功</div>
              <div v-if="scope.row.msgType === '1'">出票成功</div>
              <div v-if="scope.row.msgType === '2'">退票成功</div>
              <div v-if="scope.row.msgType === '3'">航班动态关注</div>
              <div v-if="scope.row.msgType === '4'">值机成功</div>
            </template>
          </el-table-column>
          <el-table-column label="定向推送" prop="isSwitch">
            <template slot-scope="scope">
              <div v-if="scope.row.isSwitch === 0">否</div>
              <div v-if="scope.row.isSwitch === 1">是</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="60">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.msgTempletId)">删除</span>
              <!--<i class="table-icon edit-icon" tactive-text mr-5itle="编辑" @click="handleEdit(scope.row)"></i>-->
              <!--<i class="table-icon delete-icon" title="删除" @click="handleDelete(scope.row.msgTempletId)"></i>-->
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
              <div class="label required">标题</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="标题" v-model="editForm.titel" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.titel">标题不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">内容</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="内容" v-model="editForm.content" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.content">内容不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">模板名称</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="模板名称" v-model="editForm.templetName" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.templetName">模板名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">说明</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="说明" v-model="editForm.remark" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.remark">说明不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">消息类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.msgType" placeholder="请选择消息类型" size="medium">
                  <el-option v-for="item in newsList" :key="item.dincId" :label="item.dincName" :value="item.dincCode"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.msgType">消息类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">定向推送</div>
              <div class="ipt-medium">
                <el-select size="medium" placeholder="定向推送" v-model="editForm.isSwitch">
                  <el-option label="否" value="0"></el-option>
                  <el-option label="是" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.isSwitch">定向推送不可为空</div>
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
import { queryAppmsgTempletList, querydictsByType, addAppmsgTemplet, updateAppmsgTemplet, deleteAppmsgTemplet } from './api'
import { computeTableHeight } from '../../../utils/index'
export default {
  name: 'AppmsgTemplet',
  data () {
    return {
      searchForm: { // 搜索表单数据
        sourceid: 'hbal',
        titel: '' // 标题
      },
      tableList: [], // 展示表格数据
      newsList: [], // 消息类型数据
      editForm: { // 弹出框表单数据
        msgTempletId: '',
        titel: '', // 标题
        content: '', // 内容
        templetName: '', // 模板名称
        remark: '', // 说明
        msgType: '', // 消息类型
        isSwitch: '' // 定向推送
      },
      popupTitle: '', // 弹出框标题
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
    this.appmsgTempletList(1, this.pagination.pageSize)
    this.dictsByTypeList()
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
      this.appmsgTempletList(null, pages)
    },
    handleCurrentChange (page) {
      this.appmsgTempletList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    appmsgTempletList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      queryAppmsgTempletList(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 获取消息类型
    dictsByTypeList () {
      querydictsByType({ type: 'MSGTYPE' }).then(res => {
        this.newsList = res.rows
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 重置
    handleReset () {
      this.searchForm = {
        page: 1
      }
      this.appmsgTempletList(1, this.pagination.pageSize)
    },
    // 添加/修改
    handleEdit (params) {
      this.dictsByTypeList()
      this.editVisible = true
      this.isEmpty = false
      if (params) {
        this.popupTitle = '修改'
        this.isReset = false
        this.dataBind(params)
      } else {
        this.popupTitle = '添加'
        this.isReset = true
        this.resetEdit()
      }
    },
    // 数据处理
    dataBind (params) {
      this.editForm.msgTempletId = params.msgTempletId
      this.editForm.titel = params.titel
      this.editForm.content = params.content
      this.editForm.templetName = params.templetName
      this.editForm.remark = params.remark
      this.editForm.msgType = params.msgType
      this.editForm.isSwitch = JSON.stringify(params.isSwitch)
    },
    // 弹出框数据 -- 保存
    saveEdit () {
      if (this.editForm.titel && this.editForm.content && this.editForm.templetName && this.editForm.remark && this.editForm.msgType && this.editForm.isSwitch) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        if (this.isReset === false) {
          updateAppmsgTemplet(data).then(res => {
            this.editVisible = false
            this.appmsgTempletList()
            this.$message.success(res.message)
          }).catch(err => {
            this.$message.error(err.message)
          })
        } else {
          addAppmsgTemplet(data).then(res => {
            this.editVisible = false
            this.appmsgTempletList()
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
    // 删除
    handleDelete (id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteAppmsgTemplet({ ids: id }).then(res => {
          this.$message.success(res.message)
          this.appmsgTempletList()
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
