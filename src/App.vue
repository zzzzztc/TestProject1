<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
  #app {
    height: 100%;
    font-family: "Microsoft YaHei UI";
  }
  body .el-table th.gutter{
    display: table-cell!important;
  }

  body .el-table colgroup.gutter {
    display: table-cell !important;
  }
</style>
