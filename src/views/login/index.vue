<template>
  <div class="container">
    <div class="login-case">
      <div class="left"></div>
      <div class="right">
        <div class="logo-case"></div>
        <div class="err-msg" v-if="isError">账号或密码输入错误，请重新输入</div>
        <div class="item">
          <el-input placeholder="请输入账号" v-model="loginInfo.opAccount" @keydown.enter.native="login" clearable></el-input>
        </div>
        <div class="item">
          <el-input placeholder="请输入密码" type="password" v-model="loginInfo.opPwd" @keydown.enter.native="login" clearable></el-input>
        </div>
        <div class="item">
          <el-button disabled v-if="!loginInfo.opAccount || !loginInfo.opPwd" style="width: 100%">登录</el-button>
          <el-button v-loading="loading" v-else type="primary" style="width: 100%" @click="login">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from './api'
import { setCookie } from '../../utils/index'
import md5 from 'js-md5'

export default {
  name: 'login',
  data () {
    return {
      loginInfo: {},
      isError: false,
      loading: false,
      menuData: []
    }
  },
  created () {
  },
  methods: {
    login () {
      this.loading = true
      if (!this.loginInfo.opAccount || !this.loginInfo.opPwd) {
        this.$message.warning('账号或密码不可为空')
        this.loading = false
      } else {
        login(this.loginInfo).then((res) => {
          this.loading = false
          // console.log(res)
          // 权限存储在本地
          if (res.treeList.length) {
            window.localStorage.setItem('menuList', JSON.stringify(res.treeList))
            window.localStorage.setItem('userInfo', JSON.stringify(res.obj))
            this.$router.push('/homePage')
            setCookie('HBH_OP_STATE', md5('isLogin'))
          } else {
            this.$message.error('账号角色异常，请联系系统管理员处理')
          }
        }).catch(err => {
          // console.log(err)
          this.loading = false
          this.isError = true
          this.$message.error(err.message)
        })
      }
      // axios.post('/operator/login', {
      //   opAccount: 'admin',
      //   opPwd: '111111'
      // }).then(res => {
      //   console.log(res)
      // }).catch(err => {
      //   console.log(err)
      // })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../styles/variable";
  .container {
    height: 100%;
    background-image: url("../../assets/bg-outer.png");
    background-size: cover;
  }

  .login-case {
    position: absolute;
    display: flex;
    width: 880px;
    height: 420px;
    box-sizing: border-box;
    top: 50%;
    left: 50%;
    margin-top: -210px;
    margin-left: -440px;
    /*border: 1px solid #ccc;*/
    /*box-shadow: 0 3px 3px #f5f5f5;*/
  }

  .el-input__inner {
    height: 40px !important;
    line-height: 40px !important;
  }

  .left, .right {
    flex: 1;
  }

  .left {
    background-image: url('../../assets/bg-inner.png');
  }

  .right {
    background: #fff;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  .logo-case {
    width: 184px;
    height: 60px;
    margin: 25px auto;
    background-size: cover;
    background-image: url("../../assets/logo.png");
  }

  .err-msg {
    width: 320px;
    height: 40px;
    box-sizing: border-box;
    padding: 0 30px;
    line-height: 40px;
    margin: 0 auto;
    color: $red;
    border: 1px solid $red;
    border-radius: 10px;
    background: rgb(255, 247, 247);
    color: $red;
  }

  .item {
    width: 320px;
    padding: 0 30px;
    margin: 20px auto;
  }

  .login-btn {
    background: #00ff00;
  }
  .menu {
    width: 600px;
    height: 600px;
    background-color: #fff;
    border: 1px solid #ccc;
    z-index: 999;
  }

</style>
