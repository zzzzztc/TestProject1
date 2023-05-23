<template>
  <!--<div>航班库存管理</div>-->
  <div id="FlightStockManage" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="票类型" v-model="filter.ticketType" @keydown.enter.native="getDflightstockList()">
            <el-option v-for="item in ticketTypeList" :key="item.dincId" :label="item.dincName" :value="item.dincCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="机型" v-model="filter.planeType" @keydown.enter.native="getDflightstockList()">
            <el-option v-for="item in planeTypeList" :key="item.dincId" :label="item.dincName" :value="item.dincCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="出发地" v-model="filter.afrom" @keydown.enter.native="getDflightstockList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="到达地" v-model="filter.ato" @keydown.enter.native="getDflightstockList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="舱位" v-model="filter.cabin" @keydown.enter.native="getDflightstockList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.fdateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班起始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.fdateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班截止日期">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getDflightstockList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit()">添加</el-button>
        <el-button type="danger" size="medium" :disabled="multipleSelection.length === 0" @click="handleDelete()">删除</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="flightStockList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="票类型" prop="ticketTypeName" min-width="100"></el-table-column>
          <el-table-column label="机型" prop="planeTypeName" min-width="100"></el-table-column>
          <el-table-column label="出发地" prop="afrom" min-width="100"></el-table-column>
          <el-table-column label="到达地" prop="ato" min-width="100"></el-table-column>
          <el-table-column label="舱位" prop="cabin" min-width="100"></el-table-column>
          <el-table-column label="库存" prop="stockNum" min-width="100"></el-table-column>
          <el-table-column label="航班起始日期" prop="fdateStart" min-width="100"></el-table-column>
          <el-table-column label="航班截止日期" prop="fdateEnd" min-width="100"></el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.stockId)">删除</span>
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
            :total="flightStockList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--新增、修改弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="800px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">票类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.ticketType" placeholder="请选择票类型" size="medium" clearable>
                  <el-option v-for="item in ticketTypeList" :key="item.dincId" :label="item.dincName" :value="item.dincCode"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.ticketType">票类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">库存</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="库存" clearable v-model="editForm.stockNum"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.stockNum">库存不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">机型</div>
              <div class="ipt-medium">
                <el-select size="medium" clearable placeholder="机型" v-model="editForm.planeType">
                  <el-option v-for="item in planeTypeList" :key="item.dincId" :label="item.dincName" :value="item.dincCode"></el-option>
                </el-select>
