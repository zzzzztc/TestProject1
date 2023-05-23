<template>
  <div id="PaymentChannelManager" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="版本号" v-model="filter.version">
            <el-option v-for="(item, index) in versionList" :key="index" :label="item.version" :value="item.version"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道类型" @change="modifyMobileSystem(filter.channel)" v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="系统" clearable v-model="filter.mobileSystem" :disabled="!isApp">
            <el-option label="Android" value="android"></el-option>
            <el-option label="IOS" value="ios"></el-option>
          </el-select>
        </div>
<!--        <div class="search-item search-ipt">-->
<!--          <el-select size="medium" placeholder="是否默认" clearable v-model="filter.defaultFlag">-->
<!--            <el-option label="是" value="1"></el-option>-->
<!--            <el-option label="否" value="0"></el-option>-->
<!--          </el-select>-->
<!--        </div>-->
        <div class="search-item">
          <el-button size="medium" @click="getPayMethodVersionConfigList()" type="primary">查询</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog(null, 1)">添加</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          row-key="configId"
          v-loading="loading"
          :data="payMethodVersionConfigList"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :height="dataViewHeight"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column label="版本号" prop="version"></el-table-column>
          <el-table-column label="渠道">
            <template slot-scope="scope">
              {{scope.row.channel | channelMap}}
            </template>
          </el-table-column>
          <el-table-column label="支付方式" prop="payMethodName">
          </el-table-column>
          <el-table-column label="支付优先级" prop="sort"></el-table-column>
          <el-table-column label="创建时间" prop="createDate"></el-table-column>
          <el-table-column label="是否推荐">
            <template slot-scope="scope">
              <span v-if="scope.row.isRecomend === '1'">推荐</span>
              <span v-if="scope.row.isRecomend === '0'">不推荐</span>
            </template>
          </el-table-column>
          <el-table-column label="是否默认">
            <template slot-scope="scope">
              <span v-if="scope.row.defaultFlag === '1'">是</span>
              <span v-if="scope.row.defaultFlag === '0'">否</span>
            </template>
          </el-table-column>
          <el-table-column label="启用状态">
            <template slot-scope="scope">
              <span v-if="scope.row.configStatus === '0'">启用</span>
              <span v-if="scope.row.configStatus === '1'">禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="系统" prop="mobileSystem"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="inl-block active-text" @click="switchDialog(scope.row, 0)">编辑</span>
              <span class="inl-block danger-text ml-5" @click="switchConfirm(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="dialog">
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
        <div class="dialog-container">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label">版本</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="版本号" v-model="currentConfig.version" :disabled="!isCreate"></el-input>
                </div>
              </div>
              <div class="column">
                <div class="label">渠道</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="渠道类型" :disabled="!isCreate" @change="channelChange(currentConfig.channel)" clearable v-model="currentConfig.channel">
                    <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label">支付方式</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="支付方式" v-model="currentConfig.methodId">
                    <el-option v-for="item in payMethodsListCopy" :key="item.methodId" :label="item.methodName" :value="item.methodId"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="column">
                <div class="label">是否推荐</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="是否推荐" v-model="currentConfig.isRecomend">
                    <el-option label="推荐" value="1"></el-option>
                    <el-option label="不推荐" value="0"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label">状态</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="状态" v-model="currentConfig.configStatus">
                    <el-option label="启用" value="0"></el-option>
                    <el-option label="禁用" value="1"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="column" v-if="currentConfig.channel ==='app'">
                <div class="label">手机系统</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="是否推荐" multiple v-model="mobileSystem">
                    <el-option label="安卓" value="android"></el-option>
                    <el-option label="IOS" value="ios"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="column" v-if="currentConfig.channel !=='app'">
                <div class="label">手机系统</div>
                <div class="ipt-medium">
                  <el-input v-model="currentConfig.channel" size="medium" :disabled="true"></el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">是否默认</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="是否默认" v-model="currentConfig.defaultFlag">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="dialogVisible = false">取消</el-button>
            <el-button size="medium" type="primary" @click="handleModifyPayMethod" v-if="!isCreate">提交</el-button>
            <el-button size="medium" type="primary" @click="handleAddPayMethod" v-if="isCreate">新增</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { getAllVersion, payMethods, queryPayMethodVersionConfigList, deleteConfig, updateConfig, addPayMethodVersionConfig, payMethodVersionConfigSort } from './api'
