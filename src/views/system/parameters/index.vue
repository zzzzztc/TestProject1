<template>
  <div class="container">
    <!--<h1>后台功能管控(业务参数配置维护)</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
            <el-input v-model="searchForm.paramName" clearable placeholder="参数名称" size="medium" @keydown.enter.native="bussParamConfigList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="bussParamConfigList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(null)">添加业务参数配置</el-button>
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
          <!--<el-table-column type="selection" width="50" fixed="left"></el-table-column>-->
          <el-table-column label="参数代码" prop="paramCode"></el-table-column>
          <el-table-column label="参数名称" prop="paramName"></el-table-column>
          <el-table-column label="参数值" prop="paramValue"></el-table-column>
          <el-table-column label="说明" prop="remark"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="20">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <!--<i class="table-icon delete-icon" title="删除" @click="handleDelete(scope.row.paramId)"></i>-->
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
              <div class="label required">参数代码</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="参数代码" v-model="editForm.paramCode" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.paramCode">参数代码不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">参数名称</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="参数名称" v-model="editForm.paramName" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.paramName">参数名称不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">参数值</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="参数值" v-model="editForm.paramValue" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.paramValue">参数值不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">说明</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="4" clearable placeholder="说明" v-model="editForm.remark" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.remark">说明不可为空</div>
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
import { queryBussParamConfig, addBussParamConfig, editBussParamConfig } from './api'
import { computeTableHeight } from '../../../utils/index'
export default {
  name: 'BussParamConfig',
  data () {
    return {
      searchForm: {
        paramName: '' // 参数名称
      }, // 搜索框数据
      editForm: {
        paramCode: '', // 参数代码
        paramName: '', // 参数名称
        paramValue: '', // 参数值
        remark: '' // 说明
      }, // 添加/修改数据
      popupTitle: '', // 弹出框标题
      tableList: [], // 展示表格数据
      multipleSelection: [], // 选中的表单数据
      dataViewHeight: null, // 表格高度
      editVisible: false, // 弹出框显示隐藏
      isReset: false, // 切换添加/修改
      isEmpty: false, // 输入框判空
      loading: false // 加载
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.bussParamConfigList(1, this.pagination.pageSize)
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    // 分页导航
    handleSizeChange (pages) {
      this.bussParamConfigList(null, pages)
    },
    handleCurrentChange (page) {
      this.bussParamConfigList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    bussParamConfigList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      queryBussParamConfig(this.searchForm).then(res => {
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
      this.bussParamConfigList(1, this.pagination.pageSize)
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
      if (this.editForm.paramCode && this.editForm.paramName && this.editForm.paramValue && this.editForm.remark) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        if (this.isReset === false) {
          editBussParamConfig(data).then(res => {
            this.editVisible = false
            this.bussParamConfigList(1, this.pagination.pageSize)
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }).catch(err => {
            this.$message({
              message: err.message,
              type: 'danger'
            })
          })
        } else {
          addBussParamConfig(data).then(res => {
            this.editVisible = false
            this.bussParamConfigList(1, this.pagination.pageSize)
            this.$message({
              message: res.message,
              type: 'success'
            })
          }).catch(err => {
            this.$message({
              message: err.message,
              type: 'danger'
            })
          })
        }
      } else {
        this.isEmpty = true
      }
    },
    // 弹出框数据 -- 重置
    popupReset () {
      this.editForm = {
        paramCode: '',
        paramName: '',
        paramValue: '',
        remark: ''
      }
      this.isEmpty = false
    },
    // 数据处理
    dataBind (params) {
      this.editForm.paramId = params.paramId
      this.editForm.paramCode = params.paramCode
      this.editForm.paramName = params.paramName
      this.editForm.paramValue = params.paramValue
      this.editForm.remark = params.remark
    }
  }
}
</script>

<style scoped lang="scss">
</style>
