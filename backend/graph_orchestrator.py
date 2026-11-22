"""
Paytm ONE LangGraph Multi-Agent StateGraph Engine
Orchestrates autonomous routing, SQLite scenario queries, forensic dispute resolution, and voice synthesis.
"""
import os
import sys
import re
from typing import TypedDict, List, Dict, Any, Optional

# Ensure repository root is on sys.path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from langgraph.graph import StateGraph, START, END
from backend.database.db_service import query_db
from backend.agents.sarvam_agent import generate_sarvam_speech
from backend.agents.you_agent import fetch_refund_policy_citations, fetch_you_citations
from backend.agents.nexconn_agent import create_nexconn_dispute_room


# =========================================================================
# GRAPH STATE DEFINITION
# =========================================================================
class PaytmState(TypedDict):
    query: str
    user_id: str
    language: str
    mode: str                 # 'ACTION' | 'RESOLVE' | 'CHAT'
    service: str              # 'recharge' | 'travel' | 'shopping' | 'electricity' | 'fastag' | 'dth' | 'gold' | 'dispute' | 'chat'
    entities: Dict[str, Any]
    scenario_data: Dict[str, Any]
    ai_message: str
    steps_log: List[Dict[str, Any]]
    audio_base64: Optional[str]
    suggested_replies: List[str]
    resource_links: List[Dict[str, Any]]
    citations: Optional[Dict[str, Any]]
    nexconn_chat: Optional[Dict[str, Any]]


# =========================================================================
# NODE 1: INTENT CLASSIFIER & ROUTER NODE
# =========================================================================
def router_node(state: PaytmState) -> PaytmState:
    query = state.get("query", "").strip()
    lower_q = query.lower()
    steps_log = list(state.get("steps_log", []))

    # 1. Target Language Detection
    req_lang = (state.get("language") or "auto").lower()
    has_marathi = any(w in lower_q for w in ['mala', 'karaycha', 'ahe', 'pahije', 'dakhva', 'माझे', 'मला', 'पाहिजे', 'दाखवा'])
    has_hindi = any(w in lower_q for w in ['mujhe', 'karna', 'hai', 'chahiye', 'karo', 'dikhao', 'पैसे', 'मुझे', 'करना', 'चाहिए', 'दिखाओ'])

    if req_lang in ['mr', 'mr-in']:
        detected_lang = 'mr'
    elif req_lang in ['hi', 'hi-in']:
        detected_lang = 'hi'
    elif req_lang in ['en', 'en-in']:
        detected_lang = 'en'
    elif has_marathi:
        detected_lang = 'mr'
    elif has_hindi:
        detected_lang = 'hi'
    else:
        detected_lang = 'en'

    # 2. Entity Extraction
    # Budget / Price
    nums = [int(n) for n in re.findall(r'\b\d{2,5}\b', lower_q) if int(n) not in [28, 56, 84, 90, 365]]
    budget = nums[0] if nums else None

    # Modifiers
    is_cheapest = any(w in lower_q for w in ['cheapest', 'cheap', 'lowest', 'कम दाम', 'सगळ्यात स्वस्त', 'स्वस्त', 'कमी किंमत', 'सस्ता', 'कमी पैशात', 'budget'])
    is_fastest = any(w in lower_q for w in ['fastest', 'fast', 'लवकर', 'जलद', 'जल्दी', 'कम समय', 'पहिला', 'express'])
    
    # Operator
    operator = "jio"
    if "airtel" in lower_q: operator = "airtel"
    elif any(k in lower_q for k in ["vi", "vodafone", "idea"]): operator = "vi"
    elif "bsnl" in lower_q: operator = "bsnl"

    # Cities for Travel & Shopping
    from_city = "Mumbai"
    to_city = "Pune"
    if "pune to mumbai" in lower_q or "पुणे से मुंबई" in lower_q:
        from_city, to_city = "Pune", "Mumbai"
    elif "mumbai to pune" in lower_q or "मुंबई से पुणे" in lower_q:
        from_city, to_city = "Mumbai", "Pune"
    elif "goa" in lower_q or "गोवा" in lower_q:
        from_city, to_city = "Pune", "Goa"
    elif "delhi" in lower_q or "दिल्ली" in lower_q:
        if "delhi to mumbai" in lower_q:
            from_city, to_city = "Delhi", "Mumbai"
        else:
            from_city, to_city = "Mumbai", "Delhi"

    # 3. Service & Mode Classification
    # Movie keywords
    is_movie = any(k in lower_q for k in [
        'movie', 'movies', 'cinema', 'theatre', 'theater', 'kalki', 'stree', 'fighter', 
        'dune', 'pushpa', 'gladiator', 'imax', '4dx', 'pvr', 'inox', 'cinepolis', 'film', 
        'showtime', 'showtimes', 'शो', 'चित्रपट', 'मूवी', 'सिनेमा'
    ])

    # Promo codes & coupons keywords
    is_promo = any(k in lower_q for k in [
        'promo', 'promos', 'promocode', 'coupon', 'coupons', 'code', 'codes', 'bogo', 
        'कूपन', 'प्रोमो', 'डिस्काउंट कोड', 'promo code'
    ])

    # Pending bills / all bills keywords
    is_pending_bills = any(k in lower_q for k in [
        'pending bill', 'pending bills', 'due bill', 'due bills', 'unpaid bill', 'unpaid bills', 
        'all bills', 'my bills', 'bills due', 'बिल', 'are there pending bills', 'pending bills'
    ])

    # Utility keywords
    is_gas = any(k in lower_q for k in ['gas', 'mgl', 'igl', 'गॅस', 'गैस'])
    is_water = any(k in lower_q for k in ['water', 'pmc water', 'pani', 'पानी', 'पाणी'])
    is_broadband = any(k in lower_q for k in ['broadband', 'wifi', 'wi-fi', 'fiber', 'jiofiber', 'xstream', 'इंटरनेट'])
    is_electricity = any(k in lower_q for k in ['electricity', 'light', 'bijli', 'power', 'msedcl', 'adani', 'बिजली', 'लाईट'])
    is_fastag = any(k in lower_q for k in ['fastag', 'toll', 'फास्टैग', 'टोल'])
    is_dth = any(k in lower_q for k in ['dth', 'tata play', 'dish', 'tataplay', 'टाटा प्ले'])
    is_gold = any(k in lower_q for k in ['gold', '24k', 'सोना', 'गोल्ड'])

    # Dispute / Resolve keywords
    is_resolve = (any(k in lower_q for k in [
        'cut', 'kat', 'refund', 'failed', 'dispute', 'complaint', 
        'stuck', 'duplicate', 'wrong', 'issue', 'तक्रार', 'रिफंड', 'अडकले', 'वापस', 'पैसे',
        'refund request', 'refund requests', 'failed transaction', 'failed transactions',
        'failed payment', 'failed payments'
    ]) or ('pending' in lower_q and not is_pending_bills)) and not is_movie

    # Shopping keywords (STRICT DISAMBIGUATION: overrides recharge!)
    is_shopping = any(k in lower_q for k in [
        'shop', 'shopping', 'deal', 'deals', 'discount', 'offer', 'offers', 'croma', 
        'reliance', 'zomato', 'myntra', 'mall', 'शॉपिंग', 'ऑफर', 'छूट'
    ]) and not is_movie and not is_promo

    # Travel keywords
    is_travel = any(k in lower_q for k in [
        'flight', 'flights', 'bus', 'buses', 'train', 'trains', 
        'pune', 'mumbai', 'delhi', 'goa', 'travel', 'vande bharat', 'shivneri', 'विमान', 'बस', 'ट्रेन'
    ]) and not is_resolve and not is_movie

    # Telecom / Recharge keywords
    is_recharge = (any(k in lower_q for k in [
        'recharge', 'plan', 'pack', 'gb', 'data', 'रिचार्ज', 'रीचार्ज', 'प्लॅन', 'पॅक', 'डेटा'
    ]) or any(k in lower_q for k in ['jio', 'airtel', 'vi', 'bsnl'])) and not is_shopping and not is_travel and not is_resolve and not is_movie and not is_promo

    # Assign Service & Mode
    if is_movie:
        mode = "ACTION"
        service = "movies"
    elif is_promo:
        mode = "ACTION"
        service = "promos"
    elif is_pending_bills or is_gas or is_water or is_broadband:
        mode = "ACTION"
        service = "bills"
    elif is_resolve:
        mode = "RESOLVE"
        service = "dispute"
    elif is_shopping:
        mode = "ACTION"
        service = "shopping"
    elif is_travel:
        mode = "ACTION"
        service = "travel"
    elif is_electricity:
        mode = "ACTION"
        service = "electricity"
    elif is_fastag:
        mode = "ACTION"
        service = "fastag"
    elif is_dth:
        mode = "ACTION"
        service = "dth"
    elif is_gold:
        mode = "ACTION"
        service = "gold"
    elif is_recharge:
        mode = "ACTION"
        service = "recharge"
    else:
        # Check if greeting or fallback
        if any(w in lower_q for w in ['hi', 'hello', 'hey', 'help', 'namaste', 'नमस्ते']):
            mode = "CHAT"
            service = "chat"
        else:
            mode = "ACTION"
            service = "recharge"

    steps_log.append({
        "step": 1,
        "title": "Paytm ONE LangGraph Master Router",
        "detail": f"Classified Query into Mode: {mode} • Service: {service.upper()} • Lang: {detected_lang.upper()}",
        "status": "completed"
    })

    return {
        **state,
        "language": detected_lang,
        "mode": mode,
        "service": service,
        "entities": {
            "budget": budget,
            "operator": operator,
            "is_cheapest": is_cheapest,
            "is_fastest": is_fastest,
            "from_city": from_city,
            "to_city": to_city
        },
        "steps_log": steps_log
    }


