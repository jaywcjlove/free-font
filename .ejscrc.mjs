import { minify } from 'html-minifier-next';
import { writeFileSync } from "fs"
import prettyBytes from 'pretty-bytes';
import prettier from 'prettier';
import { parsers as htmlPlugin } from 'prettier/plugins/html';
import { parsers as postcssPlugin } from 'prettier/plugins/postcss';
import * as estreePlugin from 'prettier/plugins/estree';
import { parsers as babelPlugin } from 'prettier/plugins/babel';
import { parsers as typescriptPlugin } from 'prettier/plugins/typescript';
import { parsers as acornPlugin } from 'prettier/plugins/acorn';
import datas from './scripts/data.json' with { type: "json" };
import { toImageName } from './scripts/utils.mjs';
import { SITE_ORIGIN, seoPath, buildSitemap, robotsTxt } from './scripts/seo.mjs';

const total = datas.reduce((sum, item) => sum + (item.byte ?? 0), 0);

/**
 * @type {import('@wcj/ejs-cli').Options}
 */
export default {
  sitemap: true,
  sitemapPrefix: "https://wangchujiang.com/free-font/",
  homepage: "https://jaywcjlove.github.io/free-font/",
  "globalData": {
    "docker": false,
    "totalBytes": prettyBytes(total),
    "toImageName": toImageName,
    "siteOrigin": SITE_ORIGIN,
    "seoPath": seoPath,
    "myapp": [
      {
        "href": "https://wangchujiang.com/dock-lift/",
        "title": "DockLift: 点击 Dock 应用窗口回到当前屏幕",
        "image":"dock-lift.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6766860898",
        "title": "Zipora: Zip/RAR/7Z 解压工具",
        "image":"zipora.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6758053530",
        "title": "Scap: Screenshot & Markup Edit for macOS",
        "image":"scap.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6757317079",
        "title": "Screen Test for macOS",
        "image":"screen-test.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6755948110",
        "title": "Deskmark for macOS",
        "image":"deskmark.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6500434773",
        "title": "Keyzer for macOS",
        "image":"keyzer.png"
      },
      {
        "href": "https://wangchujiang.com/vidwall-hub/",
        "title": "Vidwall Hub for macOS",
        "image":"vidwall-hub.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=VidCrop/6752624705",
        "title": "VidCrop for macOS",
        "image":"vidcrop.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=Vidwall/6747587746",
        "title": "Vidwall for macOS",
        "image":"vidwall.png"
      },
      {
        "href": "https://wangchujiang.com/mousio-hint/",
        "title": "Mousio Hint for macOS",
        "image":"mousio-hint.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6746747327",
        "title": "Mousio for macOS",
        "image":"mousio.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6745227444",
        "title": "Musicer for macOS",
        "image":"musicer.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6743841447",
        "title": "Audioer for macOS",
        "image":"audioer.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6744690194",
        "title": "FileSentinel for macOS",
        "image":"file-sentinel.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6743495172",
        "title": "FocusCursor for macOS",
        "image":"focus-cursor.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6742680573",
        "title": "Videoer for macOS",
        "image":"videoer.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6740425504",
        "title": "KeyClicker for macOS",
        "image":"key-clicker.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6739052447",
        "title": "DayBar for macOS",
        "image":"daybar.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6739444407",
        "title": "Iconed for macOS",
        "image":"iconed.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6737160756",
        "title": "Menuist for macOS",
        "image":"menuist.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6723903021",
        "title": "Paste Quick for macOS",
        "image":"paste-quick.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6670696072?platform=mac",
        "title": "Quick RSS for macOS/iOS",
        "image":"quick-rss.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6670167443?platform=mac",
        "title": "Web Serve for macOS",
        "image":"web-serve.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6503953628",
        "title": "Copybook Generator for macOS",
        "image":"copybook-generator.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6471227008",
        "title": "DevTutor for macOS",
        "image":"devtutor.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6479819388?platform=mac",
        "title": "RegexMate for macOS/iOS",
        "image":"regex-mate.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6479194014?platform=mac",
        "title": "Time Passage for macOS/iOS",
        "image":"time-passage.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6478772538",
        "title": "IconizeFolder for macOS",
        "image":"iconize-folder.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6478511402?platform=mac",
        "title": "Textsound Saver for macOS/iOS",
        "image":"textsound-saver.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6476924627",
        "title": "Create Custom Symbols for macOS",
        "image":"create-custom-symbols.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6476452351",
        "title": "DevHub for macOS",
        "image":"devhub.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6476400184",
        "title": "Resume Revise for macOS",
        "image":"resume-revise.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6472593276",
        "title": "Palette Genius for macOS",
        "image":"palette-genius.png"
      },
      {
        "href": "https://jaywcjlove.github.io/maslink/?id=6470879005",
        "title": "Symbol Scribe for macOS",
        "image":"symbol-scribe.png"
      }
    ]
  },
  "data": {
    "templates/_details.ejs": "./scripts/data.json",
    "templates/index.ejs": "./scripts/data.json",
    "templates/kai.ejs": "./scripts/data.json",
    "templates/song.ejs": "./scripts/data.json",
    "templates/hei.ejs": "./scripts/data.json",
    "templates/art.ejs": "./scripts/data.json",
    "templates/handwriting.ejs": "./scripts/data.json",
    "templates/english.ejs": "./scripts/data.json",
    "templates/open-source.ejs": "./scripts/data.json",
    "templates/preview.ejs": "./scripts/data.json",
    "templates/preview.en.ejs": "./scripts/data.json"
  },
  beforeSaveHTML: async (html, output, filename, isWatch) => {
    // if (isWatch == true) {
    //   return html;
    // }
    // Skip expensive minify/prettier for detail pages (1000+ files)
    // to avoid memory pressure during batch template generation
    if (output && output.includes('/details/')) {
      return html;
    }
    const minHTML = await minify(html, {
        collapseWhitespace: true,
        preserveLineBreaks: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeOptionalTags: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyCSS: true,
        minifyJS: true,
    });
    let plugins = [htmlPlugin, estreePlugin];
    let htmlPrettier = await prettier.format(minHTML, {
        parser: "html",
        tabWidth: 2,
        printWidth: 120,
        plugins: plugins
    });
    return htmlPrettier;
  },
  done: (sitemap = "") => {
    const { txt, xml } = buildSitemap(sitemap, datas);
    writeFileSync("./docs/sitemap.txt", txt);
    writeFileSync("./docs/sitemap.xml", xml);
    writeFileSync("./docs/robots.txt", robotsTxt());

    const now = new Date();
    const lastUpdateContent = `// Auto-generated by build process
window.LAST_UPDATE_DATE = new Date('${now.toISOString()}');
window.FONT_COUNT = ${datas.length};
window.FONT_TOTAL_SIZE = ${JSON.stringify(prettyBytes(total))};

(function () {
  if (window.FONT_COUNT != null) {
    document.querySelectorAll("[data-font-count]").forEach(function (el) {
      el.textContent = window.FONT_COUNT;
    });
  }
  if (window.FONT_TOTAL_SIZE) {
    document.querySelectorAll("[data-font-total-size]").forEach(function (el) {
      el.textContent = window.FONT_TOTAL_SIZE;
    });
  }
})();
`;
    writeFileSync("./docs/js/last-update.js", lastUpdateContent);

    console.log('🎉 Build process completed successfully!');
  }
}
