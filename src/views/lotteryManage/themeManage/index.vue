<template>
<!--  <div>主题管理</div>-->
  <div id="ThemeManage" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="主题名称" v-model="filter.name" @keydown.enter.native="getThemeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="主题描述" v-model="filter.description" @keydown.enter.native="getThemeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="启用状态" v-model="filter.enabled"  @keydown.enter.native="getThemeList()">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getThemeList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit()">添加</el-button>
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
          :data="themeList.contents"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
<!--          <el-table-column type="selection"></el-table-column>-->
          <el-table-column key="1" label="系数" v-if="tableList.ratio" prop="ratio" min-width="60"></el-table-column>
          <el-table-column key="2" label="主题名称" v-if="tableList.name" prop="name" min-width="120"></el-table-column>
          <el-table-column key="3" label="主题描述" v-if="tableList.description" prop="description" min-width="120"></el-table-column>
          <el-table-column key="4" label="最低抽中概率(%)" v-if="tableList.lowRate" prop="lowRate" min-width="140"></el-table-column>
          <el-table-column key="5" label="最高抽中概率(%)" v-if="tableList.highRate" prop="highRate" min-width="140"></el-table-column>
          <el-table-column key="6" label="开始时间" v-if="tableList.startTime" prop="startTime" min-width="160"></el-table-column>
          <el-table-column key="7" label="结束时间" v-if="tableList.endTime" prop="endTime" min-width="160"></el-table-column>
          <el-table-column key="8" label="免费次数" v-if="tableList.freeTimes" prop="freeTimes" min-width="100"></el-table-column>
          <el-table-column key="9" label="图片路径" v-if="tableList.imagePath" prop="imagePath" min-width="180"></el-table-column>
          <el-table-column key="10" label="图片" v-if="tableList.imagePath" prop="imagePath" min-width="160">
            <template slot-scope="scope">
              <div class="imgUrl">
                <img :src="scope.row.imagePath" alt="" v-if="!scope.row.flag" style="width: 100px;height: 100px;cursor: pointer;" @click.stop="previewImg(scope.row)">
                <i type="primary" title='点击复制' class="el-icon-document copy-btn" :data-clipboard-text="scope.row.imagePath" :class="scope.row.selName" @click="copy(scope.row.selName)"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column key="11" label="抽奖规则描述" v-if="tableList.rule" prop="rule" min-width="140"></el-table-column>
          <el-table-column key="12" label="状态" v-if="tableList.status" prop="status" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">禁用</span>
              <span v-if="scope.row.status === 1">启用</span>
            </template>
          </el-table-column>
          <el-table-column key="13" label="创建人" v-if="tableList.createBy" prop="createBy" min-width="100"></el-table-column>
          <el-table-column key="14" label="创建时间" v-if="tableList.createTime" prop="createTime" min-width="160"></el-table-column>
          <el-table-column key="15" label="修改时间" v-if="tableList.modifyTime" prop="modifyTime" min-width="160"></el-table-column>
          <el-table-column key="16" label="修改人" v-if="tableList.modifyBy" prop="modifyBy" min-width="100"></el-table-column>
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
            :total="themeList.totalRows">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--图片预览-->
    <el-dialog title="图片预览" :visible.sync="dialogImg" width="780px">
      <div class="dialog-container">
        <img :src="imagePath" alt="" width="750" style="padding: 10px">
      </div>
    </el-dialog>
    <!--新增弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="840px" :close-on-click-modal="false">
      <div class="dialog-container" v-loading="imgLoading">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">系数</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="系数,最大值：99" clearable v-model="editForm.ratio"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.ratio">系数不可为空</div>
                <div class="warning-info" v-if="isJudge && parseInt(editForm.ratio) > 99">系数最大值不可大于99</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">主题名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="主题名称" clearable v-model="editForm.name"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.name">主题名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">免费次数</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="免费次数,最大值：999" clearable v-model="editForm.freeTimes"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.freeTimes">免费次数不可为空</div>
                <div class="warning-info" v-if="isJudge && parseInt(editForm.freeTimes) > 999">免费次数最大值不可大于999</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">最低抽中概率(%)</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="最低抽中概率,最大值：99" clearable v-model="editForm.lowRate"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.lowRate">最低抽中概率不可为空</div>
                <div class="warning-info" v-if="isJudge && parseInt(editForm.lowRate) > 99">最低抽中概率最大值不可大于99</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">最高抽中概率(%)</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="最高抽中概率,最大值：99" clearable v-model="editForm.highRate"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.highRate">最高抽中概率不可为空</div>
                <div class="warning-info" v-if="isJudge && parseInt(editForm.highRate) > 99">最高抽中概率最大值不可大于99</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">开始时间</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="datetime"
                  class="date-picker"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="开始时间"
                  v-model="editForm.startTime">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.startTime">开始时间不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">结束时间</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="datetime"
                  class="date-picker"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="活动结束日期"
                  v-model="editForm.endTime">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.endTime">结束时间不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">主题规则</div>
              <div class="ipt-medium">
                <el-input
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="规则"
                  v-model="editForm.rule">
                </el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.rule">规则不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">主题描述</div>
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
              <div class="mt-10">
                <el-button v-if="editForm.imagePath" size="mini" type="primary" title='点击复制' class="el-icon-document imgClass" :data-clipboard-text="editForm.imagePath" @click="copy('imgClass')">复制图片路径</el-button>
              </div>
              <div v-if="!imgUrl && isEmpty" class="danger-text">图片不可为空</div>
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
    <!--抽奖主题详情-->
    <el-dialog v-dialogDrag title="抽奖主题详情" :visible.sync="themeVisible" width="1060px">
      <div class="dialog-container">
        <div class="dialog-main">
          <el-collapse v-model="activeNamesTheme">
            <el-collapse-item title="活动详情" name="activity">
              <el-table
                :data="themeDetailList"
                :cell-style="tableAttributes.cellStyle">
                <el-table-column label="主题名称" prop="name" min-width="140"></el-table-column>
                <el-table-column label="主题描述" prop="description" min-width="140"></el-table-column>
                <el-table-column label="最低抽中概率(%)" prop="lowRate" min-width="100"></el-table-column>
                <el-table-column label="最高抽中概率(%)" prop="highRate" min-width="100"></el-table-column>
              </el-table>
              <el-table
                :data="themeDetailList"
                :cell-style="tableAttributes.cellStyle">
                <el-table-column label="系数" prop="ratio" min-width="100"></el-table-column>
                <el-table-column label="免费次数" prop="freeTimes" min-width="100"></el-table-column>
                <el-table-column label="开始时间" prop="startTime" min-width="120"></el-table-column>
                <el-table-column label="结束时间" prop="endTime" min-width="120"></el-table-column>
              </el-table>
              <el-table
                :data="themeDetailList"
                :cell-style="tableAttributes.cellStyle">
                <el-table-column label="图片路径" prop="imagePath" min-width="160"></el-table-column>
                <el-table-column label="抽奖规则描述" prop="rule" min-width="140"></el-table-column>
                <el-table-column label="状态" prop="status" min-width="80">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status === 0">禁用</span>
                    <span v-if="scope.row.status === 1">启用</span>
                  </template>
                </el-table-column>
                <el-table-column label="创建人" prop="createBy" min-width="100"></el-table-column>
                <el-table-column label="创建时间" prop="createTime" min-width="100"></el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="规则详情" name="rule">
              <el-table
                :data="ruleList"
                :cell-style="tableAttributes.cellStyle">
                <el-table-column label="规则名称" prop="name" min-width="120"></el-table-column>
                <el-table-column label="规则描述" prop="description" min-width="140"></el-table-column>
                <el-table-column label="奖品名称" prop="prizeName" min-width="100"></el-table-column>
                <el-table-column label="奖品类型" prop="type" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.type | prizeTypeMap}}
                  </template>
                </el-table-column>
                <el-table-column label="奖品数量" prop="prizeNum" min-width="80"></el-table-column>
                <el-table-column label="权重" prop="weight" min-width="80"></el-table-column>
                <el-table-column label="活动名称" prop="activityName" min-width="100"></el-table-column>
                <el-table-column label="中奖概率" prop="currentRate" min-width="100"></el-table-column>
