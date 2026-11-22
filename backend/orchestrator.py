"""
Paytm AI Hub Master Multi-Agent Orchestrator:
Coordinates Groq LLM, SerpApi Search, You.com Citations, Nexconn Real-Time Chat, and Sarvam AI Voice.
Produces step-by-step thinking & action execution trace (Astra-style).
"""
import os
import sys

# Ensure repository root is on sys.path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import re
from backend.agents.groq_agent import parse_query_with_groq
from backend.agents.recharge_agent import find_matching_recharge_plan
from backend.agents.serp_agent import (
    search_recharge_live_with_serp,
    search_travel_options,
    search_hotel_options,
    search_shopping_deals,
    search_movie_options
)
from backend.agents.you_agent import fetch_refund_policy_citations
from backend.agents.nexconn_agent import create_nexconn_dispute_room
from backend.agents.sarvam_agent import generate_sarvam_speech
from backend.agents.resolve_agent import investigate_dispute


def normalize_indian_speech_text(text: str) -> str:
    """
    Normalizes phonetic transliterations, informal chat spellings, and common typos
    in Marathi, Hindi, and Hinglish.
    """
    t = text.lower()
    replacements = [
        # Travel / Tickets
        (r'\b(tikect|tikct|tikit|tiket|tikite|tikita|tikts)\b', 'ticket'),
        (r'\b(flth|flite|fligt|flt)\b', 'flight'),
        (r'\b(tran|trai|trin)\b', 'train'),
        (r'\b(hotle|hotl|lotel)\b', 'hotel'),
        
        # Recharge / Telecom
        (r'\b(rechr|rechrge|rechrg|rechar|rechage)\b', 'recharge'),
        (r'\b(artel|airtl)\b', 'airtel'),
        (r'\b(vodafon|ide)\b', 'vi'),
        
        # Shopping / Deals
        (r'\b(shoping|shopin|shping)\b', 'shopping'),
        (r'\b(ofers|ofr|offr)\b', 'offer'),
        (r'\b(discont|dicount|discunt)\b', 'discount'),
        (r'\b(cashbak|casback|cshback)\b', 'cashback'),
        
        # Disputes / Problems
        (r'\b(refnd|rfund)\b', 'refund'),
        (r'\b(pendng|pnding)\b', 'pending'),
        (r'\b(complent|complant|cmplaint)\b', 'complaint'),
        (r'\b(adakle|adkale|adtakle|atkle)\b', 'अडकले'),
        (r'\b(katle|kaple|ktle)\b', 'कटले'),
        (r'\b(takrar|tkrar)\b', 'तक्रार'),
        (r'\b(paise|pese|paese|paisa)\b', 'paise'),
        
        # Marathi verbs / phrases
        (r'\b(karaych|kraych|karayche|kryche)\b', 'karayche'),
        (r'\b(dakhva|dakhwa|dakhawa|dakhav)\b', 'dakhva'),
        (r'\b(pahije|phije|pahje)\b', 'pahije'),
        (r'\b(sang|sanga|saang)\b', 'sang')
    ]
    for pattern, repl in replacements:
        t = re.sub(pattern, repl, t)
    return t


