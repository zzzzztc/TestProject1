<template>
  <div>
    <button @click="ctrlc()">添加</button>
    <div v-for="(item, index) in params" :key="item.id">
      <el-input size="medium" clearable placeholder="机场城市" v-model="item.cityCode" title="机场城市"></el-input>
      <el-input size="medium" clearable placeholder="机场名称" v-model="item.cityName" title="机场名称"></el-input>
      <span>{{txt}}</span>
    </div>
    <button @click="button">提交</button>
    <div>{{num}}</div>
  </div>
</template>
<script>
// import qs from 'qs'
export default {
  name: 'formMsg',
  data () {
    return {
      params: [{ cityCode: '', cityName: '' }],
      list: {}
    }
  },
  props: ['txt', 'num'],
  methods: {
    ctrlc () {
      this.params.push({ id: this.params.length, cityCode: '' })
    },
    button () {
      for (let i = 0; i < this.params.length; i++) {
        for (let item in this.params[i]) {
          item = 'list[' + (i) + '].' + item
        }
        // console.log(this.params)
        this.list['list[' + (i) + '].cityCode'] = this.params[i].cityCode
        this.list['list[' + (i) + '].cityName'] = this.params[i].cityName
      }
      this.$emit('formData', this.params)
    }
  }
}
</script>
<style>
</style>
