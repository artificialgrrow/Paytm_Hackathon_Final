"""
SQLite Database Service for Paytm AI Hub
Provides thread-safe connections and structured scenario data access.
"""
import os
import sqlite3
from typing import Dict, List, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "paytm_scenarios.db")


def get_db_connection() -> sqlite3.Connection:
    """Returns a SQLite connection with dict-like row access."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_database():
    """Initializes schema and tables for all Paytm ONE Action & Resolve scenarios."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Telecom Plans Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS telecom_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_id TEXT UNIQUE,
        operator TEXT NOT NULL,
        price INTEGER NOT NULL,
        validity TEXT NOT NULL,
        data_daily TEXT NOT NULL,
        total_data TEXT,
        calls TEXT DEFAULT 'Unlimited Calls',
        sms TEXT DEFAULT '100 SMS / Day',
        network TEXT DEFAULT '5G / 4G',
        badge TEXT,
        ott TEXT,
        has_netflix INTEGER DEFAULT 0,
        is_cheapest INTEGER DEFAULT 0,
        cashback TEXT,
        description TEXT
    );
    """)

    # 2. Travel & Transit Tickets Table (Flights, Buses, Trains)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS travel_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id TEXT UNIQUE,
        from_city TEXT NOT NULL,
        to_city TEXT NOT NULL,
        travel_type TEXT NOT NULL, -- 'flight', 'bus', 'train'
        carrier TEXT NOT NULL,      -- 'IndiGo', 'Air India', 'MSRTC Shivneri', 'Vande Bharat Express'
        service_name TEXT NOT NULL,
        dep_time TEXT NOT NULL,
        arr_time TEXT NOT NULL,
        duration TEXT NOT NULL,
        price INTEGER NOT NULL,
        seats TEXT DEFAULT 'Available',
        is_cheapest INTEGER DEFAULT 0,
        is_fastest INTEGER DEFAULT 0,
        class_type TEXT DEFAULT 'Standard',
        cashback TEXT
    );
    """)

    # 3. Shopping Deals & Retail Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS shopping_deals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        deal_id TEXT UNIQUE,
        category TEXT NOT NULL,    -- 'electronics', 'food', 'fashion', 'entertainment'
        city TEXT NOT NULL,
        brand TEXT NOT NULL,
        mall_name TEXT NOT NULL,
        title TEXT NOT NULL,
        discount_pct INTEGER NOT NULL,
        coupon_code TEXT NOT NULL,
        min_spend INTEGER DEFAULT 0,
        badge TEXT,
        valid_until TEXT,
        description TEXT
    );
    """)

    # 4. Utility Bills & FASTag Table (BBPS Certified)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS utility_bills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bill_id TEXT UNIQUE,
        service_type TEXT NOT NULL, -- 'electricity', 'gas', 'water', 'broadband', 'fastag', 'dth'
        provider_name TEXT NOT NULL,
        consumer_id TEXT NOT NULL,
        consumer_name TEXT NOT NULL,
        amount_due REAL NOT NULL,
        due_date TEXT NOT NULL,
        units_consumed TEXT,
        balance REAL DEFAULT 0,
        status TEXT DEFAULT 'DUE',
        cashback TEXT
    );
    """)

    # 5. Movie Tickets & Entertainment Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS movie_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_id TEXT UNIQUE,
        title TEXT NOT NULL,
        genre TEXT NOT NULL,
        language TEXT NOT NULL,
        rating TEXT NOT NULL,
        theatre_name TEXT NOT NULL,
        city TEXT NOT NULL,
        showtimes TEXT NOT NULL,
        format TEXT NOT NULL,     -- 'IMAX 3D', '4DX', 'Dolby Atmos 2D', 'Insignia Luxe'
        price INTEGER NOT NULL,
        seats_available TEXT NOT NULL,
        poster_banner TEXT,
        cashback TEXT,
        snack_offer TEXT,
        description TEXT
    );
    """)

    # 6. Promo Codes & Exclusive Coupons Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS promo_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE,
        category TEXT NOT NULL,   -- 'all', 'recharge', 'travel', 'movies', 'bills', 'food', 'shopping'
        title TEXT NOT NULL,
        discount_text TEXT NOT NULL,
        discount_amount INTEGER,
        min_spend INTEGER DEFAULT 0,
        valid_until TEXT NOT NULL,
        terms TEXT NOT NULL,
        badge TEXT
    );
    """)

    # 7. Forensic Dispute Cases (3-Way Reconciliation & NPCI Resolution)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dispute_cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_id TEXT UNIQUE,
        txn_id TEXT NOT NULL,
        user_id TEXT DEFAULT 'paytm_user_01',
        dispute_type TEXT NOT NULL, -- 'pending_recharge', 'refund_tracker', 'merchant_mismatch', 'duplicate_debit', 'wrong_transfer', 'bill_unpaid'
        amount REAL NOT NULL,
        service_name TEXT NOT NULL,
        bank_name TEXT NOT NULL,
        bank_rrn TEXT NOT NULL,
        status TEXT NOT NULL,
        reconciliation_status TEXT NOT NULL,
        finding_en TEXT NOT NULL,
        finding_hi TEXT NOT NULL,
        regulatory_citation TEXT NOT NULL,
        tat_sla TEXT NOT NULL,
        compensation_eligible INTEGER DEFAULT 0
    );
    """)

    conn.commit()
    conn.close()


def query_db(query: str, args: tuple = ()) -> List[Dict[str, Any]]:
    """Helper to execute SQL SELECT and return clean list of dicts."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(query, args)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def execute_db(query: str, args: tuple = ()) -> int:
    """Helper to execute INSERT/UPDATE and return lastrowid."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(query, args)
        conn.commit()
        return cursor.lastrowid
    finally:
        conn.close()
