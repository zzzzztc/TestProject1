
<template>
  <div id="AirCityPre" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="城市三字码" title='城市三字码' v-model="params.tval" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="机场城市名称" title='机场城市名称' v-model="params.tname" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="机场名称" title='机场名称' v-model="params.airportName" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="params.isinter" clearable  placeholder="国内/国际" title='国内/国际'>
            <el-option label="国内" value="0"></el-option>
            <el-option label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="params.fancity" clearable placeholder="热门城市" title='热门城市'>
            <el-option label="热门" value="1"></el-option>
            <el-option label="非热门" value="0"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="params.cityStatus" clearable title='启用/禁用'  placeholder="启用/禁用">
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='params.channel' clearable placeholder='渠道类型' title='渠道类型' size='medium' style='width: 180px'>
            <el-option
              v-for='item in channelList'
              :key='item.chalId'
              :label='item.chalName'
              :value='item.chalCode'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='params.forCity' clearable placeholder='城市用于' title='城市用于' size='medium' style='width: 180px'>
            <el-option value="0" label="机票查询"></el-option>
            <el-option value="1" label="航班动态"></el-option>
            <el-option value="2" label="积分补登"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="initrefer">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" @click="excal">导出</el-button>
        <el-button size="medium" :disabled='dataArr.length !== 1' @click="szChannel">修改所属渠道</el-button>
        <el-button size="medium" @click="rescive(null)">添加</el-button>
        <el-button size="medium" type= 'danger' :disabled='dataArr.length === 0' @click="del(null)">批量删除</el-button>
      </div>
      <div v-if="isColumn" class="search-container clearfix flex">
        <div class="check-ipt">
          <el-checkbox @change="checkHanler" v-model="checkedAll" :indeterminate="isIndeterminate">全选</el-checkbox>
        </div>
        <div>
          <div class="check-item check-ipt" v-for="item in checkList" :key="item.key">
            <el-checkbox-group v-model="checked" @change="handleCheck">
              <el-checkbox class="table-cell"  :label="item.key" :key="item.key" @change="handleoneCheck(item.key)">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <div class="column-btn" @click="switchColumn">
          <i class="el-icon-arrow-up"></i>
        </div>
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
          <el-table-column type='selection'></el-table-column>
          <el-table-column v-if="tableList.tname" label="机场城市名称" prop="tname" min-width="110"></el-table-column>
          <el-table-column v-if="tableList.tval" label="机场城市三字码" prop="tval" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.tcode" label="机场城市四字码" prop="tcode" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.qp" label="机场城市全拼" prop="qp" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.jp" label="机场城市简拼" prop="jp" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.sfName" label="机场城市省份" prop="sfName" min-width="110"></el-table-column>
          <el-table-column v-if="tableList.qh" label="机场城市区号" prop="qh" min-width="110"></el-table-column>
          <el-table-column v-if="tableList.airPortName" label="机场名称" prop="airPortName" min-width="110"></el-table-column>
          <el-table-column v-if="tableList.channel" label="渠道类型" width="200">
            <template slot-scope="scope">
              {{scope.row.channel | channelMap}}
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.fancity" label="热门城市"  min-width="90">
            <template slot-scope="scope">
              {{scope.row.fancity | fancity}}
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.isInter" label="国内/际城市" min-width="120">
            <template slot-scope="scope">
              {{scope.row.isInter | isInter}}
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.timeZone" label="时区"  prop="timeZone" min-width="90"></el-table-column>
          <el-table-column v-if="tableList.isRetro" label="积分补登"  prop="isRetro" min-width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.isRetro === '1'">是</span>
              <span v-if="scope.row.isRetro === '0'">否</span>
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.forTicket" label="机票查询"  prop="forTicket" min-width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.forTicket === '1'">是</span>
              <span v-if="scope.row.forTicket === '0'">否</span>
            </template>
            <!--planSearch-->
          </el-table-column>
          <el-table-column v-if="tableList.forFlight" label="航班动态"  prop="forFlight" min-width="90">
            <template slot-scope='scope'>
              <span v-if="scope.row.forFlight === '1'">是</span>
              <span v-if="scope.row.forFlight === '0'">否</span>
            </template>
          </el-table-column>
          <el-table-column label='操作' align='left' width="120" v-if="checked.length">
            <template slot-scope='scope'>
              <span class="active-text mr-5" @click='handledit({ ids: scope.row.id, status: scope.row.status })' v-if="scope.row.status === '0'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handledit({ ids: scope.row.id, status: scope.row.status })' v-if="scope.row.status === '1'" title="禁用">启用</span>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogAdd" width="840px" top="5vh" style="overflow: hidden">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">机场城市名称</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable v-model="msg.tname" placeholder="机场城市名称"></el-input>
                <div class="warning-info" v-if="flag && !msg.tname">机场城市名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">机场名称</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable v-model="msg.airportName" placeholder="机场名称" title="必填项"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label required">机场城市三字码</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable v-model="msg.tval" placeholder="机场城市三字码" title="必填项"></el-input>
                <div class="warning-info" v-if="flag && !msg.tval">机场城市三字码不可为空</div>
              </div>
            </div>
          </div>
          <!--第二排-->
          <div class="row">
            <div class="column">
              <div class="label">机场城市四字码</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable v-model="msg.tcode" placeholder="机场城市四字码" title="机场城市四字码"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">机场城市省份</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.sf' clearable placeholder='机场城市省份' size='medium' title="机场城市省份">
                  <el-option
                    v-for='item in treeList'
                    :key='item.id'
                    :label='item.text'
                    :value='item.id'>
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">机场城市区号</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable v-model="msg.qh" placeholder="机场城市区号" title="机场城市区号"></el-input>
              </div>
            </div>
          </div>
          <!--第三排-->
          <div class="row">
            <div class="column">
              <div class="label">是否热门城市</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.fancity"  placeholder="国内国际">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">国内/际城市</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.isinter"  placeholder="国内国际">
                  <el-option label="国内" value="0"></el-option>
                  <el-option label="国际" value="1"></el-option>
                  <el-option label="国内(际)" value="2"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">时区</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.timeZone' clearable placeholder='时区' size='medium'>
                  <el-option
                    v-for='item in dincName'
                    :key='item.dincId'
                    :label='item.dincName'
                    :value='item.dincCode'>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--第四排-->
          <div class="row">
            <div class="column">
              <div class="label">机票查询</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.forTicket"  placeholder="机票查询">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">航班动态</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.forFlight"  placeholder="航班动态">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">积分补登</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.isRetro' clearable placeholder='积分补登' size='medium'>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--第五排-->
          <div class="row">
            <div class="column">
              <div class="label required">渠道编号(多选)</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.channel' clearable placeholder='渠道类型' multiple size='medium' title="必填项" collapse-tags>
                  <el-option
                    v-for='item in channelList'
                    :key='item.chalId'
                    :label='item.chalName'
                    :value='item.chalCode'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flag && msg.channel.length === 0">渠道编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">启用/禁用</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.cityStatus"  placeholder="启用/禁用">
                  <el-option label="禁用" value="1"></el-option>
                  <el-option label="启用" value="0"></el-option>
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
    <!--修改所属渠道弹窗-->
    <el-dialog :title="dialogCennel" :visible.sync="dialogchen" width="400px" top="5vh" style="overflow: hidden">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">渠道编号(多选)</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.channel' clearable placeholder='渠道类型' multiple size='medium' title="必填项" collapse-tags>
                  <el-option
                    v-for='item in channelList'
                    :key='item.chalId'
                    :label='item.chalName'
                    :value='item.chalCode'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flag && msg.channel.length === 0">渠道编号不可为空</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="mine">
        <el-button type='primary' size='medium ' @click="canRefer">提交</el-button>
        <el-button plain size='medium ' @click="chenBack">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getDataDictionary, getChannelList, computeTableHeight, isEmpty, excelList, getRouteName, getDynamicTableCulmae } from '../../../utils/index'
