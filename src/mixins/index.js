import { setDynamicTableCulmae, getDynamicTableCulmae, computeTableHeight } from '../utils'

export let checkAttrs = {
  data () {
    return {
      isColumn: true,
      checked: []
    }
  },
  activated () {
    this.locCheck()
  },
  beforeRouteLeave (to, from, next) {
    setDynamicTableCulmae(this.componentName, this.checked)
    next()
  },
  methods: {
    switchColumn () {
      this.isColumn = !this.isColumn
      this.$nextTick(function () {
        this.dataViewHeight = computeTableHeight(this, 'header')
      })
    },
    locCheck () {
      //  如果本地有就取本地的
      if (getDynamicTableCulmae(this.componentName).length) {
        this.checked = getDynamicTableCulmae(this.componentName)
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
      // let flag = this.tableList[key]
      console.log(this.tableList[key])
      this.tableList[key] = !this.tableList[key]
    }
  }
}
