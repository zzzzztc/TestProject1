<template>
  <!--  <div>规则管理</div>-->
  <div id="RuleManage" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="启用状态" v-model="filter.enabled"  @keydown.enter.native="getRuleList()">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="规则名称" v-model="filter.name" @keydown.enter.native="getRuleList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="规则描述" v-model="filter.description" @keydown.enter.native="getRuleList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="filter.activityId" placeholder="活动名称" clearable size="medium" @keydown.enter.native="getRuleList()">
            <el-option v-for="item in themeTypeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getRuleList()">查询</el-button>
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
          :data="ruleList.contents"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
<!--          <el-table-column type="selection"></el-table-column>-->
          <el-table-column label="规则名称" v-if="tableList.name" prop="name" min-width="120"></el-table-column>
          <el-table-column label="规则描述" v-if="tableList.description" prop="description" min-width="140"></el-table-column>
          <el-table-column label="奖品类型" v-if="tableList.type" prop="type" min-width="120">
            <template slot-scope="scope">
              {{scope.row.type | prizeTypeMap}}
            </template>
          </el-table-column>
          <el-table-column label="奖品数量" v-if="tableList.prizeNum" prop="prizeNum" min-width="100"></el-table-column>
          <el-table-column label="权重" v-if="tableList.weight" prop="weight" min-width="60"></el-table-column>
          <el-table-column label="奖品名称" v-if="tableList.prizeName" prop="prizeName" min-width="140"></el-table-column>
          <el-table-column label="活动名称" v-if="tableList.activityName" prop="activityName" min-width="120"></el-table-column>
          <el-table-column label="创建时间" v-if="tableList.createTime" prop="createTime" min-width="160"></el-table-column>
          <el-table-column label="创建人" v-if="tableList.createBy" prop="createBy" min-width="100"></el-table-column>
          <el-table-column label="修改时间" v-if="tableList.modifyTime" prop="modifyTime" min-width="160"></el-table-column>
          <el-table-column label="修改人" v-if="tableList.modifyBy" prop="modifyBy" min-width="100"></el-table-column>
          <el-table-column label="状态" v-if="tableList.status" prop="status" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">禁用</span>
              <span v-if="scope.row.status === 1">启用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="200" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click='handleStatus(scope.row.id, scope.row.status)' v-if="scope.row.status === 1" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handleStatus(scope.row.id, scope.row.status)' v-if="scope.row.status === 0" title="禁用">启用</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.id)">删除</span>
              <span class="active-text mr-5" title="查看详情" @click="handleDetail(scope.row.id)">查看详情</span>
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
            :total="ruleList.totalRows">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--新增弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="840px" :close-on-click-modal="false">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">排序</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="排序" clearable v-model="editForm.sort"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.sort">排序不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">规则名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="名称" clearable v-model="editForm.name"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.name">名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">奖品数量</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="奖品数量" clearable v-model="editForm.prizeNum"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.prizeNum">名称不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">权重</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="权重" clearable v-model="editForm.weight"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.weight">权重不可为空</div>
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
            <div class="column">
              <div class="label required">奖品名称</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.prizeId" placeholder="请选择奖品名称" size="medium">
                  <el-option v-for="item in prizeTypeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.prizeId">奖品名称不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">奖品类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.type" placeholder="请选择奖品类型" size="medium" @change="isChange">
                  <el-option key="0" label="谢谢参与" value="0"></el-option>
                  <el-option key="1" label="添加积分" value="1"></el-option>
                  <el-option key="2" label="绑定优惠券" value="2"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.type">奖品类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">{{editForm.type | contentTypeMap}}</div>
              <div class="ipt-medium">
                <el-input type="text" size="medium" placeholder="奖品内容" clearable v-model="editForm.content" v-if="editForm.type === '' || editForm.type === '0'" :disabled="editForm.type === '' || editForm.type === '0'"></el-input>
                <el-input type="text" size="medium" placeholder="积分值" clearable v-model="editForm.content" v-if="editForm.type === '1'"></el-input>
                <el-select v-model="editForm.content" placeholder="请选择优惠券类型" size="medium" v-if="editForm.type === '2'">
                  <el-option v-for="item in couponList" :key="item.templateId" :value="item.templateId" :label="item.templateName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && ((editForm.type === '1' && !editForm.content) || (editForm.type === '2' && !editForm.content))">{{editForm.type | contentTypeMap}}不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">有效期限</div>
              <div class="ipt-medium">
                <el-date-picker
                  v-model="editForm.validDate"
                  class="w-200"
                  size="medium"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="有效期限"
                  :disabled="editForm.type !== '1'">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && (editForm.type === '1' && !editForm.validDate)">有效期限不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">规则描述</div>
              <div class="ipt-medium">
                <el-input
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="描述"
                  v-model="editForm.description">
                </el-input>
              </div>
            </div>
          </div>
          <div class="row ruleDeploy">
            <div class="column">
              <div class="label">规则配置：</div>
              <div class="ipt-medium">
                <div>1. 奖品规则：配置奖品权重和数量， 奖品权重与数量的乘积/所有奖品权重与数量乘积的总和。</div>
                <div>2. 失败次数/成功次数：配置系数，当用户成功次数达到一定，用户抽到奖品概率减去原概率系数的百分比，</div>
                <div> 当失败一定次数， 用户抽奖到奖品概率等于原概率加上原概率乘以系数的百分比</div>
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
    <!--抽奖奖品详情-->
    <el-dialog v-dialogDrag title="抽奖规则详情" :visible.sync="ruleVisible" width="860px">
      <div class="dialog-container">
        <div class="dialog-main">
          <el-table
            :data="ruleDetailList"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="规则名称" prop="name"></el-table-column>
            <el-table-column label="规则描述" prop="description"></el-table-column>
            <el-table-column label="奖品类型" prop="type">
              <template slot-scope="scope">
                {{scope.row.type | prizeTypeMap}}
              </template>
            </el-table-column>
            <el-table-column :label="contentLabel" prop="content"></el-table-column>
          </el-table>
          <el-table
            :data="ruleDetailList"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="有效期限" prop="validDate"></el-table-column>
            <el-table-column label="状态" prop="status">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">禁用</span>
                <span v-if="scope.row.status === 1">启用</span>
              </template>
            </el-table-column>
            <el-table-column label="奖品数量" prop="prizeNum"></el-table-column>
            <el-table-column label="权重" prop="weight"></el-table-column>
            <el-table-column label="奖品名称" prop="prizeName"></el-table-column>
          </el-table>
          <el-table
            :data="ruleDetailList"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="活动名称" prop="activityName"></el-table-column>
            <el-table-column label="创建人" prop="createBy"></el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="修改人" prop="modifyBy"></el-table-column>
            <el-table-column label="修改时间" prop="modifyTime"></el-table-column>
          </el-table>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" @click="ruleVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { filterIds, getPrizeList, getThemeList } from '../../../utils/index'
