<template>
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="机场城市名/三字码" v-model="params.cityCode" title="机场城市" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="params.cityStatus" clearable  placeholder="开放状态" title="开放状态">
            <!--<el-option label="全部" value=""></el-option>-->
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="9"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='params.channel' clearable placeholder='渠道类型' size='medium' style='width: 180px' title="渠道类型">
            <!--<el-option value="" label="全部"></el-option>-->
            <el-option
              v-for='item in channelList'
              :key='item.chalId'
              :label='item.chalName'
              :value='item.chalId'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="initrefer">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="rescive(null)">添加</el-button>
        <el-button size="medium" type= 'danger' :disabled='dataArr.length === 0' @click="del(null)">批量删除</el-button>
      </div>
      <!--<formMsg :txt="dataArr.length" :num="num"></formMsg>-->
      <!--<button @click="clickme">点我</button>-->
      <!--<div @formData="aaaaa"></div>-->
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
          <el-table-column label="渠道编号" prop="channel" min-width="160">
            <template slot-scope="scope">
              {{scope.row.channel | channelM}}
            </template>
          </el-table-column>
          <el-table-column label="城市名称" prop="cityName" min-width="160"></el-table-column>
          <el-table-column label="城市三字码" prop="cityCode" min-width="160"></el-table-column>
          <el-table-column label="开放时间" prop="openHour" min-width="160"></el-table-column>
          <el-table-column label="二维码通关" prop="umeFlag" min-width="160" :formatter="handCode"></el-table-column>
          <el-table-column label='操作'  align='left' width="120" fixed="right">
            <template slot-scope='scope'>
              <span class="active-text mr-5" @click='handledit({ cityId: scope.row.cityId, cityStatus: scope.row.cityStatus })' v-if="scope.row.cityStatus === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handledit({ cityId: scope.row.cityId, cityStatus: scope.row.cityStatus })' v-if="scope.row.cityStatus === '9'" title="禁用">启用</span>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogAdd" width="560px" top="15vh" style="overflow: hidden">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">城市名称</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.cityName' filterable  clearable placeholder='城市名称' size='medium'>
                  <el-option
                    v-for='item in treeList'
                    :key='item.id'
                    :label='item.text'
                    :value='item.text'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flag && !msg.cityName">城市名称不可为空</div>
              </div>
            </div>
          <div class="column">
            <div class="label required">开放时间</div>
            <div class="fl ipt-medium">
              <el-input size="medium" clearable placeholder="机场名称" v-model="msg.openHour"></el-input>
              <div class="warning-info" v-if="flag && !msg.openHour">开放时间不可为空</div>
            </div>
          </div>
        </div>
          <!--第二排-->
          <div class="row">
            <div class="column">
              <div class="label required">渠道编号(多选)</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.channel' clearable placeholder='渠道类型' multiple size='medium' collapse-tags>
                  <el-option
                    v-for='item in channelList'
                    :key='item.chalId'
                    :label='item.chalName'
                    :value='item.chalId'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flag && msg.channel.length === 0">渠道编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">开放状态</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.cityStatus"  placeholder="开放状态">
                  <el-option label="启用" value="1"></el-option>
                  <el-option label="禁用" value="9"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--第三排-->
          <div class="row">
            <div class="column">
              <div class="label">二维码通关</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.umeFlag"  placeholder="二维码通关">
                  <el-option label="开启" value="1"></el-option>
                  <el-option label="关闭" value="0"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="refer">提交</el-button>
          <el-button size="medium" v-if="ref === 'add'" @click="reset">重置</el-button>
          <el-button size="medium"  @click="back">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as types from './api'
