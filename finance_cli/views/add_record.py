"""添加账目页面"""

import streamlit as st
import config
import database


def render():
    st.header("➕ 添加账目")

    with st.form("add_form", clear_on_submit=True):
        amount = st.number_input("金额（元）", min_value=0.01, step=0.01, format="%.2f")
        category = st.selectbox("分类", config.CATEGORIES)
        date = st.date_input("日期")
        notes = st.text_input("备注", placeholder="选填")

        submitted = st.form_submit_button("提交")

        if submitted:
            database.add_record(
                amount=amount,
                category=category,
                date=date.strftime("%Y-%m-%d"),
                notes=notes
            )
            st.success("✅ 添加成功！")
            # 清除缓存，让列表和统计页拿到最新数据
            st.cache_data.clear()
