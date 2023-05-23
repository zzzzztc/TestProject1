
//  正则
const regs = {
  'price': (str) => {
    let a = /^[0-9]*(\.[0-9]{1,2})?$/
    if (!a.test(str)) {
      return '1'
    } else {
      return '2'
    }
  }
}

export default regs
