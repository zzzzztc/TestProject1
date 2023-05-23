<template>
  <div class="container">
    <!--<h1>版本升级记录</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input v-model="searchForm.outerCode" clearable placeholder="版本号" size="medium" @keydown.enter.native="versionList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="searchForm.updateType" clearable placeholder="请选择状态" size="medium">
            <el-option key="0" label="升级提醒" value="0"></el-option>
            <el-option key="1" label="必须升级" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="versionList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
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
          <el-table-column label="版本号" prop="outerCode"></el-table-column>
          <el-table-column label="升级提示" prop="updateInfo"></el-table-column>
          <el-table-column label="升级路径" prop="dlAddress"></el-table-column>
          <el-table-column label="状态" prop="updateType">
            <template slot-scope="scope">
              <div v-if="scope.row.updateType === '0'">升级提醒</div>
              <div v-if="scope.row.updateType === '1'">必须升级</div>
            </template>
          </el-table-column>
          <el-table-column label="适用设备" prop="source"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100">
          <template slot-scope="scope">
            <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
            <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.versionId)">删除</span>
            <!--<i class="table-icon delete-icon" title="删除" @click="handleDelete(scope.row.versionId)"></i>-->
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
              <div class="label required">版本号</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="版本号" v-model="editForm.outerCode" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.outerCode">版本号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">状态</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.updateType" placeholder="请选择状态" size="medium">
                  <el-option key="0" label="升级提醒" value="0"></el-option>
                  <el-option key="1" label="必须升级" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.updateType">状态选择不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">升级路径</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="3" clearable placeholder="升级路径" v-model="editForm.dlAddress" size="medium"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">升级提示</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="3" clearable placeholder="升级提示" v-model="editForm.updateInfo" size="medium"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">适用设备</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.source" placeholder="请选择适用设备" size="medium">
                  <el-option key="0" label="android" value="android"></el-option>
                  <el-option key="1" label="iOS" value="iOS"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.source">适用设备选择不可为空</div>
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
import { mapState } from 'vuex'
import { queryVersionList, addVersion, updateVersion, deleteVersion } from './api'
import { computeTableHeight } from '../../../utils/index'
export default {
  name: 'VersionUpgrade',
  data () {
    return {
      searchForm: {
        outerCode: '', // 版本号
        updateType: '' // 状态
      }, // 搜索框数据
      editForm: {
        versionId: '',
        outerCode: '', // 版本号
        updateInfo: '', // 升级提示
        dlAddress: '', // 升级路径
        updateType: '', // 状态
        source: '' // 适用设备
      }, // 添加/修改数据
      tableList: [], // 展示表格数据
      multipleSelection: [], // 选中的表单数据
      dataViewHeight: null, // 表格高度
      editVisible: false, // 弹出框显示隐藏
      isReset: false, // 切换添加/修改
      isEmpty: false, // 输入框判空
      loading: false, // 加载
      popupTitle: '' // 弹出框标题
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.versionList(1, this.pagination.pageSize)
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
      this.versionList(null, pages)
    },
    handleCurrentChange (page) {
      this.versionList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    versionList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      queryVersionList(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 搜素框 -- 重置
    handleReset () {
      this.searchForm = {}
      this.versionList(1, this.pagination.pageSize)
    },
    // 添加/修改弹出框 -- 显示
    handleEdit (params) {
      this.editVisible = true
      this.isReset = false
      if (params) {
        this.popupTitle = '修改'
        this.isReset = false
        this.dataBind(params)
      } else {
        this.popupTitle = '添加'
        this.resetEdit()
        this.isReset = true
      }
    },
    // 弹出框数据 -- 保存
    saveEdit () {
      if (this.editForm.outerCode && this.editForm.updateType && this.editForm.source) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        if (this.isReset === false) {
          updateVersion(data).then(res => {
            this.editVisible = false
            this.versionList()
            this.$message.success(res.message)
          }).catch(err => {
            this.$message.error(err.message)
          })
        } else {
          addVersion(data).then(res => {
            this.editVisible = false
            this.versionList()
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
      this.editForm = {
        versionId: '',
        outerCode: '',
        updateInfo: '',
        dlAddress: '',
        updateType: '',
        source: ''
      }
      this.isEmpty = false
    },
    // 删除
    handleDelete (id) {
      let ids = ''
      if (id) {
        ids = id
      } else {
        for (let item of this.multipleSelection) {
          ids += item.versionId + ','
        }
        ids = ids.substring(0, ids.length - 1)
      }
      this.$confirm('是否确认删除 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteVersion({ ids: ids }).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.versionList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 数据处理
    dataBind (params) {
      this.editForm.versionId = params.versionId
      this.editForm.outerCode = params.outerCode
      this.editForm.updateInfo = params.updateInfo
      this.editForm.dlAddress = params.dlAddress
      this.editForm.updateType = params.updateType
      this.editForm.source = params.source
    }
  }
}
</script>

<style scoped lang="scss">
</style>
