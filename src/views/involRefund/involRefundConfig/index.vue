<template>
  <div class="container" id="InvolRefundConfig">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="配置类型" v-model="filter.configCategory" clearable>
            <el-option v-for="item in configCategory" :key="item.dincCode" :value="item.dincCode" :label="item.dincName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="配置条件" v-model="filter.configType" clearable>
            <el-option v-for="item in typeList" :key="item.dincCode" :value="item.dincCode" :label="item.dincName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="状态" v-model="filter.configFlag" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="queryList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog(1)">添加</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="configList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="配置类型" prop="configCategoryName"></el-table-column>
          <el-table-column label="配置条件" prop="typeName"></el-table-column>
          <el-table-column label="内容" prop="configContent"></el-table-column>
          <el-table-column label="状态" width="60" prop="configFlag">
            <template slot-scope="scope">
              {{ scope.row.configFlag === '1' ? '启用' : '禁用' }}
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="configRemark"></el-table-column>
          <el-table-column label="提示" prop="configTips"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click="switchDialog(null, scope.row)">编辑</span>
              <span v-if="scope.row.configFlag === '1'" class="active-text mr-5" @click="modifyStatus(scope.row, '0')">禁用</span>
              <span v-if="scope.row.configFlag !== '1'" class="active-text mr-5" @click="modifyStatus(scope.row, '1')">启用</span>
              <span class="danger-text mr-5" @click="delConfig(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="filter.page"
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="configList.total">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :visible.sync="visible" :title="dialogTitle" width="600px">
        <div class="dialog-container" v-loading="dialogLoading">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">配置类型</div>
                <div class="ipt-medium">
                  <el-select size="medium" v-model="config.configCategory">
                    <el-option v-for="item in configCategory" :key="item.dincCode" :value="item.dincCode" :label="item.dincName"></el-option>
                  </el-select>
                  <div class="warning-info" v-show="formErr && !config.configCategory">请选择配置类型</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">配置条件</div>
                <div class="ipt-medium">
                  <el-select size="medium" v-model="config.configType">
                    <el-option v-for="item in typeList" :key="item.dincCode" :value="item.dincCode" :label="item.dincName"></el-option>
                  </el-select>
                  <div class="warning-info" v-show="formErr && !config.configType">请选择条件</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">状态</div>
                <div class="ipt-medium">
                  <el-select size="medium" v-model="config.configFlag">
                    <el-option label="启用" value="1"></el-option>
                    <el-option label="禁用" value="0"></el-option>
                  </el-select>
                  <div class="warning-info" v-show="formErr && !config.configFlag">请选择状态</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">内容</div>
                <div class="ipt-medium">
                  <el-input type="textarea" v-model="config.configContent"></el-input>
                  <div class="warning-info" v-show="formErr && !config.configContent">请输入内容</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">备注</div>
                <div class="ipt-medium">
                  <el-input type="textarea" v-model="config.configRemark"></el-input>
                  <div class="warning-info" v-show="formErr && !config.configRemark">请输入备注</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">提示</div>
                <div class="ipt-medium">
                  <el-input type="textarea" v-model="config.configTips"></el-input>
                  <div class="warning-info" v-show="formErr && !config.configTips">请输入提示</div>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="verifyParam">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { addConfig, deleteConfig, fetchList, modifyConfig, updateStatus } from './api'
import { mapState } from 'vuex'
import { computWidth } from '../../../mixins/computWidt'
import { fetchProductList } from '../../../api'

export default {
  name: 'InvolRefundConfig',
  data () {
    return {
      filter: {},
      loading: false,
      configList: {},
      dataViewHeight: null,
      currentRow: {},
      visible: false,
      dialogTitle: '',
      config: {},
      typeList: [], // 配置条件
      configCategory: [], // 配置类型
      formErr: false,
      dialogLoading: false
    }
  },
  mixins: [ computWidth ],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  created () {
    this.queryType()
  },
  methods: {
    // 重置
    resetFilter () {
      this.filter = {}
      this.queryList(1, this.pagination.pageSize)
    },
    // 获取配置条件
    queryType () {
      fetchProductList({ type: 'CONFIG_TYPE' })
        .then(res => {
          this.typeList = res.rows
          this.queryConfigType()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 获取配置类型
    queryConfigType () {
      fetchProductList({ type: 'CONFIG_CATEGORY' })
        .then(res => {
          this.configCategory = res.rows
          this.queryList(1, this.pagination.pageSize)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 查询
    queryList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter)
        .then(res => {
          this.loading = false
          this.configList = res
          this.configList.rows.forEach(item => {
            item.typeName = this.typeFormat(item.configType)
            item.configCategoryName = this.configCategoryFormat(item.configCategory)
          })
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 配置条件过滤
    typeFormat (type) {
      for (let item of this.typeList) {
        if (type === item.dincCode) {
          return item.dincName
        }
      }
    },
    // 配置类型过滤
    configCategoryFormat (type) {
      for (let item of this.configCategory) {
        if (type === item.dincCode) {
          return item.dincName
        }
      }
    },
    // 分页
    handleSizeChange (pages) {
      this.queryList(null, pages)
    },
    handleCurrentChange (page) {
      this.queryList(page, null)
    },
    // 启用禁用
    modifyStatus (row, status) {
      this.currentRow = row
      this.$confirm('是否确定修改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          return updateStatus({ id: row.configId, status: status })
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.queryList()
        })
        .catch(err => {
          this.$message({
            type: err.message ? 'error' : 'info',
            message: err.message || '操作取消'
          })
        })
    },
    // 删除
    delConfig (row) {
      this.currentRow = row
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          return deleteConfig({ ids: row.configId })
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.queryList()
        })
        .catch(err => {
          this.$message({
            type: err.message ? 'error' : 'info',
            message: err.message || '操作取消'
          })
        })
    },
    // 添加，编辑
    switchDialog (type, param) {
      this.currentRow = param
      this.visible = true
      this.formErr = false
      if (type) {
        this.dialogTitle = '新增'
        this.config = {}
      } else {
        this.dialogTitle = '编辑'
        this.config = {
          configType: param.configType,
          configContent: param.configContent,
          configFlag: param.configFlag,
          configRemark: param.configRemark,
          configTips: param.configTips,
          configCategory: param.configCategory
        }
      }
    },
    verifyParam () {
      if (this.config.configType &&
        this.config.configContent &&
        this.config.configFlag &&
        this.config.configRemark &&
        this.config.configCategory &&
        this.config.configTips) {
        if (this.dialogTitle === '新增') {
          this.createConfig()
        } else {
          this.editConfig()
        }
      } else {
        this.formErr = true
      }
    },
    // 新增
    createConfig () {
      let data = Object.assign({}, this.config)
      this.dialogLoading = true
      addConfig(data)
        .then(() => {
          this.dialogLoading = false
          this.visible = false
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.queryList()
        })
        .catch(err => {
          this.dialogLoading = false
          this.$message.error(err.message)
        })
    },
    // 编辑
    editConfig () {
      let data = Object.assign({ configId: this.currentRow.configId }, this.config)
      this.dialogLoading = true
      modifyConfig(data)
        .then(() => {
          this.dialogLoading = false
          this.visible = false
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.queryList()
        })
        .catch(err => {
          this.dialogLoading = false
          this.$message.error(err.message)
        })
    }
  }
}
</script>

<style scoped>

</style>
