<template>
  <div class="container">
    <!--<h1>防占座管理</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.startdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班起始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.enddate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            :clearable = "false"-->
<!--            :editable = "false"-->
<!--            unlink-panels-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="flightDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="航班起始日期"-->
<!--            end-placeholder="航班截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt fl">
          <el-input size="medium" clearable placeholder="出发城市" v-model="searchForm.from" @keydown.enter.native="ueryUnpayOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt fl">
          <el-input size="medium" clearable placeholder="到达城市" v-model="searchForm.to" @keydown.enter.native="ueryUnpayOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt fl">
          <el-input size="medium" clearable placeholder="常客号" v-model="searchForm.ffpNo" @keydown.enter.native="ueryUnpayOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt fl">
          <el-input size="medium" clearable placeholder="绑定手机" v-model="searchForm.mobile" @keydown.enter.native="ueryUnpayOrderList()"></el-input>
        </div>
        <div class="search-item search-ipt fl">
          <el-button size="medium" type="primary" @click="ueryUnpayOrderList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="table-container" >
        <el-table
          v-loading="loading"
          :data='tableList.rows'
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
          <!--<el-table-column type="selection" width="46" fixed="left"></el-table-column>-->
          <el-table-column label="航班开始日期" prop="startDate"></el-table-column>
          <el-table-column label="航班结束日期" prop="endDate"></el-table-column>
          <el-table-column label="占座订单数" prop="ordercount"></el-table-column>
          <el-table-column label="姓名" prop="realName"></el-table-column>
          <el-table-column label="常客号" prop="ffpCard"></el-table-column>
          <el-table-column label="绑定手机" prop="mobile"></el-table-column>
          <el-table-column label="黑名单">
            <template slot-scope="scope">
              <div v-if="scope.row.blackFlag === '0'">否</div>
              <div v-else>是</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <div class="active-text" @click="handleSee(scope.row)">查看</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange($event, 0)"
        @current-change="handleCurrentChange($event, 0)"
        :current-page="searchForm.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableList.total">
      </el-pagination>
    </div>
    <!--查看弹出框-->
    <div ref="dialog">
      <el-dialog title="黑名单详细信息" :visible.sync="editVisible" width="1000">
        <div class="dialog-container">
          <div class="dialog-main">
            <el-table
              v-loading="loadings"
              :data='frameList.rows'
              height="400"
              :border="tableAttributes.border"
              :cell-style="tableAttributes.cellStyle"
              @selection-change="handleSelectionChange">
