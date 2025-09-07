import fs from 'fs-extra';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { openSync } from 'fontkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const outputDir = path.join(__dirname, '../docs/');

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
    .poem-title { font-size: 32px; margin-bottom: 3px; }
    .poet { font-size: 18px; margin-bottom: 6px; color: #838383; position: absolute; margin-top: 6px;}
    .poem-content { font-size: 32px; }
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
export const generateHTMLContent = (fontPath, fileName) => `<!DOCTYPE html><html lang="en">
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

export async function createPosterImage(page, filePath, fontName = "") {
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

export async function getFontFiles(dirPath) {
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

export function removeRootPathSegment(filePath, outputDir = "") {
  if (outputDir) {
    filePath = path.relative(outputDir, filePath);
  }
  return filePath.split(path.sep).join("/");
}

/**
 * Convert a TrueType Collection (TTC) version number to a more readable format.
 * version: `65536` -> `1.0`
 * @param {number} version 
 * @returns {string}
 */
function convertTTCVersion(version) {
  const major = version >> 16;   // 高16位
  const minor = version & 0xFFFF;  // 低16位
  return `${major}.${minor}`;
}

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
export function extractVersion(versionString) {
  // 如果输入是 null 或 undefined，则返回 null
  if (!versionString) return null;
  
  // 使用正则表达式匹配 "Version " 后面的版本号
  const match = versionString.match(/Version\s([\d.]+)/);
  
  // 如果匹配成功，返回第一个捕获组（即版本号），否则返回 null
  return match ? match[1] : null;
}

/** 
 * 版本号转换
 * @param {number | string} version
 * @param {boolean} isTTC
 * @returns {string | null}
 */
export function convertVersion(version, isTTC = false) {
  if (isTTC) {
    return convertTTCVersion(version);
  }
  return extractVersion(version)
}

/**
 * 获取 TTC 文件中所有字体的信息
 * @param {string} ttcPath - TTC 文件路径
 * @returns {Array} 字体信息数组
 */
export function getTTCFontsInfo(ttcPath) {
  const collection = openSync(ttcPath);
  const fontsInfo = collection.fonts.map(f => {
    return {
      familyName: f.familyName,
      subfamilyName: f.subfamilyName,
      fullName: f.fullName,
      postscriptName: f.postscriptName,
      numGlyphs: f.numGlyphs,
      copyright: f.copyright,
      version: f.version
    };
  });
  return fontsInfo;
}


export function copyrightFormat(copyright) {
  return copyright ? copyright.replace(/[<&"]/g, (c) => (({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c])) : null;
}