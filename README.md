# 储能柜管理系统 - 后台管理原型

## 项目简介

这是一个基于纯HTML/CSS/JavaScript开发的储能柜管理系统后台原型，采用响应式设计，支持PC端和移动端访问，内置中英文双语切换功能。

## 技术栈

- **前端框架**: 纯HTML5 + CSS3 + ES6 JavaScript（无需构建工具）
- **UI组件库**: Bootstrap 5.3.0
- **图标库**: Bootstrap Icons 1.11.0
- **图表库**: ECharts 5.4.3
- **路由**: Hash路由（自实现）
- **数据存储**: LocalStorage + SessionStorage
- **国际化**: 自实现i18n工具

## 功能特性

### 核心功能

1. **用户认证**
   - 登录/退出
   - 会话管理
   - 记住我功能
   - Token自动过期

2. **多语言支持**
   - 中文（简体）
   - English
   - 实时切换
   - 本地持久化

3. **响应式布局**
   - 桌面端（>1200px）
   - 平板端（768px-1199px）
   - 移动端（<768px）
   - 自适应菜单

### 业务模块

1. **控制台**
   - 数据统计卡片
   - 版本发布趋势图
   - 客户分布图
   - 设备状态分析

2. **储能柜版本管理**
   - 版本列表（分页、搜索）
   - 新增版本
   - 编辑版本
   - 删除版本
   - 升级管理

3. **客户管理**
   - 客户列表（分页、搜索、筛选）
   - 新增客户
   - 编辑客户
   - 客户详情
   - 删除客户

4. **菜单权限管理**
   - 菜单配置
   - 权限模板

5. **电价计费模板**
   - 模板列表
   - 新增模板
   - 峰谷平电价配置
   - 模板详情

6. **系统设置**
   - 个人信息
   - 修改密码

## 项目结构

```
/工商储后台/
├── index.html              # 登录页面
├── dashboard.html          # 主控制台
├── README.md              # 项目说明文档
├── css/
│   ├── common.css         # 公共样式
│   ├── responsive.css     # 响应式样式
│   └── theme.css          # 主题配置
├── js/
│   ├── app.js             # 应用主逻辑
│   ├── auth.js            # 认证管理
│   ├── i18n.js            # 国际化工具
│   ├── router.js          # 路由管理
│   └── api-mock.js        # Mock数据API
├── locales/
│   ├── zh-CN.json         # 中文语言包
│   └── en-US.json         # 英文语言包
├── pages/                 # 页面模块目录
│   ├── version/
│   ├── customer/
│   ├── menu/
│   ├── pricing/
│   └── system/
└── assets/               # 静态资源
    └── images/
```

## 快速开始

### 1. 直接打开

无需安装任何依赖，直接用浏览器打开 `index.html` 即可使用。

### 2. 使用本地服务器（推荐）

为了更好的体验，建议使用本地服务器运行：

**方法一：使用Python**
```bash
# Python 3
cd /Users/xuexinhai/Desktop/工商储后台
python3 -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

**方法二：使用Node.js**
```bash
# 安装http-server（仅需一次）
npm install -g http-server

# 启动服务
cd /Users/xuexinhai/Desktop/工商储后台
http-server -p 8080
```

**方法三：使用VSCode Live Server**
1. 安装 Live Server 插件
2. 右键 `index.html` → "Open with Live Server"

然后访问：`http://localhost:8080`

## 登录信息

演示账号：
- **用户名**: admin
- **密码**: 123456

## 功能说明

### 登录页面
- 支持记住登录状态
- 语言切换（右上角）
- 表单验证
- 登录成功后自动跳转

### 主控制台
- 顶部导航栏：系统名称、语言切换、用户菜单
- 侧边栏：功能菜单（支持展开/收缩）
- 主内容区：动态加载页面内容
- 响应式适配：移动端自动折叠菜单

### 数据管理
- 列表展示（分页、搜索）
- 新增/编辑（表单验证）
- 删除（二次确认）
- 数据持久化（Mock数据）

### 多语言切换
- 点击右上角语言按钮
- 实时切换界面语言
- 自动保存语言偏好

## 浏览器兼容性

支持现代浏览器：
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mock数据说明

系统使用内置Mock数据，包含：

1. **版本数据**: 10条示例版本记录
2. **客户数据**: 20条示例客户记录
3. **计费模板**: 8条示例模板记录
4. **用户数据**: 1个管理员账号

所有增删改操作都在浏览器内存中进行，刷新页面后恢复初始状态。

## 响应式断点

- **桌面**: ≥1200px - 完整布局
- **平板**: 768px-1199px - 优化布局
- **手机**: <768px - 移动端布局

## 开发说明

### 添加新页面

1. 在 `router.js` 中注册路由：
```javascript
'/your/path': {
    title: 'your.title',
    handler: this.loadYourPage
}
```

2. 实现处理函数：
```javascript
loadYourPage: function() {
    const html = `...`;
    this.renderContent(html);
}
```

### 添加Mock数据

在 `api-mock.js` 中添加数据模型和CRUD方法：
```javascript
yourModule: {
    data: [...],
    getList: async function(params) { ... },
    getById: async function(id) { ... },
    create: async function(data) { ... },
    update: async function(id, data) { ... },
    delete: async function(id) { ... }
}
```

### 添加多语言文本

在 `locales/zh-CN.json` 和 `locales/en-US.json` 中添加翻译：
```json
{
  "yourModule": {
    "yourKey": "您的文本"
  }
}
```

使用：
```javascript
i18n.t('yourModule.yourKey')
```

## 性能优化

1. **按需加载**: 页面内容通过路由动态加载
2. **图表懒加载**: 仅在需要时初始化图表
3. **事件防抖**: 搜索、窗口resize等使用防抖
4. **本地缓存**: 语言、侧边栏状态等使用LocalStorage

## 注意事项

1. 本项目为**原型演示**，未连接真实后端API
2. 数据操作仅在浏览器内存中，刷新后重置
3. 生产环境需要：
   - 连接真实后端API
   - 实现真实的认证机制
   - 添加HTTPS支持
   - 实现真实的权限控制
   - 添加错误边界处理

## 后续扩展

### 功能扩展
- [ ] 数据导出功能
- [ ] 高级筛选器
- [ ] 批量操作
- [ ] 操作日志
- [ ] 消息通知
- [ ] 暗色主题

### 技术优化
- [ ] 使用IndexedDB替代LocalStorage
- [ ] Service Worker离线支持
- [ ] PWA支持
- [ ] 虚拟滚动（长列表优化）
- [ ] WebSocket实时通信

## 技术支持

如有问题，请检查：
1. 浏览器控制台是否有错误信息
2. 浏览器是否支持ES6语法
3. 是否使用HTTP服务器运行（而非file://协议）

## 许可证

MIT License

## 更新日志

### v1.0.0 (2024-12-10)
- 初始版本发布
- 实现核心功能模块
- 支持响应式布局
- 支持中英文双语
- 完整的Mock数据系统

---

**开发者**: 前端开发工程师
**最后更新**: 2024-12-10
