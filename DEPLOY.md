# 🚀 GitHub Pages 部署指南

## 📋 前置准备

1. 确保你有 GitHub 账号
2. 在 GitHub 上创建一个名为 `2026-new-year` 的仓库

## 🔧 部署步骤

### 1. 初始化 Git 仓库（如果还没做）

```bash
cd new-year-2026
git init
git add .
git commit -m "first commit"
git branch -M main
```

### 2. 关联远程仓库

```bash
git remote add origin https://github.com/Ricraft/2026-new-year.git
```

### 3. 推送到 GitHub

```bash
git push -u origin main
```

### 4. 构建项目

```bash
npm run build
```

### 5. 一键部署

```bash
npm run deploy
```

## 🌐 访问地址

部署成功后，访问：
```
https://Ricraft.github.io/2026-new-year
```

## ⚙️ GitHub 仓库设置

1. 进入你的 GitHub 仓库
2. 点击 `Settings` → `Pages`
3. 在 `Source` 下选择 `gh-pages` 分支
4. 点击 `Save`
5. 等待几分钟，网站就会上线

## 🔄 更新部署

每次修改代码后，重新部署：

```bash
git add .
git commit -m "update"
git push
npm run build
npm run deploy
```

## 📝 注意事项

- 确保 `gh-pages` 包已安装（已在 package.json 中配置）
- 部署可能需要几分钟才能生效
- 如果遇到 404 错误，检查 GitHub Pages 设置中的分支是否正确

## 🎉 完成！

现在你的新年红包项目已经部署到 GitHub Pages 上了！
