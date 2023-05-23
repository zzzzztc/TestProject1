<template>
  <div id="Problem" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="params.queContent" placeholder="问题内容" title="问题内容"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="params.queStatus" clearable title='问题状态'  placeholder="问题状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="initrefer">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="rescive(null)">添加</el-button>
        <el-button type='danger' size='medium' :disabled='dataArr.length === 0' @click="delList(null)">批量删除</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          :cell-style="tableAttributes.cellStyle"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          row-key="lowestpriceid"
          ref="refTable"
          v-loading="loading"
          @selection-change='handleSelectionChange'
          :height="dataViewHeight"
          :data="dataObj.rows">
<!--          <el-table-column label='序号' width="50" fixed="left" type='index'></el-table-column>-->
          <el-table-column type='selection' fixed="left"></el-table-column>
          <el-table-column label="安全问题" prop="queContent" min-width="200"></el-table-column>
          <el-table-column label="内容类型" prop="queRemark" min-width="120"></el-table-column>
          <el-table-column label="创建人" prop="createOpid" min-width="150"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" min-width="160"></el-table-column>
          <el-table-column label="修改人" prop="modifyOpid" min-width="150"></el-table-column>
          <el-table-column label="修改时间" prop="modifyTime" min-width="160"></el-table-column>
          <el-table-column label='操作'  align='left' width="120" fixed="right">
            <template slot-scope='scope'>
              <span class="active-text mr-5" @click='handledit({ id: scope.row.questionId, status: "0" }, "禁用")' v-if="scope.row.queStatus === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handledit({ id: scope.row.questionId, status: "1" }, "启用")' v-if="scope.row.queStatus === '0'" title="禁用">启用</span>
              <span class="active-text mr-5" title="编辑" @click="rescive(scope.row, 'revise')">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="delList(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataObj.total">
      </el-pagination>
    </div>
    <el-dialog :title="dialogCennel" :visible.sync="dialogBlean" width="350px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">问题状态</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.queStatus"  placeholder="问题状态">
                  <el-option label="启用" value="0"></el-option>
                  <el-option label="禁用" value="1"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">问题类型</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.queType"  placeholder="问题类型">
                  <el-option label="个人相关" value="1"></el-option>
                  <el-option label="家庭相关" value="2"></el-option>
                  <el-option label="成长相关" value="3"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">安全问题</div>
              <div class="fl ipt-medium">
                <el-input
                  type="textarea"
                  :rows="3"
                  clearable
                  placeholder="安全问题"
                  v-model="msg.queContent">
                </el-input>
                <div class="warning-info" v-if="flag && !msg.queContent">安全问题不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="refer">提交</el-button>
          <el-button size="medium" v-if="ref === 'add'" @click="reset">重置</el-button>
          <el-button size="medium" @click="dialogBlean = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as types from './api'
import * as servers from './server'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'Problem',
  data () {
    return {
      dataViewHeight: null,
      params: {
        queStatus: '',
        queContent: ''
      },
      dataObj: {},
      loading: false,
      dialogCennel: '',
      dialogBlean: false,
      msg: {
        queStatus: '0',
        queContent: '',
        queType: '1',
        queRemark: ''
      },
      flag: false,
      ref: '',
      dataArr: []
    }
  },
  created () {
    this.initData(1, this.pagination.pageSize)
  },
  methods: {
    search () {
      this.initData(1, this.pagination.pageSize)
    },
    initrefer () {
      this.params = {}
      this.initData(1, this.pagination.pageSize)
    },
    initData (page, pageSize) {
      this.loading = true
      if (page) this.params.page = page
      if (pageSize) this.params.rows = pageSize
      types.getSafeQuestionList(this.params).then(res => {
        this.loading = false
        this.dataObj = res
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    rescive (param) {
      this.dialogBlean = true
      if (param !== null) {
        this.dialogCennel = '修改'
        this.ref = ''
        servers.deletelists.backShow(param, this.msg, 'queStatus')
      } else {
        this.dialogCennel = '添加'
        this.ref = 'add'
        //  this.msg目标对象 state初始化值
        this.msg = servers.deletelists.empty(this.msg, 'queStatus')
        delete this.msg.questionId
      }
    },
    handleSelectionChange (list) {
      this.dataArr = list
    },
    handleSizeChange (pages) {
      this.initData(null, pages)
    },
    handleCurrentChange (page) {
      this.initData(page, null)
    },
    refer () {
      this.flag = true
      if (!this.msg.queContent) return false
      switch (this.msg.queType) {
        case '1':
          this.msg.queRemark = '个人相关'
          break
        case '2':
          this.msg.queRemark = '家庭相关'
          break
        default:
          this.msg.queRemark = '成长相关'
      }
      this.msg.queStatus = servers.deletelists.queStatus(this.msg.queStatus)
      if (!this.msg.questionId) {
        this.addList()
      } else {
        this.upList()
      }
    },
    //  添加
    addList () {
      types.addSafeQuestion(this.msg).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.dialogBlean = false
        this.initData(1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err)
      })
    },
    //  修改
    upList () {
      types.updateSafeQuestion(this.msg).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.dialogBlean = false
        this.initData(1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err)
      })
    },
    reset () {
      this.msg = servers.deletelists.empty(this.msg, 'queStatus')
    },
    delList (row) {
      this.$confirm('是否确认删除 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.deleteObj(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    //  删除
    deleteObj (row) {
      let objList = row || this.dataArr
      let objId = servers.deletelists.dels(objList)
      types.deleteSafeQuestion(objId).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.initData(1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err)
      })
    },
    handledit (data, mag) {
      this.$confirm('是否确认' + mag + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.upStatus(data)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    //  修改状态
    upStatus (data) {
      types.updateStatus(data).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.initData(1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  }
}
</script>
<style scoped lang="scss">
  .row{
    display: flex;
    justify-content: center;
  }
</style>
