<template>
  <!--产品订单列表查询-->
  <div id="ProductOrderList">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="订单编号"
            v-model="filter.proOrdercode"
            clearable
            @keydown.enter.native="getProductOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="票号"
            v-model="filter.ticketNo"
            clearable
            @keydown.enter.native="getProductOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="领取人"
            v-model="filter.receiveName"
            clearable
            @keydown.enter.native="getProductOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            placeholder="领取人电话"
            v-model="filter.receiveMobile"
            clearable
            @keydown.enter.native="getProductOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            style="width: 180px"
            v-model="filter.orderTimeStart"
            value-format="yyyy-MM-dd"
            size="medium"
            type="date"
            placeholder="订单开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            style="width: 180px"
            v-model="filter.orderTimeEnd"
            value-format="yyyy-MM-dd"
            size="medium"
            type="date"
            placeholder="订单截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select
            clearable
            size="medium"
            placeholder="订单状态"
            v-model="filter.detailStatus">
            <el-option value="1" label="未支付"></el-option>
            <el-option value="2" label="已支付"></el-option>
            <el-option value="4" label="已取消"></el-option>
            <el-option value="5" label="已退改"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select
            clearable
            size="medium"
            placeholder="支付状态"
            v-model="filter.payStatus">
            <el-option value="0" label="未支付"></el-option>
            <el-option value="1" label="支付中"></el-option>
            <el-option value="2" label="支付成功"></el-option>
            <el-option value="3" label="支付失败"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select
            clearable
            size="medium"
            placeholder="渠道"
            v-model="filter.channel">
            <el-option
              v-for="item in channelList"
              :key="item.chalId"
              :value="item.chalCode"
              :label="item.chalName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select
            clearable
            size="medium"
            placeholder="订单类型"
            v-model="filter.orderType">
            <el-option label="单独购" value="1"></el-option>
            <el-option label="随票购" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select
            clearable
            size="medium"
            placeholder="支付方式"
            v-model="filter.paytype">
            <el-option
              v-for="item in payPlatform"
              :key="item.id"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getProductOrderList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" type="success" @click="handleExport">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="list.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column min-width="160" key="20" label="订单编号" prop="proOrdercode"></el-table-column>
          <el-table-column min-width="180" key="18" label="支付银行订单号" prop="paybillno"></el-table-column>
          <el-table-column min-width="80" key="19" label="订单类型">
            <template slot-scope="scope">
              <div>{{ scope.row.orderType === '1' ? '单独购' : '随票购' }}</div>
            </template>
          </el-table-column>
          <el-table-column key="1" min-width="160" label="订单时间" prop="orderTime"></el-table-column>
          <el-table-column key="2" min-width="140" label="商品名称" prop="productName"></el-table-column>
          <el-table-column key="3" min-width="80" label="数量" prop="saleNum"></el-table-column>
          <el-table-column key="4" min-width="80" label="单价" prop="salePrice"></el-table-column>
          <el-table-column key="5" min-width="100" label="支付金额" prop="detatilPaymoney"></el-table-column>
          <el-table-column key="6" min-width="100" label="订单状态" prop="orderStatus">
            <template slot-scope="scope">
              <div>{{ scope.row.detailStatus | syncProductStatusMap }}</div>
            </template>
          </el-table-column>
          <el-table-column key="16" min-width="100" label="领取数量" prop="receiveNum"></el-table-column>
          <el-table-column key="7" min-width="100" label="领取人" prop="receiveName"></el-table-column>
          <el-table-column key="8" min-width="110" label="领取人座位号" prop="receiveSeatno"></el-table-column>
          <el-table-column key="17" min-width="120" label="领取人手机号" prop="receiveMobile">
            <template slot-scope="scope">
              {{ scope.row.receiveMobile || scope.row.contsMobile }}
            </template>
          </el-table-column>
          <el-table-column key="9" min-width="140" label="票号" prop="ticketNo"></el-table-column>
          <el-table-column key="10" min-width="80" label="航班号" prop="flightNo"></el-table-column>
          <el-table-column key="11" min-width="120" label="航班日期" prop="flightDate">
            <template slot-scope="scope">
              <div>{{ scope.row.flightDate | dateFormater }}</div>
            </template>
          </el-table-column>
          <el-table-column key="12" min-width="80" label="支付状态" prop="payStatus">
            <template slot-scope="scope">
              <div>{{ scope.row.payStatus | payStatusMap }}</div>
            </template>
          </el-table-column>
          <el-table-column key="13" min-width="120" label="渠道" prop="channel">
            <template slot-scope="scope">
              <div>{{ scope.row.channel | channelMap }}</div>
            </template>
          </el-table-column>
          <el-table-column key="14" min-width="100" label="支付方式" prop="paytype">
            <template slot-scope="scope">
              <div>{{ scope.row.paytype | payTypeMap }}</div>
            </template>
          </el-table-column>
          <el-table-column key="15" min-width="120" fixed="right" label="操作">
            <template slot-scope="scope">