import { computeTableHeight, getCity, getChannelList } from '../../../utils/index'
// import FormMsg from './comonents/formMsg'
export default {
  name: 'CheckinCity',
  // components: {
  //   FormMsg
  // },
  data () {
    return {
      dataViewHeight: null,
      params: {
        cityCode: '',
        cityStatus: '',
        channel: '',
        page: 1,
        rows: 20
      },
      dataArr: [],
      priceList: [],
      msg: {
        cityCode: '',
        openHour: '12',
        channel: [],
        cityStatus: '1',
        umeFlag: '0',
        cityName: ''
      },
      dialogAdd: false,
      dialogTitle: '',
      flag: false,
      ref: '',
      total: null,
      tFlag: true,
      loading: false
    }
  },
  created () {
    this.getTreelist()
    this.judgeChannelList()
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
    aaaaa (data) {
      // console.log(data)
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
    //  启用禁用
    handledit (data = {}) {
      let mag = ''
      this.tFlag = false
      if (data.cityStatus === '1') {
        data.cityStatus = '9'
        mag = '是否确认禁用 ?'
      } else {
        data.cityStatus = '1'
        mag = '是否确认启用 ?'
      }
      this.$confirm(mag, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        types.updateCheckInCity(data).then(res => {
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
    handCode: (row, column, cellValue, index) => {
      let text = ''
      if (row.umeFlag === '0') {
        text = '关闭'
      } else {
        text = '开启'
      }
      return text
    },
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    getTreelist () {
      if (!this.treeList.length) {
        getCity()
      }
    },
    //  搜索
    search () {
      this.params.page = 1
      this.initData()
    },
    //  重置
    initrefer () {
      for (let item in this.params) {
        if (item !== 'rows') {
          this.params[item] = ''
        }
      }
      this.params.page = 1
      this.initData()
    },
    //  添加值机城市
    rescive (param) {
      this.dialogAdd = true
      this.tFlag = false
      if (param && param !== null) {
        //  修改
        this.ref = ''
        this.dialogTitle = '修改'
        let msg = JSON.parse(JSON.stringify(param))
        this.msg = Object.assign(this.msg, msg)
        this.msg.channel = msg.channel.split(',')
        this.msg.cityId = msg.cityId
      } else {
        //  添加
        this.tFlag = true
        this.ref = 'add'
        this.dialogTitle = '添加'
        this.init()
      }
    },
    //  删除值机城市
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
          ids = val.cityId
        } else {
          //  批量删除
          let state = this.dataArr.map((item) => {
            return item.cityId
          })
          ids = state.join(',')
        }
        let obj = {
          ids
        }
        types.delCheckInCity(obj).then((res) => {
          if (res.isSuccessOrfail === 'SUCCESS') {
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
          }
        }).catch(err => {
          this.$message.error(err.message)
          // console.log()
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
      types.queryCheckInCityList(this.params).then(res => {
        // console.log(res)
        this.total = res.total
        this.priceList = res.rows
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    //  表格
    handleSelectionChange (list) {
      this.dataArr = list
    },
    //  弹框提交
    refer () {
      this.flag = true
      if (this.msg.cityName === '' || this.msg.openHour === '' || this.msg.channel.length === 0) {
        return false
      }
      let obj = JSON.parse(JSON.stringify(this.msg))
      obj.channel = obj.channel.join(',')
      for (let item of this.treeList) {
        if (item.text === obj.cityName) {
          obj.cityCode = item.id
        }
      }
      if (this.ref === 'add') {
        //  添加提交
        types.addCheckInCity(obj).then(res => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.dialogAdd = false
          this.initData()
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        //  修改提交
        types.updateCheckInCity(obj).then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.dialogAdd = false
          this.initData()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    },
    // 重置
    reset () {
      this.init()
      this.flag = false
    },
    // 返回
    back () {
      this.dialogAdd = false
    },
    init () {
      this.msg = {
        cityCode: '',
        openHour: '',
        channel: [],
        cityStatus: '1',
        umeFlag: '0',
        cityName: ''
      }
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList, //  渠道
      treeList: state => state.app.city //  城市对
    })
  }
}
</script>
<style scoped lang="scss">
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
</style>
