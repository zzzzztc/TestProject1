<template>
  <div class="container">
    <!--<h1>婴儿姓氏维护</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
            <el-input v-model="searchForm.nameCn" clearable placeholder="中文名" size="medium" @keydown.enter.native="surnameList()"></el-input>
        </div>
        <div class="search-item search-ipt">
            <el-input v-model="searchForm.nameEn" clearable placeholder="英文名" size="medium" @keydown.enter.native="surnameList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="surnameList(null, null)">查询</el-button>
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
          <el-table-column label="中文名" prop="nameCn"></el-table-column>
          <el-table-column label="英文名" prop="nameEn"></el-table-column>
          <el-table-column label="创建时间" prop="createDate"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.nameId)">删除</span>
              <!--<i class="table-icon delete-icon" title="删除" @click="handleDelete(scope.row.nameId)"></i>-->
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
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="320px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">中文名</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="中文名" v-model="editForm.nameCn" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.nameCn">中文名不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">英文名</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="英文名" v-model="editForm.nameEn" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.nameEn">英文名不可为空</div>
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
import { querySurnameList, addSurname, updateCabinName, deleteSurname } from './api'
import { computeTableHeight } from '../../../utils/index'
export default {
  name: 'Surname',
  data () {
    return {
      searchForm: {
        nameCn: '', // 中文名
        nameEn: '' // 英文名
      }, // 搜索框数据
      editForm: {
        nameCn: '', // 中文名
        nameEn: '' // 英文名
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
    this.surnameList(1, this.pagination.pageSize)
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
      this.surnameList(null, pages)
    },
    handleCurrentChange (page) {
      this.surnameList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    surnameList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      querySurnameList(this.searchForm).then(res => {
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
      this.surnameList(1, this.pagination.pageSize)
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
        this.resetEdit()
        this.isReset = true
      }
    },
    // 弹出框数据 -- 保存
    saveEdit () {
      if (this.editForm.nameCn && this.editForm.nameEn) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        if (this.isReset === false) {
          updateCabinName(data).then(res => {
            this.editVisible = false
            this.surnameList()
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
          addSurname(data).then(res => {
            this.editVisible = false
            this.surnameList()
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
    resetEdit () {
      this.editForm = {
        nameCn: '',
        nameEn: '',
        channel: []
      }
      this.isEmpty = false
    },
    // 删除
    handleDelete (id) {
      let nameIds = ''
      if (id) {
        nameIds = id
      } else {
        for (let item of this.multipleSelection) {
          nameIds += item.nameId + ','
        }
        nameIds = nameIds.substring(0, nameIds.length - 1)
      }
      this.$confirm('是否确认删除 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteSurname({ nameIds: nameIds }).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.surnameList()
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
      this.editForm.nameId = params.nameId
      this.editForm.nameCn = params.nameCn
      this.editForm.nameEn = params.nameEn
    }
  }
}
</script>

<style scoped lang="scss">
</style>
