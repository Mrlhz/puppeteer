const querystring = require('querystring')

const axios = require('axios')

const { writeFile } = require('../../helper/tools')
const { movie_dir } = require('../../config/index')

const baseUrl = 'https://movie.douban.com/j/search_tags?'
const movie_url = 'https://movie.douban.com/j/search_tags?type=movie&source='
const tv_url = 'https://movie.douban.com/j/search_tags?type=tv&source='

async function getTags(url) {
  const res = await axios.get(url)
  const { data: { tags } } = res
  return tags
}


async function index(params) {
  const urls = params.map((param) => baseUrl + querystring.stringify({type: param, source: ''}))
  const getTag = await urls.map((url) => getTags(url))
  
  const tags = await Promise.all(getTag)
  const result = params.reduce((acc, cur, index) => {
    acc[cur] = tags[index]
    return acc
  }, {})
  writeFile('tags.json', result, {
    output: movie_dir
  })
}

index(['movie', 'tv'])
// getTags(tv_url)
