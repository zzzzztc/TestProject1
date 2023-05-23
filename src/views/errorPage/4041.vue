<template>
  <div>
    <div id="wrapper">
      <div id="boss">
        BOSS
        <div class="blood">
          <div id="tiao">
          </div>
        </div>
      </div>
      <div id="fly">PLAYER</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      blood: 100 //  老怪血量
    }
  },
  created () {
    document.onkeydown = (e) => {
      let key = window.event.keyCode
      let fly = document.getElementById('fly')
      let pos = {
        top: fly.offsetTop,
        left: fly.offsetLeft
      }
      // console.log(key)
      switch (key) {
        case 65:
          fly.style.left = pos.left <= 0 ? 0 : ((pos.left) - 5) + 'px'
          break
        case 83:
          fly.style.top = pos.top >= 440 ? 440 : ((pos.top) + 1) + 'px'
          break
        case 68:
          fly.style.left = pos.left >= 700 ? 700 : ((pos.left) + 5) + 'px'
          break
        case 87:
          fly.style.top = pos.top <= 0 ? 0 : ((pos.top) - 1) + 'px'
          break
        case 74:
          //  发射子弹方法
          this.fire()
          break
        default:
      }
    }
  },
  methods: {
    bossMove (pos, flag) {
      if (flag) {
        pos++
      } else {
        pos--
      }
      if (pos >= 700 || pos <= 0) {
        flag = !flag
      }
      document.getElementById('boss').style.left = pos + 'px'
      setTimeout(() => {
        this.bossMove(pos, flag)
      }, 30)
    },
    hit (bul) {
      //  获取boss当前位置
      let bossPos = {
        top: document.getElementById('boss').offsetTop,
        left: document.getElementById('boss').offsetLeft
      }
      //  获得子弹位置
      let bulPos = {
        top: bul.offsetTop,
        left: bul.offsetLeft
      }
      if ((bulPos.left + 5 >= bossPos.left && bulPos.left + 5 <= bossPos.left + 100) && (bulPos.top + 5 >= bossPos.top && bulPos.top + 5 <= bossPos.top + 100)) {
        bul.remove()
        if (this.blood > 10) {
          this.blood = this.blood - 10
          document.getElementById('tiao').style.width = this.blood + '%'
        } else {
          // console.log('GAME over')
          return false
        }
        return true
      }
      return false
    },
    //  创建子弹
    fire () {
      let flyPos = {
        left: document.getElementById('fly').offsetLeft,
        top: document.getElementById('fly').offsetTop
      }
      let div = document.createElement('div')
      div.setAttribute('class', 'bullet')
      document.getElementById('wrapper').appendChild(div)
      div.style.left = (flyPos.left + 25) + 'px'
      div.style.top = (flyPos.top - 10) + 'px'
      this.bulletFly(div)
    },
    bulletFly (bul) {
      if (bul.offsetTop >= 0) {
        bul.style.top = (bul.offsetTop - 1) + 'px'
        //  碰到老怪结束递归
        if (!this.hit(bul)) {
          setTimeout(() => {
            this.bulletFly(bul)
          }, 10)
        }
      } else {
        bul.remove()
      }
    }
  },
  mounted () {
    this.bossMove(0, true)
  }
}
</script>
<style>
  body{
    /*background-color: rgb(30,60,0);*/
  }
  #wrapper{
    width: 800px;
    height: 500px;
    background-color: #000;
    position: absolute;
    left: 0;
    top: 0;
  }
  #boss{
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    background-color: orange;
    color: white;
    margin: 0 auto;
    position: absolute;
    top: 30px;
    left: 0;
  }
  #boss .blood{
    width: 80%;
    border: 1px solid red;
    background-color: #000000;
    height: 20px;
    position: absolute;
    top: 5px;
    left:8px;
  }
  #tiao{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: red;
  }
  #fly{
    background-color: rgb(0,0,180);
    color: white;
    text-align: center;
    line-height: 60px;
    width: 60px;
    height: 60px;
    margin:  0 auto;
    position: absolute;
    top: 300px;
    left: 0;
  }
  .bullet{
    border-radius: 50%;
    border: 1px solid white;
    background-color: white;
    width: 18px;
    height: 18px;
    position: absolute;

  }

</style>
