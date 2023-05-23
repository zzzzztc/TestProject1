<template>
  <!--<div>动态运价维护</div>-->
  <div id="SpreadProductManage" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="名称" v-model="filter.ruleName" @keydown.enter.native="getFdBasicPriceList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="编号" v-model="filter.ruleCode" @keydown.enter.native="getFdBasicPriceList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='filter.channel' clearable placeholder="渠道" size="medium">
            <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.saleBeginTime"
            class="w-180"
            size="medium"
            value-format="yyyyMMdd"
            type="date"
            placeholder="生效开始">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.saleEndTime"
            class="w-180"
            size="medium"
            value-format="yyyyMMdd"
            type="date"
            placeholder="生效截止">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.flightBeginDate"
            class="w-180"
            size="medium"
            value-format="yyyyMMdd"
            type="date"
            placeholder="航班开始">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.flightEndDate"
            class="w-180"
            size="medium"
            value-format="yyyyMMdd"
            type="date"
            placeholder="航班截止">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getFdBasicPriceList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(null)">新增规则</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="FdFreightMaintainList.data"
          v-loading="loading"
          :height="dataViewHeight"
          row-key="lowestpriceid"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column label="名称" prop="ruleName" min-width="48"></el-table-column>
          <el-table-column label="编号" prop="ruleCode" min-width="48"></el-table-column>
          <el-table-column label="类型" prop="type" min-width="56">
            <template slot-scope="scope">
              <div v-if="scope.row.ruleType === '0'">高舱赠送</div>
              <div v-if="scope.row.ruleType === '1'">绑定销售</div>
              <div v-if="scope.row.ruleType === '2'">最低舱销售</div>
            </template>
          </el-table-column>
          <el-table-column label="生效时间" prop="saleBeginTime" min-width="56">
            <template slot-scope="scope">
              <div>{{ scope.row.saleBeginTime }}</div>
            </template>
          </el-table-column>
          <el-table-column label="失效时间" prop="saleEndTime" min-width="56"></el-table-column>
          <el-table-column label="航班开始日期" prop="flightBeginDate" min-width="50"></el-table-column>
          <el-table-column label="航班截止日期" prop="flightEndDate" min-width="50"></el-table-column>
          <el-table-column label="渠道" min-width="56">
            <template slot-scope="scope">
              <span>{{scope.row.channel | channelMap}}</span>
            </template>
          </el-table-column>
          <el-table-column label="舱位" prop="cabin"></el-table-column>
          <el-table-column label="上浮差价" prop="rulePrice"></el-table-column>
          <el-table-column label="状态" prop="ruleFlag" min-width="42">
            <template slot-scope="scope">
              <div v-if="scope.row.ruleFlag === '0'">禁用</div>
              <div v-if="scope.row.ruleFlag === '1'">启用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="64">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row)">删除</span>
              <span class="active-text mr-5" title="配置" @click="queryConfig(scope.row)">配置</span>
              <span class="active-text mr-5" title="产品" @click="queryProduct(scope.row)">产品</span>
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
            :total="FdFreightMaintainList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--新增/修改弹出框-->
    <el-dialog v-dialogDrag :title="popupTitle" :visible.sync="editVisible" width="820px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.ruleType" placeholder="请选择规则类型" size="medium">
                  <el-option key="0" label="高舱赠送" value="0"></el-option>
                  <el-option key="1" label="绑定销售" value="1"></el-option>
                  <el-option key="2" label="最低舱销售" value="2"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.ruleType">规则类别不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="名称" clearable v-model="editForm.ruleName"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.ruleName">名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">状态</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.ruleFlag" placeholder="请选择规则状态" size="medium" collapse-tags>
                  <el-option key="1" label="启用" value="1"></el-option>
                  <el-option key="0" label="禁用" value="0"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.ruleFlag">规则状态不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">渠道编号</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.channel" placeholder="请选择渠道编号" multiple size="medium" collapse-tags>
                  <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.channel.length">渠道编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">生效时间</div>
              <div class="ipt-medium">
                <el-date-picker
                  v-model="editForm.saleBeginTime"
                  value-format="yyyyMMdd"
                  size="medium"
                  type="date"
                  placeholder="选择生效日期">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.saleBeginTime">生效日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">失效时间</div>
              <div class="ipt-medium">
                <el-date-picker
                  v-model="editForm.saleEndTime"
                  value-format="yyyyMMdd"
                  size="medium"
                  type="date"
                  placeholder="选择截止日期">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.saleEndTime">截止日期不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">航班开始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  v-model="editForm.flightBeginDate"
                  value-format="yyyyMMdd"
                  size="medium"
                  type="date"
                  placeholder="选择航班开始日期">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.flightBeginDate">航班开始日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航班结束日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  v-model="editForm.flightEndDate"
                  value-format="yyyyMMdd"
                  size="medium"
                  type="date"
                  placeholder="选择航班结束日期">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.flightEndDate">航班结束日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">舱位</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="请输入舱位" v-model="editForm.cabin"></el-input>
