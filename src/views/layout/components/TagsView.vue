<template>
  <div class="container clearfix" ref="tagsBox">
    <div class="tag fl" :class="{'active': $route.path === '/homePage'}" @click="route('/homePage')">主页</div>
    <div class="tag tag-item fl"
      :class="{'active': item.path === $route.path}"
      v-for="(item, index) in tagsList"
      @click="route(item.path)"
      :title="item.label"
      :key="item.id">
      <span :class="item.path === $route.path ? 'act' : 'label'">{{item.label}}</span>
      <i :class="item.path === $route.path ? 'tagColor el-icon-close' : 'el-icon-close'" @click.stop="removeTag(item, index)"></i>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      tagsList: state => state.tagsView.tagsList
    })
  },
  created () {
  },
  mounted () {
    this.computedTagNum()
  },
  methods: {
    computedTagNum () {
      let len = this.$refs['tagsBox'].offsetWidth - 60 - 165
      let num = Math.floor(len / 150)
      this.updateNum(num)
    },
    // 跳转
    route (path) {
      this.$router.push({
        path: path
      })
      if (path === '/homePage') {
        this.clearParentId()
      }
    },
    // 移除标签
    removeTag (param, index) {
      if (param.path === this.$route.path) { // 移除当前激活组件
        if (this.tagsList.length === 1) { // 只有一项时，直接跳转至主页
          this.$router.push('/homePage')
          this.clearParentId()
        } else { // tagsList 有多个
          if (index === this.tagsList.length - 1) { // 删除最后一项，往前跳转
            this.$router.push(this.tagsList[index - 1].path)
          } else { // 往后跳转
            this.$router.push(this.tagsList[index + 1].path)
          }
        }
      }
      this.removeTagHandle(param)
    },
    ...mapMutations({
      removeTagHandle: 'REMOVE_VIEW_LIST',
      updateNum: 'GET_TAGS_NUM',
      clearParentId: 'CLEAR_FIRST_ACTIVE'
    })
  }
}
</script>
<style lang="scss" scoped>
  .container {
    /*overflow-y: hidden;*/
    /*overflow-x: auto;*/
    /*white-space: nowrap;*/
    box-sizing: border-box;
    font-size: 14px;
  }
  .tag {
    margin-right: 30px;
    box-sizing: border-box;
    height: 60px;
    position: relative;
    .label {
      display: inline-block;
      width: 96px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    &:hover {
      cursor: pointer;
    }
  }
  .tag-item {
    width: 120px;
    display: inline-block;
    position: relative;
  }
  .act{
    color: #409EFF;
    display: inline-block;
    width: 96px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .active {
    border-bottom: 2px solid #409EFF;
    color: #409EFF;
  }
  .active .el-icon-close {
    color: #fa5e5f;
  }
  .tagColor{
    color: #fa5e5f;
  }
  .el-icon-close {
    position: absolute;
    right: 0;
    top: 24px;
    font-weight: 700;
    // padding: 0 10px;
  }
</style>
