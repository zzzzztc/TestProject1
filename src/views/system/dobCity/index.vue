<template>
  <div id="AirlinePre" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select v-model='params.afrom' @focus="clearTreeListCopy" :filter-method="dataFilter" clearable filterable placeholder='出发城市名称' title="出发城市名称" size='medium'>
            <el-option
              v-for='item in treeListCopy'
              :key='item.id'
              :label='item.text'
              :value='item.id'>
              <span style="float: left">{{ item.text }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-arrow" @click="changeCity">
          <img src="../../../assets/arrow.svg" alt="" height="32px">
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='params.ato' @focus="clearTreeListCopy" :filter-method="dataFilter1" filterable clearable placeholder='到达城市名称' title="到达城市名称" size='medium'>
            <el-option
              v-for='item in treeListCopy1'
              :key='item.id'
              :label='item.text'
              :value='item.id'>
              <span style="float: left">{{ item.text }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='params.channel' clearable placeholder='渠道类型' title="渠道类型" size='medium' style='width: 180px'>
            <!--<el-option value="" label="全部"></el-option>-->
            <el-option
              v-for='item in channelList'
              :key='item.chalId'
              :label='item.chalName'
              :value='item.chalCode'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="params.validity" clearable  placeholder="启用/禁用" title="启用/禁用">
          <!--<el-option label="全部" value=""></el-option>-->
          <el-option label="禁用" value="1"></el-option>
          <el-option label="启用" value="0"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='params.forCity' clearable placeholder='城市用于' title="城市用于" size='medium' style='width: 180px'>
            <!--<el-option value="" label="全部"></el-option>-->
            <el-option value="0" label="机票查询"></el-option>
            <el-option value="1" label="航班动态"></el-option>
            <el-option value="2" label="积分补登"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="params.shareCode" clearable  placeholder="是否共享航班" title="是否共享航班">
            <!--<el-option label="全部" value=""></el-option>-->
            <el-option label="是" value="true"></el-option>
            <el-option label="否" value="false"></el-option>
            <el-option label="混合共享" value="mixin"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="initrefer">重置</el-button>
        </div>
      </div>
      <div class="search-container clearfix">
        <div class="search-item">
          <el-button size="medium" type="success" :disabled="total === 0" @click="excal">导出</el-button>
          <el-button size="medium" :disabled='dataArr.length !== 1' @click="szChannel">修改所属渠道</el-button>
          <el-button size="medium" @click="rescive(null)">添加</el-button>
          <el-button size="medium" type= 'danger' :disabled='dataArr.length === 0' @click="del(null)">批量删除</el-button>
        </div>
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
          <el-table-column label="航线" prop="id" min-width="100"></el-table-column>
          <el-table-column label="出发城市代码" prop="afromcode" min-width="120"></el-table-column>
          <el-table-column label="出发城市名称" prop="afromname" min-width="120"></el-table-column>
          <el-table-column label="到达城市代码" prop="atocode" min-width="120"></el-table-column>
          <el-table-column label="到达城市名称" prop="atoname" min-width="120"></el-table-column>
          <el-table-column label="渠道编号" prop="channel" min-width="160">
            <template slot-scope="scope">
              {{scope.row.channel | channelMap}}
            </template>
          </el-table-column>
          <el-table-column label="积分补登" prop="isRetro" min-width="100">
            <template slot-scope="scope">
              {{scope.row.isRetro | fancity}}
            </template>
          </el-table-column>
          <el-table-column label="机票查询" prop="forTicket" min-width="100">
            <template slot-scope="scope">
              {{scope.row.forTicket | fancity}}
            </template>
          </el-table-column>
          <el-table-column label="航班动态"  prop="forFlight" min-width="100">
            <template slot-scope="scope">
              {{scope.row.forFlight | fancity}}
            </template>
          </el-table-column>
          <el-table-column label="是否共享航班"  min-width="120">
            <template slot-scope="scope">
              <span></span>
              <span v-if="scope.row.shareCode === 'true'">是</span>
              <span v-if="scope.row.shareCode === 'false'">否</span>
              <span v-if="scope.row.shareCode === 'mixin'">混合共享</span>
            </template>
          </el-table-column>
          <el-table-column label='操作'  align='left' width="120" fixed="right">
            <template slot-scope='scope'>
              <span class="active-text mr-5" @click='handledit({ ids: scope.row.id, validity: scope.row.validity })' v-if="scope.row.validity === '0'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handledit({ ids: scope.row.id, validity: scope.row.validity })' v-if="scope.row.validity === '1'" title="禁用">启用</span>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogAdd" width="840px" top="15vh" style="overflow: hidden">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">航空公司名称</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.airways" title="航空公司名称" placeholder="航空公司名称">
                  <el-option label="河北航空" value="NS"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label required">出发城市名称</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.afrom' clearable filterable placeholder='出发城市名称' title="必填项" size='medium'>
                  <el-option
                    v-for='item in treeList'
                    :key='item.id'
                    :label='item.text'
                    :value='item.id'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flag && !msg.afrom">出发城市名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">到达城市名称</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.ato' clearable filterable placeholder='到达城市名称' title="必填项" size='medium'>
                  <el-option
                    v-for='item in treeList'
                    :key='item.id'
                    :label='item.text'
                    :value='item.id'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flag && !msg.ato">到达城市名称不可为空</div>
              </div>
            </div>
          </div>
          <!--第二排-->
          <div class="row">
            <div class="column">
              <div class="label required">渠道设置</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.channel' clearable placeholder='渠道类型' title="渠道类型" multiple size='medium' collapse-tags>
                  <el-option
                    v-for='item in channelList'
                    :key='item.chalId'
                    :label='item.chalName'
                    :value='item.chalCode'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flag && msg.channel.length === 0">渠道类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">启用/禁用</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.validity"  placeholder="启用/禁用" title="启用/禁用">
                  <el-option label="禁用" value="1"></el-option>
                  <el-option label="启用" value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">积分补登</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.isRetro"  placeholder="积分补登" title="积分补登">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--第三排-->
          <div class="row">
            <div class="column">
              <div class="label">机票查询</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.forTicket"  placeholder="机票查询" title="机票查询">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">航班动态</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.forFlight"  placeholder="航班动态" title="航班动态">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">是否共享航班</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="msg.shareCode"  placeholder="是否共享航班" title="是否共享航班">
                  <el-option label="是" value="true"></el-option>
                  <el-option label="否" value="false"></el-option>
                  <el-option label="混合共享" value="mixin"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="refer">提交</el-button>
          <el-button size="medium" v-if="ref === 'add'" @click="reset">重置</el-button>
          <el-button size="medium" @click="back" plain>返回</el-button>
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
                <div class="warning-info" v-if="flag && msg.channel.length === 0">渠道类型不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" icon='el-icon-check' type="primary" @click="canRefer">提交</el-button>
          <el-button size="medium" plain icon='el-icon-back' @click="chenBack">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as types from './api'
import { getChannelList, excelList, getRouteName } from '../../../utils/index'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'AirlinePre',
  data () {
    return {
      params: {
        afrom: '',
        ato: '',
        channel: '',
        validity: '',
        forCity: '',
        shareCode: '',
        page: 1,
        rows: 10
      },
      dataArr: [],
      priceList: [],
      dataViewHeight: null,
      msg: {
        airways: 'NS', //  航空公司名称
        afrom: '', //  出发城市名称
        ato: '', //  到达城市名称
        channel: ['app'], //  渠道设置
        validity: '1', //  启用/禁用
        isRetro: '1', //  积分补登
        forTicket: '1', //  机票查询
        forFlight: '1', //  航班动态
        shareCode: 'false' //  共享航班
      },
      dialogAdd: false,
      dialogTitle: '',
      flag: false,
      ref: '',
      dialogCennel: '设置渠道',
      dialogchen: false,
      total: null,
      tFlag: true,
      loading: false,
      treeList: [],
      treeListCopy: [],
      treeListCopy1: []
    }
  },
  created () {
    this.getTreelist()
    this.judgeChannelList()
    this.params.rows = this.pagination.pageSize
    this.initData()
  },
  mixins: [computWidth],
  methods: {
    dataFilter (val) {
      if (val) {
        this.treeListCopy = this.treeList.filter(item => {
          if (!!~item.text.indexOf(val) || !!~item.id.indexOf(val.toUpperCase())) {
            return true
          }
        })
      } else {
        this.treeListCopy = this.treeList
      }
    },
    dataFilter1 (val) {
      if (val) {
        this.treeListCopy1 = this.treeList.filter(item => {
          if (!!~item.text.indexOf(val) || !!~item.id.indexOf(val.toUpperCase())) {
            return true
          }
        })
      } else {
        this.treeListCopy1 = this.treeList
      }
    },
    clearTreeListCopy () {
      this.treeListCopy = JSON.parse(JSON.stringify(this.treeList))
      this.treeListCopy1 = JSON.parse(JSON.stringify(this.treeList))
    },
    initList () {
      this.params.page = 1
      this.initData()
    },
    clickRow (row) {
      if (this.tFlag) this.$refs.refTable.toggleRowSelection(row)
      this.tFlag = true
    },
    handleSizeChange (row) {
      this.params.rows = row
      this.initData()
    },
    handleCurrentChange (pages) {
      this.params.page = pages
      this.initData()
    },
    //  城市
    getTreelist () {
      types.queryAirCitiesTree().then(res => {
        this.treeList = res.treeList
        this.treeListCopy = res.treeList
        this.treeListCopy1 = res.treeList
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    changeCity () {
      let afrom = this.params.afrom
      let ato = this.params.ato
      if (this.params.afrom || this.params.ato) {
        this.params.afrom = ato
        this.params.ato = afrom
      }
    },
    // 初始化表格
    initData () {
      this.loading = true
      types.queryAirlineList(this.params).then(res => {
        this.total = res.total
        this.priceList = res.rows
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    //  查询
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
    //  导出
    excal () {
      let data = JSON.parse(JSON.stringify(this.params))
      let url = 'cityAirport/ExportAirline'
      let name = getRouteName('/airlinePre')
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
    //  修改所属渠道
    szChannel () {
      this.dialogchen = true
      this.msg.channel = this.dataArr[this.dataArr.length - 1].channel.split(',')
    },
    chenBack () {
      this.dialogchen = false
    },
    canRefer () {
      this.flag = true
      if (this.msg.channel.length === 0) {
        return false
      }
      let obj = {}
      obj['ids'] = this.dataArr[this.dataArr.length - 1].id
      obj['channel'] = this.msg.channel.join(',')
      types.modifyAirlineChannel(obj).then(res => {
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
    //  添加
    rescive (param) {
      this.dialogAdd = true
      this.tFlag = false
      if (param && param !== null) {
        //  修改
        this.ref = ''
        this.dialogTitle = '修改'
        let msg = JSON.parse(JSON.stringify(param))
        this.msg = Object.assign(this.msg, msg)
        for (let item of this.treeList) {
          if (item.text === msg.afromname) {
            this.msg.afrom = item.id
          }
          if (item.text === msg.atoname) {
            this.msg.ato = item.id
          }
        }
        this.msg.channel = msg.channel.split(',')
        this.msg.airCityId = param.id
      } else {
        //  添加
        this.tFlag = true
        this.ref = 'add'
        this.dialogTitle = '添加'
        this.init()
      }
    },
    init () {
      this.msg = {
        airways: 'NS', //  航空公司名称
        afrom: '', //  出发城市名称
        ato: '', //  到达城市名称
        channel: ['app'], //  渠道设置
        validity: '0', //  启用/禁用
        isRetro: '1', //  积分补登
        forTicket: '1', //  机票查询
        forFlight: '1', //  航班动态
        shareCode: 'false' //  共享航班
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
        types.deleteAirline(obj).then((res) => {
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
    //  表格
    handleSelectionChange (list) {
      this.dataArr = list
    },
    handledit (data = {}) {
      let mag = ''
      this.tFlag = false
      if (data.validity === '1') {
        data.validity = '0'
        mag = '是否确认启用'
      } else {
        data.validity = '1'
        mag = '是否确认禁用'
      }
      this.$confirm(mag, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        types.validityAirline(data).then(res => {
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
    //  弹框提交
    refer () {
      this.flag = true
      if (this.msg.afrom === '' || this.msg.ato === '' || this.msg.channel.length === 0) {
        return false
      }
      let obj = JSON.parse(JSON.stringify(this.msg))
      obj.channel = obj.channel.join(',')
      if (this.ref === 'add') {
        //  添加提交
        types.addAirline(obj).then(res => {
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
        //  修改
        types.updateAirline(obj).then(res => {
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
    //  弹框重置
    reset () {
      this.init()
    },
    //  弹框返回
    back () {
      this.dialogAdd = false
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList //  渠道
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
