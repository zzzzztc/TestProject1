<template>
  <div id="TravelMailRecycle" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="订单号" v-model="filter.ordercode" @keydown.enter.native="initData()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="机票号" v-model="filter.eticketno" @keydown.enter.native="initData()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="行程单是否需回收" clearable v-model="filter.isprint">
            <el-option label="否" value="2"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="searchList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" :disabled="!dataArr.length" @click="updateValidFlag">行程单状态更新</el-button>
        <el-button size="medium" type="danger" :disabled="!dataArr.length" @click="batchinvalidConfirm">批量确认作废</el-button>
      </div>
      <div v-if="isColumn" class="search-container clearfix flex">
        <div class="check-ipt">
          <el-checkbox @change="checkHanler" v-model="checkedAll" :indeterminate="isIndeterminate">全选</el-checkbox>
        </div>
        <div>
          <div class="check-item check-ipt" v-for="item in checkList" :key="item.key">
            <el-checkbox-group v-model="checked" @change="handleCheck">
              <el-checkbox  :label="item.key" :key="item.key" @change="handleoneCheck(item.key)">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="column-btn" @click="switchColumn">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="travelPostList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          @selection-change='handleSelectionChange'
          :cell-style="tableAttributes.cellStyle">
          <el-table-column type="selection"></el-table-column>
          <el-table-column key="1" v-if="tableList.orderdate" label="订单日期" prop="orderdate" min-width="160"></el-table-column>
          <el-table-column key="2" v-if="tableList.ordercode" label="订单号" prop="ordercode" min-width="160"></el-table-column>
          <el-table-column key="3" v-if="tableList.pnr" label="PNR" prop="pnr" min-width="100"></el-table-column>
          <el-table-column key="4" v-if="tableList.airways" label="市场方" prop="airways" min-width="90"></el-table-column>
          <el-table-column key="5" v-if="tableList.airline" label="承运方" prop="airline" min-width="90"></el-table-column>
          <el-table-column key="6" v-if="tableList.channel" label="渠道类型" min-width="120">
            <template slot-scope="scope">
              {{scope.row.channel | channelMap}}
            </template>
          </el-table-column>
          <el-table-column key="7" v-if="tableList.sail" label="航段" prop="sail" min-width="100"></el-table-column>
          <el-table-column key="8" v-if="tableList.initialTktNo" label="旧票号" prop="initialTktNo" min-width="160"></el-table-column>
          <el-table-column key="9" v-if="tableList.eticketno" label="票号" prop="eticketno" min-width="160"></el-table-column>
          <el-table-column key="10" v-if="tableList.name" label="旅客姓名" prop="name" min-width="90"></el-table-column>
          <el-table-column key="11" v-if="tableList.fnumber" label="航班号" prop="fnumber" min-width="90"></el-table-column>
          <el-table-column key="12" v-if="tableList.unexoInsr" label="航意险" prop="unexoInsr" min-width="90">
            <template slot-scope="scope">
              {{scope.row.unexoInsr | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column key="13" v-if="tableList.delayInsr" label="航延险" prop="delayInsr" min-width="90">
            <template slot-scope="scope">
              {{scope.row.delayInsr | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column key="14" v-if="tableList.paymoney" label="支付金额" prop="paymoney" min-width="90">
            <template slot-scope="scope">
              {{scope.row.paymoney | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column key="15" v-if="tableList.integralFare" label="支付积分" prop="integralFare" min-width="90"></el-table-column>
          <el-table-column key="16" v-if="tableList.paybillno" label="银行订单号" prop="paybillno" min-width="180"></el-table-column>
          <el-table-column key="17" v-if="tableList.refundNo" label="退票单号" prop="refundNo" min-width="160"></el-table-column>
          <el-table-column key="18" v-if="tableList.nature" label="退票性质" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.nature === '0'">非自愿</span>
              <span v-else>自愿</span>
            </template>
          </el-table-column>
          <el-table-column key="19" v-if="tableList.status" label="退票状态" min-width="100">
            <template slot-scope="scope">
              {{scope.row.status | refundStatusMap}}
            </template>
          </el-table-column>
          <el-table-column key="20" v-if="tableList.isinter" label="国内/国际" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.isinter === '0'">国内</span>
              <span v-else>国际</span>
            </template>
          </el-table-column>
          <el-table-column key="21" v-if="tableList.opAccount" label="审核人" prop="opAccount" min-width="120"></el-table-column>
          <el-table-column key="22" v-if="tableList.happendate" label="申请退票时间" prop="happendate" min-width="160"></el-table-column>
          <el-table-column key="23" v-if="tableList.isprint" label="行程单是否需回收" prop="isprint" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.isprint === '2'">否</span>
              <span v-if="scope.row.isprint === '1'">是</span>
            </template>
          </el-table-column>
          <el-table-column key="24" v-if="tableList.invalidFlag" label="行程单状态" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.invalidFlag === '1'">未作废</div>
              <div v-else-if="scope.row.invalidFlag === '2'">已作废</div>
            </template>
          </el-table-column>
          <el-table-column key="26" label="疫情隔离险" prop="epidemicInsr" v-if="tableList.epidemicInsr" min-width="140"></el-table-column>
          <el-table-column key="27" label="航空退票险" v-if="tableList.refundTicketInsr" prop="refundTicketInsr" min-width="140"></el-table-column>
          <el-table-column key="25" label="操作" min-width="80" v-if="checked.length">
            <template slot-scope="scope">
              <span v-if="scope.row.isprint === '1'" class="active-text mr-5" @click="voids(scope.row)">确认作废</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="filter.page"
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="travelPostList.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { queryAchangeList, confirmPrint, updateStatus, batchUpdate } from './api'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'TravelMailRecycle',
  data () {
    return {
      dataArr: [],
      componentName: 'travelMailRecycle',
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        invalidFlag: true,
        orderdate: true,
        ordercode: false,
        pnr: true,
        airways: false,
        airline: false,
        channel: true,
        sail: false,
        initialTktNo: false,
        eticketno: true,
        name: true,
        fnumber: false,
        unexoInsr: false,
        delayInsr: false,
        paymoney: false,
        integralFare: false,
        paybillno: false,
        refundNo: false,
        nature: true,
        status: true,
        isinter: false,
        opAccount: false,
        happendate: false,
        isprint: false,
	      epidemicInsr: false,
	      refundTicketInsr: false
      },
      dataViewHeight: null,
      filter: {
        eticketno: '',
        isprint: '1',
        page: 1
      },
      travelPostList: {},
      loading: false
    }
  },
  created () {
    this.initData(1, this.pagination.pageSize)
    // this.locCheck()
  },
  mixins: [checkAttrs, computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    // 行程单状态更新
    updateValidFlag () {
      let ids = this.dataArr.map(item => {
        return item.id
      }).join(',')
      this.loading = true
      updateStatus({ ids: ids }).then(() => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        this.initData(this.filter.page, this.filter.rows)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    handleSelectionChange (val) {
      this.dataArr = val
    },
    // 批量作废
    batchinvalidConfirm () {
      this.$confirm(`是否确认批量作废？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.batchInvalidApi()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    // 批量作废
    batchInvalidApi () {
      let ids = this.dataArr.map(item => {
        return item.id
      }).join(',')
      this.loading = true
      batchUpdate({ ids: ids }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.updateValidFlag()
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    voids (row) {
      this.dataArr = [row]
      this.$confirm('是否确认作废 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.voidsPrint(row.id)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    voidsPrint (ids) {
      confirmPrint({ id: ids }).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.updateValidFlag()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    handleSizeChange (pages) {
      this.initData(null, pages)
    },
    handleCurrentChange (page) {
      this.initData(page, null)
    },
    resetFilter () {
      this.filter.eticketno = ''
      this.filter.isprint = '1'
      this.filter.ordercode = ''
      this.initData(1, this.pagination.pageSize)
    },
    searchList () {
      this.initData(1, this.pagination.pageSize)
    },
    initData (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      let filters = JSON.parse(JSON.stringify(this.filter))
      if (!filters.isprint) {
        filters.isprint = '-1'
      }
      queryAchangeList(filters).then(res => {
        this.travelPostList = res
        this.loading = false
      }).catch(err => {
        this.$message.error(err.message)
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
