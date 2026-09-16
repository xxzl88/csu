# 期末复习资料发布栏

这是一个基于 **Jekyll + Markdown + GitHub Actions** 的课程复习资料发布栏。资料放在 `_posts` 中，推送到 GitHub 后自动构建，并发布到 `github.io`。

## 已包含功能

- 站点说明、资料来源说明和联系方式
- Markdown 自动渲染为文章网页
- 首页文章卡片与自动分页（每页 6 篇）
- 主题分类、主题页分页、标签展示
- 标题 / 摘要 / 正文的前端搜索
- 深色模式（自动跟随系统，也可手动切换）
- 响应式布局，适配手机和电脑
- RSS、站点地图、SEO 元信息
- 代码高亮、404 页面、精选文章标记
- GitHub Actions 自动部署，不需要手动执行构建命令

## 一、创建 GitHub 仓库

有两种部署方式：

### 方式 A：用户站点（推荐）

新建一个公开仓库，仓库名必须是：

```text
你的用户名.github.io
```

部署后网址就是 `https://你的用户名.github.io/`，此时 `_config.yml` 的 `baseurl` 保持为空字符串。

### 方式 B：项目站点

仓库名可以是 `my-blog` 等普通名字，部署后网址是：

```text
https://你的用户名.github.io/my-blog/
```

此时修改 `_config.yml`：

```yml
url: "https://你的用户名.github.io"
baseurl: "/my-blog"
```

## 二、首次配置

打开 `_config.yml`，至少修改以下内容：

```yml
title: "期末复习资料发布栏"
description: "你的资料栏说明"
url: "https://你的用户名.github.io"
baseurl: ""

author:
  name: "你的名字"
  avatar: "/assets/images/avatar.svg"
  bio: "你的身份或一句话介绍"
  location: "中国"
  email: "you@example.com"
  github: "你的 GitHub 用户名"
```

如需换头像，直接用自己的图片替换 `assets/images/avatar.svg`，并在 `avatar` 中填写对应路径，例如 `/assets/images/avatar.jpg`。

## 三、添加文章

在 `_posts` 文件夹新建文件，文件名必须使用：

```text
YYYY-MM-DD-英文或拼音标题.md
```

示例：`2026-09-20-my-first-post.md`

文件内容：

```markdown
---
layout: post
title: "我的第一篇文章"
description: "文章摘要，会出现在首页和搜索结果中。"
date: 2026-09-20 10:00:00 +0800
categories: [技术]
tags: [Jekyll, GitHub Pages]
featured: false
---

这里写正文。

<!--more-->

`<!--more-->` 之前的内容会作为摘要；如果不写，系统会自动截取摘要。
```

可用主题示例：`技术`、`随笔`、`阅读`、`生活`。主题名称可以自由创建，主题页会自动识别。

## 四、上传到 GitHub

在本目录打开 PowerShell，执行：

```powershell
git init
git add .
git commit -m "初始化博客"
git branch -M main
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
git push -u origin main
```

如果仓库已经存在，直接执行：

```powershell
git add .
git commit -m "更新博客"
git push
```

## 五、开启 GitHub Pages

1. 打开 GitHub 仓库的 **Settings → Pages**。
2. 在 **Build and deployment → Source** 选择 **GitHub Actions**。
3. 回到 **Actions** 页面，等待 `Deploy Jekyll site to GitHub Pages` 完成。
4. 部署成功后，访问仓库页面顶部显示的 URL。

以后只要把新的 `.md` 文件放进 `_posts` 并 `git push`，GitHub Actions 会自动重新发布。首页会按发布时间列出资料，课程分类页会自动识别 `categories`。

## 本地查看方式

不要直接双击 `index.html`。这个项目的首页需要 Jekyll 先把 Liquid 模板渲染成 HTML，直接打开源文件不会显示完整内容。

安装 Ruby 后，在项目目录执行：

```powershell
bundle install
bundle exec jekyll serve --livereload
```

然后打开 `http://localhost:4000`。如果使用项目站点并设置了 `baseurl`，本地地址通常仍会自动适配。

## 常见问题

### 为什么文章没有显示？

检查文件名是否以 `_posts` 开头、日期是否正确、front matter 是否使用成对的 `---`，以及文章日期是否晚于当前时间。Jekyll 默认不会发布未来日期文章。

### 项目站点的图片或链接不正常？

确认 `_config.yml` 的 `baseurl` 是 `"/仓库名"`，而不是完整网址。模板中的内部链接已经使用 `relative_url`，会自动适配。

### 如何修改每页文章数量？

在 `_config.yml` 修改：

```yml
paginate: 6
```

首页文章超过这个数量后会自动生成 `/page2/`、`/page3/` 等分页页面。
