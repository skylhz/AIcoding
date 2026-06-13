"""数据库操作 —— 建表、增删查、统计"""

import sqlite3
import config


def get_connection():
    """获取数据库连接"""
    conn = sqlite3.connect(config.DB_PATH)
    conn.row_factory = sqlite3.Row  # 让查询结果支持列名访问
    return conn


def init_db():
    """初始化数据库，建表（如不存在）"""
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            notes TEXT DEFAULT ''
        )
    """)
    conn.commit()
    conn.close()


def add_record(amount, category, date, notes):
    """插入一条账目记录"""
    conn = get_connection()
    conn.execute(
        "INSERT INTO records (amount, category, date, notes) VALUES (?, ?, ?, ?)",
        (amount, category, date, notes)
    )
    conn.commit()
    conn.close()


def get_records(month=None, categories=None):
    """查询记录，支持按月(YYYY-MM)和分类列表筛选"""
    conn = get_connection()
    query = "SELECT * FROM records WHERE 1=1"
    params = []

    if month:
        query += " AND date LIKE ?"
        params.append(f"{month}%")

    if categories:
        placeholders = ",".join("?" * len(categories))
        query += f" AND category IN ({placeholders})"
        params.extend(categories)

    query += " ORDER BY date DESC, id DESC"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return rows


def get_record_by_id(record_id):
    """按 ID 查询单条记录，不存在返回 None"""
    conn = get_connection()
    row = conn.execute("SELECT * FROM records WHERE id = ?", (record_id,)).fetchone()
    conn.close()
    return row


def delete_record(record_id):
    """按 ID 删除记录，返回是否删除成功"""
    conn = get_connection()
    cursor = conn.execute("DELETE FROM records WHERE id = ?", (record_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted


def get_available_months():
    """获取数据库中有记录的所有月份（去重，降序）"""
    conn = get_connection()
    rows = conn.execute(
        "SELECT DISTINCT substr(date, 1, 7) AS month FROM records ORDER BY month DESC"
    ).fetchall()
    conn.close()
    return [row["month"] for row in rows]


def get_category_stats(month=None):
    """按分类汇总：分类、笔数、合计金额"""
    conn = get_connection()
    if month:
        rows = conn.execute(
            "SELECT category, COUNT(*) AS count, SUM(amount) AS total "
            "FROM records WHERE date LIKE ? GROUP BY category",
            (f"{month}%",)
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT category, COUNT(*) AS count, SUM(amount) AS total "
            "FROM records GROUP BY category"
        ).fetchall()
    conn.close()
    return rows
