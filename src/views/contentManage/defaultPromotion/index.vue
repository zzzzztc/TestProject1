<template>
  <!--<div>首页促销维护</div>-->
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
<!--        <div class="search-item">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="date"-->
<!--            type="daterange"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            range-separator="至"-->
<!--            start-placeholder="起始日期"-->
<!--            end-placeholder="截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select placeholder="是否可用" size="medium" v-model="filter.status" clearable>
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
          <el-button size="medium" type="primary" @click="getNoticeList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog()">添加</el-button>
        <el-button size="medium" type="danger" :disabled="!multipleSelection.length" @click="handleConfirm(0)">批量删除</el-button>
        <!--<el-button size="medium">置顶</el-button>-->
        <el-button size="medium" :disabled="!multipleSelection.length" @click="handleConfirm(1)">过期</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="noticeList.list"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          @selection-change="handleSelectionChange"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
          <el-table-column type="selection" :width="tableAttributes.selectionWidth"></el-table-column>
          <el-table-column label="标题" prop="topicName" min-width="140"></el-table-column>
          <el-table-column label="子标题" prop="subtitle" min-width="140"></el-table-column>
          <el-table-column label="发布人" prop="opname"></el-table-column>
          <el-table-column label="发布日期" prop="creationdate" :formatter="handleDate" min-width="100"></el-table-column>
          <el-table-column label="类型" prop="categoryname"></el-table-column>
          <el-table-column label="渠道类型" min-width="140">
            <template slot-scope="scope">
              <span>{{scope.row.channel | channelMap}}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否过期">
            <template slot-scope="scope">
              <span v-if="scope.row.topicStatus === '1'">未过期</span>
              <span v-if="scope.row.topicStatus === '0'">已过期</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120">
            <template slot-scope="scope">
              <span class="inl-block active-text mr-5" @click="switchDialog(scope.row)">编辑</span>
              <span class="inl-block active-text mr-5" @click="handleConfirm(3, scope.row)">置顶</span>
              <span class="inl-block danger-text mr-5" @click="handleConfirm(0, scope.row.topicid)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="filter.page"
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="noticeList.total">
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
                  <el-input size="medium" placeholder="标题" v-model="noticeInfo.caption" clearable></el-input>
                  <div class="warning-info" v-if="formErr && !noticeInfo.caption">标题不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label">子标题</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="子标题" v-model="noticeInfo.subtitle" clearable></el-input>
                </div>
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
                  <el-button v-if="noticeInfo.filepath" size="mini" type="primary" title='点击复制' class="el-icon-document copy-btn imgClass" :data-clipboard-text="noticeInfo.filepath" @click="copy('imgClass')">复制图片路径</el-button>
                </div>
                <div class="danger-text" v-if="formErr && !imgUrl">图片不可为空</div>
              </div>
<!--              <button @click="handleUploadImg">提交</button>-->
<!--              <div v-if="noticeInfo.filepath">{{noticeInfo.filepath}}</div>-->
            </div>
            <div class="row">
              <div class="warning-info" v-show="formErr && !noticeInfo.context">内容不可为空</div>
              <div>
                <quill-editor v-on:updateContent="getQuillEditorData" :content="noticeInfo.context"></quill-editor>
              </div>
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
import { mapState } from 'vuex'
import { fetchList, queryCategoryId, deleteNotice, outDateNotice, stickNotice, saveNotice, queryContentInfo, updateNotice, uploadImg } from './api'
import { computeTableHeight, filterIds, getChannelList } from '../../../utils/index'
import QuillEditor from '../../../components/quillEditor'
import Clipboard from 'clipboard'
import { queryNoticeInfo } from '../protocol/api'