<!--              <el-table-column label="序号" type="index" width="50"></el-table-column>-->
              <!--<el-table-column type="selection" width="46" fixed="left"></el-table-column>-->
              <el-table-column label="出发地" prop="afrom"></el-table-column>
              <el-table-column label="到达地" prop="ato"></el-table-column>
              <el-table-column label="联系人姓名" prop="username" min-width="120"></el-table-column>
              <el-table-column label="乘机人姓名" prop="pname" min-width="140"></el-table-column>
              <el-table-column label="PNR" prop="pnr" min-width="120"></el-table-column>
              <el-table-column label="航班日期" prop="fdate" min-width="140"></el-table-column>
              <el-table-column label="订单时间" min-width="160">
                <template slot-scope="scope">
                  <span>{{scope.row.orderdate + ' ' + scope.row.ordertime}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination" style="padding-left: 35px;">
            <el-pagination
              @size-change="handleSizeChange($event, 1)"
              @current-change="handleCurrentChange($event, 1)"
              :current-page="searchForm.page"
              :page-sizes="pagination.pageSizes"
              :page-size="pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="frameList.total">
            </el-pagination>
          </div>
          <div class="dialog-footer mt-20">
            <div class="box"></div>
            <el-button size="mini" type="primary" v-if="rowsList.blackFlag === '0'" @click="handleSeal(0)">封禁</el-button>
            <el-button size="mini" type="primary" v-else @click="handleSeal(1)">解禁</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--封禁弹出框-->
    <el-dialog title="封禁" :visible.sync="sealVisible" width="350px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">有效期</div>
              <div class="ipt-medium">
                <el-select v-model="validate" size="medium">
                  <el-option key="0" label="1天" value="1"></el-option>
                  <el-option key="1" label="永久" value="N"></el-option>
                  <el-option key="2" label="7天" value="7"></el-option>
                  <el-option key="3" label="30天" value="30"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !validate">有效期不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="mini" type="primary" @click="sealVisible = false">取消</el-button>
          <el-button size="mini" type="primary" @click="saveSeal">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { queryUnpayOrder, queryUnpayOrderDetail, addToBlack, outOfBlack } from './api'
import { computeTableHeight, getCurrentDate } from '../../../utils/index'
export default {
  name: 'Blacklist',
  data () {
    return {
      searchForm: {
        startdate: '', // 航班起始日期
        enddate: '', // 航班截止日期
        from: '', // 出发地
        to: '', // 到达地
        ffpNo: '', // 常客号
        mobile: '' // 手机号码
      }, // 搜索框 -- 数据
      flightDate: [], // 搜索框 -- 航班日期
      tableList: [], // 表格 -- 数据
      rowsList: {}, // // 表格 -- 选中行数据
      multipleSelection: [], // 表格 -- 选择项数据
      dataViewHeight: null, // 表格 -- 高度
      loading: false, // 表格 -- 数据加载时显示的动效
      frameList: [], // 查看弹出框 -- 表格数据
      editVisible: false, // 查看弹出框 -- 显示隐藏
      loadings: false, // 查看弹出框 -- 数据加载时显示的动效,
      sealVisible: false, // 封禁弹出框 -- 显示隐藏
      isEmpty: false, // 封禁弹出框 -- 判空
      validate: '' // 封禁弹出框 -- 有效期下拉框
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.getDateTerm()
    this.ueryUnpayOrderList(1, this.pagination.pageSize)
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    // 搜索框 -- 获取航班日期期限
    getDateTerm () {
      this.flightDate = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.searchForm.startdate = this.flightDate[0]
      this.searchForm.enddate = this.flightDate[1]
    },
    // 搜索框 -- 重置
    handleReset () {
      this.searchForm = {
        startdate: '',
        enddate: ''
      }
      this.getDateTerm()
      this.ueryUnpayOrderList(1, this.pagination.pageSize)
    },
    // 表格 -- 分页导航
    handleSizeChange (pages, type) {
      if (type === 0) {
        this.ueryUnpayOrderList(null, pages)
      } else {
        this.UnpayOrderDetailList(null, pages)
      }
    },
    handleCurrentChange (page, type) {
      if (type === 0) {
        this.ueryUnpayOrderList(page, null)
      } else {
        this.UnpayOrderDetailList(page, null)
      }
    },
    // 表格 -- 选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 表格 -- 获取数据
    ueryUnpayOrderList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      // if (this.flightDate && this.flightDate.length) {
      //   this.searchForm.startdate = this.flightDate[0]
      //   this.searchForm.enddate = this.flightDate[1]
      // } else {
      //   delete this.searchForm.startdate
      //   delete this.searchForm.enddate
      // }
      queryUnpayOrder(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 表格 -- 查看弹出框
    handleSee (params) {
      // console.log(params)
      this.rowsList = JSON.parse(JSON.stringify(params))
      this.editVisible = true
      this.UnpayOrderDetailList(1, this.pagination.pageSize)
    },
    // 查看弹出框 -- 获取表格数据
    UnpayOrderDetailList (page, pageSize) {
      let data = {
        userid: this.rowsList.userid,
        startdate: this.rowsList.startDate,
        enddate: this.rowsList.endDate
      }
      this.loadings = true
      if (page) data.page = page
      if (pageSize) data.rows = pageSize
      queryUnpayOrderDetail(data).then(res => {
        this.frameList = res
        this.loadings = false
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 查看弹出框 -- 封禁/解禁
    handleSeal (type) {
      // console.log(this.rowsList)
      if (type === 0) {
        this.validate = ''
        this.sealVisible = true
      } else {
        this.$confirm('是否确认解封？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          let data = {
            blackFlag: this.rowsList.blackFlag,
            userid: this.rowsList.userid,
            ffpCard: this.rowsList.ffpCard,
            validate: this.validate
          }
          outOfBlack(data).then(res => {
            this.editVisible = false
            this.$message.success(res.message)
            this.ueryUnpayOrderList(1, this.pagination.pageSize)
          })
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      }
    },
    // 封禁弹出框 -- 提交
    saveSeal () {
      if (this.validate) {
        this.$confirm('是否确认封禁?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          let data = {
            blackFlag: this.rowsList.blackFlag,
            userid: this.rowsList.userid,
            ffpCard: this.rowsList.ffpCard,
            validate: this.validate
          }
          addToBlack(data).then(res => {
            this.sealVisible = false
            this.editVisible = false
            this.$message.success(res.message)
            this.ueryUnpayOrderList(1, this.pagination.pageSize)
          }).catch(err => {
            this.$message.error(err.message)
          })
        }).catch(() => {
          this.$message.info('已取消修改')
        })
      } else {
        this.isEmpty = true
      }
    }
  }
}
</script>

<style scoped>

</style>
