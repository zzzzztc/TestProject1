<template>
  <div>
    <!--地铁详情-->
    <el-dialog v-dialogDrag title="地铁地铁销售详情" :visible.sync="subWayVisible" width="800px">
      <div class="dialog-container" ref="header">
        <div class="dialog-main" style="padding: 0">
          <div class="table-container">
            <el-table
              :cell-style= "tableAttributes.cellStyle"
              :stripe="tableAttributes.stripe"
              :border="tableAttributes.border"
              :data="subWayList"
              v-loading="loading">
              <el-table-column label="地铁航段" min-width="120">
                <template slot-scope="scope">
                  <div>{{scope.row.afrom}}-{{scope.row.ato}}</div>
                </template>
              </el-table-column>
              <el-table-column label="地铁票价" prop="payAmount" min-width="100"></el-table-column>
              <el-table-column label="旅客姓名" prop="pname" min-width="100"></el-table-column>
              <el-table-column label="旅客手机号" prop="checkedMobile" min-width="120"></el-table-column>
              <el-table-column label="地铁票状态" prop="transStatus" min-width="120">
                <template slot-scope="scope">
                  <div>{{ scope.row.transStatus | transStatusMap }}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="120">
                <template slot-scope="scope">
                  <span class="active-text mr-20" v-show="scope.row.transStatus === '001'" @click="handleRefund(scope.row)">退票</span>
                  <span class="active-text mr-20" v-show="scope.row.transStatus === '001'" @click="handleChange(scope.row)">改期</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" @click="subWayVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <!--改期弹出框-->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="350px">
      <div v-loading="loading" class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">活动开始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择改期日期"
                  v-model="editForm.expireDate">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.expireDate">改期日期不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="handleDate">提交</el-button>
          <el-button size="medium" @click="dialogVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { queryAirRailwayTicketByOrderCode, queryAirRailwayTicketRefundApply, queryAirRailwayTicketModifyExpireDate } from './api'
export default {
  name: 'subwayDetailDiaLog',
  data () {
    return {
      isEmpty: false,
      loading: false,
      subWayVisible: false,
      dialogVisible: false,
      dataViewHeight: null,
      activeNamesSubWay: ['detail'],
      subWayList: [],
      editForm: {
        expireDate: '',
        airId: ''
      }
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    initComponent (data) {
      this.subWayVisible = true
      this.getSubWayCode(data)
    },
    getSubWayCode (data) {
      let params = {
        orderType: '1',
        batchOrderNo: data.orderCode
      }
      queryAirRailwayTicketByOrderCode(params).then(res => {
        this.subWayList = res.rows
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 退票
    handleRefund (params) {
      this.$confirm('是否确认退票？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.refund(params)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    refund (params) {
      this.loading = true
      queryAirRailwayTicketRefundApply({ airId: params.airId }).then(() => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '提交申请成功'
        })
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 改期
    handleChange (params) {
      this.editForm = {}
      this.isEmpty = false
      this.dialogVisible = true
      this.editForm.airId = params.airId
    },

    handleDate () {
      if (this.editForm && this.editForm.airId && this.editForm.expireDate) {
        this.loading = true
        queryAirRailwayTicketModifyExpireDate(this.editForm).then(res => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '改期成功'
          })
          this.dialogVisible = false
          this.subWayVisible = false
        }).catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
      } else {
        this.isEmpty = true
      }
    }
  }
}
</script>

<style scoped>

</style>
