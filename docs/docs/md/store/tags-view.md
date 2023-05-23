# tags-view

### state
- `state: tagsList`: 数组, 用于存放水平导航标签。数组元素为{path,label}，水平导航模块v-for循环渲染即可。
- `state: aliveView`: 数组，用于keep-alive标签中include属性，控制缓存组件，应与水平导航tagsList数组保持一致。数组元素为每个组件对应的name。
- `state: num`: 水平导航元素最大个数，由页面宽度和每个标签长度计算而来。默认设置为8。

### mutations
- `mutation GET_TAGS_NUM`： 接收num。
- `mutation ADD_VIEW_LIST`: 页面跳转时，自动往tagsList压入当前组件信息，并处理缓存问题。
:::tip TIP
首次进入，则直接压入数据。并且判断tagsList长度是否已经超过state.num允许的最大长度，如超出则删除数组第一项元素,同时删除对应的缓存。
非首次进入无需处理。
:::
- `mutation REMOVE_VIEW_LIST`: 用户主动移除水平导航元素。同时移除缓存。
- `mutation CLEAR_VIEW_LIST`: 用户退出登录时触发，清空state中两个数组。