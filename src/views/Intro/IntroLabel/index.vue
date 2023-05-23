<template>
  <div id="CabinLabel" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="规则编码" v-model="params.ruleCode" title="规则编码" @keydown.enter.native='initList()'></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='params.channel' clearable placeholder='渠道编号' size='medium'>
            <el-option
              v-for='item in channelList'
              :key='item.chalId'
              :label='item.chalName'
              :value='item.chalCode'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='params.airCode' clearable placeholder='实际承运航司' size='medium' title="实际承运航司">
            <el-option value="NS" label="河北航空"></el-option>
            <el-option value="MF" label="厦门航空"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="params.fsdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="params.fedate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable v-model="params.isInter"  placeholder="国内/国际" title="国内/国际">
            <el-option label="国内" value="0"></el-option>
            <el-option label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="params.validBeginDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="销售开始时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="params.validEndDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="销售截止时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="航班号" v-model="params.flightNo" title="航班号" @keydown.enter.native='initList()'></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='params.seat' clearable placeholder='舱位' title='舱位' size='medium'>
            <el-option
              v-for='item in cabin'
              :key='item'
              :label='item'
              :value='item'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="创建人" v-model="params.createOpid" title="创建人" @keydown.enter.native='initList()'></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable v-model="params.seatFlag"  placeholder="启用/禁用" title="启用/禁用">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="航段" v-model="params.depAirport" title="航段1" style="width: 80px" @keydown.enter.native='initList()'></el-input>
          <span class="lines">-</span>
          <el-input size="medium" clearable placeholder="航段" v-model="params.arrAirport" title="航段2" style="width: 80px" @keydown.enter.native='initList()'></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="initrefer">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <div class="search-item">
          <el-button size="medium" @click="rescive(null)">添加</el-button>
          <el-button size="medium" :disabled="!dataArr.length" @click="handleEditTime(null)">修改销售时间</el-button>
          <el-button size="medium" type= 'danger' :disabled='dataArr.length === 0' @click="del(null)">批量删除</el-button>
          <el-button type="success" size="medium" :disabled='total === 0' @click="excel()">导出</el-button>
        </div>
      </div>
      <div v-if="isColumn">
        <div class="search-container clearfix flex">
          <div class="check-ipt">
            <el-checkbox @change="checkHanler" v-model="checkedAll" :indeterminate="isIndeterminate">全选</el-checkbox>
          </div>
          <div>
            <div class="check-item check-ipt" v-for="item in checkList" :key="item.key">
              <el-checkbox-group v-model="checked" @change="handleCheck">
                <el-checkbox  :label="item.key" :key="item.key" @change="handleoneCheck(item.key)">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="column-btn" @click="switchColumn">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="table-container">
        <el-table
          :cell-style="tableAttributes.cellStyle"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          @row-click="clickRow"
          ref="refTable"
          v-loading="loading"
          row-key="lowestpriceid"
          @selection-change='handleSelectionChange'
          :height="dataViewHeight"
          :data="priceList">
