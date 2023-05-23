<template>
<!--  <div>全渠道退票管理</div>-->
  <div id="OmnichannelRefundManage" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="退单号" v-model="filter.refundNo" clearable @keydown.enter.native="getRefundManageList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.applyDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.applyDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请结束日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='filter.applyChannel' clearable placeholder="请选择退票申请渠道类型" size="medium">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="票号" v-model="filter.initialTicketNo" clearable @keydown.enter.native="getRefundManageList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder='国际/国内' clearable v-model="filter.upgradStatus">
            <el-option label="国内" value="0"></el-option>
            <el-option label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="姓名" v-model="filter.name" clearable @keydown.enter.native="getRefundManageList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="航班号" v-model="filter.fNumber" clearable @keydown.enter.native="getRefundManageList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="航段" v-model="filter.aFrom" style="width: 81px" @keydown.enter.native='getRefundManageList()'></el-input>
          <span class="lines"> - </span>
          <el-input size="medium" clearable placeholder="航段" v-model="filter.aTo" style="width: 81px" @keydown.enter.native='getRefundManageList()'></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="舱位" v-model="filter.seat" clearable @keydown.enter.native="getRefundManageList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="关联订单号" v-model="filter.orderCode" clearable @keydown.enter.native="getRefundManageList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="关联票号" v-model="filter.ticketNo" clearable @keydown.enter.native="getRefundManageList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder='票面处理状态' clearable v-model="filter.ticStatusRelation">
            <el-option label="全部" value="0"></el-option>
            <el-option label="待处理" value="1"></el-option>
            <el-option label="人工TSU" value="2"></el-option>
            <el-option label="自动TSU" value="3"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="操作人" v-model="filter.opAccount" clearable @keydown.enter.native="getRefundManageList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.opDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="操作开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.opDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="操作截止日期">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getRefundManageList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="!allRefundList.total" @click="handleExport">导出</el-button>
      </div>
      <div v-if="isColumn">
        <div class="search-container clearfix flex">
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
    </div>
    <div class="main">
      <div class="column-btn" @click="switchColumn">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="allRefundList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column key="1" label="退单号" v-if="tableList.refundNo" prop="refundNo" min-width="120"></el-table-column>
          <el-table-column key="2" label="退票申请日期" v-if="tableList.happendate" prop="happendate" min-width="120"></el-table-column>
          <el-table-column key="3" label="退票申请渠道" v-if="tableList.channel" prop="channel" min-width="140">
            <template slot-scope="scope">
              <span>{{scope.row.channel | channelMap}}</span>
            </template>
          </el-table-column>
          <el-table-column key="4" label="原票号" v-if="tableList.initialTktNo"  prop="initialTktNo" min-width="120"></el-table-column>
          <el-table-column key="5" label="国内/国际" v-if="tableList.isinter"  prop="isinter" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.isinter | isInnerMap}}</span>
            </template>
          </el-table-column>
          <el-table-column key="6" label="姓名" v-if="tableList.name" prop="name" min-width="100"></el-table-column>
          <el-table-column key="7" label="航班号" v-if="tableList.fnumber" prop="fnumber" min-width="80"></el-table-column>
          <el-table-column key="8" label="航段" v-if="tableList.afrom" prop="afrom" min-width="120">
            <template slot-scope="scope">
              {{scope.row.afrom}}-{{scope.row.ato}}
            </template>
          </el-table-column>
          <el-table-column key="9" label="舱位" v-if="tableList.seat" prop="seat" min-width="100"></el-table-column>
          <el-table-column key="10" label="关联订单号" v-if="tableList.ordercode" prop="ordercode" min-width="160">
            <template slot-scope="scope">
              <div class="active-text" @click="switchDialog(scope.row)">{{scope.row.ordercode}}</div>
            </template>
          </el-table-column>
          <el-table-column key="11" label="关联订单类型" v-if="tableList.isIntegral" prop="isIntegral" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.isIntegral === '0'">普通订单</span>
              <span v-if="scope.row.isIntegral === '1'">积分订单</span>
            </template>
          </el-table-column>
          <el-table-column key="12" label="关联票号" v-if="tableList.eticketno" prop="eticketno" min-width="160"></el-table-column>
          <el-table-column key="13" label="票面处理状态" v-if="tableList.ticStatusRelation" prop="ticStatusRelation" min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.ticStatusRelation | ticStatusRelationMap}}</span>
            </template>
          </el-table-column>
          <el-table-column key="14" label="操作人" v-if="tableList.opAccount" prop="opAccount" min-width="100"></el-table-column>
          <el-table-column key="15" label="操作时间" v-if="tableList.opDate" prop="opDate" min-width="160"></el-table-column>
          <el-table-column label="操作" min-width="100" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click="handleConfirm(scope.row.id)">确认处理</span>
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
            :total="allRefundList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--订单信息弹出框-->
    <OrderDetail ref="orderAby" :orderDetilList="orderDetilList" @tableList="getRefundManageList"></OrderDetail>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'
