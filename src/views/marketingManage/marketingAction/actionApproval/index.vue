<template>
  <!--  <h1>活动审批</h1>-->
  <div id="ActionApproval" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="审批编号" v-model="filter.approveCode" @keydown.enter.native="getApprovalList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="活动编号" v-model="filter.activityCode" @keydown.enter.native="getApprovalList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="审批流程编号" v-model="filter.approveOaCode" @keydown.enter.native="getApprovalList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="审批状态" v-model="filter.approveStatus"  @keydown.enter.native="getApprovalList()">
            <el-option label="审核中" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="废弃" value="4"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.createTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="审批创建开始时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.createTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="审批创建结束时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.passTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="审批通过开始时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.passTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="审批通过结束时间">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getApprovalList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
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
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="approvalList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
<!--          <el-table-column type="selection" fixed="left"></el-table-column>-->
          <el-table-column label="审批编号" v-if="tableList.approveCode" prop="approveCode" min-width="120"></el-table-column>
          <el-table-column label="活动编号" v-if="tableList.activityCode" prop="activityCode" min-width="120">
            <template slot-scope="scope">
              <div class="active-text" @click="switchDialog('activity', scope.row.activityId)">{{scope.row.activityCode}}</div>
            </template>
          </el-table-column>
          <el-table-column label="活动名称" v-if="tableList.activityName" prop="activityName" min-width="160"></el-table-column>
          <el-table-column label="审批流程编号" v-if="tableList.approveOaCode" prop="approveOaCode" min-width="120"></el-table-column>
          <el-table-column label="OA审批流程说明" v-if="tableList.approveOaRemark" prop="approveOaRemark" min-width="200"></el-table-column>
          <el-table-column label="审批状态" v-if="tableList.approveStatus" prop="approveType" min-width="100">
<!--            <template slot-scope="scope">-->
<!--                <span v-if="scope.row.approveStatus && scope.row.approveStatus !== 'null'">-->
<!--                  {{scope.row.approveStatus | approveStatusMap}}-->
<!--                </span>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column label="审批创建时间" v-if="tableList.createTime" prop="createTime" min-width="160"></el-table-column>
          <el-table-column label="审批创建人姓名" v-if="tableList.createUser" prop="createUser" min-width="120"></el-table-column>
          <el-table-column label="审批通过时间" v-if="tableList.passTime" prop="passTime" min-width="160"></el-table-column>
          <el-table-column label="审批通过人姓名" v-if="tableList.passUser" prop="passUser" min-width="120"></el-table-column>
          <el-table-column label="操作" min-width="140" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="变更日志" @click="handleApproveLog(scope.row.approveId)">变更日志</span>
<!--              <span class="active-text mr-5" title="审批申请" v-if="scope.row.approveStatus === '0'" @click="handleApprove('apply', scope.row)">申请</span>-->
<!--              <span class="active-text mr-5" title="废弃" v-if="scope.row.approveStatus === '0'" @click="handleApprove('discard', scope.row.approveId)">废弃</span>-->
              <span class="active-text mr-5" title="通过" v-if="scope.row.approveStatus === '1'" @click="handleApprove('pass', scope.row.approveId)">通过</span>
              <span class="active-text mr-5" title="打回" v-if="scope.row.approveStatus === '1'" @click="handleApprove('return', scope.row.approveId)">打回</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="clearfix">
        <div class="fl">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filter.page"
            :page-sizes="pagination.pageSizes"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="approvalList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--审核日志查询弹出框-->
    <ChangeLogDiaLog ref="changeLogAby"></ChangeLogDiaLog>
    <!--营销活动详情弹出框-->
    <ActivityDiaLog ref="ActivityAby"></ActivityDiaLog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ChangeLogDiaLog from '../../../../components/ChangeLogDiaLog'
import ActivityDiaLog from '../../../../components/activityDiaLog'
import { getChannelList } from '../../../../utils/index'
import { querySaleApproveRecord, querySaleApproveStatus } from './api'
import { approveStatusMap } from '../../../../filters/index'
import fieldMap from './refer'
import { checkAttrs } from '../../../../mixins'
import { computWidth } from '../../../../mixins/computWidt'

