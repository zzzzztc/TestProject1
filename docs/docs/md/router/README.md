# router

### 设计
用户访问时将直接进入layout,在layouyt做登录验证，验证通过则进入系统，反之，重定向到登录页面。
用户登录以后将权限，个人信息等持久化存入到localStorage中。判断逻辑如下：
``` bash
beforeRouteEnter (to, from, next) {
    let treeList = window.localStorage.getItem('menuList')
    if (treeList) {
      next()
    } else {
      // 返回登录页
      next('/login')
    }
  }
```

路由使用懒加载。

### 守卫钩子 beforeEach
进路由之前，判断是否进入特定页面，如果不是，则调用ADD_VIEW_LIST将组件信息存入state。
```bash
 if (to.path === '/homePage' || to.name === '404' || to.path === '/login') {
  } else {
    let routes = {}
    routes.label = to.meta.title
    routes.path = to.path
    store.commit('ADD_VIEW_LIST', routes)
  }
  next()
```

### 左侧一级导航联动激活 ###
在每个路由元素的meta中设置parentId属性，该属性与后端返回的导航列表中一级导航id保持一致。
在beforeEach中进行判断，将匹配到的treeList[i].id保存到app.state.firstActive中。
在sidebar.vue文件中同步app.state.firstActive,激活class: firstActive.

```bash
if (to.path !== '/login') {
    let treeList = []
    if (!treeList.length) {
      treeList = JSON.parse(window.localStorage.getItem('menuList'))
    }
    for (let i = 0; i < treeList.length; i++) {
      if (to.meta.parentId === treeList[i].id) {
        store.commit('UPDATE_FIRST_ACTIVE', treeList[i].id)
        break
      }
    }
  }
```
```bash
 computed: {
    ...mapState({
      isCollapse: state => state.app.isCollapse,
      firstActive: state => state.app.firstActive
    })
  }
<span class="fClass" :class="{'fActive': item.id === firstActive}">{{item.text}}</span>

```

路由表部分
```bash
 {
    path: '/homePagePromotion',
    name: 'DefaultPromotion',
    component: () => import('@/views/contentManage/defaultPromotion/index.vue'),
    meta: {
      title: '首页促销管理',
      parentId: '3199'
    }
  },
  {
    path: '/protocol',
    name: 'ProtocolManage',
    component: () => import('@/views/contentManage/protocol/index.vue'),
    meta: {
      title: '协议条款管理',
      parentId: '3199'
    }
```
左侧导航部分
```bash
{id: "1899", text: "订单管理", value: null, checked: false, state: "closed", attributes: null,…},…]
0: {id: "1899", text: "订单管理", value: null, checked: false, state: "closed", attributes: null,…}
attributes: null
checked: false
children: [{id: "1999", text: "机票订单查询", value: null, checked: false, state: null,…},…]
id: "1899"
state: "closed"
text: "订单管理"
value: null
1: {id: "2799", text: "退票管理", value: null, checked: false, state: "closed", attributes: null,…}
2: {id: "2499", text: "差错退款管理", value: null, checked: false, state: "closed", attributes: null,…}
3: {id: "401", text: "补退款管理", value: null, checked: false, state: "closed", attributes: null,…}
4: {id: "10000", text: "保险管理", value: null, checked: false, state: "closed", attributes: null,…}
5: {id: "410", text: "支付管理", value: null, checked: false, state: "closed", attributes: null,…}
6: {id: "411", text: "退改签管理", value: null, checked: false, state: "closed", attributes: null,…}
7: {id: "405", text: "运价折扣管理", value: null, checked: false, state: "closed", attributes: null,…}
8: {id: "4799", text: "基础数据", value: null, checked: false, state: "closed", attributes: null,…}
9: {id: "1200", text: "报表管理", value: null, checked: false, state: "closed", attributes: null,…}
10: {id: "3199", text: "内容管理", value: null, checked: false, state: "closed", attributes: null,…}
11: {id: "402", text: "航班延误证明管理", value: null, checked: false, state: "closed", attributes: null,…}
12: {id: "408", text: "升舱产品管理", value: null, checked: false, state: "closed", attributes: null,…}
13: {id: "1199", text: "会员管理", value: null, checked: false, state: "closed", attributes: null,…}
14: {id: "407", text: "免票管理", value: null, checked: false, state: "closed", attributes: null,…}
15: {id: "6299", text: "系统管理", value: null, checked: false, state: "closed", attributes: null,…}
16: {id: "4499", text: "系统安全管理", value: null, checked: false, state: "closed", attributes: null,…}
17: {id: "406", text: "渠道管理", value: null, checked: false, state: "closed", attributes: null,…}
18: {id: "409", text: "舱位详情介绍管理", value: null, checked: false, state: "closed", attributes: null,…}
```

::: warning 警告
留意生产环境与测试环境下返回的左侧一级导航id是否一致。
如不一致，需手动修改路由表。
2019-5-27版本更新后，无需手动修改本地路由表，路由源信息中parentId属性无效，允许删除。
:::

::: warning 提醒
2017-5-22更新路由模块，内容如下:
:::

### 左侧导航由二级改为三级
在第三级导航被激活时，需获取对应的第二级，第一级导航信息(获取父级数据中id)并提交存储至store中。在sideBar导航组件初始化阶段，取出store中对应的数据，激活对应路由。
在获取父级导航id同时，获取该导航的name属性，实现水平导航与左侧导航名称一致。在上个版本中，不支持用户修改菜单名，当前版本中，支持用户修改左侧菜单名称，如果将路由名称写死在对应的路由源信息中，则无法实现菜单修改后，水平导航与左侧导航名称一致。
具体实现代码如下：

route/index.js
```bash
 if (to.path !== '/login' && to.path !== '/homePage') {
    let activeState = routerMatch(treeList, to.path)
    store.commit('UPDATE_FIRST_ACTIVE', activeState)
    if (to.name !== '404' || to.path !== '/norice') {
      let routes = {}
      routes.path = to.path
      // 水平导航中的名字应该与左侧导航中名字保持一致， 而不是使用本地写死的名字
      routes.label = activeState.compName
      store.commit('ADD_VIEW_LIST', routes)
    }
  }
```

utils/index.js
```bash
export function routerMatch (treeList, path) { // 当前路由与treeList匹配，查出父层id,用以激活当前选中路由及父层状态
  for (let i = 0; i < treeList.length; i++) {
    for (let j = 0; j < treeList[i].children.length; j++) {
      if (treeList[i].children[j].attributes) {
        if (treeList[i].children[j].attributes.url === path) {
          return { gId: treeList[i].id, compName: treeList[i].children[j].attributes.name }
        }
      } else {
        // 继续循环
        for (let m = 0; m < treeList[i].children[j].children.length; m++) {
          if (treeList[i].children[j].children[m].attributes.url === path) {
            return { fId: treeList[i].children[j].id, gId: treeList[i].id, compName: treeList[i].children[j].children[m].attributes.name }
          }
        }
      }
    }
  }
}
```
