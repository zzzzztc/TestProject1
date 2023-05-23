<template>
  <div id="MarketActivity" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt w-180">
          <el-input size="medium" clearable placeholder="活动代码"></el-input>
        </div>
        <div class="search-item search-ipt w-180">
          <el-input size="medium" clearable placeholder="活动名称"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-button type="primary" size="medium" @click="getActivityList()">查询</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" @click="switchDialog(1)">新增</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          :data="activityList.rows"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle"
          :height="dataViewHeight">
          <el-table-column label="活动代码" prop="actyCode"></el-table-column>
          <el-table-column label="活动名称" prop="actyName"></el-table-column>
          <el-table-column label="活动类型" prop="typeMap"></el-table-column>
          <el-table-column label="开始时间" prop="actyBeginTime"></el-table-column>
          <el-table-column label="结束时间" prop="actyFinishTime"></el-table-column>
          <el-table-column label="状态" prop="statusMap"></el-table-column>
          <el-table-column label="创建人" prop="actyCreatedBy"></el-table-column>
          <el-table-column label="创建时间" prop="actyCreatedTime"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click="switchDetail(scope.row)">详情</span>
              <span class="active-text mr-5" @click="switchDialog(0, scope.row)">修改</span>
              <span class="active-text mr-5" @click="switchActyStatus(scope.row)">{{ scope.row.actyStatus === 'disable' ? '启用' : '禁用' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filter.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="activityList.total">></el-pagination>
    </div>
    <!-- 新增编辑-->
    <div>
      <el-dialog :title="title" :visible.sync="visible" :before-close="closeDialog" width="900px">
        <div class="dialog-container">
          <div class="dialog-main">
            <el-tabs v-model="activeTab" type="card" @tab-click="tabsChange">
              <el-tab-pane label="基本信息" name="first">
                <hbh-base-info v-show="!isDetail" ref="baseInfo" :isCreate="isCreate" @updateVisible="updateVisible" @updateList="updateList"></hbh-base-info>
                <hbh-base-detail :activity="currentRow" v-show="isDetail"></hbh-base-detail>
              </el-tab-pane>
              <el-tab-pane label="推广航线" name="second">
                <hbh-route-list
                  @paginaChange="paginaChange"
                  :id="currentRow.actyId"
                  @updateAriLineList="updateAriLineList"
                  @updateRoute="openRouteDialog"
                  @addRoute="openRouteDialog"
                  :list.sync="airLineList"></hbh-route-list>
              </el-tab-pane>
              <el-tab-pane label="奖励规则" name="third">
                <hbh-awards-list
                  :id="currentRow.actyId"
                  @updateRuleList="updateRuleList"
                  @paginaChange="rulePaginaChange"
                  :list.sync="ruleList"
                  @updateRule="openRuleDialog"
                  @addRule="openRuleDialog"></hbh-awards-list>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-dialog>
    </div>
  <!--    新增航线-->
    <hbh-route-info
      ref="routeInfo"
      @updateAriLineList="updateAriLineList"
      :id="currentRow.actyId"
      :isCreate.sync="routeIsCreate"
      :visible.sync="routeVisible"></hbh-route-info>
  <!--    新增奖励规则-->
    <hbh-rule-info
      ref="ruleInfo"
      :awards-type="awardsType"
      :awards-cal="awardsCal"
      :awards-beh="awardsBeh"
      :id="currentRow.actyId"
      :type="currentRow.actyType"
      @updateRuleList="updateRuleList"
      :isCreate.sync="ruleIsCreate"
      :visible.sync="ruleVisible"></hbh-rule-info>
  </div>
</template>

<script>
import { fetchList, querydictsByType, updateActyStatus, getMarketActivityAirlineList, getMarketAwardRuleList } from './api.js'
import { mapState } from 'vuex'
import { computWidth } from '@/mixins/computWidt'
export default {
  name: 'MarketActivity',
  data () {
    return {
      isDetail: false,
      currentRow: {},
      isCreate: false,
      title: '',
      visible: false,
      activeTab: 'first',
      types: [],
      status: [],
      dataViewHeight: null,
      loading: false,
      filter: {},
      activityList: {},
      routeVisible: false,
      routeIsCreate: false,
      airLineList: {},
      ruleVisible: false,
      ruleIsCreate: false,
      awardsType: [], // 奖励金额
      awardsCal: [], // 奖励计算方式
      awardsBeh: [], // 奖励行为
      ruleList: {}
    }
  },
  mixins: [ computWidth ],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  components: {
    HbhBaseInfo: () => import('./baseInfo.vue'),
    HbhBaseDetail: () => import('./baseDetail.vue'),
    HbhRouteList: () => import('./routeList.vue'),
    HbhRouteInfo: () => import('./routeInfo.vue'),
    HbhAwardsList: () => import('./awardsList.vue'),
    HbhRuleInfo: () => import('./ruleInfo.vue')
  },
  created () {
    this.fetchDicts()
  },
  methods: {
    // 跟新推广航线列表
    updateAriLineList () {
      this.queryAirLine(1, 20)
    },
    // 更新奖励规则列表
    updateRuleList () {
      this.queryAwardsList(1, 20)
    },
    // 推广航线分页查询
    paginaChange (param) {
      this.queryAirLine(param.page, param.rows)
    },
    // 奖励规则分页查询
    rulePaginaChange (param) {
      this.queryAwardsList(param.page, param.rows)
    },
    // 查询推广航线列表
    queryAirLine (page, pageSize) {
      if (this.currentRow.actyType === '01') {
        return false
      }
      let filter = {
        actyId: this.currentRow.actyId,
        page: page || 1,
        rows: pageSize
      }
      getMarketActivityAirlineList(filter)
        .then(res => {
          res.page = filter.page
          this.airLineList = res
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 推荐航线新增编辑处理
    openRouteDialog (param) {
      if (this.currentRow.actyType === '01') {
        this.$message.error('会员拉新类型活动不可创建推广航线')
        return false
      }
      this.routeVisible = true
      const node = this.$refs.routeInfo
      this.routeIsCreate = param.isCreate
      node.$data.visible = true
      if (!param.isCreate) {
        // 编辑
        this.airLineDataBind(node, param.route)
      } else {
        // 添加
        this.$nextTick(() => {
          node.clearAirLine()
        })
      }
    },
    // 奖励规则新增编辑处理
    openRuleDialog (param) {
      this.ruleVisible = true
      const node = this.$refs.ruleInfo
      this.ruleIsCreate = param.isCreate
      node.$data.visible = true
      if (!param.isCreate) {
        // 编辑
        this.ruleDataBind(node, param.rule)
      } else {
        // 添加
        this.$nextTick(() => {
          node.clearRuleInfo()
        })
      }
    },
    // 推荐航线数据绑定
    airLineDataBind (node, param) {
      node.$data.airLine.arlnDeptAirportCode = param.arlnDeptAirportCode
      node.$data.airLine.arlnArrivalAirportCode = param.arlnArrivalAirportCode
      node.$data.airLine.arlnFltLowestPrice = param.arlnFltLowestPrice
      node.$data.airLine.arlnFltStartDate = param.arlnFltStartDate
      node.$data.airLine.arlnFltEndDate = param.arlnFltEndDate
      node.$data.airLine.arlnId = param.arlnId
      node.$data.airLine.actyId = param.actyId
      node.$data.imgUrl = param.arlnBigPicUrl
      node.$data.imgUrl1 = param.arlnSmallPicUrl
      node.$data.miniImgUrl = param.arlnMiniPicUrl
      node.$data.title = '编辑航线'
    },
    // 奖励规则数据绑定
    ruleDataBind (node, param) {
      node.$data.ruleInfo.ruleAwdType = param.ruleAwdType
      node.$data.ruleInfo.ruleAwdAmount = param.ruleAwdAmount
      node.$data.ruleInfo.ruleUseableFalg = param.ruleUseableFalg
      node.$data.ruleInfo.ruleAwdAmountCal = param.ruleAwdAmountCal
      node.$data.ruleInfo.ruleAwdBehavior = param.ruleAwdBehavior
      node.$data.title = '编辑奖励规则'
      node.$data.ruleInfo.ruleId = param.ruleId
    },
    // tab切换
    tabsChange (tab, event) {
      if ((tab.name === 'second' || tab.name === 'third') && this.currentRow && !this.currentRow.actyId) {
        this.$message.error('请先创建活动')
        return false
      } else if (tab.name === 'second' && this.currentRow && this.currentRow.actyId) {
        this.queryAirLine(1, 20)
      } else if (tab.name === 'third' && this.currentRow && this.currentRow.actyId) {
        this.queryAwardsList(1, 20)
      }
    },
    // 查看活动详情
    switchDetail (param) {
      this.visible = true
      this.isDetail = true
      this.currentRow = param
    },
    // 关闭弹框
    closeDialog () {
      if (!this.visible) return false
      this.visible = false
      // 重置弹框数据
      this.currentRow = {}
      this.activeTab = 'first'
      this.airLineList = {}
      this.ruleList = {}
    },
    updateVisible () {
      this.visible = !this.visible
    },
    // 活动类型，活动状态字典查询
    async fetchDicts () {
      // 查询活动状态
      await querydictsByType({ type: 'ACTY_STATUS' })
        .then(res => {
          this.status = res.rows
        })
      // 查询活动类型
      await querydictsByType({ type: 'ACTY_TYPE' })
        .then(res => {
          this.types = res.rows
        })
      // 查询奖励类型
      await querydictsByType({ type: 'RULE_AWD_TYPE' })
        .then(res => {
          this.awardsType = res.rows
        })
      // 查询奖励金计算方式
      await querydictsByType({ type: 'RULE_AWD_AMOUNT_CAL' })
        .then(res => {
          this.awardsCal = res.rows
        })
      await querydictsByType({ type: 'RULE_AWD_BEHAVIOR' })
        .then(res => {
          this.awardsBeh = res.rows
        })
      // 查询奖励行为类型
      this.getActivityList(1, this.pagination.pageSize)
    },
    // 更新活动列表
    updateList (row) {
      // this.visible = !this.visible
      this.isDetail = true
      this.currentRow = row
      this.getActivityList(this.filter.page)
    },
    // 查询
    getActivityList (page, pageSize) {
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter)
        .then(res => {
          this.activityListFormat(res)
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 数据转换
    activityListFormat (list) {
      list.rows.map(item => {
        let type = this.types.find(val => {
          return val.dincCode === item.actyType
        })
        let status = this.status.find(val => {
          return val.dincCode === item.actyStatus
        })
        item.typeMap = type.dincName
        item.statusMap = status.dincName
      })
      this.activityList = { ...list }
    },
    // 分页活动
    handleSizeChange (pages) {
      this.getActivityList(null, pages)
    },
    handleCurrentChange (page) {
      this.getActivityList(page, null)
    },
    // 活动新增编辑处理
    switchDialog (type, param) {
      this.currentRow = {}
      this.isDetail = false
      this.visible = !this.visible
      this.activeTab = 'first'
      this.isCreate = type
      if (this.isCreate) {
        // 新增
        this.activeTab = 'first'
        this.title = '新增活动'
        this.airLineList = {}
        this.$nextTick(() => {
          const node = this.$refs.baseInfo
          node.$data.status = null
          node.clearActivity()
        })
      } else {
        // 编辑
        this.title = '修改活动'
        this.currentRow = param
        this.$nextTick(() => {
          this.dataBind(param)
        })
      }
    },
    // 数据绑定
    dataBind (param) {
      const node = this.$refs.baseInfo
      node.$data.activity.actyType = param.actyType
      node.$data.activity.actyCode = param.actyCode
      node.$data.activity.actyName = param.actyName
      node.$data.activity.actyBeginTime = param.actyBeginTime
      node.$data.activity.actyFinishTime = param.actyFinishTime
      node.$data.activity.actyDsp = param.actyDsp
      node.$data.activity.actyAwdDsp = param.actyAwdDsp
      node.$data.activity.actyExpiredRemindDays = param.actyExpiredRemindDays
      node.$data.activity.actyUrl = param.actyUrl
      node.$data.activity.actyId = param.actyId
      node.$data.imgUrl = param.actBigPicUrl
      node.$data.imgUrl1 = param.actSmallPicUrl
      node.$data.status = param.actyStatus
    },
    // 活动启用禁用
    switchActyStatus (param) {
      let status = 'disable'
      if (param.actyStatus === 'disable') {
        status = 'enable'
      } else {
        status = 'disable'
      }
      this.$confirm('是否确认执行此操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          updateActyStatus({ id: param.actyId, status: status })
            .then(() => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.getActivityList(this.filter.page)
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '操作取消'
          })
        })
    },
    // 查询奖励规则列表
    queryAwardsList (page, pageSize) {
      let filter = {
        actyId: this.currentRow.actyId,
        page: page || 1,
        rows: pageSize
      }
      getMarketAwardRuleList(filter)
        .then(res => {
          this.ruleFieldMap(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 奖励规则字段映射
    ruleFieldMap (res) {
      res.rows.forEach(item => {
        const ruleAwdTypeMap = this.awardsType.find(val => {
          return val.dincCode === item.ruleAwdType
        })
        const ruleAwdAmountCalMap = this.awardsCal.find(val => {
          return val.dincCode === item.ruleAwdAmountCal
        })
        const ruleAwdBehaviorMap = this.awardsBeh.find(val => {
          return val.dincCode === item.ruleAwdBehavior
        })
        if (ruleAwdTypeMap) {
          item.ruleAwdTypeMap = ruleAwdTypeMap.dincName
        }
        if (ruleAwdAmountCalMap) {
          item.ruleAwdAmountCalMap = ruleAwdAmountCalMap.dincName
        }
        if (ruleAwdBehaviorMap) {
          item.ruleAwdBehaviorMap = ruleAwdBehaviorMap.dincName
        }
      })
      this.ruleList = res
    }
  }
}
</script>

<style scoped>

</style>
