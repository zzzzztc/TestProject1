<template>
  <div id="RefundfeeRule" class="container">
    <!--<h1>国内退改签规则维护</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
            <el-input v-model="searchForm.cabin" clearable placeholder="舱位" size="medium" @keydown.enter.native="refundfeeRuleList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.startdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.enddate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="截止时间">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            unlink-panels-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="searchForm.changeDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="起始时间"-->
<!--            end-placeholder="截止时间"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="refundfeeRuleList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(null)">添加</el-button>
        <!--<el-button size="medium" type="danger" :disabled="!multipleSelection.length" @click="handleDelete(null)">删除</el-button>-->
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <!--<el-table-column type="selection" width="50" fixed="left"></el-table-column>-->
          <el-table-column label="航空公司" prop="aircode" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.aircode === 'NS'">河北航空</div>
            </template>
          </el-table-column>
          <el-table-column label="支付方式" prop="payMethod" min-width="80">
            <template slot-scope="scope">
              {{scope.row.payMethod | payMethodMap}}
            </template>
          </el-table-column>
          <el-table-column label="免票折扣率" prop="discountRate" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.discountRate === '0'">小于1</div>
              <div v-if="scope.row.discountRate === '1'">等于1</div>
              <div v-if="scope.row.discountRate === ''">--</div>
            </template>
          </el-table-column>
          <el-table-column label="舱位代码" prop="cabin" min-width="80"></el-table-column>
          <el-table-column label="航班开始日期" prop="startFdate" min-width="120"></el-table-column>
          <el-table-column label="航班结束日期" prop="endFdate" min-width="120"></el-table-column>
          <el-table-column label="销售开始日期" prop="startSdate" min-width="120"></el-table-column>
          <el-table-column label="销售结束日期" prop="endSdate" min-width="120"></el-table-column>
          <el-table-column label="退票费计算基数" prop="feeBasic" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.feeBasic === '0'">基础舱位运价</div>
              <div v-if="scope.row.feeBasic === '1'">票面价</div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createDate" min-width="160"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="120">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row.refeeId)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.refeeId)">删除</span>
              <span class="active-text mr-5" title="详情" @click="handleDetail(scope.row.refeeId)">详情</span>
              <!--<i class="table-icon delete-icon" title="删除" @click="handleDelete(scope.row.refeeId)"></i>-->
              <!--<i class="table-icon edit-icon" title="编辑" @click="handleEdit(scope.row.refeeId)"></i>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableList.total">
      </el-pagination>
    </div>
    <!--添加/修改编辑弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="1060px">
      <div class="dialog-container" ref="editForm" :model="editForm">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">舱位代码</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="舱位代码" v-model="editForm.cabin" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.cabin">舱位代码不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">支付方式</div>
              <div class="ipt-medium">
                <el-select size="medium" placeholder="支付方式" v-model="editForm.payMethod">
                  <el-option key="0" label="积分" value="integral"></el-option>
                  <el-option key="1" label="现金" value="cash"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.payMethod">支付方式不可为空</div>
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
                  v-model="editForm.startFdate">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.startFdate">航班开始日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航班结束日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="航班结束日期"
                  v-model="editForm.endFdate">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.endFdate">航班结束日期不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">销售开始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="销售开始日期"
                  v-model="editForm.startSdate">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.startSdate">销售开始日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">销售结束日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="销售结束日期"
                  v-model="editForm.endSdate">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.endSdate">销售结束日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">免票折扣率</div>
              <div class="ipt-medium">
                <el-select size="medium" placeholder="免票折扣率" v-model="editForm.discountRate">
                  <el-option key="0" label="小于1" value="0"></el-option>
                  <el-option key="1" label="等于1" value="1"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label required">退票费计算基数</div>
              <div class="ipt-medium">
                <el-select size="medium" placeholder="退票费计算基数" v-model="editForm.feeBasic">
                  <el-option key="0" label="基础舱位运价" value="0"></el-option>
                  <el-option key="1" label="票面价" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.feeBasic">退票费计算基数不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-container">
          <div class="row pl-20" style="border-bottom: 1px solid #909399">
            <div class="column">
              <div class="label">退改签设置</div>
            </div>
          </div>
          <div class="dialog-main">
            <add-form ref="edit" v-on:updateAddList="getAddListData" :addList="editForm.addList" :isEmpty="isEmpty" :feeBasic="editForm.feeBasic"></add-form>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <!--<el-button size="medium" type="primary" @click="popupSave">{{isReset ? '提交' : '编辑'}}</el-button>-->
          <el-button size="medium" type="primary" @click="popupSave">提交</el-button>
          <el-button size="medium" v-if="isReset" @click="popupReset">重置</el-button>
          <el-button size="medium" @click="editVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <!--详情弹出框-->
    <el-dialog title="详情" :visible.sync="detailVisible" width="650px">
      <div class="dialog-container">
        <div class="rule-main">
          <div class="row rule">
            <div class="title">退票规则</div>
            <div class="content" v-for="(item, index) in detailList.refundRuleDesc" :key="index">
              {{item}}
            </div>
          </div>
          <div class="row rule">
            <div class="title">改期规则</div>
            <div class="content" v-for="(item, index) in detailList.changeRuleDesc" :key="index">
              {{item}}
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AddForm from './addForm'
import { mapState } from 'vuex'
import { queryRefundfeeRuleList, addRefundfeeRule, queryRefundfeeRuleInfo, updateRefundfeeRule, deleteRefundfeeRule, queryRuleText } from './api'
import { getChannelList } from '../../../utils/index'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'RefundfeeRule',
  data () {
    return {
      searchForm: {
        cabin: '', // 舱位
        startdate: '', // 起始时间
        enddate: '' // 截止时间
      }, // 搜索框 -- 数据
      changeDate: [], // 搜索框 -- 日期
      tableList: [], // 表格 -- 数据
      multipleSelection: [], // 表格 -- 选中行数据
      dataViewHeight: null, // 表格 -- 高度
      loading: false, // 表格 -- 数据加载时显示的动效,
      editForm: {
        aircode: 'NS',
        cabin: '', // 舱位代码
        payMethod: 'cash', // 支付方式
        startFdate: '', // 航班开始日期
        endFdate: '', // 航班结束日期
        startSdate: '', // 销售开始日期
        endSdate: '', // 销售结束日期
        discountRate: '', // 免票折扣率
        feeBasic: '', // 退票费计算基数
        addList: [
          {
            lowerLimit: '', // 时限起始
            upperLimit: '', // 时限截止
            changerate: '', // 改期费率
            freeChangeTime: '', // 免费改期次数
            refundrate: '', // 退票费率
            basecabin: '' // 基准舱位
          }
        ]
      }, // 添加/修改弹出框 -- 数据
      popupTitle: '', // 添加/修改弹出框 -- 标题
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: false, // 添加/修改弹出框 -- 切换添加/修改
      isEmpty: false, // 添加/修改弹出框 -- 判空
      detailVisible: false, // 详情弹出框 -- 显示隐藏
      detailList: {} // 详情弹出框 -- 数据
    }
  },
  components: {
    AddForm
  },
  filters: {
    // 支付方式 -- 过滤器
    payMethodMap (payMethod) {
      let payMethodName = ''
      switch (payMethod) {
        case 'integral':
          payMethodName = '积分'
          break
        case 'cash':
          payMethodName = '现金'
          break
        default:
          payMethodName = '--'
      }
      return payMethodName
    }
  },
  created () {
    this.getChannelList()
    this.refundfeeRuleList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      channelList: state => state.app.channelList, // 渠道
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    // 渠道 -- 没有则请求服务器
    getChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 搜索框 -- 重置
    handleReset () {
      this.searchForm = {}
      this.refundfeeRuleList(1, this.pagination.pageSize)
    },
    // 表格 -- 分页导航
    handleSizeChange (pages) {
      this.refundfeeRuleList(null, pages)
    },
    handleCurrentChange (page) {
      this.refundfeeRuleList(page, null)
    },
    // 表格 -- 选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 表格 -- 获取数据
    refundfeeRuleList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      queryRefundfeeRuleList(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 表格 -- 删除
    handleDelete (id) {
      this.$confirm('是否确认修改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteRefundfeeRule({ ids: id }).then(res => {
          this.$message.success(res.message)
          this.refundfeeRuleList(1, this.pagination.pageSize)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 表格 -- 添加/修改弹出框显示
    handleEdit (id) {
      this.editVisible = true
      this.isEmpty = false
      if (id) {
        this.popupTitle = '修改'
        this.isReset = false
        this.editData(id)
      } else {
        this.popupTitle = '添加'
        this.isReset = true
        this.popupReset()
      }
    },
    // 添加/修改弹出框 -- 动态表单数据
    getAddListData (arr) {
      // console.log(arr)
      this.editForm.addList = arr
    },
    // 添加/修改弹出框 -- 复选框数据处理
    containMap (contain) {
      let containName = false
      if (contain === '1') {
        containName = true
      } else {
        containName = false
      }
      return containName
    },
    // 添加/修改弹出框 -- 重置
    popupReset () {
      this.editForm = {
        cabin: '',
        aircode: 'NS',
        payMethod: 'cash',
        startFdate: '',
        endFdate: '',
        startSdate: '',
        endSdate: '',
        discountRate: '',
        feeBasic: '',
        addList: [{
          lowerLimit: '',
          upperLimit: '',
          changerate: '',
          freeChangeTime: '',
          refundrate: '',
          basecabin: ''
        }],
        obj: {}
      }
      this.isEmpty = false
    },
    // 添加/修改弹出框 -- 提交
    popupSave () {
      if (this.editForm.cabin && this.editForm.startFdate && this.editForm.startSdate && this.editForm.endSdate && this.editForm.endFdate && this.editForm.feeBasic) {
        if (this.editForm.addList[0].changerate && this.editForm.addList[0].refundrate) {
          let data = JSON.parse(JSON.stringify(this.editForm))
          for (let i = 0; i < data.addList.length; i++) {
            data['list[' + (i) + '].basecabin'] = data.addList[i].basecabin
            data['list[' + (i) + '].changerate'] = data.addList[i].changerate
            data['list[' + (i) + '].freeChangeTime'] = data.addList[i].freeChangeTime
            data['list[' + (i) + '].lowerLimit'] = data.addList[i].lowerLimit
            data['list[' + (i) + '].refundrate'] = data.addList[i].refundrate
            data['list[' + (i) + '].upperLimit'] = data.addList[i].upperLimit
            if (data.addList[i].lowerContain) {
              data['list[' + (i) + '].lowerContain'] = data.addList[i].lowerContain
            } else {
              delete data.addList[i].lowerContain
            }
            if (data.addList[i].upperContain) {
              data['list[' + (i) + '].upperContain'] = data.addList[i].upperContain
            } else {
              delete data.addList[i].upperContain
            }
          }
          delete data.addList
          if (this.editForm.addList[0].lowerLimit || this.editForm.addList[0].upperLimit) {
            if (this.editForm.feeBasic === '0') {
              if (this.editForm.addList[0].basecabin) {
                if (this.isReset === false) {
                  this.refundfeeRule(data)
                } else {
                  this.addRefundfeeRule(data)
                }
              } else {
                this.isEmpty = true
              }
            } else {
              if (this.isReset === false) {
                this.refundfeeRule(data)
              } else {
                this.addRefundfeeRule(data)
              }
            }
          } else {
            this.isEmpty = true
          }
        }
      } else {
        this.isEmpty = true
      }
    },
    // 修改弹出框 -- 获取数据展示
    editData (id) {
      queryRefundfeeRuleInfo({ refeeId: id }).then(res => {
        let params = res.obj
        this.dataBind(params)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 修改弹出框 -- 数据提交接口
    refundfeeRule (data) {
      updateRefundfeeRule(data).then(res => {
        this.editVisible = false
        this.refundfeeRuleList(1, this.pagination.pageSize)
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 修改弹出框 -- 数据处理
    dataBind (params) {
      this.editForm.addList = []
      this.editForm.refeeId = params.refeeId
      this.editForm.aircode = params.aircode
      this.editForm.cabin = params.cabin
      this.editForm.payMethod = params.payMethod
      this.editForm.startFdate = params.startFdate
      this.editForm.endFdate = params.endFdate
      this.editForm.startSdate = params.startSdate
      this.editForm.endSdate = params.endSdate
      this.editForm.discountRate = params.discountRate
      this.editForm.feeBasic = params.feeBasic
      for (let items of params.list) {
        this.editForm.addList.push({
          lowerLimit: items.lowerLimit,
          lowerContain: this.containMap(items.lowerContain),
          upperLimit: items.upperLimit,
          upperContain: this.containMap(items.upperContain),
          changerate: items.changerate,
          freeChangeTime: items.freeChangeTime,
          refundrate: items.refundrate,
          basecabin: items.basecabin
        })
      }
    },
    // 添加弹出框 -- 提交数据接口
    addRefundfeeRule (data) {
      addRefundfeeRule(data).then(res => {
        this.editVisible = false
        this.refundfeeRuleList(1, this.pagination.pageSize)
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 详情弹出框 -- 显示
    handleDetail (id) {
      this.detailVisible = true
      queryRuleText({ refeeId: id }).then(res => {
        this.detailList = res.obj
        this.detailData()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 详情弹出框 -- 数据处理
    detailData () {
      let changeRuleDesc = this.detailList.changeRuleDesc
      let refundRuleDesc = this.detailList.refundRuleDesc
      if (this.detailList) {
        changeRuleDesc = changeRuleDesc.split('&&').filter(item => item)
        refundRuleDesc = refundRuleDesc.split('&&').filter(item => item)
        this.detailList.changeRuleDesc = changeRuleDesc
        this.detailList.refundRuleDesc = refundRuleDesc
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .rule-main{
    padding: 10px 0 30px;
  }
  .rule{
    padding: 0 50px 20px 50px;
    text-align: center;
  }
</style>
