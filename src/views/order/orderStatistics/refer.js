const fieldMap = [
  { key: 'orderCode', label: '订单编号', flag: true },
  { key: 'pnr', label: 'pnr', flag: true },
  { key: 'airways', label: '市场方', flag: false },
  { key: 'airline', label: '承运方', flag: false },
  { key: 'productName', label: '产品名称', flag: false },
  { key: 'allFnumber', label: '航班号', flag: false },
  { key: 'allSail', label: '航段', flag: false },
  { key: 'allFare', label: '票面价', flag: false },
  { key: 'allairportTax', label: '机建', flag: false },
  { key: 'allfuelTax', label: '燃油', flag: false },
  { key: 'insuranceTotalPrice', label: '保险金额', flag: false },
  { key: 'taxPrice', label: '国际票总税', flag: false },
  { key: 'paymoney', label: '订单金额', flag: true },
  { key: 'productMoney', label: '附加商品金额', flag: false },
  { key: 'integralValue', label: '积分值', flag: false },
  { key: 'creadate', label: '订单时间', flag: false },
  { key: 'orderStatus', label: '订单状态', flag: false },
  { key: 'orderType', label: '订单类型', flag: false },
  { key: 'orderPayStatus', label: '支付状态', flag: false },
  { key: 'userName', label: '联系人', flag: false },
  { key: 'mobile', label: '联系电话', flag: false },
  { key: 'passengerType', label: '客户类型', flag: false },
  { key: 'passengerCode', label: '客户编号', flag: false },
  { key: 'channel', label: '订单来源', flag: true },
  { key: 'isInter', label: '国内国际', flag: false },
  { key: 'walletMoney', label: '红包金额', flag: false }
  //  默认展示
]
export default fieldMap
