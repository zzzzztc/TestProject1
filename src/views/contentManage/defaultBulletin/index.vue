<template>
  <!--<div>首页公告管理</div>-->
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.enddate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="是否可用" clearable v-model="filter.status">
            <el-option label="已过期" value="0"></el-option>
            <el-option label="未过期" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='filter.channel' clearable placeholder='渠道类型' size='medium'>
            <el-option
              v-for='item in channelList'
              :key='item.chalId'
              :label='item.chalName'
              :value='item.chalCode'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getDefaultBulletin()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog()">添加</el-button>
        <el-button size="medium" type="danger" :disabled="!multipleSelection.length" @click="handleConfirm(0, null, null)">批量删除</el-button>
        <!--<el-button size="medium">置顶</el-button>-->
        <el-button size="medium" :disabled="!multipleSelection.length" @click="handleConfirm(2, null, null)">过期</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="defaultBulletin.list"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          @selection-change="handleSelectionChange"
          :cell-style="tableAttributes.cellStyle">
<!--            <el-table-column label="序号" type="index" width="50"></el-table-column>-->
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="标题" prop="topicName" min-width="140"></el-table-column>
            <el-table-column label="小标题" prop="subtitle" min-width="140"></el-table-column>
            <el-table-column label="发布人" prop="opname"></el-table-column>
            <el-table-column label="发布日期" prop="creationdate" :formatter="handleDate" min-width="120"></el-table-column>
            <el-table-column label="类型" prop="categoryname"></el-table-column>
            <el-table-column label="渠道类型" min-width="140">
              <template slot-scope="scope">
                <span>{{scope.row.channel | channelMap}}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否过期">
              <template slot-scope="scope">
                <span v-if="scope.row.topicStatus === '0'">过期</span>
                <span v-if="scope.row.topicStatus === '1'">未过期</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120">
              <template slot-scope="scope">
                <span class="inl-block active-text mr-5" @click="switchDialog(scope.row)">编辑</span>
                <span class="inl-block active-text mr-5" @click="handleConfirm(1, scope.row.topicid, scope.row.categoryid)">置顶</span>
                <span class="inl-block danger-text mr-5" @click="handleConfirm(0, scope.row.topicid, null)">删除</span>
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
          :total="defaultBulletin.total">
         </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="820px">
        <div class="dialog-container" v-loading="imgLoading">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">标题</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="标题" v-model="bulletInfo.caption" clearable></el-input>
                  <div class="warning-info" v-if="formErr && !bulletInfo.caption">标题不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label">子标题</div>
                <el-input size="medium" placeholder="子标题" v-model="bulletInfo.subtitle" clearable></el-input>
              </div>
              <div class="column">
                <div class="label required">渠道编号</div>
                <div class="ipt-medium">
                  <el-select v-model='channel' clearable placeholder='渠道类型' multiple size='medium' title="必填项" collapse-tags>
                    <el-option
                      v-for='item in channelList'
                      :key='item.chalId'
                      :label='item.chalName'
                      :value='item.chalCode'>
                    </el-option>
                  </el-select>
                  <div class="warning-info" v-if="formErr && !channel.length">渠道编号不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <label>
                  <div style="width: 60px;height: 60px;border: 1px solid #ccc;text-align: center">
                    <input type="file" style="display: none" @change="choiceImg($event)">
                    <img v-if="imgUrl" style="width: 50px;height: 50px;" :src="imgUrl" alt="">
                    <i v-if="!imgUrl" style="font-size: 40px;color: #ccc" class="el-icon-upload"></i>
                  </div>
                </label>
                <div class="mt-10">
                  <el-button v-if="bulletInfo.filepath" size="mini" type="primary" title='点击复制' class="el-icon-document copy-btn imgClass" :data-clipboard-text="bulletInfo.filepath" @click="copy('imgClass')">复制图片路径</el-button>
                </div>
                <div class="danger-text" v-if="formErr && !imgUrl">图片不可为空</div>
              </div>
            </div>
            <div class="row">
              <div class="warning-info" v-if="formErr && !bulletInfo.context">内容不可为空</div>
              <quill-editor v-on:updateContent="getQuillEditorData" :content="bulletInfo.context"></quill-editor>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" type="primary" @click="paramJudge">提交</el-button>
            <!--<el-button size="medium" type="primary" @click="paramJudge">{{ isCreate ? '提交' : '编辑'}}</el-button>-->
            <el-button size="medium" v-if="isCreate" @click="handleReset">重置</el-button>
            <el-button size="medium" @click="dialogVisible = false">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { computeTableHeight, filterIds, getChannelList } from '../../../utils/index'