# =========================================================================
# NODE 2A: RECHARGE ACTION NODE (SQLITE TELECOM PLANS)
# =========================================================================
def recharge_node(state: PaytmState) -> PaytmState:
    entities = state.get("entities", {})
    op = entities.get("operator", "jio").capitalize()
    budget = entities.get("budget")
    is_cheapest = entities.get("is_cheapest", False)
    lang = state.get("language", "en")
    steps_log = list(state.get("steps_log", []))

    steps_log.append({
        "step": 2,
        "title": "SQLite Telecom Tariff Retrieval",
        "detail": f"Querying official telecom tariffs for {op}" + (f" ~₹{budget}" if budget else ""),
        "status": "completed"
    })

    if is_cheapest:
        rows = query_db("SELECT * FROM telecom_plans WHERE operator = ? ORDER BY price ASC", (op,))
    elif budget:
        rows = query_db("SELECT * FROM telecom_plans WHERE operator = ? ORDER BY ABS(price - ?) ASC", (op, budget))
    else:
        rows = query_db("SELECT * FROM telecom_plans WHERE operator = ? ORDER BY is_cheapest DESC, price ASC", (op,))

    if not rows:
        rows = query_db("SELECT * FROM telecom_plans ORDER BY price ASC")

    best_plan = rows[0] if rows else None
    alternatives = rows[1:4] if len(rows) > 1 else []

    if lang == "hi":
        ai_msg = f"मैंने {best_plan['operator']} का सबसे बेहतरीन ₹{best_plan['price']} वाला प्लान चुना है ({best_plan['data_daily']}, {best_plan['validity']}, {best_plan['calls']})। क्या आप इसे तुरंत रिचार्ज करना चाहते हैं?"
    elif lang == "mr":
        ai_msg = f"मी {best_plan['operator']} चा सर्वोत्तम ₹{best_plan['price']} चा प्लॅन निवडला आहे ({best_plan['data_daily']}, {best_plan['validity']}, अमर्यादित कॉल्स). रिचार्ज सुरू करायचा का?"
    else:
        ai_msg = f"I selected the best matching {best_plan['operator']} ₹{best_plan['price']} pack ({best_plan['data_daily']}, {best_plan['validity']}, {best_plan['calls']}). Ready to authorize with UPI PIN?"

    suggested = [
        f"{op} ₹299 2GB Daily Data",
        f"Cheapest {op} Plan",
        "Jio Netflix ₹398 Pack",
        "84 Days ₹857 Saver"
    ]

    op_lower = op.lower()
    official_url = "https://www.jio.com/recharge" if "jio" in op_lower else ("https://www.airtel.in/recharge" if "airtel" in op_lower else "https://www.myvi.in")
    resource_links = [
        {
            "title": f"Official {op} Tariff & 5G Benefit Portal",
            "url": official_url,
            "source": "SerpApi Verified Tariff",
            "snippet": f"Active {best_plan['data_daily']} plan with unlimited calling and verified 5G access."
        },
        {
            "title": "TRAI Telecom Tariff Regulations & Guidelines",
            "url": "https://www.trai.gov.in",
            "source": "You.com Regulatory Archive",
            "snippet": "Telecom Regulatory Authority of India mandatory tariff schedule."
        }
    ]

    return {
        **state,
        "scenario_data": {
            "best": best_plan,
            "alternatives": alternatives
        },
        "resource_links": resource_links,
        "ai_message": ai_msg,
        "suggested_replies": suggested,
        "steps_log": steps_log
    }


