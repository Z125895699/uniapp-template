/*
 * @Author: zhangdi 1258956799@qq.com
 * @Date: 2022-11-19 21:48:35
 * @LastEditors: zhangdi 1258956799@qq.com
 * @LastEditTime: 2022-11-19 21:57:34
 * @FilePath: /demo/auto/addPage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const fs = require("fs");
const path = require("path");

const pagesStr = fs.readFileSync("./src/pages.json", "utf-8");
const pagesJson = JSON.parse(pagesStr);
// tabBar页面
const tabBarPages = pagesJson.pages.map((i) => {
  return {
    type: "tabBarPage",
    name: i.name,
    path: `/${i.path}`,
    title: i.style.navigationBarTitleText,
  };
});
// 二级页面
const subPages = pagesJson.subPackages.flatMap((i) => {
  return i.pages.map((x) => {
    return {
      type: "subPage",
      name: x.name,
      path: `/${i.root}/${x.path}`,
      title: x.style.navigationBarTitleText,
    };
  });
});
// 当前已有页面
const pages = [...tabBarPages, ...subPages];
console.log(pages, "pages");
// 当前已创建文件
const filesList = fs.readdirSync("./src/pages");
// 获取需要新增的页面  =>取差集
const newPages = pages.filter((i) => !filesList.includes(i.name));
// 添加新路由
function addPages(pages) {
  for (const page of pages) {
    const { name, title } = page;
    const dirPath = `./src/pages/${name}`;
    fs.mkdirSync(dirPath);
    const filePath = `${dirPath}/${name}.vue`;
    const createStream = fs.createWriteStream(filePath);

    const template = `<template>
      <view>${title}</view>
    </template>
    
    <script>
      export default {
        data() {
          return {
            title: 'Hello'
          }
        },
        onLoad() {

        },
        methods: {

        }
      }
    </script>

    <style scoped></style>`;
    createStream.write(template);
    createStream.end();
    console.log("\x1B[34m", `pages ${name} created successfully.`);
  }
  console.log("\x1B[32m%s\x1B[39m", "\n All files are created successfully.\n");
}

addPages(newPages);
