<template>
  <!--<div>折扣管理</div>-->
  <div id="TicketDiscountManage" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="折扣编号" v-model="filter.discountCode" @keydown.enter.native="getDTicketDiscountList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select placeholder="国内国际" v-model='filter.interFlag' size="medium" clearable>
            <el-option key="0" label="国内" value="0"></el-option>
            <el-option key="1" label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select placeholder="乘机人类型" v-model='filter.passengerType' size="medium" clearable>
            <el-option key="0" label="成人" value="0"></el-option>
            <el-option key="1" label="儿童" value="1"></el-option>
            <el-option key="2" label="婴儿" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getDTicketDiscountList()">查询</el-button>
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
          :data="discountList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="折扣编号" prop="discountCode" min-width="100"></el-table-column>
          <el-table-column label="折扣" prop="discount" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.discount === '0' ? '免费' : scope.row.discount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="国内国际" prop="interFlag" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.interFlag === '0'">国内</span>
              <span v-if="scope.row.interFlag === '1'">国际</span>
            </template>
          </el-table-column>
          <el-table-column label="乘机人类型" prop="passengerType" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.passengerType === '0'">成人</span>
              <span v-if="scope.row.passengerType === '1'">儿童</span>
              <span v-if="scope.row.passengerType === '2'">婴儿</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.dicountId)">删除</span>
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
            :total="discountList.total">
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
              <div class="label required">折扣编号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="折扣编号" clearable v-model="editForm.discountCode"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.discountCode">折扣编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">折扣</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="折扣，0 为免费" clearable v-model="editForm.discount"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.discount">折扣不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">国内国际</div>
              <div class="ipt-medium">
                <el-select size="medium" clearable placeholder="国内国际" v-model="editForm.interFlag">
                  <el-option label="国内" value="0"></el-option>
                  <el-option label="国际" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.interFlag">国内国际不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">乘机人类型</div>
              <div class="ipt-medium">
                <el-select size="medium" clearable placeholder="乘机人类型" v-model="editForm.passengerType">
                  <el-option label="成人" value="0"></el-option>
                  <el-option label="儿童" value="1"></el-option>
                  <el-option label="婴儿" value="2"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.passengerType">乘机人类型不可为空</div>
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
import { computWidth } from '../../../mixins/computWidt'
import { filterIds } from '../../../utils'
import {
  queryDTicketDiscountList,
  queryAddDTicketDiscount,
  queryUpdateDTicketDiscount,
  queryDeleteDTicketDiscount
} from './api'

export default {
  name: 'TicketDiscountManage',
  data () {
    return {
      componentName: 'TicketDiscountManage',
      loading: false,
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      filter: {
        discountCode: '', // 折扣编号
        interFlag: '', // 国内国际
        passengerType: '', // 乘机人类型 0成人；1儿童；2婴儿
        page: '', // 开始页
        rows: '' // 页面展示数量
      },
      discountList: {}, //  表格数据
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: false, // 添加/修改弹出框 -- 切换添加/修改
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      popupTitle: '', // 添加/修改弹出框 -- 标题
      editForm: {} // 添加/修改弹出框 -- 数据表单
    }
  },
  created () {
    this.getDTicketDiscountList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
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
    // 分页导航
    handleSizeChange (pages) {
      this.getDTicketDiscountList(null, pages)
    },
    handleCurrentChange (page) {
      this.getDTicketDiscountList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    getDTicketDiscountList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      queryDTicketDiscountList(this.filter).then(res => {
        this.discountList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 查询条件 -- 重置
    resetFilter () {
      this.filter.discountCode = ''
      this.filter.interFlag = ''
      this.filter.passengerType = ''
      this.getDTicketDiscountList()
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
      this.editForm.dicountId = params.dicountId
      this.editForm.discountCode = params.discountCode
      this.editForm.discount = params.discount
      this.editForm.interFlag = params.interFlag
      this.editForm.passengerType = params.passengerType
    },
    // 添加弹出框提交
    saveEdit () {
      if (this.editForm.discountCode && this.editForm.discount &&
        this.editForm.interFlag && this.editForm.passengerType) {
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
      queryAddDTicketDiscount(data).then(res => {
        this.editVisible = false
        this.getDTicketDiscountList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 修改弹出框 -- 提交接口
    updateParamsData (data) {
      queryUpdateDTicketDiscount(data).then(res => {
        this.editVisible = false
        this.getDTicketDiscountList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 添加弹出框重置
    resetEdit () {
      this.editForm = {
        discountCode: '',
        discount: '',
        interFlag: '',
        passengerType: ''
      }
      this.isEmpty = false
    },
    // 删除
    handleDelete (id) {
      let ids = id || filterIds(this.multipleSelection, 'dicountId').join(',')
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
      queryDeleteDTicketDiscount({ ids: id }).then(res => {
        this.editVisible = false
        this.getDTicketDiscountList()
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