<!--              <span class="active-text mr-5" @click="getDetail(scope.row)">详情</span>-->
<!--              <span v-show="scope.row.detailStatus === '2'" class="active-text mr-5" @click="postPoneCon(scope.row)">改期</span>-->
              <span
                v-show="scope.row.detailStatus === '2' && scope.row.orderType === '1'"
                class="active-text mr-5"
                @click="switchConfirm(scope.row)">退毛毯</span>
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
        :total="list.total">
      </el-pagination>
    </div>
    <!-- 订单详情-->
    <div>
      <el-dialog title="订单详情" :visible.sync="detailVisible">
        <div class="dialog-container" v-loading="dialogLoading">
          <div class="dialog-main">
            <el-table
              :data="detailList"
              :border="tableAttributes.border"
              :cell-style= "tableAttributes.cellStyle"
              :stripe="tableAttributes.stripe">
              <el-table-column label="商品名称" prop="productName" min-width="80"></el-table-column>
              <el-table-column label="数量" prop="saleNum" min-width="60"></el-table-column>
              <el-table-column label="单价" prop="salePrice" min-width="60"></el-table-column>
              <el-table-column label="支付金额" prop="paymoney" min-width="80"></el-table-column>
              <el-table-column label="领取人" prop="receiveName" min-width="80"></el-table-column>
              <el-table-column label="领取人电话" prop="receiveMobile" min-width="120"></el-table-column>
              <el-table-column label="领取人座位号" prop="receiveSeatno" min-width="120"></el-table-column>
              <el-table-column label="机票号" min-width="140" prop="ticketNo"></el-table-column>
              <el-table-column label="航班号" prop="flightNo" width="140"></el-table-column>
              <el-table-column label="航班日期" prop="flightDate" width="140"></el-table-column>
              <el-table-column label="订单状态" min-width="80">
                <template slot-scope="scope">
                  <div>{{ scope.row.detailStatus | syncProductStatusMap }}</div>
                </template>
              </el-table-column>
<!--              <el-table-column label="操作">-->
<!--                <template slot-scope="scope">-->
<!--                  <span class="active-text" @click="postPoneCon(scope.row)">改期</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
            </el-table>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--    商品改期-->
    <div>
      <el-dialog title="改期" :visible.sync="postVisible" width="360px">
        <div class="dialog-container">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">航班号</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="例如: 3324" clearable v-model="postpone.flightNo"></el-input>
                  <div class="warning-info" v-if="formErr && !postpone.flightNo">请填写航班号</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">航班日期</div>
                <div class="ipt-medium">
                  <el-date-picker
                    v-model="postpone.flightDate"
                    value-format="yyyyMMdd"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                  <div class="warning-info" v-if="formErr && !postpone.flightDate">请选择日期</div>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" type="primary" @click="handlePost" :disabled="!postpone.flightNo || !postpone.flightDate">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// TODO 改期功能暂时不上
import { computWidth } from '../../../mixins/computWidt'
import { mapState } from 'vuex'
import { fetchDetail, fetchList, postPoneApi, refundBlanket } from './api'
import { excelList, getChannelList, getRouteName } from '../../../utils'
export default {
  name: 'ProductOrderList',
  data () {
    return {
      filter: {},
      loading: false,
      list: {},
      dataViewHeight: null,
      dialogLoading: false,
      detailVisible: false,
      detailList: [],
      postVisible: false,
      formErr: false,
      currentRow: {},
      postpone: {}
    }
  },
  mixins: [ computWidth ],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      payPlatform: state => state.app.payPlatform
    })
  },
  created () {
    this.judgeChannelList()
    this.getProductOrderList(1, this.pagination.pageSize)
  },
  methods: {
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 查询
    getProductOrderList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter)
        .then(res => {
          this.loading = false
          this.list = res
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 重置查询
    resetFilter () {
      this.filter = {}
      this.getProductOrderList(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getProductOrderList(null, pages)
    },
    handleCurrentChange (page) {
      this.getProductOrderList(page, null)
    },
    // 查看详情
    getDetail (row) {
      this.currentRow = row
      this.detailVisible = true
      let data = {
        proOrderId: row.proOrderId,
        page: 1,
        rows: 50
      }
      this.dialogLoading = true
      fetchDetail(data)
        .then(res => {
          this.dialogLoading = false
          this.detailList = res.rows
        })
        .catch(err => {
          this.dialogLoading = false
          this.$message.error(err.message)
        })
    },
    postPoneCon (row) {
      this.currentRow = row
      this.postVisible = true
      this.formErr = false
      this.postpone.detailId = row.detailId
    },
    handlePost () {
      this.dialogLoading = true
      postPoneApi(this.postpone)
        .then(() => {
          this.dialogLoading = false
          this.postVisible = false
          this.$message({
            type: 'success',
            message: '改期成功'
          })
          this.getProductOrderList()
        })
        .catch(err => {
          this.dialogLoading = false
          this.$message.error(err.message)
        })
    },
    switchConfirm (row) {
      this.currentRow = row
      this.$confirm('是否确认退毛毯？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.refundProduct()
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    refundProduct () {
      let data = {
        arr: {
          userid: this.currentRow.userid,
          productOrderId: this.currentRow.proOrderId,
          channel: 'channel'
        },
        isJson: true
      }
      refundBlanket(data)
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getProductOrderList()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.list.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'order/exportProductOrder',
        name: getRouteName('/productOrderList'),
        type: 'xls'
      }
      excelList(params, this)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
