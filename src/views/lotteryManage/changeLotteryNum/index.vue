
<template>
  <!--  <div>兑换可抽奖次数</div>-->
  <div id="ChangeLotteryNum" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="启用状态" v-model="filter.enabled"  @keydown.enter.native="getExchangeList()">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="可兑换积分名称" v-model="filter.name" @keydown.enter.native="getExchangeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="filter.activityId" placeholder="活动名称" size="medium" clearable @keydown.enter.native="getExchangeList()">
            <el-option v-for="item in themeTypeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getExchangeList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(), resetEdit()">添加</el-button>
<!--        <el-button type="danger" size="medium" :disabled="multipleSelection.length === 0" @click="handleDelete()">删除</el-button>-->
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
          :data="exchangeList.contents"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column label="可兑换积分名称" v-if="tableList.name" prop="name" min-width="120"></el-table-column>
          <el-table-column label="抽奖次数" v-if="tableList.num" prop="num" min-width="100"></el-table-column>
          <el-table-column label="积分" v-if="tableList.point" prop="point" min-width="100"></el-table-column>
          <el-table-column label="活动名称" v-if="tableList.activityName" prop="activityName" min-width="140"></el-table-column>
          <el-table-column label="创建时间" v-if="tableList.createTime" prop="createTime" min-width="160"></el-table-column>
          <el-table-column label="创建人" v-if="tableList.createBy" prop="createBy" min-width="100"></el-table-column>
          <el-table-column label="修改时间" v-if="tableList.modifyTime" prop="modifyTime" min-width="160"></el-table-column>
          <el-table-column label="修改人" v-if="tableList.modifyBy" prop="modifyBy" min-width="100"></el-table-column>
          <el-table-column label="状态" v-if="tableList.status" prop="status" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">禁用</span>
              <span v-if="scope.row.status === 1">启用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click='handleStatus(scope.row.id, scope.row.status)' v-if="scope.row.status === 1" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handleStatus(scope.row.id, scope.row.status)' v-if="scope.row.status === 0" title="禁用">启用</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.id)">删除</span>
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
            :total="exchangeList.totalRows">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--新增弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="560px" :close-on-click-modal="false">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">可兑换积分名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="名称" clearable v-model="editForm.name"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.name">名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">积分</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="积分" clearable v-model="editForm.point"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.point">积分不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">次数</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="次数" clearable v-model="editForm.num"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.num">次数不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">活动名称</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.activityId" placeholder="请选择活动名称" size="medium">
                  <el-option v-for="item in themeTypeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.activityId">活动名称不可为空</div>
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
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { filterIds, getThemeList } from '../../../utils/index'
import { queryExchangeList, queryExchangeAdd, queryExchangeDelete, queryExchangeStatus } from './api'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'ChangeLotteryNum',
  data () {
    return {
      loading: false, // 加载
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      dataViewHeight: null,
      componentName: 'ChangeLotteryNum',
      multipleSelection: [], // 表格多选
      filter: {
        enabled: '',
        name: '',
        activityId: '',
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件列表
      tableList: {
        name: true,
        num: true,
        point: true,
        activityName: true,
        createTime: false,
        createBy: false,
        modifyTime: false,
        modifyBy: false,
        status: true
      }, // 表格数据
      exchangeList: {}, // 表格展示数据
      imagePath: '', // 展示图片
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isEmpty: false, // 添加弹出框 -- 输入框判空
      popupTitle: '', // 添加弹出框 -- 标题
      editForm: {} // 添加弹出框 -- 数据表单
    }
  },
  created () {
    this.judgeChannelList()
    this.getExchangeList(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      themeTypeList: state => state.app.themeTypeList
    })
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      // if (!this.themeTypeList.length) {
      getThemeList()
      // }
    },
    // 分页导航
    handleSizeChange (pages) {
      this.getExchangeList(null, pages)
    },
    handleCurrentChange (page) {
      this.getExchangeList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getExchangeList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.filter.isJson = true
      queryExchangeList(this.filter).then(res => {
        this.exchangeList = res.data
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.data || err.message)
      })
    },

    // 查询条件重置
    resetFilter () {
      this.filter.enabled = ''
      this.filter.name = ''
      this.filter.activityId = ''
      this.filter.isJson = true
      this.getExchangeList()
    },

    // 添加弹出框 -- 显示隐藏
    handleEdit () {
      this.editVisible = true
      this.resetEdit()
      this.popupTitle = '添加'
    },

    // 删除
    handleDelete (id) {
      let ids = id || filterIds(this.multipleSelection, 'id').join('/')
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
      queryExchangeDelete(id).then(res => {
        this.editVisible = false
        this.getExchangeList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.data || err.message)
      })
    },

    // 添加弹出框 -- 提交
    saveEdit () {
      if (this.editForm.name && this.editForm.point && this.editForm.num && this.editForm.activityId) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        data.isJson = true
        this.getAddData(data)
      } else {
        this.isEmpty = true
      }
    },

    // 添加弹出框 -- 提交接口
    getAddData (data) {
      queryExchangeAdd(data).then(res => {
        this.editVisible = false
        this.getExchangeList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.data || err.message)
      })
    },

    // 添加弹出框 -- 重置
    resetEdit () {
      this.editForm = {
        name: '',
        point: '',
        num: '',
        activityId: ''
      }
      this.isEmpty = false
    },

    // 禁用/启用
    handleStatus (id, status) {
      let title = ''
      if (status === 0) {
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
          status: status === 0 ? 1 : 0
        }
        this.getStatusData(data)
      })
    },

    // 启用、禁用 -- 接口
    getStatusData (data) {
      queryExchangeStatus(data).then(res => {
        this.getExchangeList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.data || err.message)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .imgUrl{
    position: relative;
  }
  .imgUrl i{
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    font-size: 16px;
  }
  .copy-btn{
    color: #409EFF;
  }
</style>