<!--                <div class="warning-info" v-if="isEmpty && !editForm.planeType">机型不可为空</div>-->
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">出发地</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="出发地" clearable v-model="editForm.afrom"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.afrom">出发地不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">到达地</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="到达地" clearable v-model="editForm.ato"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.ato">到达地不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">舱位</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="舱位" clearable v-model="editForm.cabin"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.cabin">舱位不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">航班起始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="航班起始日期"
                  v-model="editForm.fdateStart">
                </el-date-picker>
              </div>
            </div>
            <div class="column">
              <div class="label">航班截止日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="航班截止日期"
                  v-model="editForm.fdateEnd">
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" @click="resetEdit">重置</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getTicketType, getPlaneType, filterIds } from '../../../utils'
import { queryDflightstockList, queryAddDflightstock, queryUpdateDflightstock, queryDeleteDflightstock } from './api'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'FlightStockManage',
  data () {
    return {
      componentName: 'FlightStockManage',
      loading: false,
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      filter: {
        airways: 'NS', // 航司二字码
        ticketType: '', // 票类型
        planeType: '', // 机型
        fdateStart: '', // 航班日期起
        fdateEnd: '', // 航班日期止
        afrom: '', // 出发地 三字码
        ato: '', // 到达地三字码
        cabin: '', // 舱位
        page: '', // 开始页
        rows: '' // 页面展示数量
      },
      flightStockList: {}, //  表格数据
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: false, // 添加/修改弹出框 -- 切换添加/修改
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      popupTitle: '', // 添加/修改弹出框 -- 标题
      editForm: {} // 添加/修改弹出框 -- 数据表单
    }
  },
  created () {
    this.judgeChannelList()
    this.getDflightstockList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      ticketTypeList: state => state.app.ticketTypeList,
      planeTypeList: state => state.app.planeTypeList
    })
  },
  filters: {
    upper (value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    }
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.ticketTypeList.length) {
        getTicketType()
      }
      if (!this.planeTypeList.length) {
        getPlaneType()
      }
    },
    // 分页导航
    handleSizeChange (pages) {
      this.getDflightstockList(null, pages)
    },
    handleCurrentChange (page) {
      this.getDflightstockList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    getDflightstockList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.filter.afrom = this.$options.filters.upper(this.filter.afrom)
      this.filter.ato = this.$options.filters.upper(this.filter.ato)
      this.filter.cabin = this.$options.filters.upper(this.filter.cabin)
      queryDflightstockList(this.filter).then(res => {
        this.flightStockList = res
        this.loading = false
        this.handleFilterData(res.rows)
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    handleFilterData (data) {
      for (let item of data) {
        for (let it of this.ticketTypeList) {
          if (item.ticketType === it.dincCode) {
            item.ticketTypeName = it.dincName
          }
        }
        for (let it of this.planeTypeList) {
          if (item.planeType === it.dincCode) {
            item.planeTypeName = it.dincName
          }
        }
      }
    },
    // 查询条件 -- 重置
    resetFilter () {
      this.filter.airways = 'NS'
      this.filter.ticketType = ''
      this.filter.planeType = ''
      this.filter.fdateStart = ''
      this.filter.fdateEnd = ''
      this.filter.afrom = ''
      this.filter.ato = ''
      this.filter.cabin = ''
      this.getDflightstockList()
    },
    // 添加、修改弹出框
    handleEdit (params) {
      this.editVisible = true
      this.resetEdit()
      if (params) {
        this.isReset = false
        this.popupTitle = '修改'
        this.hangdleParams(params)
      } else {
        this.isReset = true
        this.popupTitle = '添加'
      }
    },
    // 添加/修改弹出框 -- 数据处理
    hangdleParams (params) {
      this.editForm.stockId = params.stockId
      this.editForm.airways = params.airways
      this.editForm.ticketType = params.ticketType
      this.editForm.planeType = params.planeType
      this.editForm.fdateStart = params.fdateStart
      this.editForm.fdateEnd = params.fdateEnd
      this.editForm.afrom = params.afrom
      this.editForm.ato = params.ato
      this.editForm.cabin = params.cabin
      this.editForm.stockNum = params.stockNum
    },
    // 添加弹出框提交
    saveEdit () {
      if (this.editForm.ticketType && this.editForm.afrom &&
        this.editForm.ato && this.editForm.cabin &&
        this.editForm.stockNum) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        data.afrom = this.$options.filters.upper(data.afrom)
        data.ato = this.$options.filters.upper(data.ato)
        data.cabin = this.$options.filters.upper(data.cabin)
        if (this.isReset === false) {
          this.updateParamsData(data)
        } else {
          this.addParamsData(data)
        }
      } else {
        this.isEmpty = true
      }
    },
    // 添加弹出框 -- 提交接口
    addParamsData (data) {
      queryAddDflightstock(data).then(res => {
        this.editVisible = false
        this.getDflightstockList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 修改弹出框 -- 提交接口
    updateParamsData (data) {
      queryUpdateDflightstock(data).then(res => {
        this.editVisible = false
        this.getDflightstockList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 添加弹出框重置
    resetEdit () {
      this.editForm = {
        airways: 'NS',
        ticketType: '',
        planeType: '',
        fdateStart: '',
        fdateEnd: '',
        afrom: '',
        ato: '',
        cabin: '',
        stockNum: ''
      }
      this.isEmpty = false
    },
    // 删除
    handleDelete (id) {
      let ids = id || filterIds(this.multipleSelection, 'stockId').join(',')
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        // 删除
        this.getDeleteData(ids)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 删除 -- 提交接口
    getDeleteData (id) {
      queryDeleteDflightstock({ ids: id }).then(res => {
        this.editVisible = false
        this.getDflightstockList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
