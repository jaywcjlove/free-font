import fs from 'fs-extra';
import path from 'path';
import puppeteer from 'puppeteer';
import { createRequire } from "module";
import prettyBytes from 'pretty-bytes';
import { openSync } from 'fontkit';

import { createPosterImage, removeRootPathSegment, getFontFiles, outputDir } from './utils.mjs';

const fontDatas = createRequire(import.meta.url)("./data.json");

;(async () => {
  let argv = process.argv;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  /// 获取单个字体信息
  if (argv.includes("-i")) {
    let fontPath = argv[argv.length - 1]
    if (!!fontPath && fontPath !== "-i") {
      const resultData = [...fontDatas];
      const fontName = path.basename(fontPath, path.extname(fontPath)).trim();
      const dataIndex = resultData.findIndex((item) => item.name === fontName)
      const font = openSync(fontPath);
      if (dataIndex > -1) {
        if (font.copyright) {
          resultData[dataIndex].copyright = font.copyright
            .replace(/[<&"]/g, (c) => (({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]));
        }
        resultData[dataIndex].numGlyphs = font.numGlyphs;
      }
      fs.writeFileSync("./scripts/data.json", JSON.stringify(resultData, null, 2));
    }
    return process.exit(1);;
  }
  /// 获取所有字体信息
  if (argv.includes("-info")) {
    const resultData = [...fontDatas];
    for (const item in resultData) {
      const fontPath = path.join(outputDir, resultData[item].path);
      const font = openSync(fontPath);
      if (font.copyright) {
        resultData[item].copyright = font.copyright
            .replace(
              /[<&"]/g,
              (c) => (({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]),
            );
      }
      resultData[item].numGlyphs = font.numGlyphs;
      console.log(`Update font info: \x1b[35;1m ${resultData[item].name} \x1b[0m"`);
    }
    fs.writeFileSync("./scripts/data.json", JSON.stringify(resultData, null, 2));
    return process.exit(1);
  }
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
            path: removeRootPathSegment(fontPath, outputDir),
            size: prettyBytes(stat.size),
            byte: stat.size,
            ctime: stat.ctime.getTime(),
            postscriptName: font.postscriptName,
            fullName: font.fullName,
            familyName: font.familyName,
            subfamilyName: font.subfamilyName,
            version: extractVersion(font.version),
            copyright: font.copyright ? font.copyright.replace(/[<&"]/g, (c) => (({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c])) : null,
            /// 字体中的字形数量
            numGlyphs: font.numGlyphs,
          })
        } else {
          resultData[dataIndex].name = fontName;
          resultData[dataIndex].path = removeRootPathSegment(fontPath, outputDir);
          resultData[dataIndex].size = prettyBytes(stat.size)
          resultData[dataIndex].byte = stat.size
          resultData[dataIndex].ctime = stat.ctime.getTime()
          resultData[dataIndex].postscriptName = font.postscriptName
          resultData[dataIndex].fullName = font.fullName
          resultData[dataIndex].familyName = font.familyName
          resultData[dataIndex].subfamilyName = font.subfamilyName
          resultData[dataIndex].version = extractVersion(font.version)
          resultData[dataIndex].copyright = font.copyright ? font.copyright.replace(/[<&"]/g, (c) => (({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c])) : null
          resultData[dataIndex].numGlyphs = font.numGlyphs
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