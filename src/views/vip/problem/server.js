// import https from './https' name: 方法名 callback: 回调
// 数据处理类
export class deletelists {
  //  删除
  static dels (obj, name, callback) {
    let questionIds = ''
    if (obj.length) {
      questionIds = obj.map((item) => {
        return item.questionId
      }).join(',')
    } else {
      questionIds = obj.questionId
    }
    let objIds = {
      questionIds
    }
    return objIds
  }
  //  清空
  static empty (obj, state) {
    for (let item in obj) {
      obj[item] = ''
    }
    obj[state] = '0'
    obj['queType'] = '1'
    return obj
  }
  //  修改回显obj目标对象 param原对象
  static backShow (param, obj, name) {
    for (let item in param) {
      for (let items in obj) {
        if (item === items) {
          obj[items] = param[item]
        }
      }
    }
    obj[name] = this.queStatus(obj[name])
    obj['questionId'] = param.questionId
    return obj
  }
  //  状态变更
  static queStatus (state) {
    if (state === '1') {
      state = '0'
    } else {
      state = '1'
    }
    return state
  }
}
