<template>
  <div class="wrapper" v-loading="loading">
    <div class="config">
      <div v-for="(item, index) in configAssort" :key="item.type">
        <div v-if="item.list.length">
          <div class="config-label">
            <el-checkbox v-model="item.checkAll" @change="handleCheckAllChange(index)">{{ item.type | configMap }}</el-checkbox>
          </div>
          <div class="list">
            <el-checkbox-group v-model="item.checked"  @change="handleCheckedCitiesChange(index)">
              <el-checkbox :class="{ routeLine: item.type === 'route'  }" v-for="val in item.list" :key="val.configId" :label="val.configId">{{ val.configContent }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" size="medium" @click="collectData">提交</el-button>
    </div>
  </div>
</template>

<script>
import { queryAllConfigs } from '../configManage/api'
import { fetchConfig, updateRuleConfig } from './api'

export default {
  name: 'config',
  props: {
    ruleId: {
      type: String
    },
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      loading: false,
      allConfig: [],
      curConfig: [],
      configAssort: [
        { type: 'route', list: [], checked: [], checkAll: false },
        { type: 'ex_route', list: [], checked: [], checkAll: false },
        { type: 'fnumber', list: [], checked: [], checkAll: false },
        { type: 'ex_fnumber', list: [], checked: [], checkAll: false },
        { type: 'ex_flightDate', list: [], checked: [], checkAll: false },
        { type: 'ex_saleTime', list: [], checked: [], checkAll: false },
        { type: 'flight_before', list: [], checked: [], checkAll: false }
      ]
    }
  },
  filters: {
    configMap (config) {
      let configMap = ''
      switch (config) {
        case 'route':
          configMap = '航线'
          break
        case 'ex_route':
          configMap = '排除航线'
          break
        case 'fnumber':
          configMap = '航班号'
          break
        case 'ex_fnumber':
          configMap = '排除航班号'
          break
        case 'ex_flightDate':
          configMap = '排除航班日期'
          break
        case 'ex_saleTime':
          configMap = '排除有效期'
          break
        case 'flight_before':
          configMap = '航班起飞前分钟'
          break
      }
      return configMap
    }
  },
  created () {
    this.queryConfigList()
  },
  methods: {
    // 查看配置
    queryConfig () {
      fetchConfig(this.ruleId)
        .then(res => {
          this.curConfig = res.data
          this.judgeChecked()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 获取全部配置
    queryConfigList () {
      queryAllConfigs()
        .then(res => {
          this.allConfig = res.data
          this.queryConfig()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 将全部分类进行分类
    configClassify () {
      this.allConfig.forEach(item => {
        this.configAssort.forEach(val => {
          if (item.configType === val.type) {
            val.list.push(item)
            if (item.isChecked) {
              val.checked.push(item.configId)
            }
          }
        })
      })
      this.configAssort.forEach(item => {
        if (item.list.length && item.list.length === item.checked.length) {
          item.checkAll = true
        }
      })
      // console.log(this.configAssort)
    },
    // 判断是否被选中
    judgeChecked () {
      this.curConfig.forEach(item => {
        this.allConfig.forEach(val => {
          if (item.configId === val.configId) {
            val.isChecked = true
          }
        })
      })
      this.configClassify()
    },
    handleCheckAllChange (index) {
      if (this.configAssort[index].list.length && this.configAssort[index].checked.length === this.configAssort[index].list.length) {
        // 取消选中
        this.configAssort[index].checked = []
        this.configAssort[index].checkAll = false
      } else {
        // 全选
        this.configAssort[index].checked = []
        this.configAssort[index].list.forEach(item => {
          this.configAssort[index].checked.push(item.configId)
        })
        this.configAssort[index].checkAll = true
      }
    },
    handleCheckedCitiesChange (index) {
      if (this.configAssort[index].list.length && this.configAssort[index].checked.length === this.configAssort[index].list.length) {
        this.configAssort[index].checkAll = true
      } else {
        this.configAssort[index].checkAll = false
      }
    },
    collectData () {
      let arr = []
      this.configAssort.forEach(item => {
        item.checked.forEach(val => {
          arr.push({
            configId: val
          })
        })
      })
      this.updateConfig(arr)
    },
    // 更新配置
    updateConfig (arr) {
      this.loading = true
      let data = {
        isJson: true,
        arr: { ruleId: this.ruleId, configs: arr }
      }
      updateRuleConfig(data)
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.loading = false
          this.$emit('update:visible', false)
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    }
  }
}
</script>

<style scoped lang="scss">
  .wrapper {
    padding: 20px;
  }
.config {
  border: 1px solid #dcdfe6;
  border-bottom: none;
  .config-label {
    padding: 10px;
    border-bottom: 1px solid #dcdfe6;
    background-color: #fafafa;
    font-weight: bold;
  }
  .list {
    padding: 10px 0 10px 15px;
    display: flex;
    border-bottom: 1px solid #dcdfe6;
    .item {
      padding: 0 15px;
    }
  }
}
  .footer {
    padding-top: 20px;
    text-align: center;
  }
  .routeLine {
    width: 80px;
  }
</style>
