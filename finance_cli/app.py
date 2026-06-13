"""个人记账工具 —— 主入口"""

import streamlit as st
import database
from views import add_record, view_list, delete_record, statistics

# 页面配置
st.set_page_config(page_title="记账工具", page_icon="📊", layout="wide")

# 初始化数据库
database.init_db()

# ---- 顶部标题 ----
st.title("📊 记账工具")

# ---- 顶部导航标签 ----
tab1, tab2, tab3, tab4 = st.tabs(["➕ 添加账目", "📋 查看列表", "🗑️ 删除账目", "📊 分类统计"])

with tab1:
    add_record.render()

with tab2:
    view_list.render()

with tab3:
    delete_record.render()

with tab4:
    statistics.render()
