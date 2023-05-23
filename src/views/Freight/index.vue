<template>
  <div id="TicketFreeFlight" class="container">
    <div class="header" ref="header">
      <div class="btn-container">
        <el-button type="primary" :loading='false' size='medium' @click="search()">查询</el-button>
        <el-button size='medium' @click="rescive(null)">添加</el-button>
        <el-button type='danger' size='medium' @click="del(null)"  :disabled='dataArr.length === 0'>批量删除</el-button>
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
          <el-table-column label='销售开始日期'  align='left' prop='startSdate'></el-table-column>
          <el-table-column label='销售截止日期'  align='left' prop='endSdate'></el-table-column>
          <el-table-column label='航班开始日期'  align='left' prop='startFdate'></el-table-column>
          <el-table-column label='航班截止日期'  align='left' prop='endFdate'></el-table-column>
          <el-table-column label='舱位'  align='left' prop='cabin' width="60"></el-table-column>
          <el-table-column label='操作'  align='left' width="110">
            <template slot-scope='scope'>
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
        :page-size='pagesize'
        layout='total, sizes, prev, pager, next, jumper'
        :total='priceList.length'>
      </el-pagination>
    </div>
    <el-dialog :title="msgtitle" :visible.sync="dialogFormVisible" width="560px" style="overflow-y: hidden">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label" style="float: left;">销售开始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  v-model="msg.startSdate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="销售开始日期" class="date-picker f1">
                </el-date-picker>
              </div>
            </div>
            <div class="column">
              <div class="label" style="float: left;">销售截止日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  v-model="msg.endSdate"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="销售截止日期" class="date-picker f1">
                </el-date-picker>
              </div>
            </div>
          </div>
        <div class="row">
          <div class="column">
            <div class="label" style="float: left;">航班开始日期</div>
            <div class="ipt-medium">
              <el-date-picker
                v-model="msg.startFdate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="航班开始日期" class="date-picker f1">
              </el-date-picker>
            </div>
          </div>
          <div class="column">
            <div class="label" style="float: left;">航班截止日期</div>
            <div class="ipt-medium">
              <el-date-picker
                v-model="msg.endFdate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="航班截止日期" class="date-picker f1">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="column">
            <div class="label required">舱位</div>
            <div class="ipt-medium">
              <el-input size="medium" placeholder="舱位" clearable v-model="msg.cabin"></el-input>
            </div>
            <span class="warning-info" v-if="!flag">{{dangmsg}}</span>
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
import * as types from './api'
import { mapState } from 'vuex'
import { computWidth } from '../../mixins/computWidt'

export default {
  name: 'TicketFreeFlight',
  data () {
    return {
      loading: false,
      dataViewHeight: null,
      pagesize: 20,
      currentPage: 1,
      totle: null,
      params: {
        page: 1,
        rows: 20
      },
      priceList: [],
      dialogFormVisible: false,
      msgtitle: '',
      msg: {},
      ref: '',
      dataArr: [],
      dangmsg: '请输入舱位信息',
      flag: true,
      tFlag: true
    }
  },
  created () {
    this.pagesize = this.pagination.pageSize
    this.initData()
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    clickRow (row) {
      if (this.tFlag) this.$refs.refTable.toggleRowSelection(row)
      this.tFlag = true
    },
    initData () {
      this.loading = true
      this.params.rows = this.pagesize
      this.params.page = this.currentPage
      types.queryFlightList(this.params).then(res => {
        if (res.isSuccessOrfail === 'SUCCESS') {
          this.priceList = res.rows
          this.loading = false
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
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
    rescive (param) {
      this.dialogFormVisible = true
      this.tFlag = false
      if (param && param !== null) {
        //  修改
        this.msgtitle = '修改'
        this.ref = 'ref'
        let msg = JSON.parse(JSON.stringify(param))
        this.msg = msg
      } else {
        //  添加
        this.tFlag = true
        this.msgtitle = '添加'
        this.flag = true
        this.ref = 'add'
        this.msg = {}
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
          ids = val.freeId
        } else {
          //  批量删除
          let state = this.dataArr.map((item) => {
            return item.freeId
          })
          ids = state.join(',')
        }
        let obj = {
          ids
        }
        types.deleteTicketFreeFlight(obj).then((res) => {
          if (res.isSuccessOrfail === 'SUCCESS') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.initData()
          }
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
    back () { this.dialogFormVisible = false },
    refer () {
      //  提交
      let startSdate = this.msg.startSdate || ''
      let endSdate = this.msg.endSdate || ''
      let startFdate = this.msg.startFdate || ''
      let endFdate = this.msg.endFdate || ''
      let cabin = this.msg.cabin || ''
      if (cabin === '') {
        this.flag = false
        return false
      }
      let obj = {
        startSdate,
        endSdate,
        startFdate,
        endFdate,
        cabin
      }
      if (this.ref === 'add') {
        types.addTicketFreeFlight(obj).then(res => {
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
        obj['freeId'] = this.msg.freeId
        types.updateTicketFreeFlight(obj).then(res => {
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
    reset () { this.msg = {} },
    search () {
      this.currentPage = 1
      this.initData()
    }
  },
  watch: {
    'msg.cabin': function (val) {
      // console.log(1)
      if (val) {
        this.flag = true
      } else {
        this.dangmsg = '请输入舱位信息'
        this.flag = false
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .container{
    padding: 0;
    .mine{
      display: flex;
      justify-content: center;
      padding-bottom: 20px;
      margin-top: 20px;
    }
    .line{
      width: 100%;
      height: 1px;
      background: #ececec;
      box-shadow: 0px 0px 4px 0px #ececec;
      margin-top: 15px;
      /*border: ;*/
    }
    .mustmsg{
      display: inline-block;
      width: 65%;
      text-align: right;
    }
  }
</style>