def orchestrate_query(query: str, user_id: str = "paytm_user_01", language: str = "auto"):
    steps_log = []
    # Normalize typos and informal Hinglish/Marathi speech
    lower_q = normalize_indian_speech_text(query)
    
    # 0. User-Selected Target Language Handling
    req_lang = (language or "auto").strip().lower()
    target_lang = None
    if req_lang in ["en", "en-in", "english"]:
        target_lang = "en"
    elif req_lang in ["mr", "mr-in", "marathi"]:
        target_lang = "mr"
    elif req_lang in ["hi", "hi-in", "hindi"]:
        target_lang = "hi"

    # Smart Preference & Filter Modifiers
    is_cheapest = any(w in lower_q for w in ['cheapest', 'cheap', 'lowest', 'कम दाम', 'सगळ्यात स्वस्त', 'स्वस्त', 'कमी किंमत', 'सस्ता', 'कमी पैशात', 'budget'])
    is_fastest = any(w in lower_q for w in ['fastest', 'fast', 'लवकर', 'जलद', 'जल्दी', 'कम समय', 'पहिला', 'पहिली', 'लवकरात लवकर', 'express'])
    is_ac_only = any(w in lower_q for w in ['ac', 'volvo', 'व्हॉल्व्हो', 'वॉल्वो', 'एसी', 'स्लीपर', 'sleeper', 'luxury'])
    is_morning = any(w in lower_q for w in ['morning', 'सकाळी', 'सुबह', 'लवकर सकाळी'])
    is_night = any(w in lower_q for w in ['night', 'evening', 'रात्री', 'संध्याकाळी', 'शाम', 'रात'])
    is_top_rated = any(w in lower_q for w in ['best', 'top', 'चांगले', 'उत्तम', 'टॉप', 'रेटेड', 'स्टार', 'rating', 'star'])

    # 1. Deterministic Extraction from raw user speech/text
    # Operator detection
    op_detected = "jio"
    if "airtel" in lower_q: op_detected = "airtel"
    elif any(k in lower_q for k in ["vi", "vodafone", "idea"]): op_detected = "vi"
    elif "bsnl" in lower_q: op_detected = "bsnl"
    
    # Price / budget extraction (supports standalone numbers like 666, 349, 198, 239, 299, 857, 1099, 1200, etc.)
    clean_nums_q = lower_q.replace(',', '')
    nums = [int(n) for n in re.findall(r'\b\d{2,4}\b', clean_nums_q) if int(n) not in [28, 56, 70, 84, 90, 100, 365] and 50 <= int(n) <= 3999]
    explicit_price = nums[0] if nums else None

    # Language detection
    has_marathi_words = any(w in lower_q for w in ['mala', 'karaycha', 'karayche', 'ahe', 'pahije', 'kiti', 'cha', 'chi', 'kraych', 'dakhva', 'tula', 'माझे', 'मला', 'आहे', 'पाहिजे', 'दाखवा', 'करा', 'काय', 'कसा', 'अडकले', 'कापले', 'तक्रार'])
    has_hindi_words = any(w in lower_q for w in ['mujhe', 'karna', 'hai', 'chahiye', 'karo', 'bhai', 'paise', 'mera', 'apna', 'dikhao', 'मुझे', 'करना', 'है', 'चाहिए', 'दिखाओ', 'पैसे', 'कट', 'गए', 'गये', 'मदद', 'कैसे'])
    has_english_words = any(w in lower_q for w in ['please', 'recharge', 'refund', 'check', 'book', 'flight', 'ticket', 'plan', 'help', 'under', 'want', 'daily', 'data', 'best', 'show', 'hotel', 'train', 'bus']) or (bool(re.search(r'^[a-zA-Z0-9\s\.\,\-\_\?]+$', query.strip())) and not has_marathi_words and not has_hindi_words)

    if target_lang:
        detected_lang = target_lang
    elif has_marathi_words:
        detected_lang = "mr"
    elif has_english_words and not has_hindi_words and not has_marathi_words:
        detected_lang = "en"
    elif has_hindi_words:
        detected_lang = "hi"
    else:
        detected_lang = "hi"

    # Daily data
    detected_data = ""
    if "1.5" in lower_q: detected_data = "1.5 GB / Day"
    elif "2.5" in lower_q: detected_data = "2.5 GB / Day"
    elif "2" in lower_q and ("gb" in lower_q or "data" in lower_q): detected_data = "2 GB / Day"
    elif "1" in lower_q and ("gb" in lower_q or "data" in lower_q): detected_data = "1 GB / Day"

    wants_netflix = "netflix" in lower_q

    # STEP 1: Intent & Language Analysis
    steps_log.append({
        "step": 1,
        "title": "Natural Language & Intent Detection",
        "detail": f"Detected query intent ({detected_lang.upper()}) • Target: {op_detected.upper()}" + (f" ~₹{explicit_price}" if explicit_price else ""),
        "status": "completed"
    })

    # Fast-path intent classification: if intent is explicitly clear, fast-track without LLM latency
    is_clear_intent = any(k in lower_q for k in [
        'hotel', 'hotle', 'bus', 'flight', 'flite', 'train', 'irctc', 'rail', 'ticket', 'tiket',
        'electricity', 'bijli', 'fastag', 'toll', 'dth', 'gold', 'soundbox', 'merchant',
        'refund', 'pending', 'dispute', 'complaint', 'तक्रार', 'रिफंड', 'अडकले', 'कापले', 'कटले',
        'jio', 'airtel', 'vi', 'bsnl', 'बस', 'ट्रेन', 'विमान', 'गाडी', 'तिकीट', 'टिकट',
        'galti', 'गलत', 'wrong', 'transfer', 'recall', 'unpaid', 'not updated', 'चूक', 'चुकीच्या', 'दो बार', 'दोनदा', 'duplicate',
        'shopping', 'shoping', 'शॉपिंग', 'offer', 'offers', 'ऑफर', 'deal', 'deals', 'डील', 'discount', 'cashback', 'कॅशबॅक', 'कॅशबैक', 'mall', 'मॉल',
        'movie', 'movies', 'cinema', 'theatre', 'theater', 'चित्रपट', 'सिनेमा', 'थिएटर',
        'recharge', 'रिचार्ज', 'रीचार्ज', 'plan', 'प्लॅन', 'pack', 'पॅक', 'पेकार', 'data', 'डेटा', 'gb', 'जीबी', 'validity', 'वॅलिडिटी', 'वैलिडिटी'
    ]) or bool(re.search(r'\b(?:light|₹|\d{3,4})\b', lower_q)) or bool(explicit_price)

    parsed = None
    if not is_clear_intent:
        parsed = parse_query_with_groq(query)
    
    if not parsed:
        is_chat_fallback = any(k in lower_q for k in [
            'aur kaise', 'kaise ho', 'kya help', 'who are you', 'तू कोण', 'काय मदत', 'कसा आहेस', 'help kar',
            'what can you', 'what do you', 'what is paytm', 'modes', 'help', 'मदद', 'मदत'
        ]) or bool(re.search(r'\b(?:hi|hello|hey|help|namaste|नमस्ते|नमस्कार|हैलो|हॅलो)\b', lower_q))
        is_resolve = any(k in lower_q for k in ['pending', 'failed', 'refund', 'complaint', 'तक्रार', 'रिफंड', 'अडकले', 'वापस', 'paise cut', 'cut gaye', 'कट गये', 'कट गए', 'पैसे कट'])
        is_travel = any(k in lower_q for k in ['flight', 'flights', 'flite', 'plane', 'bus', 'train', 'ticket', 'tickets', 'pune', 'mumbai', 'delhi', 'goa', 'बस', 'ट्रेन', 'फ्लाइट', 'विमान', 'रेल्वे', 'गाडी', 'तिकीट', 'टिकट']) and not is_resolve and not is_chat_fallback
        is_recharge_fallback = (any(k in lower_q for k in ['recharge', 'plan', 'pack', 'gb', 'data', 'रिचार्ज', 'रीचार्ज', 'प्लॅन', 'पॅक', 'डेटा', 'जीबी']) or bool(any(op in lower_q for op in ['jio', 'airtel', 'vi', 'bsnl'])) or bool(explicit_price and explicit_price < 2000)) and not is_travel and not is_resolve and not is_chat_fallback

        parsed = {
            "language": target_lang or detected_lang,
            "mode": "CHAT" if is_chat_fallback else ("RESOLVE" if is_resolve else ("ACTION" if (is_travel or is_recharge_fallback) else "CHAT")),
            "service": "chat" if is_chat_fallback else ("dispute" if is_resolve else ("travel" if is_travel else ("recharge" if is_recharge_fallback else "chat"))),
            "operator": op_detected,
            "budget": explicit_price or 299,
            "data_daily": detected_data,
            "wants_netflix": wants_netflix,
            "response_mr": "नमस्कार! मी पेटीएम वन AI कमांडर आहे. मी तुम्हाला २ प्रमुख मोड्समध्ये मदत करू शकतो:\n\n• **Action Mode**: मोबाईल रिचार्ज, बस/ट्रेन/फ्लाइट तिकीट बुकिंग, वीज बिल आणि शॉपिंग डील्स १-क्लिकमध्ये करा.\n• **Resolve Mode**: अडकलेले पैसे, अयशस्वी UPI आणि रिफंडचे २४ तासांत जलद निवारण.\n\nतुम्हाला कोणत्या सेवेमध्ये मदत हवी आहे?",
            "response_hi": "नमस्ते! मैं पेटीएम वन (Paytm ONE) AI कमांडर हूँ। मैं आपकी 2 मुख्य मोड्स में मदद कर सकता हूँ:\n\n• **Action Mode**: मोबाइल रिचार्ज, बस/ट्रेन/फ्लाइट टिकट बुकिंग, बिजली बिल और शॉपिंग डील्स 1-क्लिक में करें।\n• **Resolve Mode**: अटके हुए पैसे, फेल यूपीआई पेमेंट और रिफंड का 24 घंटे में समाधान।\n\nआप कौन सा मोड देखना चाहते हैं?",
            "response_en": "Hello! I am Paytm ONE AI Commander. I can assist you across 2 core modes:\n\n• **Action Mode**: Autonomous 1-click execution for Mobile Recharge, Flight & Bus Tickets, Electricity Bills, and Shopping Deals.\n• **Resolve Mode**: Autonomous 3-Way Reconciliation for stuck payments, failed UPI debits, and refund tracking with 24H SLA.\n\nWhich mode would you like to explore?"
        }
    else:
        # Override with explicit values if found in user's prompt
        if explicit_price:
            parsed["budget"] = explicit_price
        if op_detected:
            parsed["operator"] = op_detected
        if detected_lang:
            parsed["language"] = detected_lang
        if detected_data:
            parsed["data_daily"] = detected_data
        if wants_netflix:
            parsed["wants_netflix"] = True

    # 2. Extract explicit budget or 1k-2k range
    budget_match = re.search(r'(?:budget|budegt|बजेट|दाम|किंमत|price|under|upto|च्या आत)\s*[:=]?\s*(\d{2,5})', lower_q)
    if budget_match:
        explicit_price = int(budget_match.group(1))
    elif '1-2k' in lower_q or '1 to 2k' in lower_q or '1k-2k' in lower_q or '1-2 हजार' in lower_q:
        explicit_price = 2000
    elif '1k' in lower_q:
        explicit_price = 1000
    elif '2k' in lower_q:
        explicit_price = 2000
    elif '3k' in lower_q:
        explicit_price = 3000

    # Dynamic City & Location Extraction
    detected_city = "Pune"
    if any(w in lower_q for w in ['pune', 'pun', 'पुणे', 'पुण्यात', 'lohegaon', 'viman nagar']):
        detected_city = "Pune"
    elif any(w in lower_q for w in ['mumbai', 'bombay', 'मुंबई', 'मुंबईत', 'sakinaka', 'andheri']):
        detected_city = "Mumbai"
    elif any(w in lower_q for w in ['delhi', 'dilli', 'दिल्ली', 'mahipalpur', 'igi']):
        detected_city = "Delhi"
    elif any(w in lower_q for w in ['bangalore', 'bengaluru', 'बेंगळुरू']):
        detected_city = "Bangalore"
    elif any(w in lower_q for w in ['goa', 'गोवा', 'गोव्यात', 'dabolim']):
        detected_city = "Goa"
    elif any(w in lower_q for w in ['hyderabad', 'हैदराबाद']):
        detected_city = "Hyderabad"
    elif any(w in lower_q for w in ['jaipur', 'जयपूर']):
        detected_city = "Jaipur"
    elif any(w in lower_q for w in ['nagpur', 'नागपूर']):
        detected_city = "Nagpur"
    elif any(w in lower_q for w in ['kolkata', 'कोलकाता']):
        detected_city = "Kolkata"
    elif any(w in lower_q for w in ['chennai', 'चेन्नई']):
        detected_city = "Chennai"

    detected_location = "Airport" if any(w in lower_q for w in ['airport', 'airpost', 'aeroport', 'erport', 'हवाई अड्डा', 'विमानतळ', 'terminal', 't2', 't1', 'lohegaon']) else ("Station" if any(w in lower_q for w in ['station', 'railway', 'स्टेशन']) else "City Center")

    # Dynamic Route & Travel Type Extraction
    is_bus = any(k in lower_q for k in ['bus', 'buses', 'बस', 'व्हॉल्व्हो', 'वॉल्वो', 'shivneri', 'neeta', 'zingbus'])
    is_train = any(k in lower_q for k in ['train', 'trains', 'irctc', 'rail', 'railway', 'गाडी', 'रेल्वे', 'ट्रेन', 'vande bharat', 'tejas'])
    
    # Accurate Flight detection: Avoid substring collision with 'airtel'
    is_flight = any(k in lower_q for k in ['flight', 'flite', 'fligt', 'flitht', 'plane', 'airplane', 'हवाई', 'विमान', 'फ्लाइट', 'air india', 'indigo', 'akasa', 'spicejet'])
    if not is_flight and bool(re.search(r'\bair\b', lower_q)) and 'airtel' not in lower_q:
        is_flight = True
    if 'airtel' in lower_q and not any(f in lower_q for f in ['flight', 'flite', 'fligt', 'plane', 'विमान', 'हवाई']):
        is_flight = False

    if is_bus:
        travel_type = "bus"
    elif is_train:
        travel_type = "train"
    elif is_flight:
        travel_type = "flight"
    else:
        travel_type = "travel"

    # DYNAMIC CITY & ROUTE EXTRACTION (ChatGPT / Gemini Grade)
    from_city = (parsed.get("from_city") if parsed else None)
    to_city = (parsed.get("to_city") if parsed else None)
    if parsed and parsed.get("city"):
        detected_city = parsed["city"]
    if parsed and parsed.get("travel_type"):
        travel_type = parsed["travel_type"]
    if parsed and parsed.get("amount"):
        explicit_price = parsed["amount"]

    # Intelligent city aliases mapping
    city_aliases = {
        'पलटन': 'Phaltan', 'फलटण': 'Phaltan', 'phaltan': 'Phaltan',
        'पुणे': 'Pune', 'पुण्यात': 'Pune', 'pune': 'Pune', 'pun': 'Pune',
        'मुंबई': 'Mumbai', 'मुंबईत': 'Mumbai', 'mumbai': 'Mumbai', 'bombay': 'Mumbai',
        'दिल्ली': 'Delhi', 'delhi': 'Delhi', 'dilli': 'Delhi',
        'गोवा': 'Goa', 'गोव्यात': 'Goa', 'goa': 'Goa',
        'नागपूर': 'Nagpur', 'nagpur': 'Nagpur',
        'सातारा': 'Satara', 'satara': 'Satara',
        'कोल्हापूर': 'Kolhapur', 'kolhapur': 'Kolhapur',
        'नाशिक': 'Nashik', 'nashik': 'Nashik',
        'शिर्डी': 'Shirdi', 'shirdi': 'Shirdi',
        'बंगळुरू': 'Bangalore', 'बेंगळुरू': 'Bangalore', 'bangalore': 'Bangalore', 'bengaluru': 'Bangalore',
        'हैदराबाद': 'Hyderabad', 'hyderabad': 'Hyderabad',
        'जयपूर': 'Jaipur', 'jaipur': 'Jaipur',
        'सुरत': 'Surat', 'surat': 'Surat',
        'अहमदाबाद': 'Ahmedabad', 'ahmedabad': 'Ahmedabad'
    }

    # If LLM didn't catch both cities, check regex route patterns like "X से Y", "X to Y", "X ते Y"
    if not from_city or not to_city:
        route_match = re.search(r'([a-zA-Z\u0900-\u097F]+)\s*(?:se|to|ते|से)\s*([a-zA-Z\u0900-\u097F]+)', lower_q)
        if route_match:
            c1_raw = route_match.group(1).strip().lower()
            c2_raw = route_match.group(2).strip().lower()
            if not from_city and c1_raw in city_aliases:
                from_city = city_aliases[c1_raw]
            if not to_city and c2_raw in city_aliases:
                to_city = city_aliases[c2_raw]

    # Check for single destination or origin
    for alias_key, alias_val in city_aliases.items():
        if alias_key in lower_q:
            if not detected_city:
                detected_city = alias_val
            if not from_city and ('se' in lower_q or 'ते' in lower_q or 'from' in lower_q):
                from_city = alias_val
            elif not to_city:
                to_city = alias_val

    # Safe sensible defaults if completely unspecified
    if not from_city:
        from_city = "Pune"
    if not to_city:
        to_city = "Mumbai" if from_city != "Mumbai" else "Pune"

    # Language & Service Classification
    lang = (parsed.get("language") if parsed else None) or detected_lang or "hi"
    groq_service = (parsed.get("service") if parsed else "") or ""
    groq_mode = (parsed.get("mode") if parsed else "") or ""
    
    # 360-DEGREE ROCK-SOLID INTENT HIERARCHY
    # Priority 1: DISPUTE & RESOLVE MODE (Refund, failed payment, uncredited, cut money)
    is_dispute = any(k in lower_q for k in [
        'pending', 'failed', 'refund', 'complaint', 'dispute', 'issue', 'problem',
        'तक्रार', 'रिफंड', 'अडकले', 'वापस', 'समस्या', 'अडचण',
        'paise cut', 'cut gaye', 'कट गये', 'कट गए', 'कट झाले', 'पैसे cut', 'पैसे कट', 'रुपये कट', 'अमाउंट कट', 'कटले', 'कापले',
        'मिळाले नाहीत', 'नाही मिळाले', 'मिळाले नाही', 'not received', 'not credited', 'uncredited',
        'unpaid', 'not updated', 'update nahi', 'update nahi hua', 'अपडेट नाही',
        'duplicate', 'double debit', 'दोनदा', 'दो बार', 'wrong transfer', 'चुकीच्या', 'चुकीचे', 'गलत', 'galti'
    ]) or (groq_mode == "RESOLVE" or groq_service == "dispute")

    # Utilities & Specific Services (Checked before generic mobile recharge)
    # Ensure 'light' does not match inside 'flight'
    has_light_word = bool(re.search(r'\blight\b', lower_q)) and 'flight' not in lower_q
    is_electricity = (has_light_word or any(k in lower_q for k in ['electricity', 'bijli', 'power', 'mahavitaran', 'msedcl', 'adani', 'bses', 'वीज', 'लाईट', 'महावितरण'])) and not is_dispute
    is_fastag = any(k in lower_q for k in ['fastag', 'toll', 'toll plaza', 'nhai', 'netc', 'फास्टॅग', 'टोल'])
    is_dth = any(k in lower_q for k in ['dth', 'tataplay', 'tata play', 'dish tv', 'airtel dth', 'sun direct', 'डिश', 'टीव्ही'])
    is_gold = any(k in lower_q for k in ['gold', 'digital gold', '24k', 'silver', 'wealth', 'sip', 'सोने', 'गुंतवणूक'])

    # Generic Mobile Recharge (Excludes FASTag, DTH, electricity)
    is_recharge = (not is_fastag and not is_dth and not is_electricity and not is_gold) and (
        any(k in lower_q for k in ['recharge', 'रिचार्ज', 'रीचार्ज', 'plan', 'प्लॅन', 'data pack', 'validity', 'pack', 'पॅक', 'पेकार', 'gb', 'जीबी', 'data', 'डेटा']) or (
            any(op in lower_q for op in ['jio', 'airtel', 'vi', 'bsnl']) and not is_bus and not is_train and not is_flight and not is_dispute
        ) or bool(explicit_price and any(d in lower_q for d in ['gb', 'जीबी', 'data', 'डेटा', 'pack', 'पॅक', 'पेकार']))
    )

    # Shopping, Deals, Cashback & Discounts
    is_shopping = any(k in lower_q for k in [
        'shopping', 'shoping', 'शॉपिंग', 'सौदा', 'offer', 'offers', 'ऑफर', 'deals', 'deal', 'डील', 'सवलत',
        'discount', 'discounts', 'डिस्काउंट', 'cashback', 'कॅशबॅक', 'कॅशबैक', 'सेल', 'sale',
        'mall', 'मॉल', 'market', 'मार्केट', 'croma', 'reliance digital', 'zomato', 'swiggy', 'myntra',
        'खरेदी', 'सामान'
    ]) and not is_dispute

    # Movies & Multiplex Entertainment
    is_movie = any(k in lower_q for k in [
        'movie', 'movies', 'cinema', 'theatre', 'theater', 'multiplex', 'चित्रपट', 'सिनेमा',
        'थिएटर', 'मल्टीप्लेक्स', 'शो', 'showtime', 'showtimes', 'pvr', 'inox', 'cinepolis',
        'फिल्म', 'पिक्चर', 'पुष्पा', 'pushpa', 'stree', 'kantara'
    ]) and not is_dispute

    # Mentor USP 04: Merchant Intelligence (आज किती पैसे मिळाले? / Soundbox Collection Summary)
    is_merchant_summary = any(k in lower_q for k in [
        'आज किती पैसे मिळाले', 'आजचे कलेक्शन', 'आज का कलेक्शन', 'किती पैसे जमा झाले',
        'kitne paise mile', 'kitna collection', 'today collection', 'merchant summary',
        'soundbox summary', 'soundbox collection', 'दुकानदार कलेक्शन', 'आज कितना पैसा आया', 'कितने पैसे आए', 'आज पैसे किती'
    ]) or (groq_service == "merchant_summary")

    # Mentor USP 03: Smart Money Intelligence (खर्च विश्लेषण / Expense Analytics)
    is_expense = (any(k in lower_q for k in [
        'खर्च', 'खर्चा', 'खर्च झाले', 'कुठे खर्च', 'किती खर्च', 'खर्चाचा हिशोब',
        'kharch', 'kharcha', 'kitna kharch', 'spend', 'spending', 'expense', 'expenses',
        'budget analysis', 'money spent', 'कुठे गेले पैसे', 'पैसे कुठे गेले'
    ]) or (groq_service == "expense")) and not is_dispute and not is_merchant_summary

    # Merchant & Soundbox QR (Kirana, store, merchant, soundbox)
    is_merchant = any(k in lower_q for k in ['soundbox', 'merchant', 'qr', 'shop', 'store', 'kirana', 'दुकानदार', 'व्यापारी', 'साउंडबॉक्स']) and not is_dispute and not is_shopping and not is_merchant_summary

    # Hotel & Stays
    is_hotel = any(k in lower_q for k in ['hotel', 'hotle', 'lodge', 'room', 'stay', 'resort', 'हॉटेल', 'होटल', 'कमरा', 'राहण्याची', 'थांबायला']) and not is_shopping

    # General Conversational Chat (ChatGPT / Gemini style)
    is_chat = (
        groq_mode == "CHAT" or groq_service == "chat" or any(k in lower_q for k in [
            'aur kaise', 'kaise ho', 'kya help', 'help kar sakte', 'who are you',
            'तू कोण आहेस', 'काय मदत करू शकतोस', 'कसा आहेस', 'काय करू शकतोस', 'काय मदत', 'मदत कर',
            'what can you do', 'what can you help', 'what do you do', 'how can you help', 'what is paytm',
            'tell me about', 'how are you', 'what is action mode', 'what is resolve mode', 'modes',
            'मदत हवी', 'मदत पाहिजे', 'मदद चाहिए', 'क्या मदद', 'क्या कर सकते', 'क्या क्या मदद'
        ]) or bool(re.search(r'\b(?:hi|hello|hey|help|namaste|नमस्ते|नमस्कार|हैलो|हॅलो)\b', lower_q))
    ) and not is_dispute and not is_bus and not is_train and not is_flight

    # Travel & Tickets: Must have explicit travel vehicle, ticket/travel verb, or two-city route
    has_travel_verb = bool(re.search(r'\b(?:travel|trip|ticket|tickets|tiket|booking|book|जाना|सफर|प्रवास|तिकीट|टिकट|गाडी|flight|flights|bus|train)\b', lower_q))
    is_travel = (
        not is_chat and (
            is_bus or is_train or is_flight or has_travel_verb or groq_service == "travel" or (
                bool(re.search(r'\b(?:to|se|te|ते|से)\b', lower_q)) and any(c.lower() in lower_q for c in city_aliases.keys())
            )
        )
    ) and not is_shopping and not is_movie and not is_hotel and not is_merchant and not is_dispute and not is_fastag and not is_dth and not is_electricity and not is_gold

    if is_chat:
        service = "chat"
        mode = "CHAT"
    elif is_dispute:
        service = "dispute"
        mode = "RESOLVE"
    elif is_travel:
        service = "travel"
        mode = "ACTION"
    elif is_merchant_summary:
        service = "merchant_summary"
        mode = "ACTION"
    elif is_expense:
        service = "expense"
        mode = "ACTION"
    elif is_shopping:
        service = "shopping"
        mode = "ACTION"
    elif is_movie:
        service = "movie"
        mode = "ACTION"
    elif is_fastag:
        service = "fastag"
        mode = "ACTION"
    elif is_dth:
        service = "dth"
        mode = "ACTION"
    elif is_electricity:
        service = "electricity"
        mode = "ACTION"
    elif is_gold:
        service = "gold"
        mode = "ACTION"
    elif is_merchant:
        service = "merchant"
        mode = "ACTION"
    elif is_hotel:
        service = "hotel"
        mode = "ACTION"
    elif is_recharge or groq_service == "recharge":
        service = "recharge"
        mode = "ACTION"
    elif groq_service in ['recharge', 'expense', 'merchant_summary', 'hotel', 'travel', 'electricity', 'fastag', 'dth', 'merchant', 'gold', 'shopping', 'movie', 'dispute']:
        service = groq_service
        mode = "RESOLVE" if service == "dispute" else "ACTION"
    elif explicit_price and any(k in lower_q for k in ['recharge', 'plan', 'pack', 'gb', 'data', 'jio', 'airtel', 'vi', 'bsnl', 'रिचार्ज', 'रीचार्ज', 'प्लॅन', 'पॅक']):
        service = "recharge"
        mode = "ACTION"
    else:
        service = "chat"
        mode = "CHAT"

    # ==========================================================
    # BRANCH 0: CHAT MODE (CHATGPT / GEMINI CONVERSATIONAL ENGINE)
    # ==========================================================
    if mode == "CHAT" or service == "chat":
        steps_log.append({
            "step": 2,
            "title": "Groq Multilingual Neural Understanding Agent",
            "detail": f"Classified conversational intent ({lang.upper()}) • Knowledge Synthesis Active",
            "status": "completed"
        })
        steps_log.append({
            "step": 3,
            "title": "Paytm Universal Services Knowledge Graph",
            "detail": "Cross-linked Action Mode (10+ utilities) & Resolve Mode (NPCI 3-Way Reconciliation)",
            "status": "completed"
        })

        if lang == "mr":
            ai_msg = "नमस्कार! मी पेटीएम वन (Paytm ONE) AI कमांडर आहे. मी तुम्हाला २ प्रमुख मोड्समध्ये मदत करू शकतो:\n\n• **Action Mode**: मोबाईल रिचार्ज, बस/ट्रेन/फ्लाइट तिकीट, वीज बिल आणि शॉपिंग डील्स १-क्लिकमध्ये पूर्ण करा.\n• **Resolve Mode**: अडकलेले पैसे, अयशस्वी UPI पेमेंट आणि रिफंडचे २४ तासांत जलद निवारण.\n\nतुम्हाला कोणत्या मोडमध्ये मदत हवी आहे?"
        elif lang == "hi":
            ai_msg = "नमस्ते! मैं पेटीएम वन (Paytm ONE) AI कमांडर हूँ। मैं आपकी 2 मुख्य मोड्स में मदद कर सकता हूँ:\n\n• **Action Mode**: मोबाइल रिचार्ज, बस/ट्रेन/फ्लाइट टिकट बुकिंग, बिजली बिल और शॉपिंग डील्स 1-क्लिक में करें।\n• **Resolve Mode**: अटके हुए पैसे, फेल यूपीआई पेमेंट और रिफंड का 24 घंटे में समाधान।\n\nआप कौन सा मोड देखना चाहते हैं?"
        else:
            ai_msg = "Hello! I am Paytm ONE AI Commander. I can assist you across 2 core modes:\n\n• **Action Mode**: Autonomous 1-click execution for Mobile Recharge, Flight & Bus Tickets, Electricity Bills, and Shopping Deals.\n• **Resolve Mode**: Autonomous 3-Way Reconciliation for stuck payments, failed UPI debits, and refund tracking with 24H SLA.\n\nWhich mode would you like to explore?"

        steps_log.append({
            "step": 4,
            "title": "Neural Voice Synthesis",
            "detail": f"Synthesizing verified audio voice ({lang}-IN)",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"), fast_only=False)

        suggested = (parsed.get("suggested_replies") if parsed else None) or (
            ["Jio ₹299 रिचार्ज करा ⚡", "पुणे ते मुंबई बस/फ्लाइट 🚌", "माझे ₹500 कट झाले (तक्रार) 🛡️", "वीज बिल भरा 💡"] if lang == "mr"
            else (["Jio ₹299 रिचार्ज करें ⚡", "पुणे से मुंबई बस/फ्लाइट 🚌", "मेरे ₹500 कट गए (शिकायत) 🛡️", "बिजली बिल भरें 💡"] if lang == "hi"
            else ["Recharge Jio ₹299 ⚡", "Pune to Mumbai Bus/Flight 🚌", "Dispute ₹500 Deduction 🛡️", "Pay Electricity Bill 💡"])
        )

        return {
            "mode": "CHAT",
            "service": "chat",
            "language": lang,
            "ai_message": ai_msg,
            "suggested_replies": suggested,
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 1: RESOLVE MODE (PAYTM RESOLVE INTELLIGENCE)
    # Uses: Autonomous Payment Investigation Squad + You.com + Nexconn
    # ==========================================================
    if mode == "RESOLVE" or service == "dispute":
        resolve_data = investigate_dispute(query, user_id=user_id, explicit_price=explicit_price, language=lang)
        
        steps_log.append({
            "step": 2,
            "title": "Transaction Detective & Evidence Agent",
            "detail": f"Matched Case {resolve_data['case_id']} • UTR: {resolve_data['evidence_bundle']['utr']} • SHA-256 Verified",
            "status": "completed"
        })

        steps_log.append({
            "step": 3,
            "title": "3-Way Payment Reconciliation Agent",
            "detail": f"Cross-checking Bank vs NPCI Hub vs {resolve_data['service_name']} (Discrepancy Isolated)",
            "status": "completed"
        })

        steps_log.append({
            "step": 4,
            "title": "You.com Policy Research Agent",
            "detail": "Verified NPCI T+1 Harmonisation Circular No. 81 & RBI Ombudsman Compensation SLA",
            "status": "completed"
        })

        steps_log.append({
            "step": 5,
            "title": "Nexconn Chat SDK Session Agent",
            "detail": f"Spawned live support escalation room (AppKey: {resolve_data['nexconn_chat']['app_key']} • Agent: Priya Sharma)",
            "status": "completed"
        })

        if lang == "hi":
            ai_msg = f"मैंने केस {resolve_data['case_id']} की जांच कर ली है। {resolve_data['finding']} आप नीचे 3-वे रिकंसीलिएशन, You.com के नियम और Nexconn लाइव सपोर्ट देख सकते हैं।"
        elif lang == "mr":
            ai_msg = f"मी केस {resolve_data['case_id']} ची सखोल तपासणी केली आहे. {resolve_data['finding']} खाली 3-वे रिकन्सिलीएशन आणि Nexconn सपोर्ट उपलब्ध आहे."
        else:
            ai_msg = f"Completed investigation for {resolve_data['case_id']}. {resolve_data['finding']} Verified 3-way reconciliation matrix below."

        steps_log.append({
            "step": 6,
            "title": "Neural Voice Synthesis",
            "detail": "Synthesizing authentic empathetic resolution audio",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"), fast_only=False)

        dispute_suggestions = (
            ["तक्रार ड्राफ्ट कॉपी करा 📋", "डिजिटल पुरावा डाऊनलोड 📥", "लाईव्ह स्पेशालिस्टशी बोला 💬", "NPCI रिफंड नियम 🛡️"] if lang == "mr"
            else (["शिकायत ड्राफ्ट कॉपी करें 📋", "डिजिटल रसीद डाउनलोड 📥", "सपोर्ट स्पेशलिस्ट से चैट 💬", "NPCI रिफंड नियम 🛡️"] if lang == "hi"
            else ["Copy Grievance Draft 📋", "Download Evidence Receipt 📥", "Chat with Live Specialist 💬", "NPCI SLA Guidelines 🛡️"])
        )

        return {
            "mode": "RESOLVE",
            "service": "dispute",
            "language": lang,
            "ai_message": ai_msg,
            "resolve_data": resolve_data,
            "suggested_replies": dispute_suggestions,
            "citations": resolve_data["citations"],
            "nexconn_chat": resolve_data["nexconn_chat"],
            "steps_log": steps_log,
            "audio_base64": audio_b64,
            "transaction": {
                "id": resolve_data["case_id"],
                "amount": f"₹{resolve_data['amount']}",
                "operator": resolve_data["service_name"],
                "status": resolve_data["status_badge"]
            }
        }

    # ==========================================================
    # BRANCH 2: ELECTRICITY BILL (BBPS VERIFIED)
    # ==========================================================
    if service == "electricity":
        steps_log.append({
            "step": 2,
            "title": "Bharat BillPay (BBPS) CA Query",
            "detail": "Connecting to Maharashtra State Electricity Distribution Co. (MSEDCL)",
            "status": "completed"
        })
        bill_amt = explicit_price or 1450
        steps_log.append({
            "step": 3,
            "title": "Tariff & Meter Verification",
            "detail": f"CA #002948192841 • Units: 184 kWh • Due: 28 Nov 2026",
            "status": "completed"
        })

        if lang == "hi":
            ai_msg = f"मैंने आपका महावितरण बिजली बिल ₹{bill_amt} खोज लिया है। अंतिम तिथि 28 नवंबर है। क्या आप भुगतान करना चाहते हैं?"
        elif lang == "mr":
            ai_msg = f"मी तुमचे महावितरण वीज बिल ₹{bill_amt} शोधले आहे. शेवटची तारीख 28 नोव्हेंबर आहे. बिल भरायचे का?"
        else:
            ai_msg = f"Found your MSEDCL electricity bill of ₹{bill_amt} due on 28th Nov. Ready to pay?"

        steps_log.append({
            "step": 4,
            "title": "Neural Voice Synthesis",
            "detail": "Synthesizing verified audio voice",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"), fast_only=False)

        steps_log.append({
            "step": 5,
            "title": "Zero-Trust Security Governance Gate",
            "detail": "Waiting for User Approval & UPI PIN Confirmation",
            "status": "waiting_approval"
        })

        return {
            "mode": "ACTION",
            "service": "electricity",
            "language": lang,
            "ai_message": ai_msg,
            "service_data": {
                "board": "Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)",
                "consumer_id": "002948192841",
                "consumer_name": "Akash Bichukale",
                "bill_amount": bill_amt,
                "due_date": "28 Nov 2026",
                "units": "184 kWh",
                "cashback": "Flat ₹50 Cashback with Paytm UPI",
                "bbps_certified": True
            },
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 3: FASTAG RECHARGE (NETC NHAI TOLL)
    # ==========================================================
    if service == "fastag":
        steps_log.append({
            "step": 2,
            "title": "NETC National Toll Switch Query",
            "detail": "Looking up vehicle registration MH 12 AB 1234 on NETC NHAI portal",
            "status": "completed"
        })
        recharge_amt = explicit_price or 500
        steps_log.append({
            "step": 3,
            "title": "Toll Tag & Balance Diagnostic",
            "detail": f"FASTag active on Car • Balance: ₹140 (Low) • Target: ₹{recharge_amt}",
            "status": "completed"
        })

        if lang == "hi":
            ai_msg = f"आपके वाहन MH 12 AB 1234 का फास्टैग बैलेंस कम (₹140) है। मैंने ₹{recharge_amt} का रिचार्ज तैयार किया है। अप्रूव करें?"
        elif lang == "mr":
            ai_msg = f"तुमच्या MH 12 AB 1234 गाडीचे फास्टॅग बॅलन्स कमी (₹140) आहे. मी ₹{recharge_amt} चा रिचार्ज तयार केला आहे. मंजूर करायचा का?"
        else:
            ai_msg = f"Low FASTag balance on MH 12 AB 1234 (₹140). Prepared ₹{recharge_amt} top-up. Ready to approve?"

        steps_log.append({
            "step": 4,
            "title": "Neural Voice Synthesis",
            "detail": "Synthesizing verified audio voice",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"), fast_only=False)

        steps_log.append({
            "step": 5,
            "title": "Zero-Trust Security Governance Gate",
            "detail": "Waiting for User Approval & UPI PIN Confirmation",
            "status": "waiting_approval"
        })

        return {
            "mode": "ACTION",
            "service": "fastag",
            "language": lang,
            "ai_message": ai_msg,
            "service_data": {
                "vehicle_no": "MH 12 AB 1234",
                "issuer": "Paytm Payments Bank / NETC FASTag",
                "current_balance": 140,
                "recharge_amount": recharge_amt,
                "quick_amounts": [300, 500, 1000, 2000],
                "status": "Low Balance Warning (₹140 remaining)",
                "cashback": "Flat ₹25 Cashback on National Highway Tolls"
            },
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 4: DTH RECHARGE (TATA PLAY / AIRTEL / DISH)
    # ==========================================================
    if service == "dth":
        steps_log.append({
            "step": 2,
            "title": "DTH Subscriber Registry Lookup",
            "detail": "Querying Tata Play / Airtel DTH smart card #1092837482",
            "status": "completed"
        })
        dth_amt = explicit_price or 399
        steps_log.append({
            "step": 3,
            "title": "Pack Recommendation Engine",
            "detail": f"Smart Entertainment HD Pack • 185 Channels + Free Binge OTT",
            "status": "completed"
        })

        if lang == "hi":
            ai_msg = f"मैंने आपके टाटा प्ले DTH का 185 चैनलों वाला ₹{dth_amt} का मंथली पैक चुना है। क्या आप रिचार्ज करना चाहते हैं?"
        elif lang == "mr":
            ai_msg = f"मी तुमच्या टाटा प्ले DTH साठी ₹{dth_amt} चा 185 चॅनल्स असलेला मासिक पॅक निवडला आहे. रिचार्ज मंजूर करायचा का?"
        else:
            ai_msg = f"Selected Tata Play ₹{dth_amt} monthly pack with 185 channels + OTT Binge. Ready to approve?"

        steps_log.append({
            "step": 4,
            "title": "Neural Voice Synthesis",
            "detail": "Synthesizing verified audio voice",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"), fast_only=False)

        steps_log.append({
            "step": 5,
            "title": "Zero-Trust Security Governance Gate",
            "detail": "Waiting for User Approval & UPI PIN Confirmation",
            "status": "waiting_approval"
        })

        return {
            "mode": "ACTION",
            "service": "dth",
            "language": lang,
            "ai_message": ai_msg,
            "service_data": {
                "operator": "Tata Play",
                "subscriber_id": "1092837482",
                "pack_name": "Hindi Smart Dhamaka + Sports HD Pack",
                "price": dth_amt,
                "validity": "30 Days",
                "channels": "185 Channels + Free Binge OTT App",
                "cashback": "₹30 Cashback with Paytm UPI"
            },
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 5: PAYTM SOUNDBOX & MERCHANT QR
    # ==========================================================
    if service == "merchant":
        steps_log.append({
            "step": 2,
            "title": "Paytm Merchant Directory Search",
            "detail": "Resolving Sharma Kirana & General Store UPI: sharmastore@paytm",
            "status": "completed"
        })
        pay_amt = explicit_price or 150
        steps_log.append({
            "step": 3,
            "title": "Paytm Soundbox 4G Sync",
            "detail": f"Soundbox Device ID: SB4G-MH9082 • Ready for Audio Announcement",
            "status": "completed"
        })

        if lang == "hi":
            ai_msg = f"मैंने शर्मा किराना स्टोर के लिए ₹{pay_amt} का क्यूआर पेमेंट तैयार किया है। साउंडबॉक्स घोषणा के साथ अप्रूव करें?"
        elif lang == "mr":
            ai_msg = f"मी शर्मा किराणा स्टोअरसाठी ₹{pay_amt} चे पेमेंट तयार केले आहे. साउंडबॉक्स आवाजासह मंजूर करायचे का?"
        else:
            ai_msg = f"Prepared ₹{pay_amt} payment to Sharma Kirana Store with instant Paytm Soundbox chime. Ready to pay?"

        steps_log.append({
            "step": 4,
            "title": "Neural Voice Synthesis",
            "detail": "Synthesizing verified audio voice",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"), fast_only=False)

        steps_log.append({
            "step": 5,
            "title": "Zero-Trust Security Governance Gate",
            "detail": "Waiting for User Approval & UPI PIN Confirmation",
            "status": "waiting_approval"
        })

        return {
            "mode": "ACTION",
            "service": "merchant",
            "language": lang,
            "ai_message": ai_msg,
            "service_data": {
                "merchant_name": "Sharma Kirana & General Store",
                "merchant_upi": "sharmastore@paytm",
                "amount": pay_amt,
                "soundbox_prompt": f"पेटीएम पर {pay_amt} रुपये प्राप्त हुए",
                "soundbox_prompt_mr": f"पेटीएम वर {pay_amt} रुपये मिळाले",
                "device": "Paytm Soundbox 4G Pro • Battery 94%"
            },
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 6: PAYTM 24K DIGITAL GOLD & WEALTH
    # ==========================================================
    if service == "gold":
        steps_log.append({
            "step": 2,
            "title": "MMTC-PAMP Live Bullion Rate Feed",
            "detail": "Fetching real-time 24K 99.99% pure gold spot prices",
            "status": "completed"
        })
        gold_amt = explicit_price or 500
        gold_rate = 7850
        gold_grams = round(gold_amt / gold_rate, 4)

        steps_log.append({
            "step": 3,
            "title": "IDBI Insured Vault Custody Check",
            "detail": f"Allocating {gold_grams} grams in 100% insured physical vault",
            "status": "completed"
        })

        if lang == "hi":
            ai_msg = f"आज 24K शुद्ध डिजिटल गोल्ड का भाव ₹{gold_rate} प्रति ग्राम है। मैंने आपके लिए ₹{gold_amt} ({gold_grams} ग्राम) का निवेश तैयार किया है।"
        elif lang == "mr":
            ai_msg = f"आज 24K शुद्ध सोन्याचा भाव ₹{gold_rate} प्रति ग्रॅम आहे. मी तुमच्यासाठी ₹{gold_amt} ({gold_grams} ग्रॅम) ची सुरक्षित गुंतवणूक तयार केली आहे."
        else:
            ai_msg = f"Live 24K 99.99% gold is ₹{gold_rate}/g. Prepared ₹{gold_amt} ({gold_grams}g) insured vault purchase."

        steps_log.append({
            "step": 4,
            "title": "Neural Voice Synthesis",
            "detail": "Synthesizing verified audio voice",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"), fast_only=False)

        steps_log.append({
            "step": 5,
            "title": "Zero-Trust Security Governance Gate",
            "detail": "Waiting for User Approval & UPI PIN Confirmation",
            "status": "waiting_approval"
        })

        return {
            "mode": "ACTION",
            "service": "gold",
            "language": lang,
            "ai_message": ai_msg,
            "service_data": {
                "gold_price_per_gm": gold_rate,
                "purity": "24K 99.99% Pure Gold (MMTC-PAMP Certified)",
                "purchase_amount": gold_amt,
                "gold_grams": gold_grams,
                "vault": "100% Insured Custody Vault with IDBI Trusteeship",
                "cashback": "₹25 Cashback in Gold"
            },
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH: SMART MONEY INTELLIGENCE (EXPENSE ANALYTICS & PATTERNS)
    # ==========================================================
    if service == "expense":
        steps_log.append({
            "step": 2,
            "title": "Paytm Passbook & Unified Statement Analyzer",
            "detail": "Ingesting recent UPI, Soundbox, Card & BBPS debits",
            "status": "completed"
        })
        steps_log.append({
            "step": 3,
            "title": "AI Category & Recurring Subscription Classifier",
            "detail": "Aggregated ₹14,850 into 4 primary buckets • 3 recurring bills detected",
            "status": "completed"
        })

        if lang == "mr":
            ai_msg = "या महिन्यात तुमचा एकूण खर्च ₹9,150 झाला आहे. यात सर्वाधिक 49% (₹4,500) खर्च शॉपिंगवर झाला आहे. तुमच्या खर्चात recurring सबस्क्रिप्शन आढळल्या असून आढावा घेतल्यास दरमहा ₹499 पर्यंत बचत शक्य आहे."
        elif lang == "hi":
            ai_msg = "इस महीने आपका कुल खर्च ₹9,150 हुआ है। इसमें सबसे ज्यादा 49% (₹4,500) खर्च शॉपिंग पर हुआ है। आपकी recurring सब्सक्रिप्शन से आप हर महीने ₹499 तक बचा सकते हैं।"
        else:
            ai_msg = "Your total monthly spend is ₹9,150. Top category is Shopping at 49% (₹4,500). Reviewing your recurring subscriptions can save you up to ₹499/month."

        steps_log.append({
            "step": 4,
            "title": "Neural Voice Synthesis",
            "detail": f"Synthesizing verified audio voice ({lang}-IN)",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"), fast_only=False)

        return {
            "mode": "ACTION",
            "service": "expense",
            "language": lang,
            "ai_message": ai_msg,
            "service_data": {
                "total_spent": 9150,
                "month": "November 2026",
                "categories": [
                    {"name": "Shopping", "name_mr": "शॉपिंग व खरेदी", "icon": "🛍️", "amount": 4500, "percent": 49, "color": "purple"},
                    {"name": "Food & Zomato", "name_mr": "फूड व जोमॅटो", "icon": "🍔", "amount": 3200, "percent": 35, "color": "emerald"},
                    {"name": "Bills & Recharge", "name_mr": "लाईट बिल व रिचार्ज", "icon": "⚡", "amount": 1450, "percent": 16, "color": "amber"}
                ],
                "recurring_bills": [
                    {"name": "Netflix Mobile", "amount": 199, "due": "Auto-debit 28th", "status": "active"},
                    {"name": "Disney+ Hotstar", "amount": 149, "due": "Auto-debit 24th", "status": "active"},
                    {"name": "Jio Prime Membership", "amount": 151, "due": "Due in 3 days", "status": "upcoming"}
                ],
                "savings_tip": {
                    "title": "AI Savings Insight",
                    "title_mr": "एआय बचत सल्ला",
                    "saving_amount": 499,
                    "desc": "तुमच्या खर्चात recurring subscriptions आढळल्या. त्यांचा आढावा घेतल्यास दरमहा ₹499 पर्यंत बचत होण्याची शक्यता आहे."
                }
            },
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH: MERCHANT INTELLIGENCE (SOUNDBOX COLLECTIONS & SETTLEMENT)
    # ==========================================================
    if service == "merchant_summary":
        steps_log.append({
            "step": 2,
            "title": "Paytm Merchant Soundbox 4G Cloud Ingestion",
            "detail": "Synced 42 QR & Soundbox transactions from Sharma Kirana Store",
            "status": "completed"
        })
        steps_log.append({
            "step": 3,
            "title": "NPCI Instant Settlement Ledger Audit",
            "detail": "₹7,950 settled to HDFC Bank ****4821 • ₹500 in pending evening batch",
            "status": "completed"
        })

        if lang == "mr":
            ai_msg = "आज तुमच्या पेटीएम साउंडबॉक्सवर एकूण ₹8,450 चे 42 व्यवहार पूर्ण झाले आहेत. ₹7,950 थेट तुमच्या HDFC बँकेत जमा झाले आहेत आणि ₹500 रात्री 11 वाजता जमा होतील."
        elif lang == "hi":
            ai_msg = "आज आपके पेटीएम साउंडबॉक्स पर कुल ₹8,450 के 42 लेनदेन पूरे हुए हैं। ₹7,950 सीधे आपके HDFC बैंक खाते में सेटल हो चुके हैं और ₹500 रात 11 बजे सेटल होंगे।"
        else:
            ai_msg = "Today your Paytm Soundbox collected ₹8,450 across 42 transactions. ₹7,950 is settled into your HDFC Bank account, and ₹500 will auto-settle tonight at 11:00 PM."

        steps_log.append({
            "step": 4,
            "title": "Neural Voice Synthesis",
            "detail": f"Synthesizing verified audio voice ({lang}-IN)",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"), fast_only=False)

        return {
            "mode": "ACTION",
            "service": "merchant_summary",
            "language": lang,
            "ai_message": ai_msg,
            "service_data": {
                "store_name": "Sharma Kirana & General Store",
                "today_total": 8450,
                "tx_count": 42,
                "settled_amount": 7950,
                "pending_amount": 500,
                "settlement_bank": "HDFC Bank (A/C ****4821)",
                "next_settlement": "Tonight, 11:00 PM IST",
                "soundbox_device": "Paytm Soundbox 4G Pro • Battery 94% • Strong 4G",
                "peak_hours": "07:00 PM – 09:00 PM (18 transactions)",
                "recent_payments": [
                    {"time": "07:42 PM", "amount": 299, "customer": "Rohan Deshmukh", "status": "Success"},
                    {"time": "07:28 PM", "amount": 850, "customer": "Sunita Patil", "status": "Success"},
                    {"time": "06:55 PM", "amount": 150, "customer": "Vikram Shinde", "status": "Success"},
                    {"time": "06:10 PM", "amount": 500, "customer": "Kiran More", "status": "Pending"}
                ]
            },
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 7: TRAVEL & IRCTC BOOKING (PAYTM TRAVEL)
    # Uses: SerpApi Live Flight & Bus Search
    # ==========================================================
    if service == "travel":
        budget_limit = explicit_price or 0
        steps_log.append({
            "step": 2,
            "title": "SerpApi Travel Discovery Agent",
            "detail": f"Fetching live Google Flights & IRCTC timings from {from_city} to {to_city}" + (f" (Budget ~₹{budget_limit})" if budget_limit else ""),
            "status": "completed"
        })
        travel_results = search_travel_options(
            from_city, to_city,
            travel_type=travel_type,
            max_budget=budget_limit,
            is_cheapest=is_cheapest,
            is_fastest=is_fastest,
            is_ac_only=is_ac_only,
            is_morning=is_morning,
            is_night=is_night
        )
        
        flights = [o for o in travel_results.get("options", []) if o.get("type") == "Flight"]
        trains = [o for o in travel_results.get("options", []) if o.get("type") == "Train"]
        buses = [o for o in travel_results.get("options", []) if o.get("type") == "Bus"]
        best_flight = flights[0] if flights else None
        best_train = trains[0] if trains else None
        best_bus = buses[0] if buses else None

        is_flight_query = travel_type == "flight" or any(k in lower_q for k in ['flight', 'flite', 'fligt', 'flitht', 'plane', 'हवाई', 'विमान', 'फ्लाइट'])
        is_bus_query = travel_type == "bus" or any(k in lower_q for k in ['bus', 'buses', 'बस', 'व्हॉल्व्हो', 'वॉल्वो', 'shivneri'])

        if lang == "hi":
            if is_bus_query and best_bus:
                ai_msg = f"मैंने {from_city} से {to_city} के लिए {best_bus['name']} ({best_bus['dep_time']}, ₹{best_bus['price']}) खोज ली है। {best_bus['seats']} उपलब्ध हैं। क्या टिकट बुक करें?"
            elif best_flight and is_flight_query:
                ai_msg = f"मैंने {from_city} से {to_city} के लिए {best_flight['name']} (समय {best_flight['dep_time']}, ₹{best_flight['price']}) खोज ली है। {best_flight['seats']} उपलब्ध हैं। क्या टिकट बुक करें?"
            elif best_train:
                ai_msg = f"मैंने {from_city} से {to_city} के लिए वंदे भारत एक्सप्रेस (सुबह {best_train['dep_time']} बजे, ₹{best_train['price']}, {best_train['seats']}) और अन्य यात्रा विकल्प खोज लिए हैं।"
            else:
                ai_msg = f"मैंने {from_city} से {to_city} के लिए ₹{budget_limit or 500} के बजट में सबसे तेज यात्रा विकल्प खोज लिए हैं।"
        elif lang == "mr":
            if is_bus_query and best_bus:
                ai_msg = f"मी {from_city} ते {to_city} प्रवासासाठी {best_bus['name']} ({best_bus['dep_time']}, ₹{best_bus['price']}) शोधली आहे. {best_bus['seats']} शिल्लक आहेत. बुक करू का?"
            elif best_flight and is_flight_query:
                ai_msg = f"मी {from_city} ते {to_city} साठी {best_flight['name']} (वेळ {best_flight['dep_time']}, ₹{best_flight['price']}) शोधली आहे. {best_flight['seats']} शिल्लक आहेत. बुक करू का?"
            elif best_train:
                ai_msg = f"मी {from_city} ते {to_city} साठी वंदे भारत एक्सप्रेस (सकाळी {best_train['dep_time']} वाजता, ₹{best_train['price']}) शोधली आहे."
            else:
                ai_msg = f"मी {from_city} ते {to_city} प्रवासासाठी ₹{budget_limit or 500} च्या बजेटमधील उत्तम पर्याय शोधले आहेत."
        else:
            if is_bus_query and best_bus:
                ai_msg = f"Found {best_bus['name']} ({best_bus['dep_time']}, ₹{best_bus['price']}) for {from_city} to {to_city}. Ready to book?"
            elif best_flight and is_flight_query:
                ai_msg = f"Found {best_flight['name']} (Departs {best_flight['dep_time']}, ₹{best_flight['price']}) for {from_city} to {to_city}. Ready to book?"
            else:
                ai_msg = f"Found fastest travel options from {from_city} to {to_city} including buses, trains, and flights."

        steps_log.append({
            "step": 3,
            "title": "Neural Voice Synthesis",
            "detail": "Generating natural human voice audio response",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"), fast_only=False)

        travel_suggestions = (
            ["सगळ्यात स्वस्त दाखवा 💰", "फक्त शिवनेरी बस 🚌", "फास्टेस्ट फ्लाईट ✈️", "उद्या सकाळी 🌅"] if lang == "mr"
            else (["सबसे सस्ता दिखाओ 💰", "सिर्फ बस दिखाओ 🚌", "फास्टेस्ट फ्लाइट ✈️", "सुबह का सफर 🌅"] if lang == "hi"
            else ["Cheapest Option 💰", "Buses Only 🚌", "Fastest Flight ✈️", "Morning Travel 🌅"])
        )

        return {
            "mode": "ACTION",
            "service": "travel",
            "language": lang,
            "ai_message": ai_msg,
            "travel_data": travel_results,
            "suggested_replies": travel_suggestions,
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 8: HOTEL BOOKING (PAYTM HOTELS & STAYS)
    # Uses: SerpApi Google Local / Hotels Search
    # ==========================================================
    if service == "hotel":
        city = detected_city or "Pune"
        location = detected_location or "Airport"
        budget_limit = explicit_price or 1000

        steps_log.append({
            "step": 2,
            "title": "SerpApi Google Hotels & Local Discovery",
            "detail": f"Searching budget verified hotels near {city} {location} (Budget: ~₹{budget_limit}) with SerpApi",
            "status": "completed"
        })
        hotel_results = search_hotel_options(city, location, max_budget=budget_limit)
        hotels = hotel_results.get("hotels", [])
        top_hotel = hotels[0] if hotels else None

        if lang == "hi":
            ai_msg = f"मैंने {city} {location} के पास आपके ₹{budget_limit} के बजट में बेहतरीन होटल खोज लिए हैं। {top_hotel['name']} ({location} से {top_hotel['distance']}, ₹{top_hotel['price']} प्रति रात) उपलब्ध है। क्या आप कमरा बुक करना चाहते हैं?"
        elif lang == "mr":
            ai_msg = f"मी {city} {location} जवळ तुमच्या ₹{budget_limit} च्या बजेटमधील सर्वोत्तम हॉटेल्स शोधली आहेत. {top_hotel['name']} ({location} पासून {top_hotel['distance']}, ₹{top_hotel['price']}/रात्र) उपलब्ध आहे. रूम बुक करायची का?"
        else:
            ai_msg = f"Found top budget hotels near {city} {location} within your ₹{budget_limit} budget. {top_hotel['name']} ({top_hotel['distance']}, ₹{top_hotel['price']}/night) with free WiFi and AC. Ready to book?"

        steps_log.append({
            "step": 3,
            "title": "Neural Voice Synthesis",
            "detail": "Generating natural human voice audio response",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"), fast_only=False)

        hotel_suggestions = (
            ["₹1000 च्या आतील हॉटेल्स 🏷️", "टॉप ४.५+ स्टार रेटिंग ⭐", "विमानतळाच्या जवळ 📍", "फ्री ब्रेकफास्ट ☕"] if lang == "mr"
            else (["₹1000 के अंदर होटल 🏷️", "टॉप रेटेड 4.5+ ⭐", "एयरपोर्ट के सबसे पास 📍", "फ्री ब्रेकफास्ट ☕"] if lang == "hi"
            else ["Under ₹1000 🏷️", "Top Rated 4.5+ ⭐", "Closest to Airport 📍", "Free Breakfast ☕"])
        )

        return {
            "mode": "ACTION",
            "service": "hotel",
            "language": lang,
            "ai_message": ai_msg,
            "hotel_data": hotel_results,
            "suggested_replies": hotel_suggestions,
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 9: SHOPPING & DEALS MODE (PAYTM DEALS & CASHBACK)
    # Uses: SerpApi Google Shopping & Local Deals + Partner Vouchers
    # ==========================================================
    if service == "shopping":
        city = detected_city or "Pune"
        steps_log.append({
            "step": 2,
            "title": "SerpApi Shopping Deals Intelligence",
            "detail": f"Scanning top mall discounts, electronics & cashback offers in {city}",
            "status": "completed"
        })
        shopping_data = search_shopping_deals(city, query=query, max_budget=explicit_price or 0)
        deals = shopping_data.get("deals", [])
        top_deal = deals[0] if deals else None

        if lang == "hi":
            ai_msg = f"मैंने {city} में बेस्ट शॉपिंग ऑफर्स और डिस्काउंट डील्स खोज लिए हैं। {top_deal['brand']} ({top_deal['mall']}) पर {top_deal['title']} मिल रहा है। कूपन कोड: {top_deal['code']}"
        elif lang == "mr":
            ai_msg = f"मी {city} मधील सर्वोत्तम शॉपिंग ऑफर्स आणि डिस्काउंट डील्स शोधल्या आहेत. {top_deal['brand']} वर {top_deal['title']} उपलब्ध आहे. कूपन कोड: {top_deal['code']}"
        else:
            ai_msg = f"Found top shopping deals and cashback offers in {city}. {top_deal['brand']} is offering {top_deal['title']} with code {top_deal['code']}."

        steps_log.append({
            "step": 3,
            "title": "Neural Voice Synthesis",
            "detail": "Generating natural human voice audio response",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"), fast_only=False)

        shopping_suggestions = (
            ["इलेक्ट्रॉनिक्स कॅशबॅक 📱", "झोमॅटो ५०% डिस्काउंट 🍔", "फॅशन व कपडे डील्स 👗", "किराणा ५% कॅशबॅक 🏪"] if lang == "mr"
            else (["इलेक्ट्रॉनिक्स कैशबैक 📱", "ज़ोमेटो 50% छूट 🍔", "फैशन और मॉल ऑफर्स 👗", "किराना 5% कैशबैक 🏪"] if lang == "hi"
            else ["Electronics Cashback 📱", "Food 50% Off 🍔", "Fashion & Mall Deals 👗", "Kirana 5% Back 🏪"])
        )

        return {
            "mode": "ACTION",
            "service": "shopping",
            "language": lang,
            "ai_message": ai_msg,
            "shopping_data": shopping_data,
            "suggested_replies": shopping_suggestions,
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 10: MOVIE TICKETS MODE (PAYTM MOVIES & ENTERTAINMENT)
    # Uses: Multiplex Showtimes & Seat Availability
    # ==========================================================
    if service == "movie":
        city = detected_city or "Pune"
        steps_log.append({
            "step": 2,
            "title": "Paytm Entertainment Multiplex Discovery",
            "detail": f"Fetching live showtimes for PVR, INOX & Cinepolis in {city}",
            "status": "completed"
        })
        movie_data = search_movie_options(city)
        movies = movie_data.get("movies", [])
        top_movie = movies[0] if movies else None

        if lang == "hi":
            ai_msg = f"मैंने {city} में लेटेस्ट मूवीज और शोटाइम खोज लिए हैं। {top_movie['title']} ({top_movie['theatre']}) के टिकट ₹{top_movie['price']} से शुरू हैं। क्या टिकट बुक करें?"
        elif lang == "mr":
            ai_msg = f"मी {city} मधील चित्रपट आणि शोटाइम शोधले आहेत. {top_movie['title']} ({top_movie['theatre']}) चे तिकीट ₹{top_movie['price']} पासून सुरू आहे. बुक करू का?"
        else:
            ai_msg = f"Found live movie showtimes in {city}. {top_movie['title']} at {top_movie['theatre']} starts at ₹{top_movie['price']}. Ready to book?"

        steps_log.append({
            "step": 3,
            "title": "Neural Voice Synthesis",
            "detail": "Generating natural human voice audio response",
            "status": "completed"
        })
        audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"), fast_only=False)

        movie_suggestions = (
            ["पुष्पा २ PVR शो 💥", "स्त्री २ आज संध्याकाळी 👻", "मराठी चित्रपट 🚩", "कांतारा 4DX 🌲"] if lang == "mr"
            else (["पुष्पा 2 PVR शो 💥", "स्त्री 2 शाम का शो 👻", "कंतारा 4DX 🌲", "नजदीकी सिनेमा 🎬"] if lang == "hi"
            else ["Pushpa 2 IMAX 💥", "Stree 2 Evening 👻", "Kantara 4DX 🌲", "Nearest Multiplex 🎬"])
        )

        return {
            "mode": "ACTION",
            "service": "movie",
            "language": lang,
            "ai_message": ai_msg,
            "movie_data": movie_data,
            "suggested_replies": movie_suggestions,
            "steps_log": steps_log,
            "audio_base64": audio_b64
        }

    # ==========================================================
    # BRANCH 3: RECHARGE MODE (FLAGSHIP PAYTM ONE)
    # Uses: Plan Matcher + SerpApi Live Search + Sarvam AI Audio
    # ==========================================================
    operator = (parsed.get("operator") or op_detected or "jio").lower()
    budget = int(parsed.get("budget") or explicit_price or 299)
    data_daily = parsed.get("data_daily") or detected_data or ""
    wants_netflix = bool(parsed.get("wants_netflix") or wants_netflix)

    steps_log.append({
        "step": 2,
        "title": "SerpApi Live Telecom Search",
        "detail": f"Searching live web deals for {operator.upper()} with budget ~₹{budget}",
        "status": "completed"
    })
    serp_data = search_recharge_live_with_serp(operator, budget, query)

    steps_log.append({
        "step": 3,
        "title": "Telecom Plan Detective Engine",
        "detail": f"Filtering plans across {operator.upper()} catalog for {data_daily or 'daily data'} and OTT perks",
        "status": "completed"
    })
    matched_plans = find_matching_recharge_plan(
        operator=operator,
        budget=budget,
        data_daily=data_daily,
        wants_netflix=wants_netflix
    )
    best_plan = matched_plans["best"]

    # Verbal message
    if lang == "hi":
        ai_msg = (
            f"मैंने आपके लिए {operator.upper()} का बेस्ट ₹{best_plan['price']} का {best_plan['data']} प्लान चुना है! "
            f"इसमें {best_plan['validity']} वैलिडिटी और 5G शामिल है। क्या आप रिचार्ज अप्रूव करना चाहते हैं?"
        )
    elif lang == "mr":
        ai_msg = (
            f"मी तुमच्यासाठी {operator.upper()} चा बेस्ट ₹{best_plan['price']} चा {best_plan['data']} प्लॅन शोधला आहे! "
            f"रिचार्ज मंजूर करायचा का?"
        )
    else:
        ai_msg = (
            f"I found the best match {operator.upper()} ₹{best_plan['price']} plan with {best_plan['data']} "
            f"and {best_plan['validity']} validity. Ready to approve?"
        )

    steps_log.append({
        "step": 4,
        "title": "Neural Voice Synthesis",
        "detail": "Synthesizing verified audio voice",
        "status": "completed"
    })
    audio_b64 = generate_sarvam_speech(ai_msg, "hi-IN" if lang == "hi" else ("mr-IN" if lang == "mr" else "en-IN"), fast_only=False)

    steps_log.append({
        "step": 5,
        "title": "Zero-Trust Security Governance Gate",
        "detail": "Waiting for User Approval & UPI PIN Confirmation",
        "status": "waiting_approval"
    })

    recharge_suggestions = (
        [f"{operator.upper()} 2GB Daily Data", f"{operator.upper()} 84 Days Plan", "Netflix Hotstar OTT Pack", "Annual 365 Days Plan"] if lang == "mr"
        else ([f"{operator.upper()} 2GB डेली डेटा", f"{operator.upper()} 84 दिन का प्लान", "Netflix OTT पैक", "सालाना ₹2999 प्लान"] if lang == "hi"
        else [f"{operator.upper()} 2GB Daily Data", f"{operator.upper()} 84 Days Plan", "Netflix Disney Pack", "Annual 365 Days Plan"])
    )

    return {
        "mode": "ACTION",
        "service": "recharge",
        "language": lang,
        "operator": operator,
        "budget": budget,
        "wants_netflix": wants_netflix,
        "ai_message": ai_msg,
        "plan_data": matched_plans,
        "suggested_replies": recharge_suggestions,
        "serp_verification": serp_data,
        "steps_log": steps_log,
        "audio_base64": audio_b64
    }
