<template>
  <div class="home-box">
    <h1>
      您好{{userName}}，欢迎使用河北航空电商管理后台！
    </h1>
    <div>
      <span style="cursor: pointer; color: #409eff" @click="route">点击</span>
      查看更新日志
    </div>
    <!--<Check></Check>-->
    <!--<Filght></Filght>-->
  </div>
</template>
<script>
// import Check from './check'
// import Filght from './filght'
export default {
  data () {
    return {
      userName: JSON.parse(window.localStorage.userInfo).opName,
      message: 'HomePage',
      active: 1
    }
  },
  // components: {
  //   Check,
  //   Filght
  // },
  created () {
    // let userInfo = JSON.parse(window.localStorage.userInfo)
    // this.userName = userInfo.opName
  },
  methods: {
    route () {
      this.$router.push('/log')
    },
    clickActive (index) {
      this.active = index
      this.$refs.filght.handlers(index)
    }
  }
}
</script>
<style scoped lang="scss">
  .home-box {
    position: relative;
  }
  .log {
    position: absolute;
    top: -50px;
    right: -35px;
    border: 1px solid #ccc;
    width: 100px;
    height: 100px;
    transform: rotate(45deg);
  }
  .bouse-leave-active {
    animation: bounce-out 1.6s;
  }
  .bouse-enter-active {
    animation: bounce-in 1.6s;
  }
  @keyframes bounce-in {
    0% {
      width: 0px;
    }
    100% {
      width: 700px;
    }
  }
@keyframes bounce-out {
  0% {
    opacity: 100%;
    width: 700px;
  }
  100% {
    width: 0;
  }
}
.content{
  width: 900px;
  /*<!--transform: translate(-50%, 0);-->*/
  height: 200px;
  margin: 50px auto;
  border: 1px solid red;
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  .con{
    display: flex;
    justify-content: space-between;
  }
  /*display: block;*/
  .text{
    height: 100%;
    width: 90px;
    background: green;
    color: white;
    text-align: center;
    line-height: 200px;
    display: inline-block;
    border-right: 3px solid white;
  }
  .block{
    width: 700px;
    height: 100%;
    background: red;
  }
  .checks{
    display: flex;
    justify-content: space-between;
  }
}
</style>