import { mapState } from 'vuex'
import { getChannelList } from '../../../utils/index'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'PaymentChannelManager',
  data () {
    return {
      loading: false,
      dataViewHeight: null,
      versionList: [],
      payMethodVersionConfigList: [],
      currentConfig: {
        defaultFlag: '0',
        channel: '',
        version: '',
        methodId: '',
        configStatus: '',
        isRecomend: ''
      },
      filter: {
        // defaultFlag: '0',
        version: '',
        channel: 'app'
      },
      payMethodsList: [],
      payMethodsListCopy: [],
      dialogTitle: '',
      dialogVisible: false,
      mobileSystem: [],
      isCreate: false,
      isApp: true
    }
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      channelList: state => state.app.channelList
    })
  },
  mounted () {
    this.rowDrop()
  },
  created () {
    this.judgeChannelList()
    this.getPayMethodList()
  },
  methods: {
    modifyMobileSystem (type) {
      if (type !== 'app') {
        this.filter.mobileSystem = ''
        this.isApp = false
      } else {
        this.isApp = true
      }
    },
    // 不同渠道对应不同的支付方式
    channelChange (type) {
      this.filterPayMethods(type)
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 获取版本号列表
    getVersionList () {
      getAllVersion().then(res => {
        this.versionList = res.rows
        if (this.versionList.length) {
          this.filter.version = res.rows[0].version
          this.getPayMethodVersionConfigList()
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    filterPayMethods (type) {
      let ids = []
      if (type === 'app') {
        for (let i = 0; i < this.payMethodsList.length; i++) {
          if (this.payMethodsList[i].payType === 'JSAPI') {
            ids.push(this.payMethodsList[i].methodId)
          }
        }
      }
      this.payMethodsListCopy = JSON.parse(JSON.stringify(this.payMethodsList))
      for (let i = 0; i < ids.length; i++) {
        for (let j = 0; j < this.payMethodsListCopy.length; j++) {
          if (ids[i] === this.payMethodsListCopy[j].methodId) {
            this.payMethodsListCopy.splice(j, 1)
            j--
          }
        }
      }
    },
    // 获取支付方式列表
    getPayMethodList () {
      payMethods().then(res => {
        this.payMethodsList = res.rows
        this.filterPayMethods('app')
        this.getVersionList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取数据
    getPayMethodVersionConfigList () {
      this.loading = true
      queryPayMethodVersionConfigList(this.filter).then(res => {
        this.loading = false
        this.payMethodVersionConfigList = res.rows
        for (let i = 0; i < this.payMethodVersionConfigList.length; i++) {
          this.payMethodVersionConfigList[i].payMethodName = this.payMethodsMap(this.payMethodVersionConfigList[i].methodId)
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 支付方式映射
    payMethodsMap (payMethodsId) {
      for (let i = 0; i < this.payMethodsList.length; i++) {
        if (payMethodsId === this.payMethodsList[i].methodId) {
          return this.payMethodsList[i].methodName
        }
      }
    },
    // 切换弹框
    switchDialog (params, type) {
      if (type) {
        // 新增
        this.isCreate = true
        this.dialogVisible = true
        this.dialogTitle = '新增'
        this.currentConfig.version = this.filter.version
        this.currentConfig.channel = 'app'
        this.currentConfig.isRecomend = '0'
        this.currentConfig.methodId = this.payMethodsList[0].methodId
        this.currentConfig.configStatus = '1'
        this.currentConfig.defaultFlag = '0'
        this.mobileSystem = ['ios', 'android']
      } else {
        // 编辑
        this.isCreate = false
        this.currentConfig = params
        this.mobileSystem = params.mobileSystem.split(',')
        this.dialogTitle = '编辑'
        this.dialogVisible = true
      }
    },
    // 确认框
    switchConfirm (param) {
      this.currentConfig = param
      let title = '是否确认删除'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.handleDeletePayMethod(this.currentConfig.configId)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 删除支付方式
    handleDeletePayMethod (id) {
      deleteConfig({ ids: id }).then(res => {
        this.$message.success('删除成功')
        this.getPayMethodVersionConfigList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 编 辑
    handleModifyPayMethod () {
      if (!this.currentConfig.defaultFlag) {
        this.$message.error('请选择是否默认')
        return false
      }
      let data = JSON.parse(JSON.stringify(this.currentConfig))
      data.mobileSystem = this.mobileSystem.join(',')
      updateConfig(data).then(res => {
        this.$message.success('修改成功')
        this.getPayMethodVersionConfigList()
        this.dialogVisible = false
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 新增
    handleAddPayMethod () {
      if (!this.currentConfig.defaultFlag) {
        this.$message.error('请选择是否默认')
        return false
      }
      let data = JSON.parse(JSON.stringify(this.currentConfig))
      if (this.currentConfig.channel !== 'app') {
        data.mobileSystem = this.currentConfig.channel
      } else {
        data.mobileSystem = this.mobileSystem.join(',')
      }
      addPayMethodVersionConfig(data).then(res => {
        this.dialogVisible = false
        this.filter.channel = data.channel
        this.filter.version = data.version
        this.$message.success('新增成功')
        this.getVersionList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 行拖拽
    rowDrop () {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.payMethodVersionConfigList.splice(oldIndex, 1)[0]
          _this.payMethodVersionConfigList.splice(newIndex, 0, currRow)
          _this.handlePayMethodVersionConfigSort()
        }
      })
    },
    // 排序
    handlePayMethodVersionConfigSort () {
      let arr = []
      for (let i = 0; i < this.payMethodVersionConfigList.length; i++) {
        let obj = {}
        obj.configId = this.payMethodVersionConfigList[i].configId
        obj.sort = i + 1
        arr.push(obj)
      }
      let data = JSON.stringify(arr)
      let reqData = {
        arr: data,
        isJson: true
      }
      payMethodVersionConfigSort(reqData).then(() => {
        this.$message.success('操作成功')
        this.getPayMethodVersionConfigList()
      }).catch(() => {
        this.$message.error('操作失败')
      })
    }
  }
}
</script>

<style scoped>

</style>
