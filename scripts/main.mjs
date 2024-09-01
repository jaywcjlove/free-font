import fs from 'fs-extra';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from "module";
import prettyBytes from 'pretty-bytes';
import { openSync } from 'fontkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fontDatas = createRequire(import.meta.url)("./data.json");

/* 是否存在汉字 */
function containsNoChineseCharacters(str) {
  // 正则表达式匹配中文汉字范围
  const chineseCharacterPattern = /[\u4e00-\u9fa5]/;
  // 测试字符串中是否包含中文汉字
  return !chineseCharacterPattern.test(str);
}

const chineseCharacterContent = `<div class="poem">
  <div class="poem-title">《江雪》<i class="poet">柳宗元</i></div>
  <div class="poem-content">
    千山鸟飞绝，万径人踪灭。<br/>
    孤舟蓑笠翁，独钓寒江雪。
  </div>
</div>
<div class="poem">
  <div class="poem-title">《江雪》<i class="poet">柳宗元</i></div>
  <div class="poem-content">
    千山鳥飛絕，萬徑人蹤滅。<br/>
    孤舟蓑笠翁，獨釣寒江雪。
  </div>
</div>
`;

const englishCharacterContent = `<div class="poem-content" style="font-size: 24px;">The quick brown fox jumps over the lazy dog.</div>`

