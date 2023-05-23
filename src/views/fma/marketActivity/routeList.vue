<template>
  <div>
    <div v-if="!id" class="warn-box">
      请先创建航线推广类型活动
    </div>
    <div v-else>
      <div class="add">
        <el-button size="medium" @click="addRoute">添加航线</el-button>
      </div>
      <div>
        <el-table :data="list.rows" border stripe>
          <el-table-column label="出发地" prop="arlnDeptCityName"></el-table-column>
          <el-table-column label="目的地" prop="arlnArrivalCityName"></el-table-column>
          <el-table-column label="航班开始日期" prop="arlnFltStartDate"></el-table-column>
          <el-table-column label="航班结束日期" prop="arlnFltEndDate"></el-table-column>
          <el-table-column label="最低价" prop="arlnFltLowestPrice"></el-table-column>
          <el-table-column label="缩略图">
            <template slot-scope="scope">
              <img @click="viewPc(scope.row.arlnSmallPicUrl)" class="img" :src="scope.row.arlnSmallPicUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column label="大图">
            <template slot-scope="scope">
              <img @click="viewPc(scope.row.arlnBigPicUrl)" class="img" :src="scope.row.arlnBigPicUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column label="小程序图">
            <template slot-scope="scope">
              <img @click="viewPc(scope.row.arlnMiniPicUrl)" class="img" :src="scope.row.arlnMiniPicUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click="updateAirLine(scope.row)">修改</span>
              <span class="active-text" @click="deleteAirLine(scope.row.arlnId)">删除</span>
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
import { deleteMarketActivityAirline } from './api.js'
import { mapState } from 'vuex'
export default {
  name: 'RouteList',
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
  data () {
    return {
      loading: false,
      filter: {},
      route: {}
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    viewPc (src) {
      if (src) {
        window.open(src)
      }
    },
    // 删除
    deleteAirLine (id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleDelete(id)
        })
        .catch(() => {
          this.$message.info('操作取消')
        })
    },
    // 删除
    handleDelete (id) {
      deleteMarketActivityAirline({ ids: id })
        .then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.updateAriLineList()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 更新推广航线列表
    updateAriLineList () {
      this.$emit('updateAriLineList')
    },
    // 添加航线
    addRoute () {
      this.$emit('addRoute', { isCreate: true })
    },
    // 修改推广航线
    updateAirLine (param) {
      this.$emit('updateRoute', { isCreate: false, route: param })
    },
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