import { mapState } from 'vuex'
import { fetchList, saveNotice, queryContentInfo, updateNotice, deleteNotice, stickNotice, outdateNotice, uploadImg } from './api'
import QuillEditor from '../../../components/quillEditor'
import Clipboard from 'clipboard'
import { queryNoticeInfo } from '../protocol/api'
import { outDateNotice } from '../message/api'

export default {
  name: 'HomePageNotice',
  data () {
    return {
      loading: false,
      imgLoading: false,
      filter: {
        webid: '2',
        sourceid: 'sdal',
        typecode: 7602,
        status: '1',
        channel: ''
      },
      multipleSelection: [], // 多选数据
      dataViewHeight: null,
      date: [],
      defaultBulletin: {},
      dialogVisible: false,
      dialogTitle: '',
      isCreate: false,
      formErr: false,
      currentItem: {}, // 当前选中的单条数据
      bulletInfo: {
        webid: 2,
        categoryid: 7602,
        caption: '',
        subtitle: '',
        context: ''
      },
      channel: [],
      imgUrl: ''
    }
  },
  components: {
    QuillEditor
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  computed: {
    ...mapState({
      channelList: state => state.app.channelList,
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  created () {
    this.judgeChannelList()
    this.getDefaultBulletin(1, this.pagination.pageSize)
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 发布日期过滤
    handleDate (row, column, cellValue) {
      return cellValue.substring(0, 10)
    },
    // 获取数据
    getDefaultBulletin (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
	    this.filter.isJson = true
	    const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
	    const transformData = {
		    data: this.filter,
		    headersData: requestHeadersData
	    }
	    transformData.headersData.opName = encodeURIComponent(transformData.headersData.opName)
	    fetchList(transformData).then(res => {
        this.defaultBulletin = res.rows
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 重置查询条件
    resetFilter () {
      this.filter = {
        webid: '2',
        sourceid: 'sdal',
        typecode: 7602,
        status: '1'
      }
      this.date = []
      this.getDefaultBulletin(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getDefaultBulletin(null, pages)
    },
    handleCurrentChange (page) {
      this.getDefaultBulletin(page, null)
    },
    // 选择数据
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取公告详情
    getBulletinDetail () {
	    const data = {}
	    data.topicid = this.currentItem.topicid
	    data.isJson = true
	    const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
	    requestHeadersData.opName = encodeURIComponent(requestHeadersData.opName)
	    const sentData = {
		    data: data,
		    headersData: requestHeadersData
	    }
	    // console.log(sentData)
	    queryNoticeInfo(sentData).then(res => {
        // console.log(res)
        this.bulletInfo.context = res.obj.contentBody
        this.bulletInfo.caption = res.obj.subject
        this.bulletInfo.subtitle = this.currentItem.subtitle
        this.bulletInfo.filepath = res.obj.filepath
        this.imgUrl = res.obj.filepath
		    // this.bulletInfo.filepath = ''
		    // this.imgUrl = ''
      }).catch(err => {
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 切换弹出框
    switchDialog (param) {
      this.dialogVisible = true
      this.currentItem = param
      this.formErr = false
      // console.log(param)
      if (param) {
        // 编辑
        this.isCreate = false
        this.currentItem = param
        this.dialogTitle = '修改'
        this.channel = param.channel ? param.channel.split(',') : []
        this.bulletInfo.context = ''
        this.bulletInfo.caption = param.name
        this.bulletInfo.subtitle = param.subtitle
        this.getBulletinDetail()
      } else {
        // 新增
        this.isCreate = true
        this.dialogTitle = '添加'
        this.bulletInfo.context = ''
        this.bulletInfo.caption = ''
        this.channel = []
        this.bulletInfo.subtitle = ''
        this.bulletInfo.filepath = ''
        this.imgUrl = ''
      }
    },
    // 接受子组件的数据
    getQuillEditorData (content) {
      this.bulletInfo.context = content
    },
    // 新增编辑参数判断
    paramJudge () {
      if (this.bulletInfo.caption && this.bulletInfo.context &&
        this.channel.length) {
        this.bulletInfo.channel = this.channel.join(',')
        this.formErr = false
        this.imgLoading = true
        if (this.isCreate) {
          this.handleAddBulletin()
        } else {
          this.handleEditBulletin()
        }
      } else {
        this.formErr = true
      }
    },
    // 弹出框重置
    handleReset () {
      this.bulletInfo = {
        webid: 2,
        categoryid: 7602,
        caption: '',
        subtitle: '',
        context: ''
      }
      this.imgUrl = ''
      this.channel = []
      this.formErr = false
    },
    // 新增首页公告
    handleAddBulletin () {
	    this.bulletInfo.isJson = true
	    const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
	    const transformData = {
		    data: this.bulletInfo,
		    headersData: requestHeadersData
	    }
	    transformData.headersData.opName = encodeURIComponent(transformData.headersData.opName)
	    saveNotice(transformData).then((res) => {
			    console.log(res)
        this.$message({
          duration: 5000,
          message: '新增成功!',
          type: 'success'
        })
        this.getDefaultBulletin()
        this.dialogVisible = false
        this.imgLoading = false
      }).catch(err => {
        this.imgLoading = false
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 编辑首页公告
    handleEditBulletin () {
      let data = JSON.parse(JSON.stringify(this.bulletInfo))
      data.topicid = this.currentItem.topicid
      data.isJson = true
	    const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
	    const transformData = {
		    data: data,
		    headersData: requestHeadersData
	    }
	    transformData.headersData.opName = encodeURIComponent(transformData.headersData.opName)
      updateNotice(transformData).then(() => {
        this.$message({
          duration: 5000,
          message: '编辑成功!',
          type: 'success'
        })
        this.getDefaultBulletin()
        this.dialogVisible = false
        this.imgLoading = false
      }).catch(err => {
        this.imgLoading = false
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 确认框
    handleConfirm (type, id, cid) {
      let title = ''
      let typer = ''
      let ids = id || filterIds(this.multipleSelection, 'topicid').join(',')
      if (type === 0) {
        // 删除
        title = '是否确认删除？'
        typer = 'error'
      } else if (type === 1) {
        // 置顶
        title = '是否确认置顶'
        typer = 'warning'
      } else if (type === 2) {
        // 过期
        title = '是否确认过期'
        typer = 'warning'
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: typer
      }).then(() => {
        if (type === 0) {
          this.handleDeleteBulletin(ids)
        } else if (type === 1) {
          this.handleTopBulletin(ids, cid)
        } else if (type === 2) {
          this.handleChangeStatus(ids)
        }
      }).catch(() => {
        this.$message({
          duration: 5000,
          message: '操作取消',
          type: 'info'
        })
      })
    },
    // 选择图片
    choiceImg (e) {
      this.imgList = e.target.files
      this.imgUrl = this.getObjectURL(e.target.files[0])
      this.handleUploadImg()
    },
    // 处理图片
    getObjectURL (file) {
      let url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    // 上传图片
    handleUploadImg () {
      this.imgLoading = true
      let data = new FormData()
      for (let i = 0; i < this.imgList.length; i++) {
        data.append('noticePic', this.imgList[i])
      }
      uploadImg(data).then(res => {
        this.$message({
          duration: 5000,
          message: '上传成功',
          type: 'success'
        })
        this.bulletInfo.filepath = res.message
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
    // 复制列数据
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
    // 删除
    handleDeleteBulletin (id) {
	    const data = {}
	    data.ids = id
	    data.isJson = true
	    const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
	    requestHeadersData.opName = encodeURIComponent(requestHeadersData.opName)
	    const sentData = {
		    data: data,
		    headersData: requestHeadersData
	    }
	    // console.log(sentData)
	    deleteNotice(sentData).then(res => {
        this.$message({
          duration: 5000,
          message: '删除成功!',
          type: 'success'
        })
        this.getDefaultBulletin()
      }).catch(err => {
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 置顶
    handleTopBulletin (id, categoryid) {
	    const data = {}
	    data.topicid = id
	    data.categoryid = categoryid
	    data.isJson = true
	    const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
	    requestHeadersData.opName = encodeURIComponent(requestHeadersData.opName)
	    const sentData = {
		    data: data,
		    headersData: requestHeadersData
	    }
	    // console.log(sentData)
	    stickNotice(sentData).then(() => {
        this.$message({
          duration: 5000,
          message: '置顶成功!',
          type: 'success'
        })
        this.getDefaultBulletin()
      }).catch(err => {
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 过期
    handleChangeStatus (ids) {
	    const data = {}
	    data.ids = ids
      data.isJson = true
	    const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
	    requestHeadersData.opName = encodeURIComponent(requestHeadersData.opName)
	    const sentData = {
		    data: data,
		    headersData: requestHeadersData
	    }
	    // console.log(sentData)
	    outDateNotice(sentData).then(() => {
        this.$message({
          duration: 5000,
          message: '操作成功!',
          type: 'success'
        })
        this.getDefaultBulletin()
      }).catch(err => {
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
