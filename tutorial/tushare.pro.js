const path = require('path')

const axios = require('axios')

const { writeFile } = require('../src/helper/tools')
const { tushareToken } = require('../src/config/tushare')


/**
 * @param {String} api_name 接口名称
 * @param {Object} params 额外参数
 * @todo 参数不规范，驼峰还是下划线
 */
async function getBasicList(api_name, params) {
  const res = await axios.post('http://api.tushare.pro', {
    api_name,
    token: tushareToken,
    params,
    fields: ''
  })
  console.log(res.data)
  const { data: { code, msg, request_id, data: { fields, items } } } = res

  const result = {
    api_name,
    code,
    msg,
    request_id,
    total: items.length,
    fields,
    items
  }
  await writeFile({
    fileName: api_name + '.json',
    data: result,
    output: path.resolve(__dirname, '../data/tushare')
  })
}



/**
 * @description 股票列表 获取基础信息数据，包括股票代码、名称、上市日期、退市日期等 `https://tushare.pro/document/2?doc_id=25`
 * @see https://tushare.pro/
 * @see http://api.waditu.com
 */
// getBasicList('stock_basic', {'list_status': 'L'})

/**
 * @description 获取上市公司`前十大股东`数据，包括持有数量和比例等信息 `https://tushare.pro/document/2?doc_id=61`
 */
// getBasicList('top10_holders', {ts_code: '600000.SH'})
