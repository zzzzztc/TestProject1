<template>
  <div class="menu">
    <div class="logo-container">
      河北航空电商管理后台
    </div>
<!--    一级菜单-->
    <div class="fNode fText" :class="{ 'home-active': $route.path === '/homePage' }" @click="route('/homePage')">主页</div>
    <div v-for="(item, index)  in menu" :key="item.id" class="fNode">
      <div class="fText" :class="{ 'active': firstActive === item.id}" @click="switchFNode(index)">{{item.text}}
        <i v-if="item.state !== 'closed'" class="el-icon-arrow-up fr fIcon"></i>
        <i v-else class="el-icon-arrow-down fr fIcon"></i>
      </div>
      <collapse-transition>
        <div v-if="item.children && item.children.length && item.state !== 'closed'">
          <!--        二级菜单-->
          <div v-for="(val, sIndex) in item.children" :key="val.id" class="sNode">
            <!--          有三级菜单的分类-->
            <div v-if="val.children && val.children.length">
              <div class="sText" @click="switchSNode(index, sIndex)">{{val.text}}
                <i v-if="val.state !== 'closed'" class="el-icon-arrow-up fr sIcon"></i>
                <i v-else class="el-icon-arrow-down fr sIcon"></i>
              </div>
              <collapse-transition>
                <div v-if="val.state !== 'closed'">
                  <div v-for="t in val.children" :key="t.id" class="tNode">
                    <div class="tText" :class="{ 'active': $route.path === t.attributes.url }" @click="route(t.attributes.url)">{{t.text}}</div>
                  </div>
                </div>
              </collapse-transition>
            </div>
            <!--          无三级菜单的分类-->
            <div v-else>
              <div class="sText" :class="{ 'active': val.attributes && val.attributes.url === $route.path }" @click="route(val.attributes.url)">{{val.text}}</div>
            </div>
          </div>
        </div>
      </collapse-transition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import collapseTransition from './trans'
export default {
  name: 'MenuCom',
  props: {
    nav: {
      type: Array
    }
  },
  components: {
    collapseTransition
  },
  computed: {
    ...mapState({
      isCollapse: state => state.app.isCollapse,
      firstActive: state => state.app.firstActive,
      secondActive: state => state.app.secondActive
    })
  },
  data () {
    return {
      menu: this.nav
    }
  },
  methods: {
    route (path) {
      this.$router
        .push(path)
        .catch(() => {})
    },
    // 一级菜单展开收起
    switchFNode (index) {
      if (this.menu[index].state === 'closed') {
        for (let i = 0; i < this.menu.length; i++) {
          if (this.menu[i].state === 'opend') {
            this.menu[i].state = 'closed'
          }
        }
        this.menu[index].state = 'opend'
      } else {
        this.menu[index].state = 'closed'
      }
    },
    // 二级菜单展开收起
    switchSNode (index, sIndex) {
      if (this.menu[index].children[sIndex].state === 'closed') {
        this.menu[index].children[sIndex].state = 'opend'
      } else {
        this.menu[index].children[sIndex].state = 'closed'
      }
    }
  },
  watch: {
    firstActive: {
      immediate: true,
      handler: function (n) {
        for (let i = 0; i < this.menu.length; i++) {
          if (this.menu[i].id === n) {
            this.menu[i].state = 'opend'
          } else {
            this.menu[i].state = 'closed'
          }
        }
      }
    },
    secondActive: {
      immediate: true,
      handler: function (n) {
        for (let i = 0; i < this.menu.length; i++) {
          for (let j = 0; j < this.menu[i].children.length; j++) {
            if (this.menu[i].children[j].id === n) {
              this.menu[i].children[j].state = 'opend'
            } else {
              this.menu[i].children[j].state = 'closed'
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .collapse-enter{
    max-height: 0;
  }
  .collapse-enter-active {
    max-height: 600px;
    -webkit-transition: max-height .5s;
    transition: max-height .5s;
  }
  .collapse-leave {
    max-height: 10rem;
  }
  .collapse-leave-active {
    max-height: 0;
  }
.menu {
  width: 232px;
  height: 100%;
  background-color: #323232 !important;
  color: #fff;
}
.fIcon {
  margin-top: 13px;
  font-size: 10px;
}
.sIcon {
  margin-top: 3px;
  font-size: 10px;
}
  .fNode {
    cursor: pointer;
    > .active {
      border-left: 4px solid #c80023;
    }
  }
  .fText {
    color: #fff;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    padding-left: 24px;
    padding-right: 24px;
    border-left: 4px solid transparent;
    &:hover {
      border-left: 4px solid #c80023;
    }
  }
  .sNode {
    background-color: #545454;
    .active {
      background-color: #c80023;
    }
  }
  .sText {
    padding: 10px 24px;
    font-size: 14px;
    color: #fff;
    border-left: 4px solid transparent;
    &:hover {
      background-color: #999;
    }
  }
  .tText {
    color: #fff;
    font-size: 14px;
    height: 36px;
    line-height: 36px;
    padding-left: 45px;
    &:hover {
      background-color: #c80023;
    }
  }
  .tNode {
    .active {
      background-color: #c80023;
    }
  }
  .active {
    color: #fff;
  }
  .logo-container {
    height: 60px;
    line-height: 60px;
    background-color: #c80023;
    font-size: 18px;
    color: #fff;
    text-align: center;
  }
  .home-active {
    border-left: 4px solid #c80023;
  }
</style>
