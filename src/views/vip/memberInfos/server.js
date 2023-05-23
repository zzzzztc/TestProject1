// import https from './https' name: 方法名 callback: 回调
// 数据处理类
export class Server {
  constructor () {
    this.idCardInfoList = []
  }
  static addList (list) {
    let idCardInfoList = []
    for (let i = 0; i < list.length; i++) {
      if (list[i] !== '') {
        idCardInfoList.push({
          cardType: list[i]
        })
      }
    }
    // console.log(idCardInfoList)
  }
}
