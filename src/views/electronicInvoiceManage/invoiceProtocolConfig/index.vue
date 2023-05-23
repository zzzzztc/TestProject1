<template>
  <!--<div>发票管理</div>-->
  <div id="InvoiceManage" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" v-model="filter.protocolCode" placeholder="编号" clearable @keydown.enter.native="getList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" v-model="filter.protocolName" placeholder="名称" clearable @keydown.enter.native="getList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" v-model="filter.protocolContent" placeholder="内容" clearable @keydown.enter.native="getList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" v-model="filter.protocolTag" placeholder="标签" clearable @keydown.enter.native="getList()"></el-input>
        </div>
        <!--<div class="search-item search-ipt">
          <el-input size="medium" v-model="filter.protocolNumber" placeholder="数量" clearable @keydown.enter.native="getList()"></el-input>
        </div>-->
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(null)">添加</el-button>
        <!--<el-button size="medium" :disabled="!multipleSelection.length" @click="handleExport(2)">删除</el-button>-->
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="recordList.contents"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="编号" prop="protocolCode" min-width="80" />
          <el-table-column label="名称" prop="protocolName" min-width="120" />
          <el-table-column label="内容" prop="protocolContent" min-width="120" />
          <!--<el-table-column label="发票最低数量" prop="protocolNumber" min-width="80" />-->
          <el-table-column label="标签" prop="protocolTag" min-width="80" />
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="修改" @click="handleEdit(scope.row)">修改</span>
              <span class="active-text mr-5" title="删除" @click="handleDelete(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="clearfix">
        <div class="fl">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filter.page"
            :page-sizes="pagination.pageSizes"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="recordList.totalRows">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--添加/修改 -- 弹出框-->
    <el-dialog v-dialogDrag :title="editTitle" :visible.sync="editVisible" width="560px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">编号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="编号" v-model="editForm.protocolCode" clearable></el-input>
                <div class="danger-text" v-if="isEmpty && !editForm.protocolCode">编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="名称" v-model="editForm.protocolName" clearable></el-input>
                <div class="danger-text" v-if="isEmpty && !editForm.protocolName">名称不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">内容</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="内容" v-model="editForm.protocolContent" clearable></el-input>
                <div class="danger-text" v-if="isEmpty && !editForm.protocolContent">内容不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">标签</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="标签" v-model="editForm.protocolTag" clearable></el-input>
                <div class="danger-text" v-if="isEmpty && !editForm.protocolTag">标签不可为空</div>
              </div>
            </div>
            <!--<div class="column">
              <div class="label required">发票最低数量</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="发票最低数量" v-model="editForm.protocolNumber" clearable></el-input>
                <div class="danger-text" v-if="isEmpty && !editForm.protocolNumber">发票最低数量不可为空</div>
              </div>
            </div>-->
          </div>
        </div>
        <div class="dialog-footer">
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
import { list, addConfig, updateConfig, deleteConfig } from './api'

export default {
  name: 'InvoiceProtocolConfig',
  data () {
    return {
      loading: false, // 加载
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      filter: {
        protocolCode: '', // 协议编号
        protocolName: '', // 协议名称
        protocolContent: '', // 协议内容
        protocolTag: '', // 协议标签
        protocolNumber: '', // 发票数量
        page: '', // 页码
        rows: '' // 页码大小
      }, // 查询条件数据表单
      recordList: {}, // 查询结果数据表单
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      editTitle: '添加', // 添加/修改弹出框 -- 标题
      isEmpty: false, // 添加/修改弹出框 -- 判空
      editForm: {} // 添加/修改出框 -- 展示数据
    }
  },
  created () {
    this.getList(1, this.pagination.pageSize)
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
      this.getList(null, pages)
    },
    handleCurrentChange (page) {
      this.getList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    getList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      let data = JSON.parse(JSON.stringify(this.filter))
      data.pageNum = data.page
      data.pageSize = data.rows
      delete data.page
      delete data.rows
      delete data.protocolTag
      list(data).then(res => {
        this.recordList = res.data
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.data || err.message)
      })
    },
    // 查询条件 -- 重置
    resetFilter () {
      this.filter = {}
      this.getList()
    },
    // 添加/修改 -- 弹出框
    handleEdit (param) {
      this.resetEdit()
      this.editVisible = true
      if (param) {
        this.editTitle = '修改'
        this.editForm = JSON.parse(JSON.stringify(param))
      }
    },
    // 添加/修改弹出框 -- 提交
    saveEdit () {
      if (
        this.editForm.protocolCode && this.editForm.protocolName &&
        this.editForm.protocolContent && this.editForm.protocolTag
      ) {
        if (this.editForm.protocolId) {
          this.updateParam(JSON.parse(JSON.stringify(this.editForm)))
        } else {
          this.editForm.protocolNumber = 0
          this.addParams(JSON.parse(JSON.stringify(this.editForm)))
        }
      } else {
        this.isEmpty = true
      }
    },
    // 新增 -- 接口调用
    addParams (data) {
      data.isJson = true
      addConfig(data).then(res => {
        this.editVisible = false
        this.getList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.data || err.message)
      })
    },
    // 修改 -- 接口调用
    updateParam (data) {
      data.isJson = true
      updateConfig(data).then(res => {
        this.editVisible = false
        this.getList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.data || err.message)
      })
    },
    // 添加/修改弹出框 -- 重置
    // 添加/修改弹出框 -- 重置
    resetEdit () {
      let protocolId = this.editForm.protocolId
      this.editForm = {}
      if (protocolId) this.editForm = { protocolId }
      this.isEmpty = false
    },
    // 删除 -- 确认框
    handleDelete (param) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonClass: '确定',
        cancelButtonClass: '取消',
        type: 'error'
      }).then(() => {
        this.deleteParam(JSON.parse(JSON.stringify(param)))
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 删除 -- 接口调用
    deleteParam (data) {
      deleteConfig(data).then(res => {
        this.getList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.data || err.message)
      })
    }
  }
}
</script>

<style scoped>
  a {
    color: #409EFF;
    text-decoration:none;
  }
</style>
