<template>
  <!--<div>配额管理</div>-->
  <div id="TicketLimitManage" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="票类型" v-model="filter.ticketType" @keydown.enter.native="getDTicketLimitList()">
            <el-option v-for="item in ticketTypeList" :key="item.dincId" :label="item.dincName" :value="item.dincCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="折扣编号" v-model="filter.discountCode" @keydown.enter.native="getDTicketLimitList()">
            <el-option v-for="item in ticketDiscountList" :key="item.discountCode" :label="item.discountCode" :value="item.discountCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select placeholder="退票返还状态" v-model='filter.refundBackFlag' size="medium" clearable>
            <el-option key="0" label="不返还" value="0"></el-option>
            <el-option key="1" label="返还" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getDTicketLimitList()">查询</el-button>
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
          :data="ticketLimitList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="票类型" prop="ticketTypeName" min-width="100"></el-table-column>
          <el-table-column label="总配额" prop="totalLimit" min-width="100"></el-table-column>
          <el-table-column label="国际配额" prop="interLimit" min-width="100"></el-table-column>
          <el-table-column label="退票返还状态" prop="refundBackFlag" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.refundBackFlag === '0'">不返还</span>
              <span v-if="scope.row.refundBackFlag === '1'">返还</span>
            </template>
          </el-table-column>
          <el-table-column label="折扣编号" prop="discountCode" min-width="100"></el-table-column>
          <el-table-column label="入职起始时间(月份)" prop="workStart" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.workStart ? scope.row.workStart : '不限'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="入职截止时间(月份)" prop="workEnd" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.workEnd ? scope.row.workEnd : '不限'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.limitId)">删除</span>
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
            :total="ticketLimitList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--新增、修改弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="560px">
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
              <div class="label required">折扣编号</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.discountCode" placeholder="请选择折扣编号" size="medium" clearable>
                  <el-option v-for="item in ticketDiscountList" :key="item.discountCode" :label="item.discountCode" :value="item.discountCode"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.discountCode">折扣编号不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">总配额</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="总配额" clearable v-model="editForm.totalLimit"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.totalLimit">总配额不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">国际配额</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="国际配额" clearable v-model="editForm.interLimit"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.interLimit">国际配额不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">退票返还状态</div>
              <div class="ipt-medium">
                <el-select size="medium" clearable placeholder="退票返还状态" v-model="editForm.refundBackFlag">
                  <el-option label="不返还" value="0"></el-option>
                  <el-option label="返还" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.refundBackFlag">退票返还状态不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">入职起始时间(月份)</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="入职起始时间(月份)" clearable v-model="editForm.workStart"></el-input>
<!--                <div class="warning-info" v-if="isEmpty && !editForm.workStart">入职起始时间不可为空</div>-->
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">入职截止时间(月份)</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="入职截止时间(月份)" clearable v-model="editForm.workEnd"></el-input>
<!--                <div class="warning-info" v-if="isEmpty && !editForm.workEnd">入职截止时间不可为空</div>-->
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
import { getTicketType, getPlaneType, getDTicketDiscountSelect, filterIds } from '../../../utils'
import { queryDTicketLimitList, queryAddDTicketLimit, queryUpdateDTicketLimit, queryDeleteDTicketLimit } from './api'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'TicketLimitManage',
  data () {
    return {
      componentName: 'TicketLimitManage',
      loading: false,
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      filter: {
        airways: 'NS', // 航司二字码
        ticketType: '', // 票类型
        refundBackFlag: '', // 退票返还状态 0不返还；1返还
        discountCode: '', // 折扣编号
        page: '', // 开始页
        rows: '' // 页面展示数量
      },
      ticketLimitList: {}, //  表格数据
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: false, // 添加/修改弹出框 -- 切换添加/修改
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      popupTitle: '', // 添加/修改弹出框 -- 标题
      editForm: {} // 添加/修改弹出框 -- 数据表单
    }
  },
  created () {
    this.judgeChannelList()
    this.getDTicketLimitList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      ticketTypeList: state => state.app.ticketTypeList,
      planeTypeList: state => state.app.planeTypeList,
      ticketDiscountList: state => state.app.ticketDiscountList
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
      if (!this.ticketDiscountList.length) {
        getDTicketDiscountSelect()
      }
    },
    // 分页导航
    handleSizeChange (pages) {
      this.getDTicketLimitList(null, pages)
    },
    handleCurrentChange (page) {
      this.getDTicketLimitList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    getDTicketLimitList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      queryDTicketLimitList(this.filter).then(res => {
        this.ticketLimitList = res
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
      this.filter.refundBackFlag = ''
      this.filter.discountCode = ''
      this.getDTicketLimitList()
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
      this.editForm.limitId = params.limitId
      this.editForm.airways = params.airways
      this.editForm.ticketType = params.ticketType
      this.editForm.totalLimit = params.totalLimit
      this.editForm.interLimit = params.interLimit
      this.editForm.refundBackFlag = params.refundBackFlag
      this.editForm.discountCode = params.discountCode
      this.editForm.workStart = params.workStart
      this.editForm.workEnd = params.workEnd
    },
    // 添加弹出框提交
    saveEdit () {
      if (this.editForm.ticketType && this.editForm.totalLimit &&
        this.editForm.interLimit && this.editForm.refundBackFlag &&
        this.editForm.discountCode) {
        let data = JSON.parse(JSON.stringify(this.editForm))
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
      queryAddDTicketLimit(data).then(res => {
        this.editVisible = false
        this.getDTicketLimitList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 修改弹出框 -- 提交接口
    updateParamsData (data) {
      queryUpdateDTicketLimit(data).then(res => {
        this.editVisible = false
        this.getDTicketLimitList()
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
        totalLimit: '',
        interLimit: '',
        refundBackFlag: '',
        discountCode: '',
        workStart: '',
        workEnd: ''
      }
      this.isEmpty = false
    },
    // 删除
    handleDelete (id) {
      let ids = id || filterIds(this.multipleSelection, 'limitId').join(',')
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
      queryDeleteDTicketLimit({ ids: id }).then(res => {
        this.editVisible = false
        this.getDTicketLimitList()
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
