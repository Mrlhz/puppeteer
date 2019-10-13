const path = require('path')

const TurndownService = require('turndown')

const { readDirFiles, readFile, writeFile } = require('../src/helper/tools')

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
})

// turndownService.addRule('tables', {
//   filter: ['th', 'td', 'tr'],
//   replacement: function (content, node) {
//     console.log(node.nodeName);
//     if (node.nodeName.toLowerCase() === 'tr') {
//       return content + '\r\n'
//     } else {
//       return content + ' | '
//     }
//   }
// })

// add ```js ```
turndownService.addRule('pre', {
  filter: ['pre'],
  replacement: function (content, node) {
    return '```js' + '\r\n' + content + '\r\n' + '```'
  }
})

/**
 * @description 符合html string => markdown
 *
 */
async function html2markdown(dir, output) {
  const files = await readDirFiles(dir)
  // const htmls = files.filter((html) => html.split('.')[1] === 'html')
  const htmls = files.filter((html) => path.extname(html) === '.html')
  // htmls.forEach(async (file, index) => {})

  for (let i = 0; i < htmls.length; i++) {
    const file = htmls[i]
    const pathName = path.resolve(dir, file)
    const { name } = path.parse(pathName)
    const txt = await readFile(pathName)

    const markdown = turndownService.turndown(txt)

    const md = name + '.md'
    await writeFile({
      fileName: md,
      data: markdown,
      output: output || path.resolve(dir)
    })
  }
}


// html2markdown('D:/books/mdn/html/promise')
// html2markdown('D:/books/mdn/html/ahead/html', 'D:/books/mdn/html/ahead/md')
// html2markdown('D:/books/mdn/html/javascript基础教程/html', 'D:/books/mdn/html/javascript基础教程/md')

// html2markdown('D:/books/mdn/html/test', 'D:/books/mdn/html/test')
