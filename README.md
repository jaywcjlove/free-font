<div align="center">
	<br />
	<br />
  <h1>收录商用免费汉字字体</h1>
  <a href="https://wangchujiang.com/free-font/">
	  <img src="https://github.com/user-attachments/assets/e050dbf1-464c-44ac-89a8-eaf21490200c" alt="收录商用免费汉字字体 Free Font">
  </a>
	<br />
	<br />
</div>

当前项目收集的汉字字体基于[字集](https://github.com/wordshub/free-font)开源项目。由于原项目已不再维护，我建立了这个新项目，为《[字帖宝宝](https://github.com/jaywcjlove/copybook-generator)》的用户提供字体下载和使用的便利。

汉字字体制作是一项庞大的工程。常用汉字字库表包含 6763 个汉字，GBK 标准中共有 20902 个汉字，而最新出版的 GB_18064 标准则包含六万多个字符。由于汉字的字形复杂，完成一套中文字体需要耗费大量专业人士的精力和时间。我们提倡大家使用正版字体，为中文字体制作创造一个良性的环境。

## 添加商免字体

将字体添加到 [`web/fonts`](./web/fonts/) 目录中，在 [`scripts/data.json`](./scripts/data.json) 中添加字体相关信息

```js
{
  "name": "和田研中丸P",   // 根据【文件名】自动生成 - 不需要修改
  // 分类
  "type": "艺术字体",
  // 许可协议
  "license": "商免",
  // 字体在 web 目录中的位置 - 注意斜杠 `/`
  "path": "fonts/其他字体/和田研字体/和田研中丸.ttf",
  // 官网
  "home": 'https://zh.osdn.net/projects/jis2004/wiki/FrontPage'
}
```

### 字体分类

`字体` 分类(`type`) `黑体`、`宋体`、`楷体`、`艺术字体`、`手绘体`，用于网站生成分类页面

### 授权方式

**免费商用字体**

商用免费不是一种开源软件的授权协议，主要指个人或者字体开发厂商没有开源但是免费提供给个人和商业机构使用的字体。目前中文字体的版权没有一个统一的标准，不同的字体厂商，对免费商用的字体有不同的限制，有些字体免费商用之前还需要获得厂商的授权，使用这类字体时需要仔细阅读他们的条款，避免不必要的麻烦。个人设计师发布并承诺开放免费商用的字体这没有这些限制。

厂商对于免费商用的字体有收回的权利，之前有过这样的案例 ，某些厂商对一些曾经免费商用的字体收回了授权。使用字体厂商发布的免费商用字体前需要确认这个字体是否还面对公众免费商用，这里也会尽量及时更新这类字体的授权信息。

### 开源协议

**GPL-2.0**

GNU通用公共许可证 (GNU General Public License)是GNU运动为保证其软件在后续的发展中仍保持开源开放而为其软件设立的“使用条款”。 GPL 最大的特点是：如果你在自己的作品中使用了受制于 GPL 的软件，那么该作品也必须以 GPL 许可分发。 这显然会产生一个大问题：如果我在文档中用了 GPL 字体，这份文件是否也就因此「感染」了 GPL、变成了开源的东西？ 这是一个没有定论的问题，但其潜在争议很大，以至于 GPL 的推广者自由软件基金会额外推出了一条名为「GPL 字型例外」（GPL font exception）的条款，可以附在 GPL 字体许可的后面，阻断其向使用该字体的文件的传播。 由于其争议性这里收录的文泉系列字体需慎用。

**OFL-1.1**

SIL开放字体许可证 (SIL Open Font License) 由SIL国际制定，初版于2005年发布，如今已是诸多开源字体的首选授权条款，这种许可证比 GPL 要开明，不会扩散到使用 SIL 字体的作品上，而只要求对字体作出修改后的作品本身要以相同许可分发。

**IPA-1.0**

IPA开放字型授权条款是日本「IPA」以符合「开放原始码促进会（Open Source Initiative）」于2009年开源定义的使用条款。

## 本地开发

```sh
$ npm install # 安装依赖
$ npm start   # 生成字体海报 & 生成 html 网站
$ npm run dev # 监听模板改变，生成 html 网站
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