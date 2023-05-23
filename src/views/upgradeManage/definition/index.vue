<template>
  <div id="UpgradProduct" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item w-200 fl">
          <el-input size="medium" clearable placeholder="产品编码" v-model="filter.upgradCode" @keydown.enter.native="getPolicyList()"></el-input>
        </div>
        <div class="search-item w-200 fl">
          <el-input size="medium" clearable placeholder="产品名称" v-model="filter.upgradeName" @keydown.enter.native="getPolicyList()"></el-input>
        </div>
        <div class="search-item w-200 fl">
          <el-select size="medium" v-model="filter.upgradStatus" placeholder="启用/停用">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </div>
        <div class="search-item w-200 fl">
          <el-button size="medium" type="primary" @click="getPolicyList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog(null)">添加</el-button>
        <el-button size="medium" :disabled="!selectionArr.length" type="danger" @click="batchDelete">批量删除</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :cell-style= "tableAttributes.cellStyle"
          :border="tableAttributes.border"
          :height="dataViewHeight"
          :data="upgradProduct.rows"
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div>升舱产品内容说明：{{props.row.upgradContentDesc}}</div>
            </template>
          </el-table-column>
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="upgradCode" label="产品编码" min-width="120"></el-table-column>
          <el-table-column prop="upgradName" label="产品名称" min-width="120"></el-table-column>
          <el-table-column label="渠道编号" prop="channel" min-width="160">
            <template slot-scope="scope">
              <div>{{scope.row.channel | channelMap}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="upgradCabin" label="升舱仓位" min-width="80"></el-table-column>
          <el-table-column prop="upgradContentDesc" label="升舱产品内容说明" min-width="300"></el-table-column>
          <el-table-column prop="upgradRefundDesc" label="升舱产品改签说明" min-width="300"></el-table-column>
          <el-table-column prop="allChannelRefundDesc" label="全渠道退票说明" min-width="300"></el-table-column>
          <el-table-column label="启用状态" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.upgradStatus === '1'">启用</span>
              <span v-else >禁用</span>
            </template>
          </el-table-column>
          <el-table-column prop="upgradRemark" label="备注" min-width="180"></el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <!--<template slot-scope="scope">-->
            <!--<el-button size="medium" type="danger" @click="deleteItem(scope.row.id, scope.$index)">删除</el-button>-->
            <!--<el-button size="medium" @click="switchDialog(scope.row)">修改</el-button>-->
            <!--</template>-->
            <template slot-scope="scope">
              <span class="active-text mr-5" @click='togglePolicyStatus(scope.row.upgradId, scope.row.upgradStatus)' v-if="scope.row.upgradStatus === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" title="禁用" @click='togglePolicyStatus(scope.row.upgradId, scope.row.upgradStatus)' v-if="scope.row.upgradStatus === '0'">启用</span>
              <span class="active-text mr-5" title="编辑" @click="switchDialog(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="deleteItem(scope.row.upgradId)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="filter.page"
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="upgradProduct.total">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogAdd" width="810px">
        <div class="dialog-container">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">产品编码</div>
                <div class="fl ipt-medium">
                  <el-input size="medium" clearable v-model="upgradProductInfo.upgradCode"></el-input>
                  <div class="warning-info" v-if="formErr && !upgradProductInfo.upgradCode">编码不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">产品名称</div>
                <div class="ipt-medium">
                  <el-input size="medium" clearable v-model="upgradProductInfo.upgradName"></el-input>
                  <div class="warning-info" v-if="formErr && !upgradProductInfo.upgradName">名称不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">渠道类型</div>
                <div class="ipt-medium">
                  <el-select v-model="upgradProductInfo.channel" multiple size="medium" collapse-tags>
                    <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
                  </el-select>
                  <div class="warning-info" v-if="formErr && !upgradProductInfo.channel.length">渠道类型不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">升舱舱位</div>
                <div class="ipt-medium">
                  <el-select size="medium" clearable multiple collapse-tags placeholder="升舱舱位" v-model="upgradProductInfo.upgradCabin">
                    <el-option label="W" value="W" ></el-option>
                    <el-option label="D" value="D" ></el-option>
                    <el-option label="J" value="J" ></el-option>
                    <el-option label="C" value="C" ></el-option>
                    <el-option label="I" value="I" ></el-option>
                    <el-option label="F" value="F" ></el-option>
                  </el-select>
                  <div class="warning-info" v-if="formErr && !upgradProductInfo.upgradCabin.length">升舱舱位不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">启用/禁用</div>
                <div class="ipt-medium">
                  <el-select size="medium" v-model="upgradProductInfo.upgradStatus">
                    <el-option label="启用" value="1"></el-option>
                    <el-option label="禁用" value="0"></el-option>
                  </el-select>
                  <div class="warning-info" v-if="formErr && !upgradProductInfo.upgradStatus">启用/禁用不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label">升舱产品内容说明</div>
                <div class="ipt-medium">
                  <el-input type="textarea" clearable size="medium" :rows="4" v-model="upgradProductInfo.upgradContentDesc"></el-input>
                </div>
              </div>
              <div class="column">
                <div class="label">升舱产品退改签说明</div>
                <div class="ipt-medium">
                  <el-input type="textarea" clearable size="medium" :rows="4" v-model="upgradProductInfo.upgradRefundDesc"></el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label fl">全渠道退票说明</div>
                <div class="fl ipt-medium">
                  <el-input type="textarea" clearable size="medium" :rows="4" v-model="upgradProductInfo.allChannelRefundDesc"></el-input>
                </div>
              </div>
              <div class="column">
                <div class="label">备注</div>
                <div class="ipt-medium">
                  <el-input type="textarea" clearable :rows="4" size="medium" v-model="upgradProductInfo.upgradRemark"></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <div class="box"></div>
            <el-button v-if="!isCreate" size="medium" type="primary" @click="modifyItem">提交</el-button>
            <el-button v-if="isCreate" size="medium" type="primary" @click="addItem">提交</el-button>
            <el-button size="medium" v-if="isCreate" @click="resetEdit">重置</el-button>
            <el-button size="medium" @click="dialogAdd = false">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { filterIds, getChannelList } from '../../../utils/index'
import { fetchList, addUpgradProduct, deleteUpgradProduct, updateUpgradProduct, modifyUpgradStatus } from './api'
import { mapState } from 'vuex'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'UpgradProduct',
  data () {
    return {
      upgradProduct: {},
      dataViewHeight: null,
      dialogAdd: false,
      dialogTitle: '',
      formErr: false,
      selectionArr: [],
      filter: {
        page: 1,
        rows: 10
      },
      upgradProductInfo: {},
      isCreate: false,
      loading: false // 加载
    }
  },
  created () {
    this.getChannelList()
    this.getPolicyList(1, this.pagination.pageSize)
  },
  mounted () {
    let hHeight = this.$refs.header.offsetHeight
    this.dataViewHeight = document.documentElement.clientHeight - hHeight - 130
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      channelList: state => state.app.channelList, // 渠道
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    // 获取数据列表
    getPolicyList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.upgradProduct = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // channel没有则请求服务器
    getChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 分页
    handleSizeChange (pages) {
      this.getPolicyList(null, pages)
    },
    handleCurrentChange (page) {
      this.getPolicyList(page, null)
    },
    // 重置功能
    resetFilter () {
      this.filter = {}
      this.getPolicyList(1, this.pagination.pageSize)
    },
    // 删除
    deleteItem (id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteUpgradProduct({ upgradIds: id }).then(res => {
          this.$message.success(res.message)
          this.getPolicyList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 新增
    addItem () {
      if (this.upgradProductInfo.upgradCode && this.upgradProductInfo.upgradName) {
        let data = JSON.parse(JSON.stringify(this.upgradProductInfo))
        if (data.upgradCabin.length) {
          data.upgradCabin = data.upgradCabin.join(',')
        }
        if (data.channel.length) {
          data.channel = data.channel.join(',')
        }
        addUpgradProduct(data).then(res => {
          this.dialogAdd = false
          this.formErr = false
          this.getPolicyList(1, this.pagination.pageSize)
          this.$message.success(res.message)
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        this.formErr = true
      }
    },
    // 弹出框重置
    resetEdit () {
      this.formErr = false
      this.upgradProductInfo = {
        upgradCabin: ['W'],
        channel: ['app'],
        upgradStatus: '1'
      }
    },
    switchDialog (params) {
      this.dialogAdd = true
      this.upgradProductInfo = {
        upgradCabin: ['W'],
        channel: ['app'],
        upgradStatus: '1'
      }
      if (params) {
        // 修改
        this.dialogTitle = '修改'
        let paramList = ['upgradId', 'upgradCode', 'upgradContentDesc', 'allChannelRefundDesc', 'upgradName', 'upgradStatus', 'upgradRefundDesc', 'upgradRemark']
        this.isCreate = false
        for (let i = 0; i < paramList.length; i++) {
          this.$set(this.upgradProductInfo, paramList[i], params[paramList[i]])
        }
        if (params.upgradCabin.length) {
          this.$set(this.upgradProductInfo, 'upgradCabin', params.upgradCabin.split(','))
        } else {
          this.$set(this.upgradProductInfo, 'upgradCabin', [])
        }
        if (params.channel.length) {
          this.$set(this.upgradProductInfo, 'channel', params.channel.split(','))
        } else {
          this.$set(this.upgradProductInfo, 'channel', [])
        }
      } else {
        this.dialogTitle = '添加'
        // 新增
        this.isCreate = true
      }
    },
    // 修改
    modifyItem () {
      if (this.upgradProductInfo.upgradCode && this.upgradProductInfo.upgradName && this.upgradProductInfo.channel.length && this.upgradProductInfo.upgradStatus) {
        let data = JSON.parse(JSON.stringify(this.upgradProductInfo))
        if (data.upgradCabin.length && data.channel.length) {
          data.upgradCabin = data.upgradCabin.join(',')
          data.channel = data.channel.join(',')
        }
        updateUpgradProduct(data).then(res => {
          this.dialogAdd = false
          this.formErr = false
          this.getPolicyList(1, this.pagination.pageSize)
          this.$message.success(res.message)
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        this.formErr = true
      }
    },
    // 切换启用停用状态
    togglePolicyStatus (id, status) {
      let title = ''
      if (status === '0') {
        title = '是否确认启用?'
      } else {
        title = '是否确认禁用?'
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let data = {
          id: id,
          status: status === '0' ? '1' : '0'
        }
        modifyUpgradStatus(data).then(res => {
          this.$message.success(res.message)
          this.getPolicyList(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },
    handleSelectionChange (val) {
      this.selectionArr = val
    },
    // 批量删除
    batchDelete () {
      let ids = filterIds(this.selectionArr, 'upgradId').join(',')
      this.deleteItem(ids)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