<!--                <div class="warning-info" v-if="isEmpty && !editForm.cabin">舱位不可为空</div>-->
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label" :class="{ required: editForm.ruleType === '0' }">上浮差价</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="请输入上浮差价" v-model="editForm.rulePrice"></el-input>
                <div class="warning-info" v-if="isEmpty && editForm.ruleType === '0' && !editForm.rulePrice">请输入上浮差价</div>
              </div>
            </div>
          </div>
<!--          <div v-if="!isReset" class="row">-->
<!--            <el-button size="medium" @click="bindConfig(true, null)">关联配置</el-button>-->
<!--          </div>-->
          <div v-show="!isReset && editForm.configs && editForm.configs.length" class="row">
            <div class="label">配置</div>
            <div class="item-contain" v-for="(item, index) in editForm.configs" :key="index">
              <div class="header">
                <div class="label">{{ item.label }}</div>
              </div>
              <div v-if="item.children && item.children.length" class="content">
                <div class="item" v-for="(val, id) in item.children" :key="id">
                  <div class="label">{{ val.label }}</div>
                </div>
              </div>
              <div v-else class="content">
                <div class="item">暂未绑定该类型的配置</div>
              </div>
            </div>
          </div>
          <div v-if="!isReset && editForm.type === '1'" class="row">
            <el-button size="medium" @click="bindConfig(false, null)">关联产品</el-button>
          </div>
          <div v-show="!isReset && editForm.type === '1' && editForm.products && editForm.products.length" class="row">
            <span class="product-name" v-for="(pro, proId) in editForm.products" :key="proId">{{ pro.productName }}</span>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" @click="resetEdit">重置</el-button>
        </div>
      </div>
    </el-dialog>
    <!--绑定配置/产品弹出框-->
    <el-dialog v-dialogDrag :title="bindTitle" :visible.sync="bindVisible" width="820px" append-to-body>
      <div class="dialog-container">
        <div v-if="isConfig" class="dialog-main">
          <config-manage :is-bind="true" :bind-type="editForm.configType" :checked-list="checkedList" @getBindData="getBindData"></config-manage>
        </div>
        <div v-if="!isConfig" class="dialog-main">
          <product-manage :is-bind="true" @getBindData="getBindData"></product-manage>
        </div>
      </div>
    </el-dialog>
    <!--查看规则详情-->
    <el-dialog v-dialogDrag title="规则详情" :visible.sync="infoVisible" width="820px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label">类型</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="类型" readonly :value="editForm.type === '0' ? '高舱赠送' : '绑定销售'"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="名称" readonly v-model="editForm.ruleName"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">状态</div>
              <div class="ipt-medium">
                <el-input size="medium" readonly :value="editForm.status === '1' ? '启用' : '禁用'"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">产品系数</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="产品系数" readonly v-model="editForm.rebateRatio"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">生效时间</div>
              <div class="ipt-medium">
                <el-input size="medium" readonly v-model="editForm.saleBeginTime"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">失效时间</div>
              <div class="ipt-medium">
                <el-input size="medium" readonly v-model="editForm.saleEndTime"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">航司码</div>
              <div class="ipt-medium">
                <el-input size="medium" readonly v-model="editForm.airline"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">航班开始日期</div>
              <div class="ipt-medium">
                <el-input size="medium" readonly v-model="editForm.beginTime"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">航班结束日期</div>
              <div class="ipt-medium">
                <el-input size="medium" readonly v-model="editForm.endTime"></el-input>
              </div>
            </div>
            <!--<div class="column">
              <div class="label">渠道编号</div>
              <div class="ipt-medium">
                <el-input size="medium" readonly v-model="editForm.channel"></el-input>
              </div>
            </div>-->
          </div>
          <div class="row">
            <div class="type-label">配置</div>
            <div class="item-contain" v-for="(item, index) in editForm.configs" :key="index">
              <div class="header">
                <div class="label">{{ item.label }}</div>
                <div class="upd" @click="bindConfig(true, item)">{{ item.children && item.children.length ? '修改' : '添加' }}</div>
              </div>
              <div v-if="item.children && item.children.length" class="content">
                <div class="item" v-for="(val, id) in item.children" :key="id">
                  <div class="label">{{ val.label }}</div>
                </div>
              </div>
              <div v-else class="content">
                <div class="item">暂未绑定该类型的配置</div>
              </div>
            </div>
          </div>
          <div v-if="editForm.type === '1'" class="row">
            <div class="type-label">
              产品
              <span class="upd" @click="bindConfig(false, '绑定销售')">修改</span>
            </div>
            <div v-if="editForm.products && editForm.products.length" class="item-contain">
              <span class="product-name" v-for="(pro, proId) in editForm.products" :key="proId">{{ pro.productName }}</span>
            </div>
            <div v-else class="item-contain default">尚未绑定产品</div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--配置-->
    <div v-if="configVisible">
      <el-dialog :visible.sync="configVisible" title="配置">
        <rule-config :rule-id="currentRow.ruleId" :visible.sync="configVisible"></rule-config>
      </el-dialog>
    </div>
    <!--产品-->
    <div v-if="productVisible">
      <el-dialog :visible.sync="productVisible" title="产品">
        <product-config :rule-id="currentRow.ruleId" :visible.sync="productVisible"></product-config>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  queryRulerByInfo,
  updateConfigsInRuler,
  queryConfigsInRuler,
  queryProductsInRuler,
  updateProductsInRuler,
  addRulers,
  updateRuler,
  deleteRulers
} from './api'
import { computWidth } from '../../../mixins/computWidt'
import { getChannelList, dateFormater } from '../../../utils/index'
import ConfigManage from '../configManage/index'
import ProductManage from '../productManage/index'
import RuleConfig from './config'
import ProductConfig from './product'

