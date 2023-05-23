<template>
  <!--<div>变更日志弹出框</div>-->
  <el-dialog v-dialogDrag title="变更日志" :visible.sync="dialogVisible" width="1060px">
    <div class="dialog-container">
      <div class="dialog-main">
        <el-table :data="reviewList" :border="tableAttributes.border" :stripe="tableAttributes.stripe">
          <el-table-column label="操作人" prop="opname" min-width="100"></el-table-column>
          <el-table-column label="操作时间" prop="createTime" min-width="100"></el-table-column>
          <el-table-column label="操作内容" prop="logContent" min-width="200">
            <template slot-scope="scope">
              <div>
                <div v-for="(item, index) in scope.row.logContent" :key="index">
                  <span v-if="item !== ''">{{item}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { queryUpdateLog } from './api'
export default {
  name: 'ChangeLogDiaLog',
  data () {
    return {
      dialogVisible: false, // 变更日志查询弹出框 -- 显示隐藏
      reviewList: [] // 变更日志查询弹出框 -- 数据表单
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
    initComponent (url, id) {
      let logContent = []
      this.dialogVisible = true
      let params = { id: id }
      queryUpdateLog({
        url: url,
        params: params
      }).then(res => {
        this.reviewList = res.rows
        for (let item of this.reviewList) {
          logContent = item.logContent.split(/[\r\n]/g)
          item.logContent = logContent
        }
        // console.log(this.reviewList)
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
