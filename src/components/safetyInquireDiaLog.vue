<template>
  <!--<div>安全查询弹出框</div>-->
  <el-dialog title="安全查询" :visible.sync="dialogSafety" width="600px">
    <div class="dialog-container">
      <div class="dialog-main">
        <div class="row" v-if="safetyList.memberType && safetyList.memberType === '1'">
          <span class="form-label">常旅客卡号</span>
          <span class="form-value">{{safetyList.ffpCardNo}}</span>
        </div>
        <div class="row">
          <span class="form-label">手机号</span>
          <span class="form-value">{{safetyList.mobile}}</span>
        </div>
        <div class="row">
          <span class="form-label">邮箱</span>
          <span class="form-value" v-if="safetyList.email != 'null'">{{safetyList.email}}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { getCredentialsByMemId } from './api'

export default {
  name: 'safetyInquireDiaLog',
  data () {
    return {
      dialogSafety: false, // 安全查询弹出框 -- 显示隐藏
      safetyList: {} // 安全查询弹出框 -- 数据表单
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
    initComponent (data) {
      this.dialogSafety = true
      getCredentialsByMemId({ memId: data.memId }).then(res => {
        if (res.obj) {
          this.safetyList = res.obj
          this.safetyList.memberType = data.memberType
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