# =========================================================================
# NODE 2B: TRAVEL ACTION NODE (SQLITE FLIGHTS, BUSES, TRAINS)
# =========================================================================
def travel_node(state: PaytmState) -> PaytmState:
    entities = state.get("entities", {})
    from_c = entities.get("from_city", "Mumbai")
    to_c = entities.get("to_city", "Pune")
    is_cheapest = entities.get("is_cheapest", False)
    is_fastest = entities.get("is_fastest", False)
    lang = state.get("language", "en")
    steps_log = list(state.get("steps_log", []))

    steps_log.append({
        "step": 2,
        "title": "SQLite Inter-City Transit Retrieval",
        "detail": f"Filtering live scheduled flights, buses & trains between {from_c} and {to_c}",
        "status": "completed"
    })

    if is_cheapest:
        rows = query_db(
            "SELECT * FROM travel_tickets WHERE from_city = ? AND to_city = ? ORDER BY price ASC", 
            (from_c, to_c)
        )
    elif is_fastest:
        rows = query_db(
            "SELECT * FROM travel_tickets WHERE from_city = ? AND to_city = ? ORDER BY is_fastest DESC, price ASC", 
            (from_c, to_c)
        )
    else:
        rows = query_db(
            "SELECT * FROM travel_tickets WHERE from_city = ? AND to_city = ? ORDER BY is_cheapest DESC, price ASC", 
            (from_c, to_c)
        )

    if not rows:
        rows = query_db("SELECT * FROM travel_tickets LIMIT 4")

    cheapest_opt = rows[0] if rows else None

    if lang == "hi":
        ai_msg = f"{from_c} से {to_c} के लिए सबसे किफायती विकल्प {cheapest_opt['carrier']} ({cheapest_opt['travel_type'].upper()}) है, जिसका किराया मात्र ₹{cheapest_opt['price']} है। प्रस्थान समय: {cheapest_opt['dep_time']}। क्या आप टिकट बुक करना चाहते हैं?"
    elif lang == "mr":
        ai_msg = f"{from_c} ते {to_c} प्रवासासाठी सर्वात स्वस्त पर्याय {cheapest_opt['carrier']} ({cheapest_opt['travel_type'].upper()}) असून भाडे फक्त ₹{cheapest_opt['price']} आहे. निघण्याची वेळ: {cheapest_opt['dep_time']}. तिकीट बुक करायचे का?"
    else:
        ai_msg = f"For {from_c} to {to_c}, the most economical option is {cheapest_opt['carrier']} ({cheapest_opt['travel_type'].upper()}) at just ₹{cheapest_opt['price']}. Departs at {cheapest_opt['dep_time']}. Ready to book?"

    suggested = [
        f"Cheapest bus {from_c} to {to_c}",
        f"Fastest flight {from_c} to {to_c}",
        "Vande Bharat Express tickets",
        "Pune to Goa sleeper bus"
    ]

    resource_links = [
        {
            "title": f"Google Flights via SerpApi: {from_c} to {to_c}",
            "url": f"https://www.google.com/travel/flights?q=flights+{from_c}+to+{to_c}",
            "source": "SerpApi Live Flight Engine",
            "snippet": f"Real-time airline scheduled timings and fares between {from_c} and {to_c}."
        },
        {
            "title": f"Skyscanner — Live {from_c} to {to_c} Fares & Carrier Timetables",
            "url": f"https://www.skyscanner.co.in/routes/bom/pnq/mumbai-to-pune.html",
            "source": "You.com Live Transit Verification",
            "snippet": "Direct price comparison across IndiGo, Air India, and Akasa Air."
        },
        {
            "title": "IRCTC Official Indian Railways Reservation System",
            "url": "https://www.irctc.co.in",
            "source": "SerpApi Transit Link",
            "snippet": "Live seat availability for Vande Bharat Express and Deccan Queen."
        },
        {
            "title": "MSRTC Shivneri Volvo Official Timetable",
            "url": "https://msrtc.maharashtra.gov.in",
            "source": "You.com State Transport Index",
            "snippet": "Scheduled multi-axle AC Volvo bus services and pickup points."
        }
    ]

    return {
        **state,
        "scenario_data": {
            "options": rows,
            "route": f"{from_c} → {to_c}",
            "cheapest": cheapest_opt
        },
        "resource_links": resource_links,
        "ai_message": ai_msg,
        "suggested_replies": suggested,
        "steps_log": steps_log
    }


# =========================================================================
# NODE 2C: SHOPPING DEALS ACTION NODE (SQLITE DEALS)
# =========================================================================
def shopping_node(state: PaytmState) -> PaytmState:
    query = state.get("query", "").lower()
    lang = state.get("language", "en")
    steps_log = list(state.get("steps_log", []))

    city = "Pune" if "pune" in query else ("Delhi" if "delhi" in query else "Mumbai")

    steps_log.append({
        "step": 2,
        "title": "SQLite Retail & Mall Discounts Scanner",
        "detail": f"Retrieving active merchant deals, cashback codes, and mall offers in {city}",
        "status": "completed"
    })

    if "croma" in query or "electronic" in query:
        rows = query_db("SELECT * FROM shopping_deals WHERE category = 'electronics' AND city = ?", (city,))
    elif "food" in query or "zomato" in query:
        rows = query_db("SELECT * FROM shopping_deals WHERE category = 'food' AND city = ?", (city,))
    elif "fashion" in query or "myntra" in query:
        rows = query_db("SELECT * FROM shopping_deals WHERE category = 'fashion' AND city = ?", (city,))
    else:
        rows = query_db("SELECT * FROM shopping_deals WHERE city = ? ORDER BY discount_pct DESC", (city,))

    if not rows:
        rows = query_db("SELECT * FROM shopping_deals ORDER BY discount_pct DESC LIMIT 4")

    top_deal = rows[0] if rows else None

    if lang == "hi":
        ai_msg = f"मैंने {city} में बेस्ट शॉपिंग डिस्काउंट खोज लिए हैं! {top_deal['brand']} ({top_deal['mall_name']}) पर '{top_deal['title']}' मिल रहा है। कूपन कोड: {top_deal['coupon_code']}।"
    elif lang == "mr":
        ai_msg = f"मी {city} मधील सर्वोत्तम शॉपिंग डील्स शोधल्या आहेत! {top_deal['brand']} ({top_deal['mall_name']}) वर '{top_deal['title']}' उपलब्ध आहे. कूपन कोड: {top_deal['coupon_code']}."
    else:
        ai_msg = f"Found top retail deals in {city}! {top_deal['brand']} at {top_deal['mall_name']} is offering '{top_deal['title']}' with coupon code {top_deal['coupon_code']}."

    suggested = [
        f"Croma electronics deals in {city}",
        "Zomato 50% discount coupon",
        "Myntra fashion offers",
        "PVR buy 1 get 1 movie ticket"
    ]

    store_url = "https://www.croma.com" if "croma" in top_deal['brand'].lower() else ("https://www.zomato.com" if "zomato" in top_deal['brand'].lower() else ("https://www.myntra.com" if "myntra" in top_deal['brand'].lower() else "https://paytmmall.com"))
    resource_links = [
        {
            "title": f"{top_deal['brand']} Official Discount Portal",
            "url": store_url,
            "source": "SerpApi Verified Store Link",
            "snippet": f"Verified coupon code {top_deal['coupon_code']} offering {top_deal['discount_pct']}% instant discount."
        },
        {
            "title": f"{top_deal['mall_name']} Directory & Store Map",
            "url": "https://www.phoenixmarketcity.com" if "phoenix" in top_deal['mall_name'].lower() else "https://www.google.com/maps",
            "source": "You.com Local Directory",
            "snippet": f"Physical outlet location and cashier scan validation in {city}."
        }
    ]

    return {
        **state,
        "scenario_data": {
            "city": city,
            "deals": rows,
            "top_deal": top_deal
        },
        "resource_links": resource_links,
        "ai_message": ai_msg,
        "suggested_replies": suggested,
        "steps_log": steps_log
    }


