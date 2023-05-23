<template>
<!--  <div>航线推荐</div>-->
  <div id="RecommendRoute" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="出发地三字码" v-model="filter.departCode" @keydown.enter.native="getRecommendedRouteList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="到达地三字码" v-model="filter.arriCode" @keydown.enter.native="getRecommendedRouteList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="出发城市名称" v-model="filter.departName" @keydown.enter.native="getRecommendedRouteList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="到达城市名称" v-model="filter.arriName" @keydown.enter.native="getRecommendedRouteList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.fdateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班起飞开始时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.fdateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班起飞截止时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='filter.channel' clearable placeholder='渠道类型' size='medium' style='width: 180px' @keydown.enter.native="getRecommendedRouteList()">
            <el-option
              v-for='item in channelList'
              :key='item.chalId'
              :label='item.chalName'
              :value='item.chalCode'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.status" clearable placeholder="航线状态" @keydown.enter.native="getRecommendedRouteList()">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.isinter" clearable placeholder="国内/国际" @keydown.enter.native="getRecommendedRouteList()">
            <el-option label="国内" value="0"></el-option>
            <el-option label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.isChildren" clearable placeholder="是否携带儿童" @keydown.enter.native="getRecommendedRouteList()">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.isBaby" clearable placeholder="是否携带婴儿" @keydown.enter.native="getRecommendedRouteList()">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getRecommendedRouteList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(), resetEdit()">添加</el-button>
        <el-button type="danger" size="medium" :disabled="multipleSelection.length === 0" @click="handleDelete()">删除</el-button>
      </div>
      <div v-if="isColumn">
        <div class="search-container clearfix flex">
          <div class="check-ipt">
            <el-checkbox @change="checkHanler" v-model="checkedAll" :indeterminate="isIndeterminate">全选</el-checkbox>
          </div>
          <div>
            <div class="check-item check-ipt" v-for="item in checkList" :key="item.key">
              <el-checkbox-group v-model="checked" @change="handleCheck">
                <el-checkbox :label="item.key" :key="item.key" @change="handleoneCheck(item.key)">{{item.label}}</el-checkbox>
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
          :data="recommendedRouteList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column key="1" type="selection"></el-table-column>
          <el-table-column key="2" label="出发地三字码" v-if="tableList.departCode" prop="departCode" min-width="120"></el-table-column>
          <el-table-column key="3" label="到达地三字码" v-if="tableList.arriCode" prop="arriCode" min-width="120"></el-table-column>
          <el-table-column key="4" label="出发城市名称" v-if="tableList.departName" prop="departName" min-width="120"></el-table-column>
          <el-table-column key="5" label="到达城市名称" v-if="tableList.arriName" prop="arriName" min-width="120"></el-table-column>
          <el-table-column key="6" label="航班起飞开始时间" v-if="tableList.fdateStart" prop="fdateStart" min-width="140"></el-table-column>
          <el-table-column key="7" label="航班起飞截止时间" v-if="tableList.fdateEnd" prop="fdateEnd" min-width="140"></el-table-column>
          <el-table-column key="8" label="渠道" v-if="tableList.channel" min-width="160">
            <template slot-scope="scope">
              {{scope.row.channel | channelMap}}
            </template>
          </el-table-column>
          <el-table-column key="9" label="航线状态" v-if="tableList.status" prop="status" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status === '0'">禁用</span>
              <span v-if="scope.row.status === '1'">启用</span>
            </template>
          </el-table-column>
          <el-table-column key="10" label="国内/国际" v-if="tableList.isinter" prop="isinter" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.isinter === '0'">国内</span>
              <span v-if="scope.row.isinter === '1'">国际</span>
            </template>
          </el-table-column>
          <el-table-column key="11" label="是否携带儿童" v-if="tableList.isChildren" prop="isChildren" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.isChildren === '0'">否</span>
              <span v-if="scope.row.isChildren === '1'">是</span>
            </template>
          </el-table-column>
          <el-table-column key="12" label="是否携带婴儿" v-if="tableList.isBaby" prop="isBaby" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.isBaby === '0'">否</span>
              <span v-if="scope.row.isBaby === '1'">是</span>
            </template>
          </el-table-column>
          <el-table-column key="13" label="背景图片" v-if="tableList.picUrl" prop="picUrl" min-width="140">
            <template slot-scope="scope">
              <div class="imgUrl">
                <img :src="scope.row.picUrl" alt="" v-if="!scope.row.flag" style="width: 100px;height: 50px;cursor: pointer;" @click.stop="previewImg(scope.row)">
                <i type="primary" title='点击复制' class="el-icon-document copy-btn" :data-clipboard-text="scope.row.picUrl" :class="scope.row.selName" @click="copy(scope.row.selName)"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click='handleStatus(scope.row.recommendedRouteId, scope.row.status)' v-if="scope.row.status === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handleStatus(scope.row.recommendedRouteId, scope.row.status)' v-if="scope.row.status === '0'" title="禁用">启用</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.recommendedRouteId)">删除</span>
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
            :total="recommendedRouteList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--图片预览-->
    <el-dialog title="图片预览" :visible.sync="dialogImg" width="780px">
      <div class="dialog-container">
        <img :src="picPath" alt="" width="750" style="padding: 10px">
      </div>
    </el-dialog>
    <!--新增弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" v-dialogDrag width="820px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">出发地三字码</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="出发地三字码" clearable v-model="editForm.departCode"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.departCode">出发地三字码不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">到达地三字码</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="到达地三字码" clearable v-model="editForm.arriCode"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.arriCode">到达地三字码不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">出发城市名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="出发城市名称" clearable v-model="editForm.departName"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.departName">出发城市名称不可为空</div>
              </div>
            </div>
          </div>
          <!--第二排-->
          <div class="row">
            <div class="column">
              <div class="label required">到达城市名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="到达城市名称" clearable v-model="editForm.arriName"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.arriName">到达城市名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航班起飞开始时间</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="航班起飞开始时间"
                  v-model="editForm.fdateStart">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.fdateStart">航班起飞开始时间不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航班起飞截止时间</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="航班起飞截止时间"
                  v-model="editForm.fdateEnd">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.fdateEnd">航班起飞截止时间不可为空</div>
              </div>
            </div>
          </div>
          <!--第三排-->
          <div class="row">
            <div class="column">
              <div class="label required">渠道</div>
              <div class="ipt-medium">
                <el-select v-model='editForm.channel' multiple placeholder='全部' size='medium' collapse-tags>
                  <el-option
                    v-for='item in channelList'
                    :key='item.chalId'
                    :label='item.chalName'
                    :value='item.chalCode'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && editForm.channel.length === 0">渠道不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航线状态</div>
              <div class="fl ipt-medium">
                <el-select v-model='editForm.status' clearable placeholder='航线状态' size='medium'>
                  <el-option value="0" label="禁用"></el-option>
                  <el-option value="1" label="启用"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.status">航线状态不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">国际/国内</div>
              <div class="fl ipt-medium">
                <el-select v-model='editForm.isinter' clearable placeholder='国际/国内' size='medium'>
                  <el-option value="0" label="国内"></el-option>
                  <el-option value="1" label="国际"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.isinter">国际/国内不可为空</div>
              </div>
            </div>
          </div>
          <!--第四排-->
          <div class="row">
            <div class="column">
              <div class="label required">是否携带儿童</div>
              <div class="fl ipt-medium">
                <el-select v-model='editForm.isChildren' clearable placeholder='是否携带儿童' size='medium'>
                  <el-option value="0" label="否"></el-option>
                  <el-option value="1" label="是"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.isChildren">是否携带儿童不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">是否携带婴儿</div>
              <div class="fl ipt-medium">
                <el-select v-model='editForm.isBaby' clearable placeholder='是否携带婴儿' size='medium'>
                  <el-option value="0" label="否"></el-option>
                  <el-option value="1" label="是"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.isBaby">是否携带婴儿不可为空</div>
              </div>
            </div>
          </div>
          <!--第五排-->
          <div class="row">
            <div class="column">
              <label>
                <div class="label required">上传图片</div>
                <div style="width: 60px;height: 60px;border: 1px solid #ccc;text-align: center;">
                  <input type="file" style="display: none" @change="choiceImg($event)">
                  <img v-if="imgUrl" style="width: 60px;height: 60px;" :src="imgUrl" alt="">
                  <i v-if="!imgUrl" style="font-size: 40px;color: #ccc" class="el-icon-upload"></i>
                </div>
              </label>
              <div v-if="isEmpty && !imgUrl" class="danger-text">图片不可为空</div>
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
import { getChannelList, getObjectURL, filterIds } from '../../../utils/index'
import { queryRecommendedRouteList, addRecommendedRouteBean, updateRecommendedRouteBean, deleteRecommendedRouteBean, updateStatus } from './api'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import Clipboard from 'clipboard'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'RecommendRoute',
  data () {
    return {
      loading: false, // 加载
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      dataViewHeight: null,
      componentName: 'RecommendRoute',
      multipleSelection: [], // 表格多选
      filter: {
        departCode: '', // 出发地三字码
        arriCode: '', // 到达地三字码
        departName: '', // 出发城市名称
        arriName: '', // 到达城市名称
        fdateStart: '', // 航班起飞开始时间
        fdateEnd: '', // 航班起飞截止时间
        channel: '', // 渠道
        status: '', // 航线状态
        isinter: '', // 国际/国内
        isChildren: '', // 是否携带儿童
        isBaby: '', // 是否携带婴儿
        page: '',
        rows: ''
      }, // 查询条件列表
      recommendedRouteList: {}, // 查询结果数据
      tableList: {
        departCode: true,
        arriCode: true,
        departName: true,
        arriName: true,
        fdateStart: true,
        fdateEnd: true,
        channel: true,
        status: true,
        isinter: true,
        isChildren: true,
        isBaby: true,
        picUrl: true
      }, // 查询结果展示数据
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: false, // 添加/修改弹出框 -- 切换添加/修改
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      popupTitle: '', // 添加/修改弹出框 -- 标题
      editForm: {}, // 添加/修改弹出框 -- 数据表单
      imgList: '', // 添加/修改弹出框 -- 上传图片信息
      imgUrl: '', // 添加/修改弹出框 -- 图片路径
      picPath: '', // 图片预览
      dialogImg: false
    }
  },
  created () {
    this.judgeChannelList()
    this.getRecommendedRouteList(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  filters: {
    upper: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  methods: {
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },

    // 分页导航
    handleSizeChange (pages) {
      this.getRecommendedRouteList(null, pages)
    },
    handleCurrentChange (page) {
      this.getRecommendedRouteList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getRecommendedRouteList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      queryRecommendedRouteList(this.filter).then(res => {
        this.recommendedRouteList = res
        for (let item of this.recommendedRouteList.rows) {
          item['flag'] = false
          item['selName'] = 'sel' + item.recommendedRouteId
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },

    // 图片预览
    previewImg (row) {
      this.dialogImg = true
      this.picPath = row.picUrl
    },

    // 复制图片链接
    copy (param) {
      let clipboard = new Clipboard(`.${param}`)
      clipboard.on('success', e => {
        this.$message.success('复制成功：' + e.text)
        clipboard.destroy()
      })
    },

    // 查询条件 -- 重置
    resetFilter () {
      this.filter.departCode = ''
      this.filter.arriCode = ''
      this.filter.departName = ''
      this.filter.arriName = ''
      this.filter.fdateStart = ''
      this.filter.fdateEnd = ''
      this.filter.channel = ''
      this.filter.status = ''
      this.filter.isinter = ''
      this.filter.isChildren = ''
      this.filter.isBaby = ''
      this.getRecommendedRouteList()
    },

    // 添加、修改弹出框 -- 显示隐藏
    handleEdit (params) {
      this.editVisible = true
      this.resetEdit()
      if (params) {
        this.isReset = false
        this.popupTitle = '修改'
        this.hangdleParams(params)
      } else {
        this.imgUrl = ''
        this.isReset = true
        this.popupTitle = '添加'
      }
    },

    // 添加/修改弹出框 -- 数据处理
    hangdleParams (params) {
      this.editForm.recommendedRouteId = params.recommendedRouteId
      this.editForm.departCode = params.departCode
      this.editForm.arriCode = params.arriCode
      this.editForm.departName = params.departName
      this.editForm.arriName = params.arriName
      this.editForm.fdateStart = params.fdateStart
      this.editForm.fdateEnd = params.fdateEnd
      this.editForm.channel = params.channel.split(',')
      this.editForm.status = params.status
      this.editForm.isinter = params.isinter
      this.editForm.isChildren = params.isChildren
      this.editForm.isBaby = params.isBaby
      this.imgUrl = params.picUrl
    },

    // 添加、修改弹出框 -- 提交
    saveEdit () {
      if (this.editForm.departCode && this.editForm.arriCode &&
          this.editForm.departName && this.editForm.arriName &&
          this.editForm.fdateStart && this.editForm.fdateEnd &&
          this.editForm.channel.length && this.editForm.status &&
          this.editForm.isinter && this.editForm.isChildren &&
          this.editForm.isBaby && this.imgUrl) {
        this.paramData(this.editForm)
      } else {
        this.isEmpty = true
      }
    },

    // 数据处理
    paramData (data) {
      let dataNew = new FormData()
      dataNew.append('departCode', this.$options.filters.upper(data.departCode))
      dataNew.append('departName', data.departName)
      dataNew.append('arriCode', this.$options.filters.upper(data.arriCode))
      dataNew.append('arriName', data.arriName)
      dataNew.append('channel', data.channel.join(','))
      dataNew.append('fdateEnd', data.fdateEnd)
      dataNew.append('fdateStart', data.fdateStart)
      dataNew.append('status', data.status)
      dataNew.append('isinter', data.isinter)
      dataNew.append('isChildren', data.isChildren)
      dataNew.append('isBaby', data.isBaby)
      dataNew.append('pic', data.pic || undefined)
      if (this.isReset === false) {
        dataNew.append('recommendedRouteId', data.recommendedRouteId)
        this.getUpdateData(dataNew)
      } else {
        this.getAddData(dataNew)
      }
    },

    // 添加弹出框 -- 提交接口
    getAddData (data) {
      addRecommendedRouteBean(data).then(res => {
        this.editVisible = false
        this.getRecommendedRouteList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 编辑弹出框 -- 提交接口
    getUpdateData (data) {
      updateRecommendedRouteBean(data).then(res => {
        this.editVisible = false
        this.getRecommendedRouteList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 添加、修改弹出框 -- 重置
    resetEdit () {
      this.editForm = {
        arriCode: '',
        arriName: '',
        channel: '',
        departCode: '',
        departName: '',
        fdateEnd: '',
        fdateStart: '',
        status: '1',
        isinter: '0',
        isChildren: '0',
        isBaby: '0',
        pic: ''
      }
      this.imgUrl = ''
      this.isEmpty = false
    },

    // 添加、修改弹出框 -- 图片上传
    choiceImg (e) {
      this.editForm.pic = e.target.files[0]
      this.imgUrl = getObjectURL(e.target.files[0])
    },

    // 删除
    handleDelete (id) {
      let ids = id || filterIds(this.multipleSelection, 'recommendedRouteId').join(',')
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
      deleteRecommendedRouteBean({ ids: id }).then(res => {
        this.getRecommendedRouteList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 航线状态
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
          status: status === '0' ? '1' : '0'
        }
        this.getStatusData(data)
      })
    },

    // 航线状态 -- 接口
    getStatusData (data) {
      updateStatus(data).then(res => {
        this.getRecommendedRouteList()
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
