镜像网站：[`GitHub Page`](https://jaywcjlove.github.io/free-font/) | [`Githack`](https://raw.githack.com/jaywcjlove/free-font/main/docs/index.html) | [`Vercel`](https://free-font.vercel.app) | ~~[`Netlify`](https://freefont.netlify.app)~~
<br />
<br />
<br />
<div align="center">
  <a href="https://wangchujiang.com/free-font/">
	  <img src="https://github.com/user-attachments/assets/e050dbf1-464c-44ac-89a8-eaf21490200c" alt="收录商用免费汉字(英文)字体 Free Font">
  </a>
	<br />
  <br />
  <br />
  <h1>收录商用免费字体</h1>
</div>

[![Buy me a coffee](https://img.shields.io/badge/Buy_Me_a_Coffee-ffdd00?logo=buy-me-a-coffee&logoColor=black)](https://jaywcjlove.github.io/#/sponsor)
[![CI](https://github.com/jaywcjlove/free-font/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/free-font/actions/workflows/ci.yml)
[![Docker Image Version (latest by date)](https://img.shields.io/docker/v/wcjiang/free-font)](https://hub.docker.com/r/wcjiang/free-font)
[![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/wcjiang/free-font)](https://hub.docker.com/r/wcjiang/free-font)
[![Docker Pulls](https://img.shields.io/docker/pulls/wcjiang/free-font)](https://hub.docker.com/r/wcjiang/free-font)

本项目基于已不再维护的 [字集](https://github.com/wordshub/free-font) 开源项目，旨在收集汉字字体。我创建了这个新项目，并新增了自动生成字体预览封面的脚本，还重新添加了许多中文字体以及一些开源英文字体，以方便《[字帖宝宝](https://github.com/jaywcjlove/copybook-generator)》用户下载和使用。

汉字字体的制作是一项庞大的工程。常用汉字有 6763 个，GBK 标准中有 20902 个，而最新的 GB18030-2022 标准则包含超过 80,000 个字符。由于汉字的复杂性，制作一套完整的中文字体需要大量的专业人士投入精力和时间。我们鼓励大家使用正版字体，共同为中文字体的制作创造一个良好的环境。

所有字体的版权归原作者所有。本站不承担任何法律问题或风险，且不用于商业目的。如果您认为您的版权受到侵犯，请及时联系我，我将立即采取删除措施。本站收集了商用免费字体，但无法完全保证所有收录的字体都不涉及商业用途。若发现有误，请及时提醒我。使用本站内容所产生的风险由用户自行承担。使用本站即表示您已接受本站的使用条款和隐私政策。

> [!CAUTION]
> 
> ⚠️ 由于字体文件超过了 1GB，且流量超出了免费使用的界限，导致产生了几十美元的费用。目前我们没有任何捐赠，所以无法承担这些费用。因此，决定取消预览页面下面的字体预览功能。虽然这可能会导致 GitHub 文件下载速度稍慢，但使用上不会受到影响。

## 添加商免字体

将字体添加到 [`docs/fonts`](./docs/fonts/) 目录中，在 [`scripts/data.json`](./scripts/data.json) 中添加字体相关信息

```js
{
  // ⚠️ ~~~~ 自动生成 ------- 不需要修改
  "name": "剔骨仿宋", // - 根据【文件名】
  "size": "116 kB",  // - 字体大小
  "byte": 31527296,  // 
  "path": "fonts/其他字体/剔骨仿宋.ttf", // 字体在 web 目录中的位置 - 注意斜杠 `/`
  "ctime": 1721208732892, // 创建时间
  "postscriptName": "tkFangSong",
  "fullName": "tkFangSong",
  "familyName": "tkFangSong",
  "subfamilyName": "Regular",
  "version": "1.000",
  // ⚠️ ~~~~ 自动生成 ------- 不需要修改

  // 分类
  "type": "艺术体",  // 英文字体放入 `docs/fonts/english` 目录即可
  // 许可协议
  "license": "商免", // "授权", "个人免费", "OFL-1.1", "IPA-1.0"
  // 官网/来源
  "home": 'https://zh.osdn.net/projects/jis2004/wiki/FrontPage'
}
```

### 字体分类

`字体` 分类(`type`) `黑体`、`宋体`、`楷体`、`艺术体`、`手绘体`、`英文字体`、`开源字体`，用于网站生成分类页面，英文字体放入 [`docs/fonts/english`](./docs/fonts/english/) 目录自动分类

### 授权方式

**免费商用字体**

免费商用字体指个人或字体开发厂商免费提供给个人和商业机构使用的字体。这些字体不是开源软件，使用前需仔细阅读条款，因为不同厂商对免费商用有不同的限制，有些甚至需要获得授权。此外，厂商有权收回免费商用的权限，因此在使用前需确认该字体是否仍然免费。

### 开源协议

**`GPL-2.0`**

GNU通用公共许可证（GNU General Public License）要求如果你在作品中使用了受制于GPL的字体，那么该作品也必须以GPL许可分发。为避免争议，GPL推出了“GPL字体例外”条款，阻止其影响使用该字体的文件。由于其潜在争议性，使用文泉系列字体需谨慎。

**`OFL-1.1`**

SIL开放字体许可证（SIL Open Font License）由SIL国际制定，不会扩散到使用该字体的作品上，只要求对字体的修改作品以相同许可分发，是开源字体的首选授权条款。

**`IPA-1.0`**

IPA开放字型授权条款由日本IPA制定，符合开放原始码促进会（Open Source Initiative）的开源定义，用于开放字体的使用和分发。

## 本地开发

```sh
$ npm install # 安装依赖
```

⓵ 生成字体预览海报

```sh
# [推荐] [增量]生成 - 字体预览海报
$ npm run one -- ./docs/fonts/english/Prima/Prima-Regular.otf
# [不推荐] 生成所有字体的预览海报
$ npm start   # 生成字体海报 & 生成 html 网站
```

② 生成 HTML，在生成 HTML 之前，可以为字体[添加分类和官网等](#添加商免字体)信息

```sh
$ npm run dev   # 监听模板改变，生成 html 网站
$ npm run build # 生成 html 网站
```

⓷ 字体添加完成，您可以打开 [`docs/index.html`](docs/index.html) 文件在浏览器中预览

如何你的电脑是苹果 M1 芯片，需要检查你的 Node.js 版本是否适用于 arm64，然后切换到 arm64 版本的 nodejs

```sh
$ node -p process.arch # 检查版本，需要 arm64 版本
$ n --arch arm64 current # 当前 nodejs 版本切换到 arm64 版本
$ npx puppeteer browsers install chrome
```

如果您使用的是 `nvm` 通过下面命令切换

```sh
nvm install --arch=arm64 node
nvm use --arch=arm64 node
```

本地大文件提交，首先，你需要安装 [Git LFS](https://git-lfs.com/)，命令安装如下：

```sh
brew install git-lfs # macOS
sudo apt-get install git-lfs # Linux

git lfs install # 初始化 Git LFS

git lfs track "*.ttf" # ⚠️ 会造成[付费]
# 这将创建或更新 .gitattributes 文件，该文件告诉 Git 这些文件应该由 Git LFS 管理
git lfs track "docs/fonts/全字库系列/全字庫正宋體/全字庫正宋體-Ext-B-98_1.ttf"
git lfs track "docs/fonts/全字库系列/全字庫正楷體/全字庫正楷體-Ext-B-98_1.ttf"
```

> [!CAUTION]
> 
> 目前，超过 `50MB` 的字体文件提交已被拒绝，因为这超出了 GitHub 对大文件的存储限制。GitHub 的大文件存储是收费的，而该项目尚未获得任何捐赠支持，无法承担相关费用，因此暂不接受超过 `50MB` 的字体文件提交。

## 镜像网站

文件体积过大，GitHub Pages 已无法实时编辑和预览字体。由于 GitHub 的访问速度无法提升，您可以使用以下镜像网站来访问字体网站。如果您有镜像网站推荐，可以通过 [Issue](https://github.com/jaywcjlove/free-font/issues) 提交，我将把它们列在下面供大家使用：

[`GitHub Page`](https://jaywcjlove.github.io/free-font/) [`Vercel`](https://free-font.vercel.app) [`Githack`](https://raw.githack.com/jaywcjlove/free-font/main/docs/index.html) ~~[`Netlify`](https://freefont.netlify.app)~~

您可以轻松部署字体网站，只需克隆 `main` 分支并部署 [`docs`](./docs/) 目录中的静态资源，或直接使用 [gh-pages](https://github.com/jaywcjlove/free-font/tree/gh-pages) 分支进行静态托管，还可以通过 [Docker 镜像](https://hub.docker.com/r/wcjiang/free-font) 便捷部署。

```shell
docker pull wcjiang/free-font:latest
docker run --name reference --rm -d -p 9677:3000 wcjiang/free-font:latest
# Or
docker run --name reference -itd -p 9677:3000 wcjiang/free-font:latest
```

## License

MIT © [Kenny Wong](https://github.com/jaywcjlove)
