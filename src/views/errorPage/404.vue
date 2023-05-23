<template>
  <div>
    <div id="container">
      <!--<el-button type="primary" round >主要按钮</el-button>-->
      <div class="button" @click="button">返回主页</div>
<!--      <el-button @click="getMenu">menu</el-button>-->
      <!--<img class="png" src="../../assets/404.png">-->
      <!--<img class="png msg" src="../../assets/404_msg.png" />-->
      <!--&lt;!&ndash;<p><span @click="backHomepage" class="backhome">返回首页</span></p>&ndash;&gt;-->
    <!--</div>-->
    <!--<div id="cloud" class="png">-->
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {
    button () {
      this.$router.push('/homePage')
      // console.log(this.$route.path)
    }
  },
  created () {
  }
}
</script>
<style>
  body, div {
    margin: 0;
    padding: 0;
  }
  body {
    background: url("../../assets/BG404.png") center repeat-x;
    position: relative;
    /*background-size: 100% 100%;*/
  }
  .button{
    width: 120px;
    height: 40px;
    font-size: 16px;
    background: #409EFF;
    -webkit-border-radius: 17px;
    -moz-border-radius: 17px;
    border-radius: 17px;
    text-align: center;
    line-height: 40px;
    color: white;
    cursor: pointer;
    position: absolute;
    left:46%;
    top:50%;
    margin-top: 280px;
  }
</style>
