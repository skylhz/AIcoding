"""分类统计页面 —— 柱状图 + 统计表"""

import streamlit as st
import config
import database


def render():
    st.header("📊 分类统计")

    # 月份筛选
    months = database.get_available_months()
    month_options = ["全部"] + months
    month_label = st.selectbox("按月份筛选", month_options, key="stats_month")
    month = None if month_label == "全部" else month_label

    stats = database.get_category_stats(month=month)

    if not stats:
        st.info("暂无数据。")
        return

    # ---- 柱状图 ----
    chart_data = {row["category"]: row["total"] for row in stats}
    st.bar_chart(chart_data)

    # ---- 统计表 ----
    grand_total = sum(row["total"] for row in stats)
    table_data = []
    for row in stats:
        table_data.append({
            "分类": row["category"],
            "笔数": row["count"],
            "合计金额": f"¥ {row['total']:.2f}",
            "占比": f"{row['total'] / grand_total * 100:.1f}%"
        })

    st.subheader("统计明细")
    st.dataframe(table_data, use_container_width=True, hide_index=True)
    st.metric("💰 总金额", f"¥ {grand_total:.2f}")
