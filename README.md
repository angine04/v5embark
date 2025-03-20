# V5Embark - 学生注册系统

这是一个使用[Next.js](https://nextjs.org)构建的学生注册和信息管理系统。

## 项目概述

V5Embark是一个专为学生设计的注册平台，允许学生填写和提交他们的个人信息、联系方式和经验信息。系统采用多步骤表单设计，确保用户体验流畅。

## 技术栈

- **前端框架**: [Next.js 15](https://nextjs.org) 使用App Router
- **UI组件**: [Shadcn UI](https://ui.shadcn.com/)
- **状态管理**: [Zustand](https://github.com/pmndrs/zustand)
- **表单处理**: [React Hook Form](https://react-hook-form.com/) 和 [Zod](https://zod.dev/) 验证
- **CSS框架**: [Tailwind CSS](https://tailwindcss.com/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **数据库**: [MongoDB](https://www.mongodb.com/) 通过Mongoose连接

## 开始使用

首先，安装依赖并运行开发服务器:

```bash
# 安装依赖
npm install
# 或
yarn install

# 运行开发服务器
npm run dev
# 或
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 在浏览器中查看应用。

## 主要功能

- 多步骤表单注册流程
- 表单数据持久化
- 响应式设计，适配不同设备
- 服务器端验证
- 数据库存储和检索

## 项目结构

```
v5embark/
├── src/               # 源代码
│   ├── app/           # Next.js应用页面
│   ├── components/    # 可复用组件
│   ├── lib/           # 工具函数和配置
│   ├── store/         # Zustand状态管理
│   └── types/         # TypeScript类型定义
├── public/            # 静态资源
├── scripts/           # 脚本工具
└── data/              # 数据文件
```

## 数据库设置

项目使用MongoDB作为数据库。为了运行项目，请确保您已配置`.env.local`文件中的连接字符串:

```
MONGODB_URI=your_mongodb_connection_string
```

## 部署

该项目可以部署到任何支持Next.js的平台，如[Vercel](https://vercel.com)。

```bash
npm run build
# 或
yarn build
```

更多部署信息，请参考[Next.js部署文档](https://nextjs.org/docs/app/building-your-application/deploying)。
