<template>
  <div id="InstallmentsManage" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="支付方式代码" clearable v-model="filter.payCode" @keydown.enter.native="queryPayInstallmentRateList()"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="queryPayInstallmentRateList()">查询</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" @click="switchDialog(0)">新增</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="installmentRateList.rows"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :height="dataViewHeight"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="支付方式代码" prop="payCode"></el-table-column>
          <el-table-column label="分期数" prop="rateNum"></el-table-column>
          <el-table-column label="费率" prop="rate"></el-table-column>
          <el-table-column label="序号" prop="rateSort"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="active-text" @click="switchDialog(1, scope.row)">编辑</span>
              <span class="danger-text ml-5" @click="switchConfirm(scope.row.rateId)">删除</span>
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
        :total="installmentRateList.total">
      </el-pagination>
    </div>
    <div>
      <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="360px">
        <div class="dialog-container" v-loading="dialogLoading">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">支付方式</div>
                <div class="ipt-medium">
                  <el-input size="medium" v-model="rateInfo.payCode"></el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">分期数</div>
                <div class="ipt-medium">
                  <el-input size="medium" v-model="rateInfo.rateNum"></el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">费率</div>
                <div class="ipt-medium">
                  <el-input size="medium" v-model="rateInfo.rate"></el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">序号</div>
                <div class="ipt-medium">
                  <el-input size="medium" v-model="rateInfo.rateSort"></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="paramJudge">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fetchList, create, modify, deleteRate } from './api'
import { mapState } from 'vuex'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'InstallmentsManage',
  data () {
    return {
      filter: {},
      loading: false,
      installmentRateList: {},
      dataViewHeight: null,
      dialogVisible: false,
      dialogTitle: '',
      currentRow: {},
      rateInfo: {
        rate: null,
        rateNum: null,
        payCode: '',
        rateSort: ''
      },
      formErr: false,
      dialogLoading: false
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      orderType: state => state.app.orderType
    })
  },
  mixins: [ computWidth ],
  created () {
    this.queryPayInstallmentRateList(1, this.pagination.pageSize)
  },
  methods: {
    // 查询列表
    queryPayInstallmentRateList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.loading = false
        this.installmentRateList = res
      }).catch(err => {
        this.loading = false
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    // 分页
    handleSizeChange (pages) {
      this.queryPayInstallmentRateList(null, pages)
    },
    handleCurrentChange (page) {
      this.queryPayInstallmentRateList(page, null)
    },
    switchDialog (type, row) {
      this.dialogVisible = true
      this.currentRow = row
      if (type) {
        this.dialogTitle = '编辑'
        this.formErr = false
        this.rateInfo.rate = row.rate
        this.rateInfo.payCode = row.payCode
        this.rateInfo.rateNum = row.rateNum
        this.rateInfo.rateSort = row.rateSort
      } else {
        this.dialogTitle = '新增'
        this.rateInfo.rate = null
        this.rateInfo.payCode = null
        this.rateInfo.rateSort = null
        this.rateInfo.rateNum = null
      }
    },
    // 参数校验
    paramJudge () {
      if (this.rateInfo.rate && this.rateInfo.rateNum && this.rateInfo.payCode && this.rateInfo.rateSort) {
        // 校验通过
        if (this.dialogTitle === '新增') {
          this.createRate()
        } else {
          this.modifyRate()
        }
      } else {
        this.formErr = true
      }
    },
    // 新增
    createRate () {
      this.dialogLoading = true
      create(this.rateInfo).then(res => {
        this.$message({
          type: 'success',
          message: '新增成功'
        })
        this.dialogVisible = false
        this.dialogLoading = false
        this.queryPayInstallmentRateList()
      }).catch(err => {
        this.$message.error(err.message)
        this.dialogLoading = false
      })
    },
    // 编辑
    modifyRate () {
      let data = Object.assign(this.rateInfo, { rateId: this.currentRow.rateId })
      this.dialogLoading = true
      modify(data).then(res => {
        this.$message({
          type: 'success',
          message: '编辑成功'
        })
        this.dialogVisible = false
        this.dialogLoading = false
        this.queryPayInstallmentRateList()
      }).catch(err => {
        this.$message.error(err.message)
        this.dialogLoading = false
      })
    },
    switchConfirm (id) {
      this.$confirm('是否确认删除 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.handleDeleteRate(id)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    handleDeleteRate (id) {
      this.loading = true
      deleteRate({ ids: id }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.queryPayInstallmentRateList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
