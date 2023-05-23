<template>
<!--  <div>用户申领</div>-->
  <div id="UserReceive" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="领用规则编号" v-model="filter.receiveCode" @keydown.enter.native="getSaleApplyRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="申领批次号" v-model="filter.batchCode" @keydown.enter.native="getSaleApplyRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="客户类型" v-model="filter.memberType" @keydown.enter.native="getSaleApplyRecordList()">
            <el-option label="会员" value="0"></el-option>
            <el-option label="常旅客" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="号码类型" v-model="filter.pidType" @keydown.enter.native="getSaleApplyRecordList()">
            <el-option label="手机号" value="1"></el-option>
            <el-option label="证件号" value="2"></el-option>
            <el-option label="常客号" value="3"></el-option>
            <el-option label="邮箱" value="4"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="客户号码" v-model="filter.pidNo" @keydown.enter.native="getSaleApplyRecordList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.createTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申领时间开始">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.createTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申领时间结束">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getSaleApplyRecordList()">查询</el-button>
          <el-button size="medium" @click="resetEdit()">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleImport()">上传用户身份信息申领</el-button>
        <el-button size="medium" @click="handleExport()">模板下载</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="useApplyList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
<!--          <el-table-column type="selection" fixed="left"></el-table-column>-->
          <el-table-column label="申领批次号" v-if="tableList.batchCode" prop="batchCode" min-width="120"></el-table-column>
          <el-table-column label="申领批次名称" v-if="tableList.batchName" prop="batchName" min-width="120"></el-table-column>
          <el-table-column label="客户类型" v-if="tableList.memberType" prop="memberType" min-width="100">
            <template slot-scope="scope">
            <span v-if="scope.row.memberType && scope.row.memberType !== 'null'">
              {{scope.row.memberType | memberTypeMap}}
            </span>
            </template>
          </el-table-column>
          <el-table-column label="号码类型" v-if="tableList.pidType" prop="pidType" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.pidType === '1'">手机号</span>
              <span v-if="scope.row.pidType === '2'">证件号</span>
              <span v-if="scope.row.pidType === '3'">常客号</span>
              <span v-if="scope.row.pidType === '4'">邮箱</span>
            </template>
          </el-table-column>
          <el-table-column label="客户号码" v-if="tableList.pidNo" prop="pidNo" min-width="120"></el-table-column>
          <el-table-column label="是否实名认证" v-if="tableList.authCheck" prop="authCheck" min-width="120">
            <template slot-scope="scope">
                <span v-if="scope.row.authCheck && scope.row.authCheck !== 'null'">
                  {{scope.row.authCheck | authCheckMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="申领状态" v-if="tableList.applyStatus" prop="applyStatus" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.applyStatus === '0'">未申领</span>
              <span v-if="scope.row.applyStatus === '1'">已申领</span>
            </template>
          </el-table-column>
          <el-table-column label="申领时间" v-if="tableList.createTime" prop="createTime" min-width="160"></el-table-column>
          <el-table-column label="领用规则编号" v-if="tableList.receiveCode" prop="receiveCode" min-width="140"></el-table-column>
          <el-table-column label="领用规则名称" v-if="tableList.receiveName" prop="receiveName" min-width="180"></el-table-column>
          <el-table-column label="申领人姓名" v-if="tableList.createOpName" prop="createOpName" min-width="120"></el-table-column>
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
            :total="useApplyList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--上传用户身份信息申领-->
    <el-dialog title="上传" :visible.sync="importVisible" width="500px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <input type="file" @change="choiceFile($event)">
              <div v-if="filepath">{{filepath}}</div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="handleSubmit()">提交</el-button>
<!--          <el-button size="medium" @click="importVisible = false">返回</el-button>-->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentDate } from '../../../../utils/index'
import { querySaleApplyRecordList, queryImportSaleApplyRecord } from './api'
import { computWidth } from '../../../../mixins/computWidt'

export default {
  name: 'UserReceive',
  data () {
    return {
      loading: false,
      importVisible: false, // 上传弹出框显示隐藏
      dataViewHeight: null,
      filter: {
        receiveCode: '', // 领用规则编号
        batchCode: '', // 申领批次号
        memberType: '', // 客户类型
        pidType: '', // 号码类型
        pidNo: '', // 客户号码
        createTimeStart: '', // 申领时间开始
        createTimeEnd: '', // 申领时间结束
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件
      useApplyList: {}, // 表格数据表单
      tableList: {
        batchCode: true, // 申领批次号
        batchName: true, // 申领批次名称
        memberType: true, // 客户类型
        pidType: true, // 号码类型
        pidNo: true, // 客户号码
        authCheck: true, // 是否实名认证
        applyStatus: true, // 申领状态
        createTime: true, // 申领时间
        receiveCode: true, // 领用规则编号
        receiveName: true, // 领用规则名称
        createOpName: true // 申领人姓名
      }, // 表格展示数据
      filepath: '',
      fileList: []
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      baseUrl: state => state.app.baseUrl
    })
  },
  created () {
    this.initDate()
    this.getSaleApplyRecordList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  methods: {
    // 默认日期处理
    initDate () {
      this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.filter.createTimeStart = this.date[0]
      this.filter.createTimeEnd = this.date[1]
    },

    // 分页导航
    handleSizeChange (pages) {
      this.getSaleApplyRecordList(null, pages)
    },
    handleCurrentChange (page) {
      this.getSaleApplyRecordList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getSaleApplyRecordList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      querySaleApplyRecordList(this.filter).then(res => {
        this.useApplyList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },

    // 查询重置
    resetEdit () {
      this.filter = {
        receiveCode: '',
        batchCode: '',
        memberType: '',
        pidType: '',
        pidNo: '',
        createTimeStart: '',
        createTimeEnd: ''
      }
      this.initDate()
      this.getSaleApplyRecordList(1, this.pagination.pageSize)
    },

    // 上传用户身份信息申领
    handleImport () {
      this.importVisible = true
    },

    choiceFile (e) {
      this.fileList = e.target.files
    },

    // 上传文件提交
    handleSubmit () {
      let data = new FormData()
      for (let i = 0; i < this.fileList.length; i++) {
        data.append('importExcel', this.fileList[i])
      }
      queryImportSaleApplyRecord(data).then(res => {
        this.$message.success(res.message)
        this.importVisible = false
        this.getSaleApplyRecordList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 上传模板下载
    handleExport () {
      window.location.href = this.baseUrl + 'js/xlstemplate/saleApplyRecordTemplate.xls'
    }
  }
}
</script>

<style scoped lang="scss"></style>