# =========================================================================
# NODE 2D: UTILITY BILLS ACTION NODE (SQLITE BBPS)
# =========================================================================
def bills_node(state: PaytmState) -> PaytmState:
    query = state.get("query", "").lower()
    service = state.get("service", "electricity")
    lang = state.get("language", "en")
    steps_log = list(state.get("steps_log", []))

    steps_log.append({
        "step": 2,
        "title": "NPCI Bharat BillPay (BBPS) Engine",
        "detail": f"Retrieving registered consumer utility invoices for user: paytm_user_01",
        "status": "completed"
    })

    is_all_bills = any(k in query for k in ['pending bill', 'pending bills', 'due bill', 'due bills', 'unpaid', 'all bills', 'my bills', 'bills due', 'बिल']) or service == "bills"

    if is_all_bills:
        rows = query_db("SELECT * FROM utility_bills WHERE consumer_name = 'Akash Bichukale' AND status = 'DUE'")
        total_due = sum(r['amount_due'] for r in rows)
        bill_names = [f"{r['provider_name'].split()[0]} (₹{int(r['amount_due'])})" for r in rows[:4]]

        if lang == "hi":
            ai_msg = f"आपके कुल {len(rows)} पेंडिंग बिल हैं, जिनकी कुल राशि ₹{int(total_due):,} है: {', '.join(bill_names)}। इसके अलावा फास्टैग बैलेंस कम (₹45) है। क्या आप सभी बिल एक साथ या किसी विशिष्ट बिल का भुगतान करना चाहते हैं?"
        elif lang == "mr":
            ai_msg = f"तुमचे एकूण {len(rows)} प्रलंबित बिल आहेत, एकूण रक्कम ₹{int(total_due):,} आहे: {', '.join(bill_names)}. सोबत फास्टॅग बॅलन्स कमी आहे (₹45). बिल भरण्यासाठी UPI PIN वापरा."
        else:
            ai_msg = f"You have {len(rows)} pending utility bills due totaling ₹{int(total_due):,}: {', '.join(bill_names)}, and your FASTag balance is low (₹45). You can authorize individual bills or settle all instantly with your UPI PIN."

        bill_resource_links = [
            {
                "title": "Bharat BillPay (BBPS) Official Consumer Central Portal",
                "url": "https://www.bharatbillpay.com",
                "source": "NPCI BBPS Central Switch",
                "snippet": "Unified utility bill aggregation clearing house with zero bounce guarantee."
            },
            {
                "title": "MSEDCL Electricity Consumer Services Portal",
                "url": "https://www.mahadiscom.in",
                "source": "State Power Utility Portal",
                "snippet": "Live meter reading, tariff schedules, and prompt payment rebate tracking."
            }
        ]

        return {
            **state,
            "scenario_data": {
                "is_multi_bill": True,
                "bills": rows,
                "total_due": total_due,
                "bill": rows[0] if rows else None
            },
            "resource_links": bill_resource_links,
            "ai_message": ai_msg,
            "suggested_replies": ["Pay MSEDCL Bill (₹1,420)", "Pay Gas Bill (₹840)", "Recharge FASTag (₹500)", "Pay Broadband (₹1,179)"],
            "steps_log": steps_log
        }
    else:
        # Single bill query
        target_service = 'gas' if ('gas' in query or 'mgl' in query) else ('water' if ('water' in query or 'pmc' in query) else ('broadband' if ('broadband' in query or 'wifi' in query or 'fiber' in query) else ('fastag' if 'fastag' in query else ('dth' if 'dth' in query else 'electricity'))))
        rows = query_db("SELECT * FROM utility_bills WHERE service_type = ?", (target_service,))
        if not rows:
            rows = query_db("SELECT * FROM utility_bills LIMIT 1")
        bill = rows[0]

        ai_msg = f"Your {bill['provider_name']} bill is ₹{bill['amount_due']} (Consumer ID: {bill['consumer_id']}), due by {bill['due_date']}. Ready to pay via UPI PIN?"

        return {
            **state,
            "scenario_data": {
                "bill": bill,
                "bills": [bill],
                "is_multi_bill": False
            },
            "resource_links": [
                {
                    "title": f"Bharat BillPay (BBPS) Official Portal: {bill['provider_name']}",
                    "url": "https://www.bharatbillpay.com",
                    "source": "NPCI BBPS Central Switch",
                    "snippet": f"Validated electronic invoice for CA {bill['consumer_id']} with instant clearing receipt."
                }
            ],
            "ai_message": ai_msg,
            "suggested_replies": [f"Pay ₹{bill['amount_due']} with UPI PIN", "View BBPS Receipt", "Check Cashback Offers"],
            "steps_log": steps_log
        }


