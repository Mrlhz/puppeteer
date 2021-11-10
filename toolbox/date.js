
const DAY = 24 * 60 * 60 * 1000

function format(date=new Date()) {
  const isDate = date instanceof Date
  if (!isDate) {
    date = new Date(date)
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const formatNumber = n => n.toString().padStart(2, '0')

  return [year, month, day].map(formatNumber).join('-')
}

/**
 * @description 星期几，1: 星期一, ... 7: 星期日
 * @param {Date} date
 * @returns
 */
function dayOfTheWeek(date) {
  const isDate = date instanceof Date
  if (!isDate) {
    date = new Date(date)
  }
  return date.getDay() || 7
}

/**
 * @description 计算开始时间
 * @param {boolean} [fromMonday=true] 是否从周一算起
 * @param {Date} date
 * @returns
 */
function calcStartTime(fromMonday = true, date) {
  const dateTime = date.getTime()
  const isMonday = fromMonday && dayOfTheWeek(date) === 1
  if (!fromMonday || isMonday) {
    return dateTime
  }
  const week = dayOfTheWeek(date)
  return dateTime - (week - 1) * DAY
}

/**
 * @description 输入日期，获取一周时间
 *
 * @param {Date} [d=Date.now()]
 * @param {boolean} [options={ n: 7, fromMonday: true }] n 取多少天，默认一周； fromMonday 是否从周一算起
 */
function make(d = Date.now(), options = { n: 7, fromMonday: true }) {
  const { n = 7, fromMonday = true } = options
  const date = new Date(d)
  console.log(date.getTime())
  const time = calcStartTime(fromMonday, date) // 开始计算日期
  console.log(time)
  const arr = Array.from({ length: n })
    .map((_, index) => time + DAY * (index))
    .map(item => format(item))
  console.log(arr, arr.length)
}

// make(Date.now(), 7)
// make(new Date(2021, 10, 1), 7)
// make('2021-11-01')
// make('2021-11-01', { n : 7 })
// make('2021-11-13', { n : 7 })
// make('2021-11-13', { n : 7, fromMonday: false })
// make('2021-11-13', { n : 5, fromMonday: false })
// make('2021-11-14', { n : 5, fromMonday: false })
// make('2021-11-14', { n : 5, fromMonday: true })
// make('2021-11-09', { n : 7, fromMonday: true })
make('2021-11-09', { n : 7, fromMonday: false })
