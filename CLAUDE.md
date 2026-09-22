## 项目概览
这是一个习题后台管理系统前端项目。

## 技术栈
- vue3
- vue-route4
- pinia
- pinia-plugin-persistedstate
- axios
- element-plus
- vite

## 架构
- `src/api/` 公共请求接口
- `src/assets/` 资源文件
- `src/components/` 公共组件
- `src/router/` 路由文件
- `src/store/` 状态管理
- `src/utils/` 包含工具
- `src/views/` 包含业务模块

## 编码规范
- 使用 async/await 而非嵌套的 Promise

## 文件放置规则
- 将新的业务添加到 `src/views/`
- 将可复用的基础组件（Primitives）添加到 `src/components/`
- 将共享的辅助函数（Helpers）存放在 `src/utils/`
- **不要**为仅使用一次的内容创建新的抽象
- 优先**修改现有组件**，而非创建高度重复的副本

## 安全变更规则
- 除非明确要求，否则**禁止重命名**公共 API 路由
- 必须保持共享组件的**向后兼容性**
- 在实施重大架构调整前，必须**先行提醒并确认**