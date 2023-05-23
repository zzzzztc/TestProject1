<template>
  <!--<div>退票申请</div>-->
  <div id="RefundApply" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="旅客姓名" v-model="filter.pname" clearable @keydown.enter.native="getTicketInfo()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="证件号码" v-model="filter.idnumber" clearable @keydown.enter.native="getTicketInfo()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="起飞城市" v-model="filter.afrom" clearable @keydown.enter.native="getTicketInfo()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="降落城市" v-model="filter.ato" clearable @keydown.enter.native="getTicketInfo()"></el-input>
        </div>
        <div class="search-item">
          <el-date-picker
            size="medium"
            style="width: 180px"
            v-model="filter.fdate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="起飞日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单号" v-model="filter.orderCode" clearable @keydown.enter.native="getTicketInfo()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="机票号" v-model="filter.eticketno" clearable @keydown.enter.native="getTicketInfo()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="退票单号" v-model="filter.refundNo" clearable @keydown.enter.native="getTicketInfo()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="国内/国际" v-model="filter.isInter" clearable>
            <el-option label="国内" value="0"></el-option>
            <el-option label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单类型" v-model="filter.isintegral" clearable>
            <el-option v-for="item in orderType" :label="item.label" :value="item.value" :key="item.id"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="退票来源" v-model="filter.refundType" clearable>
            <el-option label="自营渠道退票" value="0"></el-option>
            <el-option label="全渠道非自愿退票" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="市场方" v-model="filter.airways" clearable @keydown.enter.native="getTicketInfo()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="承运方" v-model="filter.airline" clearable @keydown.enter.native="getTicketInfo()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="乘机人类型" v-model="filter.passerType" clearable>
            <el-option label="成人" value="0"></el-option>
            <el-option label="儿童" value="1"></el-option>
            <el-option label="婴儿" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道" v-model="filter.channel" clearable>
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="行程单是否需回收" v-model="filter.printFlag" clearable>
            <el-option value="1" label="是"></el-option>
            <el-option value="2" label="否"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getTicketInfo()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog" :disabled="!multipleSelection.length">提交退票</el-button>
        <el-button size="medium" @click="handleConfirm()" :disabled="!multipleSelection.length">已退票补票</el-button>
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
      <div class="table-container">
        <div class="column-btn" @click="switchColumn">
          <i class="el-icon-arrow-up"></i>
        </div>
        <el-table
          v-loading="loading"
          :data="ticketApply.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          @selection-change="handleSelectionChange"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column key="1" type="selection" :width="tableAttributes.width"></el-table-column>
          <el-table-column key="2" label="乘机人" v-if="tableList.pname" prop="pname" min-width="100"></el-table-column>
          <el-table-column key="3" label="PNR" v-if="tableList.pnr" prop="pnr" min-width="120"></el-table-column>
          <el-table-column key="4" label="市场方" v-if="tableList.airways" prop="airways" min-width="100"></el-table-column>
          <el-table-column key="5" label="承运方" v-if="tableList.airline" prop="airline" min-width="100"></el-table-column>
          <el-table-column key="6" label="渠道类型" v-if="tableList.channel" min-width="120" prop="channel"></el-table-column>
          <el-table-column key="7" label="订单编号" v-if="tableList.ordercode" prop="ordercode" min-width="180"></el-table-column>
          <el-table-column key="8" label="航段" v-if="tableList.flightSegment" prop="flightSegment" min-width="120"></el-table-column>
          <el-table-column key="9" label="产品名称" v-if="tableList.productname" prop="productname" min-width="100"></el-table-column>
          <el-table-column key="10" label="航班日期" v-if="tableList.flyDate" prop="flyDate" min-width="120"></el-table-column>
          <el-table-column key="11" label="起飞时间" v-if="tableList.flyTime" prop="flyTime" min-width="100"></el-table-column>
          <el-table-column key="12" label="到达时间" v-if="tableList.arriveTime" prop="arriveTime" min-width="100"></el-table-column>
          <el-table-column key="13" label="舱位" v-if="tableList.cabin" prop="cabin" min-width="80"></el-table-column>
          <el-table-column key="14" label="票面价" v-if="tableList.fare" prop="fare" min-width="80"></el-table-column>
          <el-table-column key="15" label="机建" v-if="tableList.airportTax" prop="airportTax" min-width="80"></el-table-column>
          <el-table-column key="16" label="燃油" v-if="tableList.fuelTax" prop="fuelTax" min-width="80"></el-table-column>
          <el-table-column key="17" label="航意险" v-if="tableList.unexpInsr" prop="unexpInsr" min-width="90"></el-table-column>
          <el-table-column key="18" label="航延险" v-if="tableList.delayInsr" prop="delayInsr" min-width="90"></el-table-column>
          <el-table-column key="19" label="票面总款" v-if="tableList.allpjrfare" prop="allpjrfare" min-width="90"></el-table-column>
          <el-table-column key="20" label="附加商品金额" v-if="tableList.productMoney" prop="productMoney" min-width="120"></el-table-column>
          <el-table-column key="21" label="积分价" v-if="tableList.integralFare" prop="integralFare" min-width="90"></el-table-column>
          <el-table-column keu="22" label="优惠金额" v-if="tableList.fmoney" prop="fmoney" min-width="90"></el-table-column>
          <el-table-column key="23" label="实际票款" v-if="tableList.sjfare" prop="sjfare" min-width="90"></el-table-column>
          <el-table-column key="24" label="客票状态" v-if="tableList.ticStatus" prop="ticStatus" min-width="140"></el-table-column>
          <el-table-column key="25" label="退票单号" v-if="tableList.refundNo" prop="refundNo" min-width="120"></el-table-column>
          <el-table-column key="26" label="退改状态" v-if="tableList.state" min-width="120" prop="state"></el-table-column>
