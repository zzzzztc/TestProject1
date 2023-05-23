<template>
  <!--<div>协议条款维护</div>-->
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
            placeholder="起始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.enddate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="截止日期">
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
          <el-select size="medium" placeholder="协议场景" v-model="filter.protocolScene" clearable>
            <el-option v-for="item in dataDictionary.PROTOCOLSCENE" :key="item.dincId" :label="item.dincName" :value="item.dincCode"></el-option>
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
          <el-button size="medium" type="primary" @click="getProtocolList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog()">添加</el-button>
        <el-button size="medium" type="danger" :disabled="!multipleSelection.length" @click="handleConfirm(0)">批量删除</el-button>
        <!--<el-button size="medium">置顶</el-button>-->
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="ProtocolList.list"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          @selection-change="handleSelectionChange"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" fixed="left" type="index" width="50"></el-table-column>-->
          <el-table-column type="selection" :width="tableAttributes.selectionWidth"></el-table-column>
          <el-table-column label="标题" prop="topicName" min-width="120"></el-table-column>
          <el-table-column label="场景" prop="dincName"></el-table-column>
          <el-table-column label="发布人" prop="opname"></el-table-column>
          <el-table-column label="发布日期" prop="creationdate" :formatter="handleDate"></el-table-column>
          <el-table-column label="类型" prop="categoryname"></el-table-column>
          <el-table-column label="渠道类型" min-width="140">
            <template slot-scope="scope">
              <span>{{scope.row.channel | channelMap}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="80">
            <template slot-scope="scope">
              <span class="active-text inl-block mr-5" @click="switchDialog(scope.row)">编辑</span>
              <span class="active-text inl-block mr-5" @click="handleConfirm(1, scope.row.topicid, scope.row.categoryid)">置顶</span>
              <span class="danger-text inl-block mr-5" @click="handleConfirm(0, scope.row.topicid)">删除</span>
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
        :total="ProtocolList.total">
      </el-pagination>
    </div>
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="800px">
        <div class="dialog-container" v-loading="imgLoading">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">标题</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="标题" v-model="protocolInfo.caption" clearable></el-input>
                  <div class="warning-info" v-if="formErr && !protocolInfo.caption">标题不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">协议场景</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="协议场景" v-model="protocolInfo.parenttopicid">
                    <el-option v-for="item in dataDictionary.PROTOCOLSCENE" :key="item.dincId" :label="item.dincName" :value="item.dincCode"></el-option>
                  </el-select>
                  <div class="warning-info" v-if="formErr && !protocolInfo.parenttopicid">协议场景必选</div>
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
                  <el-button v-if="protocolInfo.filepath" size="mini" type="primary" title='点击复制' class="el-icon-document copy-btn imgClass" :data-clipboard-text="protocolInfo.filepath" @click="copy('imgClass')">复制图片路径</el-button>
                </div>
                <div class="danger-text" v-if="formErr && !imgUrl">图片不可为空</div>
              </div>
              <!--              <button @click="handleUploadImg">提交</button>-->
              <!--              <div v-if="noticeInfo.filepath">{{noticeInfo.filepath}}</div>-->
            </div>
            <div class="row">
              <div class="warning-info" v-show="formErr && !protocolInfo.context">内容不可为空</div>
              <quill-editor v-on:updateContent="getQuillEditorData" :content="protocolInfo.context"></quill-editor>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" type="primary" @click="paramJudge">提交</el-button>
            <!--<el-button size="medium" type="primary" @click="paramJudge">{{isCreate ? '提交' : '编辑'}}</el-button>-->
            <el-button size="medium" v-if="isCreate" @click="handleReset">重置</el-button>
            <el-button size="medium" @click="dialogVisible = false">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { computeTableHeight, getDataDictionary, filterIds, getChannelList } from '../../../utils/index'
import { mapState } from 'vuex'
import { fetchList, saveNotice, queryNoticeInfo, updateNotice, deleteNotice, stickNotice, uploadImg } from './api'
import QuillEditor from '../../../components/quillEditor'
import Clipboard from 'clipboard'

export default {
  name: 'Protocol',
  data () {
    return {
      loading: false,
      imgLoading: false,
      dataViewHeight: null,
      filter: {
        typecode: 7504,
        webid: 4,
        channel: ''
      },
      date: [],
      ProtocolList: {},
      dialogVisible: false,
      dialogTitle: '',
      isCreate: false,
      formErr: false,
      imgUrl: '',
      currentItem: {},
      multipleSelection: [],
      protocolInfo: {
        categoryid: 7504,
        webid: 4,
        caption: '',
        parenttopicid: '',
        context: ''
      },
      channel: []
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
      pagination: state => state.app.pagination,
      dataDictionary: state => state.app.dataDictionary
    })
  },
  created () {
    this.judgeChannelList()
    this.judgeProtocol()
    this.getProtocolList(1, this.pagination.pageSize)
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
    // 判断协议场景
    judgeProtocol () {
      if (!this.dataDictionary.PROTOCOLSCENE.length) {
        getDataDictionary('PROTOCOLSCENE')
        // this.getProtocolList(1, this.pagination.pageSize)
      }
    },
    // 获取数据
    async getProtocolList (page, pageSize) {
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
      await this.judgeProtocol()
      // 新街口
      this.filter.isJson = true
	    const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
	    const transformData = {
		    data: this.filter,
		    headersData: requestHeadersData
	    }
	    transformData.headersData.opName = encodeURIComponent(transformData.headersData.opName)
	    console.log(transformData)
      fetchList(transformData).then(res => {
        this.ProtocolList = res.rows
	      // console.log('this.ProtocolList',this.ProtocolList)
	      // console.log('this.dataDictionary.PROTOCOLSCENE',this.dataDictionary.PROTOCOLSCENE)
        for (let i = 0; i < this.ProtocolList.list.length; i++) {
          for (let j = 0; j < this.dataDictionary.PROTOCOLSCENE.length; j++) {
            if (this.ProtocolList.list[i].parenttopicid === this.dataDictionary.PROTOCOLSCENE[j].dincCode) {
              this.ProtocolList.list[i].dincName = this.dataDictionary.PROTOCOLSCENE[j].dincName
              break
            }
          }
        }
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
      this.getProtocolList(null, pages)
    },
    handleCurrentChange (page) {
      this.getProtocolList(page, null)
    },
    // 重置
    resetFilter () {
      this.filter = {
        typecode: 7504,
        webid: 4
      }
      this.getProtocolList(1, this.pagination.pageSize)
    },
    // 接收富文本组件内数据
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getQuillEditorData (content) {
      this.protocolInfo.context = content
    },
    // 获取条款详情
    getNoticeDetail (id) {
	    // const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
	    // const data = {
	    //   topicid: id,
	    //   isJson : true
	    // }
	    // const sentData = {
	    //   data: data,
	    //   headersData:requestHeadersData
	    // }
	    // sentData.headersData.opName = encodeURIComponent(sentData.headersData.opName);
	    // console.log(sentData)
      const data = {}
      data.topicid = id
      data.isJson = true
      const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
      requestHeadersData.opName = encodeURIComponent(requestHeadersData.opName)
      const sentData = {
	    	data: data,
        headersData: requestHeadersData
      }
	    console.log(sentData)
      queryNoticeInfo(sentData).then(res => {
        this.protocolInfo.caption = res.obj ? res.obj.subject : this.currentItem.name
        this.protocolInfo.parenttopicid = this.currentItem.parenttopicid
        this.protocolInfo.context = res.obj ? res.obj.contentBody : ''
        this.protocolInfo.filepath = res.obj ? res.obj.filepath : ''
        this.imgUrl = res.obj ? res.obj.filepath : ''
	      // this.imgUrl = ''
	      // this.protocolInfo.filepath = ''
      }).catch(err => {
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 切换弹框
    switchDialog (param) {
      this.dialogVisible = true
      if (param) {
        // 编辑
        this.currentItem = param
        this.isCreate = false
        this.dialogTitle = '修改'
        this.channel = param.channel ? param.channel.split(',') : []
        this.getNoticeDetail(param.topicid)
      } else {
        // 新增
        this.isCreate = true
        this.dialogTitle = '添加'
        this.handleReset()
      }
    },
    // 参数判断
    paramJudge () {
      if (this.protocolInfo.caption && this.protocolInfo.context && this.protocolInfo.parenttopicid && this.channel.length) {
        this.formErr = false
        this.protocolInfo.channel = this.channel.join(',')
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
    // 弹出框重置
    handleReset () {
      this.protocolInfo = {
        categoryid: 7504,
        webid: 4,
        caption: '',
        parenttopicid: '',
        context: '',
        filepath: ''
      }
      this.imgUrl = ''
      this.channel = []
      this.formErr = false
    },
    // 新增协议条款
    handleSaveNotice () {
    	// 新协议修改
    	this.protocolInfo.isJson = true
      const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
      const transformData = {
    		data: this.protocolInfo,
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
        this.getProtocolList()
      }).catch((err) => {
        this.imgLoading = false
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 编辑协议条款
    handleEditNotice () {
	    // 新协议修改
      let data = JSON.parse(JSON.stringify(this.protocolInfo))
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
        this.dialogVisible = false
        this.imgLoading = false
        this.getProtocolList()
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
        this.protocolInfo.filepath = res.message
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
    // 操作确认
    handleConfirm (type, id, categoryid) {
      let ids = id || filterIds(this.multipleSelection, 'topicid').join(',')
      let title = ''
      let typer = ''
      if (type === 0) {
        // 删除
        title = '是否确认删除？'
        typer = 'error'
      } else if (type === 1) {
        // 置顶
        title = '是否确认置顶'
        typer = 'warning'
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: typer
      }).then(() => {
        if (type === 0) {
          this.handleDeleteNotice(ids)
        } else {
          // 值机
          this.handleStickNotice(id, categoryid)
        }
      }).catch(() => {
        this.$message({
          duration: 5000,
          message: '操作取消!',
          type: 'info'
        })
      })
    },
    // 删除协议条款
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
	    console.log(sentData)
	    deleteNotice(sentData).then(res => {
        this.$message({
          duration: 5000,
          message: '删除成功!',
          type: 'success'
        })
        this.dialogVisible = false
        this.getProtocolList()
      }).catch(err => {
        this.$message({
          duration: 5000,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 置顶协议条款
    handleStickNotice (id, categoryid) {
	    const data = {}
	    data.topicid = id
      data.isJson = true
	    data.categoryid = categoryid
	    // console.log('缓存读取',window.localStorage.getItem('userInfo'))
	    // console.log('parse',JSON.parse(window.localStorage.getItem('userInfo')))
	    const requestHeadersData = JSON.parse(window.localStorage.getItem('userInfo'))
	    requestHeadersData.opName = encodeURIComponent(requestHeadersData.opName)
	    const sentData = {
		    data: data,
		    headersData: requestHeadersData
	    }
	    console.log(sentData)
      stickNotice(sentData).then(() => {
        this.$message({
          duration: 5000,
          message: '置顶成功!',
          type: 'success'
        })
        this.dialogVisible = false
        this.getProtocolList()
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
