<template>
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="名称" v-model="filter.name" clearable @keydown.enter.native="getQuestionnaireList()"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getQuestionnaireList()">查询</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog()">添加</el-button>
        <el-button size="medium" type="danger" :disabled="!multipleSelection.length" @click="handleConfirm()">批量删除</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="questionnaireList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          @selection-change="handleSelectionChange"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
          <el-table-column type="selection" :width="tableAttributes.selectionWidth"></el-table-column>
          <el-table-column label="名称" prop="surName"></el-table-column>
          <el-table-column label="地址" prop="surUrl"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="danger-text inl-block mr-5" @click="handleConfirm(scope.row.surId)">删除</span>
              <span class="active-text inl-block mr-5" @click="switchDialog(scope.row)">编辑</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filter.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="questionnaireList.total">
       </el-pagination>
    </div>
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="320px">
        <div class="dialog-container">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">名称</div>
                <div class="ipe-medium">
                  <el-input size="medium" placeholder="名称" v-model="questionInfo.surName" clearable=""></el-input>
                  <div class="danger-text" v-if="formErr && !questionInfo.surName">名称不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">地址</div>
                <div class="ipe-medium">
                  <el-input type="textarea" placeholder="地址" :rows="4" v-model="questionInfo.surUrl" clearable=""></el-input>
                  <div class="danger-text" v-if="formErr && !questionInfo.surUrl">地址不可为空</div>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" type="primary" v-if="isCreate" @click="handleAddSurvey">提交</el-button>
            <el-button size="medium" type="primary" v-if="!isCreate" @click="handleEditSurvey">提交</el-button>
            <el-button size="medium" v-if="isCreate" @click="handleReset">重置</el-button>
            <el-button size="medium" @click="dialogVisible = false">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchList, addSurvey, updateSurvey, deleteSurvey } from './api'
import { computeTableHeight, filterIds } from '../../../utils/index'

export default {
  name: 'Survey',
  data () {
    return {
      loading: false,
      filter: {},
      dataViewHeight: null,
      questionnaireList: {},
      multipleSelection: [], // 表格多选
      dialogTitle: '',
      currentItem: {},
      dialogVisible: false,
      formErr: false,
      isCreate: false,
      questionInfo: {
        surName: '',
        surUrl: ''
      }
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  created () {
    this.getQuestionnaireList(1, this.pagination.pageSize)
  },
  methods: {
    // 获取数据
    getQuestionnaireList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.questionnaireList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    // 分页
    handleSizeChange (pages) {
      this.getQuestionnaireList(null, pages)
    },
    handleCurrentChange (page) {
      this.getQuestionnaireList(page, null)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    switchDialog (param) {
      this.dialogVisible = true
      this.formErr = false
      if (param) {
        // 编辑
        this.currentItem = param
        this.isCreate = false
        this.dialogTitle = '修改'
        this.questionInfo.surName = param.surName
        this.questionInfo.surUrl = param.surUrl
      } else {
        // 新增
        this.handleReset()
        this.isCreate = true
        this.dialogTitle = '添加'
      }
    },
    // 新增
    handleAddSurvey () {
      if (this.questionInfo.surUrl && this.questionInfo.surName) {
        this.formErr = false
        addSurvey(this.questionInfo).then(() => {
          this.$message.success('添加成功')
          this.dialogVisible = false
          this.getQuestionnaireList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        this.formErr = true
      }
    },
    // 编辑
    handleEditSurvey () {
      let data = JSON.parse(JSON.stringify(this.questionInfo))
      data.surId = this.currentItem.surId
      if (this.questionInfo.surUrl && this.questionInfo.surName) {
        this.formErr = false
        updateSurvey(data).then(() => {
          this.$message.success('编辑成功')
          this.dialogVisible = false
          this.getQuestionnaireList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        this.formErr = true
      }
    },
    handleConfirm (id) {
      let ids = id || filterIds(this.multipleSelection, 'surId').join(',')
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        // 删除
        this.handleDeleteSurvey(ids)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 弹出框重置
    handleReset () {
      this.questionInfo = {
        surName: '',
        surUrl: ''
      }
      this.formErr = false
    },
    // 删除
    handleDeleteSurvey (id) {
      deleteSurvey({ ids: id }).then(() => {
        this.dialogVisible = false
        this.$message.success('操作成功')
        this.getQuestionnaireList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
