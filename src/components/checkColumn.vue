<template>
  <div v-if="isColumn">
    <div class="search-container clearfix flex">
      <div class="check-ipt">
        <el-checkbox @change="checkHanler" v-model="checkedAll" :indeterminate="isIndeterminate">全选</el-checkbox>
      </div>
      <div>
        <div class="check-item check-ipt" v-for="item in checkList" :key="item.key">
          <el-checkbox-group v-model="checked" @change="handleCheck">
            <el-checkbox  :label="item.key" :key="item.key" @change="handleoneCheck(item.key)">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDynamicTableCulmae } from '../utils/index'

export default {
  name: 'checkColumn',
  data () {
    return {
      tableList: this.tableListCopy,
      checkedAll: false,
      checked: [],
      isIndeterminate: false
    }
  },
  props: {
    routeName: {
      type: String,
      default: ''
    },
    isColumn: {
      type: Boolean,
      default: false
    },
    tableListCopy: {
      type: Object,
      default: function () {
        return {}
      }
    },
    checkList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  created () {
    // this.locCheck()
  },
  activated () {
    this.locCheck()
  },
  methods: {
    locCheck () {
      //  如果本地有就取本地的
      // console.log(getDynamicTableCulmae(this.routeName))
      if (getDynamicTableCulmae(this.routeName).length) {
        this.checked = getDynamicTableCulmae(this.routeName)
        if (this.checked.length === this.checkList.length) {
          this.checkedAll = true
        }
        for (let item in this.tableList) {
          if (this.checked.indexOf(item) !== -1) {
            this.tableList[item] = true
          } else {
            this.tableList[item] = false
          }
        }
      } else {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].flag) {
            this.checked.push(this.checkList[i].key)
            this.tableList[this.checkList[i].key] = true
          }
        }
      }
    },
    //   动态加载表格
    checkHanler (val) {
      if (val) {
        this.checked = this.checkList.map((item) => {
          return item.key
        })
        for (let item in this.tableList) {
          this.tableList[item] = true
        }
      } else {
        this.checked = []
        for (let item in this.tableList) {
          this.tableList[item] = false
        }
      }
    },
    //  全选框
    handleCheck (value) {
      let checkLength = value.length
      this.checkedAll = checkLength === this.checkList.length
    },
    //  表格checkbox单选框
    handleoneCheck (key) {
      let flag = this.tableList[key]
      this.tableList[key] = flag ? this.tableList[key] = false : this.tableList[key] = true
      this.$emit('updateTableList', this.tableList)
    }
  }
}
</script>

<style scoped>

</style>
