<template>
  <!--<div>渠道权限管理</div>-->
  <div id="ChannelAuthority" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select v-model='params.channel' clearable placeholder='渠道' value-key="stateid" size='medium'>
            <el-option
              v-for='item in channelList'
              :key='item.chalId'
              :label='item.chalName'
              :value='item.chalCode'>
            </el-option>
          </el-select>
        </div>
        <div class='search-item  search-ipt'>
          <el-button  type="primary" :loading='false' size='medium' @click="search()">查询</el-button>
          <el-button size='medium' @click='reseting()'>重置</el-button>
        </div>
      </div>
      <div class="search-container clearfix">
        <div class="search-item">
          <el-button  size='medium' @click="rescive(null)">添加</el-button>
          <el-button type='danger' size='medium' @click="del(null)" :disabled='dataArr.length === 0'>批量删除</el-button>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          border class='table'
          :data="priceList"
          :height='dataViewHeight'
          @selection-change='handleSelectionChange'
          v-loading='loading'
          @row-click="clickRow"
          :cell-style="tableAttributes.cellStyle"
          row-key="lowestpriceid"
          ref="refTable"
          element-loading-background="rgba(255, 255, 255, 0.8)">
<!--          <el-table-column label='序号' fixed="left" width="50" type='index' align='left'></el-table-column>-->
          <el-table-column type='selection' fixed="left"  align='left'></el-table-column>
          <el-table-column label='权限名称'  align='left' prop='authority'></el-table-column>
          <el-table-column label='渠道编号'  align='left' prop='channel'>
            <template slot-scope="scope">
              {{scope.row.channel | channelMap}}
            </template>
          </el-table-column>
          <el-table-column label='操作'  align='left' width="160">
            <template slot-scope='scope'>
              <span class="active-text mr-5" title="启用" @click='handledit({ id: scope.row.authId, status: scope.row.authStatus })' v-if="scope.row.authStatus === '0'">禁用</span>
              <span class="active-text mr-5" @click='handledit({ id: scope.row.authId, status: scope.row.authStatus })' v-if="scope.row.authStatus === '1'" title="禁用">启用</span>
              <span class="active-text mr-5" title="编辑" @click="rescive(scope.row, 'revise')">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="del(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        @size-change='handleSizeChange'
        @current-change='handleCurrentChange'
        :current-page='currentPage'
        :page-sizes='pagination.pageSizes'
        :page-size='pagination.pageSize'
        layout='total, sizes, prev, pager, next, jumper'
        :total='total'>
      </el-pagination>
    </div>
    <el-dialog :title="msgtitle" :visible.sync="dialogFormVisible" width="400px">
      <div class="dialog-container">
        <div class="dialog-main">
        <div class="row">
          <div class="column">
            <div class="label required">权限名称 ：</div>
            <div class="fl ipt-medium">
              <el-select v-model='msg.authority' clearable placeholder='权限名称' value-key="stateid" @change='submit3(msg.authority)' size='medium' title="必填项">
                <el-option
                  v-for='item in discount'
                  :key='item.dincId'
                  :label='item.dincName'
                  :value='item.dincName'>
                </el-option>
                </el-select>
              <div class="warning-info" v-if="flags && !msg.authority">权限名称不可为空</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="column">
            <span class="label required">渠道编号 ：</span>
            <div class="fl ipt-medium">
              <el-select v-model='msg.channel' clearable placeholder='渠道编号' value-key="stateid" size='medium' style='width: 210px' title="必填项">
                <el-option
                  v-for='item in channelList'
                  :key='item.chalId'
                  :label='item.chalName'
                  :value='item.chalCode'>
                </el-option>
              </el-select>
              <div class="warning-info" v-if="flags && !msg.channel">渠道编号不可为空</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="column">
            <span class="label">启用/禁用 ：</span>
            <div class="fl ipt-medium">
                <el-select size="medium" placeholder="是否禁用" v-model="msg.authStatus">
                  <el-option value="0" label="启用"></el-option>
                  <el-option value="1" label="禁用"></el-option>
                </el-select>
            </div>
          </div>
        </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="refer">提交</el-button>
          <el-button size="medium" v-if="ref === 'add'" @click="reset">重置</el-button>
          <el-button size="medium" @click="back">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as types from './api'
import { getChannelList, computeTableHeight } from '../../utils/index'
import { computWidth } from '../../mixins/computWidt'

