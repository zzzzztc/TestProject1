const fieldMap = [
  //  默认展示
  { key: 'ordercode', label: '订单编号', ordercode: true, flag: true },
  { key: 'faiOrderId', label: '航联订单号', flag: false },
  { key: 'instanceDate', label: '保险生效日期', instanceDate: true, flag: true },
  { key: 'ticketNo', label: '票号', ticketNo: true, flag: true },
  { key: 'buyUnitPrice', label: '单价', buyUnitPrice: true, flag: true },
  { key: 'statusName', label: '保险状态', statusName: true, flag: true },
  { key: 'insuredName', label: '购保人姓名', insuredName: true, flag: true },
  { key: 'insuredMobile', label: '购保人手机', insuredMobile: false, flag: false },
  { key: 'channel', label: '渠道类型', channel: true, flag: true },
  { key: 'insuranceCompanyName', label: '保险公司', insuranceCompanyName: false, flag: false },
  { key: 'insuranceProductName', label: '保险产品', insuranceProductName: true, flag: true },
  { key: 'insNo', label: '保单号', insNo: true, flag: true },
  { key: 'insOrderCode', label: '保司保单号', insNo: true, flag: true },
  { key: 'payCode', label: '支付平台代码', flag: false },
  { key: 'payOrdercode', label: '保单唯一序列码', flag: false },
  { key: 'createDate', label: '保险日期', createDate: false, flag: false },
	{ key: 'auditName', label: '审核人', flag: false },
	{ key: 'auditAccount', label: '审核人工号', flag: false }
]
export default fieldMap
