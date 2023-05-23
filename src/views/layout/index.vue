<template>
  <div class='container'>
    <el-container>
      <sidebar :nav='treeList' class='el-aside'></sidebar>
      <el-container>
        <el-header>
          <div class='clearfix header-container'>
            <div>
              <tags-view></tags-view>
            </div>
            <div class='fr user'>
              <user :userInfo='userInfo'></user>
            </div>
          </div>
        </el-header>
        <el-main>
          <transition mode='out-in'>
            <keep-alive :include='aliveView'>
              <router-view></router-view>
            </keep-alive>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Sidebar from '../../components/sidebar/menuCom'
import TagsView from './components/TagsView'
import User from './components/user'
import { mapState } from 'vuex'
import { logoff } from './api'
import { setCookie } from '../../utils'
import md5 from 'js-md5'

export default {
  name: 'layout',
  components: {
    Sidebar,
    TagsView,
    User
  },
  data () {
    return {
      treeList: [],
      userInfo: {}
    }
  },
  computed: {
    ...mapState({
      aliveView: state => state.tagsView.aliveView,
      clearViewList: 'CLEAR_VIEW_LIST',
      clearFirstActive: 'CLEAR_FIRST_ACTIVE'
    })
  },
  created () {
    this.treeList = JSON.parse(window.localStorage.getItem('menuList'))
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    // this.initSocket()
  },
  methods: {
    clickA () {
      this.$router.push('/flightDelayProveList')
    },
    // TODO 更換生产地址
    initSocket () {
      let ref = this
      let webSocket = new WebSocket('ws://11.146.209.15:8082/mid_manager/webSocket/' + this.userInfo.opId)
      webSocket.onopen = function () {
      }
      webSocket.onmessage = function (e) {
        if (e.data && e.data === '您的账户已在另一处登录') {
          ref.$alert('您的账户已在另一处登录！', '提示', {
            dangerouslyUseHTMLString: true,
            showClose: false
          }).then(() => {
            ref.$router.push('/login')
            setCookie('HBH_OP_STATE', md5('outLog'))
            logoff().then(() => {
              localStorage.removeItem('menuList')
              localStorage.removeItem('userInfo')
              ref.clearViewList()
              ref.clearFirstActive()
            })
          })
        }
      }
      webSocket.onclose = function (params) {
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    let treeList = window.localStorage.getItem('menuList')
    if (treeList) {
      next()
    } else {
      // 返回登录页
      next('/login')
    }
  }
}
</script>

<style scoped>
  .container {
    height: 100%;
  }
  .el-container {
    height: 100%;
  }
  .el-header, .el-footer {
    background-color: rgb(245, 247, 250);
    color: #333;
    line-height: 60px;
  }

  .el-header {
    border-bottom: 1px solid #ccc;
  }

  .el-aside {
    background-color: #fff;
    color: #333;
    /*text-align: center;*/
    height: 100%;
    overflow: auto;
  }

  .el-main {
    background-color: rgb(245, 247, 250);
    color: #333;
    box-sizing: border-box;
    padding: 5px;
  }

  .header-container {
    position: relative;
  }
  .user {
    position: absolute;
    right: 0;
    top: 0;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .bounce-enter-active {
    animation: bounce-in 0.2s;
  }
  .bounce-leave-active {
    animation: bounce-out 0.2s;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }

  }
  @keyframes bounce-out {
    0% {
      transform: scale(1);
    }
    100% {
      transform:scale(0);
    }
  }

</style>
