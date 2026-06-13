# 记账工具 (Finance Tracker)

基于 Python + Streamlit + SQLite3 的个人记账 Web 应用。

## 技术栈

- **Python 3.x**
- **Streamlit** — Web UI 框架
- **SQLite3** — 嵌入式数据库（Python 标准库，无需安装）

## 项目结构

```
finance_cli/
├── CLAUDE.md           # 本文件
├── app.py              # 主入口，sidebar 导航 + 页面路由
├── config.py           # 常量定义（分类列表、数据库路径）
├── database.py         # 数据库操作（建表、CRUD、统计）
├── views/
│   ├── __init__.py
│   ├── add_record.py   # 添加账目页面
│   ├── view_list.py    # 查看列表页面
│   ├── delete_record.py # 删除账目页面
│   └── statistics.py   # 分类统计页面
└── data.db             # SQLite 数据库（自动生成，已 gitignore）
```

## 启动方式

```bash
pip install streamlit
streamlit run app.py
```

## 功能

1. **添加账目** — 填写金额、分类、日期、备注，写入数据库
2. **查看列表** — 按月份和分类筛选，表格展示，显示合计金额
3. **删除账目** — 输入 ID 查询记录，确认后删除
4. **分类统计** — 柱状图 + 统计表（分类、笔数、合计、占比）

## 数据库

单表 `records`：id (INTEGER PK), amount (REAL), category (TEXT), date (TEXT), notes (TEXT)

## 预设分类

餐饮、交通、购物、娱乐、居住、其他
