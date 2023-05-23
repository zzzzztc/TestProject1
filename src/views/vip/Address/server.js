const show = {
  '0': (objs, id) => {
    for (let item in objs) {
      objs[item] = ''
    }
    for (let item in id) {
      id[item] = ''
    }
    return objs
  },
  '1': (objs, obj2) => {
    empty(objs)
    objs['a'] = '请选择'
    obj2['province'] = ''
    obj2['city'] = ''
    return objs
  },
  '2': (objs, obj2) => {
    empty(objs)
    objs['a'] = '请选择'
    objs['b'] = '请选择'
    obj2['city'] = ''
    return objs
  },
  '3': (objs, obj2) => {
    empty(objs)
    objs['a'] = '请选择'
    objs['b'] = '请选择'
    objs['c'] = '请选择'
    return objs
  },
  '4': (objs) => {
    empty(objs)
    objs['a'] = '请选择'
    objs['b'] = '请选择'
    objs['s'] = '请选择'
    objs['d'] = '请选择'
    return objs
  }
}
function empty (objs) {
  for (let item in objs) {
    objs[item] = ''
  }
  return objs
}
export class Adress {
  static show (val, objs, id) {
    return show[val](objs, id)
  }
  msgObj () {
    return this.hObj
  }
  //  取出最小的id
  static smallId (obj) {
    let id = ''
    if (obj.country === '') {
      id = ''
    }
    if (obj.province === '' && obj.country !== '') {
      id = obj.country
    }
    if (obj.province !== '' && obj.country !== '' && obj.city !== '') {
      id = obj.city
    }
    if (obj.province !== '' && obj.country !== '' && obj.city === '') {
      id = obj.province
    }
    return id
  }
}
