"""删除账目页面"""

import streamlit as st
import database


def render():
    st.header("🗑️ 删除账目")

    record_id = st.number_input("输入要删除的记录 ID", min_value=1, step=1)

    col1, col2 = st.columns([1, 3])
    with col1:
        query_clicked = st.button("查询记录")

    if query_clicked:
        record = database.get_record_by_id(record_id)
        if record is None:
            st.error(f"❌ 未找到 ID 为 {record_id} 的记录")
        else:
            st.info(
                f"**确认删除以下记录？**\n\n"
                f"- ID：{record['id']}\n"
                f"- 日期：{record['date']}\n"
                f"- 分类：{record['category']}\n"
                f"- 金额：¥ {record['amount']:.2f}\n"
                f"- 备注：{record['notes'] or '（无）'}"
            )
            if st.button("确认删除", type="primary"):
                database.delete_record(record_id)
                st.success(f"✅ 已删除 ID 为 {record_id} 的记录")
                st.cache_data.clear()
