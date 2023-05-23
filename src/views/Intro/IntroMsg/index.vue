<template>
  <div id="UpgradIntroduce" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select v-model='params.introduceChannel' clearable placeholder='渠道类型' size='medium'>
            <el-option
              v-for='item in channelList'
              :key='item.chalId'
              :label='item.chalName'
              :value='item.chalCode'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="航班号" v-model="params.flightNo" title="航班号" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable v-model="params.isinter"  placeholder="国内/国际" title="国内/国际">
            <el-option label="国内" value="0"></el-option>
            <el-option label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='params.introduceCabin' clearable placeholder='适用舱位' size='medium'>
            <el-option
              v-for='item in cabin'
              :key='item'
              :label='item'
              :value='item'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="params.introduceStatus" clearable  placeholder="启用/禁用" title="启用/禁用">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt" style="width: 210px">
          <el-input size="medium" clearable placeholder="航段1" v-model="params.depAirport" title="航段1" style="width: 82px" @keydown.enter.native="initList()"></el-input>
          <span class="lines">-</span>
          <el-input size="medium" clearable placeholder="航段2" v-model="params.arrAirport" title="航段2" style="width: 82px" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="params.startFdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="params.endFdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="initrefer">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="rescive(null)">添加</el-button>
        <el-button size="medium" type= 'danger' :disabled='dataArr.length === 0' @click="del(null)">批量刪除</el-button>
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
          @selection-change='handleSelectionChange'
          @row-click="clickRow"
          v-loading='loading'
          ref="refTable"
          row-key="lowestpriceid"
          :height="dataViewHeight"
          :data="priceList">
