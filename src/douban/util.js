/**
 * @description 辅助函数，展开折叠内容
 * @param {*} page
 * @param {*} [list=[]]
 */
async function showAll(page, list = []) {
  for (const item of list) {
    let node = await page.$(item)
    if (node) await page.click(item)
  }
}

async function save(model, item) {
  
}

module.exports = {
  showAll
}