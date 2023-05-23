import request from '../../utils/request'
import qs from 'qs'
export function login (data) {
  return request({
    url: '/mid_manager/operator/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function menuNew () {
  return request({
    url: '/mid_manager/menu/menuDemo',
    method: 'post'
  })
}

export function permissionSub (treeList) {
  for (let i = 0; i < treeList.length; i++) {
    for (let j = 0; j < treeList[i].children.length; j++) {
      if (treeList[i].children[j].attributes) {
        let start = treeList[i].children[j].attributes.url.lastIndexOf('/')
        let end = treeList[i].children[j].attributes.url.length
        treeList[i].children[j].attributes.url = treeList[i].children[j].attributes.url.substring(start, end)
        if (treeList[i].children[j].attributes.url === '/memberInfo' || treeList[i].children[j].attributes.url === '/memberReport' || treeList[i].children[j].attributes.url === '/ffpCardInfo') {
          treeList[i].children[j].attributes.url = '/notice'
        }
      }
    }
  }
  return treeList
}
