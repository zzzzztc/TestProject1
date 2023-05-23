<template>
  <!--<div>上传图片维护</div>-->
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="图片名称" v-model="filter.picName" @keydown.enter.native="getPlaneTypeImageList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="机号" v-model="filter.planeType" @keydown.enter.native="getPlaneTypeImageList()"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getPlaneTypeImageList()">查询</el-button>
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
          :data="planeTypeImageList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="机号" prop="planeType" min-width="100"></el-table-column>
          <el-table-column label="图片名称" prop="picName" min-width="100"></el-table-column>
          <el-table-column label="图片" prop="picUrl" min-width="100">
            <template slot-scope="scope">
              <div class="imgUrl">
                <span class="active-text" v-if="!scope.row.flag" title="查看图片" @click.stop="previewImg(scope.row)">查看图片</span>
<!--                <img :src="scope.row.picUrl" alt="" v-if="!scope.row.flag" style="width: 100px;height: 100px;cursor: pointer;" @click.stop="previewImg(scope.row)">-->
<!--                <i type="primary" title='点击复制' class="el-icon-document copy-btn" :data-clipboard-text="scope.row.picUrl" :class="scope.row.selName" @click="copy(scope.row.selName)"></i>-->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建日期" prop="createDate" min-width="100"></el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.planeTypeId)">删除</span>
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
            :total="planeTypeImageList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--图片预览-->
    <el-dialog v-dialogDrag title="图片预览" :visible.sync="dialogImg" width="780px">
      <div class="dialog-container">
        <img :src="picPath" alt="" width="750" style="padding: 10px">
      </div>
    </el-dialog>
    <!--新增弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="350px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">机号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="机型" clearable v-model="editForm.planeType"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.planeType">机型不可为空</div>
              </div>
            </div>
          </div>
          <!--第二排-->
          <div class="row">
            <div class="column">
              <div class="label required">机型图类型</div>
              <div class="ipt-medium">
                <el-select v-model='editForm.picId' clearable placeholder='机型图类型' size='medium'>
                  <el-option
                    v-for='item in modelImgTypeList'
                    :key='item.picId'
                    :label='item.picName'
                    :value='item.picId'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.picId">机型图类型不可为空</div>
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
import { getModelImgType, computeTableHeight, filterIds } from '../../../utils/index'
import { queryPlaneTypeImageList, queryAddPlaneTypeImage, queryUpdatePlaneTypeImage, queryDeletePlaneTypeImage } from './api'
import Clipboard from 'clipboard'

export default {
  name: 'DynamicModel',
  data () {
    return {
      loading: false, // 加载
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      filter: {
        picName: '', // 图片名称
        planeType: '', // 机型
        page: '',
        rows: ''
      }, // 查询条件列表
      planeTypeImageList: {}, // 查询结果数据
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: false, // 添加/修改弹出框 -- 切换添加/修改
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      popupTitle: '', // 添加/修改弹出框 -- 标题
      editForm: {}, // 添加/修改弹出框 -- 数据表单
      picPath: '', // 图片预览
      dialogImg: false
    }
  },
  created () {
    this.judgeChannelList()
    this.getPlaneTypeImageList(1, this.pagination.pageSize)
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      modelImgTypeList: state => state.app.modelImgTypeList
    })
  },
  methods: {
    judgeChannelList () {
      if (!this.modelImgTypeList.length) {
        getModelImgType()
      }
    },
    // 分页导航
    handleSizeChange (pages) {
      this.getPlaneTypeImageList(null, pages)
    },
    handleCurrentChange (page) {
      this.getPlaneTypeImageList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    getPlaneTypeImageList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      queryPlaneTypeImageList(this.filter).then(res => {
        this.planeTypeImageList = res
        for (let item of this.planeTypeImageList.rows) {
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
      this.filter.planeType = ''
      this.getPlaneTypeImageList()
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
      this.editForm.planeTypeId = params.planeTypeId
      this.editForm.planeType = params.planeType
      this.editForm.picId = params.picId
    },

    // 添加、修改弹出框 -- 提交
    saveEdit () {
      if (this.editForm.planeType && this.editForm.picId) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        if (this.isReset === false) {
          this.getUpdateData(data)
        } else {
          this.getAddData(data)
        }
      } else {
        this.isEmpty = true
      }
    },

    // 添加弹出框 -- 提交接口
    getAddData (data) {
      queryAddPlaneTypeImage(data).then(res => {
        this.editVisible = false
        this.getPlaneTypeImageList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 编辑弹出框 -- 提交接口
    getUpdateData (data) {
      queryUpdatePlaneTypeImage(data).then(res => {
        this.editVisible = false
        this.getPlaneTypeImageList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 添加、修改弹出框 -- 重置
    resetEdit () {
      this.editForm = {
        planeType: '',
        picId: ''
      }
      this.isEmpty = false
    },

    // 删除
    handleDelete (id) {
      let ids = id || filterIds(this.multipleSelection, 'planeTypeId').join(',')
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
      queryDeletePlaneTypeImage({ ids: id }).then(res => {
        this.getPlaneTypeImageList()
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
