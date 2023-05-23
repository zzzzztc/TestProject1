const permission = [
  {
    path: '/roleManage',
    name: 'RoleManage',
    component: () => import('@/views/permissionManage/role/index.vue'),
    meta: {
      title: '权限角色管理',
      parentId: '6299'
    }
  },
  {
    path: '/operatorList',
    name: 'OperatorManage',
    component: () => import('@/views/permissionManage/operator/index.vue'),
    meta: {
      title: '用户管理',
      parentId: '6299'
    }
  }
]

export default permission
