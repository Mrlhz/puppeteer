const path = require('path')

const TurndownService = require('turndown')

const { readDirFiles, readFile, writeFile } = require('../src/helper/tools')

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
})

turndownService.addRule('tables', {
  filter: ['th', 'td', 'tr'],
  replacement: function (content, node) {
    console.log(node.nodeName);
    if (node.nodeName.toLowerCase() === 'tr') {
      return content + '\r\n'
    } else {
      return content + ' | '
    }
  }
})

/**
 * @description 符合html string => markdown
 *
 */
async function html2markdown(dir) {
  const files = await readDirFiles(dir)
  // const htmls = files.filter((html) => html.split('.')[1] === 'html')
  const htmls = files.filter((html) => path.extname(html) === '.html')
  htmls.forEach(async (file, index) => {
    // const [value, ext] = file.split('.')
    const value = file.split('.')[0]
    const pathName = path.resolve(dir, file)
    const txt = await readFile(pathName)

    const markdown = turndownService.turndown(txt)

    const md = value + '.md'
    await writeFile({
      fileName: md,
      data: markdown,
      output: path.resolve(dir)
    })
  })
}


html2markdown('D:\\books\\mdn\\html')