export default {
  name: 'HomePagePromotion',
  data () {
    return {
      loading: false,
      filter: {
        sourceid: 'sdal',
        webid: 1,
        typecode: 7603,
        subtitle: '',
        status: '1',
        channel: ''
      },
      noticeCategory: [], // 类型列表
      date: [],
      dataViewHeight: null,
      noticeList: {},
      stickContainer: {}, // 置顶数据
      multipleSelection: [], // 表格多选
      dialogVisible: false,
      dialogTitle: '',
      currentId: '',
      imgUrl: '',
      imgLoading: false,
      noticeInfo: {
        webid: 1,
        context: '',
        caption: '',
        categoryid: '7603',
        subtitle: ''
      },
      channel: [],
      isCreate: false,
      formErr: false
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
    this.getCategoryid()
    this.getNoticeList(1, this.pagination.pageSize)
  },
  methods: {
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
    // 获取类型
    getCategoryid () {
      queryCategoryId({ webid: 3 }).then(res => {
        this.noticeCategory = res.treeList
      }).catch(err => {
        this.$message({
          duration: 5000,
          type: 'error',
          message: err.message
        })
      })
    },
    // 获取数据
    getNoticeList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      // if (this.date.length) {
      //   this.filter.startdate = this.date[0]
      //   this.filter.enddate = this.date[1]
      // } else {
      //   delete this.filter.startdate
      //   delete this.filter.enddate
      // }
	    this.filter.isJson = true
	    const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
	    const transformData = {
		    data: this.filter,
		    headersData: requestHeadersData
	    }
	    transformData.headersData.opName = encodeURIComponent(transformData.headersData.opName)
      fetchList(transformData).then(res => {
        this.noticeList = res.rows
	      // console.log("this.noticeList",this.noticeList)
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message({
          duration: 5000,
          type: 'error',
          message: err.message
        })
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        sourceid: 'sdal',
        webid: 1,
        typecode: 7603,
        status: '1'
      }
      this.getNoticeList(1, this.pagination.page)
    },
    // 分页
    handleSizeChange (pages) {
      this.getNoticeList(null, pages)
    },
    handleCurrentChange (page) {
      this.getNoticeList(page, null)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 操作确认
    handleConfirm (type, id) {
      let title = ''
      let typer = ''
      let ids = id || filterIds(this.multipleSelection, 'topicid').join(',')
      if (type === 0) {
        // 删除
        title = '是否确认删除？'
        typer = 'error'
      } else if (type === 1) {
        // 过期
        title = '是否确认过期'
        typer = 'warning'
      } else {
        title = '是否确认置顶'
        typer = 'warning'
        this.stickContainer = id
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: typer
      }).then(() => {
        if (type === 0) {
          this.handleDeleteNotice(ids)
        } else if (type === 1) {
          this.handleOutDateNotice(ids)
        } else {
          this.handleStickNotice()
        }
      }).catch(() => {
        this.$message({
          duration: 5000,
          message: '操作取消!',
          type: 'info'
        })
      })
    },
    // 删除信息公告
    handleDeleteNotice (id) {
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
          message: '操作成功!',
          type: 'success'
        })
        this.getNoticeList(1, this.pagination.page)
      }).catch(err => {
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 过期信息公告
    handleOutDateNotice (ids) {
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
        this.getNoticeList(1, this.pagination.page)
      }).catch(err => {
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 置顶信息公告
    handleStickNotice () {
	    const data = {}
	    data.topicid = this.stickContainer.topicid
	    data.categoryid = this.stickContainer.categoryid
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
          message: '操作成功!',
          type: 'success'
        })
        this.getNoticeList(1, this.pagination.page)
      }).catch(err => {
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 获取信息公告详情
    getNoticeDetail (id) {
	    const data = {}
	    data.topicid = id
	    data.isJson = true
	    const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
	    requestHeadersData.opName = encodeURIComponent(requestHeadersData.opName)
	    const sentData = {
		    data: data,
		    headersData: requestHeadersData
	    }
	    // console.log(sentData)
	    queryNoticeInfo(sentData).then(res => {
        this.noticeInfo.caption = res.obj.subject
        this.noticeInfo.context = res.obj.contentBody
        this.noticeInfo.categoryid = res.obj.categoryid
        // this.noticeInfo.filepath = res.obj.filepath
		    this.imgUrl = res.obj.filepath
		    this.noticeInfo.filepath = ''
		    // this.imgUrl = ''
        this.currentId = id
		    // console.log('imgUrl：',res.obj.filepath)
      }).catch(err => {
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 弹框切换
    switchDialog (param) {
      this.dialogVisible = true
      this.formErr = false
      // console.log(param)
      if (param) {
        // 编辑
        this.dialogTitle = '修改'
        this.isCreate = false
        this.noticeInfo.caption = ''
        this.noticeInfo.context = ''
        this.noticeInfo.subtitle = param.subtitle
        this.channel = param.channel ? param.channel.split(',') : []
        this.noticeInfo.categoryid = ''
        this.getNoticeDetail(param.topicid)
      } else {
        // 新增
        this.imgUrl = ''
        this.dialogTitle = '添加'
        this.isCreate = true
        this.handleReset()
      }
    },
    // 获取富文本子组件内数据
    getQuillEditorData (content) {
      this.noticeInfo.context = content
    },
    // 必填项判断
    paramJudge () {
      if (this.noticeInfo.caption && this.noticeInfo.context &&
        this.channel.length) {
        this.noticeInfo.channel = this.channel.join(',')
        this.formErr = false
        this.imgLoading = true
        if (this.isCreate) {
          this.handleSaveNotice()
        } else {
          this.handleEditNotice()
        }
      } else {
        this.formErr = true
      }
    },
    // 重置弹出框
    handleReset () {
      this.noticeInfo = {
        webid: 1,
        context: '',
        caption: '',
        categoryid: '7603',
        subtitle: ''
      }
      this.channel = []
      this.formErr = false
    },
    // 新增信息公告
    handleSaveNotice () {
	    this.noticeInfo.isJson = true
	    const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
	    const transformData = {
		    data: this.noticeInfo,
		    headersData: requestHeadersData
	    }
	    transformData.headersData.opName = encodeURIComponent(transformData.headersData.opName)
	    saveNotice(transformData).then((res) => {
			    console.log(res)
        this.$message({
          duration: 5000,
          message: '添加成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.imgLoading = false
        this.getNoticeList(1, this.pagination.page)
      }).catch(err => {
        this.imgLoading = false
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 编辑信息公告
    handleEditNotice () {
      let obj = JSON.parse(JSON.stringify(this.noticeInfo))
      obj.topicid = this.currentId
      obj.isJson = true
	    const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
	    const transformData = {
		    data: obj,
		    headersData: requestHeadersData
	    }
	    transformData.headersData.opName = encodeURIComponent(transformData.headersData.opName)
      updateNotice(transformData).then(() => {
        this.$message({
          duration: 5000,
          message: '编辑成功!',
          type: 'success'
        })
        this.dialogVisible = false
        this.imgLoading = false
        this.getNoticeList(1, this.pagination.page)
      }).catch(err => {
        this.imgLoading = false
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 选择图片
    choiceImg (e) {
      this.imgList = e.target.files
      this.imgUrl = this.getObjectURL(e.target.files[0])
      this.handleUploadImg()
    },
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
    }
  }
}
</script>

<style scoped>

</style>