export default {
  name: 'ActionApproval',
  data () {
    return {
      loading: false,
      filter: {
        approveCode: '', // 审批编号
        activityCode: '', // 活动编号
        approveOaCode: '', // 审批流程编号
        approveStatus: '', // 审批状态
        createTimeStart: '', // 审批创建开始时间
        createTimeEnd: '', // 审批创建结束时间
        passTimeStart: '', // 审批通过开始时间
        passTimeEnd: '', // 审批通过结束时间
        page: '', // 当前页
        rows: '' // 每页查询数量
      },
      approvalList: {},
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      // editVisible: false, // 审批申请弹出框 -- 显示隐藏
      // isEmpty: false, // 审批申请弹出框 -- 判空
      tableList: {
        approveCode: true, // 审批编号
        approveOaCode: true, // 审批流程编号
        approveOaRemark: false, // 审批流程说明
        approveStatus: true, // 审批状态
        createTime: false, // 审批创建时间
        passTime: true, // 审批通过时间
        activityCode: true, // 活动编号
        activityName: true, // 活动名称
        createUser: false, // 审批创建人姓名
        passUser: false // 审批通过人姓名
      },
      applyForm: {}, // 审核申请表单
      componentName: 'actionApproval'
    }
  },
  created () {
    // this.initDate()
    this.getApprovalList(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  components: {
    ChangeLogDiaLog,
    ActivityDiaLog
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },

    // 分页导航
    handleSizeChange (pages) {
      this.getApprovalList(null, pages)
    },
    handleCurrentChange (page) {
      this.getApprovalList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getApprovalList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      querySaleApproveRecord(this.filter).then(res => {
        this.approvalList = res
        for (let item of this.approvalList.rows) {
          item.approveType = approveStatusMap(item.approveStatus)
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },

    // 重置搜索条件
    resetFilter () {
      this.filter = {
        approveCode: '',
        activityCode: '',
        approveOaCode: '',
        approveStatus: '',
        createTimeStart: '',
        createTimeEnd: '',
        passTimeStart: '',
        passTimeEnd: ''
      }
      // this.initDate()
      this.getApprovalList(1, this.pagination.pageSize)
    },

    // 变更日志
    handleApproveLog (id) {
      let url = '/saleApproveRecord/getUpdateLog'
      this.$refs.changeLogAby.initComponent(url, id)
    },

    // 审批申请、废弃、通过、打回
    handleApprove (status, params) {
      // if (status === 'apply') {
      //   // 申请
      //   this.editVisible = true
      //   this.isEmpty = false
      //   this.handleReset()
      //   this.applyForm.approveId = params.approveId
      //   this.applyForm.approveCode = params.approveCode
      //   this.applyForm.approveOaCode = params.approveOaCode
      //   this.applyForm.approveOaRemark = params.approveOaRemark
      // } else
      // if (status === 'discard') {
      //   // 废弃
      //   let title = '是否确认废弃审核?'
      //   let data = {
      //     id: params,
      //     status: '4'
      //   }
      //   this.handleApproveData(title, data)
      // } else
      if (status === 'pass') {
        // 通过
        let title = '是否确认通过审核?'
        let data = {
          id: params,
          status: '2'
        }
        this.handleApproveData(title, data)
      } else if (status === 'return') {
        // 打回
        let title = '是否确认打回草稿?'
        let data = {
          id: params,
          status: '0'
        }
        this.handleApproveData(title, data)
      }
    },

    // // 审核申请弹出框 -- 提交
    // handleSubmit () {
    //   if (this.applyForm.approveOaCode) {
    //     let data = JSON.parse(JSON.stringify(this.applyForm))
    //     querySaleApproveApply(data).then(res => {
    //       this.reviewList = res
    //       this.editVisible = false
    //       this.getApprovalList()
    //       this.$message.success(res.message)
    //     }).catch(err => {
    //       this.$message.error(err)
    //     })
    //   } else {
    //     this.isEmpty = true
    //   }
    // },

    // // 审核申请弹出框 -- 重置
    // handleReset () {
    //   this.applyForm = {
    //     approveCode: '',
    //     approveOaCode: '',
    //     approveOaRemark: ''
    //   }
    //   this.isEmpty = false
    // },

    // 审批状态处理
    handleApproveData (title, data) {
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        querySaleApproveStatus(data).then(res => {
          this.$message.success(res.message)
          this.getApprovalList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },

    // 查看营销活动详情
    switchDialog (status, id) {
      if (status === 'activity') {
        this.$refs.ActivityAby.initComponent(id)
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
