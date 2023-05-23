import { computeTableHeight } from '../utils/index'
export let computWidth = {
  mounted () {
    let name = this.$options.name
    let width = document.documentElement.clientWidth
    width -= 245
    let dom = document.getElementById(name)
    dom.style.width = width + 'px'
    this.dataViewHeight = computeTableHeight(this, 'header')
  }
}