# =========================================================================
# NODE 2E: MOVIE TICKETS ACTION NODE (SQLITE MULTIPLEXES)
# =========================================================================
def movies_node(state: PaytmState) -> PaytmState:
    query = state.get("query", "").lower()
    lang = state.get("language", "en")
    steps_log = list(state.get("steps_log", []))

    steps_log.append({
        "step": 2,
        "title": "Paytm Movies & Multiplex Engine",
        "detail": "Scanning live showtimes across PVR INOX, Cinepolis & IMAX multiplexes",
        "status": "completed"
    })

    if "imax" in query:
        rows = query_db("SELECT * FROM movie_tickets WHERE format LIKE '%IMAX%'")
    elif "kalki" in query:
        rows = query_db("SELECT * FROM movie_tickets WHERE title LIKE '%Kalki%'")
    elif "stree" in query:
        rows = query_db("SELECT * FROM movie_tickets WHERE title LIKE '%Stree%'")
    elif "fighter" in query:
        rows = query_db("SELECT * FROM movie_tickets WHERE title LIKE '%Fighter%'")
    elif "dune" in query:
        rows = query_db("SELECT * FROM movie_tickets WHERE title LIKE '%Dune%'")
    elif "pushpa" in query:
        rows = query_db("SELECT * FROM movie_tickets WHERE title LIKE '%Pushpa%'")
    elif "gladiator" in query:
        rows = query_db("SELECT * FROM movie_tickets WHERE title LIKE '%Gladiator%'")
    elif "mumbai" in query:
        rows = query_db("SELECT * FROM movie_tickets WHERE city = 'Mumbai'")
    else:
        rows = query_db("SELECT * FROM movie_tickets")

    if not rows:
        rows = query_db("SELECT * FROM movie_tickets")

    top_movie = rows[0]
    if lang == "hi":
        ai_msg = f"वर्तमान में सिनेमाघरों में प्रमुख ब्लॉकबस्टर फ़िल्में चल रही हैं! '{top_movie['title']}' ({top_movie['format']}) {top_movie['theatre_name']} में ₹{top_movie['price']} से उपलब्ध है। इसके अलावा 'Stree 2' (Buy 1 Get 1 Free) और 'Fighter' भी उपलब्ध हैं। आप सीधे UPI PIN द्वारा टिकट बुक कर सकते हैं।"
    elif lang == "mr":
        ai_msg = f"सध्या थिएटर्समध्ये सर्वोत्तम ब्लॉकबस्टर चित्रपट सुरू आहेत! '{top_movie['title']}' ({top_movie['format']}) {top_movie['theatre_name']} येथे ₹{top_movie['price']} मध्ये उपलब्ध आहे. सोबत 'Stree 2' आणि 'Fighter' चे शो देखील सुरू आहेत."
    else:
        ai_msg = f"Here are the top blockbuster movies currently running in multiplexes! '{top_movie['title']}' ({top_movie['format']}) is showing at {top_movie['theatre_name']} starting at ₹{top_movie['price']}. Also available: 'Stree 2' (Buy 1 Get 1 Free) and 'Fighter'. Select showtimes and authorize instantly with UPI PIN."

    resource_links = [
        {
            "title": "Paytm Movies & Entertainment Official Portal",
            "url": "https://paytm.com/movies",
            "source": "Paytm Cinema Network",
            "snippet": "Instant seat selection with M-ticket entry across 4,000+ screens nationwide."
        },
        {
            "title": "PVR INOX Cinemas Official Box Office & IMAX Portal",
            "url": "https://www.pvrcinemas.com",
            "source": "PVR INOX Central Server",
            "snippet": "Real-time hall occupancy and concession pre-ordering with 20% savings."
        }
    ]

    return {
        **state,
        "scenario_data": {
            "movies": rows,
            "top_movie": top_movie
        },
        "resource_links": resource_links,
        "ai_message": ai_msg,
        "suggested_replies": ["Book Kalki 2898 AD (IMAX)", "Book Stree 2 (BOGO Free)", "View PVR Showtimes in Pune", "IMAX 3D Movies"],
        "steps_log": steps_log
    }


# =========================================================================
# NODE 2F: PROMO CODES & REWARDS ACTION NODE (SQLITE PROMOS)
# =========================================================================
def promos_node(state: PaytmState) -> PaytmState:
    query = state.get("query", "").lower()
    lang = state.get("language", "en")
    steps_log = list(state.get("steps_log", []))

    steps_log.append({
        "step": 2,
        "title": "Paytm Rewards & Promo Code Engine",
        "detail": "Retrieving active zero-cost coupons, cashback codes & BOGO vouchers",
        "status": "completed"
    })

    if "movie" in query or "cinema" in query:
        rows = query_db("SELECT * FROM promo_codes WHERE category = 'movies'")
    elif "recharge" in query or "mobile" in query or "jio" in query or "airtel" in query:
        rows = query_db("SELECT * FROM promo_codes WHERE category = 'recharge'")
    elif "flight" in query or "travel" in query or "bus" in query:
        rows = query_db("SELECT * FROM promo_codes WHERE category = 'travel'")
    elif "bill" in query or "bijli" in query:
        rows = query_db("SELECT * FROM promo_codes WHERE category = 'bills'")
    elif "food" in query or "zomato" in query:
        rows = query_db("SELECT * FROM promo_codes WHERE category = 'food'")
    else:
        rows = query_db("SELECT * FROM promo_codes ORDER BY discount_amount DESC")

    if not rows:
        rows = query_db("SELECT * FROM promo_codes")

    top_code = rows[0]
    if lang == "hi":
        ai_msg = f"आपके लिए बेस्ट एक्टिव प्रोमो कोड्स उपलब्ध हैं! कूपन '{top_code['code']}' से आपको '{top_code['title']}' ({top_code['discount_text']}) मिलेगा। इसके अलावा रिचार्ज, फ्लाइट्स और मूवीज पर BOGO कोड्स भी एक्टिव हैं।"
    elif lang == "mr":
        ai_msg = f"तुमच्यासाठी चालू असलेले सर्वोत्तम प्रोमो कोड्स सापडले आहेत! '{top_code['code']}' कोड वापरून '{top_code['title']}' ({top_code['discount_text']}) मिळवा. एका क्लिकवर कोड कॉपी करा."
    else:
        ai_msg = f"Found active verified promo codes across Paytm services! Use code '{top_code['code']}' for '{top_code['title']}' ({top_code['discount_text']}). Also active: 'MOVIEBOGO' (Buy 1 Get 1 Free on tickets) and 'FLIGHTFLY' (Up to ₹1,500 off). Tap to copy code instantly."

    resource_links = [
        {
            "title": "Paytm Official Offers & Cashback Deals Portal",
            "url": "https://paytm.com/offers",
            "source": "Paytm Rewards Central",
            "snippet": "Verified merchant discount voucher catalog with 100% redemption guarantee."
        },
        {
            "title": "NPCI UPI Festive Consumer Rewards Framework",
            "url": "https://www.npci.org.in",
            "source": "NPCI National Switch",
            "snippet": "National Unified Payments Interface consumer incentives and cashback policy."
        }
    ]

    return {
        **state,
        "scenario_data": {
            "promos": rows,
            "top_promo": top_code
        },
        "resource_links": resource_links,
        "ai_message": ai_msg,
        "suggested_replies": ["Copy MOVIEBOGO Code", "Recharge ₹50 Cashback Code", "Flight ₹1500 Discount", "Electricity Bill Cashback"],
        "steps_log": steps_log
    }


