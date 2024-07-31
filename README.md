<div align="center">
  <a href="https://wangchujiang.com/free-font/">
	  <img src="https://github.com/user-attachments/assets/e050dbf1-464c-44ac-89a8-eaf21490200c" alt="收录商用免费汉字(英文)字体 Free Font">
  </a>
	<br />
  <h1>收录商用免费字体</h1>
</div>

这个项目基于不再维护的[字集](https://github.com/wordshub/free-font)开源项目收集汉字字体。我建立了这个新项目，重新添加了许多中文字体，还包括一些开源英文字体，方便《[字帖宝宝](https://github.com/jaywcjlove/copybook-generator)》的用户下载和使用字体。

汉字字体制作是一项庞大的工程，常用汉字包含6763个，GBK标准中有20902个，而最新的 GB18030-2022 标准包含八万多个字符。由于汉字的复杂性，制作一套完整的中文字体需要大量专业人士投入精力和时间。我们鼓励大家使用正版字体，为中文字体制作创造一个良好的环境。

## 添加商免字体

将字体添加到 [`docs/fonts`](./docs/fonts/) 目录中，在 [`scripts/data.json`](./scripts/data.json) 中添加字体相关信息

```js
{
  "name": "剔骨仿宋", // ⚠️ 自动生成-不需要修改 - 根据【文件名】
  "size": "116 kB",  // ⚠️ 自动生成-不需要修改 - 文字大小
  "path": "fonts/其他字体/剔骨仿宋.ttf", // ⚠️ 自动生成-不需要修改 字体在 web 目录中的位置 - 注意斜杠 `/`
  // 分类
  "type": "艺术体",  // 英文字体放入 `docs/fonts/english` 目录即可
  // 许可协议
  "license": "商免", // "授权", "个人免费", "OFL-1.1", "IPA-1.0"
  // 官网/来源
  "home": 'https://zh.osdn.net/projects/jis2004/wiki/FrontPage'
}
```

### 字体分类

`字体` 分类(`type`) `黑体`、`宋体`、`楷体`、`艺术体`、`手绘体`，用于网站生成分类页面，英文字体放入 `docs/fonts/english` 目录自动分类

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
# [推荐] 增量生成 - 字体预览海报
$ npm run one ./docs/fonts/english/Prima/Prima-Regular.otf
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

现在`拒绝`大文件提交，因为超过大文件存储空间是收费的

## License

MIT © [Kenny Wong](https://github.com/jaywcjlove)
