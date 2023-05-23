<template>
  <div>
    <div class="search-container clearfix">
      <div class="search-item search-ipt w-180">
        <el-input size="mini" clearable placeholder="工号" v-model="filter.spvStaffNo"></el-input>
      </div>
      <div class="search-item search-ipt w-180">
        <el-input size="mini" clearable placeholder="姓名" v-model="filter.bndName"></el-input>
      </div>
      <div class="search-item search-ipt w-180">
        <el-input size="mini" clearable placeholder="手机号" v-model="filter.bndMobileNo"></el-input>
      </div>
      <div class="search-item search-ipt w-180">
        <el-input size="mini" clearable placeholder="部门" v-model="filter.bndStaffDept"></el-input>
      </div>
      <div class="search-item search-ipt">
        <el-button type="primary" size="mini" @click="search">查询</el-button>
        <el-button size="mini">重置</el-button>
      </div>
    </div>
    <div class="btn-container">
      <el-button type="success" size='mini'>导出</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filter: {
        spvStaffNo: '',
        bndName: '',
        bndMobileNo: '',
        bndStaffDept: ''
      }
    }
  },
  created () {
    this.search()
  },
  methods: {
    search () {
      this.$emit('search', this.filter)
    }
  }
}
</script>

<style scoped>

</style>
