<template>
  <!--营销活动详情弹出框-->
  <el-dialog v-dialogDrag title="营销活动详情" :visible.sync="dialogVisibleActivity" width="1060px">
    <div class="dialog-container">
      <div class="dialog-main">
        <el-table
          :data="activityDetailList"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="活动编号" prop="activityCode" min-width="100"></el-table-column>
          <el-table-column label="活动名称" prop="activityName" min-width="100"></el-table-column>
          <el-table-column label="活动渠道" prop="channel" min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.channel | channelMap}}</span>
            </template>
          </el-table-column>
          <el-table-column label="活动类型" prop="activityType" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.activityType === '1'">优惠券</span>
              <span v-if="scope.row.activityType === '2'">积分</span>
              <span v-if="scope.row.activityType === '3'">钱包</span>
              <span v-if="scope.row.activityType === '4'">地面服务</span>
            </template>
          </el-table-column>
          <el-table-column label="活动总金额" prop="activityMoney" min-width="100"></el-table-column>

        </el-table>
        <el-table
          :data="activityDetailList"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="活动开始日期" prop="beginDate" min-width="100"></el-table-column>
          <el-table-column label="活动结束日期" prop="endDate" min-width="100"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" min-width="120"></el-table-column>
          <el-table-column label="活动场景" prop="cutPoint" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.cutPoint | dictsByTypeMap}}</span>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" prop="activityStatus" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.activityStatus === '0'">禁用</span>
              <span v-if="scope.row.activityStatus === '1'">启用</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="activityDetailList"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="审批状态" prop="approveStatus" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.approveStatus === '0'">草稿</span>
              <span v-if="scope.row.approveStatus === '1'">审核中</span>
              <span v-if="scope.row.approveStatus === '2'">审核通过</span>
              <span v-if="scope.row.approveStatus === '4'">废弃</span>
            </template>
          </el-table-column>
          <el-table-column label="活动链接" prop="activityUrl" min-width="120"></el-table-column>
          <el-table-column label="活动短链接" prop="activityShortUrl" min-width="120"></el-table-column>
          <el-table-column label="活动描述" prop="activityContent" min-width="140"></el-table-column>
          <el-table-column label="活动备注" prop="remark" min-width="120"></el-table-column>
        </el-table>
      </div>
      <div class="dialog-footer">
        <div class="box"></div>
        <el-button size="medium" @click="dialogVisibleActivity = false">返回</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { querySaleActivityById } from './api'
export default {
  name: 'activityDiaLog',
  data () {
    return {
      dialogVisibleActivity: false, // 变更日志查询弹出框 -- 显示隐藏
      activityDetailList: [] // 变更日志查询弹出框 -- 数据表单
    }
  },
  mounted () {},

  created () {},

  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    initComponent (id) {
      let list = []
      this.dialogVisibleActivity = true
      querySaleActivityById({ activityId: id }).then(res => {
        list.push(res.obj)
        this.activityDetailList = list
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
