const fieldMap = [
  { key: 'ordercode', label: '订单编号', flag: true },
  { key: 'payOrdercode', label: '订单编号', flag: false },
  { key: 'insNo', label: '保单号', flag: true },
  { key: 'insuredName', label: '被保人', flag: true },
  { key: 'idcard', label: '证件号', flag: true },
  { key: 'flightno', label: '航班号', flag: true },
  { key: 'segid', label: '航段序号', flag: false },
  { key: 'afrom', label: '航段', flag: false },
  { key: 'channel', label: '渠道类型', flag: false },
  { key: 'flightDate', label: '乘机日期', flag: true },
  { key: 'createDate', label: '承保时间', flag: false },
  { key: 'refundDate', label: '退保时间', flag: false },
  { key: 'buyTotalPrice', label: '保单费用', flag: false },
  { key: 'insType', label: '保险种类', flag: true },
  { key: 'insuranceCompanyName', label: '保险公司', flag: false },
  { key: 'insStatus', label: '保险状态', flag: false },
  { key: 'insOrderCode', label: '保司保单号', flag: false }
]
export default fieldMap