<!--          <el-table-column label="退票来源" v-if="tableList.refundType" min-width="120" prop="refundType"></el-table-column>-->
          <el-table-column key="27" label="机票号" v-if="tableList.eticketno" min-width="180"></el-table-column>
          <el-table-column key="28" label="机票退改签规定" v-if="tableList.refundTicketInsr" prop="refundTicketInsr" min-width="180">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                title="机票退改签规定"
                width="300"
                trigger="hover"
                :content="scope.row.chgroledesc">
                <span class="inl-block active-text" slot="reference">{{scope.row.eticketno}}</span>
              </el-popover>
              <!--<span class="inl-block active-text">{{scope.row.eticketno}}</span>-->
            </template>
          </el-table-column>
          <el-table-column key="29" label="航班号" v-if="tableList.flightNo" prop="flightNo" min-width="100">
            <template slot-scope="scope">
              <div class="copy_div">
                <span>{{scope.row.flightNo}}</span>
                <i type="primary" title='点击复制' class="el-icon-document copy-btn" :data-clipboard-text="scope.row.flightNo" :class="scope.row.flightNo" @click="copy(scope.row.flightNo)"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column key="30" label="行程单是否需回收" v-if="tableList.printFlag" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.isprint === '1'">是</div>
              <div v-else>否</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="walletMoney"
            label="红包金额"
            v-if="tableList.walletMoney"
          >
          </el-table-column>
          <el-table-column key="31" label="疫情隔离险" v-if="tableList.epidemicInsr" min-width="180" prop="epidemicInsr"></el-table-column>
          <el-table-column key="32" label="航空退票险" v-if="tableList.refundTicketInsr" min-width="180" porp="refundTicketInsr"></el-table-column>
          <el-table-column key="33" label="操作" min-width="100">
            <template slot-scope="scope">
              <span class="active-text mr-5" v-if="scope.row.productCount && parseInt(scope.row.productCount)" @click="getSyncProductInfo(scope.row.ticketid)">附加商品详情</span>
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
        :total="ticketApply.total">
       </el-pagination>
    </div>
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="320px">
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
                <div class="label required">退票原因(剩余字数{{ 50 - refundApplyInfo.reason.length }})</div>
                <div class="ipt-medium">
                  <el-input type="textarea" :rows="4" placeholder="退票原因" :maxlength="50" v-model="refundApplyInfo.reason" clearable></el-input>
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
    <!--同步商品详情 -->
    <div v-if="productVisible">
      <el-dialog :visible.sync="productVisible" title="附加商品详情">
        <div class="dialog-container">
          <div class="dialog-main">
            <sync-product-info :ticketId="ticketId"></sync-product-info>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelList, filterIds } from '../../../utils'
