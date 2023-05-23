# index
::: warning WARNING
公共样式文件内：
- 慎用后代选择器。  
- 如需使用，务必带上命名空间。
:::

## 页面布局
### sidebar
- sidebar二级导航   
- 水平垂直不允许导致页面滚动
### header
- 左侧放置tags-view, 右侧为登录人信息
### main
- .header为搜索及按钮框
- .main 为表格   表格高度在该组件mounted钩子内动态计算。参考： [api](../API/README.md)。
- .footer 为分页

## 公用类
- 页面滚动条修改
- 浮动，清除浮动
- 内外边距 参考[index.scss](http://192.168.1.149:8096/web/hbh-ms/blob/master/src/styles/index.scss)
- pointer
- .require 必填标记
- .text- 文字位置
- .active-text 文本激活状态 蓝色 $blue
- .text-over 文本溢出隐藏
- .danger-text 警告文本
- .inl-block 行内块
- .search-container 搜索栏样式  参考[index.scss](http://192.168.1.149:8096/web/hbh-ms/blob/master/src/styles/index.scss)
- .dialog-container 弹出框样式
- 其余参考index.scss
