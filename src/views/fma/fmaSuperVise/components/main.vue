<template>
  <div class="main">
    <div class="table-container">
      <el-table
        :height="dataViewHeight"
        :border="tableAttributes.border"
        :stripe="tableAttributes.stripe"
        :cell-style="tableAttributes.cellStyle"
        v-loading="loading"
        :data="list">
        <el-table-column label="工号" prop="spvStaffNo"></el-table-column>
        <el-table-column label="姓名" prop="bndName"></el-table-column>
        <el-table-column label="手机号" prop="bndMobileNo"></el-table-column>
        <el-table-column label="部门" prop="bndStaffDept"></el-table-column>
        <el-table-column label="督办原因" prop="spvReason"></el-table-column>
        <el-table-column label="解决方案" prop="spvSolution"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div>{{ scope.row.spvStatus | statusMap }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="spvCreatedTime"></el-table-column>
        <el-table-column label="修改时间" prop="spvUpdatedTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="active-text mr-5" @click="updateStatus(1, scope.row.spvId, 1)" v-if="scope.row.spvStatus === '0'">解除督办</span>
            <span class="active-text mr-5" @click="updateStatus(0, scope.row.spvId, 2)" v-if="scope.row.spvStatus === '0'">放弃督办</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { updateFmaSpvStatus } from '../api.js'

export default {
  props: {
    dataViewHeight: {
      type: [Number, Object]
    },
    loading: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => ([])
    }
  },
  filters: {
    statusMap (status) {
      return ['待督办', '解除督办', '放弃督办'][status]
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes
    })
  },
  methods: {
    // 解除督办，放弃督办
    updateStatus (type, id, status) {
      let message
      if (type) {
        message = '是否确认解除督办？'
      } else {
        message = '是否确认放弃督办？'
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          updateFmaSpvStatus({ id, status })
            .then(() => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$emit('updateList')
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {
          this.$message.info('操作取消')
        })
    }
  }
}
</script>

<style scoped>

</style>