import OrderDetail from '../../../components/orderDetail'
import { getChannelList, excelList, getRouteName } from '../../../utils/index'
import { queryRefundManageList, comfirmTicStatusRelation } from './api'

export default {
  name: 'OmnichannelRefundManage',
  data () {
    return {
      loading: false, // 加载
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      dataViewHeight: null,
      componentName: 'OmnichannelRefundManage',
      multipleSelection: [], // 表格多选
      filter: {
        refundNo: '', // 退单号
        applyDateStart: '', // 申请开始日期
        applyDateEnd: '', // 申请结束日期
        applyChannel: '', // 退票申请渠道类型
        initialTicketNo: '', // 票号
        isinter: '', // 国际/国内
        name: '', // 姓名
        fNumber: '', // 航班号
        aFrom: '', // 航段 - 起始
        aTo: '', // 航段 - 到达
        seat: '', // 舱位
        channel: '', // 关联订单渠道类型
        orderCode: '', // 关联订单号
        ticketNo: '', // 关联票号
        ticStatusRelation: '', // 票面处理状态
        opAccount: '', // 操作人
        opDateStart: '', // 操作开始日期
        opDateEnd: '', // 操作截止日期
        page: 1,
        rows: 20
      }, // 查询条件表单
      allRefundList: {}, // 查询结果表单
      tableList: {
        refundNo: true,
        happendate: true,
        channel: true,
        initialTktNo: false,
        isinter: true,
        name: true,
        fnumber: true,
        afrom: true,
        ato: true,
        seat: true,
        ordercode: true,
        isIntegral: true,
        channel2: true,
        eticketno: true,
        ticStatusRelation: true,
        opAccount: false,
        opDate: false
      }, // 查询结果展示表单
      orderDetilList: {}
    }
  },
  created () {
    this.getChannelList()
    this.getRefundManageList(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  components: {
    OrderDetail
  },
  computed: {
    ...mapState({
      channelList: state => state.app.channelList, // 渠道
      tableAttributes: state => state.app.tableAttributes, // 表格
      pagination: state => state.app.pagination // 分页
    })
  },
  methods: {
    // channel没有则请求服务器
    getChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 分页导航
    handleSizeChange (pages) {
      this.getRefundManageList(null, pages)
    },
    handleCurrentChange (page) {
      this.getRefundManageList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    getRefundManageList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      queryRefundManageList(this.filter).then(res => {
        this.allRefundList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 查询条件重置
    resetFilter () {
      this.filter.refundNo = ''
      this.filter.applyDateStart = ''
      this.filter.applyDateEnd = ''
      this.filter.applyChannel = ''
      this.filter.initialTicketNo = ''
      this.filter.isinter = ''
      this.filter.name = ''
      this.filter.fNumber = ''
      this.filter.aFrom = ''
      this.filter.aTo = ''
      this.filter.seat = ''
      this.filter.channel = ''
      this.filter.orderCode = ''
      this.filter.ticketNo = ''
      this.filter.ticStatusRelation = ''
      this.filter.opAccount = ''
      this.filter.opDateStart = ''
      this.filter.opDateEnd = ''
      this.getRefundManageList()
    },
    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.allRefundList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: '/refund/exportRefundManage',
        name: getRouteName('/omnichannelRefundManage'),
        type: 'xls'
      }
      excelList(params, this)
    },
    // 确认处理
    handleConfirm (id) {
      this.$confirm('请确认是否已经将票面变更为open状态？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.handleData(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    // 确认处理 -- 接口
    handleData (id) {
      comfirmTicStatusRelation({ id: id }).then(() => {
        this.$message.success('操作成功')
        this.getRefundManageList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 查看订单详情
    switchDialog (params) {
      let startdate = ''
      let enddate = params.opDate.split(' ')[0]
      let orderDate = enddate.replace(/-/g, '')
      this.orderDetilList = {
        orderVisible: true,
        dialogTitle: '关联订单详细信息'
      }
      this.$refs.orderAby.getOrderData({ orderId: params.orderid, orderDate: orderDate }) // 订单信息
      this.$refs.orderAby.getFirstPassageData({ orderId: params.orderid, orderDate: orderDate, segid: '1' }) // 第一航段
      this.$refs.orderAby.getCheckFlightSegment({ orderId: params.orderid, orderDate: orderDate, segid: '2' }) // 第二航段
      this.$refs.orderAby.getInsuranceInfoData({ ordercode: params.ordercode, startdate: startdate, enddate: enddate }) // 保险信息
      this.$refs.orderAby.getTravelMailData({ orderCode: params.ordercode, page: 1, rows: 20 }) // 行程单信息
      this.$refs.orderAby.getOrderProcessingList({ orderid: params.orderid }) // 订单操作日志
    }
  }
}
</script>

<style scoped>

</style>