import { fetchList, applyRefundByhand, applyRefundByforce } from './api'
import Clipboard from 'clipboard'
import SyncProductInfo from '../../../components/syncProductInfo'
import * as types from '../../../filters/index'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'RefundApply',
  data () {
    return {
      componentName: 'refundApply',
      loading: false,
      filter: {
        printFlag: '2'
      },
      dataViewHeight: null,
      ticketApply: {},
      multipleSelection: [],
      dialogVisible: false,
      dialogTitle: '',
      formErr: false,
      refundApplyInfo: {
        nature: '1',
        reason: ''
      },
      checkList: fieldMap,
      // checked: [],
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        productMoney: false,
        airways: false,
        airline: false,
        ordercode: false,
        productname: false,
        flyTime: false,
        arriveTime: false,
        cabin: false,
        fare: false,
        airportTax: false,
        fuelTax: false,
        unexpInsr: false,
        delayInsr: false,
        allpjrfare: false,
        integralFare: false,
        fmoney: false,
        ticStatus: false,
        refundNo: false,
        state: false,
        // refundType: false,
        pname: true,
        pnr: true,
        channel: true,
        eticketno: true,
        flightNo: true,
        flightSegment: true,
        flyDate: true,
        sjfare: true,
        printFlag: false,
        walletMoney: false,
	      epidemicInsr: false,
	      refundTicketInsr: false
      }, //  表格展示的数据
      productVisible: false,
      ticketId: null
    }
  },
  created () {
    this.judgeChannelList()
    this.getTicketInfo(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  components: {
    SyncProductInfo
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      orderType: state => state.app.orderType
    })
  },
  methods: {
    // 查看同步商品详情
    getSyncProductInfo (id) {
      this.productVisible = true
      this.ticketId = id
    },
    copy (param) {
      let clipboard = new Clipboard(`.` + param)
      clipboard.on('success', e => {
        this.$message.success('复制成功：' + e.text)
        clipboard.destroy()
      })
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 获取数据
    getTicketInfo (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.ticketApply = res
        for (let i = 0; i < this.ticketApply.rows.length; i++) {
          this.ticketApply.rows[i].flightNo = 'NS' + this.ticketApply.rows[i].flightNo
          this.ticketApply.rows[i].fare = types.formatPriceMap(this.ticketApply.rows[i].fare)
          this.ticketApply.rows[i].airportTax = types.formatPriceMap(this.ticketApply.rows[i].airportTax)
          this.ticketApply.rows[i].fuelTax = types.formatPriceMap(this.ticketApply.rows[i].fuelTax)
          this.ticketApply.rows[i].unexpInsr = types.formatPriceMap(this.ticketApply.rows[i].unexpInsr)
          this.ticketApply.rows[i].delayInsr = types.formatPriceMap(this.ticketApply.rows[i].delayInsr)
          this.ticketApply.rows[i].allpjrfare = types.formatPriceMap(this.ticketApply.rows[i].allpjrfare)
          this.ticketApply.rows[i].integralFare = this.ticketApply.rows[i].integralFare ? types.formatPriceMap(this.ticketApply.rows[i].integralFare) : 0
          this.ticketApply.rows[i].fmoney = types.formatPriceMap(this.ticketApply.rows[i].fmoney)
          this.ticketApply.rows[i].sjfare = types.formatPriceMap(this.ticketApply.rows[i].sjfare)
          this.ticketApply.rows[i].ticStatus = types.outTicketStatusMap(this.ticketApply.rows[i].ticStatus)
          this.ticketApply.rows[i].state = types.refundStatusMap(this.ticketApply.rows[i].cstatus)
          this.ticketApply.rows[i].channel = types.channelMap(this.ticketApply.rows[i].channel)
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    resetFilter () {
      this.filter = {
        printFlag: '2'
      }
      this.getTicketInfo(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getTicketInfo(null, pages)
    },
    handleCurrentChange (page) {
      this.getTicketInfo(page, null)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleConfirm (category) {
      let title = ''
      if (category) {
        title = '是否确认提交退票？'
      } else {
        title = '是否确认退票补退？'
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (category) {
          this.handleRefund()
        } else {
          this.handleRefundBu()
        }
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    switchDialog () {
      this.dialogVisible = true
      this.dialogTitle = '申请退票'
    },
    // 提交退票
    handleRefund (tid, uid) {
      let ticketIds = tid || filterIds(this.multipleSelection, 'ticketid').join(',')
      let userid = uid || filterIds(this.multipleSelection, 'userid').join(',')
      applyRefundByhand({ ticketIds: ticketIds, userid: userid, nature: this.refundApplyInfo.nature, reason: this.refundApplyInfo.reason }).then(() => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.getTicketInfo()
      }).catch(err => {
        this.$message.error(err.message)
        this.dialogVisible = false
      })
    },
    // 已退票补票
    handleRefundBu () {
      let ticketIds = filterIds(this.multipleSelection, 'ticketid').join(',')
      applyRefundByforce({ ticketIds: ticketIds }).then(() => {
        this.$message.success('操作成功')
        this.getTicketInfo()
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .copy_div{
    position: relative;
  }
  .copy-btn{
    color: #409EFF;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
