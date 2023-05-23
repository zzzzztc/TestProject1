<template>
  <!--<div>地铁订单管路</div>-->
  <div id="SubwayOrder" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="订单号" v-model="filter.batchOrderNo" @keydown.enter.native="getOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="机票号" v-model="filter.eticketno" @keydown.enter.native="getOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.useDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="使用开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.useDateEnd"
            class="w-180"
            type="date"
            value-format="yyyy-MM-dd"
            size="medium"
            placeholder="使用截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.applyDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="退票开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.applyDateEnd"
            class="w-180"
            type="date"
            value-format="yyyy-MM-dd"
            size="medium"
            placeholder="退票截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.transStatus" placeholder="地铁票状态" clearable>
            <el-option label='未出票' value="0"></el-option>
            <el-option label="购票成功" value="001"></el-option>
            <el-option label="已使用" value="002"></el-option>
            <el-option label="退票申请" value="M01"></el-option>
            <el-option label="退票完成" value="M02"></el-option>
            <el-option label="退票异常" value="M03"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="渠道" v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getOrderList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="orderList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" min-width="100"></el-table-column>-->
          <el-table-column label="订单号" prop="batchOrderNo" min-width="140"></el-table-column>
          <el-table-column label="渠道" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.channel | channelMap }}
            </template>
          </el-table-column>
          <el-table-column label="乘车人姓名" prop="pname" min-width="100"></el-table-column>
          <el-table-column label="证件号" prop="idnumber" min-width="160"></el-table-column>
          <el-table-column label="联系方式" prop="checkedMobile" min-width="100"></el-table-column>
          <el-table-column label="票号" prop="eticketno" min-width="120"></el-table-column>
          <el-table-column label="机票航段" min-width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.afrom }}-{{scope.row.ato}}</div>
            </template>
          </el-table-column>
          <el-table-column label="地铁票行程" min-width="140">
            <template slot-scope="scope">
              <div>{{ scope.row.startStationName }} - {{ scope.row.endStationName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="购票时间" prop="createDate" min-width="140"></el-table-column>
          <el-table-column label="使用时间" prop="checkedDate" min-width="120"></el-table-column>
          <el-table-column label="退票时间" prop="applyDate" min-width="120"></el-table-column>
          <el-table-column label="地铁票车费" prop="payAmount" min-width="100">
            <template slot-scope="scope">
              {{scope.row.payAmount | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="地铁票状态" min-width="100">
            <template slot-scope="scope">
              <div>{{ scope.row.transStatus | transStatusMap }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <span class="active-text mr-5" v-show="scope.row.transStatus === '001'" @click="modifyDate(scope.row)">改期</span>
              <span class="danger-text" v-show="scope.row.transStatus === '001'" @click="refundConfirm(scope.row)">退票</span>
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
        :total="orderList.total">
      </el-pagination>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="400px">
      <div class="pl-20">
        <div class="pb-10">请选择改期日期</div>
        <el-date-picker
          v-model="date"
          class="w-180"
          type="date"
          value-format="yyyy-MM-dd"
          size="medium"
          placeholder="改期日期">
        </el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyDatehandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, refundHandle, airRailwayTicketModifyExpireDate } from './api'
import { mapState } from 'vuex'
import { getChannelList } from '../../../utils'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'SubwayOrder',
  data () {
    return {
      filter: {
      },
      date: '',
      loading: false,
      dialogVisible: false,
      currentOrder: null,
      orderList: {},
      dataViewHeight: null
    }
  },
  created () {
    this.judgeChannelList()
    this.getOrderList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  methods: {
    // 重置操作
    resetFilter () {
      this.filter = {}
      this.getOrderList(1, this.pagination.pageSize)
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 获取列表数据
    getOrderList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.filter.orderType = 1
      fetchList(this.filter).then(res => {
        this.loading = false
        this.orderList = res
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    handleSizeChange (page) {
      this.getOrderList(null, page)
    },
    // 分页操作
    handleCurrentChange (page) {
      this.getOrderList(page, null)
    },
    // 退票操作
    refundConfirm (param) {
      this.currentOrder = param
      this.$confirm('是否确认退票？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.refund()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    refund () {
      this.loading = true
      refundHandle({ airId: this.currentOrder.airId }).then(() => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '提交申请成功'
        })
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    modifyDate (param) {
      this.dialogVisible = true
      this.currentOrder = param
    },
    modifyDatehandle () {
      if (this.date) {
        this.loading = true
        airRailwayTicketModifyExpireDate({ airId: this.currentOrder.airId, expireDate: this.date }).then(res => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '改期成功'
          })
          this.dialogVisible = false
        }).catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
      } else {
        this.$message({
          message: '请选择改期日期',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped></style>
