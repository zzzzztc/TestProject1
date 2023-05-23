<template>
  <div id="PaymentTag" class="container">
    <div class="header" ref="header"></div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="paymentList.rows"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :height="dataViewHeight"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="支付方式" prop="methodName"></el-table-column>
          <el-table-column label="支付类型" prop="payType"></el-table-column>
          <el-table-column label="标签" prop="remark"></el-table-column>
          <el-table-column label="标签生效日期" prop="validStartDate"></el-table-column>
          <el-table-column label="标签失效日期" prop="validEndDate"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="active-text" @click="switchDialog(scope.row)">标签设置</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer"></div>
    <!--弹框-->
    <div>
      <el-dialog title="推荐标签设置" :visible.sync="dialogVisible" width="420px">
        <div class="dialog-container" v-loading="dialogLoading">
          <div class="dialog-main">
            <div class="row">
              <div class="column" style="width: 100%">
                <div class="label">支付方式</div>
                <div class="ipt-medium">
                  <el-input :disabled="true" size="medium" v-model="currentRow.methodName"></el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column" style="width: 100%">
                <div class="label">推荐标签</div>
                <div class="ipt-medium">
                  <el-input type="textarea" size="medium" v-model="remarkInfo.remark"></el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column" style="width: 100%">
                <div class="label required" style="float: left;">标签生效时间</div>
                <div class="ipt-medium">
                  <el-date-picker
                    v-model="remarkInfo.validStartDate"
                    value-format="yyyy-MM-dd HH:mm"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="标签生效时间" class="date-picker f1">
                  </el-date-picker>
                  <div class="warning-info" v-show="formErr && !remarkInfo.validStartDate">请选择标签生效时间</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required" style="float: left;">标签失效时间</div>
                <div class="ipt-medium">
                  <el-date-picker
                    v-model="remarkInfo.validEndDate"
                    value-format="yyyy-MM-dd HH:mm"
                    format="yyyy-MM-dd HH:mm"
                    type="datetime"
                    placeholder="标签失效时间" class="date-picker f1">
                  </el-date-picker>
                  <div class="warning-info" v-show="formErr && !remarkInfo.validEndDate">请选择标签失效时间</div>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="formJudge">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fetchPayments, updatePayMethodRemark } from './api'
import { mapState } from 'vuex'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'PaymentTag',
  data () {
    return {
      loading: false,
      dialogLoading: false,
      filter: {},
      paymentList: {},
      dataViewHeight: null,
      currentRow: {},
      dialogVisible: false,
      remarkInfo: {
        methodId: '',
        validStartDate: '',
        validEndDate: '',
        remark: ''
      },
      formErr: false
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      orderType: state => state.app.orderType
    })
  },
  mixins: [ computWidth ],
  created () {
    this.queryPayments(1, this.pagination.pageSize)
  },
  methods: {
    // 获取支付方式列表
    queryPayments (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchPayments(this.filter).then(res => {
        this.loading = false
        this.paymentList = res
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    switchDialog (row) {
      this.currentRow = row
      this.remarkInfo.methodId = row.methodId
      this.remarkInfo.validStartDate = row.validStartDate
      this.remarkInfo.validEndDate = row.validEndDate
      this.remarkInfo.remark = row.remark
      this.dialogVisible = true
    },
    // 表单校验
    formJudge () {
      if (this.remarkInfo.validStartDate && this.remarkInfo.validEndDate) {
        let sDate = new Date(this.remarkInfo.validStartDate).getTime()
        let eDate = new Date(this.remarkInfo.validEndDate).getTime()
        if ((sDate - eDate) < 0) {
          // 验证通过
          this.updateRemark()
        } else {
          this.$message.error('失效时间应在生效时间之后')
        }
      }
    },
    updateRemark () {
      this.dialogLoading = true
      updatePayMethodRemark(this.remarkInfo).then(res => {
        this.dialogLoading = false
        this.dialogVisible = false
        this.queryPayments()
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      }).catch(err => {
        this.dialogLoading = false
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
