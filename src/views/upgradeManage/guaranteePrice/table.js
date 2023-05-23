export function tableHeight (param) {
  // console.log(param)
  // console.log(document.getElementById(param))
  let tableHeight = null
  let paramHeight = null
  if (param) {
    paramHeight = document.getElementById(param).offsetHeight
  } else {
    paramHeight = 0
  }
  // console.log(paramHeight)
  tableHeight = document.documentElement.clientHeight - paramHeight - 110
  return tableHeight
}
