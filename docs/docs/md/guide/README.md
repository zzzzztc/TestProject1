# guide
### 支付类型
::: warning 警告
系统内置支付类型有五种，当后端修改支付类型时，前端需要同步修改。

2019-06-10将系统内支付类型统一修改为一下五种，包括过滤，新增，编辑，列表等。
:::
```bash
{
    value: 'weixin', label: '微信',
    value: 'alipay', label: '支付宝',
    value: 'unionpay', label: '银联云闪付',
    value: 'applepay', label: 'Apple pay',
    value: 'unionpayse', label: '银联云闪付SE'
}
```

### 支付渠道管理
::: warning 警告
在添加支付渠道需要选择支付方式时，有两个“微信支付”，两个并非重复，使用场景不同。
渠道为"手机客户端"时，使用payType为APP的微信支付，渠道为"微信小程序"时，使用payType为JSAPI的微信支付。
:::
```bash
{
    methodName: '微信支付', payType: 'JSAPI', // 微信小程序内调用
    methodName: '微信支付', payType: 'APP' // APP 调用
}
```
