
### page.pdf配置项

```js
async function options(page, options) {

  await page.pdf({
    path: path.resolve(books_mdn, fileName),
    printBackground: true, // 是否打印背景图
    width: '1520px',
    // format: 'A2', // A2
    // displayHeaderFooter: true, // 显示页眉和页脚
    // headerTemplate: '<span style="font-size: 30px; width: 200px; height: 200px; background-color: black; color: white; margin: 20px;">url</span>',
    // footerTemplate: '<span style="font-size: 30px; width: 50px; height: 50px; background-color: red; color:black; margin: 20px;">Footer date</span>',
    // margin: {
    //   top: '50px',
    //   right: '20px',
    //   bottom: '20px',
    //   left: '20px'
    // }
    // marginTop: '100px',
    // marginRight: '500px',
    // marginBottom: '1000px'
  });

}
```