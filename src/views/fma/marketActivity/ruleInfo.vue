<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" width="600px">
      <div class="dialog-container" v-loading="loading">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">奖励类型</div>
              <div class="ipt-medium">
                <el-select size="medium" v-model="ruleInfo.ruleAwdType">
                  <el-option
                    v-for="item in awardsType"
                    :key="item.dincCode"
                    :label="item.dincName"
                    :value="item.dincCode"></el-option>
                </el-select>
                <div class="warning-info" v-show="formErr && !ruleInfo.ruleAwdType">请选择奖励类型</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">奖励金计算方式</div>
              <div class="ipt-medium">
                <el-select size="medium" v-model="ruleInfo.ruleAwdAmountCal">
                  <el-option
                    v-for="item in awardsCal"
                    :key="item.dincCode"
                    :label="item.dincName"
                    :value="item.dincCode"></el-option>
                </el-select>
                <div class="warning-info" v-show="formErr && !ruleInfo.ruleAwdAmountCal">请选择奖励金计算方式</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">奖励行为</div>
              <div class="ipt-medium">
                <!--奖励行为根据活动类型不可更改-->
                <el-select size="medium" v-model="type" :disabled="true">
                  <el-option
                    v-for="item in awardsBeh"
                    :key="item.dincCode"
                    :label="item.dincName"
                    :value="item.dincCode"></el-option>
                </el-select>
<!--                <div class="warning-info" v-show="formErr && !ruleInfo.ruleAwdBehavior">请选择奖励行为</div>-->
              </div>
            </div>
            <div class="column">
              <div class="label required">启用/禁用</div>
              <div class="ipt-medium">
                <el-select size="medium" v-model="ruleInfo.ruleUseableFalg">
                  <el-option value="1" label="启用"></el-option>
                  <el-option value="0" label="禁用"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">奖励金额</div>
              <div class="ipt-medium">
                <el-input size="medium" v-model="ruleInfo.ruleAwdAmount"></el-input>
                <div class="warning-info" v-show="formErr && !ruleInfo.ruleAwdAmount">请填写奖励金额</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button size="medium" type="primary" @click="checkRequestParam">确定</el-button>
          <el-button size="medium" @click="visible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addMarketAwardRule, updateMarketAwardRule } from './api'

export default {
  name: 'RuleInfo',
  props: {
    awardsType: { // 奖励金额
      type: Array,
      default: () => ([])
    },
    awardsCal: { // 奖励金发放方式
      type: Array,
      default: () => ([])
    },
    awardsBeh: { // 奖励行为
      type: Array,
      default: () => ([])
    },
    isCreate: {
      type: [Boolean, Number],
      default: false
    },
    id: {
      type: String
    },
    type: {
      type: String
    }
  },
  data () {
    return {
      loading: false,
      title: '',
      visible: false,
      formErr: false,
      ruleInfo: {
        ruleAwdType: '',
        ruleAwdAmount: '',
        ruleUseableFalg: '1',
        ruleAwdAmountCal: '',
        ruleAwdBehavior: ''
      }
    }
  },
  methods: {
    // 清除数据
    clearRuleInfo () {
      this.formErr = false
      for (let key in this.ruleInfo) {
        this.ruleInfo[key] = ''
      }
      this.ruleInfo.ruleUseableFalg = '1'
      this.title = '新增奖励规则'
    },
    // 参数校验
    checkRequestParam () {
      this.formErr = false
      this.ruleInfo.actyId = this.id
      if (this.ruleInfo.ruleAwdType &&
        this.ruleInfo.ruleAwdAmount &&
        this.ruleInfo.ruleUseableFalg &&
        this.ruleInfo.ruleAwdAmountCal) {
        this.ruleInfo.ruleAwdBehavior = this.type
        this.formErr = false
        // 判断操作类型
        this.checkOperateType()
      } else {
        this.formErr = true
      }
    },
    // 判断新增还是编辑
    checkOperateType () {
      if (this.isCreate) {
        // 新增
        this.createRule()
      } else {
        // 编辑
        this.modifyRule()
      }
    },
    // 新增
    createRule () {
      this.loading = true
      addMarketAwardRule(this.ruleInfo)
        .then(() => {
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.loading = false
          this.updateRuleList()
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 编辑
    modifyRule () {
      this.loading = true
      updateMarketAwardRule(this.ruleInfo)
        .then(() => {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.loading = false
          this.updateRuleList()
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 更新列表
    updateRuleList () {
      this.visible = false
      this.$emit('updateRuleList')
    }
  }
}
</script>

<style scoped>

</style>