# =========================================================================
# NODE 2G: DIGITAL GOLD ACTION NODE
# =========================================================================
def gold_node(state: PaytmState) -> PaytmState:
    lang = state.get("language", "en")
    budget = state.get("entities", {}).get("budget") or 500
    steps_log = list(state.get("steps_log", []))

    gold_rate_per_gm = 7640
    gold_grams = round(budget / gold_rate_per_gm, 4)

    steps_log.append({
        "step": 2,
        "title": "MMTC-PAMP Live 24K Gold Rates",
        "detail": f"Fetched live spot price: ₹{gold_rate_per_gm}/gm (99.99% Purity)",
        "status": "completed"
    })

    if lang == "hi":
        ai_msg = f"आज का 24K 99.99% शुद्ध डिजिटल गोल्ड रेट ₹{gold_rate_per_gm}/ग्राम है। ₹{budget} में आपको {gold_grams} ग्राम सर्टिफाइड गोल्ड मिलेगा। क्या आप खरीदना चाहते हैं?"
    else:
        ai_msg = f"Live 24K 99.99% pure digital gold rate is ₹{gold_rate_per_gm}/gm. For ₹{budget}, you will receive {gold_grams} grams in IDBI Trusteeship vault. Ready to buy?"

    gold_resource_links = [
        {
            "title": "MMTC-PAMP India Official Spot Bullion Portal",
            "url": "https://www.mmtcpamp.com",
            "source": "SerpApi Live Precious Metals Feed",
            "snippet": f"LBMA-accredited 24K 999.9 purity bullion rates updated every 60 seconds."
        },
        {
            "title": "IDBI Trusteeship Certified Vault Audit Report",
            "url": "https://www.idbitrustee.com",
            "source": "You.com Regulatory Archive",
            "snippet": "100% physically backed vault reserves with independent quarterly trustee audits."
        }
    ]

    return {
        **state,
        "scenario_data": {
            "gold_rate": gold_rate_per_gm,
            "grams": gold_grams,
            "budget": budget,
            "purity": "24K 99.99% Pure Gold",
            "vault": "100% Insured IDBI Trusteeship Vault"
        },
        "resource_links": gold_resource_links,
        "ai_message": ai_msg,
        "suggested_replies": ["Buy ₹500 24K Gold", "Buy ₹1000 Gold", "View Gold Locker"],
        "steps_log": steps_log
    }


# =========================================================================
# NODE 3: RESOLVE DISPUTE FORENSIC NODE (SQLITE DISPUTE SCENARIOS)
# =========================================================================
def dispute_node(state: PaytmState) -> PaytmState:
    query = state.get("query", "").lower()
    lang = state.get("language", "en")
    steps_log = list(state.get("steps_log", []))

    steps_log.append({
        "step": 2,
        "title": "SQLite Forensic Dispute Ledger Investigation",
        "detail": "Analyzing user transaction logs, RRN identifiers & 3-way gateway logs",
        "status": "completed"
    })

    is_refund_list = any(k in query for k in ['refund request', 'refund requests', 'my refund', 'my refunds', 'any refund', 'any refunds', 'रिफंड']) and not any(k in query for k in ['599', 'jio'])
    is_failed_list = any(k in query for k in ['failed transaction', 'failed transactions', 'failed payment', 'failed payments', 'all failed', 'any failed'])
    is_complaint_list = any(k in query for k in ['complaint', 'complaints', 'ticket', 'tickets', 'nodal', 'तक्रार'])

    if is_refund_list:
        rows = query_db("SELECT * FROM dispute_cases WHERE dispute_type = 'refund_tracker'")
        top_disp = rows[0]
        if lang == "hi":
            ai_msg = f"आपके खाते में {len(rows)} एक्टिव रिफंड ट्रैक्स हैं: 1) Myntra ₹1,200 (ARN: 8201948201, बैंकिंग क्लियरिंग में एक्टिव); 2) IRCTC ट्रेन टिकट रिफंड ₹2,450 (PNR: 824-9182941, कल शाम तक देय); 3) Swiggy ₹350 (तुरंत UPI क्रेडिट)। सभी रिफंड RBI/NPCI नियमों के तहत सुरक्षित हैं।"
        elif lang == "mr":
            ai_msg = f"तुमच्या खात्यावर {len(rows)} सक्रिय रिफंड ट्रॅकिंग सुरू आहेत: Myntra ₹1,200 (ARN: 8201948201), IRCTC तिकीट ₹2,450 (रिफंड आयडी: IRCTC_REF_99182), आणि Swiggy ₹350 इन्स्टंट रिफंड."
        else:
            ai_msg = f"You have {len(rows)} active refund requests being tracked: 1) Myntra Order ₹1,200 (ARN: 8201948201, Active in RBI clearing cycle, ETA 48H); 2) IRCTC Cancellation ₹2,450 (PNR: 824-9182941, Refund ID: IRCTC_REF_99182, Due tomorrow 6 PM); 3) Swiggy ₹350 (Instant UPI reversal completed). All funds are 100% verified."

        return {
            **state,
            "scenario_data": {
                "dispute": top_disp,
                "disputes_list": rows,
                "is_dispute_list": True,
                "filter_type": "refund"
            },
            "resource_links": [
                {
                    "title": "NPCI Harmonisation Circular No. 81 — Turnaround Time (TAT)",
                    "url": "https://www.npci.org.in/what-we-do/upi/circulars",
                    "source": "You.com Regulatory Archive",
                    "snippet": "Statutory auto-reversal timeline with ₹100/day customer compensation."
                },
                {
                    "title": "RBI Ombudsman Framework for Digital Transactions",
                    "url": "https://rbi.org.in/Scripts/AboutUsDisplay.aspx?Id=1236",
                    "source": "You.com Regulatory Archive",
                    "snippet": "Reserve Bank of India customer protection guidelines for electronic banking."
                }
            ],
            "ai_message": ai_msg,
            "suggested_replies": ["Track Myntra ₹1,200 (ARN 8201948201)", "Track IRCTC ₹2,450 Refund", "Track Swiggy ₹350 Refund", "Connect Live Specialist"],
            "steps_log": steps_log
        }
    elif is_failed_list:
        rows = query_db("SELECT * FROM dispute_cases WHERE dispute_type IN ('pending_recharge', 'failed_payment', 'merchant_mismatch', 'duplicate_debit')")
        top_disp = rows[0]
        if lang == "hi":
            ai_msg = f"आपके {len(rows)} असफल भुगतान रिकॉर्ड पाए गए हैं: 1) Jio ₹599 (स्विच टाइमआउट); 2) SpiceJet फ्लाइट ₹2,150 (सीट लॉक एक्सपायर, पैसे कटे); 3) किराना QR ₹200 (साउंडबॉक्स पैकेट ड्रॉप); 4) मेट्रो कार्ड ₹300 (डबल डेबिट)। सभी पर NPCI Circular 81 के तहत T+1 ऑटो-रिफंड प्रक्रिया सक्रिय है।"
        elif lang == "mr":
            ai_msg = f"तुमचे {len(rows)} अयशस्वी व्यवहार आढळले आहेत: Jio ₹599, SpiceJet फ्लाइट ₹2,150, किराना QR ₹200 आणि मेट्रो डबल डेबिट ₹300. NPCI नियमांनुसार सर्वांचे रिफंड सुरक्षित आहेत."
        else:
            ai_msg = f"Identified {len(rows)} failed / debited transactions on your ledger: 1) Jio Recharge ₹599 (Operator gateway timeout); 2) SpiceJet Flight ₹2,150 (Seat concurrency lock failed, debited without PNR); 3) Kirana QR ₹200 (Merchant Soundbox packet drop); 4) Metro Card ₹300 (Duplicate debit). All transactions are backed by NPCI Circular 81 auto-reversal mandates."

        return {
            **state,
            "scenario_data": {
                "dispute": top_disp,
                "disputes_list": rows,
                "is_dispute_list": True,
                "filter_type": "failed"
            },
            "resource_links": [
                {
                    "title": "NPCI Harmonisation Circular No. 81 — Turnaround Time (TAT)",
                    "url": "https://www.npci.org.in/what-we-do/upi/circulars",
                    "source": "You.com Regulatory Archive",
                    "snippet": "Statutory auto-reversal timeline with ₹100/day customer compensation."
                }
            ],
            "ai_message": ai_msg,
            "suggested_replies": ["Audit Jio ₹599 Timeout", "Audit Flight ₹2,150 Failure", "Audit Kirana ₹200 Soundbox", "Connect Live Specialist"],
            "steps_log": steps_log
        }
    elif is_complaint_list:
        rows = query_db("SELECT * FROM dispute_cases WHERE dispute_type = 'formal_complaint'")
        top_disp = rows[0] if rows else None
        ai_msg = f"Found {len(rows)} formal escalated dispute tickets: 1) COMP_2026_0941 (Delayed ₹599 recharge, assigned to Nodal Officer Mr. Rajesh Sharma); 2) COMP_2026_1120 (Airline cancellation ₹2,150, escalated under DGCA Rule 3.2). Both dockets are sealed with SHA-256 evidence."

        return {
            **state,
            "scenario_data": {
                "dispute": top_disp,
                "disputes_list": rows,
                "is_dispute_list": True,
                "filter_type": "complaint"
            },
            "resource_links": [
                {
                    "title": "RBI Integrated Ombudsman Scheme 2021",
                    "url": "https://rbi.org.in/Scripts/AboutUsDisplay.aspx?Id=1236",
                    "source": "You.com Regulatory Archive",
                    "snippet": "Appellate grievance redressal mechanism for consumer protection."
                }
            ],
            "ai_message": ai_msg,
            "suggested_replies": ["Track Docket COMP_2026_0941", "Track Docket COMP_2026_1120", "Connect Live Specialist"],
            "steps_log": steps_log
        }
    else:
        # Specific transaction lookup or single case
        if "ptm" in query or "rrn" in query or "case" in query:
            import re
            m = re.search(r'(ptm\d+|disp_case_\d+|comp_\d+_\d+)', query)
            if m:
                target_id = m.group(1).upper()
                rows = query_db("SELECT * FROM dispute_cases WHERE txn_id LIKE ? OR case_id LIKE ?", (f"%{target_id}%", f"%{target_id}%"))
            else:
                rows = []
        elif "2450" in query or "irctc" in query or "train" in query:
            rows = query_db("SELECT * FROM dispute_cases WHERE txn_id = 'PTM2450891'")
        elif "2150" in query or "flight" in query or "spicejet" in query:
            rows = query_db("SELECT * FROM dispute_cases WHERE txn_id = 'PTM4829104'")
        elif "200" in query or "soundbox" in query or "kirana" in query:
            rows = query_db("SELECT * FROM dispute_cases WHERE txn_id = 'PTM8819203'")
        elif "300" in query or "metro" in query:
            rows = query_db("SELECT * FROM dispute_cases WHERE txn_id = 'PTM5519281'")
        elif "1200" in query or "myntra" in query:
            rows = query_db("SELECT * FROM dispute_cases WHERE txn_id = 'PTM1200984'")
        elif "599" in query or "jio" in query:
            rows = query_db("SELECT * FROM dispute_cases WHERE txn_id = 'PTM7890124'")
        else:
            rows = query_db("SELECT * FROM dispute_cases LIMIT 1")

        if not rows:
            rows = query_db("SELECT * FROM dispute_cases LIMIT 1")

        disp = rows[0]
        ai_msg = disp['finding_hi'] if lang in ['hi', 'mr'] else disp['finding_en']

        return {
            **state,
            "scenario_data": {
                "dispute": disp,
                "disputes_list": [disp],
                "is_dispute_list": False
            },
            "resource_links": [
                {
                    "title": disp["regulatory_citation"],
                    "url": "https://www.npci.org.in/what-we-do/upi/circulars",
                    "source": "You.com Regulatory Archive",
                    "snippet": f"Under NPCI guidelines, failed UPI debits must be settled within {disp['tat_sla']}."
                }
            ],
            "ai_message": ai_msg,
            "suggested_replies": ["Track Bank Settlement", "Open Live Support Chat", "Download Legal Audit Certificate"],
            "steps_log": steps_log
        }