<!--                <el-table-column label="状态" prop="status" min-width="80">-->
<!--                  <template slot-scope="scope">-->
<!--                    <span v-if="scope.row.status === 0">禁用</span>-->
<!--                    <span v-if="scope.row.status === 1">启用</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column label="创建时间" prop="createTime" min-width="160"></el-table-column>-->
<!--                <el-table-column label="创建人" prop="createBy" min-width="100"></el-table-column>-->
<!--                <el-table-column label="修改时间" prop="modifyTime" min-width="160"></el-table-column>-->
<!--                <el-table-column label="修改人" prop="modifyBy" min-width="100"></el-table-column>-->
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" @click="themeVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import fieldMap from './refer'
import Clipboard from 'clipboard'
import { checkAttrs } from '../../../mixins'
import { getObjectURL } from '../../../utils/index'
import { queryThemeList, queryUpload, queryThemeActivity } from './api'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'ThemeManage',
  data () {
    return {
      loading: false, // 加载
      imgLoading: false, // 图片加载
      dialogImg: false, // 图片预览
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      dataViewHeight: null,
      componentName: 'ThemeManage',
      multipleSelection: [], // 表格多选
      filter: {
        name: '', // 主题名称
        description: '', // 主题描述
        enabled: '', // 启用状态
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件列表
      tableList: {
        ratio: true,
        name: true,
        description: true,
        lowRate: true,
        highRate: true,
        startTime: false,
        endTime: false,
        freeTimes: true,
        imagePath: true,
        rule: true,
        status: true,
        createBy: false,
        createTime: false,
        modifyTime: false,
        modifyBy: false
      }, // 表格数据
      themeList: {}, // 表格展示数据
      imagePath: '', // 展示图片
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: false, // 添加/修改弹出框 -- 切换添加/修改
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      isJudge: false, // 添加/修改弹出框 -- 免费次数输入框
      popupTitle: '', // 添加/修改弹出框 -- 标题
      editForm: {}, // 添加/修改弹出框 -- 数据表单
      imgList: '', // 添加/修改弹出框 -- 上传图片信息
      imgUrl: '', // 添加/修改弹出框 -- 图片路径
      themeVisible: false, // 抽奖主题详情弹出框 -- 显示隐藏
      themeDetailList: [], // 抽奖主题详情弹出框 -- 数据表单
      ruleList: [], // 抽奖主题详情弹出框 -- 规则详情数据表单
      activeNamesTheme: [ 'activity', 'rule' ]
      // userInfo: {}
    }
  },
  created () {
    // this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.getThemeList(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    // 分页导航
    handleSizeChange (pages) {
      this.getThemeList(null, pages)
    },
    handleCurrentChange (page) {
      this.getThemeList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getThemeList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.filter.isJson = true
      queryThemeList(this.filter).then(res => {
        this.themeList = res.data
        for (let item of this.themeList.contents) {
          item['flag'] = false
          item['selName'] = 'sel' + item.id
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.data || err.message)
      })
    },

    // 查询条件重置
    resetFilter () {
      this.filter.name = ''
      this.filter.description = ''
      this.filter.enabled = ''
      this.filter.isJson = true
      this.getThemeList()
    },

    // 图片预览
    previewImg (row) {
      this.dialogImg = true
      this.imagePath = row.imagePath
    },

    // 复制图片
    copy (param) {
      let clipboard = new Clipboard(`.${param}`)
      clipboard.on('success', e => {
        this.$message.success('复制成功：' + e.text)
        clipboard.destroy()
      })
    },

    // 获取图片路径
    choiceImg (e) {
      if (e.target.files[0]) {
        let size = e.target.files[0].size / (1024 * 1024)
        if (size > 1) {
          this.$message.error('图片大小不能超过1M!')
          return false
        } else {
          this.imgList = e.target.files
          this.imgUrl = getObjectURL(e.target.files[0])
          this.handleUploadImg()
        }
      }
    },

    // 上传图片路径
    handleUploadImg () {
      this.imgLoading = true
      let data = new FormData()
      for (let i = 0; i < this.imgList.length; i++) {
        data.append('file', this.imgList[i])
      }
      queryUpload(data).then(res => {
        this.$message.success('上传成功')
        this.editForm.imagePath = res.data
        this.imgLoading = false
      }).catch(err => {
        this.$message.error(err.data || err.message)
        // this.editForm.imagePath = 'https://23-1300181329.cos.ap-shanghai.myqcloud.com/redapple/luckdraw/youhuiquan%403x.png'
        this.imgLoading = false
      })
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
      this.editForm.ratio = JSON.stringify(params.ratio)
      this.editForm.id = params.id
      this.editForm.name = params.name
      this.editForm.lowRate = JSON.stringify(params.lowRate)
      this.editForm.highRate = JSON.stringify(params.highRate)
      this.editForm.freeTimes = params.freeTimes
      this.editForm.startTime = params.startTime
      this.editForm.endTime = params.endTime
      this.editForm.rule = params.rule
      this.editForm.description = params.description
      this.editForm.imagePath = params.imagePath
      this.imgUrl = params.imagePath
    },

    // 删除
    handleDelete (id) {
      // let ids = id || filterIds(this.multipleSelection, 'id').join('/')
      let data = {
        id: id,
        type: 'delete'
      }
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        // 删除
        this.getParamsData(data)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },

    // 添加、修改弹出框 -- 提交
    saveEdit () {
      if (this.editForm.ratio && this.editForm.name &&
          this.editForm.lowRate && this.editForm.highRate &&
          this.editForm.freeTimes && this.editForm.startTime &&
          this.editForm.endTime && this.editForm.rule &&
          this.editForm.imagePath) {
        if (parseInt(this.editForm.freeTimes) <= 999 && parseInt(this.editForm.ratio) <= 99 &&
            parseInt(this.editForm.lowRate) <= 99 && parseInt(this.editForm.highRate) <= 99) {
          let data = JSON.parse(JSON.stringify(this.editForm))
          data.isJson = true
          if (this.isReset === false) {
            let param = {
              data: data,
              type: 'upDate'
            }
            this.getParamsData(param)
          } else {
            this.getParamsData(data)
          }
        } else {
          this.isJudge = true
        }
      } else {
        this.isEmpty = true
      }
    },

    // 添加、修改弹出框 -- 提交接口
    getParamsData (data, type) {
      this.themeDetailList = []
      queryThemeActivity(data).then(res => {
        this.editVisible = false
        if (!type) {
          this.getThemeList()
          this.$message.success('操作成功')
        } else if (type && type === 1) {
          this.ruleList = res.data.ruleList
          this.themeDetailList.push(res.data)
        }
      }).catch(err => {
        this.$message.error(err.data || err.message)
      })
    },

    // 添加、修改弹出框 -- 重置
    resetEdit () {
      this.editForm = {
        ratio: '',
        name: '',
        lowRate: '',
        highRate: '',
        startTime: '',
        endTime: '',
        imagePath: '',
        description: '',
        rule: '',
        freeTimes: ''
      }
      this.imgUrl = ''
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
          status: status === 0 ? 1 : 0,
          type: 'status'
        }
        this.getParamsData(data)
      })
    },

    // 查看详情
    handleDetail (id) {
      this.themeVisible = true
      let data = {
        id: id,
        type: 'detail'
      }
      this.getParamsData(data, 1)
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
