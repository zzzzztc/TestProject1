<template>
  <div id="CascadeTopic" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select v-model="filter.topicLevel" size="medium" clearable placeholder="级别">
            <el-option
              v-for="item in topicLevel"
              :key="item.dincId"
              :value="item.dincCode"
              :label="item.dincName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="场景类型" v-model="filter.topicType">
            <el-option
              v-for="item in ffpQa"
              :key="item.dincCode"
              :label="item.dincName"
              :value="item.dincCode">
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="渠道" v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="启用禁用" clearable v-model="filter.topicFlag">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="queryTopicList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog(null)">新增</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :height="dataViewHeight"
          :data="topicList.rows"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle"
        >
          <el-table-column label="标题" prop="title"></el-table-column>
          <el-table-column label="父节点标题" prop="parentTitle"></el-table-column>
          <el-table-column label="层级" prop="topicLevelName"></el-table-column>
          <el-table-column label="类型" prop="typeName"></el-table-column>
          <el-table-column label="渠道">
            <template slot-scope="scope">
              {{ scope.row.channel | channelMap }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click="switchDialog(scope.row)">编辑</span>
              <span class="active-text danger-text mr-5" v-if="scope.row.topicFlag === '1'"
                    @click="confirmUpdateStatus(scope.row.cascadeTopicId, 0)">禁用</span>
              <span class="active-text mr-5" v-if="scope.row.topicFlag !== '1'"
                    @click="confirmUpdateStatus(scope.row.cascadeTopicId, 1)">启用</span>
              <span class="danger-text mr-5" @click="deleteTopic(scope.row.cascadeTopicId)">删除</span>
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
        :total="topicList.total">
      </el-pagination>
    </div>
    <!--新增编辑-->
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="visible" width="800px">
        <div class="dialog-container" v-loading="dialogLoading">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">级别</div>
                <div>
                  <el-select size="medium" v-model="topic.topicLevel" @change="firstLevelChange">
                    <el-option
                            v-for="item in topicLevel"
                            :key="item.dincId"
                            :value="item.dincCode"
                            :label="item.dincName"></el-option>
                  </el-select>
                  <div class="warning-info" v-show="formErr && !topic.topicLevel">请选择级别</div>
                </div>
              </div>
              <div class="column" v-show="topic.topicLevel === '2' || topic.topicLevel === '3'">
                <div class="label">一级节点</div>
                <div>
                  <el-select size="medium" v-model="firstNode" @change="secondLevelChange">
                    <el-option
                            v-for="item in firstLevel"
                            :key="item.cascadeTopicId"
                            :label="item.title"
                            :value="item.cascadeTopicId"></el-option>
                  </el-select>
                </div>
              </div>
              <div v-show="topic.topicLevel === '3'" class="column">
                <div class="label">二级节点</div>
                <div>
                  <el-select size="medium" v-model="secondNode">
                    <el-option
                            v-for="item in secondLevel"
                            :key="item.cascadeTopicId"
                            :label="item.title"
                            :value="item.cascadeTopicId"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">标题</div>
                <div>
                  <el-input size="medium" v-model="topic.title" clearable></el-input>
                  <div class="warning-info" v-show="formErr && !topic.title">请填写标题</div>
                </div>
              </div>
              <div class="column">
                <div class="label">场景类型</div>
                <div>
                  <el-select size="medium" v-model="topic.topicType">
                    <el-option
                      v-for="item in ffpQa"
                      :key="item.dincCode"
                      :label="item.dincName"
                      :value="item.dincCode">
                    </el-option>
                  </el-select>
                  <div class="warning-info" v-show="formErr && !topic.topicType">请选择场景类型</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">渠道</div>
                <div>
                  <el-select size="medium" :disabled="dialogTitle === '编辑' && topic.topicLevel !== '1'" clearable placeholder="渠道" multiple v-model="topic.channel">
                    <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
                  </el-select>
                  <div class="warning-info" v-show="formErr && !topic.channel.length">请选择渠道</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">启用禁用</div>
                <div>
                  <el-select size="medium" placeholder="启用禁用" v-model="topic.topicFlag">
                    <el-option label="启用" value="1"></el-option>
                    <el-option label="禁用" value="0"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="column">
                <div class="label">排序</div>
                <div>
                  <el-input size="medium" v-model="topic.topicSort" clearable></el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column" style="width: 720px">
                <div class="label">内容</div>
                <el-input type="textarea" :rows="4" v-model="topic.content"></el-input>
<!--                <div class="warning-info" v-show="formErr && !topic.content">请填写内容</div>-->
                <!--<quill-editor v-on:updateContent="getQuillEditorData" :content="topic.content"></quill-editor>-->
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button @click="topicDataFormat">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fetchProductList } from '../../../api'
import { mapState } from 'vuex'
import { getChannelList } from '../../../utils'
import {
  fetchList,
  updateStatus,
  getMetCascadeTopicByClevel,
  addMetCascadeTopic,
  fetchDetail,
  updateMetCascadeTopic,
  deleteCascadeTopic
} from './api'
import { computWidth } from '../../../mixins/computWidt'
// import QuillEditor from '../../../components/quillEditor'
export default {
  name: 'CascadeTopic',
  data () {
    return {
      dataViewHeight: null,
      loading: false,
      filter: {},
      topicLevel: [],
      ffpQa: [],
      topicList: {},
      dialogTitle: '',
      dialogLoading: false,
      visible: false,
      currentRow: {},
      topic: {
        topicLevel: null,
        topicType: null,
        channel: [],
        title: '',
        content: '',
        topicFlag: '1',
        topicSort: null
      },
      firstLevel: [],
      secondLevel: [],
      firstNode: null,
      secondNode: null,
      formErr: false,
      defaultType: null
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  // components: {
  //   QuillEditor
  // },
  mixins: [ computWidth ],
  created () {
    this.queryTopicLevel()
    this.queryFfpQa()
    this.judgeChannelList()
    this.queryTopicList(1, this.pagination.pageSize)
  },
  methods: {
    resetFilter () {
      this.filter = {}
      this.queryTopicList(1, this.pagination.pageSize)
    },
    // 渠道
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 查询场景TOPIC_LEVEL
    queryTopicLevel () {
      fetchProductList({ type: 'TOPIC_LEVEL' })
        .then(res => {
          this.topicLevel = res.rows
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 过滤出常见问题类型
    filterCommonType (list) {
      let arr = list.filter(item => {
        return item.dincName === '常见问题'
      })
      if (arr && arr.length) {
        this.defaultType = arr[0].dincCode
        this.filter.topicType = this.defaultType
      }
    },
    // 查询ffpQA
    queryFfpQa () {
      fetchProductList({ type: 'PROTOCOLSCENE' })
        .then(res => {
          this.ffpQa = res.rows
          this.filterCommonType(this.ffpQa)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 查询
    queryTopicList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter)
        .then(res => {
          this.loading = false
          this.topicList = res
          this.listFormat()
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    listFormat () {
      for (let item of this.topicList.rows) {
        for (let val of this.topicLevel) {
          if (val.dincCode === item.topicLevel) {
            item.topicLevelName = val.dincName
            break
          }
        }
        for (let val of this.ffpQa) {
          if (val.dincCode === item.topicType) {
            item.typeName = val.dincName
            break
          }
        }
      }
    },
    // 分页
    handleSizeChange (page) {
      this.queryTopicList(null, page)
    },
    handleCurrentChange (pageSize) {
      this.queryTopicList(pageSize, null)
    },
    switchDialog (row) {
      this.visible = true
      this.formErr = false
      if (row) {
        // 编辑
        this.currentRow = row
        this.getDetail()
        this.dialogTitle = '编辑'
      } else {
        [
          this.topic.topicLevel,
          this.topic.channel,
          this.topic.title,
          this.topic.content,
          this.topic.topicFlag,
          this.topic.topicSort
        ] = [null, [], null, null, '1', null]
        this.dialogTitle = '新增'
        this.topic.topicType = this.defaultType
      }
    },
    // 启用禁用
    confirmUpdateStatus (id, status) {
      this.$confirm('是否确定修改状态？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          return updateStatus({ id, status })
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.queryTopicList()
        })
        .catch(err => {
          this.$message({
            type: err.message ? 'error' : 'info',
            message: err.message || '操作取消'
          })
        })
    },
    // 级别修改
    firstLevelChange () {
      if (this.topic.topicLevel === '1') {
        return false
      } else if (this.topic.topicLevel === '2' || (this.topic.topicLevel === '3' && !this.firstNode)) {
        // 查询一级节点
        this.queryLevel({ topicLevel: 1, parentId: null })
      } else if (this.topic.topicLevel === '3' && this.firstNode) {
        // 查询二级节点
        this.queryLevel({ topicLevel: 2, parentId: this.firstNode })
      }
    },
    // 一级节点修改
    secondLevelChange () {
      // 查询二级节点
      this.queryLevel({ topicLevel: 2, parentId: this.firstNode })
    },
    // 查询节点列表
    queryLevel (data) {
      getMetCascadeTopicByClevel(data)
        .then(res => {
          if (data.topicLevel === 1) {
            this.firstLevel = res.rows
          } else if (data.topicLevel === 2) {
            this.secondLevel = res.rows
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 数据校验
    checkParam (data) {
      if (this.topic.topicLevel && this.topic.topicType && this.topic.channel.length && this.topic.title) {
        if (this.topic.topicLevel !== '1' && !data.parentId) {
          this.formErr = true
          this.$message.warning('请选择父节点')
        } else {
          this.formErr = false
          if (this.dialogTitle === '新增') {
            this.createNode(data)
          } else {
            this.editNode(data)
          }
        }
      } else {
        this.formErr = true
      }
    },
    // 新增编辑数据格式化
    topicDataFormat () {
      let data = Object.assign({}, this.topic)
      data.channel = data.channel.join(',')
      if (data.topicLevel && data.topicLevel !== '1') {
        // 非根节点，需要查找父节点
        if (this.nodeFilter(data.topicLevel)) {
          data.parentId = this.nodeFilter(data.topicLevel).cascadeTopicId
          data.parentTitle = this.nodeFilter(data.topicLevel).title
        } else {
          this.$message.error('请先选择父级节点')
        }
      }
      this.checkParam(data)
    },
    // 过滤父节点
    nodeFilter (topicLevel) {
      let arr = []
      if (topicLevel === '2') {
        arr = this.firstLevel.filter(item => {
          return this.firstNode === item.cascadeTopicId
        })
      } else if (topicLevel === '3') {
        arr = this.secondLevel.filter(item => {
          return this.secondNode === item.cascadeTopicId
        })
      }
      return arr[0]
    },
    // 创建节点
    createNode (data) {
      this.dialogLoading = true
      addMetCascadeTopic(data)
        .then(() => {
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.dialogLoading = false
          this.visible = false
          this.queryTopicList()
        })
        .catch(err => {
          this.dialogLoading = false
          this.$message({
            type: 'error',
            message: err.message
          })
        })
    },
    // 编辑
    editNode (data) {
      data.cascadeTopicId = this.currentRow.cascadeTopicId
      this.dialogLoading = true
      updateMetCascadeTopic(data)
        .then(() => {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.dialogLoading = false
          this.visible = false
          this.queryTopicList()
        })
        .catch(err => {
          this.dialogLoading = false
          this.$message({
            type: 'error',
            message: err.message
          })
        })
    },
    // 获取详情
    getDetail () {
      this.dialogLoading = true
      fetchDetail({ cascadeTopicId: this.currentRow.cascadeTopicId })
        .then(res => {
          this.dialogLoading = false
          this.resolveParentNode(res.obj)
        })
        .catch(err => {
          this.$message.error(err.message)
          this.dialogLoading = false
        })
    },
    // 解析详情中父节点数据
    resolveParentNode (data) {
      this.topic.topicLevel = data.self.topicLevel
      this.topic.topicType = data.self.topicType
      this.topic.topicFlag = data.self.topicFlag
      this.topic.topicSort = data.self.topicSort
      this.topic.channel = data.self.channel.split(',')
      this.topic.title = data.self.title
      this.topic.content = data.self.content
      if (data.self.topicLevel === '2') {
        this.firstNode = data.parent[0].cascadeTopicId
        this.queryLevel({ topicLevel: 1 })
      } else if (data.self.topicLevel === '3') {
        this.firstNode = data.parent[0].cascadeTopicId
        this.queryLevel({ topicLevel: 1 })
        this.secondNode = data.parent[1].cascadeTopicId
        this.queryLevel({ topicLevel: 2, parentId: this.firstNode })
      }
    },
    getQuillEditorData (content) {
      this.topic.content = content
    },
    // 删除
    deleteTopic (id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          return deleteCascadeTopic({ id })
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.queryTopicList()
        })
        .catch(err => {
          this.$message({
            type: err.message ? 'error' : 'info',
            message: err.message ? err.message : '操作取消'
          })
        })
    }
  }
}
</script>

<style scoped>

</style>
