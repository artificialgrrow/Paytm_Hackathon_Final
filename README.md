# 🔷 PaytmOne AI
### Autonomous Dual-Engine Conversational Financial Platform

> A voice-first AI commander for everyday financial actions and autonomous payment dispute resolution. Speak or type in English or Hindi to instantly get things done.

---

## 📌 Problem Statement

Every day, hundreds of millions of consumers across India face two major bottlenecks in digital finance:

### 1. Cluttered App Menus & Fragmented Services (Action Friction)
Managing everyday digital payments has become overwhelming. Finding the optimal mobile recharge pack, booking movie tickets, hunting for working promo codes, comparing flight or train fares, and paying scattered utility bills (electricity, water, piped gas, broadband, FASTag) requires navigating dozens of complex, ad-heavy app screens. Everyday consumers and non-technical users waste time and frequently miss out on better tariffs and cashbacks.

### 2. The Opaque "Payment Pending" Black Box (Resolution Friction)
When a digital payment or refund fails—whether a mobile recharge times out, an e-commerce refund is delayed, or a shop counter soundbox remains silent despite a bank debit—users are trapped in an opaque limbo. Traditional customer care bots offer generic deflection: *"Please wait 3 to 5 business days."* Neither the consumer nor the merchant has access to real-time banking rails to see where the money is actually stuck.

---

## 💡 The Solution: PaytmOne AI

**PaytmOne AI** unifies digital finance into a conversational experience powered by two specialized, autonomous engines:

### ⚡ 1. Action Mode (Instant Execution)
Your autonomous assistant for everyday consumer payments and bookings:
* **Movie Tickets & Cinema:** Live blockbuster showtimes, IMAX/4DX format selection, seat availability, and snack combos.
* **Consolidated Pending Bills:** BBPS hub that aggregates all unpaid utility invoices (Electricity, Piped Gas, Water, Broadband, FASTag) with a single-click settlement option.
* **Verified Promo Codes:** Instant discovery and 1-click clipboard copy for active Paytm discount coupons across travel, shopping, and utilities.
* **Mobile Recharges:** Tariff optimization across Jio, Airtel, Vi, and BSNL with 5G eligibility and OTT benefits.
* **Travel & Transit:** Live comparison of flights, IRCTC trains (Vande Bharat), and intercity buses with instant seat lock.
* **Shopping Deals & Digital Gold:** Mall discounts at Phoenix Marketcity and 24K MMTC-PAMP digital gold purchases.
* **Zero-Trust Security:** Strict Human-in-the-Loop authorization. The AI prepares the verified transaction payload, but the user always authorizes the payment via native UPI PIN entry.

### 🛡️ 2. Resolve Mode (Forensic Dispute Resolution)
Your autonomous forensic payment investigator for stuck transactions, refunds, and failed debits:
* **3-Way Reconciliation Matrix:** Cross-audits the **Customer Bank CBS**, **NPCI Central Switch**, and **Destination Ledger** in real time to pinpoint the exact failure point.
* **Multi-Case Dispute Directory:** Tracks pending transactions, active e-commerce refunds (Myntra, Swiggy, IRCTC), failed double-debits, and nodal complaints.
* **RBI Circular 81 Compliance:** Automatically applies official RBI Harmonisation rules guaranteeing T+1 auto-reversal SLAs.
* **Cryptographic Evidence Seal:** Issues an immutable SHA-256 digital audit docket for every case.
* **Live Specialist Escalation:** Instant 1-click connection to a live Nodal Banking Officer when manual review is required.

---

## 🎯 Demo Cheat-Sheet: Questions You Can Ask

| Mode | Section | Try Asking / Speaking |
| :--- | :--- | :--- |
| **Action** | **Movies** | `"Which movie tickets are available right now in IMAX?"` |
| **Action** | **Promo Codes** | `"Are there any promo codes?"` |
| **Action** | **Pending Bills** | `"Are there any pending bills?"` |
| **Action** | **Recharge** | `"Recharge Jio 299 with 2GB daily data"` |
| **Action** | **Travel** | `"Cheapest flights or trains from Mumbai to Pune"` |
| **Action** | **Shopping** | `"Show me shopping deals in Pune at Croma"` |
| **Action** | **Gold** | `"Buy ₹500 24K digital gold"` |
| **Resolve** | **Pending Payments** | `"Are there any pending transactions?"` |
| **Resolve** | **Active Refunds** | `"Are there any refund requests?"` |
| **Resolve** | **Failed Debits** | `"Are there any failed transactions?"` |
| **Resolve** | **Complaints** | `"Show me registered complaints"` |

---

## 🚀 Quick Setup Guide (Run in 3 Minutes)

### Prerequisites
* **Python 3.10+** — [python.org](https://www.python.org/downloads/)
* **Node.js 18+** — [nodejs.org](https://nodejs.org/)

---

### Step 1: Start the Backend Server
```bash
cd backend
python -m pip install -r requirements.txt
python main.py
```
> Server runs at: **`http://localhost:8000`**

---

### Step 2: Start the Frontend UI
In a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```
> Open your browser at: **`http://localhost:5173`**

---

## 🏗️ System Architecture

```
Paytm_Hackathon_Final/
├── backend/
│   ├── main.py                  # FastAPI server with WebSocket & REST endpoints
│   ├── graph_orchestrator.py    # LangGraph StateGraph engine (Router, Action, Resolve)
│   ├── database/
│   │   ├── db_service.py        # SQLite database service & schema
│   │   └── seed_data.py         # 80+ realistic test scenarios across all verticals
│   └── test_suite.py            # Automated 11-case end-to-end verification suite
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PaytmOneHub.jsx       # Landing Hub with Hero Banner & auto-redirect
│   │   │   ├── ActionModeView.jsx    # Action Mode UI (Movies, Promos, Bills, Recharge)
│   │   │   ├── ResolveModeView.jsx   # Resolve Mode UI (3-Way Matrix & Dispute Directory)
│   │   │   └── ArchitectureFlow.jsx  # Dual-Engine Dotted Canvas Flow
│   │   └── data/
│   │       └── telecomPlans.js       # Client-side pure query engine fallback
│   └── dist/                         # Production build assets
└── README.md
```

---

## 👥 Authors
* **Team PaytmOne AI** — Beyond 9TO5 Buildathon / Paytm Hackathon Mumbai