<!--          <el-table-column label='序号' fixed="left" type='index' width="50"></el-table-column>-->
          <el-table-column type='selection'></el-table-column>
          <el-table-column v-if="tableList.ruleCode" label="规则编码" prop="ruleCode" min-width="160"></el-table-column>
          <el-table-column v-if="tableList.channel" label="渠道" min-width="160">
            <template slot-scope="scope">
              {{scope.row.channel | channelMap }}
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.aircode" label="承运航司" prop="aircode" min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.aircode === 'NS' ? '河北航空' : scope.row.aircode === 'MF' ? '厦门航空' : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.fsdate" label="航班开始日期" prop="fsdate" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.fedate" label="航班截止日期" prop="fedate" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.validBeginDate" label="销售开始时间" prop="validBeginDate" min-width="160"></el-table-column>
          <el-table-column v-if="tableList.validEndDate" label="销售截止时间" prop="validEndDate" min-width="160"></el-table-column>
          <el-table-column v-if="tableList.isinter" label="国内/国际" prop="isinter" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.isinter === '1'">国际</span>
              <span v-if="scope.row.isinter === '0'">国内</span>
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.flightno" label="航班号" prop="flightno" min-width="100"></el-table-column>
          <el-table-column v-if="tableList.depAirport" label="出发地" prop="depAirport" min-width="100"></el-table-column>
          <el-table-column v-if="tableList.arrAirport" label="到达地" prop="arrAirport" min-width="100"></el-table-column>
          <el-table-column v-if="tableList.seat" label="舱位" min-width="120" prop="seat"></el-table-column>
          <el-table-column v-if="tableList.recommendLabel" label="推荐标签" min-width="100" prop="recommendLabel"></el-table-column>
          <el-table-column v-if="tableList.seatTag" label="舱位标签" min-width="160" prop="seatTag" :formatter="seatTagTxt"></el-table-column>
          <el-table-column v-if="tableList.createDate" label="创建时间" min-width="160" prop="createDate"></el-table-column>
          <el-table-column v-if="tableList.createOpid" label="创建人" min-width="120" prop="createOpid"></el-table-column>
          <el-table-column v-if="tableList.modifyDate" label="修改时间" min-width="160" prop="modifyDate"></el-table-column>
          <el-table-column v-if="tableList.modifyOpid" label="修改人" min-width="120" prop="modifyOpid"></el-table-column>
          <el-table-column v-if="tableList.seatRemark" label="舱位备注" min-width="160" prop="seatRemark" :formatter="RemarkTxt"></el-table-column>
          <el-table-column label='操作'  align='left' width="220" v-if="checked.length">
            <template slot-scope='scope'>
              <span class="active-text mr-5" @click='handledit({ id: scope.row.seatid, status: scope.row.seatFlag })' v-if="scope.row.seatFlag === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handledit({ id: scope.row.seatid, status: scope.row.seatFlag })' v-if="scope.row.seatFlag === '0'" title="禁用">启用</span>
              <span class="active-text mr-5" title="编辑" @click="rescive(scope.row, 'revise')">编辑</span>
              <span class="active-text mr-5" title="修改销售日期" @click="handleEditTime(scope.row)">修改销售日期</span>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogAdd" width="820px" top="5vh" style="overflow: hidden">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">规则编号</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable placeholder="规则编号" v-model="msg.ruleCode" title="必填项"></el-input>
                <div class="warning-info" v-if="flag && !msg.ruleCode">规则编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航班号</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable placeholder="航班号" v-model="msg.flightno" title="必填项"></el-input>
                <div class="warning-info" v-if="flag && !msg.flightno">航班号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">舱位</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <div>
                    <el-select v-model='msg.seat' placeholder='舱位' multiple size='medium' title="适用仓舱位" collapse-tags>
                      <el-option value="" label="全部"></el-option>
                      <el-option
                        v-for='item in cabin'
                        :key='item'
                        :label='item'
                        :value='item'>
                      </el-option>
                    </el-select>
                    <div class="warning-info" v-if="flag && !msg.seat.length">舱位不可为空</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--第二排-->
          <div class="row">
            <div class="column">
              <div class="label required">渠道编号</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.channel' multiple placeholder='渠道编号' title="必填项" size='medium' collapse-tags>
                  <el-option
                    v-for='item in channelList'
                    :key='item.chalId'
                    :label='item.chalName'
                    :value='item.chalCode'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flag && !msg.channel.length">渠道编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">国际/国内</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.isinter' placeholder='国际/国内' size='medium' title="必填项">
                  <el-option value="0" label="国内"></el-option>
                  <el-option value="1" label="国际"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">禁用/启用</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                    <el-select v-model='msg.seatFlag' placeholder='启用/禁用' size='medium'>
                      <el-option value="0" label="禁用"></el-option>
                      <el-option value="1" label="启用"></el-option>
                    </el-select>
                </div>
              </div>
            </div>
          </div>
          <!--第三排-->
          <div class="row">
            <div class="column">
              <div class="label">承运航司</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.aircode' placeholder='承运航司' title="必填项" size='medium'>
                  <el-option value="NS" label="河北航空"></el-option>
                  <el-option value="MF" label="厦门航空"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">航班开始日期</div>
              <div class="fl ipt-medium">
                <el-date-picker
                  v-model="msg.fsdate"
                  type="date"
                  style="width: 210px"
                  value-format="yyyy-MM-dd"
                  placeholder="航班开始日期">
                </el-date-picker>
              </div>
            </div>
            <div class="column">
              <div class="label">航班结束日期</div>
              <div class="fl ipt-medium">
                <el-date-picker
                  v-model="msg.fedate"
                  style="width: 210px"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="航班结束日期">
                </el-date-picker>
              </div>
            </div>
          </div>
          <!--第四排-->
          <div class="row">
            <div class="column">
              <div class="label required">航段</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input size="medium" clearable placeholder="航段1" v-model="msg.depAirport" title="航段1" style="width: 94px"></el-input>
                  <span class="lines">—</span>
                  <el-input size="medium" clearable placeholder="航段2" v-model="msg.arrAirport" title="航段2" style="width: 94px"></el-input>
                  <div class="warning-info" v-if="flag && !msg.arrAirport && !msg.depAirport">航段不可为空</div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="label">推荐标签</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable placeholder="推荐标签" v-model="msg.recommendLabel" title="必填项"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label required">销售开始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="datetime"
                  class="date-picker"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="销售开始日期"
                  v-model="msg.validBeginDate">
                </el-date-picker>
                <div class="warning-info" v-if="flag && !msg.validBeginDate">销售开始日期不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">销售截止日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="datetime"
                  class="date-picker"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="销售截止日期"
                  v-model="msg.validEndDate">
                </el-date-picker>
                <div class="warning-info" v-if="flag && !msg.validEndDate">销售截止日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">舱位标签</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input
                    type="textarea"
                    :rows="3"
                    class="tareWidth"
                    style="width: 210px"
                    placeholder="舱位标签"
                    v-model="msg.seatTag">
                  </el-input>
                  <div class="warning-info" v-if="flag && !msg.seatTag">舱位标签不可为空</div>
                  <div class="warning-info" v-if="regFlag">格式错误，例：非常舒适-#ccc</div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="label">舱位备注</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input
                    type="textarea"
                    :rows="3"
                    class="tareWidth"
                    style="width: 210px"
                    placeholder="舱位备注"
                    v-model="msg.seatRemark">
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="refer">提交</el-button>
          <el-button size="medium" v-if="ref === 'add'" @click="reset">重置</el-button>
          <el-button size="medium"  @click="dialogAdd = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 修改销售时间-->
    <el-dialog title="修改销售时间" :visible.sync="dialogVisible" width="320px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">销售开始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="datetime"
                  class="date-picker"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="销售开始日期"
                  v-model="editTimeForm.validBeginDate">
                </el-date-picker>
                <div class="warning-info" v-if="flag && !editTimeForm.validBeginDate">销售开始日期不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">销售截止日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="datetime"
                  class="date-picker"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="销售截止日期"
                  v-model="editTimeForm.validEndDate">
                </el-date-picker>
                <div class="warning-info" v-if="flag && !editTimeForm.validEndDate">销售截止日期不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button size="medium" @click="handleTime()">提交</el-button>
          <el-button size="medium" @click="resetTimeEdit()">重置</el-button>
          <el-button size="medium" @click="dialogVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { cabin } from './data'
