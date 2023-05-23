<template>
  <!--<div>全渠道升舱退票管理</div>-->
  <div id="RefundManage" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单号" v-model="filter.ordercode" clearable @keydown.enter.native="getRefundManageList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="票号" v-model="filter.eticketno" clearable @keydown.enter.native="getRefundManageList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.creadateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="订单开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.creadateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="订单截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="状态" clearable v-model="filter.upgradStatus">
            <el-option label="升舱失败" value="0"></el-option>
            <el-option label="已升舱" value="1"></el-option>
            <el-option label="已退款" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getRefundManageList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="refundManageList.total === 0" @click="exportPayDetail">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="refundManageList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column label="订单号" prop="ordercode" min-width="160"></el-table-column>
          <el-table-column label="票号" prop="eticketno" min-width="140"></el-table-column>
          <el-table-column label="支付金额" prop="paymoney" min-width="100"></el-table-column>
          <el-table-column label="旅客姓名" prop="pname" min-width="100"></el-table-column>
          <el-table-column label="证件号" prop="idnumber" min-width="180"></el-table-column>
          <el-table-column label="订单时间" prop="orderDateTime" min-width="160"></el-table-column>
          <el-table-column label="订单状态" min-width="100">
            <template slot-scope="scope">
              <span v-show="scope.row.upgradStatus === '0' || scope.row.upgradStatus === ''">升舱失败</span>
              <span v-show="scope.row.upgradStatus === '1'">已升舱</span>
              <span v-show="scope.row.upgradStatus === '2'">已退款</span>
            </template>
          </el-table-column>
          <el-table-column label="失败原因" min-width="160">
            <template slot-scope="scope">
              <span>{{scope.row.afrom}}</span>
              --
              <span>{{scope.row.ato}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.upgradStatus === '' || scope.row.upgradStatus === '0'">
                <span class="active-text inl-block mr-5"  @click="confirmHandle(scope.row)">升舱</span>
                <span class="active-text inl-block mr-5" @click="switchDialog(scope.row)">退款</span>
              </div>
              <div v-else>--</div>
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
        :total="refundManageList.total">
       </el-pagination>
    </div>
    <!--查看详情弹出框-->
<!--    <RefundDiaLog ref="refundAby" :refundAuditList="refundAuditList" @tableList="getRefundManageList"></RefundDiaLog>-->
    <!--订单信息弹出框-->
<!--    <OrderDetail ref="orderAby" :orderDetilList="orderDetilList" @tableList="getRefundManageList"></OrderDetail>-->
    <div>
      <el-dialog title="退款" :visible.sync="dialogVisible" width="320px">
        <div class="dialog-container">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">自愿/非自愿</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="自愿非自愿" v-model="refundApplyInfo.nature">
                    <el-option label="非自愿" value="0"></el-option>
                    <el-option label="自愿" value="1"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">退票原因</div>
                <div class="ipt-medium">
                  <el-input type="textarea" :rows="4" placeholder="退票原因" v-model="refundApplyInfo.reason" clearable></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="handleRefund()">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { excelList, getRouteName } from '../../../utils'
import { fetchList, updateUpgradStatus, upgradApplyRefundByhand } from './api'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'RefundManage',
  data () {
    return {
      refundApplyInfo: {
        nature: '1'
      },
      dialogVisible: false,
      loading: false,
      applyDate: [],
      filter: {},
      dataViewHeight: null,
      refundManageList: {},
      currentData: {}
    }
  },
  components: {},
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  created () {
    this.getRefundManageList()
  },
  mixins: [computWidth],
  methods: {
    exportPayDetail () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = '/refund/exportMetticketUpgradFailInfo'
      let name = getRouteName('/refundManage')
      data.start = 1
      data.end = this.refundManageList.total
      delete data.page
      delete data.rows
      let type = 'xls'
      let obj = {
        data,
        url,
        name,
        type
      }
      excelList(obj, this)
    },
    // 获取数据
    getRefundManageList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.loading = false
        this.refundManageList = res
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {}
      this.getRefundManageList(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getRefundManageList(null, pages)
    },
    handleCurrentChange (page) {
      this.getRefundManageList(page, null)
    },
    // 确认处理
    confirmHandle (param) {
      this.currentData = param
      this.$confirm('是否确认升舱？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.handleUpgrad()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    // 升舱
    handleUpgrad () {
      updateUpgradStatus({ ticketid: this.currentData.ticketid }).then(() => {
        this.$message.success('操作成功')
        this.getRefundManageList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 切换弹框
    switchDialog (param) {
      this.currentData = param
      this.dialogVisible = true
    },
    // 退款操作
    handleRefund () {
      this.refundApplyInfo.userid = this.currentData.userid
      this.refundApplyInfo.ticketid = this.currentData.ticketid
      upgradApplyRefundByhand(this.refundApplyInfo).then(() => {
        this.dialogVisible = false
        this.getRefundManageList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .hd {
    width: 75px;
  }
</style>
