<template>
  <div class="container">
    <!--<h1>消息推送管理</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
            <el-input v-model="searchForm.title" clearable placeholder="标题" size="medium" @keydown.enter.native="pushNoticeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.startdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="起始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.enddate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="createDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="起始日期"-->
<!--            end-placeholder="截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="pushNoticeList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(null)">添加</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" fixed="left" width="50"></el-table-column>-->
          <el-table-column label="消息类型" prop="jump" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.jump === '7501'">消息公告</div>
              <div v-if="scope.row.jump === '7601'">消息类型</div>
              <div v-if="scope.row.jump === '7602'">首页公告</div>
              <div v-if="scope.row.jump === '7603'">首页促销</div>
            </template>
          </el-table-column>
          <el-table-column label="标题" prop="title" min-width="120"></el-table-column>
          <el-table-column label="内容" prop="message" min-width="200"></el-table-column>
          <el-table-column label="创建时间" prop="createDate" min-width="160"></el-table-column>
          <el-table-column label="创建人" prop="createOp"></el-table-column>
          <el-table-column label="推送时间" prop="pushDate" min-width="160"></el-table-column>
          <el-table-column label="推送人" prop="pushOp"></el-table-column>
          <el-table-column label="是否成功推送" prop="pushSuccess" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.pushSuccess === ''">未推送</div>
              <div v-if="scope.row.pushSuccess === '1'">成功</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="120">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.noticeId)">删除</span>
              <span class="active-text mr-5" title="推送" @click="handlePush(scope.row.pushSuccess, scope.row.noticeId)">推送</span>
              <!--<i class="table-icon delete-icon" title="删除" @click="handleDelete(scope.row.noticeId)"></i>-->
              <!--<i class="table-icon edit-icon" title="编辑" @click="handleEdit(scope.row)"></i>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableList.total">
      </el-pagination>
    </div>
    <!--编辑弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="560px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label">消息类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.jump" @change="selectTrigger(editForm.jump)" placeholder="消息类型" size="medium">
                  <el-option key="0" label="消息公告" value="7501"></el-option>
                  <el-option key="1" label="消息类型" value="7601"></el-option>
                  <el-option key="2" label="首页公告" value="7602"></el-option>
                  <el-option key="3" label="首页促销" value="7603"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">请选择</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.tblId" placeholder="请选择" size="medium">
                  <el-option v-for="item in treeList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">标题</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="标题" v-model="editForm.title" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.title">标题不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">内容</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="2" clearable placeholder="内容" v-model="editForm.message" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.message">内容不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <!--<el-button size="medium" type="primary" @click="saveEdit">{{isReset ? '提交' : '编辑'}}</el-button>-->
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" v-if="isReset" @click="resetEdit">重置</el-button>
          <el-button size="medium" @click="editVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<!--for (let-->
<script>
import { mapState } from 'vuex'
import { queryPushNoticeList, deletePushNotice, addPushNotice, updatePushNotice, querySystemInfoTree, pushNoticeInfo } from './api'
import { computeTableHeight } from '../../../utils/index'
export default {
  name: 'PushNotice',
  data () {
    return {
      searchForm: {
        sourceid: 'hbal',
        title: '', // 标题
        startdate: '', // 起始日期
        enddate: ''// 截止日期
      },
      createDate: [], // 创建/推送时间
      tableList: [], // 展示表格数据
      editForm: { // 弹出框表单数据
        jump: '', // 消息类型
        title: '', // 标题
        message: '', // 内容
        tblId: ''
      },
      treeList: [], // 消息类型的下级数据
      dataViewHeight: null, // 表格高度
      editVisible: false, // 弹出框显示隐藏
      isReset: false, // 切换添加/修改
      isEmpty: false, // 输入框判空
      loading: false, // 加载
      popupTitle: '' // 弹出框标题
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.pushNoticeList(1, this.pagination.pageSize)
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes, // 表格
      pagination: state => state.app.pagination // 分页
    })
  },
  methods: {
    // 分页导航
    handleSizeChange (pages) {
      this.pushNoticeList(null, pages)
    },
    handleCurrentChange (page) {
      this.pushNoticeList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    pushNoticeList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      queryPushNoticeList(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 监听消息类型下一级内容变化
    selectTrigger (str) {
      this.treeData(1, str)
    },
    // 获取消息类型下一级接口
    treeData (type, str) {
      // console.log(type)
      querySystemInfoTree({ typecode: str }).then(res => {
        this.treeList = res.treeList
        if (type === 1) {
          if (!this.treeList.length) {
            this.editForm.tblId = ''
          } else {
            this.editForm.tblId = this.treeList[0].id
          }
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 重置
    handleReset () {
      this.searchForm = {
        page: 1
      }
      this.pushNoticeList(1, this.pagination.pageSize)
    },
    // 添加/修改
    handleEdit (params) {
      this.editVisible = true
      if (params) {
        if (params.pushSuccess === '') {
          this.popupTitle = '修改'
          this.isReset = false
          this.dataBind(params)
          this.treeData(0, this.editForm.jump)
        } else {
          this.editVisible = false
          this.$message.warning('请选择一条未推送成功的记录')
        }
      } else {
        this.popupTitle = '添加'
        this.resetEdit()
        this.isReset = true
      }
    },
    // 数据处理
    dataBind (params) {
      this.editForm.noticeId = params.noticeId
      this.editForm.jump = params.jump
      this.editForm.title = params.title
      this.editForm.message = params.message
      this.editForm.tblId = params.tblId
    },
    // 推送
    handlePush (type, id) {
      if (type === '') {
        this.$confirm('是否确认推送?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          pushNoticeInfo({ id: id }).then(res => {
            this.$message.success(res.message)
            this.pushNoticeList()
          })
        }).catch(() => {
          this.$message.info('已取消推送')
        })
      } else {
        this.$message.warning('请选择一条未推送成功的记录')
      }
    },
    // 弹出框数据 -- 保存
    saveEdit () {
      if (this.editForm.title && this.editForm.message) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        if (this.isReset === false) {
          updatePushNotice(data).then(res => {
            this.editVisible = false
            this.pushNoticeList()
            this.$message.success(res.message)
          }).catch(err => {
            this.$message.error(err.message)
          })
        } else {
          addPushNotice(data).then(res => {
            this.editVisible = false
            this.pushNoticeList()
            this.$message.success(res.message)
          }).catch(err => {
            this.$message.error(err.message)
          })
        }
      } else {
        this.isEmpty = true
      }
    },
    // 弹出框数据 -- 重置
    resetEdit () {
      this.editForm = {
        jump: '',
        title: '',
        message: '',
        tblId: ''
      }
      this.treeList = []
      this.isEmpty = false
    },
    // 删除
    handleDelete (id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deletePushNotice({ ids: id }).then(res => {
          this.$message.success(res.message)
          this.pushNoticeList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