/** 动态生成字体预览 HTML 内容 */
const generatePreviewHTMLContent = (fontPath, fileName, character = chineseCharacterContent) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @font-face {
      font-family: 'CustomFont';
      src: url('${fontPath}') format('truetype');
      /*src: url('../docs/fonts/美績点陣體/美績点陣體.ttf') format('truetype');*/
    }
    html { height: 100%; }
    body, pre, .poem { font-family: 'CustomFont', sans-serif; }
    body { margin: 0; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background-color: #282828;}
    pre { margin: 0; padding: 0; font-size: 16px;}
    .poem { text-align: center; line-height: 1.5; margin: 20px auto; }
    .poem-title { font-size: 24px; font-weight: bold; margin-bottom: 3px; }
    .poet { font-size: 18px; margin-bottom: 6px; color: #838383; position: absolute; margin-top: 6px;}
    .poem-content { font-size: 20px; }
    .poster { text-align: center; font-size: 38px; color: #ffffff; }
  </style>
  <title>Font Preview</title>
</head>
<body>
  <div class="poster">
    <div>「${fileName}」</div>
    ${character}
    <pre>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</pre>
    <pre>a b c d e f g h i j k l m n o p q r s t u v w x y z</pre>
    <pre>0 1 2 3 4 5 6 7 8 9</pre>
  </div>
</body>
</html>

`;

/** 动态生成 HTML 内容 */
const generateHTMLContent = (fontPath, fileName) => `<!DOCTYPE html><html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @font-face {
      font-family: 'CustomFont';
      src: url('${fontPath}') format('truetype');
      /*src: url('../docs/fonts/美績点陣體/美績点陣體.ttf') format('truetype');*/
    }
    html { height: 100%; }
    body {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: #141414;
      font-family: 'CustomFont', sans-serif;
    }
    .poster > div:first-child { line-height: 1; padding: 0 12px; }
    .poster > div:last-child { font-size: 28px; padding-top: 6px; }
    .poster { text-align: center; font-size: 42px; color: #ffffff; }
  </style>
  <title>Font Preview</title>
</head>
<body>
  <div class="poster">
    <div>${fileName}</div>
    <div>Hello World! 123</div>
  </div>
</body>
</html>
`;

async function createPosterImage(page, filePath, fontName = "") {
  const fontPath = path.relative(__dirname, path.resolve(filePath)).split(path.sep).join("/");
  const htmlFilePath = path.join(__dirname, 'poster.html');
  /// 英文字体
  const isEnglish = fontPath.split(path.sep).includes("english");
  const fontText = isEnglish ? fontName : (containsNoChineseCharacters(fontName) ? `${fontName}字体` : fontName);
  const htmlContent = generateHTMLContent(fontPath, fontText.replace(/-/g, " "));
  fs.writeFileSync(htmlFilePath, htmlContent);

  const fileHTMLPath = `file:${htmlFilePath}`;
  await page.goto(fileHTMLPath, { waitUntil: 'networkidle2' });
  const width = 420;
  const height = 180;
  const deviceScaleFactor = 1;
  await page.setViewport({ width: width, height: height, deviceScaleFactor });
  const buffer = await page.screenshot({ type: 'jpeg' });
  const fileName = `docs/images/${fontName}-poster.jpg`;
  fs.writeFileSync(fileName, buffer);
  console.log(`Image created and saved as \x1b[32;1m${fileName}\x1b[0m! ${filePath}`);

  const htmlPreviewFilePath = path.join(__dirname, 'preview.html');
  const htmlPreviewContent = generatePreviewHTMLContent(fontPath, fontText.replace(/-/g, " "), isEnglish ? englishCharacterContent : chineseCharacterContent);
  fs.writeFileSync(htmlPreviewFilePath, htmlPreviewContent);
  const filePreviewHTMLPath = `file:${htmlPreviewFilePath}`;
  await page.goto(filePreviewHTMLPath, { waitUntil: 'networkidle2' });
  const previewWidth = 760;
  const previewHeight = isEnglish ? 320 : 560;
  const previewDeviceScaleFactor = 2;
  await page.setViewport({ width: previewWidth, height: previewHeight, deviceScaleFactor: previewDeviceScaleFactor});
  const previewBuffer = await page.screenshot({ type: 'jpeg' });
  const filePreviewName = `docs/images/${fontName}-preview.jpg`;
  fs.writeFileSync(filePreviewName, previewBuffer);
  console.log(`Image created and saved as \x1b[32;1m${filePreviewName}\x1b[0m! ${filePath}`);
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
  let argv = process.argv;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  if (argv.includes("-a")) {
    let fontPath = argv[argv.length - 1]
    if (!!fontPath && fontPath !== "-a") {
      let fontName = path.basename(fontPath, path.extname(fontPath)).trim();
      if (fontName) {
        const resultData = [...fontDatas];
        const stat = fs.statSync(fontPath);
        let dataIndex = resultData.findIndex((item) => item.name === fontName)
        var font = openSync(fontPath);
        if (dataIndex === -1) {
          resultData.push({
            name: fontName,
            path: removeRootPathSegment(fontPath),
            size: prettyBytes(stat.size),
            byte: stat.size,
            ctime: stat.ctime.getTime(),
            postscriptName: font.postscriptName,
            fullName: font.fullName,
            familyName: font.familyName,
            subfamilyName: font.subfamilyName,
            version: extractVersion(font.version),
          })
        } else {
          resultData[dataIndex].name = fontName;
          resultData[dataIndex].path = removeRootPathSegment(fontPath);
          resultData[dataIndex].size = prettyBytes(stat.size)
          resultData[dataIndex].byte = stat.size
          resultData[dataIndex].ctime = stat.ctime.getTime()
          resultData[dataIndex].postscriptName = font.postscriptName
          resultData[dataIndex].fullName = font.fullName
          resultData[dataIndex].familyName = font.familyName
          resultData[dataIndex].subfamilyName = font.subfamilyName
          resultData[dataIndex].version = extractVersion(font.version)
        }
        await createPosterImage(page, fontPath, fontName);
        fs.writeFileSync("./scripts/data.json", JSON.stringify(resultData, null, 2));
      }
    } else {
      console.log("Please enter a font file path");
    }
  } else {
    // create all images
    await fs.emptyDir('docs/images');
    const files = await getFontFiles("./docs/fonts");
    const resultData = []
    for (const filename of files) {
      let fontName = path.basename(filename, path.extname(filename)).trim();
      if (!fontName.startsWith("__")) {
        const stat = fs.statSync(filename);
        let data = fontDatas.find((item) => item.name === fontName) || {};
        data.name = fontName;
        data.path = removeRootPathSegment(filename);
        data.size = prettyBytes(stat.size)
        data.byte = stat.size
        data.ctime = stat.ctime.getTime();
        var font = openSync(filename);
        data.postscriptName = font.postscriptName
        data.fullName = font.fullName
        data.familyName = font.familyName
        data.subfamilyName = font.subfamilyName
        data.version = extractVersion(font.version)
        resultData.push(data);
        await createPosterImage(page, filename, fontName);
      } else {
        console.log(`Skip 2 font file: \x1b[35;1m ${filename} \x1b[0m"`);
      }
    }
    fs.writeFileSync("./scripts/data.json", JSON.stringify(resultData, null, 2));
  }
  await browser.close();
})();

/**
 * 版本号获取函数
 * ```
 * "Version 1.000;beta"
 * "Version 1.000;Glyphs 3.1.1 (3148)"
 * "Version 2.0.1"
 * "Version 4.56; 4.5.6.0"
 * "Version 1.00;January 14, 2021;FontCreator 12.0.0.2552 32-bit"
 * "Version 1.015;June 12, 2024;FontCreator 14.0.0.2901 64-bit"
 * null,
 * "Version 3.12"
 * "Version 0.0.1 "
 * ```
 */
function extractVersion(versionString) {
  // 如果输入是 null 或 undefined，则返回 null
  if (!versionString) return null;
  
  // 使用正则表达式匹配 "Version " 后面的版本号
  const match = versionString.match(/Version\s([\d.]+)/);
  
  // 如果匹配成功，返回第一个捕获组（即版本号），否则返回 null
  return match ? match[1] : null;
}