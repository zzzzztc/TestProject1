<template>
  <div class="log">
    <div>
      <h1 class="top">
        <span>更新日志</span>
        <span class="backIndex" @click="backIndex">
        返回首页
      </span>
      </h1>
      <div class="tip">
        <h3>Tip</h3>
        <p>1、输入框激活状态，按回车可以搜索（下拉框不支持）</p>
        <p>2、下拉框无选项等同选择全部</p>
        <p>3、双击弹出框顶部，全屏显示；再次双击，退出全屏（详情类）</p>
        <p>4、弹出框允许拖拽（缩放&移动）</p>
        <p>5、修改菜单名后，提醒其他操作员退出重登以获取新菜单</p>
        <p>6、遇到"服务端错误"，请退出重新登录</p>
        <p>7、项目更新后，按Ctrl+F5，刷新页面，避免缓存</p>
      </div>
<!--      <div class="tip warn">-->
<!--        <h3>待处理问题</h3>-->
<!--        <p>1、订单查询弹框&#45;&#45;航段展示新旧编码问题</p>-->
<!--      </div>-->
      <div class="box">
        <div v-for="val in curList" :key="val.date" style="margin-bottom: 50px;border: 2px solid #ddd;">
          <div class="date">
            <div>{{val.date}}</div>
          </div>
          <div class="label-container">
            <div v-for="item in val.item" :key="item.id" class="item">
              <div>{{ item.id }}、</div>
              <div>{{item.label}}</div>
            </div>
          </div>
          <div class="remark">
            <div class="label">需求报告书:</div>
            <div class="text">{{ val.docs || '无' }}</div>
          </div>
          <div class="remark">
            <div class="label">备注:</div>
            <div class="text">{{ val.remark || '无' }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div v-for="item in pageList" :key="item.id" class="page-item" :class="{ active: item.page === curPage }" @click="changePagina(item.page)">{{ item.page }}</div>
    </div>
  </div>
</template>

<script>
import records2019 from './records-2019'
import records2020 from './records-2020'
import records2021 from './records-2121'
export default {
  name: 'index',
  data () {
    return {
      list: [
        ...records2021,
        ...records2020,
        ...records2019
      ],
      curList: [],
      curPage: 1,
      pageSize: 10,
      pageList: []
    }
  },
  created () {
    this.initPagina()
    this.initData()
  },
  methods: {
    backIndex () {
      this.$router.push('/homePage')
    },
    initPagina () {
      let num = Math.ceil(this.list.length / this.pageSize)
      for (let i = 0; i < num; i++) {
        let obj = {
          id: i,
          page: i + 1
        }
        this.pageList.push(obj)
      }
    },
    initData () {
      this.curList = this.list.slice(0, this.pageSize - 1)
    },
    changePagina (page) {
      if (page === this.curPage) {
        return false
      }
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      this.curPage = page
      let index = (page - 1) * this.pageSize
      let endIndex = page * this.pageSize - 1
      this.curList = this.list.slice(index, endIndex)
    }
  }
}
</script>

<style scoped lang="scss">
  .log {
    /*display: flex;*/
    /*justify-content: space-between;*/
    width: 900px;
    margin: 0 auto;
    display: flex;
    h1 {
      display: flex;
      justify-content: space-between;
    }
  }
  .top {
    box-sizing: border-box;
    width: 800px;
    position: fixed;
    display: flex;
    margin: 0;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.08);
  }
  .right {
    position: fixed;
    margin-top: 80px;
    margin-left: 825px;
    .page-item {
      width: 30px;
      height: 30px;
      line-height: 30px;
      margin-bottom: 15px;
      border: 1px solid #ddd;
      text-align: center;
      cursor: pointer;
      border-radius: 5px;
      &:hover {
        color: #409eff;
        background-color: #fafafa;
        border-color: #409eff;
      }
    }
    .active {
      color: #409eff;
      background-color: #fafafa;
      border-color: #409eff;
    }
  }
  .tip {
    width: 800px;
    min-height: 50px;
    margin-top: 100px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding-left: 20px;
  }
  .warn {
    border-color: #e6a23c;
  }
  .box {
    border-bottom-color: transparent;
    border-radius: 5px;
    width: 800px;
    .date {
      border-bottom: 1px solid #ddd;
      box-sizing: border-box;
      font-size: 20px;
      font-weight: 600;
      padding: 10px 15px;
    }
  }
  .label-container {
    box-sizing: border-box;
    padding: 20px 40px;
    color: #ccc;
    .item {
      display: flex;
      color: #666;
      padding: 5px 0 10px 0;
    }
  }
  .remark {
    padding: 10px 15px;
    border-top: 1px solid #ddd;
    display: flex;
    .label {
      font-weight: bold;
      color: #333;
    }
    .text {
      margin-left: 10px;
      font-weight: bold;
      color: #c80023;
    }
  }
  .backIndex {
    display: inline-block;
    font-weight: 500;
    font-size: 16px;
    padding: 10px;
    color: #409EFF;
    cursor: pointer;
  }
</style>
