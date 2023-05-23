<template>
<!--  <div>活动配置</div>-->
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="配置名称" v-model="filter.cronName" @keydown.enter.native="getHbairCronList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="启用状态" v-model="filter.status"  @keydown.enter.native="getHbairCronList()">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="filter.point" placeholder="配置场景" size="medium" clearable>
            <el-option v-for="item in dictsbyTypeList" :key="item.dincCode" :value="item.dincCode" :label="item.dincName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.endDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getHbairCronList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit()">添加</el-button>
        <el-button size="medium" :disabled="!multipleSelection.length" type="danger" @click="handleDelete()">批量删除</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="hbairCronList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column label="配置名称" prop="cronName" min-width="100"></el-table-column>
          <el-table-column label="配置场景" prop="point" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.point | dictsByTypeMap}}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始日期" prop="startDate" min-width="100"></el-table-column>
          <el-table-column label="结束日期" prop="endDate" min-width="100"></el-table-column>
          <el-table-column label="启用状态" prop="status" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status === '0'">禁用</span>
              <span v-if="scope.row.status === '1'">启用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="160">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click='handleStatus(scope.row.cronId, scope.row.status)' v-if="scope.row.status === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handleStatus(scope.row.cronId, scope.row.status)' v-if="scope.row.status === '0'" title="禁用">启用</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.cronId)">删除</span>
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
            :total="hbairCronList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--新增弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="560px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">配置名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="配置名称" clearable v-model="editForm.cronName"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.cronName">配置名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">配置场景</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.point" placeholder="请选择配置场景类型" size="medium">
                  <el-option v-for="item in dictsbyTypeList" :key="item.dincCode" :value="item.dincCode" :label="item.dincName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.point">配置场景不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">开始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="活动开始日期"
                  v-model="editForm.startDate">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.startDate">开始日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">结束日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="活动结束日期"
                  v-model="editForm.endDate">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.endDate">结束日期不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">启用状态</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.status" placeholder="请选择启用状态" size="medium">
                  <el-option key="0" label="禁用" value="0"></el-option>
                  <el-option key="1" label="启用" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.status">启用状态不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">备注</div>
              <div class="ipt-medium">
                <el-input
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="备注"
                  v-model="editForm.remark">
                </el-input>
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
import { computeTableHeight, filterIds, getDictsByType } from '../../../../utils/index'
import { queryHbairCronList, queryAddHbairCron, queryUpdateHbairCronBean, queryUpdateStatus, queryDeleteHbairCronBean } from './api'
export default {
  name: 'ActivityDeploy',
  data () {
    return {
      loading: false,
      dataViewHeight: null,
      multipleSelection: [], // 选中的表单数据
      filter: {
        cronName: '', // 配置名称
        status: '', // 启用状态
        point: '', // 配置场景
        startDate: '', // 开始日期
        endDate: '', // 截止日期
        page: '', // 当前页
        rows: '' // 每页查询数量
      },
      hbairCronList: {}, // 表格数据
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      popupTitle: '', // 添加/修改弹出框 -- 标题
      editForm: {} // 添加/修改弹出框 -- 表单
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.judgeChannelList()
    this.getHbairCronList(1, this.pagination.pageSize)
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      dictsbyTypeList: state => state.app.dictsbyTypeList
    })
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.dictsbyTypeList.length) {
        getDictsByType()
      }
    },
    // 分页
    handleSizeChange (pages) {
      this.getHbairCronList(null, pages)
    },
    handleCurrentChange (page) {
      this.getHbairCronList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    getHbairCronList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      queryHbairCronList(this.filter).then(res => {
        this.hbairCronList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 条件查询 -- 重置
    resetFilter () {
      this.filter.cronName = ''
      this.filter.status = ''
      this.filter.point = ''
      this.filter.startDate = ''
      this.filter.endDate = ''
      this.filter.point = ''
    },

    // 添加/修改弹出框 -- 显示隐藏
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
      this.editForm.cronId = params.cronId
      this.editForm.cronName = params.cronName
      this.editForm.status = params.status
      this.editForm.point = params.point
      this.editForm.startDate = params.startDate
      this.editForm.endDate = params.endDate
    },
    // 添加、修改弹出框 -- 提交
    saveEdit () {
      if (this.editForm.cronName && this.editForm.status && this.editForm.point && this.editForm.startDate && this.editForm.endDate) {
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
      queryAddHbairCron(data).then(res => {
        this.editVisible = false
        this.getHbairCronList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 修改弹出框 -- 提交接口
    updateParamsData (data) {
      queryUpdateHbairCronBean(data).then(res => {
        this.editVisible = false
        this.getHbairCronList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 添加/修改弹出框 -- 重置
    resetEdit () {
      this.editForm = {
        cronName: '',
        status: '0',
        point: '',
        startDate: '',
        endDate: ''
      }
      this.isEmpty = false
    },
    // 启用状态
    handleStatus (id, status) {
      let title = ''
      if (status === '0') {
        title = '是否确认启用?'
      } else {
        title = '是否确认禁用?'
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let data = {
          id: id,
          status: status === '0' ? '1' : '0'
        }
        queryUpdateStatus(data).then(res => {
          this.$message.success(res.message)
          this.getHbairCronList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },
    // 刪除
    handleDelete (id) {
      let ids = id || filterIds(this.multipleSelection, 'cronId').join(',')
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
    // 删除 -- 接口
    getDeleteData (id) {
      queryDeleteHbairCronBean({ ids: id }).then(res => {
        this.getHbairCronList()
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
