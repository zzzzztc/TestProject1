<template>
  <div class="container">
    <el-table
      :data="knowledge.rows"
      :border="tableAttributes.border"
      :stripe="tableAttributes.stripe"
      :cell="tableAttributes.cellStyle">
      <el-table-column label="内容" prop="knowContent"></el-table-column>
      <el-table-column label="创建日期" prop="createDate"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span class="active-text inl-block mr-5" v-if="currentItem !== scope.row.knowContent" @click="choiceKnow(scope.row.knowContent)">选中</span>
          <span class="inl-block mr-5" v-if="currentItem === scope.row.knowContent">已选中</span>
          <span class="inl-block mr-5 warning-info pointer" @click="handleConfirm(scope.row.knowId)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="filter.page"
      :page-sizes="pagination.pageSizes"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="knowledge.total">
     </el-pagination>
  </div>
</template>

<script>
import { queryKnowledgeList, deleteKnowledge } from './api'
import { mapState } from 'vuex'

export default {
  name: 'knowList',
  data () {
    return {
      filter: {},
      knowledge: {},
      currentItem: ''
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  created () {
    this.getKnowledgeList(1, this.pagination.pageSize)
  },
  methods: {
    // 获取知识库数据
    getKnowledgeList (page, pageSize) {
      if (page) this.filter.page = page
      if (pageSize) this.filter.rows = pageSize
      queryKnowledgeList({}).then(res => {
        this.knowledge = res
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 选中
    choiceKnow (param) {
      this.currentItem = param
      this.$emit('bindMessage', this.currentItem)
    },
    // 删除知识库条码
    handleConfirm (id) {
      this.$confirm('是否确认删除 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDeleteKnow(id)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 删除
    handleDeleteKnow (id) {
      deleteKnowledge({ metid: id }).then(() => {
        this.$message.success('删除成功')
        this.getKnowledgeList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 分页
    handleSizeChange (pages) {
      this.getKnowledgeList(null, pages)
    },
    handleCurrentChange (page) {
      this.getKnowledgeList(page, null)
    }
  }
}
</script>

<style scoped>

</style>
