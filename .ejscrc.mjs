import { minify } from 'html-minifier-next';

/**
 * @type {import('@wcj/ejs-cli').Options}
 */
export default {
  sitemap: true,
  sitemapPrefix: "https://wangchujiang.com/free-font/",
  homepage: "https://jaywcjlove.github.io/free-font/",
  "globalData": {
    "docker": false,
    "myapp": [
      {
        "href": "https://apps.apple.com/app/Vidwall/6747587746",
        "title": "Vidwall for macOS",
        "image":"vidwall.png"
      },
      {
        "href": "https://wangchujiang.com/mousio-hint/",
        "title": "Mousio Hint for macOS",
        "image":"mousio-hint.png"
      },
      {
        "href": "https://apps.apple.com/app/6746747327",
        "title": "Mousio for macOS",
        "image":"mousio.png"
      },
      {
        "href": "https://apps.apple.com/app/6745227444",
        "title": "Musicer for macOS",
        "image":"musicer.png"
      },
      {
        "href": "https://apps.apple.com/app/6743841447",
        "title": "Audioer for macOS",
        "image":"audioer.png"
      },
      {
        "href": "https://apps.apple.com/app/6744690194",
        "title": "FileSentinel for macOS",
        "image":"file-sentinel.png"
      },
      {
        "href": "https://apps.apple.com/app/6743495172",
        "title": "FocusCursor for macOS",
        "image":"focus-cursor.png"
      },
      {
        "href": "https://apps.apple.com/app/6742680573",
        "title": "Videoer for macOS",
        "image":"videoer.png"
      },
      {
        "href": "https://apps.apple.com/app/6740425504",
        "title": "KeyClicker for macOS",
        "image":"key-clicker.png"
      },
      {
        "href": "https://apps.apple.com/app/6739052447",
        "title": "DayBar for macOS",
        "image":"daybar.png"
      },
      {
        "href": "https://apps.apple.com/app/6739444407",
        "title": "Iconed for macOS",
        "image":"iconed.png"
      },
      {
        "href": "https://apps.apple.com/app/6737160756",
        "title": "Menuist for macOS",
        "image":"menuist.png"
      },
      {
        "href": "https://apps.apple.com/app/6723903021",
        "title": "Paste Quick for macOS",
        "image":"paste-quick.png"
      },
      {
        "href": "https://apps.apple.com/app/6670696072",
        "title": "Quick RSS for macOS/iOS",
        "image":"quick-rss.png"
      },
      {
        "href": "https://apps.apple.com/app/6670167443",
        "title": "Web Serve for macOS",
        "image":"web-serve.png"
      },
      {
        "href": "https://apps.apple.com/app/6503953628",
        "title": "Copybook Generator for macOS",
        "image":"copybook-generator.png"
      },
      {
        "href": "https://apps.apple.com/app/6471227008",
        "title": "DevTutor for macOS",
        "image":"devtutor.png"
      },
      {
        "href": "https://apps.apple.com/app/6479819388",
        "title": "RegexMate for macOS/iOS",
        "image":"regex-mate.png"
      },
      {
        "href": "https://apps.apple.com/app/6479194014",
        "title": "Time Passage for macOS/iOS",
        "image":"time-passage.png"
      },
      {
        "href": "https://apps.apple.com/app/6478772538",
        "title": "IconizeFolder for macOS",
        "image":"iconize-folder.png"
      },
      {
        "href": "https://apps.apple.com/app/6478511402",
        "title": "Textsound Saver for macOS/iOS",
        "image":"textsound-saver.png"
      },
      {
        "href": "https://apps.apple.com/app/6476924627",
        "title": "Create Custom Symbols for macOS",
        "image":"create-custom-symbols.png"
      },
      {
        "href": "https://apps.apple.com/app/6476452351",
        "title": "DevHub for macOS",
        "image":"devhub.png"
      },
      {
        "href": "https://apps.apple.com/app/6476400184",
        "title": "Resume Revise for macOS",
        "image":"resume-revise.png"
      },
      {
        "href": "https://apps.apple.com/app/6472593276",
        "title": "Palette Genius for macOS",
        "image":"palette-genius.png"
      },
      {
        "href": "https://apps.apple.com/app/6470879005",
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
  beforeSaveHTML: async (html, output, filename) => {
    const minHTML = await minify(html, {
        // collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeOptionalTags: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyCSS: true,
        minifyJS: true,
    });
    return minHTML;
  },
}