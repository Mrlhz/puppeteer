
function format(date=new Date()) {
  const isDate = date instanceof Date
  if (!isDate) {
    date = new Date(date)
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const formatNumber = n => {
    n = n.toString()
    return n.padStart(2, '0')
  }

  return [year, month, day].map(formatNumber).join('-')
}

// 星期几
function dayOfTheWeek(date) {
  const isDate = date instanceof Date
  if (!isDate) {
    date = new Date(date)
  }
  return date.getDay() || 7
}

function startDate(fromMonday = true, date) {
  if (!fromMonday) {
    return date.getTime()
  }
  if (fromMonday && dayOfTheWeek(date) === 1) {
    return date.getTime()
  }
  const week = dayOfTheWeek(date)
  return date.getTime() - (week - 1) * 24 * 60 * 60 * 1000
}


function make(d = Date.now(), options = { n : 7 }) {
  const { n, fromMonday = true } = options
  const date = new Date(d)
  console.log(date.getTime())
  const time = startDate(fromMonday, date)
  console.log(time)
  const oneDay = 24 * 60 * 60 * 1000
  const arr = Array.from({ length: n })
    .map((_, index) => {
      // includeCurrent
      return time + oneDay * (index)
    })
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
make('2021-11-08', { n : 23, fromMonday: false })
