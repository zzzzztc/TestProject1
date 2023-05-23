<template>
  <div class="container">
    <div class="header" ref="header">
      <slot name="header"></slot>
    </div>
    <div class="main" ref="main">
      <slot name="main"></slot>
    </div>
    <div class="footer" ref="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'listContainerComponent',
  mounted () {
    // console.log(this.$refs.header)
    let hHeight = this.$refs.header.offsetHeight
    // let fHeight = this.$refs.footer.offsetHeight
    this.$refs.main.style.height = document.documentElement.clientHeight - hHeight - 30 + 'px'
    // console.log(hHeight)
  }
}
</script>

<style scoped lang="scss">

</style>
