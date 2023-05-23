<template>
  <div class="container clearfix">
    <div class="logout fl" @click="logout">
      <i class="icon-logout" title="退出"></i>
    </div>
    <div class="user fl" @click="route">
      <div class="name text-over">{{userInfo.opName}}</div>
      <div class="account text-over">{{userInfo.opAccount}}</div>
    </div>
  </div>
</template>

<script>
import { logoff } from '../api'
import { mapMutations } from 'vuex'
import { setCookie } from '../../../utils'
import md5 from 'js-md5'

export default {
  name: 'user',
  props: {
    userInfo: {
      type: Object
    }
  },
  methods: {
    route () {
      this.$router.push('/changePwd')
    },
    // 退出登录1
    logout () {
      this.$router.push('/login')
      setCookie('HBH_OP_STATE', md5('outLog'))
      logoff().then(() => {
        localStorage.removeItem('menuList')
        localStorage.removeItem('userInfo')
        this.clearViewList()
        this.clearFirstActive()
      })
    },
    // 清除状态
    ...mapMutations({
      clearViewList: 'CLEAR_VIEW_LIST',
      clearFirstActive: 'CLEAR_FIRST_ACTIVE'
    })
  }
}
</script>

<style scoped lang="scss">
  .container {
    max-width: 180px;
    height: 60px;
  }

  .logout {
    height: 60px;
  }
  .icon-logout {
    display: inline-block;
    width: 32px;
    height: 32px;
    cursor: pointer;
    margin-top: 14px;
    background-image: url("../../../assets/logout.svg");
  }

  .user {
    margin-left: 30px;
    margin-top: 10px;
    cursor: pointer;
  }

  .name, .account {
    max-width: 100px;
    text-align: left;
    line-height: 1.4;
    color: #409EFF;
    font-size: 14px;
  }
</style>