import { queryRuleList, queryRuleAdd, queryRuleUpdate, queryRuleDelete, queryRuleStatus, queryRuleDetail, queryCouponList } from './api'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'RuleManage',
  data () {
    return {
      loading: false, // 加载
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      dataViewHeight: null,
      componentName: 'RuleManage',
      multipleSelection: [], // 表格多选
      filter: {
        enabled: '',
        name: '',
        description: '',
        activityId: '',
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件列表
      tableList: {
        name: true,
        description: true,
        type: true,
        status: true,
        prizeNum: true,
        weight: true,
        prizeName: true,
        activityName: true,
        createTime: false,
        createBy: false,
        modifyTime: false,
        modifyBy: false
      }, // 表格数据
      ruleList: {}, // 表格展示数据
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: false, // 添加/修改弹出框 -- 切换添加/修改
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      isJudge: false, // 添加/修改弹出框 -- 输入框判断最大值
      popupTitle: '', // 添加/修改弹出框 -- 标题
      editForm: {}, // 添加/修改弹出框 -- 数据表单
      ruleVisible: false, // 抽奖主题详情弹出框 -- 显示隐藏
      ruleDetailList: [], // 抽奖主题详情弹出框 -- 数据表单
      couponList: [], // 优惠券数据表单
      contentLabel: ''
    }
  },
  created () {
    this.getCouponList()
    this.judgeChannelList()
    this.getRuleList(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  filters: {
    contentTypeMap (type) {
      let contentType = ''
      switch (type) {
        case '0':
          contentType = '奖品内容'
          break
        case '1':
          contentType = '积分值'
          break
        case '2':
          contentType = '优惠券'
          break
        default:
          contentType = '奖品内容'
          break
      }
      return contentType
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      themeTypeList: state => state.app.themeTypeList,
      prizeTypeList: state => state.app.prizeTypeList
    })
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      // if (!this.themeTypeList.length) {
      getThemeList()
      // }
      // if (!this.prizeTypeList.length) {
      getPrizeList()
      // }
    },

    // 分页导航
    handleSizeChange (pages) {
      this.getRuleList(null, pages)
    },
    handleCurrentChange (page) {
      this.getRuleList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取优惠券列表
    getCouponList () {
      queryCouponList().then(res => {
        this.couponList = res.data
      }).catch(err => {
        this.$message.error(err.data || err.message)
      })
    },

    // 获取表格数据
    getRuleList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.filter.isJson = true
      queryRuleList(this.filter).then(res => {
        this.ruleList = res.data
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
      this.filter.description = ''
      this.filter.activityId = ''
      this.filter.isJson = true
      this.getRuleList()
    },

    // 添加、修改弹出框 -- 显示隐藏
    handleEdit (params) {
      this.editVisible = true
      this.resetEdit()
      this.judgeChannelList()
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
      this.editForm.id = params.id
      this.editForm.sort = JSON.stringify(params.sort)
      this.editForm.name = params.name
      this.editForm.description = params.description
      this.editForm.prizeNum = JSON.stringify(params.prizeNum)
      this.editForm.weight = JSON.stringify(params.weight)
      this.editForm.type = JSON.stringify(params.type)
      this.editForm.activityId = params.activityId
      this.editForm.prizeId = params.prizeId
      this.editForm.content = params.content
      this.editForm.validDate = params.validDate
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
      queryRuleDelete(id).then(res => {
        this.editVisible = false
        this.getRuleList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.data || err.message)
      })
    },

    // 监听奖品类型
    isChange (e) {
      if (e) {
        this.editForm.content = ''
        this.editForm.validDate = ''
      }
    },

    // 添加、修改弹出框 -- 提交
    saveEdit () {
      if (this.editForm.sort && this.editForm.name &&
        this.editForm.prizeNum && this.editForm.weight &&
        this.editForm.activityId && this.editForm.prizeId &&
        this.editForm.type) {
        if (this.editForm.type === '1') {
          if (this.editForm.content && this.editForm.validDate) {
            this.getParamData()
          } else {
            this.isEmpty = true
          }
        } else if (this.editForm.type === '2') {
          if (this.editForm.content) {
            this.getParamData()
          } else {
            this.isEmpty = true
          }
        } else {
          this.getParamData()
        }
      } else {
        this.isEmpty = true
      }
    },

    // 添加弹出框 -- 提交参数处理
    getParamData () {
      let data = JSON.parse(JSON.stringify(this.editForm))
      data.isJson = true
      if (this.isReset === false) {
        this.getUpdateData(data)
      } else {
        this.getAddData(data)
      }
    },

    // 添加弹出框 -- 提交接口
    getAddData (data) {
      queryRuleAdd(data).then(res => {
        this.editVisible = false
        this.getRuleList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.data || err.message)
      })
    },

    // 修改弹出框 -- 提交接口
    getUpdateData (data) {
      queryRuleUpdate(data).then(res => {
        this.editVisible = false
        this.getRuleList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.data || err.message)
      })
    },

    // 添加、修改弹出框 -- 重置
    resetEdit () {
      this.editForm = {
        sort: '',
        name: '',
        description: '',
        prizeNum: '',
        weight: '',
        type: '',
        activityId: '',
        prizeId: '',
        content: '',
        validDate: ''
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
      queryRuleStatus(data).then(res => {
        this.editVisible = false
        this.getRuleList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.data || err.message)
      })
    },

    // 查看详情
    handleDetail (id) {
      this.ruleVisible = true
      this.ruleDetailList = []
      queryRuleDetail(id).then(res => {
        this.ruleDetailList.push(res.data)
        for (let item of this.ruleDetailList) {
          if (item.type === 1) {
            this.contentLabel = '积分值'
          } else if (item.type === 2) {
            this.contentLabel = '优惠券'
          } else {
            this.contentLabel = '奖品内容'
          }
        }
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
  .ruleDeploy {
    .column {
      width: 100%;
      .label {
        font-weight: bold;
      }
    }
  }
</style>