import * as types from './api'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'AirCityPre',
  data () {
    return {
      componentName: 'airCityPre',
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        tname: true,
        tval: true,
        tcode: true,
        qp: true,
        jp: true,
        sfName: true,
        qh: true,
        airPortName: false,
        channel: false,
        fancity: false,
        isinter: false,
        timeZone: false,
        isRetro: false,
        forTicket: false,
        forFlight: false
      },
      dataViewHeight: null,
      params: {
        tval: '',
        tname: '',
        airportName: '',
        isinter: '',
        fancity: '',
        cityStatus: '',
        channel: '',
        forCity: '',
        page: 1,
        rows: 20
      },
      priceList: [],
      dialogAdd: false,
      dialogTitle: '',
      flag: false,
      ref: '',
      msg: {
        tname: '', //  机场城市
        airportName: '', //  机场名称
        tval: '', //  机场城市三字码
        tcode: '', //  机场城市四字码
        flag: '1', //  默认1
        sf: '', //  机场城市省份ps：区号
        qh: '', //  机场城市区号
        fancity: '1', //  热门城市 1：是 0：否
        isinter: '0', //  国内国际 1：国际 0：国内
        timeZone: '', //  时区 数据字典TIMEZONE
        forTicket: '1', //  机票查询 1：是 0：否
        forFlight: '1', //  航班动态 1：是 0：否
        isRetro: '1', //  积分补登 1：是 0：否
        channel: ['mini'], //  渠道
        cityStatus: '1' //  启用/禁用 0：启用 1：禁用
      },
      dataArr: [],
      dialogCennel: '设置渠道',
      dialogchen: false,
      total: null,
      tFlag: true,
      treeList: [],
      loading: false
    }
  },
  created () {
    this.initData()
    this.getdincName()
    this.judgeChannelList()
    this.sfList()
    this.params.rows = this.pagination.pageSize
  },
  mixins: [checkAttrs, computWidth],
  methods: {
    switchColumn () {
      this.isColumn = !this.isColumn
      this.$nextTick(function () {
        this.dataViewHeight = computeTableHeight(this, 'header')
      })
    },
    locCheck () {
      //  如果本地有就取本地的
      if (getDynamicTableCulmae('airCityPre').length) {
        this.checked = getDynamicTableCulmae('airCityPre')
        if (this.checked.length === this.checkList.length) {
          this.checkedAll = true
        }
        for (let item in this.tableList) {
          if (this.checked.indexOf(item) !== -1) {
            this.tableList[item] = true
          } else {
            this.tableList[item] = false
          }
        }
      } else {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].flag) {
            this.checked.push(this.checkList[i].key)
            this.tableList[this.checkList[i].key] = true
          }
        }
      }
    },
    //   动态加载表格
    checkHanler (val) {
      if (val) {
        this.checked = this.checkList.map((item) => {
          return item.key
        })
        for (let item in this.tableList) {
          this.tableList[item] = true
        }
      } else {
        this.checked = []
        for (let item in this.tableList) {
          this.tableList[item] = false
        }
      }
    },
    //  全选框
    handleCheck (value) {
      let checkLength = value.length
      this.checkedAll = checkLength === this.checkList.length
    },
    //  表格checkbox单选框
    handleoneCheck (key) {
      let flag = this.tableList[key]
      if (flag) {
        for (let i = 0; i < this.checked.length; i++) {
          if (this.checked[i] === key) {
            this.checked.splice(i, 1)
          }
        }
      }
      this.tableList[key] = flag ? this.tableList[key] = false : this.tableList[key] = true
    },
    initList () {
      this.params.page = 1
      this.initData()
    },
    sfList () {
      types.queryProvinceTree().then(res => {
        this.treeList = res.treeList
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    clickRow (row) {
      if (this.tFlag) this.$refs.refTable.toggleRowSelection(row)
      this.tFlag = true
    },
    //  导出
    excal () {
      let data = JSON.parse(JSON.stringify(this.params))
      let url = 'cityAirport/ExportAirCity'
      let name = getRouteName('/airCityPre')
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
      excelList(obj, this)
    },
    initrefer () {
      for (let item in this.params) {
        if (item !== 'rows') {
          this.params[item] = ''
        }
      }
      this.params.page = 1
      this.initData()
    },
    search () {
      this.params.page = 1
      this.initData()
    },
    handleSizeChange (row) {
      this.params.rows = row
      this.initData()
    },
    handleCurrentChange (pages) {
      this.params.page = pages
      this.initData()
    },
    //  修改渠道提交
    canRefer () {
      this.flag = true
      if (this.msg.channel.length === 0) {
        return false
      }
      let obj = {}
      obj['ids'] = this.dataArr[this.dataArr.length - 1].id
      obj['channel'] = this.msg.channel.join(',')
      types.modifyAirCityChannel(obj).then(res => {
        this.dialogchen = false
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.initData()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    //  修改渠道弹窗返回
    chenBack () {
      this.dialogchen = false
    },
    // 弹框提交
    refer () {
      this.flag = true
      if (isEmpty(this.msg.tname) || isEmpty(this.msg.tval) || this.msg.channel.length === 0) {
        return false
      }
      let obj = JSON.parse(JSON.stringify(this.msg))
      obj.channel = obj.channel.join(',')
      if (this.ref === 'add') {
        //  添加
        types.addAirCityInfo(obj).then(res => {
          this.dialogAdd = false
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.initData()
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        //  修改
        types.updateAirCity(obj).then(res => {
          this.dialogAdd = false
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
    handleSelectionChange (row) {
      this.dataArr = row
    },
    //  设置渠道
    szChannel () {
      this.dialogchen = true
      this.msg.channel = this.dataArr[this.dataArr.length - 1].channel.split(',')
    },
    //  弹框重置
    reset () {
      this.resfer()
    },
    //  弹框返回
    back () {
      this.dialogAdd = false
    },
    //   区域
    getdincName () {
      if (!this.dincName.length) {
        getDataDictionary('TIMEZONE')
      }
    },
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    isValid (obj) {
      let dincName = this.dincName
      dincName.map((item) => {
        if (obj.timeZone === item.dincCode) {
          obj.timeZone = item.dincName
        }
      })
    },
    //  初始化
    initData () {
      this.loading = true
      types.airCityPreList(this.params).then(res => {
        let dincName = res.rows
        dincName.forEach(
          this.isValid
        )
        this.total = res.total
        this.priceList = res.rows
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    //  启用禁用
    handledit (data = {}) {
      let mag = ''
      this.tFlag = false
      if (data.status === '1') {
        data.status = '0'
        mag = '是否确认启用 ?'
      } else {
        data.status = '1'
        mag = '是否确认禁用 ?'
      }
      this.$confirm(mag, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        types.validityAirCity(data).then(res => {
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
    //  编辑
    rescive (param) {
      this.dialogAdd = true
      this.tFlag = false
      if (param && param !== null) {
        this.dialogTitle = '修改'
        this.ref = ''
        let msg = JSON.parse(JSON.stringify(param))
        this.msg = Object.assign(this.msg, msg)
        this.msg.isinter = msg.isInter
        this.msg.airportName = msg.airPortName
        this.msg.cityStatus = msg.status
        this.msg.cityId = msg.id
        this.msg.channel = msg.channel.split(',')
        for (let item of this.treeList) {
          if (item.text === msg.sfName) {
            this.msg.sf = item.id
            break
          }
        }
        //  区域回显
        for (let item of this.dincName) {
          if (item.dincName === msg.timeZone) {
            this.msg.timeZone = item.dincCode
            break
          }
        }
      } else {
        this.tFlag = true
        this.dialogTitle = '添加'
        this.ref = 'add'
        this.resfer()
      }
    },
    //  重置
    resfer () {
      this.msg = {
        tname: '', //  机场城市
        airportName: '', //  机场名称
        tval: '', //  机场城市三字码
        tcode: '', //  机场城市四字码
        flag: '1', //  默认1
        sf: '', //  机场城市省份ps：区号
        qh: '', //  机场城市区号
        fancity: '1', //  热门城市 1：是 0：否
        isinter: '0', //  国内国际 1：国际 0：国内
        timeZone: '', //  时区 数据字典TIMEZONE
        forTicket: '1', //  机票查询 1：是 0：否
        forFlight: '1', //  航班动态 1：是 0：否
        isRetro: '1', //  积分补登 1：是 0：否
        channel: ['mini'], //  渠道
        cityStatus: '0' //  启用/禁用 0：启用 1：禁用
      }
      // this.msg.channel = ['mini']
      for (let item of this.dincName) {
        if (item.dincName === '东八区') {
          this.msg.timeZone = item.dincCode
        }
      }
      this.flag = false
    },
    //  删除
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
          ids = val.id
        } else {
          //  批量删除
          let state = this.dataArr.map((item) => {
            return item.id
          })
          ids = state.join(',')
        }
        let obj = {
          ids
        }
        types.deleteAirCityInfo(obj).then((res) => {
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
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList, //  渠道
      // treeList: state => state.app.city, //  城市对
      dincName: state => state.app.dataDictionary.TIMEZONE //  区域
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
