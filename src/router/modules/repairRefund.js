const repairRefund = [
  {
    path: '/repairRefundApply',
    name: 'RepairRefundApply',
    component: () => import('@/views/repairRefundManage/repairRefundApply/index.vue'),
    meta: {
      title: '补退款申请',
      parentId: '401'
    }
  },
  {
    path: '/repairRefundAudit',
    name: 'RepairRefundAudit',
    component: () => import('@/views/repairRefundManage/repairRefundAuditing/index.vue'),
    meta: {
      title: '补退款审核',
      parentId: '401'
    }
  },
  {
    path: '/repairRefundRefund',
    name: 'RepairRefundRefund',
    component: () => import('@/views/repairRefundManage/repairRefundRefund/index.vue'),
    meta: {
      title: '补退款确认',
      parentId: '401'
    }
  },
  {
    path: '/repairRefundForm',
    name: 'RepairRefundForm',
    component: () => import('@/views/repairRefundManage/repairRefundReport/index.vue'),
    meta: {
      title: '补退款报表',
      parentId: '401'
    }
  }
]

export default repairRefund