import { getChannelList, excelList, getRouteName } from '../../../utils/index'
import * as types from './api'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'CabinLabel',
  data () {
    return {
      componentName: 'cabinLabel',
      checkedAll: false,
      isIndeterminate: false,
      checkList: fieldMap,
      cabin: cabin(),
      dataViewHeight: null,
      params: {
        ruleCode: '',
        channel: '',
        airCode: '',
        isInter: '',
        flightNo: '',
        depAirport: '',
        arrAirport: '',
        seat: '',
        createOpid: '',
        seatFlag: '',
        validBeginDate: '', // 销售开始时间
        validEndDate: '', // 销售截止时间
        page: 1,
        rows: 20
      },
      planDate: [],
      priceList: [],
      dataArr: [],
      total: null,
      dialogTitle: '',
      dialogAdd: false,
      dialogVisible: false, // 修改销售时间弹出框显示隐藏
      msg: {
        ruleCode: '',
        aircode: 'NS',
        fsdate: '',
        fedate: '',
        depAirport: '',
        arrAirport: '',
        seat: [''],
        isinter: '0',
        seatFlag: '0',
        channel: ['mini'],
        flightno: '',
        recommendLabel: '',
        seatTag: '',
        seatRemark: '',
        validBeginDate: '', // 销售开始时间
        validEndDate: '' // 销售截止时间
      },
      editTimeForm: {
        validBeginDate: '', // 销售开始时间
        validEndDate: '' // 销售截止时间
      },
      flag: false,
      regFlag: false,
      ref: '',
      tFlag: true,
      loading: false,
      tableList: {
        ruleCode: true,
        channel: true,
        aircode: false,
        fsdate: false,
        fedate: false,
        isinter: false,
        flightno: false,
        depAirport: false,
        arrAirport: false,
        seat: true,
        recommendLabel: true,
        seatTag: true,
        createDate: false,
        createOpid: false,
        modifyDate: false,
        modifyOpid: false,
        seatRemark: false,
        seatFlag: true,
        validBeginDate: true,
        validEndDate: true
      }
    }
  },
  created () {
    this.judgeChannelList()
    this.params.rows = this.pagination.pageSize
    this.initData()
  },
  mixins: [checkAttrs, computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  methods: {
    initList () {
      this.params.page = 1
      this.params.fsdate = this.planDate[0]
      this.params.fedate = this.planDate[1]
      this.initData()
    },
    clickRow (row) {
      if (this.tFlag) this.$refs.refTable.toggleRowSelection(row)
      this.tFlag = true
    },
    seatTagTxt (row, column, cellValue, index) {
      // let txt = ''
      if (row.seatTag.indexOf('|') !== -1) {
        row.seatTag = row.seatTag.replace(/[|]/g, '\n')
      }
      return row.seatTag
    },
    RemarkTxt (row, column, cellValue, index) {
      if (row.seatRemark.indexOf('|') !== -1) {
        row.seatRemark = row.seatRemark.replace(/[|]/g, '\n')
      }
      return row.seatRemark
    },
    shoReg () {
      if (this.msg.seatTag) {
        if (this.msg.seatTag.indexOf('-') === -1) {
          this.regFlag = true
          return false
        } else {
          this.regFlag = false
        }
      }
    },
    reset () {
      this.flag = false
      this.regFlag = false
      this.init()
    },
    refer () {
      this.flag = true
      let obj = Object.assign({}, this.msg)
      let seatTag = obj.seatTag.split('\n')
      this.shoReg()
      if (seatTag.length > 1) {
        obj.seatTag = seatTag.join('|')
      }
      if (!obj.ruleCode || !obj.channel.length || !obj.flightno || !obj.seat.length || !obj.seatTag || !obj.depAirport || !obj.arrAirport) {
        return false
      }
      if (this.regFlag) {
        this.$message.error('请按规则填写舱位标签')
        return false
      }
      let state = obj.seat.every((item) => {
        return item === ''
      })
      if (!state) {
        let list = obj.seat.filter((item) => item !== '')
        obj.seat = list.join(',')
      } else {
        obj.seat = obj.seat.join(',')
      }
      obj.channel = obj.channel.join(',')
      if (this.ref === 'add') {
        //  添加
        types.addCabinLabel(obj).then(res => {
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
        types.updateCabinLabel(obj).then(res => {
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
          ids = val.seatid
        } else {
          //  批量删除
          let state = this.dataArr.map((item) => {
            return item.seatid
          })
          ids = state.join(',')
        }
        let obj = {
          ids
        }
        types.deleteCabinLabel(obj).then((res) => {
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
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handledit (obj) {
      let msg = ''
      this.tFlag = false
      if (obj.status === '0') {
        obj.status = '1'
        msg = '是否确认禁用 ?'
      } else {
        obj.status = '0'
        msg = '是否确认启用 ?'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        types.updateStatus(obj).then(res => {
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
    handleSelectionChange (list) {
      this.dataArr = list
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
    excel () {
      let data = JSON.parse(JSON.stringify(this.params))
      let url = 'cabinLabel/exportRule'
      let name = getRouteName('/cabinLabel')
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
    rescive (param) {
      this.dialogAdd = true
      this.tFlag = false
      if (param && param !== null) {
        //  修改
        this.ref = ''
        this.dialogTitle = '修改'
        let msg = JSON.parse(JSON.stringify(param))
        for (let item in msg) {
          for (let items in this.msg) {
            if (item === items) {
              this.msg[items] = msg[item]
            }
          }
        }
        this.msg.seatTag = this.msg.seatTag.replace(/[|]/g, '')
        this.msg.seatid = param.seatid
        this.msg.seat = this.msg.seat.split(',')
        this.msg.channel = param.channel.split(',')
      } else {
        //  添加
        this.tFlag = true
        this.dialogTitle = '添加'
        this.ref = 'add'
        this.init()
      }
    },
    init () {
      this.msg = {
        ruleCode: '',
        aircode: 'NS',
        fsdate: '',
        fedate: '',
        depAirport: '',
        arrAirport: '',
        seat: [''],
        isinter: '0',
        seatFlag: '1',
        channel: ['mini'],
        flightno: '',
        recommendLabel: '',
        seatTag: '',
        seatRemark: '',
        validBeginDate: '',
        validEndDate: ''
      }
    },
    search () {
      this.params.page = 1
      this.initData()
    },
    initData () {
      this.loading = true
      // console.log(this.params)
      types.queryCabinLabelList(this.params).then(res => {
        this.priceList = res.rows
        this.total = res.total
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    initrefer () {
      for (let item in this.params) {
        this.params[item] = ''
      }
      this.params.page = 1
      this.params.rows = this.pagination.pageSize
      this.params.fsdate = ''
      this.params.fedate = ''
      this.planDate = []
      this.initData()
    },
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 修改销售时间
    handleEditTime (params) {
      this.dialogVisible = true
      this.isEmpty = false
      if (params) {
        this.tFlag = true
        this.editTimeForm.validBeginDate = params.validBeginDate
        this.editTimeForm.validEndDate = params.validEndDate
        this.editTimeForm.ids = params.seatid
      } else {
        this.tFlag = false
        this.resetTimeEdit()
      }
    },
    // 修改销售时间弹出框 -- 提交
    handleTime () {
      let params = []
      if (this.editTimeForm.validBeginDate && this.editTimeForm.validEndDate) {
        let data = JSON.parse(JSON.stringify(this.editTimeForm))
        if (this.tFlag === false) {
          if (this.dataArr.length) {
            for (let item of this.dataArr) {
              params.push(item.seatid)
            }
          }
          data.ids = params.join(',')
        }
        types.batchUpdateSeatLabel(data).then(res => {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.dialogVisible = false
          this.initData()
        }).catch(err => {
          this.$message({
            message: err.message,
            type: 'danger'
          })
        })
      }
    },
    // 修改销售时间弹出框 -- 重置
    resetTimeEdit () {
      this.editTimeForm = {
        validBeginDate: '',
        validEndDate: ''
      }
    }
  }
}
</script>
<style>
  .lines{
    font-weight: bold;
    display: inline-block;
    width: 20px;
    text-align: center;
  }
  .scroll{
    height:80px;overflow-y: scroll
  }
</style>
