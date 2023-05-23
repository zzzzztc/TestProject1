<template>
  <div>
    <div v-if="!id" class="warn-box">
      请先创建活动
    </div>
    <div v-else>
      <div class="add">
        <el-button size="medium" @click="addRule">添加规则</el-button>
      </div>
      <div v-loading="loading">
        <el-table :data="list.rows" border stripe>
          <el-table-column label="奖励类型" prop="ruleAwdTypeMap"></el-table-column>
          <el-table-column label="奖励金计算方式" prop="ruleAwdAmountCalMap"></el-table-column>
          <el-table-column label="奖励行为" prop="ruleAwdBehaviorMap"></el-table-column>
          <el-table-column label="奖励金额" prop="ruleAwdAmount"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.ruleUseableFalg === '1'">启用</span>
              <span v-else>禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click="updateRuleInfo(scope.row)">修改</span>
              <span class="active-text mr-5" v-if="scope.row.ruleUseableFalg === '0'" @click="updateStatus(scope.row.ruleId, 1)">启用</span>
              <span class="active-text" v-if="scope.row.ruleUseableFalg === '1'" @click="updateStatus(scope.row.ruleId, 0)">禁用</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="list.page"
        :page-sizes="pagination.pageSizes"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.total">></el-pagination>
    </div>
  </div>
</template>

<script>
import { updateMarketAwardRuleStatus } from './api.js'
import { mapState } from 'vuex'
export default {
  name: 'AwardsList',
  props: {
    id: {
      type: String,
      default: null
    },
    list: {
      type: Object,
      default: () => ({ rows: [] })
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    // 新增规则
    addRule () {
      this.$emit('addRule', { isCreate: true })
    },
    // 修改
    updateRuleInfo (param) {
      this.$emit('updateRule', { isCreate: false, rule: param })
    },
    // 启用禁用
    updateStatus (id, status) {
      this.$confirm('是否确认修改状态？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          this.handleUpdateStatus(id, status)
        })
        .catch(() => {
          this.$message.info('操作取消')
        })
    },
    // 启用禁用
    handleUpdateStatus (id, status) {
      this.loading = true
      updateMarketAwardRuleStatus({ ruleId: id, status })
        .then(() => {
          this.loading = false
          this.$emit('updateRuleList')
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 分页
    handleSizeChange (pages) {
      this.$emit('paginaChange', { page: this.list.page, rows: pages })
    },
    handleCurrentChange (page) {
      this.$emit('paginaChange', { page: page, rows: 20 })
    }
  }
}
</script>

<style scoped lang="scss">
.add {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.warn-box {
  font-size: 20px;
  font-weight: bolder;
  padding: 30px 0;
}
.img {
  width: 100px;
  height: 100px;
  cursor: pointer;
}
</style>
