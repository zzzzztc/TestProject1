<template>
  <div>
    <el-dialog v-dialogDrag title="添加" :visible.sync="addDetailVisible" width="80%">
      <div class="dialog-container">
        <div class="dialog-header" ref="header">
          <div class="search-container clearfix">
            <div class="search-item search-ipt">
              <el-input size="medium" v-model="ticketNo" placeholder="票号" clearable @keydown.enter.native="getInvoiceDetail()"></el-input>
            </div>
            <div class="search-item">
              <el-button size="medium" type="primary" @click="getInvoiceDetail()">查询</el-button>
              <el-button size="medium" @click="resetFilter()">重置</el-button>
            </div>
          </div>
        </div>
        <div class="dialog-main" style="padding: 0">
          <div class="table-container">
            <el-table
              :cell-style= "tableAttributes.cellStyle"
              :stripe="tableAttributes.stripe"
              :border="tableAttributes.border"
              :data="detailList"
              @selection-change="handleSelectionChange"
              :height="dataViewHeight"
              v-loading="loading">
              <el-table-column type="selection" :width="tableAttributes.selectionWidth"></el-table-column>
              <el-table-column label="票号" prop="ticketNo" min-width="100"></el-table-column>
              <el-table-column label="手机号" prop="mobile" min-width="120"></el-table-column>
              <el-table-column label="出发城市" prop="fromCity" min-width="120"></el-table-column>
              <el-table-column label="达到城市" prop="arriveCity" min-width="120"></el-table-column>
              <el-table-column label="航司二字码" prop="airways" min-width="100"></el-table-column>
              <el-table-column label="航班号" prop="flyNumber" min-width="100"></el-table-column>
              <el-table-column label="航班日期" prop="flyDate" min-width="120"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="handleAdd">添加</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { filterIds } from '../../../../utils/index'
import { queryInvoiceDetail, queryInvoiceImport } from './api'

export default {
  name: 'addDetailDiaLog',
  data () {
    return {
      loading: false,
      dataViewHeight: null,
      multipleSelection: [],
      addDetailVisible: false, // 添加弹出框 -- 显示隐藏
      ticketNo: '', // 查询条件
      detailList: []
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    initComponent () {
      this.addDetailVisible = true
      this.resetFilter()
    },
    // 表格 -- 选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表单数据
    getInvoiceDetail () {
      if (this.ticketNo) {
        this.loading = true
        queryInvoiceDetail(this.ticketNo).then(res => {
          this.loading = false
          this.detailList = res.data
        }).catch(err => {
          this.loading = false
          this.$message.error(err.data || err.message)
        })
      } else {
        this.$message.error('查询条件不可为空')
      }
    },
    // 查询条件 -- 重置
    resetFilter () {
      this.ticketNo = ''
      this.detailList = []
    },
    // 添加提交
    handleAdd () {
      let ids = filterIds(this.multipleSelection, 'ticketId')
      let param = {
        isJson: true,
        arr: JSON.stringify(ids)
      }
      this.loading = true
      queryInvoiceImport(this.ticketNo, param).then(res => {
        this.loading = false
        this.addDetailVisible = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.data || err.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
