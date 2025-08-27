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
  console.log("outputDir", outputDir)
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
            path: removeRootPathSegment(fontPath, outputDir),
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
          resultData[dataIndex].path = removeRootPathSegment(fontPath, outputDir);
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