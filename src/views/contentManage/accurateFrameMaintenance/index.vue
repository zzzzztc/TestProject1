<template>
  <!--<div>精准弹框维护</div>-->
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input v-model="filter.iata" clearable placeholder="三字码" size="medium" @keydown.enter.native="queryList()" ></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="弹框类型" v-model="filter.epidType" clearable>
            <el-option :value="0" label="出港" :key="0"></el-option>
            <el-option :value="1" label="经停" :key="1"></el-option>
            <el-option :value="2" label="进港" :key="2"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="启用状态" v-model="filter.epidStatus" clearable>
            <el-option :value="0" label="禁用" :key="0"></el-option>
            <el-option :value="1" label="启用" :key="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="场景" v-model="filter.scene" clearable>
            <el-option :value="0" label="精准弹窗" :key="0"></el-option>
            <el-option :value="1" label="空轨联运弹窗" :key="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="queryList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog()">添加</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="list"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle"
          :row-style="rowStyle">
          <el-table-column label="三字码" prop="iata" min-width="30"></el-table-column>
          <el-table-column label="弹框类型" prop="epidType" min-width="30">
            <template slot-scope="scope">{{ scope.row.epidType | epidTypeMap }}</template>
          </el-table-column>
          <el-table-column label="弹框标题" prop="epidTitle" min-width="100"></el-table-column>
          <el-table-column label="弹框内容" prop="epidContent" min-width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="场景" prop="scene" min-width="30">
            <template slot-scope="scope">
              <span>{{scope.row.scene | senceMap}}</span>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" prop="epidStatus" min-width="30">
            <template slot-scope="scope">
              <span>{{scope.row.epidStatus | epidStatusMap}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="40">
            <template slot-scope="scope">
              <span class="active-text inl-block mr-5" @click="switchDialog(scope.row)">编辑</span>
              <span class="danger-text inl-block mr-5" @click="handleConfirm(scope.row.epidId)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filter.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="800px">
        <div class="dialog-container">
          <div class="dialog-main">
            <div class="row">
              <div class="column" v-if="isCreate && !disableFlag">
                <div :class="!disableFlag?'label required':'label'">三字码</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="三字码" v-model="dialogForm.iata" clearable :disabled="disableFlag"></el-input>
                  <div class="warning-info" v-if="formErr && !dialogForm.iata ">三字码不可为空</div>
                </div>
              </div>
              <div class="column" v-if="isCreate && !disableFlag">
                <div :class="!disableFlag?'label required':'label'">弹框类型</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="弹框类型" v-model="dialogForm.epidType" clearable :disabled="disableFlag">
                    <el-option :value="0" label="出港" :key="0"></el-option>
                    <el-option :value="1" label="经停" :key="1"></el-option>
                    <el-option :value="2" label="进港" :key="2"></el-option>
                  </el-select>
                  <div class="warning-info" v-if="formErr && dialogForm.epidType === ''">弹框类型必选</div>
                </div>
              </div>
              <!--1-2-->
              <div class="column">
                <div class="label required">弹框标题</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="弹框标题" v-model="dialogForm.epidTitle" clearable></el-input>
                  <div class="warning-info" v-if="formErr && !dialogForm.epidTitle">弹框标题不可为空</div>
                </div>
              </div>
              <!--1-3-->
              <div class="column">
                <div class="label required">启用状态</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="启用状态" v-model="dialogForm.epidStatus" clearable>
                    <el-option value="0" label="禁用" :key="0"></el-option>
                    <el-option value="1" label="启用" :key="1"></el-option>
                  </el-select>
                  <div class="warning-info" v-if="formErr && dialogForm.epidStatus===''">启用状态必选</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">场景</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="场景" v-model="dialogForm.scene" @change="disableSelect(dialogForm.scene)"  clearable>
                    <el-option value="0" label="精准弹窗" :key="0"></el-option>
                    <el-option value="1" label="空轨联运弹窗" :key="1"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="column">
                <div class="label">图片上传</div>
                <label>
                  <div style="width: 60px;height: 60px;border: 1px solid #ccc;text-align: center">
                    <input type="file" style="display: none" @change="choiceImg($event)">
                    <img v-if="imgUrl" style="width: 60px;height: 60px;" :src="imgUrl" alt="">
                    <i v-if="!imgUrl" style="font-size: 40px;color: #ccc" class="el-icon-upload"></i>
                  </div>
                </label>
                <div class="mt-10">
                  <el-button v-if="noticeInfo.filepath" size="mini" type="primary" title='点击复制' class="el-icon-document copy-btn imgClass" :data-clipboard-text="noticeInfo.filepath" @click="copy('imgClass')">复制图片路径</el-button>
                </div>
                <div v-if="!imgUrl && formErr" class="danger-text">图片不可为空</div>
              </div>
              <!--<div class="column">
                <div class="label required">管理员ID</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="管理员ID" v-model="dialogForm.updateOpid" clearable></el-input>
                  <div class="warning-info" v-if="formErr && !dialogForm.updateOpid">管理员ID不可为空</div>
                </div>
              </div>-->
            </div>
            <div class="row">
              <div class="form-label required" style="text-align: left; margin-bottom: 10px">弹框内容</div>
              <div class="form-value">
                <Tinymce id="se" v-model="dialogForm.epidContent"></Tinymce>
                <div class="warning-info" v-if="formErr && !dialogForm.epidContent">弹框内容不可为空</div>
              </div>
            </div>
            <div class="row">
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" type="primary" @click="paramJudge">提交</el-button>
            <el-button size="medium" v-if="isCreate" @click="handleReset">重置</el-button>
            <el-button size="medium" @click="dialogVisible = false">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { computeTableHeight } from '../../../utils/index'
import { mapState } from 'vuex'
import { fetchList, update, insert, deleteNotice } from './api'
import Tinymce from '../../../components/tinymce/index'
import { uploadImg } from '../message/api'
import Clipboard from 'clipboard'

export default {
  name: 'accurateFrameMaintenance',
  components: {
	  Tinymce
  },
  data () {
    return {
      loading: false,
      dataViewHeight: null,
      filter: {
        iata: '',
	      epidType: '',
	      epidStatus: ''
      },
      noticeInfo: {
        webid: 3,
        context: '',
        caption: '',
        categoryid: '',
        filepath: '',
        webContent: ''
      },
      imgUrl: '',
      list: [],
      dialogVisible: false,
      dialogTitle: '',
      isCreate: false,
      formErr: false,
      currentItem: {},
	    dialogForm: {
		    iata: '',
        epidId: '',
        epidTitle: '',
        epidContent: '',
        epidStatus: '',
        updateOpid: '',
		    htmlContent: '',
		    isJson: true,
		    scene: '0'
      },
	    rowStyle: {
      	height: '70px'
      },
	    total: 0,
      disableFlag: false
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      dataDictionary: state => state.app.dataDictionary
    })
  },
  created () {
    this.queryList(1, this.pagination.pageSize)
  },
  methods: {
    // 复制列字段
    copy (param) {
      let clipboard = new Clipboard(`.${param}`)
      this.tFlag = false
      clipboard.on('success', e => {
        this.$message({
          duration: 5000,
          type: 'success',
          message: '复制成功：' + e.text
        })
        clipboard.destroy()
      })
    },
    getObjectURL (file) {
      let url = null
      console.log(window.createObjectURL)
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    // 选择图片
    choiceImg (e) {
      this.imgList = e.target.files
      this.imgUrl = this.getObjectURL(e.target.files[0])
      this.handleUploadImg()
    },
    // 上传图片
    handleUploadImg () {
      this.imgLoading = true
      let data = new FormData()
      for (let i = 0; i < this.imgList.length; i++) {
        // console.log(this.imgList[i])
        data.append('noticePic', this.imgList[i])
      }
      // console.log(data)
      uploadImg(data).then(res => {
        this.$message({
          duration: 5000,
          message: '上传成功',
          type: 'success'
        })
        this.noticeInfo.filepath = res.message
        this.imgLoading = false
      }).catch(err => {
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
        this.imgLoading = false
      })
    },
    // 获取数据
    queryList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      this.filter.isJson = true
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.list = [...res.data]
        this.total = res.total
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    // 分页
    handleSizeChange (pages) {
      this.queryList(null, pages)
    },
    handleCurrentChange (page) {
      this.queryList(page, null)
    },
    // 重置
    resetFilter () {
	    this.filter = {
		    iata: '',
        epidType: '',
        epidStatus: ''
	    }
      this.queryList(1, this.pagination.pageSize)
    },
    // 切换弹框
    switchDialog (param) {
      this.dialogVisible = true
      this.disableFlag = false
      this.imgList = ''
      this.imgUrl = ''
      if (param) {
        // 编辑
        this.dialogForm = { ...param }
        this.dialogForm.isJson = true
        this.isCreate = false
        this.dialogTitle = '修改'
      } else {
        // 新增
        this.isCreate = true
        this.dialogTitle = '添加'
        this.handleReset()
      }
    },
    // 参数判断
    paramJudge () {
    	this.dialogForm.updateOpid = JSON.parse(window.localStorage.getItem('userInfo')).opId
      if (this.dialogForm.epidTitle && this.dialogForm.epidContent && this.dialogForm.epidStatus !== '') {
        this.formErr = false
        if (this.disableFlag) {
	        this.handleSaveNotice()
        } else if (this.isCreate && this.dialogForm.iata && this.dialogForm.epidType !== '') {
          this.handleSaveNotice()
        } else if (!this.isCreate && this.dialogForm.epidId) {
          this.handleEditNotice()
        } else {
        	this.formErr = true
        }
      } else {
        this.formErr = true
      }
    },
    // 弹出框重置
    handleReset () {
      this.dialogForm = {
      	iata: '',
        epidId: '',
        epidTitle: '',
        epidContent: '',
        epidStatus: '',
        updateOpid: '',
        isJson: true,
	      scene: '0'
      }
      this.formErr = false
    },
    // 新增
	  handleSaveNotice () {
    	this.loading = true
		  insert(this.dialogForm)
        .then(res => {
	        this.loading = false
	        this.dialogVisible = false
	        this.$message.success('新增成功!')
          this.queryList()
        })
        .catch(err => {
        	this.$message.error(err)
	        this.loading = false
	        this.dialogVisible = false
        })
    },
    // 修改
	  handleEditNotice () {
		  this.loading = true
		  update(this.dialogForm)
        .then(res => {
	        this.loading = false
	        this.dialogVisible = false
          this.$message.success('修改成功!')
	        this.queryList()
        })
        .catch(err => {
	        this.$message.error(err)
	        this.loading = false
	        this.dialogVisible = false
        })
    },
    // 操作确认
    handleConfirm (id) {
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.handleDeleteNotice(id)
      }).catch(() => {
        this.$message({
          duration: 5000,
          message: '操作取消!',
          type: 'info'
        })
      })
    },
    // 删除
    handleDeleteNotice (id) {
      deleteNotice({
	      epidId: id,
        isJson: true
      }).then(() => {
        this.$message({
          duration: 5000,
          message: '删除成功!',
          type: 'success'
        })
        this.dialogVisible = false
        this.queryList()
      }).catch(err => {
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 新增时，选择空轨，禁用三字码和弹框类型
	  disableSelect (data) {
		  console.log('dialog中场景', data)
      data === '1' ? this.disableFlag = true : this.disableFlag = false
      if (data === '1') {
      	this.dialogForm.iata = '',
        this.dialogForm.epidType = ''
      }
    }
  }
}
</script>

<style scoped>

</style>
