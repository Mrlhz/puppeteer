const utils = require('util')

const c = require('ansi-colors')

const { wait, writeFile } = require('../../helper/tools')
const { makeMovieUrls } = require('../../helper/urls')
const { movie_min_dir, tv_min_dir } = require('../../config/index')
const { Browser } = require('../../helper/browser')

const { movie, tv } = require('../../../data/movie/tags.json')

const baseUrl = 'https://movie.douban.com/j/search_subjects?type=movie&tag=%s&sort=rank&page_limit=1000&page_start=0'

const sorts = {
  'recommend': '按热度排序',
  'time': '按时间排序',
  'rank': '按评价排序'
}
const log = console.log

/**
 * @description 获取电影和电视剧简略信息
 * @param {Array} types
 * @param {Object} options
 * @todo 一次请求1000条数据返回条目有限制
 */
async function getMovieAndTvByTag(urls, options) {
  const { type, tag, sort = sorts['rank'], output } = options
  const list = []
  const instance = new Browser()

  for (let i = 0; i < urls.length; i++) {
    const page = await instance.goto(urls[i])

    try {
      const data = await page.evaluate(() => {
        const pre = document.querySelector('body pre')
        return pre.innerHTML
      })
      const { subjects } = JSON.parse(data)
      if(!subjects || subjects.length === 0) {
        log(c.red('subjects length: 0'))
        break
      }
      list.push(...subjects)
    } catch (e) {
      log(c.red(e))
    }
    await wait(5000)
  }
  const result = {
    type, // tv || movie
    tag,
    sort, // default '按评价排序'
    total: list.length,
    msg: '数据来源于网络整理，仅供学习。',
    subjects: list
  }
  writeFile({
    fileName: tag + '.min.json',
    data: result,
    output
  })
  await instance.close()
}

async function main(types, options={}) {
  const { type = 'tv', sort = 'rank', output = __dirname } = options
  for (let i = 0; i < types.length; i++) {
    const urls = makeMovieUrls({tag: types[i], sort, type })
    log(urls)
    await getMovieAndTvByTag(urls, {
      type,
      tag: types[i],
      sort: sorts[sort],
      output
    })
    if (url.length > 1) {
      await wait(3500)
    }
  }
}


/**
 * `选电影`
 */
// main(movie, {
//   type: 'movie',
//   output: movie_min_dir
// })


/**
 * `热门电视剧`
 */
// main(['热门'], {
//   type: 'tv',
//   output: tv_min_dir
// })

main(tv, {
  type: 'tv',
  output: tv_min_dir
})
