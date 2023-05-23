<template>
  <!--<div>上传图片维护</div>-->
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="图片名称" v-model="filter.picName" @keydown.enter.native="getMidPicList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='filter.picType' clearable placeholder='图片类型' size='medium' @keydown.enter.native="getMidPicList()">
            <el-option
              v-for='item in uploadImgTypeList'
              :key='item.dincId'
              :label='item.dincName'
              :value='item.dincCode'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.status" clearable placeholder="图片状态" @keydown.enter.native="getMidPicList()">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.createDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="创建时间开始">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.createDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="创建时间截止">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getMidPicList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(), resetEdit()">添加</el-button>
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
          :data="midPicList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="图片名称" prop="picName" min-width="100"></el-table-column>
          <el-table-column label="图片类型" prop="dincName" min-width="100"></el-table-column>
          <el-table-column label="图片状态" prop="status" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status === '0'">禁用</span>
              <span v-if="scope.row.status === '1'">启用</span>
            </template>
          </el-table-column>
          <el-table-column label="图片" prop="picUrl" min-width="100">
            <template slot-scope="scope">
              <div class="imgUrl">
                <img :src="scope.row.picUrl" alt="" v-if="!scope.row.flag" title="查看图片" style="width: 100px;height: 100px;cursor: pointer;" @click.stop="previewImg(scope.row)">
                <i type="primary" title='点击复制' class="el-icon-document copy-btn" :data-clipboard-text="scope.row.picUrl" :class="scope.row.selName" @click="copy(scope.row.selName)"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" min-width="100"></el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click='handleStatus(scope.row.picId, scope.row.status)' v-if="scope.row.status === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handleStatus(scope.row.picId, scope.row.status)' v-if="scope.row.status === '0'" title="禁用">启用</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.picId)">删除</span>
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
            :total="midPicList.total">
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
    <el-dialog :title="popupTitle" :visible.sync="editVisible" v-dialogDrag width="560px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">图片名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="图片名称" clearable v-model="editForm.picName"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.picName">图片名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">图片类型</div>
              <div class="ipt-medium">
                <el-select v-model='editForm.picType' clearable placeholder='图片类型' size='medium'>
                  <el-option
                    v-for='item in uploadImgTypeList'
                    :key='item.dincId'
                    :label='item.dincName'
                    :value='item.dincCode'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.picType">图片类型不可为空</div>
              </div>
            </div>
          </div>
          <!--第二排-->
          <div class="row">
            <div class="column">
              <div class="label required">启用/禁用</div>
              <div class="fl ipt-medium">
                <el-select v-model='editForm.status' placeholder='启用/禁用' size='medium'>
                  <el-option value="0" label="禁用"></el-option>
                  <el-option value="1" label="启用"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.status">启用/禁用不可为空</div>
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
import { getUploadImgType, computeTableHeight, getObjectURL, filterIds } from '../../../utils/index'
import { queryMidPicList, queryAddMidPic, queryUpdateMidPic, queryDeleteMidPic, queryUpdateStatus } from './api'
import Clipboard from 'clipboard'

export default {
  name: 'UploadImg',
  data () {
    return {
      loading: false, // 加载
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      filter: {
        picName: '', // 图片名称
        picType: '', // 图片类型
        status: '', // 图片状态
        createDateStart: '', // 创建时间开始
        createDateEnd: '', // 创建时间截止
        page: '',
        rows: ''
      }, // 查询条件列表
      midPicList: {}, // 查询结果数据
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
    this.getMidPicList(1, this.pagination.pageSize)
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      uploadImgTypeList: state => state.app.uploadImgTypeList
    })
  },
  methods: {
    judgeChannelList () {
      if (!this.uploadImgTypeList.length) {
        getUploadImgType()
      }
    },
    // 分页导航
    handleSizeChange (pages) {
      this.getMidPicList(null, pages)
    },
    handleCurrentChange (page) {
      this.getMidPicList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    getMidPicList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      queryMidPicList(this.filter).then(res => {
        this.midPicList = res
        for (let item of this.midPicList.rows) {
          for (let it of this.uploadImgTypeList) {
            if (item.picType === it.dincCode) {
              item.dincName = it.dincName
              break
            }
          }
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
      this.filter.picName = ''
      this.filter.picType = ''
      this.filter.status = ''
      this.filter.createDateStart = ''
      this.filter.createDateEnd = ''
      this.getMidPicList()
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
      this.editForm.picId = params.picId
      this.editForm.picName = params.picName
      this.editForm.picType = params.picType
      this.editForm.status = params.status
      this.imgUrl = params.picUrl
    },

    // 添加、修改弹出框 -- 提交
    saveEdit () {
      if (this.editForm.picName && this.editForm.picType &&
          this.editForm.status && this.imgUrl) {
        this.paramData(this.editForm)
      } else {
        this.isEmpty = true
      }
    },

    // 数据处理
    paramData (data) {
      let dataNew = new FormData()
      dataNew.append('picName', data.picName)
      dataNew.append('picType', data.picType)
      dataNew.append('status', data.status)
      dataNew.append('adPic', data.adPic || undefined)
      if (this.isReset === false) {
        dataNew.append('picId', data.picId)
        this.getUpdateData(dataNew)
      } else {
        this.getAddData(dataNew)
      }
    },

    // 添加弹出框 -- 提交接口
    getAddData (data) {
      queryAddMidPic(data).then(res => {
        this.editVisible = false
        this.getMidPicList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 编辑弹出框 -- 提交接口
    getUpdateData (data) {
      queryUpdateMidPic(data).then(res => {
        this.editVisible = false
        this.getMidPicList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 添加、修改弹出框 -- 重置
    resetEdit () {
      this.editForm = {
        picName: '',
        picType: '',
        status: '1',
        adPic: ''
      }
      this.imgUrl = ''
      this.isEmpty = false
    },

    // 添加、修改弹出框 -- 图片上传
    choiceImg (e) {
      this.editForm.adPic = e.target.files[0]
      this.imgUrl = getObjectURL(e.target.files[0])
    },

    // 删除
    handleDelete (id) {
      let ids = id || filterIds(this.multipleSelection, 'picId').join(',')
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
      queryDeleteMidPic({ ids: id }).then(res => {
        this.getMidPicList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 图片状态
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

    // 图片状态 -- 接口
    getStatusData (data) {
      queryUpdateStatus(data).then(res => {
        this.getMidPicList()
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
