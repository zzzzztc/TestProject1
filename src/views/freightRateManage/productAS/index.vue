<template>
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input
            size="medium"
            clearable
            placeholder="标题"
            v-model="filter.sceneTitle"
            @keydown.enter.native="queryList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select
            size="medium"
            clearable
            placeholder="渠道"
            v-model="filter.channel">
            <el-option
              v-for="item in channelList"
              :key="item.chalId"
              :label="item.chalName"
              :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select
            size="medium"
            clearable
            v-model="filter.sceneType"
            placeholder="类型">
            <el-option
              v-for="item in dataDictionary.SCENE_TYPE"
              :key="item.dincId" :value="item.dincCode"
              :label="item.dincName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select
            size="medium"
            clearable placeholder="状态" v-model="filter.sceneFlag">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="queryList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog(1)">新增</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table :cell-style= "tableAttributes.cellStyle"
                  :stripe="tableAttributes.stripe"
                  :border="tableAttributes.border"
                  :data="list.rows"
                  v-loading="loading">
          <el-table-column label="标题" prop="sceneTitle"></el-table-column>
          <el-table-column label="渠道">
            <template slot-scope="scope">
              <div>{{ scope.row.channel | channelMap }}</div>
            </template>
          </el-table-column>
          <el-table-column label="图片地址">
            <template slot-scope="scope">
              <a target="_blank" :href="scope.row.picUrl">{{ scope.row.picUrl }}</a>
            </template>
          </el-table-column>
          <el-table-column label="跳转地址">
            <template slot-scope="scope">
              <div>{{ scope.row.jumpUrl }}</div>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="sceneTypeMap">
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <div>{{ scope.row.sceneFlag === '1' ? '启用' : '禁用' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click="switchDialog(2, scope.row)">编辑</span>
              <span class="danger-text mr-5" @click="deleteConfirm(scope.row)">删除</span>
              <span class="active-text mr-5" v-if="scope.row.sceneFlag !== '1'" @click="toggleStatus(scope.row.sceneId, '1')">启用</span>
              <span class="danger-text mr-5" v-if="scope.row.sceneFlag === '1'" @click="toggleStatus(scope.row.sceneId, '0')">禁用</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div>
      <el-dialog :visible.sync="visible" :title="dialogTitle" width="560px">
        <div class="dialog-container" v-loading=" dialogLoading">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">标题</div>
                <el-input size="medium" clearable placeholder="标题" v-model="sceneInfo.sceneTitle"></el-input>
                <div class="warning-info" v-show="formErr && !sceneInfo.sceneTitle">请填写标题</div>
              </div>
              <div class="column">
                <div class="label">渠道</div>
                <div class="ipt-medium">
                  <el-select size="mini" placeholder="渠道" clearable multiple v-model="channelRow">
                    <el-option
                      v-for="item in channelList"
                      :key="item.chalId"
                      :label="item.chalName"
                      :value="item.chalCode"></el-option>
                  </el-select>
                  <div class="warning-info" v-show="formErr && !channel">请选择渠道</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label">类型</div>
                <div class="ipt-medium">
                  <el-select size="mini" placeholder="类型" clearable v-model="sceneInfo.sceneType">
                    <el-option
                      v-for="item in dataDictionary.SCENE_TYPE"
                      :key="item.dincId" :value="item.dincCode"
                      :label="item.dincName"></el-option>
                  </el-select>
                  <div class="warning-info" v-show="formErr && !sceneInfo.sceneType">请选择类型</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">状态</div>
                <div class="ipt-medium">
                  <el-select size="mini" placeholder="状态" clearable v-model="sceneInfo.sceneFlag">
                    <el-option label="启用" value="1"></el-option>
                    <el-option label="禁用" value="0"></el-option>
                  </el-select>
                  <div class="warning-info" v-show="formErr && !sceneInfo.sceneFlag">请选择类型</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label">说明</div>
                <div class="ipt-medium">
                  <el-input size="medium" clearable placeholder="说明" v-model="sceneInfo.sceneContent"></el-input>
                </div>
              </div>
              <div class="column">
                <div class="label">跳转地址</div>
                <div class="ipt-medium">
                  <el-input size="medium" clearable placeholder="跳转地址" v-model="sceneInfo.jumpUrl"></el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label">图片</div>
                <label>
                  <div style="width: 160px;height: 160px;border: 1px solid #ccc;text-align: center">
                    <input style="display: none" type="file" @change="changeImg($event)">
                    <img v-if="imgUrl" style="width: 160px;height: 160px;" :src="imgUrl" alt="">
                    <i v-if="!imgUrl" style="font-size: 40px;color: #ccc" class="el-icon-upload"></i>
                  </div>
                </label>
                <div class="danger-text" v-if="formErr && dialogTitle === '新增' && !imgFile">请选择图片</div>
                <div class="danger-text" v-if="formErr && dialogTitle === '编辑' && !imgFile && !imgUrl">请选择图片</div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="paramCheck">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fetchList, addAs, editAs, deleteScene, updateStatus } from './api'
import { mapState } from 'vuex'
import { getChannelList, getDataDictionary } from '../../../utils'

export default {
  name: 'ProductAS',
  data () {
    return {
      filter: {},
      loading: false,
      list: {},
      visible: false,
      dialogLoading: false,
      dialogTitle: '',
      sceneInfo: {
        sceneTitle: '',
        channel: '',
        sceneType: '',
        sceneFlag: '',
        sceneContent: '',
        jumpUrl: '',
        pic: '',
        sceneId: ''
      },
      formErr: false,
      channelRow: [],
      imgUrl: '',
      imgFile: '',
      currentRow: {}
    }
  },
  filters: {},
  created () {
    this.judgeChannelList()
    this.judgeProtocol()
    this.queryList(1, this.pagination.pageSize)
  },
  computed: {
    channel () {
      if (this.channelRow.length) {
        return this.channelRow.join(',')
      }
      return null
    },
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      dataDictionary: state => state.app.dataDictionary
    })
  },
  methods: {
    resetFilter () {
      this.filter = {}
      this.queryList()
    },
    // 判断协议场景
    judgeProtocol () {
      if (!this.dataDictionary.SCENE_TYPE.length) {
        getDataDictionary('SCENE_TYPE')
        // this.getProtocolList(1, this.pagination.pageSize)
      }
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    queryList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter)
        .then(res => {
          this.loading = false
          this.list = res
          this.list.rows.forEach(item => {
            this.dataDictionary.SCENE_TYPE.forEach(val => {
              if (item.sceneType === val.dincCode) {
                item.sceneTypeMap = val.dincName
              }
            })
          })
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    switchDialog (type, row) {
      this.visible = true
      this.formErr = false
      if (type === 1) {
        // 新增
        this.dialogTitle = '新增'
        this.imgUrl = null
        this.imgFile = null
      } else if (type === 2) {
        // 编辑
        this.dialogTitle = '编辑'
        this.currentRow = row
        this.sceneInfo = Object.assign(this.sceneInfo, this.currentRow)
        this.channelRow = this.currentRow.channel.split(',')
        this.imgUrl = this.currentRow.picUrl
        this.imgFile = this.currentRow.picUrl
      }
    },
    // 选择图片
    changeImg (e) {
      this.imgFile = e.target.files[0]
      this.imgUrl = this.getObjectURL(e.target.files[0])
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
    // 判断是否有图片t
    picCheck () {
      if (this.dialogTitle === '新增' && !this.imgFile) {
        return false
      } else if (this.dialogTitle === '编辑' && !this.imgFile && !this.imgUrl) {
        return false
      } else {
        return true
      }
    },
    // 请求参数校验
    paramCheck () {
      if (this.sceneInfo.sceneTitle &&
        this.channel &&
        this.sceneInfo.sceneType &&
        this.sceneInfo.sceneFlag &&
        this.picCheck()) {
        // 校验通过
        this.formErr = false
        if (this.dialogTitle === '新增') {
          this.createScene()
        } else {
          this.editScene()
        }
      } else {
        this.formErr = true
      }
    },
    collectData () {
      let data = new FormData()
      data.append('sceneTitle', this.sceneInfo.sceneTitle)
      data.append('channel', this.channel)
      data.append('sceneType', this.sceneInfo.sceneType)
      data.append('sceneFlag', this.sceneInfo.sceneFlag)
      data.append('sceneContent', this.sceneInfo.sceneContent)
      data.append('jumpUrl', this.sceneInfo.jumpUrl)
      data.append('pic', this.imgFile)
      return data
    },
    // 新新增
    createScene () {
      this.dialogLoading = true
      addAs(this.collectData())
        .then(() => {
          this.dialogLoading = false
          this.visible = false
          this.queryList()
          this.$message({
            type: 'success',
            message: '提交成功'
          })
        })
        .catch(err => {
          this.dialogLoading = false
          this.$message.error(err.message)
        })
    },
    // 编辑
    editScene () {
      this.dialogLoading = true
      let data = this.collectData()
      data.append('sceneId', this.currentRow.sceneId)
      data.delete('pic')
      data.append('pic', this.imgFile)
      editAs(data)
        .then(() => {
          this.dialogLoading = false
          this.visible = false
          this.queryList()
          this.$message({
            type: 'success',
            message: '提交成功'
          })
        })
        .catch(err => {
          this.dialogLoading = false
          this.$message.error(err.message)
        })
    },
    // 删除
    deleteConfirm (row) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.loading = true
          return deleteScene({ ids: row.sceneId })
        })
        .then(() => {
          this.loading = false
          this.queryList()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    toggleStatus (id, status) {
      let txt = status === '1' ? '启用' : '禁用'
      this.$confirm(`是否确认${txt}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          return updateStatus({ id: id, status: status })
        })
        .then(() => {
          this.queryList()
          this.$message({
            type: 'success',
            message: '更新成功'
          })
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  }
}
</script>

<style scoped>

</style>
