
const fieldMap = [
  { key: 'invoiceNumber', label: '发票号码', flag: true },
  { key: 'money', label: '金额', flag: true },
  { key: 'invoiceType', label: '发票类型', flag: true },
  { key: 'purchaseName', label: '购方发票抬头', flag: true },
  { key: 'purchaseMobile', label: '电话', flag: true },
  { key: 'status', label: '发票状态', flag: true },
  { key: 'createTime', label: '开票时间', flag: true },
  { key: 'purchaseAddress', label: '购方发票地址', flag: true },
  { key: 'userId', label: '会员号', flag: false },
  { key: 'username', label: '会员名称', flag: false },
  { key: 'invoiceCode', label: '发票代码', flag: false },
  { key: 'purchaseNumber', label: '购方纳税人识别号', flag: false },
  { key: 'purchaseBank', label: '开户行和银行', flag: false },
  { key: 'pdfUrl', label: '发票下载地址', flag: false },
  { key: 'purchaseEmail', label: '邮箱', flag: false },
  { key: 'remark', label: '备注', flag: false }
]
export default fieldMap
