<template>
  <!--<div>发票管理</div>-->
  <div id="InvoiceManage" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.invoiceStatus" placeholder="发票状态" clearable @keydown.enter.native="getInvoiceList()">
            <el-option label="已冲红" value="0"></el-option>
            <el-option label="已开票" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.invoiceType" placeholder="发票类型" clearable @keydown.enter.native="getInvoiceList()">
            <el-option label="公司" value="1"></el-option>
            <el-option label="个人/其他" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" v-model="filter.invoiceRise" placeholder="发票抬头" clearable @keydown.enter.native="getInvoiceList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" v-model="filter.ticketNo" placeholder="票号" clearable @keydown.enter.native="getInvoiceList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" v-model="filter.invoiceNumber" placeholder="发票号码" clearable @keydown.enter.native="getInvoiceList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" v-model="filter.invoiceTax" placeholder="纳税号" clearable @keydown.enter.native="getInvoiceList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" v-model="filter.userId" placeholder="会员号" clearable @keydown.enter.native="getInvoiceList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" v-model="filter.username" placeholder="会员名称" clearable @keydown.enter.native="getInvoiceList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="开始时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.endDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="结束时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select
            size="medium"
            clearable
            placeholder="渠道"
            v-model="filter.channel">
            <el-option
              v-for="item in channelList"
              :key="item.chalId"
              :label="item.chalName"
              :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getInvoiceList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="!recordList.totalRows" @click="handleExport(1)">导出</el-button>
        <el-button type="success" size="medium" :disabled="!recordList.totalRows" @click="handleExport(2)">报税申报表</el-button>
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
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="recordList.contents"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column key="6" label="发票号码" v-if="tableList.invoiceNumber" prop="invoiceNumber" min-width="100">
            <template slot-scope="scope">
              <div class="active-text" @click="switchDialog(scope.row.serialNumber)">{{scope.row.invoiceNumber}}</div>
            </template>
          </el-table-column>
          <el-table-column key="9" label="金额" v-if="tableList.money" prop="money" min-width="80"></el-table-column>
          <el-table-column key="5" label="发票类型" v-if="tableList.invoiceType" prop="invoiceType" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.invoiceType === 1">公司</span>
              <span v-if="scope.row.invoiceType === 2">个人/其他</span>
            </template>
          </el-table-column>
          <el-table-column key="10" label="购方发票抬头" v-if="tableList.purchaseName" prop="purchaseName" min-width="160"></el-table-column>
          <el-table-column key="15" label="电话" v-if="tableList.purchaseMobile" prop="purchaseMobile" min-width="120"></el-table-column>
          <el-table-column key="7" label="发票状态" v-if="tableList.status" prop="status" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">已冲红</span>
              <span v-if="scope.row.status === 1">已开票</span>
            </template>
          </el-table-column>
          <el-table-column key="8" label="开票时间" v-if="tableList.createTime" prop="createTime" min-width="160"></el-table-column>
          <el-table-column key="12" label="购方发票地址" v-if="tableList.purchaseAddress" prop="purchaseAddress" min-width="160"></el-table-column>
          <el-table-column key="2" label="会员号" v-if="tableList.userId" prop="userId" min-width="120"></el-table-column>
          <el-table-column key="3" label="会员名称" v-if="tableList.username" prop="username" min-width="100"></el-table-column>
          <el-table-column key="4" label="发票代码" v-if="tableList.invoiceCode" prop="invoiceCode" min-width="120"></el-table-column>
          <el-table-column key="11" label="购方纳税人识别号" v-if="tableList.purchaseNumber" prop="purchaseNumber" min-width="160"></el-table-column>
          <el-table-column key="13" label="开户行和银行" v-if="tableList.purchaseBank" prop="purchaseBank" min-width="160"></el-table-column>
          <el-table-column key="14" label="发票下载地址" v-if="tableList.pdfUrl" prop="pdfUrl" min-width="160">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.pdfUrlList" :key="index" style="display: inline-block;padding-right: 10px;">
                <a :href="item" download="true">下载发票{{scope.row.pdfUrlList.length > 1 ? index + 1 : ''}}</a>
              </div>
            </template>
          </el-table-column>
          <el-table-column key="14" label="邮箱" v-if="tableList.purchaseEmail" prop="purchaseEmail" min-width="160"></el-table-column>
          <el-table-column label="渠道" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.channel | channelMap }}</span>
            </template>
          </el-table-column>
          <el-table-column key="16" label="备注" v-if="tableList.remark" prop="remark" min-width="160"></el-table-column>
          <el-table-column label="操作" min-width="60" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="冲红" v-if="scope.row.status === 1" @click="handleDiscard(scope.row)">冲红</span>
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
    <!--冲红弹出框-->
    <el-dialog title="冲红" :visible.sync="editVisible" width="320px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">OA编号</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="OA编号" v-model="editForm.oaNumber" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.oaNumber">OA编号不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" @click="resetEdit">重置</el-button>
        </div>
      </div>
    </el-dialog>
    <!--机票详情-->
    <el-dialog v-dialogDrag title="机票详情" :visible.sync="ticketVisible" width="860px">
      <div class="dialog-container">
        <div class="dialog-main">
          <el-table
            v-loading="dialogLoading"
            :data="ticketDetailList"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="票号" prop="ticketNo" min-width="140"></el-table-column>
            <el-table-column label="乘机人" prop="username" min-width="100"></el-table-column>
            <el-table-column label="手机号" prop="mobile" min-width="120"></el-table-column>
            <el-table-column label="出发地" prop="fromCity" min-width="100"></el-table-column>
            <el-table-column label="到达地" prop="arriveCity" min-width="100"></el-table-column>
            <el-table-column label="航司二字码" prop="airways" min-width="100"></el-table-column>
            <el-table-column label="航班号" prop="flyNumber" min-width="100"></el-table-column>
            <el-table-column label="航班日期" prop="flyDate" min-width="100"></el-table-column>
            <el-table-column label="起飞时间" prop="flyTime" min-width="100"></el-table-column>
            <!--<el-table-column label="到达时间" prop="arriveTime" min-width="100"></el-table-column>-->
          </el-table>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" @click="ticketVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { excelList, getChannelList, getRouteName } from '../../../utils/index'
