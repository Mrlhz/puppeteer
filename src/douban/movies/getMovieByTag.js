const utils = require('util')

const c = require('ansi-colors')

const { wait, writeFile } = require('../../helper/tools')
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
async function getMovieByTag(types, options) {
  const { sort = sorts['rank'], output } = options
  const urls = types.map((type) => utils.format(baseUrl, type))
  console.log(urls)
  const instance = new Browser()

  for (let i = 0; i < urls.length; i++) {
    const page = await instance.goto(urls[i])

    try {
      const data = await page.evaluate(() => {
        const pre = document.querySelector('body pre')
        return pre.innerHTML
      })
      const { subjects } = JSON.parse(data)
      const result = {
        type: types[i],
        sort,
        total: subjects.length,
        subjects
      }
      writeFile(types[i] + '.min.json', result, {
        output
      })
    } catch (e) {
      log(c.red(e))
    }
    await wait(5000)
  }
  await instance.close()
}

/**
 * `选电影`
 */
// getMovieByTag(movie, {
//   sort: sorts['rank'],
//   output: movie_min_dir
// })


/**
 * `热门电视剧`
 */
// getMovieByTag(tv, {
//   sort: sorts['rank'],
//   output: tv_min_dir
// })


function handleUrls(options={}) {
  let {
    type = 'tv', tag = '热门', sort = 'rank', page_limit = 100, page_start = 0, end = 500,
    url = 'https://movie.douban.com/j/search_subjects?type=%s&tag=%s&sort=%s&page_limit=%s&page_start=%s'
  } = options
  let urls = []
  for (let i = page_start; i < end; i += page_limit) {
    urls.push(utils.format(url, type, tag, sort, page_limit, i))
  }
  return urls
}

handleUrls()

// 1. urls
// [ 'https://movie.douban.com/explore#!type=movie&tag=热门&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=最新&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=经典&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=可播放&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=豆瓣高分&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=冷门佳片&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=华语&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=欧美&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=韩国&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=日本&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=动作&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=喜剧&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=爱情&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=科幻&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=悬疑&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=恐怖&page_limit=500&page_start=0',
//   'https://movie.douban.com/explore#!type=movie&tag=文艺&page_limit=500&page_start=0' ]