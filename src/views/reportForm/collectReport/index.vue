<template>
  <div id="SalesReport" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="起始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.endDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道" clearable v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="国内/国际" clearable v-model="filter.isInter">
            <el-option label="国内" value="0"></el-option>
            <el-option label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="乘机人类型" clearable v-model="filter.passerType">
            <el-option label="成人" value="0"></el-option>
            <el-option label="儿童" value="1"></el-option>
            <el-option label="婴儿" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="订单类型" clearable v-model="filter.orderType">
            <el-option v-for="item in orderType" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="产品名称" clearable v-model="filter.productName">
            <el-option v-for="item in dataDictionary.PRODUCTNAME" :key="item.dincId" :label="item.dincName" :value="item.dincCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getSaleReport()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="!saleReport.total" @click="exportExcel">导出</el-button>
      </div>
      <div v-if="isColumn" class="search-container clearfix flex">
        <div class="check-ipt">
          <el-checkbox @change="checkHanler" v-model="checkedAll" :indeterminate="isIndeterminate">全选</el-checkbox>
        </div>
        <div>
          <div class="check-item check-ipt" v-for="item in checkList" :key="item.key">
            <el-checkbox-group v-model="checked" @change="handleCheck">
              <el-checkbox class="table-cell"  :label="item.key" :key="item.key" @change="handleoneCheck(item.key)">{{item.label}}</el-checkbox>
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
          :data="saleReport.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
            <el-table-column key="1" v-if="tableList.channel" label="渠道来源" min-width="100">
              <template slot-scope="scope">
                {{scope.row.channel | channelMap}}
              </template>
            </el-table-column>
            <el-table-column key="2" v-if="tableList.upgrandmoney" label="升舱补差" prop="upgrandmoney" min-width="100">
              <template slot-scope="scope">
                {{scope.row.upgrandmoney | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="3" v-if="tableList.refundcharge" label="变更手续费" prop="airport2" min-width="100">
              <template slot-scope="scope">
                <span v-if="!scope.row.refundcharge">0.00</span>
                <span v-else>{{scope.row.refundcharge | formatPriceMap}}</span>
              </template>
            </el-table-column>
            <el-table-column key="4" v-if="tableList.upgradnum" label="改期航段" prop="upgradnum" min-width="100"></el-table-column>
            <el-table-column key="5" v-if="tableList.num" label="销售量" prop="num" min-width="100"></el-table-column>
            <el-table-column key="25" v-if="tableList.fare" label="优惠前票面价" prop="fare" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.fare | formatPriceMap }}
            </template>
          </el-table-column>
            <el-table-column key="6" v-if="tableList.price" label="票面价" prop="price" min-width="100">
              <template slot-scope="scope">
                {{scope.row.price | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="7" v-if="tableList.airport" label="机建税" prop="airport" min-width="100">
              <template slot-scope="scope">
                {{scope.row.airport | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="8" v-if="tableList.fuel" label="燃油税" prop="fuel" min-width="100">
              <template slot-scope="scope">
                {{scope.row.fuel | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="9" v-if="tableList.tottle" label="总税" prop="tottle" min-width="100">
              <template slot-scope="scope">
                {{scope.row.tottle | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="10" v-if="tableList.insurance" label="保险总额" prop="insurance" min-width="100">
              <template slot-scope="scope">
                {{scope.row.insurance | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="11" v-if="tableList.airnum" label="地铁票销售量" prop="airnum" min-width="100">
            <template slot-scope="scope">
              {{scope.row.airnum | formatPriceMap}}
            </template>
          </el-table-column>
            <el-table-column key="12" v-if="tableList.airpayamount" label="轨道票销售额" prop="airpayamount" min-width="100">
            <template slot-scope="scope">
              {{scope.row.airpayamount | formatPriceMap}}
            </template>
          </el-table-column>
            <el-table-column key="13" v-if="tableList.refpmprice4" label="总收入(不含税)" prop="refpmprice4" min-width="120">
              <template slot-scope="scope">
                {{scope.row.payMoneyNoS | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="14" v-if="tableList.paymoney" label="总收入" prop="paymoney" min-width="100">
              <template slot-scope="scope">
                {{scope.row.paymoney | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="15" v-if="tableList.refundM" label="净收入" min-width="100">
              <template slot-scope="scope">
                {{(scope.row.paymoney - scope.row.refundmoney).toFixed(2)}}
              </template>
            </el-table-column>
            <el-table-column key="16" v-if="tableList.refundnum" label="退票量" prop="refundnum" min-width="100"></el-table-column>
            <el-table-column key="17" v-if="tableList.refAirport" label="退机建税" min-width="100">
              <template slot-scope="scope">
                {{scope.row.refundnum * 50 | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="18" v-if="tableList.refFuel" label="退燃油税" prop="refFuel" min-width="100">
              <template slot-scope="scope">
                <span v-if="!scope.row.refFuel">0.00</span>
                <span v-else>{{scope.row.refFuel | formatPriceMap}}</span>
              </template>
            </el-table-column>
            <el-table-column key="19" v-if="tableList.refpmprice" label="退税总" prop="refTotal" min-width="100">
              <template slot-scope="scope">
                {{scope.row.refTotal | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="20" v-if="tableList.refinsurance" label="退保险总额" prop="refinsurance" min-width="100">
              <template slot-scope="scope">
                {{scope.row.refinsurance | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="21" v-if="tableList.charge" label="退票手续费" prop="charge" min-width="100">
              <template slot-scope="scope">
                {{scope.row.charge | formatPriceMap}}
              </template>
            </el-table-column>
            <el-table-column key="22" v-if="tableList.refundmoney" label="退款总金额" prop="refundmoney" min-width="100">
              <template slot-scope="scope">
                {{scope.row.refundmoney | formatPriceMap}}
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
        :total="saleReport.total">
       </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelList, getDataDictionary, getCurrentDate, excelList, getRouteName } from '../../../utils/index'
import { fetchList } from './api.js'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'SalesReport',
  data () {
    return {
      componentName: 'salesReport',
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        fare: false,
        channel: true,
        upgrandmoney: true,
	      refundcharge: false,
        upgradnum: false,
        num: true,
        price: true,
        airport: false,
        fuel: false,
        tottle: false,
        insurance: false,
        airnum: true,
        airpayamount: true,
        refpmprice4: false,
        paymoney: true,
        refundM: false,
        refundnum: false,
        refAirport: false,
        refFuel: false,
        refpmprice: false,
        refinsurance: false,
        charge: false,
        refundmoney: false
      },
      loading: false,
      filter: {
        startDate: '',
        endDate: ''
      },
      dataViewHeight: null,
      date: [],
      saleReport: {}
    }
  },
  created () {
    this.judgeChannelList()
    this.judgeProductName()
    this.initDate()
    this.getSaleReport(1, this.pagination.pageSize)
    // this.locCheck()
  },
  mixins: [checkAttrs, computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      dataDictionary: state => state.app.dataDictionary,
      orderType: state => state.app.orderType
    })
  },
  methods: {
    // 总税
    handleTottle (row) {
      let str = ''
      str = parseInt(row.airport) + parseInt(row.fuel)
      return str
    },
    // 总收入(不含保)
    handleRefpmprice4 (row) {
      let str = ''
      str = parseInt(row.airport) + parseInt(row.fuel) + parseInt(row.price) + parseInt(row.upgrandmoney)
      return str
    },
    // 退机建税
    handleRefAirport (row) {
      let str = ''
      str = parseInt(row.refundnum) * 50
      return str
    },
    // 退税总
    handleRefpmprice (row) {
      let str = ''
      if (!row.refFuel) {
        row.refFuel = 0
      }
      str = parseInt(row.refundnum) * 50 + parseInt(row.refFuel)
      return str
    },
    //  导出
    exportExcel () {
      let params = {
        data: JSON.parse(JSON.stringify(this.filter)),
        url: 'report/exportSaleReport',
        name: getRouteName('/salesReport'),
        type: 'xls',
        total: this.saleReport.total
      }
      excelList(params, this)
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 获取产品列表
    judgeProductName () {
      if (!this.dataDictionary.PRODUCTNAME.length) {
        getDataDictionary('PRODUCTNAME')
      }
    },
    initDate () {
      this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.filter.startDate = this.date[0]
      this.filter.endDate = this.date[1]
    },
    // 获取列表数据
    getSaleReport (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.saleReport = res
        for (let i = 0; i < this.saleReport.rows.length; i++) {
          this.saleReport.rows[i].tottle = parseInt(this.saleReport.rows[i].airport) + parseInt(this.saleReport.rows[i].fuel)
          this.saleReport.rows[i].payMoneyNoS = parseInt(this.saleReport.rows[i].paymoney) - parseInt(this.saleReport.rows[i].airport) - parseInt(this.saleReport.rows[i].fuel)
          let str = ''
          let row = this.saleReport.rows[i]
          if (!row.refFuel) {
            row.refFuel = 0
          }
          str = parseInt(row.refundnum) * 50 + parseInt(row.refFuel)
          this.saleReport.rows[i].refTotal = str // 退税总
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        startDate: '',
        endDate: ''
      }
      this.getSaleReport(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getSaleReport(null, pages)
    },
    handleCurrentChange (page) {
      this.getSaleReport(page, null)
    }
  }
}
</script>

<style scoped>

</style>