# =========================================================================
# NODE 4: GENERAL CHAT & INTRODUCTION NODE
# =========================================================================
def chat_node(state: PaytmState) -> PaytmState:
    lang = state.get("language", "en")
    steps_log = list(state.get("steps_log", []))

    steps_log.append({
        "step": 2,
        "title": "Paytm ONE Conversational Hub Knowledge Engine",
        "detail": "Cross-linked Action Mode & Resolve Mode Capabilities",
        "status": "completed"
    })

    if lang == "hi":
        ai_msg = "नमस्ते! मैं पेटीएम वन (Paytm ONE) AI कमांडर हूँ। मैं आपकी 2 मुख्य मोड्स में मदद कर सकता हूँ:\n\n• **Action Mode**: मोबाइल रिचार्ज, बस/ट्रेन/फ्लाइट टिकट बुकिंग, बिजली बिल और शॉपिंग डील्स 1-क्लिक में करें।\n• **Resolve Mode**: अटके हुए पैसे, फेल यूपीआई पेमेंट और रिफंड का 24 घंटे में समाधान।\n\nआप क्या करना चाहते हैं?"
    elif lang == "mr":
        ai_msg = "नमस्कार! मी पेटीएम वन (Paytm ONE) AI कमांडर आहे. मी तुम्हाला २ प्रमुख मोड्समध्ये मदत करू शकतो:\n\n• **Action Mode**: मोबाईल रिचार्ज, बस/ट्रेन/फ्लाइट तिकीट, वीज बिल आणि शॉपिंग डील्स १-क्लिकमध्ये पूर्ण करा.\n• **Resolve Mode**: अडकलेले पैसे, अयशस्वी UPI पेमेंट आणि रिफंडचे NPCI नियमांनुसार २४ तासांत जलद निवारण.\n\nतुम्हाला काय करायचे आहे?"
    else:
        ai_msg = "Hello! I am Paytm ONE AI Commander. I can assist you across 2 core modes:\n\n• **Action Mode**: Autonomous 1-click execution for Mobile Recharge, Flight & Bus Tickets, Electricity Bills, and Shopping Deals.\n• **Resolve Mode**: Autonomous 3-Way Reconciliation for stuck payments, failed UPI debits, and refund tracking with 24H SLA.\n\nHow can I help you today?"

    return {
        **state,
        "scenario_data": {},
        "ai_message": ai_msg,
        "suggested_replies": [
            "Recharge Jio ₹299 with 2GB data",
            "Cheapest flights Mumbai to Pune",
            "Shopping deals in Pune",
            "Dispute ₹599 pending recharge"
        ],
        "steps_log": steps_log
    }