export default {
  name: 'SpreadProductManage',
  components: {
    ConfigManage,
    ProductManage,
    RuleConfig,
    ProductConfig
  },
  data () {
    return {
      loading: false,
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      filter: {
        ruleName: '', // 名称
        ruleCode: '', // 编号
        channel: '', // 渠道
        saleBeginTime: '', // 规则生效时间
        saleEndTime: '', // 规则失效时间
        flightBeginTime: '', // 航班开始时间
        flightEndTime: '', // 航班截止时间
        page: '',
        rows: ''
      }, // 查询条件
      FdFreightMaintainList: {}, // 查询结果表单
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: '0', // 添加/修改弹出框 -- 切换编辑内容  0：新增规则 1：新增配置 2：新增产品 3：编辑规则 4：查看规则详情
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      popupTitle: '', // 添加/修改弹出框 -- 标题
      editForm: {}, // 添加/修改弹出框 -- 数据表单
      bindVisible: false, // 绑定配置/绑定产品弹出框 -- 显示隐藏
      bindTitle: '', // 绑定配置/绑定产品弹出框 -- 标题
      isConfig: true, // 绑定配置/绑定产品弹出框 -- 切换配置/产品
      infoVisible: false, // 规则详情弹出框 -- 显示隐藏
      checkedList: [], // 已绑定某类型配置
      currentRow: {},
      configVisible: false,
      productVisible: false
    }
  },
  created () {
    this.getFdBasicPriceList(1, this.pagination.pageSize)
    this.getChannelList()
  },
  computed: {
    ...mapState({
      channelList: state => state.app.channelList, // 渠道
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      baseUrl: state => state.app.baseUrl
    })
  },
  filters: {
    upper (value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    },
    dateParam (value) {
      if (value) {
        let date = value.split('-')
        return date[0] + date[1] + date[2]
      } else {
        return ''
      }
    }
  },
  mixins: [computWidth],
  provide: function () {
    return {
      selConfigs: this.selConfigs
    }
  },
  methods: {
    handleCellStyle () {
      return 'table-th'
    },
    // 分页导航
    handleSizeChange (pages) {
      this.getFdBasicPriceList(null, pages)
    },
    handleCurrentChange (page) {
      this.getFdBasicPriceList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getDateParam () {
      this.filter.flightDateStart = this.filter.flightDateStart.p
    },
    // 获取表格数据
    getFdBasicPriceList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      let data = JSON.parse(JSON.stringify(this.filter))
      data.saleBeginTime = this.$options.filters.dateParam(data.saleBeginTime)
      data.saleEndTime = this.$options.filters.dateParam(data.saleEndTime)
      data.beginTime = this.$options.filters.dateParam(data.beginTime)
      data.endTime = this.$options.filters.dateParam(data.endTime)
      let param = {
        arr: data,
        isJson: true
      }
      queryRulerByInfo(param).then(res => {
        this.FdFreightMaintainList = res
        this.loading = false
        // this.listDataFormater()
      })
    },
    // 列表数据格式化
    listDataFormater () {
      this.FdFreightMaintainList.data.forEach(item => {
        item.flightBeginDate = dateFormater(item.flightBeginDate)
        item.flightEndDate = dateFormater(item.flightEndDate)
        item.saleBeginTime = dateFormater(item.saleBeginTime)
        item.saleEndTime = dateFormater(item.saleEndTime)
      })
    },
    // 查询条件重置
    resetFilter () {
      this.filter.rulerName = ''
      this.filter.rulerCode = ''
      this.filter.channel = ''
      this.filter.saleBeginTime = ''
      this.filter.saleEndTime = ''
      this.filter.beginTime = ''
      this.filter.endTime = ''
      this.getFdBasicPriceList(1, this.pagination.pageSize)
    },
    // 新增弹出框 -- 显示隐藏
    handleEdit (param) {
      this.editVisible = true
      this.resetEdit()
      if (param) {
        this.isReset = true
        this.popupTitle = '修改规则'
        this.hangdleParams(param)
      } else {
        this.isReset = false
        this.popupTitle = '新增规则'
        this.editForm = {
          airline: 'NS',
          status: '1'
        }
      }
    },
    // 新增弹出框 -- 数据处理
    hangdleParams (params) {
      this.editForm = JSON.parse(JSON.stringify(params))
      this.editForm.channel = params.channel ? params.channel.split(',') : params.channel
    },
    // 新增弹出框 -- 提交
    saveEdit () {
      if (this.editForm.ruleName &&
        this.editForm.ruleType &&
        this.editForm.saleBeginTime &&
        this.editForm.saleEndTime &&
        this.editForm.flightBeginDate &&
        this.editForm.flightEndDate &&
        this.editForm.ruleFlag &&
        this.editForm.channel &&
        this.editForm.channel.length) {
        if ((this.editForm.ruleType === '0' && !this.editForm.rulePrice)) {
          this.isEmpty = true
          return false
        }
        let data = JSON.parse(JSON.stringify(this.editForm))
        // 格式化绑定的配置
        if (this.editForm.configs && this.editForm.configs.length) {
          let configs = []
          this.editForm.configs.forEach(item => {
            configs = configs.concat(this.contantConfigs(item.children))
          })
          data.configs = configs
        }
        data.channel = data.channel.join(',')
        if (this.isReset) {
          this.updateParamsData(data)
        } else {
          this.addParamsData(data)
        }
      } else {
        this.isEmpty = true
      }
    },
    // 新增规则接口
    addParamsData (data) {
      let param = {
        arr: [data],
        isJson: true
      }
      addRulers(param).then(res => {
        this.editVisible = false
        this.getFdBasicPriceList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    updateParamsData (data) {
      let param = {
        arr: data,
        isJson: true
      }
      updateRuler(param).then(() => {
        this.editVisible = false
        this.getFdBasicPriceList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 弹出框 -- 重置
    resetEdit () {
      this.editForm = {}
      this.isEmpty = false
    },
    // 绑定配置/绑定产品弹出框
    bindConfig (isConfig, type) {
      this.bindVisible = true
      this.isConfig = isConfig
      if (isConfig && type && type.value) {
        this.editForm.configType = type.value
        this.checkedList = type.children
      }
      if (!isConfig && type) this.editForm.productType = type
      if (isConfig) {
        this.bindTitle = '绑定配置'
      } else {
        this.bindTitle = '绑定产品'
      }
    },
    // channel没有则请求服务器
    getChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 获取选中数据
    getBindData (data) {
      this.bindVisible = false
      if (this.isConfig) {
        if (this.editForm.configType) {
          // 详情修改配置
          this.editForm.configs.forEach(item => {
            if (item.value === this.editForm.configType) {
              item.children = data
            }
          })
          this.updateConfigsInRuler(data)
        } else {
          // 格式化数据
          let configs = this.formatConfigs(data)
          this.editForm.configs = []
          configs.forEach(item => {
            if (item.children && item.children.length) {
              this.editForm.configs.push(JSON.parse(JSON.stringify(item)))
            }
          })
        }
      } else {
        this.editForm.products = data
        if (this.editForm.productType) {
          this.updateProductsInRuler(data)
        }
      }
    },
    // 查看规则详情
    detail (data) {
      this.editForm = JSON.parse(JSON.stringify(data))
      this.infoVisible = true
      this.queryConfigsInRuler(data)
      this.queryProductsInRuler(data)
    },
    // 查询规则中的配置接口
    queryConfigsInRuler (data) {
      data.isJson = true
      queryConfigsInRuler(data).then(res => {
        this.editForm.configs = this.formatConfigs(res.data)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 查询规则中的产品接口
    queryProductsInRuler (data) {
      data.isJson = true
      queryProductsInRuler(JSON.parse(JSON.stringify(data))).then(res => {
        this.editForm.products = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 修改规则中的配置
    updateConfigsInRuler (data) {
      let param = JSON.parse(JSON.stringify(this.editForm))
      param.configs = this.contantConfigs(data)
      param.isJson = true
      updateConfigsInRuler(param).then(res => {
        this.infoVisible = false
        this.getFdBasicPriceList()
        this.$message.success('操作成功')
        this.resetEdit()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 修改规则中的产品
    updateProductsInRuler (data) {
      let param = JSON.parse(JSON.stringify(this.editForm))
      delete param.configs
      param.productType = '实体'
      param.products = data.map(item => {
        return {
          id: item.id
        }
      })
      param.isJson = true
      updateProductsInRuler(JSON.parse(JSON.stringify(param))).then(res => {
        this.infoVisible = false
        this.getFdBasicPriceList()
        this.$message.success('操作成功')
        this.resetEdit()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 配置分类
    formatConfigs (data) {
      if (!data.length || !data[0].label) {
        data = data.map(item => {
          return {
            id: item.id,
            label: item.configContent,
            value: item.configContent,
            parent: item.configType,
            configId: item.id
          }
        })
      }
      let configs = [
        {
          id: 'route',
          label: '航线',
          value: 'route',
          children: [],
          open: false,
          sel: false
        },
        {
          id: 'fnumber',
          label: '航班号',
          value: 'fnumber',
          children: [],
          open: false,
          sel: false
        },
        {
          id: 'cabin',
          label: '舱位',
          value: 'cabin',
          children: [],
          open: false,
          sel: false
        },
        {
          id: 'ex_fnumber',
          label: '排除航班号',
          value: 'ex_fnumber',
          children: [],
          open: false,
          sel: false
        },
        {
          id: 'ex_cabin',
          label: '排除舱位',
          value: 'ex_cabin',
          children: [],
          open: false,
          sel: false
        }
      ]
      for (let i = 0; i < data.length; i++) {
        switch (data[i].parent) {
          case 'route':
            configs[0].children.push(data[i])
            break
          case 'fnumber':
            configs[1].children.push(data[i])
            break
          case 'cabin':
            configs[2].children.push(data[i])
            break
          case 'ex_fnumber':
            configs[3].children.push(data[i])
            break
          case 'ex_cabin':
            configs[4].children.push(data[i])
            break
        }
      }
      return configs
    },
    // 配置合并（不分类）
    contantConfigs (data) {
      let configs = []
      let config = {}
      for (let i = 0; i < data.length; i++) {
        config = {
          id: data[i].configId,
          airline: 'NS',
          configType: data[i].parent,
          configContent: data[i].value
        }
        configs.push(config)
      }
      return configs
    },
    // 删除
    handleDelete (data) {
      let datas = [data] || this.multipleSelection
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        // 删除
        this.getDeleteData(datas)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 删除
    getDeleteData (data) {
      let param = {
        arr: data,
        isJson: true
      }
      deleteRulers(param).then(() => {
        this.$message.success('操作成功')
        this.getFdBasicPriceList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    /**************************************/
    // 配置及商品
    /**************************************/
    queryConfig (row) {
      this.currentRow = row
      this.configVisible = true
    },
    queryProduct (row) {
      this.currentRow = row
      this.productVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
  .product-item {
    border: 1px solid #eee;
    margin-bottom: 15px;
  }
  .item-title {
    background: #f3f3f3;
    height: 38px;
    padding: 0 15px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .item-contain {
    text-align: start;
    border: 1px solid #f3f3f3;
    margin-bottom: 5px;
    .header {
      height: 38px;
      line-height: 38px;
      display: flex;
      background: #f3f3f3;
      .icon {
        width: 10px;
        height: 10px;
        display: inline-block;
        margin-right: 10px;
        cursor: pointer;
        background-image: url("../../../assets/zhankai.svg");
        background-size: cover;
        background-position: -2px 2px;
        background-repeat: no-repeat;
      }
      .open {
        background-image: url("../../../assets/zhedie2.svg");
        background-size: 100%;
        background-position: 0 3px;
        background-repeat: no-repeat;
      }
      .label {
        margin: 0 5px;
      }
      .upd,.del {
        font-size: 12px;
        color: #409eff;
        margin-left: 5px;
      }
    }
    .content {
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      .item {
        line-height: 28px;
        margin-right: 10px;
        .label {
          margin-left: 5px;
        }
      }
    }
  }
  .type-label {
    margin-bottom: 10px;
    .upd {
      font-size: 12px;
      color: #409eff;
      margin-left: 5px;
    }
  }
  .default {
    padding: 10px;
  }
  .product-name {
    display: inline-block;
    margin: 10px;
  }
</style>
