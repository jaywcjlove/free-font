import { createCanvas, registerFont } from 'canvas';
import fs from 'fs-extra';
import path from 'path';
//import data from './data.json' assert { type: 'json' };

import { createRequire } from "module";
const fontDatas = createRequire(import.meta.url)("./data.json");

function containsNoChineseCharacters(str) {
  // 正则表达式匹配中文汉字范围
  const chineseCharacterPattern = /[\u4e00-\u9fa5]/;
  // 测试字符串中是否包含中文汉字
  return !chineseCharacterPattern.test(str);
}

function createPosterImage(filePath, fontName = "") {
    // 注册自定义字体
    registerFont(filePath, { family: fontName });
    
    const width = 420;
    const height = 180;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    context.fillStyle = '#141414'; // 白色背景
    context.fillRect(0, 0, width, height);


    context.font = `48px "${fontName}"`;
    context.fillStyle = '#ffffff'; // 黑色文本
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    let fontText = containsNoChineseCharacters(fontName) ? `${fontName}字体` : fontName;
    // const text = 'Hello, World!\n 你好世界！';
    context.fillText(fontText, width / 2, height / 2  - 16, width - 25);

    context.font = `32px "${fontName}"`;
    context.fillText("Hello World!", width / 2, height / 2 + 28, width);

    // 保存图片到文件
    const buffer = canvas.toBuffer('image/jpeg');
    const fileName = `docs/images/${fontName}-poster.jpg`;
    fs.writeFileSync(fileName, buffer);
    console.log(`Image created and saved as ${fileName}! ${filePath}`);
}

async function getFontFiles(dirPath) {
  let fontFiles = [];
  const fontExtensions = ['.ttf', '.otf'];
  async function traverseDirectory(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    for (let entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        await traverseDirectory(fullPath);
      } else if (fontExtensions.includes(path.extname(entry.name).toLowerCase())) {
        fontFiles.push(fullPath);
      }
    }
  }
  await traverseDirectory(dirPath);
  return fontFiles;
}

function removeRootPathSegment(filePath) {
  const segments = filePath.split(path.sep);
  if (segments.length > 1) {
      segments.shift(); // 移除第一个路径段
  }
  return segments.join(path.sep);
}

;(async () => {
  await fs.emptyDir('docs/images');
  const files = await getFontFiles("./docs/fonts");
  const resultData = []
  for (const filename of files) {
    let fontName = path.basename(filename, path.extname(filename)).trim();
    if (!fontName.startsWith("__")) {
      let data = fontDatas.find((item) => item.fontName === fontName) || {};
      data.name = fontName;
      data.path = removeRootPathSegment(filename);
      resultData.push(data);
      await createPosterImage(filename, fontName);
    } else {
      console.log(`Skip 2 font file: \x1b[35;1m ${filename} \x1b[0m"`);
    }
  }
  fs.writeFileSync("./scripts/data.json", JSON.stringify(resultData, null, 2));
})();