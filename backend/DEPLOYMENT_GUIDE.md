# 🚀 云端部署指南

## 📋 部署目标
将眼健康分析系统部署到云端，让所有人都能访问，不再依赖本地服务器。

## 🌐 推荐部署平台

### 1. **Heroku** (推荐新手)
- ✅ 简单易用
- ✅ 免费额度
- ✅ 自动部署
- ❌ 有使用限制

### 2. **Railway** (推荐)
- ✅ 现代平台
- ✅ 免费额度
- ✅ 自动部署
- ✅ 支持多种语言

### 3. **Render** (推荐)
- ✅ 免费额度
- ✅ 自动部署
- ✅ 支持Docker
- ✅ 性能好

## 🛠️ 部署步骤

### 步骤1：准备代码
```bash
# 确保所有文件都在backend目录
backend/
├── server.js
├── eye_health_predictor.py
├── eye_multiclass_model.pkl
├── le_gender.pkl
├── package.json
├── requirements.txt
├── Procfile
└── .env
```

### 步骤2：创建Git仓库
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
```

### 步骤3：部署到Heroku
```bash
# 安装Heroku CLI
# 登录Heroku
heroku login

# 创建应用
heroku create your-eye-health-app

# 设置环境变量
heroku config:set DB_URL=your_database_url

# 部署
git push heroku main

# 启动服务
heroku ps:scale web=1
```

### 步骤4：部署到Railway
```bash
# 安装Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 部署
railway deploy
```

## 🔧 环境配置

### 环境变量
```env
# .env文件
PORT=3001
DB_URL=mysql+pymysql://username:password@host:port/database
NODE_ENV=production
```

### 数据库配置
- 使用云数据库：AWS RDS, Google Cloud SQL, PlanetScale
- 或使用Heroku Postgres（免费）

## 📊 部署后效果

### 部署前（本地）
```
用户 → 你的电脑 → 分析结果
```

### 部署后（云端）
```
用户 → 云端服务器 → 分析结果
```

## 🎯 优势

1. **24/7可用**：服务器永远在线
2. **全球访问**：任何人都能使用
3. **自动扩展**：根据用户量自动调整
4. **专业维护**：平台负责服务器维护

## 💰 成本估算

### 免费方案
- **Heroku**: 免费额度（有限制）
- **Railway**: 免费额度
- **Render**: 免费额度

### 付费方案
- **基础版**: $5-20/月
- **专业版**: $20-100/月
- **企业版**: $100+/月

## 🚀 下一步

1. 选择部署平台
2. 准备代码和配置
3. 执行部署步骤
4. 测试云端功能
5. 更新前端API地址

部署完成后，你的眼健康分析系统就能让全世界的人使用了！
