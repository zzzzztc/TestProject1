<template>
  <div class="container">
    <div class="logo-container" v-if="!isCollapse">
      河北航空电商管理后台
      <span class="collapse-btn-open" @click="toggleCollapse"> 《 </span>
    </div>
    <div v-else class="collapse-btn" @click="toggleCollapse">
      <div class="icon"></div>
    </div>
    <el-scrollbar style="height: 100%;">
      <el-menu
        class="el-menu-vertical-demo"
        :unique-opened="true"
        :default-active="$route.path"
        :collapse="isCollapse">
        <el-menu-item index="/homePage" @click="route('/homePage')">主页</el-menu-item>
        <el-submenu v-for="item in nav" :class="{ 'fActive': item.id === firstActive }" :key="item.id" :index="item.id">
          <template slot="title">
            <span style="font-size: 16px;font-weight: 500" :class="{ 'fActive': item.id === firstActive }" >
              {{ item.text }}
            </span>
          </template>
          <div v-for="val in item.children" :key="val.id">
            <el-menu-item v-if="!val.children" @click="route(val.attributes.url, val.id)" :index="val.attributes.url">{{val.text}}</el-menu-item>
            <el-submenu  v-if="val.children" :index="val.id">
              <template slot="title">
                <span :class="{ 'sActive': val.id === secondActive }">
                  {{val.text}}
                </span>
              </template>
              <el-menu-item v-for="t in val.children" :index="t.attributes.url" :key="t.id" @click="route(t.attributes.url, t.id, val.id)">{{t.text}}</el-menu-item>
            </el-submenu>
          </div>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'sidebar',
  data () {
    return {
      activeItem: ''
    }
  },
  props: {
    nav: {
      type: Array
    }
  },
  created () {
  },
  computed: {
    ...mapState({
      isCollapse: state => state.app.isCollapse,
      firstActive: state => state.app.firstActive,
      secondActive: state => state.app.secondActive
    })
  },
  methods: {
    route (path, pId, gId) {
      this.activeFClass(pId, gId)
      this.$router
        .push({
          path: path
        })
        .catch(() => {})
    },
    activeFClass (id) {
      for (let i = 0; i < this.nav.length; i++) {
        if (this.nav[i].id === id) {
          this.nav[i].state = 'open'
          break
        }
      }
    },
    // 切换
    toggleCollapse () {
      this.toggleCollapseHandle()
    },
    ...mapMutations({
      toggleCollapseHandle: 'TOGGLE_COLLAPSE'
    })
  }
}
</script>

<style scoped lang="scss">
  .container {
    border-right: 1px solid #ccc;
    /*overflow-x: scroll;*/
    .logo-container {
      background-color: #409EFF;
      color: #fff;
      padding: 15px 3px;
      font-size: 16px;
      font-weight: 700;
      position: absolute;
      z-index: 1000;
      font-family:  宋体;
    }
  }
  .collapse-btn {
    background-color: #409EFF;
    height: 38px;
    padding-top: 15px;
    .icon {
      width: 10px;
      height: 18px;
      margin-left: 24px;
      /*border: 1px solid #ccc;*/
      color: #fff;
      cursor: pointer;
      background-image: url("../../assets/zhankai.svg");
    }
  }
  .el-menu {
    border-right: none;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse)  {
    width: 229px;
    padding-top: 60px;
  }
 .el-scrollbar__wrap {overflow-x: hidden;}
  .collapse-btn-open{
    cursor: pointer;
  }
  .fActiveText {
    font-size: 16px;
  }
  .fActive {
    color: #409EFF;
  }
  .sActive {
    color: #409EFF;
  }

  .w {
    color: red!important;
  }
</style>
