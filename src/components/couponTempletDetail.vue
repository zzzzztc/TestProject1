<template>
  <!--<div>优惠券模板详情</div>-->
  <el-dialog v-dialogDrag title="优惠券模板详情" :visible.sync="dialogVisibleDetail" width="1060px">
    <div class="dialog-container">
      <div class="dialog-main">
        <el-table
          :data="templetDetailList"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="模板编号" prop="templetCode" min-width="100"></el-table-column>
          <el-table-column label="模板名称" prop="templetName" min-width="120"></el-table-column>
          <el-table-column label="优惠券金额" prop="price" min-width="100"></el-table-column>
          <el-table-column label="总数量" prop="total" min-width="100"></el-table-column>
          <el-table-column label="优惠券类别" prop="couponType" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.couponType && scope.row.couponType !== 'null'">
                  {{scope.row.couponType | couponTypeMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="国际/国内" prop="isInter" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.isInter && scope.row.isInter !== 'null'">
                  {{scope.row.isInter | isInterMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="限制条件" prop="condition" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.condition && scope.row.condition !== 'null'">
                  {{scope.row.condition | conditionMap}}
                </span>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="templetDetailList"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="航班日期开始" prop="startFdate" min-width="100"></el-table-column>
          <el-table-column label="航班日期结束" prop="endFdate" min-width="100"></el-table-column>
          <el-table-column label="取消返券" prop="isReturn" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.isReturn && scope.row.isReturn !== 'null'">
                  {{scope.row.isReturn | isReturnMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" prop="templetStatus" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.templetStatus === '0'">禁用</span>
              <span v-if="scope.row.templetStatus === '1'">启用</span>
            </template>
          </el-table-column>
          <el-table-column label="是否实名认证" prop="authCheck" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.authCheck && scope.row.authCheck !== 'null'">
                  {{scope.row.authCheck | authCheckMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="排除航班日期范围" prop="fdateDisable" min-width="120"></el-table-column>
        </el-table>
        <el-table
          :data="templetDetailList"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="起飞地" prop="afrom" min-width="100"></el-table-column>
          <el-table-column label="到达地" prop="ato" min-width="100"></el-table-column>
          <el-table-column label="航班号" prop="fnumber" min-width="100"></el-table-column>
          <el-table-column label="天数" prop="validityDay" min-width="100"></el-table-column>
          <el-table-column label="排除航班号" prop="fnumberDisable" min-width="120"></el-table-column>
          <el-table-column label="票价上限" prop="highestPrice" min-width="100"></el-table-column>
          <el-table-column label="票价下限" prop="lowestPrice" min-width="100"></el-table-column>
        </el-table>
        <el-table
          :data="templetDetailList"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="舱位" prop="cabin" min-width="100"></el-table-column>
          <el-table-column label="排除舱位" prop="cabinDisable" min-width="100"></el-table-column>
          <el-table-column label="有效期类型" prop="validityType" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.validityType && scope.row.validityType !== 'null'">
                  {{scope.row.validityType | validityTypeMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="有效日期起" prop="validityStart" min-width="100"></el-table-column>
          <el-table-column label="有效日期止" prop="validityEnd" min-width="100"></el-table-column>
          <el-table-column label="排除有效日期段" prop="validityDisable" min-width="120"></el-table-column>
        </el-table>
        <el-table
          :data="templetDetailList"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="优惠类型" prop="sailType" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.sailType && scope.row.sailType !== 'null'">
                  {{scope.row.sailType | sailTypeMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="是否支持共享航班" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.shareFlag === '1'">支持</div>
              <div v-else-if="scope.row.shareFlag === '0'">不支持</div>
            </template>
          </el-table-column>
          <el-table-column label="已发放数量" prop="successNum" min-width="100"></el-table-column>
          <el-table-column label="支付方式限制" prop="payMethod" min-width="120">
            <template slot-scope="scope">
                <span v-if="scope.row.payMethod && scope.row.payMethod !== 'null'">
                  {{scope.row.payMethod | payLimitMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="支付时限" prop="payLimit" min-width="100"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" min-width="120"></el-table-column>
          <el-table-column label="创建人姓名" prop="createOpName" min-width="120"></el-table-column>
        </el-table>
      </div>
      <div class="dialog-footer">
        <div class="box"></div>
        <el-button size="medium" @click="dialogVisibleDetail = false">返回</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { queryMetCouponTempletById } from './api'

export default {
  name: 'couponTempletDetail',
  data () {
    return {
      dialogVisibleDetail: false, // 模板详情弹出框 -- 显示隐藏
      templetDetailList: [] // 模板详情弹出框 -- 数据表单
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
      this.dialogVisibleDetail = true
      queryMetCouponTempletById({ templetId: id }).then(res => {
        list.push(res.obj)
        this.templetDetailList = list
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
