# filter

### 注册filter
在入口文件main.js中全局注册filter
```bash
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
```

### filter列表
- `filter channelMap`：渠道
- `filter dateFormat`:处理日期，2018-04-18 12:35:21 -> 2018-04-18
- `filter insuranceMap`: 处理保险字段
- `filter payStatusMap`: 处理支付状态字段
- `filter refundStatusMap`: 处理退款字段
- `filter fancity`: 处理热门城市
- `filter isInter`: 处理国内国际
- `filter payTypeMap`: 处理支付方式
- `filter idTypeMap`: 处理证件类型
- `filter passerTypeMap`: 处理旅客类型
- `filter orderTypeMap`: 处理订单类型
- `filter outTicketStatusMap`: 处理出票状态
- `filter ticStatusRelationMap`: 处理票面状态
- `filter formatPriceMap`: 数值类型格式化为货币类型 26587.45 --> 26, *******   587.45  23 --> 23.00