<!--          <el-table-column label='序号' fixed="left" width="50" type='index'></el-table-column>-->
          <el-table-column type='selection'></el-table-column>
          <el-table-column v-if="tableList.channel" label="渠道" min-width="160">
            <template slot-scope="scope">
              {{scope.row.introduceChannel | channelMap }}
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.depAirport" label="出发地" prop="depAirport" min-width="100"></el-table-column>
          <el-table-column v-if="tableList.arrAirport" label="到达地" prop="arrAirport" min-width="100"></el-table-column>
          <el-table-column v-if="tableList.flightNo" label="航班号" prop="flightNo" min-width="100"></el-table-column>
          <el-table-column v-if="tableList.isinter" label="国内/国际" prop="isinter" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.isinter === '1'">国际</span>
              <span v-if="scope.row.isinter === '0'">国内</span>
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.introduceCabin" label="适用舱位" prop="introduceCabin" min-width="160"></el-table-column>
          <el-table-column v-if="tableList.startFdate" label="航班开始日期" prop="startFdate" min-width="160"></el-table-column>
          <el-table-column v-if="tableList.endFdate" label="航班截止日期" prop="endFdate" min-width="160"></el-table-column>
          <el-table-column v-if="tableList.introduceTitle" label="优惠政策标题" prop="introduceTitle" min-width="160"></el-table-column>
          <el-table-column v-if="tableList.luggageRemark" label="行李描述" prop="luggageRemark" min-width="160"></el-table-column>
          <el-table-column v-if="tableList.checkinRemark" label="值机描述" min-width="160" prop="checkinRemark"></el-table-column>
          <el-table-column v-if="tableList.securitycheckRemark" label="安检描述" min-width="160" prop="securitycheckRemark"></el-table-column>
          <el-table-column v-if="tableList.waitflightRemark" label="候机描述" min-width="160" prop="waitflightRemark"></el-table-column>
          <el-table-column v-if="tableList.boardingRemark" label="登机描述" min-width="160" prop="boardingRemark"></el-table-column>
          <el-table-column v-if="tableList.intheairRemark" label="空中描述" min-width="160" prop="intheairRemark"></el-table-column>
          <el-table-column v-if="tableList.integralRemark" label="积分描述" min-width="160" prop="integralRemark"></el-table-column>
          <el-table-column label='操作' align='left' width="120" v-if="checked.length">
            <template slot-scope='scope'>
              <span class="active-text mr-5" @click='handledit({ id: scope.row.introduceId, status: scope.row.introduceStatus })' v-if="scope.row.introduceStatus === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handledit({ id: scope.row.introduceId, status: scope.row.introduceStatus })' v-if="scope.row.introduceStatus === '0'" title="禁用">启用</span>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogAdd" width="820px" top="5vh" style="overflow: hidden">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">渠道</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.introduceChannel' multiple placeholder='全部' size='medium' collapse-tags>
                  <el-option
                    v-for='item in channelList'
                    :key='item.chalId'
                    :label='item.chalName'
                    :value='item.chalCode'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flag && msg.introduceChannel.length === 0">渠道不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">国际/国内</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.isinter' placeholder='国际/国内' size='medium' title="国际/国内">
                  <el-option value="0" label="国内"></el-option>
                  <el-option value="1" label="国际"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">适用舱位</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <div :class="msg.introduceCabin.length > 9 ? 'scroll' : ''">
                    <el-select v-model='msg.introduceCabin' placeholder='适用舱位' multiple size='medium' title="适用舱位" collapse-tags>
                      <el-option value="" label="全部"></el-option>
                      <el-option
                        v-for='item in cabin'
                        :key='item'
                        :label='item'
                        :value='item'>
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--第二排-->
          <div class="row">
            <div class="column">
              <div class="label">启用/禁用</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.introduceStatus' placeholder='启用/禁用' size='medium'>
                  <el-option value="0" label="禁用"></el-option>
                  <el-option value="1" label="启用"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">航班号</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input size="medium" clearable placeholder="例：3327，全部为*" v-model="msg.flightNo" title="例：3327，全部为*"></el-input>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航段</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input size="medium" clearable placeholder="航段1" v-model="msg.depAirport" title="航段1" style="width: 94px"></el-input>
                  <span class="lines">-</span>
                  <el-input size="medium" clearable placeholder="航段2" v-model="msg.arrAirport" title="航段2" style="width: 94px"></el-input>
                  <div class="warning-info" v-if="flag && !msg.depAirport && !msg.arrAirport">航段不可为空</div>
                </div>
              </div>
            </div>
          </div>
          <!--第三排-->
          <div class="row">
            <div class="column">
              <div class="label required">优惠政策标题</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable placeholder="优惠政策标题" v-model="msg.introduceTitle" title="必填"></el-input>
                <div class="warning-info" v-if="flag && !msg.introduceTitle">优惠政策标题不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航班开始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="航班开始日期"
                  v-model="msg.startFdate">
                </el-date-picker>
                <div class="warning-info" v-if="flag && !msg.startFdate">航班开始日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航班截止日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="航班截止日期"
                  v-model="msg.endFdate">
                </el-date-picker>
                <div class="warning-info" v-if="flag && !msg.endFdate">航班截止日期不可为空</div>
              </div>
            </div>
          </div>
          <!--第四排-->
          <div class="row">
            <div class="column">
              <div class="label">行李描述</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input
                    type="textarea"
                    :rows="3"
                    class="tareWidth"
                    placeholder="行李描述"
                    v-model="msg.luggageRemark">
                  </el-input>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="label">值机描述</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input
                    type="textarea"
                    :rows="3"
                    class="tareWidth"
                    placeholder="值机描述"
                    v-model="msg.checkinRemark">
                  </el-input>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="label">安检描述</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input
                    type="textarea"
                    class="tareWidth"
                    :rows="3"
                    placeholder="安检描述"
                    v-model="msg.securitycheckRemark">
                  </el-input>
                </div>
              </div>
            </div>
          </div>
          <!--第五排-->
          <div class="row">
            <div class="column">
              <div class="label">候机描述</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input
                    type="textarea"
                    class="tareWidth"
                    :rows="3"
                    placeholder="候机描述"
                    v-model="msg.waitflightRemark">
                  </el-input>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="label">登机描述</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input
                    type="textarea"
                    class="tareWidth"
                    :rows="3"
                    placeholder="登机描述"
                    v-model="msg.boardingRemark">
                  </el-input>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="label">空中描述</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input
                    type="textarea"
                    class="tareWidth"
                    :rows="3"
                    placeholder="空中描述"
                    v-model="msg.intheairRemark">
                  </el-input>
                </div>
              </div>
            </div>
          </div>
          <!--第六排-->
          <div class="row">
            <div class="column">
              <div class="label">积分描述</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input
                    type="textarea"
                    class="tareWidth"
                    :rows="3"
                    placeholder="积分描述"
                    v-model="msg.integralRemark">
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
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { cabin } from './data'
import { getChannelList } from '../../../utils/index'
import * as types from './api'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'UpgradIntroduce',
  data () {
    return {
      componentName: 'upgradIntroduce',
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        channel: true,
        depAirport: true,
        arrAirport: true,
        flightNo: true,
        isinter: true,
        introduceCabin: true,
        introduceTitle: false,
        luggageRemark: false,
        checkinRemark: false,
        securitycheckRemark: false,
        waitflightRemark: false,
        boardingRemark: false,
        intheairRemark: false,
        integralRemark: false,
        startFdate: true,
        endFdate: true
      },
      params: {
        introduceChannel: '',
        depAirport: '',
        arrAirport: '',
        flightNo: '',
        isinter: '',
        introduceCabin: '',
        introduceStatus: '',
        startFdate: '',
        endFdate: '',
        page: 1,
        rows: 20
      },
      cabin: cabin(),
      dataViewHeight: null,
      dataArr: [],
      priceList: [],
      total: null,
      dialogTitle: '',
      dialogAdd: false,
      msg: {
        introduceChannel: ['app'],
        flightNo: '',
        introduceCabin: [''],
        luggageRemark: '',
        securitycheckRemark: '',
        boardingRemark: '',
        integralRemark: '',
        depAirport: '',
        arrAirport: '',
        isinter: '0',
        introduceStatus: '1',
        introduceTitle: '',
        checkinRemark: '',
        waitflightRemark: '',
        intheairRemark: '',
        startFdate: '',
        endFdate: ''
      },
      ref: '',
      flag: false,
      tFlag: true,
      loading: false
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
      this.initData()
    },
    clickRow (row) {
      if (this.tFlag) this.$refs.refTable.toggleRowSelection(row)
      this.tFlag = true
    },
    //  弹框重置
    reset () {
      this.init()
      this.flag = false
    },
    //  弹框提交
    refer () {
      let obj = Object.assign({}, this.msg)
      this.flag = true
      if (obj.introduceTitle === '' || obj.introduceChannel.length === 0) {
        return false
      }
      if (obj.depAirport === '' || obj.arrAirport === '') {
        this.$message.error('请按规则填写航段')
        return false
      }
      if (!obj.introduceChannel.length) {
        this.$message.error('请选择渠道')
        return false
      }
      let state = obj.introduceCabin.every((item) => {
        return item === ''
      })
      if (!state) {
        let list = obj.introduceCabin.filter((item) => item !== '')
        obj.introduceCabin = list.join(',')
      } else {
        obj.introduceCabin = obj.introduceCabin.join(',')
      }
      obj.introduceChannel = obj.introduceChannel.join(',')
      if (this.ref === 'add') {
        types.addUpgradIntroduce(obj).then(res => {
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
        types.updateUpgradIntroduce(obj).then(res => {
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
    initData () {
      this.loading = true
      types.queryUpgradIntroduceList(this.params).then(res => {
        this.priceList = res.rows
        this.total = res.total
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    search () {
      this.params.page = 1
      this.initData()
    },
    initrefer () {
      for (let item in this.params) {
        this.params[item] = ''
      }
      this.params.page = 1
      this.params.rows = 20
      this.initData()
    },
    //  添加修改
    rescive (param) {
      this.dialogAdd = true
      this.tFlag = false
      this.flag = false
      if (param && param !== null) {
        // 修改
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
        this.msg.introduceId = param.introduceId
        this.msg.introduceChannel = this.msg.introduceChannel.split(',')
        this.msg.introduceCabin = param.introduceCabin.split(',')
      } else {
        //  添加
        this.tFlag = true
        this.ref = 'add'
        this.dialogTitle = '添加'
        this.init()
      }
    },
    //  数据重置
    init () {
      this.msg = {
        introduceChannel: ['app'],
        flightNo: '',
        introduceCabin: [''],
        luggageRemark: '',
        securitycheckRemark: '',
        boardingRemark: '',
        integralRemark: '',
        depAirport: '',
        arrAirport: '',
        isinter: '0',
        introduceStatus: '1',
        introduceTitle: '',
        checkinRemark: '',
        waitflightRemark: '',
        intheairRemark: '',
        startFdate: '',
        endFdate: ''
      }
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
          ids = val.introduceId
        } else {
          //  批量删除
          let state = this.dataArr.map((item) => {
            return item.introduceId
          })
          ids = state.join(',')
        }
        let obj = {
          ids
        }
        types.deleteUpgradIntroduce(obj).then((res) => {
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
    //  分页
    handleSizeChange (row) {
      this.params.rows = row
      this.initData()
    },
    handleCurrentChange (pages) {
      this.params.page = pages
      this.initData()
    },
    handleSelectionChange (list) {
      this.dataArr = list
    },
    handledit (obj) {
      let msg = ''
      this.tFlag = false
      if (obj.status === '1') {
        obj.status = '0'
        msg = '是否确认禁用 ?'
      } else {
        obj.status = '1'
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
    }
  }
}
</script>
<style>
  .lines{
    font-weight: bold;
    display: inline-block;
    width: 22px;
    text-align: center;
  }
  .scroll{
    height:80px;overflow-y: scroll
  }
  .tareWidth{
    width: 210px;
  }
</style>
