## API列表
- `function randomStr`: 生成随机字符串，用于作为动态数据的key。
- `function JsonToXls`: 将json数据转为excel文件并下载。与`function s2ab(s)`配合使用。
::: tip TIP
  `functin JsonToXls`参数：data 为二维数组，存放数据, sheetName一维数组，表名， excelName字符串。（详见util/index.js）
:::
- `function filterIds`：传入两个参数，data为一维数组，key为需要提取的字段 返回数组。（常用于提取id）
- `function computeTableHeight`: 返回表格高度。（留意参数）
- `function getCurrentDate`: 获取日期。
- `function exportTransform`: 导出数据转换。
- `function getChannelList`：获取渠道列表并做缓存。
- `function getDataDictionary`: 获取数据字典内容，并缓存，参数见后端文档。
- `function isEmpty`: 判空。
- `function getCity`：获取城市。
- `function judgeRefundStatus`: 返回审核状态名。
- `function judgeIdType`：返回证件类型。
- `function judgePasserType`: 返回旅客类型。
- `function judgeOrderType`: 返回订单类型。
- `function judgeOutTicketStatus`: 返回出票状态。
- `function judgeIsInner`: 返回国内国际。
- `function ticStatusRelation`: 返回票面处理状态。
- `function channelStatus`: 返回渠道，多个将拼接。例："官网,小程序"
- `function excelList`: 请求接口返回需导出数据,配合download实现下载。
:::tip TIP
留意参数
:::
- `function transformComName`: 返回组件名称。
:::tip TIP
将组件的path转为name，标记是否用于keep-alive include.
主要用作处理缓存问题。  
/userInfo -> UserInfo
:::
