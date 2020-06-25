<p align="center">
<img width="128" src="https://i.loli.net/2020/05/07/9kLvPnWVCp7538c.png" >
</p>
<p align="center">
<a href="http://zyplayer.fun/" target="_blank">官网</a>
<a href="https://github.com/Hunlongyu/ZY-Player/issues" target="_blank">反馈</a>
</p>
<p align="center">
<img src="https://forthebadge.com/images/badges/built-with-love.svg">
<p>
<p align="center">
<img src="https://github.com/aleen42/badges/raw/master/src/visual_studio_code_flat_square.svg?sanitize=true">
<img src="https://github.com/aleen42/badges/raw/master/src/vue_flat_square.svg?sanitize=true">
<img src="https://github.com/aleen42/badges/raw/master/src/javascript_flat_square.svg?sanitize=true">
<img src="https://github.com/aleen42/badges/raw/master/src/eslint_flat_square.svg?sanitize=true">
</p>
<p align="center">
<img alt="GitHub All Releases" src="https://img.shields.io/github/downloads/Hunlongyu/ZY-Player/total?style=for-the-badge">
<img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/Hunlongyu/ZY-Player?include_prereleases&style=for-the-badge">
<img alt="GitHub" src="https://img.shields.io/github/license/Hunlongyu/ZY-Player?style=for-the-badge">
<img src="https://img.shields.io/github/workflow/status/Hunlongyu/ZY-Player/release-build?style=for-the-badge">
<p>

# ZY Player 资源播放器

# 目录
- [特性](#特性)
  - [全局快捷键](#全局快捷键)
  - [下载](#下载)
  - [赞助](#赞助)
  - [截图](#截图)
- [开发向导](#开发向导)
- [准备环境](#准备环境)
  - [nodejs安装](#nodejs安装)
  - [npm配置](#npm配置)
    - [翻墙代理设置](#翻墙代理设置)
    - [镜像源设置](#镜像源设置)
- [代码IDE](#代码IDE)
- [安装依赖](#安装依赖)
- [调试开发](#调试开发)
- [打包发布](#打包发布)

## 特性

1. 全平台支持. Windows, Mac, Linux
2. 12个视频源. 未来更新更多的视频源
3. 新增历史播放记录, 并记录播放进度
4. 新增分享功能. 一键分享海报图片
5. 新增精简模式. 支持修改透明度
6. 收藏夹同步更新视频追剧
7. 支持演员名称搜索
8. 更详细的视频分类
9. 后台自动更新
10. 全新布局配色
11. 新增多语言
12. 全局快捷键
13. 下载功能
14. ...

觉得软件不错的, 点击右上角 star 收藏关注一波呀~

> Tips: 资源加载不出来时, 点击列表下方链接, 浏览器打开一下网站. 原理是需要通过网站的人机检测.

> [新版本开发公告](https://github.com/Hunlongyu/ZY-Player/issues/109)


#### 全局快捷键:

|          快捷键          | 说明       | 主界面 | 小窗口 |
| :----------------------: | ---------- | :----: | :----: |
| `⌘ + →`  或  `Ctrl + →` | 下一集     |   √    |   √    |
| `⌘ + ←`  或  `Ctrl + ←` | 上一集     |   √    |   √    |
| `⌘ + ↑`  或  `Ctrl + ↑` | 减少透明度 |        |   √    |
| `⌘ + ↓`  或  `Ctrl + ↓` | 增加透明度 |        |   √    |
| `Shift + ↑` | 增加倍速 + 0.25 |    √    |   √    |
| `Shift + ↓` | 减少倍速 - 0.25 |    √    |   √    |

#### 下载:

1. [Github -- 官方下载(最新版)](https://github.com/Hunlongyu/ZY-Player/releases)

2. [蓝奏云 -- 快速下载(老版本)](https://www.lanzous.com/b04s6a3re) 密码:95px

3. 适用于32位操作系统的x86软件,在蓝奏云网盘里, 后缀名: ZY Player * 32位.exe

#### 赞助
[![LATOPAY](https://latopay.com/w/lt-bg-2062.png)](https://latopay.com/@Hunlongyu)

#### 截图: 

0. 分享 ⇣ ↓
![share.gif](https://i.loli.net/2020/06/05/hbJwBXlx194umcO.gif)

1. 浏览 ⇣ ↓
![01浏览.png](https://i.loli.net/2020/05/18/MshDLnXq2CTpoBy.png)
2. 搜索 ⇣ ↓
![02搜索.png](https://i.loli.net/2020/05/20/QgJqDkcjpeiRvBb.png)
3. 详情 ⇣ ↓
![03详情.png](https://i.loli.net/2020/05/18/s7gUj6unEfyYb4Z.png)
4. 播放 ⇣ ↓
![04播放.png](https://i.loli.net/2020/05/18/WqgnOw3mHd6e5uU.png)
5. 收藏 ⇣ ↓
![05收藏.png](https://i.loli.net/2020/05/18/bhIgeGMTPWmrdYi.png)
6. 白色主题皮肤 ⇣ ↓
![06白色.png](https://i.loli.net/2020/05/18/UgiVZ89dhkuxDBI.png)
7. 绿色主题皮肤 ⇣ ↓
![07绿色.png](https://i.loli.net/2020/05/18/4d2UnFRECm7vyJQ.png)
8. 粉色色主题皮肤 ⇣ ↓
![08粉色.png](https://i.loli.net/2020/05/18/PLlEfzd8mSC9vMW.png)

### 重要: 
所有资源来自网上, 该软件不参与任何制作, 上传, 储存, 下载等内容. 该软件仅供学习参考, 请于安装后24小时内删除.

## 开发指导
软件基于nodejs, vue, electron, 如果想成为一个有追求的码农，你先考虑一下自己是否具备上述几个关键词的知识储备，如果没有，建议先百度了解下。这里的开发环境基于linux发行版mint, 其他大同小异，自行发挥。

### 准备环境

#### nodejs安装
* [LINK1](https://nodejs.org/zh-cn/)
* [LINK2](https://www.jianshu.com/p/13f45e24b1de/)

#### npm配置
天朝的网络环境都有耳闻，想顺利开发，要么翻墙，要么镜像源，以下按照自己的水平二选一

#### 翻墙代理设置
自备http代理，sock5代理转换，参考privoxy
```bash
设置代理
npm config set proxy=http://127.0.0.1:8087
npm config set registry=http://registry.npmjs.org


关于https
经过上面设置使用了http开头的源，因此不需要设https_proxy了，否则还要增加一句:

npm config set https-proxy http://server:port

代理用户名和密码
npm config set proxy http://username:password@server:port
npm confit set https-proxy http://username:password@server:port

取消代理
npm config delete proxy
npm config delete https-proxy
```

#### 镜像源设置
这里使用阿里的npm镜像
```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
搞定后使用cnpm代替所有的npm命令即可，切记使用一致，切记切记

* [参考网页链接](https://developer.aliyun.com/mirror/NPM?from=tnpm)

### 代码IDE
随心所欲吧，这里安利vscode

### 安装依赖
```bash
npm install 
or 
cnpm install 
```
### 调试开发
```bash
npm run dev
```

### 打包发布
```
npm run electron:build
```
