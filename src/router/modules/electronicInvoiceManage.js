const electronicInvoiceManage = [
  {
    path: '/invoiceManage',
    name: 'InvoiceManage',
    component: () => import('@/views/electronicInvoiceManage/invoiceManage/index.vue'),
    meta: {
      title: '发票管理',
      parentId: '5200'
    }
  },
  {
    path: '/ticketRecord',
    name: 'TicketRecord',
    component: () => import('@/views/electronicInvoiceManage/ticketRecord/index.vue'),
    meta: {
      title: '机票记录',
      parentId: '5201'
    }
  },
  {
    path: '/invoicePushConfig',
    name: 'InvoicePushConfig',
    component: () => import('@/views/electronicInvoiceManage/invoicePushConfig/index.vue'),
    meta: {
      title: '推动配置管理',
      parentId: '5202'
    }
  },
  {
    path: '/invoiceProtocolConfig',
    name: 'InvoiceProtocolConfig',
    component: () => import('@/views/electronicInvoiceManage/invoiceProtocolConfig/index.vue'),
    meta: {
      title: '协议配置管理',
      parentId: '5203'
    }
  }
]
export default electronicInvoiceManage
