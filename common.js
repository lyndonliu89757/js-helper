/* 字符串格式化 */
// eslint-disable-next-line
String.prototype.format = function() {
  let s = this
  if (arguments.length === 0) return s
  for (let i = 0; i < arguments.length; i++) {
    s = s.replace(new RegExp('\\{' + i + '\\}', 'g'), arguments[i])
  }
  return s
}
