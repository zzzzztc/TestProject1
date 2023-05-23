<template>
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="区域码" v-model="params.modeName" title="区域码" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="区域名称" v-model="params.chargeType" title="区域名称" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="拼音缩写" v-model="params.remark" title="拼音缩写" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="initrefer">重置</el-button>
        </div>
        </div>
      <div class="btn-container">
        <el-button type="success" size="medium" @click="excel" :disabled='total === 0'>导出</el-button>
        <el-button size="medium" @click="rescive(null)">添加</el-button>
        <el-button size="medium" type= 'danger' :disabled='dataArr.length === 0' @click="del(null)">批量删除</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          :cell-style="tableAttributes.cellStyle"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          @row-click="clickRow"
          row-key="lowestpriceid"
          ref="refTable"
          v-loading="loading"
          @selection-change='handleSelectionChange'
          :height="dataViewHeight"
          :data="priceList">
<!--          <el-table-column label='序号' width="50" fixed="left" type='index'></el-table-column>-->
          <el-table-column type='selection' fixed="left"></el-table-column>
          <el-table-column label="地区序号" prop="channel" min-width="100"></el-table-column>
          <el-table-column label="区域码" prop="modeName" min-width="100"></el-table-column>
          <el-table-column label="父区域码" prop="modeCopyName" min-width="100"></el-table-column>
          <el-table-column label="区域类型" prop="mailType" min-width="100"></el-table-column>
          <el-table-column label="区域名称" prop="chargeType" min-width="160"></el-table-column>
          <el-table-column label="区域简称" prop="amount" min-width="120"></el-table-column>
          <el-table-column label="拼音缩写" prop="remark" min-width="100"></el-table-column>
          <el-table-column label="邮寄费" prop="mailSort" min-width="100">
            <template slot-scope="scope">
              {{scope.row.mailSort | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="可用状态" prop="mailStatus" min-width="100" :formatter="mailstatus"></el-table-column>
          <el-table-column label='操作'  align='left' width="120" fixed="right">
            <template slot-scope='scope'>
              <span class="active-text mr-5" @click='handledit({ ids: scope.row.mailId, validity: scope.row.mailStatus })' v-if="scope.row.mailStatus === '0'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handledit({ ids: scope.row.mailId, validity: scope.row.mailStatus })' v-if="scope.row.mailStatus === '1'" title="禁用">启用</span>
              <span class="active-text mr-5" title="编辑" @click="rescive(scope.row, 'revise')">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="del(scope.row)">删除</span>
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
        :total="total">
      </el-pagination>
    </div>
    <!--添加修改弹框-->
    <el-dialog :title="dialogCennel" :visible.sync="dialogchen" width="580px" top="5vh" style="overflow: hidden">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">地区序号</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable placeholder="地区序号" v-model="msg.channel"></el-input>
                <div class="warning-info" v-if="flag && !msg.channel">地区序号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">区域码</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable placeholder="区域码" v-model="msg.modeName"></el-input>
                <div class="warning-info" v-if="flag && !msg.modeName">区域码不可为空</div>
              </div>
            </div>
          </div>
          <!--第二排-->
          <div class="row">
            <div class="column">
              <div class="label required">父区域码</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable placeholder="地区序号" v-model="msg.modeCopyName"></el-input>
                <div class="warning-info" v-if="flag && !msg.modeCopyName">父区域码不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">区域类型</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable placeholder="区域码" v-model="msg.mailType"></el-input>
                <div class="warning-info" v-if="flag && !msg.mailType">区域类型不可为空</div>
              </div>
            </div>
          </div>
          <!--第三排-->
          <div class="row">
            <div class="column">
              <div class="label required">区域名称</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable placeholder="区域名称" v-model="msg.chargeType"></el-input>
                <div class="warning-info" v-if="flag && !msg.chargeType">区域名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">区域简称</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable placeholder="区域简称" v-model="msg.amount"></el-input>
                <div class="warning-info" v-if="flag && !msg.amount">区域简称不可为空</div>
              </div>
            </div>
          </div>
          <!--第四排拿起-->
          <div class="row">
            <div class="column">
              <div class="label required">拼音缩写</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable placeholder="拼音缩写" v-model="msg.remark"></el-input>
                <div class="warning-info" v-if="flag && !msg.remark">拼音缩写不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">邮寄费</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable placeholder="邮寄费" v-model="msg.mailSort"></el-input>
                <div class="warning-info" v-if="flag && !msg.mailSort">邮寄费不可为空</div>
              </div>
            </div>
          </div>
          <!--第五排-->
          <div class="row">
            <div class="column">
              <div class="label required">可用状态</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.mailStatus"  placeholder="开放状态">
                  <el-option label="启用" value="0"></el-option>
                  <el-option label="禁用" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="flag && !msg.mailStatus">可用状态不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="refer">提交</el-button>
          <el-button size="medium" v-if="ref === 'add'" @click="reset">重置</el-button>
          <el-button size="medium" @click="dialogchen = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { computeTableHeight, excelList, getRouteName } from '../../../utils/index'
import * as types from './api'

export default {
  name: 'Mail',
  data () {
    return {
      params: {
        modeName: '',
        chargeType: '',
        remark: '',
        page: 1,
        rows: 20
      },
      dataArr: [],
      dataViewHeight: null,
      priceList: [],
      total: null,
      msg: {
        channel: '123',
        modeName: '5644444',
        modeCopyName: '1',
        mailType: '省',
        chargeType: '江苏省',
        amount: 'js',
        remark: 'jiangsu',
        mailSort: '20',
        mailStatus: '1'
      },
      flag: false,
      dialogCennel: '添加',
      dialogchen: false,
      ref: '',
      tFlag: true,
      loading: false
    }
  },
  created () {
    this.params.rows = this.pagination.pageSize
    this.initData()
  },
  methods: {
    initList () {
      this.params.page = 1
      this.initData()
    },
    clickRow (row) {
      if (this.tFlag) this.$refs.refTable.toggleRowSelection(row)
      this.tFlag = true
    },
    //  分页
    handleSizeChange (row) {
      this.params.rows = row
      this.initData()
    },
    handleCurrentChange (pages) {
      this.params.page = pages
      this.initData()
    },
    mailstatus: (row, column, cellValue, index) => {
      if (row.mailStatus === '0') {
        return '可以邮寄'
      } else {
        return '不可邮寄'
      }
    },
    search () {
      this.params.page = 1
      this.initData()
    },
    initrefer () {
      this.params['modeName'] = ''
      this.params['chargeType'] = ''
      this.params['remark'] = ''
      this.params['page'] = 1
      this.params['rows'] = 20
      this.initData()
    },
    //  弹出框提交
    rescive (param) {
      this.dialogchen = true
      this.flag = false
      this.tFlag = false
      if (param && param !== null) {
        //  修改
        this.ref = ''
        this.dialogCennel = '修改'
        let msg = JSON.parse(JSON.stringify(param))
        this.msg = Object.assign(this.msg, msg)
        this.msg['mailId'] = msg.mailId
      } else {
        //  添加
        this.ref = 'add'
        this.tFlag = true
        this.dialogCennel = '添加'
        for (let item in this.msg) {
          this.msg[item] = ''
        }
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
          ids = val.mailId
        } else {
          //  批量删除
          let state = this.dataArr.map((item) => {
            return item.mailId
          })
          ids = state.join(',')
        }
        let obj = {
          ids
        }
        types.deleteMailMode(obj).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          //  判断最后一页删除后数量不足重新计算当前的页数
          if (val !== null) {
            //  单个
            if (this.total % this.params.rows === 1 && this.total > 1 && this.params.page === Math.ceil(this.total / this.params.rows)) {
              this.params.page = this.params.page - 1
            }
          } else {
            //  批量
            if (this.dataArr.length >= this.priceList.length && this.params.page === Math.ceil(this.total / this.params.rows)) {
              this.params.page = this.params.page - 1
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
    //  导出
    excel () {
      let data = JSON.parse(JSON.stringify(this.params))
      let url = 'mailMode/ExportMailMode'
      let name = getRouteName('/mail')
      let type = 'xls'
      data.start = 1
      data.end = this.total
      delete data.page
      delete data.rows
      let obj = {
        data,
        url,
        name,
        type
      }
      excelList(obj)
    },
    handleSelectionChange (list) {
      this.dataArr = list
    },
    handledit (data = {}) {
      let mag = ''
      this.tFlag = false
      if (data.validity === '1') {
        data.validity = '0'
        mag = '是否确认启用 ?'
      } else {
        data.validity = '1'
        mag = '是否确认禁用 ?'
      }
      // console.log(data)
      this.$confirm(mag, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        types.validityMailMode(data).then(res => {
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
          message: '已取消操作'
        })
      })
    },
    initData () {
      this.loading = true
      types.queryMailMode(this.params).then(res => {
        this.priceList = res.rows
        this.total = res.total
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    //  弹框添加重置
    reset () {
      for (let item in this.msg) {
        this.msg[item] = ''
      }
    },
    //  弹框提交
    refer () {
      this.flag = true
      for (let item in this.msg) {
        if (!this.msg[item]) return false
      }
      let obj = JSON.parse(JSON.stringify(this.msg))
      // console.log(obj)
      if (this.ref === 'add') {
        //  添加提交
        types.addMailMode(obj).then(res => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.dialogchen = false
          this.initData()
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        //  修改提交
        types.updateMailMode(obj).then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.dialogchen = false
          this.initData()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  }
}
</script>
<style scoped lang="scss"></style>