export default {
  name: 'ChannelAuthority',
  data () {
    return {
      stateName: '全部',
      state: [],
      priceList: [],
      dataViewHeight: null,
      loading: false,
      pagesize: 20,
      currentPage: 1,
      total: 0,
      params: {
        channel: '',
        page: 1,
        rows: 20
      },
      msg: {},
      ref: '',
      dialogFormVisible: false,
      msgtitle: '添加',
      discount: [],
      set: [],
      dataArr: [],
      flags: false,
      tFlag: true
    }
  },
  created () {
    let type = {
      type: 'AUTHORITY'
    }
    this.judgeChannelList()
    types.querydictsByType(type).then(res => {
      this.discount = res.rows
    }).catch(err => {
      this.$message.error(err.message)
    })
    this.pagesize = this.pagination.pageSize
    this.initData()
  },
  methods: {
    clickRow (row) {
      if (this.tFlag) this.$refs.refTable.toggleRowSelection(row)
      this.tFlag = true
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    search () {
      this.currentPage = 1
      this.initData()
    },
    submit2 (channel) {
      let channes = ''
      for (let item of this.state) {
        if (item.value === channel) {
          channes += ',' + item.name
        }
      }
      channes = channes.substr(1)
      this.params.channel = channes
    },
    submit3 (channel) {
    },
    back () {
      this.dialogFormVisible = false
    },
    rescive (param) {
      this.dialogFormVisible = true
      this.flags = false
      this.tFlag = false
      let states = JSON.parse(JSON.stringify(this.state))
      let [...set] = states
      this.set = set
      if (param && param !== null) {
        //  修改
        this.ref = 'ref'
        this.msgtitle = '修改'
        let msg = JSON.parse(JSON.stringify(param))
        this.msg = msg
        this.msg.channel = msg.channel
      } else {
        //  添加
        this.tFlag = true
        this.msgtitle = '添加'
        this.flag = true
        this.ref = 'add'
        this.msg = {}
        this.msg = {
          authStatus: '0',
          authId: '',
          authority: '',
          authCode: '',
          channel: ''
        }
      }
    },
    //  判断渠道的方法
    channel (channel, num) {
      let chan = ''
      for (let item of this.state) {
        if (item.name === channel || item.value === channel) {
          if (num === '1') {
            chan = item.value
          } else {
            chan = item.name
          }
          break
        }
      }
      return chan
    },
    refer () {
      this.flags = true
      if (this.msg.authority === '' || this.msg.channel === '') {
        return false
      }
      for (let item of this.discount) {
        if (item.dincName === this.msg.authority) {
          this.msg.authCode = item.dincCode
        }
      }
      let obj = {
        authority: this.msg.authority,
        authCode: this.msg.authCode,
        channel: this.msg.channel,
        authStatus: this.msg.authStatus
      }
      if (this.ref === 'add') {
        delete this.msg.authId
        types.addChannelAuthority(obj).then(res => {
          this.dialogFormVisible = false
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.initData()
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        obj['authId'] = this.msg.authId
        types.updateChannelAuthority(obj).then(res => {
          this.dialogFormVisible = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.initData()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    },
    del (val) {
      //  获取选中数组里面的序号
      let ids = ''
      this.tFlag = false
      this.$confirm('是否确认删除 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        if (val && val !== null) {
          //  单个删除
          ids = val.authId
        } else {
          //  批量删除
          for (let item of this.dataArr) {
            ids += ',' + item.authId
          }
          ids = ids.substring(1)
        }
        let obj = {
          ids
        }
        types.deleteChannelAuthority(obj).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          //  判断最后一页删除后数量不足重新计算当前的页数
          if (val !== null) {
            //  单个
            if (this.total % this.pagesize === 1 && this.total > 1 && this.currentPage === Math.ceil(this.total / this.pagesize)) {
              this.currentPage = this.params.page - 1
            }
          } else {
            //  批量
            if (this.dataArr.length >= (this.total % this.pagesize) && this.currentPage === Math.ceil(this.total / this.pagesize)) {
              this.currentPage = this.params.page - 1
            }
          }
          this.initData()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    //  重置
    reseting () {
      this.params.channel = ''
      this.currentPage = 1
      this.initData()
    },
    reset () {
      this.msg = {
        authStatus: '启用'
      }
    },
    //  表格点击方法
    handleSelectionChange (row) {
      this.dataArr = row
    },
    handleSizeChange (size) {
      this.pagesize = size
      this.initData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.initData()
    },
    handledit (data = {}) {
      this.tFlag = false
      this.$confirm('是否确认修改启用/停用状态 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        if (data.status === '1') {
          data.status = '0'
        } else {
          data.status = '1'
        }
        types.updateStatus(data).then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.initData()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },
    //  初始化
    initData () {
      this.loading = true
      this.params.rows = this.pagesize
      this.params.page = this.currentPage
      types.queryChannelAuthoritys(this.params).then(res => {
        this.priceList = res.rows
        this.total = res.total
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
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
