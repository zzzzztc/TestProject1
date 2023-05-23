<template>
  <div id="CabinName" class="container">
    <!--<h1>舱位名称维护</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input v-model="searchForm.seat" clearable placeholder="舱位" size="medium" @keydown.enter.native="getCabinNameList()"></el-input>
        </div>
        <div class="search-item search-ipt">
            <el-input v-model="searchForm.seatRule" clearable placeholder="舱位规则" size="medium" @keydown.enter.native="getCabinNameList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="searchForm.isinter" placeholder="请选择国内/国际" size="medium">
            <el-option key="0" label="国内" value="0"></el-option>
            <el-option key="1" label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="searchForm.shareCode" placeholder="是否共享航班" size="medium">
            <el-option key="0" label="否" value="0"></el-option>
            <el-option key="1" label="是" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='searchForm.channel' placeholder="请选择渠道" size="medium">
            <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.validBeginDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.validEndDate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="getCabinNameList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(null)">添加</el-button>
        <el-button size="medium" :disabled="!multipleSelection.length" @click="handleEditTime(null)">修改航班日期</el-button>
        <el-button size="medium" type="danger" :disabled="!multipleSelection.length" @click="handleDelete(null)">批量删除</el-button>
      </div>
      <div v-if="isColumn" class="search-container clearfix flex">
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
    <div class="main">
      <div class="column-btn" @click="switchColumn">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="cabinNameList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column v-if="tableList.isinter" label="国内/国际" prop="isinter" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.isinter === '0'">国内</div>
              <div v-if="scope.row.isinter === '1'">国际</div>
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.seat" label="舱位" prop="seat" min-width="80"></el-table-column>
          <el-table-column v-if="tableList.seatLabel" label="舱位标识" prop="seatLabel" min-width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.seatLabel === '0'">关闭</div>
              <div v-if="scope.row.seatLabel === '1'">开启</div>
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.channel" label="渠道编号" prop="channel" min-width="140">
            <template slot-scope="scope">
              <div>{{scope.row.channel | channelMap}}</div>
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.seatRule" label="舱位规则" prop="seatRule" min-width="100"></el-table-column>
          <el-table-column v-if="tableList.baggageAmount" label="行李额" prop="baggageAmount" min-width="80"></el-table-column>
          <el-table-column v-if="tableList.discountRate" label="免票折扣率" prop="discountRate" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.discountRate === '0'">小于1</div>
              <div v-if="scope.row.discountRate === '1'">等于1</div>
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.refundFeeContent" label="退票费内容" prop="refundFeeContent" min-width="100"></el-table-column>
          <el-table-column v-if="tableList.memberBenefits" label="会员权益" prop="memberBenefits" min-width="220"></el-table-column>
          <el-table-column v-if="tableList.seatRemark" label="舱位备注" prop="seatRemark" min-width="220"></el-table-column>
          <el-table-column v-if="tableList.seatTag" label="舱位标签" prop="seatTag" min-width="180"></el-table-column>
          <el-table-column v-if="tableList.shareCode" label="是否共享航班" prop="shareCode" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.shareCode === '0'">否</div>
              <div v-if="scope.row.shareCode === '1'">是</div>
            </template>
          </el-table-column>
          <el-table-column v-if="tableList.createDate" label="创建时间" prop="createDate" min-width="160"></el-table-column>
          <el-table-column v-if="tableList.validBeginDate" label="航班开始日期" prop="validBeginDate" min-width="120"></el-table-column>
          <el-table-column v-if="tableList.validEndDate" label="航班截止日期" prop="validEndDate" min-width="120"></el-table-column>
          <el-table-column label="操作" min-width="220" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="禁用" v-if="scope.row.seatFlag === '0'" @click="handleState(scope.row.seatFlag, scope.row.seatid)">启用</span>
              <span class="active-text mr-5" title="启用" v-if="scope.row.seatFlag === '1'" @click="handleState(scope.row.seatFlag, scope.row.seatid)">禁用</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="active-text mr-5" title="修改航班日期" @click="handleEditTime(scope.row)">修改航班日期</span>
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.seatid)">删除</span>
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
        :total="cabinNameList.total">
      </el-pagination>
    </div>
    <!--编辑弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="820px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">舱位</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="舱位" v-model="editForm.seat" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.seat">舱位不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">国内/国际</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.isinter" placeholder="请选择国内/国际" size="medium">
                  <el-option key="0" label="国内" value="0"></el-option>
                  <el-option key="1" label="国际" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.isinter">国内/国际选择不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">舱位规则</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="舱位规则" v-model="editForm.seatRule" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.seatRule">舱位规则不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">行李额</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="行李额" v-model="editForm.baggageAmount" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.baggageAmount">行李额不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">退票费内容</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="退票费内容" v-model="editForm.refundFeeContent" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.refundFeeContent">退票费内容不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">是否共享航班</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.shareCode" placeholder="是否共享航班" size="medium">
                  <el-option label="否" value="0"></el-option>
                  <el-option label="是" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.shareCode">是否共享航班不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">渠道编号</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.channel" placeholder="请选择渠道编号" multiple size="medium" collapse-tags>
                  <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.channel.length">渠道编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">舱位标识</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.seatLabel" placeholder="请选择舱位标识" size="medium">
                  <el-option key="0" label="关闭" value="0"></el-option>
                  <el-option key="1" label="开启" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.seatLabel">舱位标识选择不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">舱位类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.seatFlag" placeholder="请选择舱位类型" size="medium">
                  <el-option key="0" label="禁用" value="0"></el-option>
                  <el-option key="1" label="启用" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.seatFlag">舱位类型不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">免票折扣率</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.discountRate" placeholder="请选择免票折扣率" size="medium">
                  <el-option key="0" label="小于1" value="0"></el-option>
                  <el-option key="1" label="等于1" value="1"></el-option>
                </el-select>
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
                  v-model="editForm.validBeginDate">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.validBeginDate">航班开始日期不可为空</div>
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
                  v-model="editForm.validEndDate">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.validEndDate">航班截止日期不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">会员权益</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="3" clearable placeholder="会员权益" v-model="editForm.memberBenefits" size="medium"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">舱位备注</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="3" clearable placeholder="舱位备注" v-model="editForm.seatRemark" size="medium"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">舱位标签</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="3" clearable placeholder="舱位标签" v-model="editForm.seatTag" size="medium"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <!--<el-button size="medium" type="primary" @click="saveEdit">{{isReset ? '提交' : '编辑'}}</el-button>-->
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" v-if="isReset" @click="resetEdit">重置</el-button>
          <el-button size="medium" @click="editVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 修改航班日期-->
    <el-dialog title="修改航班日期" :visible.sync="dialogVisible" width="320px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">航班开始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="航班开始日期"
                  v-model="editTimeForm.validBeginDate">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editTimeForm.validBeginDate">航班开始日期不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">航班截止日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="航班截止日期"
                  v-model="editTimeForm.validEndDate">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editTimeForm.validEndDate">航班截止日期不可为空</div>
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
import { queryCabinNameList, addCabinName, updateCabinName, deleteCabinName, updateSeatLabel, batchUpdateCabinName } from './api'
import { getChannelList } from '../../../utils/index'
import filedMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'CabinName',
  data () {
    return {
      componentName: 'cabinName',
      checkList: filedMap,
      checkedAll: false,
      tableList: {
        isinter: true,
        seat: true,
        seatLabel: true,
        channel: true,
        seatRule: true,
        baggageAmount: true,
        discountRate: true,
        validBeginDate: true,
        validEndDate: true,
        refundFeeContent: false,
        memberBenefits: false,
        seatRemark: false,
        seatTag: false,
        shareCode: false,
        createDate: false
      },
      cabinNameList: {},
      isIndeterminate: false,
      searchForm: {
        seat: '', // 舱位
        seatRule: '', // 舱位规则
        isinter: '', // 国际/国内
        shareCode: '', // 是否共享航班
        channel: '', // 渠道类型 下拉框
        validBeginDate: '', // 航班开始日期
        validEndDate: '' // 航班结束日期
      }, // 搜索框数据
      editForm: {
        seat: '', // 舱位
        isinter: '', // 国内/国际
        seatRule: '', // 舱位规则
        baggageAmount: '', // 行李额
        refundFeeContent: '', // 退票费内容
        shareCode: '', // 是否共享航班
        channel: '', // 渠道编号
        seatLabel: '', // 舱位标识
        discountRate: '', // 免票折扣率
        memberBenefits: '', // 会员权益
        seatRemark: '', // 舱位备注
        seatTag: '', // 舱位标签
        seatFlag: '', // 舱位类型
        validBeginDate: '', // 航班开始日期
        validEndDate: '' // 航班结束日期
      }, // 添加/修改数据
      editTimeForm: {
        validBeginDate: '', // 航班开始日期
        validEndDate: '' // 航班结束日期
      },
      multipleSelection: [], // 选中的表单数据
      popupTitle: '', // 弹出框标题
      dataViewHeight: null, // 表格高度
      editVisible: false, // 弹出框显示隐藏
      dialogVisible: false, // 修改航班日期弹出框显示隐藏
      isReset: false, // 切换添加/修改
      isEmpty: false, // 输入框判空
      loading: false // 加载
    }
  },
  created () {
    this.getChannelList()
    this.getCabinNameList(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  computed: {
    ...mapState({
      channelList: state => state.app.channelList, // 渠道
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    // 分页导航
    handleSizeChange (pages) {
      this.getCabinNameList(null, pages)
    },
    handleCurrentChange (page) {
      this.getCabinNameList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // channel没有则请求服务器
    getChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 获取表格数据
    getCabinNameList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      queryCabinNameList(this.searchForm).then(res => {
        this.cabinNameList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 重置
    handleReset () {
      this.searchForm = {}
      this.getCabinNameList(1, this.pagination.pageSize)
    },
    // 添加/修改
    handleEdit (params) {
      this.editVisible = true
      this.isEmpty = false
      if (params) {
        this.popupTitle = '修改'
        this.isReset = false
        this.dataBind(params)
      } else {
        this.popupTitle = '添加'
        this.addEditForm()
        this.isReset = true
      }
    },
    // 弹出框数据 -- 保存
    saveEdit () {
      if (this.editForm.seat && this.editForm.isinter && this.editForm.seatRule && this.editForm.baggageAmount && this.editForm.refundFeeContent && this.editForm.shareCode && this.editForm.channel.length && this.editForm.seatLabel && this.editForm.seatFlag && this.editForm.validEndDate && this.editForm.validBeginDate) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        if (data.channel.length) {
          data.channel = data.channel.join(',')
        }
        if (this.isReset === false) {
          updateCabinName(data).then(res => {
            this.editVisible = false
            this.getCabinNameList(1, this.pagination.pageSize)
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }).catch(err => {
            this.$message({
              message: err.message,
              type: 'danger'
            })
          })
        } else {
          addCabinName(data).then(res => {
            this.editVisible = false
            this.getCabinNameList(1, this.pagination.pageSize)
            this.$message({
              message: res.message,
              type: 'success'
            })
          }).catch(err => {
            this.$message({
              message: err.message,
              type: 'danger'
            })
          })
        }
      } else {
        this.isEmpty = true
      }
    },
    // 弹出框数据 -- 重置
    resetEdit () {
      this.addEditForm()
      this.isEmpty = false
    },
    // 添加弹出框数据清空
    addEditForm () {
      for (let i in this.editForm) {
        this.editForm[i] = ''
      }
      this.editForm.channel = []
    },
    // 删除
    handleDelete (id) {
      let seatids = ''
      if (id) {
        seatids = id
      } else {
        for (let item of this.multipleSelection) {
          seatids += item.seatid + ','
        }
        seatids = seatids.substring(0, seatids.length - 1)
      }
      this.$confirm('是否确认删除 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteCabinName({ seatids: seatids }).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.getCabinNameList(1, this.pagination.pageSize)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 更改禁用/启用 状态
    handleState (status, id) {
      let title = ''
      if (status === '0') {
        title = '是否确认启用?'
      } else {
        title = '是否确认禁用?'
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateSeatLabel({
          seatid: id,
          seatFlag: status === '0' ? '1' : '0'
        }).then(res => {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.getCabinNameList(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message({
            message: err.message,
            type: 'danger'
          })
        })
      }).catch(() => {
        this.$message({
          message: '已取消修改',
          type: 'info'
        })
      })
    },
    // 修改航班日期
    handleEditTime (params) {
      this.dialogVisible = true
      this.isEmpty = false
      if (params) {
        this.isReset = false
        this.editTimeForm.validBeginDate = params.validBeginDate
        this.editTimeForm.validEndDate = params.validEndDate
        this.editTimeForm.ids = params.seatid
      } else {
        this.isReset = true
        this.resetTimeEdit()
      }
    },
    // 修改航班日期弹出框 -- 提交
    handleTime () {
      let params = []
      if (this.editTimeForm.validBeginDate && this.editTimeForm.validEndDate) {
        let data = JSON.parse(JSON.stringify(this.editTimeForm))
        if (this.isReset === true) {
          if (this.multipleSelection.length) {
            for (let item of this.multipleSelection) {
              params.push(item.seatid)
            }
          }
          data.ids = params.join(',')
        }
        batchUpdateCabinName(data).then(res => {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.dialogVisible = false
          this.getCabinNameList(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message({
            message: err.message,
            type: 'danger'
          })
        })
      }
    },
    // 修改航班日期弹出框 -- 重置
    resetTimeEdit () {
      this.editTimeForm = {
        validBeginDate: '',
        validEndDate: ''
      }
    },
    // 数据处理
    dataBind (params) {
      this.editForm.seatid = params.seatid
      this.editForm.seat = params.seat
      this.editForm.isinter = params.isinter
      this.editForm.seatRule = params.seatRule
      this.editForm.baggageAmount = params.baggageAmount
      this.editForm.refundFeeContent = params.refundFeeContent
      this.editForm.shareCode = params.shareCode
      this.editForm.channel = params.channel.split(',')
      this.editForm.seatLabel = params.seatLabel
      this.editForm.discountRate = params.discountRate
      this.editForm.memberBenefits = params.memberBenefits
      this.editForm.seatRemark = params.seatRemark
      this.editForm.seatTag = params.seatTag
      this.editForm.seatFlag = params.seatFlag
      this.editForm.validBeginDate = params.validBeginDate
      this.editForm.validEndDate = params.validEndDate
    }
  }
}
</script>

<style scoped lang="scss">
</style>