import { queryInvoiceList, queryDiscardInvoice, queryticketDetail } from './api'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'InvoiceManage',
  data () {
    return {
      loading: false, // 加载
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      dataViewHeight: null,
      componentName: 'InvoiceManage',
      multipleSelection: [], // 表格多选
      filter: {
        invoiceStatus: '', // 发票状态
        invoiceType: '', // 发票类型
        invoiceRise: '', // 发票抬头
        ticketNo: '', // 票号
        invoiceNumber: '', // 发票号码
        invoiceTax: '', // 纳税号
        userId: '', // 常旅客号
        username: '', // 会员名称
        startDate: '', // 开始时间
        endDate: '', // 结束时间
        page: '', // 页码
        rows: '' // 页码大小
      }, // 查询条件数据表单
      recordList: {}, // 查询结果数据表单
      tableList: {
        invoiceNumber: true,
        money: true,
        invoiceType: true,
        purchaseName: true,
        purchaseMobile: true,
        status: true,
        createTime: true,
        purchaseAddress: true,
        userId: false,
        username: false,
        invoiceCode: false,
        purchaseNumber: false,
        purchaseBank: false,
        pdfUrl: false,
        purchaseEmail: false,
        remark: false
      }, // 查询结果展示数据表单
      editVisible: false, // 冲红弹出框 -- 显示隐藏
      isEmpty: false, // 冲红弹出框 -- 判空
      editForm: {}, // 冲红弹出框 -- 展示数据
      dialogLoading: false, // 机票查询 -- 加载
      ticketVisible: false, // 机票查询 -- 显示隐藏
      ticketDetailList: [] // 机票查询 -- 展示数据
    }
  },
  created () {
    this.getInvoiceList(1, this.pagination.pageSize)
    this.judgeChannelList()
  },
  mixins: [checkAttrs, computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList.filter(item => item.chalCode === 'app' || item.chalCode === 'wx')
    })
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 分页导航
    handleSizeChange (pages) {
      this.getInvoiceList(null, pages)
    },
    handleCurrentChange (page) {
      this.getInvoiceList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    getInvoiceList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.filter.isJson = true
      queryInvoiceList(this.filter).then(res => {
        this.recordList = res.data
        for (let item of this.recordList.contents) {
          item.pdfUrlList = item.pdfUrl.split(',')
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.data || err.message)
      })
    },
    // 查询条件 -- 重置
    resetFilter () {
      this.filter.invoiceStatus = ''
      this.filter.invoiceType = ''
      this.filter.invoiceRise = ''
      this.filter.invoiceCode = ''
      this.filter.invoiceNumber = ''
      this.filter.invoiceTax = ''
      this.filter.maxMoney = ''
      this.filter.minMoney = ''
      this.filter.userId = ''
      this.filter.username = ''
      this.filter.startDate = ''
      this.filter.endDate = ''
      this.filter.isJson = true
      this.getInvoiceList()
    },
    // 查询结果 -- 导出/报税申报表
    handleExport (type) {
      let params = {}
      if (type === 1) {
        let data = JSON.parse(JSON.stringify(this.filter))
        data.page = 1
        data.rows = this.recordList.totalRows
        data.isJson = true
        params = {
          data: data,
          url: '/electro-user/admin/v1/invoice/export',
          name: getRouteName('/invoiceManage'),
          type: 'xls'
        }
      } else {
        params = {
          url: '/electro-user/admin/v1/invoice/download/report',
          name: getRouteName('/invoiceManage'),
          type: 'xls'
        }
      }
      excelList(params, this)
    },
    // 冲红
    handleDiscard (param) {
      this.resetEdit()
      this.editVisible = true
      this.editForm.serialNumber = param.serialNumber
      this.editForm.updateBy = JSON.parse(window.localStorage.getItem('userInfo')).opAccount
    },
    // 冲红弹出框 -- 提交
    saveEdit () {
      if (this.editForm.oaNumber) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        this.discardParams(data)
      } else {
        this.isEmpty = true
      }
    },
    // 冲红 -- 接口调用
    discardParams (data) {
      data.headers = {
        oaNumber: data.oaNumber,
        updateBy: data.updateBy
      }
      delete data.oaNumber
      delete data.updateBy
      queryDiscardInvoice(data).then(res => {
        this.editVisible = false
        this.getInvoiceList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.data || err.message)
      })
    },

    // 冲红弹出框 -- 重置
    resetEdit () {
      this.editForm = {
        oaNumber: ''
      }
      this.isEmpty = false
    },
    // 查看机票详情
    switchDialog (id) {
      this.dialogLoading = true
      this.ticketVisible = true
      queryticketDetail(id).then(res => {
        this.dialogLoading = false
        this.ticketDetailList = res.data.ticketVOS
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