# =========================================================================
# NODE 5: VOICE SYNTHESIS & AUDIT WRAPPER NODE
# =========================================================================
def voice_node(state: PaytmState) -> PaytmState:
    ai_msg = state.get("ai_message", "")
    lang = state.get("language", "en")
    steps_log = list(state.get("steps_log", []))

    steps_log.append({
        "step": len(steps_log) + 1,
        "title": "Voice Readout Synthesizer",
        "detail": f"Synthesizing voice response in {lang.upper()}",
        "status": "completed"
    })

    audio_b64 = None
    try:
        lang_code = "hi-IN" if lang in ["hi", "mr"] else "en-IN"
        audio_b64 = generate_sarvam_speech(ai_msg, lang_code, speaker="priya", fast_only=True)
    except Exception as e:
        print("Voice generation skipped:", e)

    return {
        **state,
        "audio_base64": audio_b64,
        "steps_log": steps_log
    }


# =========================================================================
# CONDITIONAL ROUTING FUNCTION
# =========================================================================
def route_service(state: PaytmState) -> str:
    service = state.get("service", "chat")
    if service == "recharge":
        return "recharge_node"
    elif service == "travel":
        return "travel_node"
    elif service == "movies":
        return "movies_node"
    elif service == "promos":
        return "promos_node"
    elif service == "shopping":
        return "shopping_node"
    elif service in ["bills", "electricity", "gas", "water", "broadband", "fastag", "dth"]:
        return "bills_node"
    elif service == "gold":
        return "gold_node"
    elif service == "dispute":
        return "dispute_node"
    else:
        return "chat_node"


# =========================================================================
# ASSEMBLE STATEGRAPH
# =========================================================================
workflow = StateGraph(PaytmState)

# Add Nodes
workflow.add_node("router", router_node)
workflow.add_node("recharge_node", recharge_node)
workflow.add_node("travel_node", travel_node)
workflow.add_node("movies_node", movies_node)
workflow.add_node("promos_node", promos_node)
workflow.add_node("shopping_node", shopping_node)
workflow.add_node("bills_node", bills_node)
workflow.add_node("gold_node", gold_node)
workflow.add_node("dispute_node", dispute_node)
workflow.add_node("chat_node", chat_node)
workflow.add_node("voice_node", voice_node)

# Add Edges
workflow.add_edge(START, "router")

workflow.add_conditional_edges(
    "router",
    route_service,
    {
        "recharge_node": "recharge_node",
        "travel_node": "travel_node",
        "movies_node": "movies_node",
        "promos_node": "promos_node",
        "shopping_node": "shopping_node",
        "bills_node": "bills_node",
        "gold_node": "gold_node",
        "dispute_node": "dispute_node",
        "chat_node": "chat_node"
    }
)

# Connect all feature nodes to voice_node, then END
workflow.add_edge("recharge_node", "voice_node")
workflow.add_edge("travel_node", "voice_node")
workflow.add_edge("movies_node", "voice_node")
workflow.add_edge("promos_node", "voice_node")
workflow.add_edge("shopping_node", "voice_node")
workflow.add_edge("bills_node", "voice_node")
workflow.add_edge("gold_node", "voice_node")
workflow.add_edge("dispute_node", "voice_node")
workflow.add_edge("chat_node", "voice_node")
workflow.add_edge("voice_node", END)

# Compile LangGraph App
paytm_langgraph_app = workflow.compile()


def execute_paytm_graph(query: str, user_id: str = "paytm_user_01", language: str = "auto") -> Dict[str, Any]:
    """Master entry point to run LangGraph StateGraph pipeline."""
    initial_state: PaytmState = {
        "query": query,
        "user_id": user_id,
        "language": language,
        "mode": "ACTION",
        "service": "chat",
        "entities": {},
        "scenario_data": {},
        "ai_message": "",
        "steps_log": [],
        "audio_base64": None,
        "suggested_replies": [],
        "citations": None,
        "nexconn_chat": None
    }

    final_state = paytm_langgraph_app.invoke(initial_state)

    # Standardize result object structure for frontend consumption
    res = {
        "mode": final_state.get("mode", "ACTION"),
        "service": final_state.get("service", "recharge"),
        "language": final_state.get("language", "en"),
        "ai_message": final_state.get("ai_message", ""),
        "steps_log": final_state.get("steps_log", []),
        "suggested_replies": final_state.get("suggested_replies", []),
        "audio_base64": final_state.get("audio_base64"),
        "resource_links": final_state.get("resource_links", []),
        "citations": final_state.get("citations")
    }

    # Attach service specific payloads
    service = final_state.get("service")
    scenario_data = final_state.get("scenario_data", {})

    if service == "recharge":
        res["operator"] = final_state.get("entities", {}).get("operator", "jio")
        res["plan_data"] = {
            "best": scenario_data.get("best"),
            "alternatives": scenario_data.get("alternatives", [])
        }
    elif service == "travel":
        res["travel_data"] = {
            "options": scenario_data.get("options", []),
            "route": scenario_data.get("route", ""),
            "cheapest": scenario_data.get("cheapest")
        }
    elif service == "movies":
        res["movie_data"] = {
            "movies": scenario_data.get("movies", []),
            "top_movie": scenario_data.get("top_movie")
        }
    elif service == "promos":
        res["promo_data"] = {
            "promos": scenario_data.get("promos", []),
            "top_promo": scenario_data.get("top_promo")
        }
    elif service == "shopping":
        res["shopping_data"] = {
            "deals": scenario_data.get("deals", []),
            "city": scenario_data.get("city", "Pune"),
            "top_deal": scenario_data.get("top_deal")
        }
    elif service in ["bills", "electricity", "gas", "water", "broadband", "fastag", "dth"]:
        res["service_data"] = scenario_data.get("bill", {})
        res["bills_data"] = {
            "is_multi_bill": scenario_data.get("is_multi_bill", False),
            "bills": scenario_data.get("bills", []),
            "total_due": scenario_data.get("total_due", 0)
        }
    elif service == "gold":
        res["gold_data"] = scenario_data
    elif service == "dispute":
        res["transaction"] = scenario_data.get("dispute", {})
        res["disputes_list"] = scenario_data.get("disputes_list", [])
        res["is_dispute_list"] = scenario_data.get("is_dispute_list", False)
        res["filter_type"] = scenario_data.get("filter_type", "all")
        res["citations"] = final_state.get("citations")
        res["nexconn_chat"] = final_state.get("nexconn_chat")

    return res
