"""查看列表页面"""

import streamlit as st
import config
import database


def render():
    st.header("📋 查看列表")

    # ---- 筛选栏 ----
    col1, col2 = st.columns(2)
    with col1:
        months = database.get_available_months()
        month_options = ["全部"] + months
        month_label = st.selectbox("按月份筛选", month_options)
    with col2:
        selected_categories = st.multiselect(
            "按分类筛选（可多选，留空=全部）",
            config.CATEGORIES
        )

    # 构建查询参数
    month = None if month_label == "全部" else month_label
    categories = selected_categories if selected_categories else None

    records = database.get_records(month=month, categories=categories)

    # ---- 表格 ----
    if not records:
        st.info("暂无记录，请先添加账目。")
    else:
        # 转为列表展示
        data = []
        total_amount = 0.0
        for r in records:
            data.append({
                "ID": r["id"],
                "日期": r["date"],
                "分类": r["category"],
                "金额": f"{r['amount']:.2f}",
                "备注": r["notes"]
            })
            total_amount += r["amount"]

        st.dataframe(data, use_container_width=True, hide_index=True)
        st.metric("📌 合计金额", f"¥ {total_amount:.2f}")
