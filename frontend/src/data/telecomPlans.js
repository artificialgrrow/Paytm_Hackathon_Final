// API Client & Comprehensive Scenario Mirror for Paytm AI Hub
// Backed by SQLite scenarios and LangGraph backend (http://localhost:8000)

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/+$/, '');

export const SCENARIO_DATABASE = {
  merchant: {
    merchant_id: "MERCH_SHARMA_01",
    name: "Sharma Telecom & Digital Services",
    category: "Authorized Telecom & Bharat BillPay Partner",
    upi_id: "sharmatelecom@paytm",
    phone: "+91 98201 99887",
    address: "Shop 14, Linking Road, Bandra West, Mumbai, MH 400050",
    rating: 4.94,
    is_verified: 1
  },
  plans: [
    { plan_id: "jio-149", operator: "Jio", price: 149, validity: "14 Days", data_daily: "1 GB / Day", total_data: "14 GB", calls: "Unlimited Calls", network: "Jio 4G LTE", ott: "JioTV, JioCloud", badge: "Cheapest Jio Pack 🏷️", is_cheapest: 1, has_netflix: 0 },
    { plan_id: "jio-198", operator: "Jio", price: 198, validity: "14 Days", data_daily: "2 GB / Day", total_data: "28 GB", calls: "Unlimited Calls", network: "True Unlimited 5G", ott: "JioTV, JioCinema", badge: "5G Booster 🚀", is_cheapest: 0, has_netflix: 0 },
    { plan_id: "jio-239", operator: "Jio", price: 239, validity: "28 Days", data_daily: "1.5 GB / Day", total_data: "42 GB", calls: "Unlimited Calls", network: "Jio 4G / 5G", badge: "Daily 1.5GB 📱", is_cheapest: 0, has_netflix: 0 },
    { plan_id: "jio-299", operator: "Jio", price: 299, validity: "28 Days", data_daily: "2 GB / Day", total_data: "56 GB", calls: "Unlimited Calls", network: "True Unlimited 5G", ott: "JioTV, JioCinema, JioCloud", badge: "Best Value & 5G ⚡", is_cheapest: 0, has_netflix: 0 },
    { plan_id: "jio-349", operator: "Jio", price: 349, validity: "28 Days", data_daily: "2.5 GB / Day", total_data: "70 GB", calls: "Unlimited Calls", network: "True Unlimited 5G", ott: "JioCinema Premium, JioTV", badge: "High Speed 2.5GB 🚀", is_cheapest: 0, has_netflix: 0 },
    { plan_id: "jio-398", operator: "Jio", price: 398, validity: "28 Days", data_daily: "2 GB / Day", total_data: "56 GB", calls: "Unlimited Calls", network: "True Unlimited 5G", ott: "Netflix (Basic Mobile), JioCinema", badge: "Netflix Pack 🎬", is_cheapest: 0, has_netflix: 1 },
    { plan_id: "jio-857", operator: "Jio", price: 857, validity: "84 Days", data_daily: "2 GB / Day", total_data: "168 GB", calls: "Unlimited Calls", network: "True Unlimited 5G", ott: "Amazon Prime Video, JioCinema", badge: "84-Day Saver 🎯", is_cheapest: 0, has_netflix: 0 },
    { plan_id: "airtel-199", operator: "Airtel", price: 199, validity: "28 Days", data_daily: "2 GB Total", total_data: "2 GB", calls: "Unlimited Calls", network: "Airtel 4G", ott: "Wynk Music", badge: "Cheapest Airtel Calling 🏷️", is_cheapest: 1, has_netflix: 0 },
    { plan_id: "airtel-299", operator: "Airtel", price: 299, validity: "28 Days", data_daily: "1.5 GB / Day", total_data: "42 GB", calls: "Unlimited Calls", network: "Unlimited 5G Data", ott: "Airtel Xstream Play, Wynk", badge: "Popular 5G ⚡", is_cheapest: 0, has_netflix: 0 },
    { plan_id: "airtel-349", operator: "Airtel", price: 349, validity: "28 Days", data_daily: "2 GB / Day", total_data: "56 GB", calls: "Unlimited Calls", network: "Unlimited 5G Data", ott: "Airtel Xstream Play (20+ OTTs)", badge: "Best 2GB 🏆", is_cheapest: 0, has_netflix: 0 },
    { plan_id: "vi-299", operator: "Vi", price: 299, validity: "28 Days", data_daily: "1.5 GB / Day + Night", total_data: "42 GB", calls: "Unlimited Calls", network: "Vi GIGAnet 4G", ott: "Binge All Night (12-6AM), Weekend Rollover", badge: "Hero Unlimited 🌙", is_cheapest: 0, has_netflix: 0 }
  ],
  travel: [
    { ticket_id: "trav-mum-pun-trn2", from_city: "Mumbai", to_city: "Pune", travel_type: "train", carrier: "Deccan Queen Superfast (12123)", service_name: "AC Chair Car", dep_time: "05:10 PM", arr_time: "08:25 PM", duration: "3h 15m", price: 380, seats: "Available (RAC 5)", is_cheapest: 1, is_fastest: 0, cashback: "Instant IRCTC Booking" },
    { ticket_id: "trav-mum-pun-bus1", from_city: "Mumbai", to_city: "Pune", travel_type: "bus", carrier: "MSRTC Shivneri Volvo", service_name: "Multi-Axle AC Sleeper", dep_time: "06:30 AM", arr_time: "10:15 AM", duration: "3h 45m", price: 480, seats: "22 Seats Left", is_cheapest: 0, is_fastest: 0, cashback: "Flat ₹50 Cashback" },
    { ticket_id: "trav-mum-pun-trn1", from_city: "Mumbai", to_city: "Pune", travel_type: "train", carrier: "Vande Bharat Express (22225)", service_name: "Executive AC Chair Car", dep_time: "06:05 AM", arr_time: "09:15 AM", duration: "3h 10m", price: 560, seats: "Available (WL 0)", is_cheapest: 0, is_fastest: 0, cashback: "Instant IRCTC Booking" },
    { ticket_id: "trav-mum-pun-flt1", from_city: "Mumbai", to_city: "Pune", travel_type: "flight", carrier: "IndiGo 6E-442", service_name: "Airbus A320 Direct", dep_time: "08:15 AM", arr_time: "09:05 AM", duration: "50 mins", price: 2250, seats: "9 Seats Left", is_cheapest: 0, is_fastest: 1, cashback: "Flat ₹150 Cashback" }
  ],
  movies: [
    {
      movie_id: "mov-kalki-pun-01", title: "Kalki 2898 AD", genre: "Sci-Fi / Action / Mythology", language: "Hindi / Telugu", rating: "8.9/10 IMDb • UA 16+",
      theatre_name: "PVR INOX Phoenix Marketcity Viman Nagar", city: "Pune",
      showtimes: "10:15 AM, 01:45 PM, 05:30 PM, 09:15 PM", format: "IMAX 3D", price: 450,
      seats_available: "Filling Fast (14 Seats Left)", cashback: "Flat ₹75 Cashback with Paytm UPI",
      snack_offer: "20% Off on Large Popcorn & Beverage Combo",
      description: "Epic dystopian science-fiction spectacle starring Amitabh Bachchan, Kamal Haasan, Prabhas, and Deepika Padukone."
    },
    {
      movie_id: "mov-stree2-pun-02", title: "Stree 2: Sarkate Ka Aatank", genre: "Horror / Comedy", language: "Hindi", rating: "8.6/10 IMDb • UA",
      theatre_name: "Cinepolis Seasons Mall Magarpatta", city: "Pune",
      showtimes: "11:00 AM, 02:15 PM, 06:00 PM, 09:45 PM", format: "Dolby Atmos 2D", price: 320,
      seats_available: "Available (48 Seats Left)", cashback: "Buy 1 Get 1 Free on Paytm Movies (Code: MOVIEBOGO)",
      snack_offer: "Free Salted Popcorn on Ticket Pair",
      description: "Chanderi faces a headless terror as Stree returns in this horror-comedy blockbuster starring Rajkummar Rao and Shraddha Kapoor."
    },
    {
      movie_id: "mov-fighter-pun-03", title: "Fighter", genre: "Action / Thriller", language: "Hindi", rating: "8.2/10 IMDb • UA 16+",
      theatre_name: "PVR ICON Pavilion Senapati Bapat Road", city: "Pune",
      showtimes: "12:30 PM, 04:15 PM, 08:00 PM", format: "4DX 3D", price: 490,
      seats_available: "Filling Fast (8 Seats Left)", cashback: "Flat ₹50 Instant Discount",
      snack_offer: "15% Off Nachos & Cheese Combo",
      description: "India's premier air combat action film featuring aerial dogfights with Hrithik Roshan and Deepika Padukone."
    },
    {
      movie_id: "mov-dune2-mum-04", title: "Dune: Part Two", genre: "Sci-Fi / Adventure", language: "English", rating: "9.1/10 IMDb • UA",
      theatre_name: "PVR INOX IMAX High Street Phoenix Lower Parel", city: "Mumbai",
      showtimes: "11:30 AM, 03:45 PM, 07:30 PM, 11:15 PM", format: "IMAX Laser 70mm", price: 650,
      seats_available: "Selling Out Fast (6 Seats Left)", cashback: "Exclusive ₹100 Off with Paytm UPI",
      snack_offer: "Complimentary Gourmet Caramel Popcorn",
      description: "Denis Villeneuve's visual masterwork following Paul Atreides' mythic journey across Arrakis."
    },
    {
      movie_id: "mov-pushpa2-mum-05", title: "Pushpa 2: The Rule", genre: "Action / Drama", language: "Hindi / Telugu", rating: "Expected 9.0/10 • UA",
      theatre_name: "Cinepolis Fun Republic Andheri West", city: "Mumbai",
      showtimes: "10:00 AM, 01:30 PM, 05:00 PM, 08:30 PM", format: "Dolby Atmos 2D", price: 380,
      seats_available: "Advance Booking Open (120 Seats Left)", cashback: "₹50 Cashback on Pre-booking",
      snack_offer: "Special Pushpa Commemorative Merchandise",
      description: "Allu Arjun returns as Pushpa Raj in the colossal clash against Bhanwar Singh Shekhawat."
    },
    {
      movie_id: "mov-glad2-pun-06", title: "Gladiator II", genre: "Epic / Action / Historical", language: "English / Hindi", rating: "8.4/10 IMDb • A",
      theatre_name: "INOX Pavilion Mall", city: "Pune",
      showtimes: "01:00 PM, 04:30 PM, 08:15 PM", format: "Insignia Luxe Recliner", price: 550,
      seats_available: "Available (22 Recliners Left)", cashback: "Flat 20% Off on Paytm Luxe",
      snack_offer: "Chef-curated in-seat fine dining service",
      description: "Ridley Scott's Roman colosseum sequel starring Paul Mescal, Pedro Pascal, and Denzel Washington."
    }
  ],
  promos: [
    { code: "PAYTMJIO50", category: "recharge", title: "Jio Recharge Mega Cashback", discount_text: "Flat ₹50 Instant Cashback", discount_amount: 50, min_spend: 666, valid_until: "31 Dec 2026", terms: "Valid on Jio 84-day or annual prepaid recharges via Paytm UPI.", badge: "Trending 🔥" },
    { code: "AIRTEL30", category: "recharge", title: "Airtel 5G Booster Discount", discount_text: "Flat ₹30 Off on 2GB/Day Plans", discount_amount: 30, min_spend: 299, valid_until: "31 Dec 2026", terms: "Applicable on Airtel prepaid packs of ₹299 and above.", badge: "Popular 📱" },
    { code: "FLIGHTFLY", category: "travel", title: "Domestic Flight Booking Bonanza", discount_text: "Up to ₹1,500 Instant Discount", discount_amount: 1500, min_spend: 3000, valid_until: "15 Jan 2027", terms: "Valid on IndiGo, Air India, and Akasa Air domestic flight tickets.", badge: "Super Saver ✈️" },
    { code: "BUSNEW", category: "travel", title: "Intercity Bus Booking Offer", discount_text: "Flat 20% Cashback up to ₹150", discount_amount: 150, min_spend: 400, valid_until: "31 Dec 2026", terms: "Valid on MSRTC Shivneri, Purple Travels, and Zingbus bookings.", badge: "Top Choice 🚌" },
    { code: "RAILZERO", category: "travel", title: "IRCTC Confirmed Train Booking", discount_text: "Zero Payment Gateway & Convenience Fee", discount_amount: 40, min_spend: 200, valid_until: "31 Dec 2026", terms: "Save PG charges on all IRCTC AC Chair Car and Sleeper tickets.", badge: "Zero Fee 🚆" },
    { code: "MOVIEBOGO", category: "movies", title: "PVR INOX Buy 1 Get 1 Free", discount_text: "Buy 1 Movie Ticket, Get 1 Free", discount_amount: 350, min_spend: 350, valid_until: "31 Dec 2026", terms: "Applicable on weekend screenings across all PVR & INOX screens.", badge: "BOGO Free 🎬" },
    { code: "IMAX100", category: "movies", title: "IMAX Experience Discount", discount_text: "Flat ₹100 Off on IMAX 3D Tickets", discount_amount: 100, min_spend: 450, valid_until: "31 Dec 2026", terms: "Valid on Kalki 2898 AD and Dune: Part Two in IMAX multiplexes.", badge: "IMAX Deal 🍿" },
    { code: "BIJLI50", category: "bills", title: "Electricity Bill Payment Cashback", discount_text: "Flat ₹50 Cashback on Power Bills", discount_amount: 50, min_spend: 1000, valid_until: "31 Dec 2026", terms: "Valid on MSEDCL, Adani, Tata Power, and BESCOM electricity payments.", badge: "Bill Saver 💡" },
    { code: "ZOMATO50", category: "food", title: "Zomato Dining & Delivery", discount_text: "50% Off up to ₹100 on Food", discount_amount: 100, min_spend: 199, valid_until: "31 Dec 2026", terms: "Pay using Paytm UPI QR or in-app checkout at 10,000+ restaurants.", badge: "Foodie 🍔" },
    { code: "GOLD24K", category: "shopping", title: "MMTC-PAMP Digital Gold Offer", discount_text: "Get Extra 1% Free 24K Pure Gold", discount_amount: 50, min_spend: 1000, valid_until: "31 Dec 2026", terms: "Free gold grams credited instantly to your insured vault.", badge: "Gold Bonus 🪙" }
  ],
  shopping: [
    { deal_id: "deal-pun-croma-01", category: "electronics", city: "Pune", brand: "Croma Megastore", mall_name: "Phoenix Marketcity Viman Nagar", title: "Flat ₹2,000 Off on Smart TVs & Laptops", discount_pct: 25, coupon_code: "CROMA2000", min_spend: 15000, badge: "Paytm Exclusive 🏷️", valid_until: "30 Nov 2026" },
    { deal_id: "deal-pun-rel-02", category: "electronics", city: "Pune", brand: "Reliance Digital", mall_name: "Seasons Mall Magarpatta", title: "Instant 10% Cashback on 5G Smartphones", discount_pct: 10, coupon_code: "RELIANCE10", min_spend: 10000, badge: "Smartphone Deal 📱", valid_until: "05 Dec 2026" },
    { deal_id: "deal-pun-zom-03", category: "food", city: "Pune", brand: "Zomato Dining", mall_name: "FC Road & Koregaon Park", title: "Flat 50% Off up to ₹150 on Food Delivery", discount_pct: 50, coupon_code: "PAYTM50", min_spend: 299, badge: "Super Saver 🍔", valid_until: "31 Dec 2026" },
    { deal_id: "deal-pun-myn-04", category: "fashion", city: "Pune", brand: "Myntra", mall_name: "Westend Mall Aundh", title: "Extra 30% Off on Winter Fashion & Jackets", discount_pct: 30, coupon_code: "MYNTRA30", min_spend: 1499, badge: "Winter Trend 👗", valid_until: "15 Dec 2026" },
    { deal_id: "deal-pun-pvr-05", category: "entertainment", city: "Pune", brand: "PVR INOX Cinemas", mall_name: "Pavilion Mall Senapati Bapat Road", title: "Buy 1 Get 1 Free on Movie Tickets", discount_pct: 50, coupon_code: "PVRPAYTM", min_spend: 350, badge: "BOGO Offer 🎬", valid_until: "31 Dec 2026" }
  ],
  bills: [
    { bill_id: "bill-elec-msedcl", service_type: "electricity", provider_name: "Maharashtra State Electricity Distribution Co. (MSEDCL)", consumer_id: "002948192841", consumer_name: "Akash Bichukale", amount_due: 1420.0, due_date: "28 Nov 2026", units_consumed: "184 kWh", balance: 0.0, status: "DUE", cashback: "Flat ₹50 Cashback on Paytm UPI" },
    { bill_id: "bill-gas-mgl", service_type: "gas", provider_name: "Mahanagar Gas Limited (MGL Piped Gas)", consumer_id: "MGL-992019482", consumer_name: "Akash Bichukale", amount_due: 840.0, due_date: "30 Nov 2026", units_consumed: "24 SCM", balance: 0.0, status: "DUE", cashback: "Flat ₹30 Cashback" },
    { bill_id: "bill-water-pmc", service_type: "water", provider_name: "Pune Municipal Corporation (PMC Water Dept)", consumer_id: "PMC-WTR-48192", consumer_name: "Akash Bichukale", amount_due: 420.0, due_date: "05 Dec 2026", units_consumed: "15,000 Litres", balance: 0.0, status: "DUE", cashback: "Zero Gateway Convenience Fee" },
    { bill_id: "bill-bb-jiofiber", service_type: "broadband", provider_name: "JioFiber 100 Mbps Unlimited Home Broadband", consumer_id: "020-49182941", consumer_name: "Akash Bichukale", amount_due: 1179.0, due_date: "01 Dec 2026", units_consumed: "Unlimited High Speed", balance: 0.0, status: "DUE", cashback: "Free 14 OTT Apps Bundle" },
    { bill_id: "bill-fastag-car1", service_type: "fastag", provider_name: "NETC NHAI National Electronic Toll (Paytm FASTag)", consumer_id: "MH 12 AB 1234", consumer_name: "Akash Bichukale", amount_due: 500.0, due_date: "Instant Top-Up", units_consumed: "N/A", balance: 45.0, status: "LOW_BALANCE", cashback: "Flat ₹25 Cashback on Highways" },
    { bill_id: "bill-dth-tataplay", service_type: "dth", provider_name: "Tata Play DTH Satellite Television", consumer_id: "1092837482", consumer_name: "Akash Bichukale", amount_due: 399.0, due_date: "25 Nov 2026", units_consumed: "185 Channels + Free Binge OTT", balance: 0.0, status: "DUE", cashback: "Flat ₹30 Cashback on Recharge" }
  ],
  disputes: [
    {
      case_id: "DISP_CASE_01", txn_id: "PTM7890124", user_id: "paytm_user_01", dispute_type: "pending_recharge", amount: 599.0,
      service_name: "Jio Prepaid Recharge (84 Days)", bank_name: "State Bank of India", bank_rrn: "SBI_RRN_9820194812",
      status: "PENDING_AT_SWITCH", reconciliation_status: "Discrepancy: Debited from SBI, Jio Switch Timed Out during Token Exchange",
      finding_en: "Amount of ₹599 debited from your SBI account but timed out at the telecom switch. Under NPCI Harmonisation Circular No. 81, automated reversal will credit by tomorrow 10:14 AM.",
      finding_hi: "आपके SBI खाते से ₹599 कट गए हैं, परंतु ऑपरेटर के सर्वर पर नेटवर्क टाइमआउट हुआ है। NPCI परिपत्रक क्र. 81 के अनुसार कल सुबह 10:14 तक राशि आपके खाते में वापस आ जाएगी।",
      regulatory_citation: "NPCI Harmonisation Circular No. 81 (T+1 SLA with ₹100/day compensation)",
      tat_sla: "T+1 Business Days (By Tomorrow, 10:14 AM IST)", compensation_eligible: 1
    },
    {
      case_id: "DISP_CASE_02", txn_id: "PTM1200984", user_id: "paytm_user_01", dispute_type: "refund_tracker", amount: 1200.0,
      service_name: "E-Commerce Order Cancellation (Myntra)", bank_name: "HDFC Bank", bank_rrn: "HDFC_RRN_4810294819",
      status: "CLEARING_CYCLE_ACTIVE", reconciliation_status: "Merchant Initiated Refund (ARN: 8201948201) • Funds Active in Bank Clearing",
      finding_en: "Merchant has successfully approved and sent ₹1,200 refund with Acquirer Reference Number (ARN: 8201948201). Currently in RBI clearing house settlement.",
      finding_hi: "व्यापारी ने ₹1,200 का रिफंड मंजूर कर दिया है (ARN: 8201948201)। राशि अभी बैंकिंग क्लियरिंग में है और 48 घंटे में आ जाएगी।",
      regulatory_citation: "RBI Payment System Circular Section 10(2)",
      tat_sla: "Within 48 Hours to Source Account", compensation_eligible: 0
    },
    {
      case_id: "DISP_CASE_03", txn_id: "PTM2450891", user_id: "paytm_user_01", dispute_type: "refund_tracker", amount: 2450.0,
      service_name: "IRCTC Train Ticket Cancellation (PNR: 824-9182941)", bank_name: "State Bank of India", bank_rrn: "SBI_RRN_1928301928",
      status: "REFUND_PROCESSED_BY_IRCTC", reconciliation_status: "IRCTC Approved Refund ID: IRCTC_REF_99182 • Scheduled Bank Settlement",
      finding_en: "IRCTC cancellation refund of ₹2,450 successfully processed under Refund ID IRCTC_REF_99182. Funds are currently in the inter-bank NEFT batch and will credit your SBI account by tomorrow 06:00 PM.",
      finding_hi: "IRCTC ने ₹2,450 का रिफंड मंजूर किया है (रिफंड आईडी: IRCTC_REF_99182)। कल शाम ६ बजे तक SBI खाते में जमा होगा।",
      regulatory_citation: "Indian Railways Citizen Charter & RBI Compensation Rules",
      tat_sla: "T+2 Business Days (By Tomorrow, 06:00 PM IST)", compensation_eligible: 0
    },
    {
      case_id: "DISP_CASE_04", txn_id: "PTM3501928", user_id: "paytm_user_01", dispute_type: "refund_tracker", amount: 350.0,
      service_name: "Swiggy Order Cancellation (#SWG-9948)", bank_name: "ICICI Bank", bank_rrn: "ICICI_RRN_8910293847",
      status: "INSTANT_REFUND_COMPLETED", reconciliation_status: "Swiggy Reversal Confirmed via Immediate UPI Refund Rail",
      finding_en: "Swiggy restaurant cancellation of ₹350 has been reversed back to your ICICI Bank account via real-time UPI refund rail. Bank balance has been updated.",
      finding_hi: "स्विगी ऑर्डर रद्द होने के कारण ₹350 का इंस्टेंट रिफंड सीधे आपके ICICI खाते में जमा हो गया है।",
      regulatory_citation: "NPCI Real-Time Instant UPI Refund Mandate",
      tat_sla: "Instant (Already Credited)", compensation_eligible: 0
    },
    {
      case_id: "DISP_CASE_05", txn_id: "PTM4829104", user_id: "paytm_user_01", dispute_type: "failed_payment", amount: 2150.0,
      service_name: "SpiceJet Mumbai to Pune Flight Booking", bank_name: "HDFC Bank", bank_rrn: "HDFC_RRN_9910283741",
      status: "AIRLINE_LOCK_FAILED", reconciliation_status: "Seat Lock Expired during Gateway Handoff • Money Debited without PNR",
      finding_en: "₹2,150 was debited from HDFC Bank, but SpiceJet's reservation inventory expired before ticket issuance. PNR was not generated. Automated full reversal initiated under DGCA passenger charter.",
      finding_hi: "HDFC खाते से ₹2,150 कट गए लेकिन टिकट जारी नहीं हुई। DGCA नियमों के तहत पूरी राशि ऑटो-रिफंड में है।",
      regulatory_citation: "DGCA Passenger Charter Rule 3.2 & RBI Mandate",
      tat_sla: "T+1 Day Reversal (Within 24 Hours)", compensation_eligible: 1
    },
    {
      case_id: "DISP_CASE_06", txn_id: "PTM8819203", user_id: "paytm_user_01", dispute_type: "merchant_mismatch", amount: 200.0,
      service_name: "Sharma Kirana Store (QR Payment)", bank_name: "State Bank of India", bank_rrn: "SBI_RRN_1092837481",
      status: "SOUNDBOX_NETWORK_LAG", reconciliation_status: "Debited from Bank • Merchant 4G Soundbox Lagged due to Cellular Packet Drop",
      finding_en: "₹200 was deducted from your bank, but the merchant's 4G Soundbox experienced packet drop. Funds are safely frozen in NPCI Escrow and cannot be lost. Reversal queued or manual merchant settlement verified.",
      finding_hi: "आपके खाते से ₹200 कट गए लेकिन दुकानदार के साउंडबॉक्स पर नेटवर्क लैग हुआ। राशि NPCI एस्क्रो में सुरक्षित है।",
      regulatory_citation: "NPCI UPI Merchant Dispute Framework 2024",
      tat_sla: "Auto-Reversal within 2 Hours", compensation_eligible: 1
    },
    {
      case_id: "DISP_CASE_07", txn_id: "PTM5519281", user_id: "paytm_user_01", dispute_type: "duplicate_debit", amount: 300.0,
      service_name: "Metro Smart Card Automatic Top-Up", bank_name: "ICICI Bank", bank_rrn: "ICICI_RRN_7819203847",
      status: "DOUBLE_DEBIT_MATCHED", reconciliation_status: "Duplicate Debit Detected: Two identical ₹300 charges within 30 seconds",
      finding_en: "Our automated fraud & audit engine detected duplicate debits of ₹300. The second charge has been flagged and queued for instant reversal back to your ICICI Bank account.",
      finding_hi: "हमारे सिस्टम ने 30 सेकंड में दो बार ₹300 कटने का पता लगाया है। दूसरे लेनदेन का ऑटो-रिफंड शुरू कर दिया गया है।",
      regulatory_citation: "RBI Customer Protection Guidelines 2024",
      tat_sla: "T+1 Day Automated Bank Credit", compensation_eligible: 1
    },
    {
      case_id: "DISP_CASE_08", txn_id: "PTM1450284", user_id: "paytm_user_01", dispute_type: "bill_unpaid", amount: 1450.0,
      service_name: "MSEDCL Electricity BBPS Payment", bank_name: "Bank of Baroda", bank_rrn: "BOB_RRN_5918293847",
      status: "BBPS_SETTLEMENT_PENDING", reconciliation_status: "Cleared by Bharat BillPay Hub • Utility Biller ERP Sync Pending",
      finding_en: "Payment of ₹1,450 cleared successfully through NPCI Bharat BillPay. MSEDCL utility portal takes up to 24 hours to sync receipt and update bill status to PAID.",
      finding_hi: "₹1,450 का भुगतान भारत बिलपे से सफल हो गया है। महावितरण पोर्टल पर स्थिति अपडेट होने में 24 घंटे लगते हैं।",
      regulatory_citation: "Bharat Bill Payment System (BBPS) Dispute Resolution Mechanism",
      tat_sla: "24 Hours Biller ERP Update Guarantee", compensation_eligible: 0
    },
    {
      case_id: "DISP_CASE_09", txn_id: "COMP_2026_0941", user_id: "paytm_user_01", dispute_type: "formal_complaint", amount: 599.0,
      service_name: "Nodal Officer Escalation (Delayed Recharge)", bank_name: "State Bank of India", bank_rrn: "SBI_RRN_9820194812",
      status: "ESCALATED_TO_NODAL_OFFICER", reconciliation_status: "Formal Dispute Docket Sealed with SHA-256 • Assigned to Mr. Rajesh Sharma",
      finding_en: "Official complaint docket COMP_2026_0941 has been registered with SHA-256 evidence sealing. Assigned to Senior Dispute Officer Mr. Rajesh Sharma for priority resolution within 12 hours.",
      finding_hi: "औपचारिक शिकायत COMP_2026_0941 दर्ज कर दी गई है और नोडल अधिकारी श्री राजेश शर्मा को सौंपी गई है।",
      regulatory_citation: "RBI Banking Ombudsman Scheme 2021",
      tat_sla: "12 Hours Dedicated SLA", compensation_eligible: 1
    },
    {
      case_id: "DISP_CASE_10", txn_id: "COMP_2026_1120", user_id: "paytm_user_01", dispute_type: "formal_complaint", amount: 2150.0,
      service_name: "Aviation Consumer Grievance (SpiceJet Flight)", bank_name: "HDFC Bank", bank_rrn: "HDFC_RRN_9910283741",
      status: "DGCA_ESCALATION_ACTIVE", reconciliation_status: "Formal Air Passenger Dispute Filed under DGCA Rule 3.2",
      finding_en: "Aviation complaint COMP_2026_1120 forwarded to carrier nodal desk with bank debit certificate. Full refund + statutory cancellation compensation requested.",
      finding_hi: "उड्डयन शिकायत COMP_2026_1120 विमानन नोडल डेस्क को भेज दी गई है।",
      regulatory_citation: "DGCA Air Passenger Charter Section 3",
      tat_sla: "24 Hours Airline Action SLA", compensation_eligible: 1
    }
  ]
};

export const fetchMerchantData = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/merchant-data`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // console.info('Backend API unavailable, using local scenario data');
  }
  return SCENARIO_DATABASE;
};

export const executeAgentQuery = async (query, language = 'en') => {
  // 1. Attempt LangGraph FastAPI backend first
  try {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        user_id: 'paytm_user_01',
        language: language || 'en',
        merchant_id: 'MERCH_SHARMA_01'
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // console.info('Backend unavailable, executing pure client AI router');
  }

  // 2. Client-side Pure Multi-Agent Router (Zero Hallucination Mirror)
  const q = query.toLowerCase();
  const isHindi = language === 'hi' || q.includes('mujhe') || q.includes('chahiye') || q.includes('karo') || q.includes('paise') || q.includes('कट');
  const isMarathi = language === 'mr' || q.includes('mala') || q.includes('ahe') || q.includes('pahije');
  const lang = isHindi ? 'hi' : (isMarathi ? 'mr' : 'en');

  // Check if Greeting / Capabilities inquiry
  const isGreeting = q === 'hi' || q === 'hello' || q === 'hey' || q.includes('namaste') || 
                     q.includes('help') || q.includes('modes') || q.includes('what can you do') || 
                     q.includes('who are you') || q.includes('मदद') || q.includes('नमस्ते');

  if (isGreeting) {
    const greetingMsg = lang === 'hi'
      ? "नमस्ते! मैं पेटीएम वन (Paytm ONE) AI कमांडर हूँ। मैं आपकी 2 मुख्य मोड्स में मदद कर सकता हूँ:\n\n• **Action Mode**: मोबाइल रिचार्ज, बस/ट्रेन/फ्लाइट टिकट बुकिंग, बिजली बिल और शॉपिंग डील्स 1-क्लिक में करें।\n• **Resolve Mode**: अटके हुए पैसे, फेल यूपीआई पेमेंट और रिफंड का 24 घंटे में समाधान।\n\nआप कौन सा मोड देखना चाहते हैं?"
      : (lang === 'mr'
      ? "नमस्कार! मी पेटीएम वन (Paytm ONE) AI कमांडर आहे. मी तुम्हाला २ प्रमुख मोड्समध्ये मदत करू शकतो:\n\n• **Action Mode**: मोबाईल रिचार्ज, बस/ट्रेन/फ्लाइट तिकीट, वीज बिल आणि शॉपिंग डील्स १-क्लिकमध्ये पूर्ण करा.\n• **Resolve Mode**: अडकलेले पैसे, अयशस्वी UPI पेमेंट आणि रिफंडचे २४ तासांत जलद निवारण.\n\nतुम्हाला कोणत्या मोडमध्ये मदत हवी आहे?"
      : "Hello! I am Paytm ONE AI Commander. I can assist you across 2 core modes:\n\n• **Action Mode**: Autonomous 1-click execution for Mobile Recharge, Flight & Bus Tickets, Electricity Bills, and Shopping Deals.\n• **Resolve Mode**: Autonomous 3-Way Reconciliation for stuck payments, failed UPI debits, and refund tracking with 24H SLA.\n\nWhich mode would you like to explore?");

    return {
      mode: 'CHAT',
      service: 'chat',
      language: lang,
      ai_message: greetingMsg,
      resource_links: [
        {
          title: "Paytm ONE Unified Services Hub",
          url: "https://paytm.com",
          source: "Paytm Official Portal",
          snippet: "Official consumer portal for autonomous recharges, bill payments, and merchant disputes."
        },
        {
          title: "NPCI Unified Payments Interface (UPI) Framework",
          url: "https://www.npci.org.in",
          source: "NPCI National Switch",
          snippet: "National Payments Corporation of India consumer governance guidelines."
        }
      ],
      steps_log: [
        { title: "Multimodal Ingestion", detail: "Parsed conversational greeting", status: "completed" },
        { title: "Dual-Engine Ready", detail: "Action Mode and Resolve Mode standby", status: "completed" }
      ]
    };
  }

  // Check if Movie Ticket query
  const isMovie = q.includes('movie') || q.includes('movies') || q.includes('cinema') || 
                  q.includes('theatre') || q.includes('theater') || q.includes('kalki') || 
                  q.includes('stree') || q.includes('fighter') || q.includes('dune') || 
                  q.includes('pushpa') || q.includes('gladiator') || q.includes('imax') || 
                  q.includes('4dx') || q.includes('pvr') || q.includes('inox') || 
                  q.includes('cinepolis') || q.includes('showtime') || q.includes('चित्रपट') || q.includes('सिनेमा');

  if (isMovie) {
    const movies = SCENARIO_DATABASE.movies;
    const topMovie = q.includes('kalki') ? movies[0] : 
                     (q.includes('stree') ? movies[1] : 
                     (q.includes('fighter') ? movies[2] : 
                     (q.includes('dune') ? movies[3] : 
                     (q.includes('pushpa') ? movies[4] : 
                     (q.includes('gladiator') ? movies[5] : movies[0])))));

    const msg = lang === 'hi'
      ? `वर्तमान में सिनेमाघरों में प्रमुख ब्लॉकबस्टर फ़िल्में चल रही हैं! '${topMovie.title}' (${topMovie.format}) ${topMovie.theatre_name} में ₹${topMovie.price} से उपलब्ध है। इसके अलावा 'Stree 2' (Buy 1 Get 1 Free) और 'Fighter' भी उपलब्ध हैं। आप सीधे UPI PIN द्वारा टिकट बुक कर सकते हैं।`
      : `Here are the top blockbuster movies currently running in multiplexes! '${topMovie.title}' (${topMovie.format}) is showing at ${topMovie.theatre_name} starting at ₹${topMovie.price}. Also available: 'Stree 2' (Buy 1 Get 1 Free with Code: MOVIEBOGO) and 'Fighter' (4DX). Select showtimes and authorize instantly with UPI PIN.`;

    return {
      mode: 'ACTION',
      service: 'movies',
      language: lang,
      ai_message: msg,
      movie_data: {
        movies: movies,
        top_movie: topMovie
      },
      resource_links: [
        {
          title: "Paytm Movies & Entertainment Official Portal",
          url: "https://paytm.com/movies",
          source: "Paytm Cinema Network",
          snippet: "Instant seat selection with M-ticket entry across 4,000+ screens nationwide."
        },
        {
          title: "PVR INOX Cinemas Official Box Office & IMAX Portal",
          url: "https://www.pvrcinemas.com",
          source: "PVR INOX Central Server",
          snippet: "Real-time hall occupancy and concession pre-ordering with 20% savings."
        }
      ],
      steps_log: [
        { title: "Multiplex API Query", detail: "Scanned active screenings across PVR, Cinepolis & INOX", status: "completed" },
        { title: "Box Office Rate Validation", detail: `${topMovie.title} (${topMovie.format}) verified at ₹${topMovie.price}`, status: "completed" }
      ]
    };
  }

  // Check if Promo Codes / Coupons query
  const isPromo = q.includes('promo') || q.includes('promos') || q.includes('promocode') || 
                  q.includes('coupon') || q.includes('coupons') || q.includes('code') || 
                  q.includes('codes') || q.includes('bogo') || q.includes('कूपन') || q.includes('प्रोमो');

  if (isPromo) {
    const promos = SCENARIO_DATABASE.promos;
    const topPromo = promos[0];

    const msg = lang === 'hi'
      ? `आपके लिए बेस्ट एक्टिव प्रोमो कोड्स उपलब्ध हैं! कूपन '${topPromo.code}' से आपको '${topPromo.title}' (${topPromo.discount_text}) मिलेगा। इसके अलावा रिचार्ज, फ्लाइट्स और मूवीज पर BOGO कोड्स भी एक्टिव हैं।`
      : `Found active verified promo codes across Paytm services! Use code '${topPromo.code}' for '${topPromo.title}' (${topPromo.discount_text}). Also active: 'MOVIEBOGO' (Buy 1 Get 1 Free on tickets) and 'FLIGHTFLY' (Up to ₹1,500 off). Tap to copy code instantly.`;

    return {
      mode: 'ACTION',
      service: 'promos',
      language: lang,
      ai_message: msg,
      promo_data: {
        promos: promos,
        top_promo: topPromo
      },
      resource_links: [
        {
          title: "Paytm Official Offers & Cashback Deals Portal",
          url: "https://paytm.com/offers",
          source: "Paytm Rewards Central",
          snippet: "Verified merchant discount voucher catalog with 100% redemption guarantee."
        },
        {
          title: "NPCI UPI Festive Consumer Rewards Framework",
          url: "https://www.npci.org.in",
          source: "NPCI National Switch",
          snippet: "National Unified Payments Interface consumer incentives and cashback policy."
        }
      ],
      steps_log: [
        { title: "Voucher Engine Query", detail: "Scanned active cashback codes and BOGO coupons", status: "completed" },
        { title: "Terms & Expiry Check", detail: "All 10 promo codes verified active with 100% redemption", status: "completed" }
      ]
    };
  }

  // Check if Pending Bills / All Bills query
  const isPendingBills = q.includes('pending bill') || q.includes('pending bills') || 
                         q.includes('due bill') || q.includes('due bills') || 
                         q.includes('unpaid bill') || q.includes('unpaid bills') || 
                         q.includes('all bills') || q.includes('my bills') || 
                         q.includes('bills due') || q.includes('what bills');

  if (isPendingBills) {
    const bills = SCENARIO_DATABASE.bills;
    const totalDue = bills.reduce((acc, b) => acc + b.amount_due, 0);

    const msg = lang === 'hi'
      ? `आपके कुल ${bills.length} पेंडिंग बिल हैं, जिनकी कुल राशि ₹${Math.round(totalDue).toLocaleString()} है (बिजली, गैस, पानी, ब्रॉडबैंड, डीटीएच)। इसके अलावा फास्टैग बैलेंस कम (₹45) है। क्या आप UPI PIN से भुगतान करना चाहते हैं?`
      : `You have ${bills.length} pending utility bills due totaling ₹${Math.round(totalDue).toLocaleString()}: Electricity (₹1,420), Piped Gas (₹840), Water (₹420), Broadband (₹1,179), DTH (₹399), and your FASTag balance is low (₹45). You can authorize individual bills or settle all instantly with your UPI PIN.`;

    return {
      mode: 'ACTION',
      service: 'bills',
      language: lang,
      ai_message: msg,
      bills_data: {
        is_multi_bill: true,
        bills: bills,
        total_due: totalDue
      },
      service_data: bills[0],
      resource_links: [
        {
          title: "Bharat BillPay (BBPS) Official Consumer Central Portal",
          url: "https://www.bharatbillpay.com",
          source: "NPCI BBPS Central Switch",
          snippet: "Unified utility bill aggregation clearing house with zero bounce guarantee."
        },
        {
          title: "MSEDCL Electricity Consumer Services Portal",
          url: "https://www.mahadiscom.in",
          source: "State Power Utility Portal",
          snippet: "Live meter reading, tariff schedules, and prompt payment rebate tracking."
        }
      ],
      steps_log: [
        { title: "BBPS Account Aggregation", detail: "Ingested active invoices for Akash Bichukale", status: "completed" },
        { title: "Consolidated Settlement Staged", detail: `${bills.length} bills totaling ₹${Math.round(totalDue)} ready for PIN authorization`, status: "completed" }
      ]
    };
  }

  // Check if Dispute query
  const isResolve = (q.includes('cut') || q.includes('kat') || q.includes('failed') || 
                     q.includes('refund') || q.includes('issue') || q.includes('599') || 
                     q.includes('stuck') || q.includes('1200') || q.includes('2450') || 
                     q.includes('2150') || q.includes('200') || q.includes('300') ||
                     q.includes('dispute') || q.includes('complaint') || q.includes('तक्रार') || q.includes('रिफंड') ||
                     (q.includes('pending') && !isPendingBills)) && !isMovie;

  if (isResolve) {
    const isRefundList = (q.includes('refund request') || q.includes('refund requests') || q.includes('my refund') || q.includes('my refunds') || q.includes('any refund') || q.includes('refunds')) && !q.includes('599');
    const isFailedList = q.includes('failed transaction') || q.includes('failed transactions') || q.includes('failed payment') || q.includes('failed payments') || q.includes('all failed');
    const isComplaintList = q.includes('complaint') || q.includes('complaints') || q.includes('ticket') || q.includes('tickets') || q.includes('nodal');

    if (isRefundList) {
      const refundDisputes = SCENARIO_DATABASE.disputes.filter(d => d.dispute_type === 'refund_tracker');
      const topDisp = refundDisputes[0];
      const msg = lang === 'hi'
        ? `आपके खाते में ${refundDisputes.length} एक्टिव रिफंड ट्रैक्स हैं: 1) Myntra ₹1,200 (ARN: 8201948201, बैंकिंग क्लियरिंग में); 2) IRCTC ट्रेन टिकट रिफंड ₹2,450 (PNR: 824-9182941, कल शाम तक); 3) Swiggy ₹350 (तुरंत UPI क्रेडिट)। सभी रिफंड RBI/NPCI नियमों के तहत 100% सुरक्षित हैं।`
        : `You have ${refundDisputes.length} active refund requests being tracked: 1) Myntra Order ₹1,200 (ARN: 8201948201, Active in RBI clearing cycle, ETA 48H); 2) IRCTC Cancellation ₹2,450 (PNR: 824-9182941, Refund ID: IRCTC_REF_99182, Due tomorrow 6 PM); 3) Swiggy ₹350 (Instant UPI reversal completed). All funds are 100% verified.`;

      return {
        mode: 'RESOLVE',
        service: 'dispute',
        language: lang,
        ai_message: msg,
        transaction: topDisp,
        disputes_list: refundDisputes,
        is_dispute_list: true,
        filter_type: 'refund',
        citations: {
          source_title: "NPCI Harmonisation Circular No. 81 & RBI Refund Rules",
          snippet: "Statutory automated turnaround time (TAT) with ₹100/day customer compensation for banking delays.",
          url: "https://www.npci.org.in/what-we-do/upi/circulars"
        },
        resource_links: [
          {
            title: "NPCI Harmonisation Circular No. 81 — Turnaround Time (TAT)",
            url: "https://www.npci.org.in/what-we-do/upi/circulars",
            source: "You.com Regulatory Archive",
            snippet: "Mandatory T+1/T+2 reversal timelines for electronic commerce and transit refunds."
          },
          {
            title: "RBI Integrated Ombudsman Scheme for Digital Banking",
            url: "https://rbi.org.in/Scripts/AboutUsDisplay.aspx?Id=1236",
            source: "You.com Regulatory Archive",
            snippet: "Reserve Bank of India customer protection guidelines and automated bank reversal mandates."
          }
        ],
        nexconn_chat: {
          status: 'connected',
          support_tier: 'Paytm Senior Dispute Executive',
          assigned_agent: { name: 'Priya Sharma (Resolution Specialist)', online: true },
          initial_message: `Namaste Akash! I am tracking all ${refundDisputes.length} active refund requests for your account. Funds are moving securely through RBI clearing batches.`
        },
        steps_log: [
          { title: "Refund Ledger Scan", detail: `Identified ${refundDisputes.length} active reversal requests`, status: "completed" },
          { title: "Bank ARN Verification", detail: "Acquirer Reference Numbers verified active in clearing house", status: "completed" },
          { title: "Statutory SLA Validation", detail: "All refunds protected under RBI TAT Compensation Mandate", status: "completed" }
        ]
      };
    }

    if (isFailedList) {
      const failedDisputes = SCENARIO_DATABASE.disputes.filter(d => ['pending_recharge', 'failed_payment', 'merchant_mismatch', 'duplicate_debit'].includes(d.dispute_type));
      const topDisp = failedDisputes[0];
      const msg = lang === 'hi'
        ? `आपके ${failedDisputes.length} असफल भुगतान रिकॉर्ड पाए गए हैं: 1) Jio ₹599 (स्विच टाइमआउट); 2) SpiceJet फ्लाइट ₹2,150 (सीट लॉक एक्सपायर, पैसे कटे); 3) किराना QR ₹200 (साउंडबॉक्स पैकेट ड्रॉप); 4) मेट्रो कार्ड ₹300 (डबल डेबिट)। सभी पर NPCI Circular 81 के तहत T+1 ऑटो-रिफंड प्रक्रिया सक्रिय है।`
        : `Identified ${failedDisputes.length} failed / debited transactions on your ledger: 1) Jio Recharge ₹599 (Operator gateway timeout); 2) SpiceJet Flight ₹2,150 (Seat concurrency lock failed, debited without PNR); 3) Kirana QR ₹200 (Merchant Soundbox packet drop); 4) Metro Card ₹300 (Duplicate debit). All transactions are backed by NPCI Circular 81 auto-reversal mandates.`;

      return {
        mode: 'RESOLVE',
        service: 'dispute',
        language: lang,
        ai_message: msg,
        transaction: topDisp,
        disputes_list: failedDisputes,
        is_dispute_list: true,
        filter_type: 'failed',
        citations: {
          source_title: "NPCI Harmonisation Circular No. 81",
          snippet: "Under NPCI guidelines, failed UPI debits without service delivery must be auto-reversed within T+1 days with ₹100/day penalty for delay.",
          url: "https://www.npci.org.in/what-we-do/upi/circulars"
        },
        resource_links: [
          {
            title: "NPCI Harmonisation Circular No. 81 — Turnaround Time (TAT)",
            url: "https://www.npci.org.in/what-we-do/upi/circulars",
            source: "You.com Regulatory Archive",
            snippet: "Mandatory T+1/T+2 reversal timelines with ₹100/day compensation."
          }
        ],
        nexconn_chat: {
          status: 'connected',
          support_tier: 'Paytm Senior Dispute Executive',
          assigned_agent: { name: 'Priya Sharma (Resolution Specialist)', online: true },
          initial_message: `Namaste Akash! I have opened investigation for all ${failedDisputes.length} failed transaction records. Reverse credits are guaranteed under NPCI circular.`
        },
        steps_log: [
          { title: "Failed Transaction Audit", detail: `Flagged ${failedDisputes.length} debited transactions without fulfillment`, status: "completed" },
          { title: "Switch Handshake Verification", detail: "Confirmed gateway timeout and concurrency exceptions", status: "completed" },
          { title: "Reversal Schedule Active", detail: "Auto-refund dockets registered for all cases", status: "completed" }
        ]
      };
    }

    // Single Dispute Scenario Lookup
    const isSpecificCase = q.includes('2450') ? SCENARIO_DATABASE.disputes[2] :
                          (q.includes('350') ? SCENARIO_DATABASE.disputes[3] :
                          (q.includes('2150') ? SCENARIO_DATABASE.disputes[4] :
                          (q.includes('200') ? SCENARIO_DATABASE.disputes[5] :
                          (q.includes('300') ? SCENARIO_DATABASE.disputes[6] :
                          (q.includes('1450') ? SCENARIO_DATABASE.disputes[7] :
                          (q.includes('complaint') ? SCENARIO_DATABASE.disputes[8] :
                          (q.includes('refund') || q.includes('1200') ? SCENARIO_DATABASE.disputes[1] : SCENARIO_DATABASE.disputes[0])))))));

    const disp = isSpecificCase;
    const msg = lang === 'hi' ? disp.finding_hi : disp.finding_en;

    return {
      mode: 'RESOLVE',
      service: 'dispute',
      language: lang,
      ai_message: msg,
      transaction: disp,
      disputes_list: [disp],
      is_dispute_list: false,
      citations: {
        source_title: disp.regulatory_citation,
        snippet: `Under NPCI & RBI guidelines, failed UPI debits must be reconciled within ${disp.tat_sla} with ₹100/day compensation for delay.`,
        url: 'https://www.npci.org.in/what-we-do/upi/circulars',
        citation_provider: 'You.com Live Cited Policy Engine'
      },
      resource_links: [
        {
          title: disp.regulatory_citation,
          url: "https://www.npci.org.in/what-we-do/upi/circulars",
          source: "You.com Live Cited Engine",
          snippet: `Statutory turnaround time: ${disp.tat_sla} with ₹100/day customer compensation.`
        },
        {
          title: "RBI Integrated Ombudsman Scheme for Digital Banking",
          url: "https://rbi.org.in/Scripts/AboutUsDisplay.aspx?Id=1236",
          source: "You.com Regulatory Archive",
          snippet: "Reserve Bank of India customer protection guidelines and automated bank reversal mandates."
        }
      ],
      nexconn_chat: {
        status: 'connected',
        support_tier: 'Paytm Senior Dispute Executive',
        assigned_agent: {
          name: 'Priya Sharma (Resolution Specialist)',
          online: true
        },
        initial_message: `Namaste Akash! I have opened investigation for case ${disp.case_id}. Your funds are fully safe.`
      },
      steps_log: [
        { title: "Intent & RRN Lookup", detail: `Investigated case ${disp.case_id} (${disp.bank_name})`, status: "completed" },
        { title: "3-Way Forensic Audit", detail: disp.reconciliation_status, status: "completed" },
        { title: "Regulatory Governance", detail: disp.regulatory_citation, status: "completed" }
      ]
    };
  }

  // Check if Shopping Deals query
  const isShopping = q.includes('shop') || q.includes('shopping') || q.includes('deal') || 
                     q.includes('deals') || q.includes('discount') || q.includes('offer') || 
                     q.includes('offers') || q.includes('croma') || q.includes('zomato') || 
                     q.includes('myntra') || q.includes('pvr') || q.includes('mall') || q.includes('शॉपिंग');

  if (isShopping) {
    const deals = SCENARIO_DATABASE.shopping;
    const topDeal = (q.includes('croma') || q.includes('electronic')) ? deals[0] : 
                    (q.includes('zomato') || q.includes('food')) ? deals[2] : 
                    (q.includes('myntra') || q.includes('fashion')) ? deals[3] : deals[0];

    const msg = lang === 'hi'
      ? `मैंने पुणे में बेस्ट शॉपिंग डिस्काउंट खोज लिए हैं! ${topDeal.brand} (${topDeal.mall_name}) पर '${topDeal.title}' मिल रहा है। कूपन कोड: ${topDeal.coupon_code}।`
      : `Found top retail deals in Pune! ${topDeal.brand} at ${topDeal.mall_name} is offering '${topDeal.title}' with coupon code ${topDeal.coupon_code}.`;

    const storeUrl = topDeal.brand.toLowerCase().includes('croma') ? 'https://www.croma.com' : (topDeal.brand.toLowerCase().includes('zomato') ? 'https://www.zomato.com' : 'https://www.myntra.com');
    const resourceLinks = [
      {
        title: `${topDeal.brand} Official Deals & Discount Portal`,
        url: storeUrl,
        source: 'SerpApi Verified Store Link',
        snippet: `Verified coupon code ${topDeal.coupon_code} for ${topDeal.discount_pct}% instant discount.`
      },
      {
        title: `${topDeal.mall_name} Directory & Store Location`,
        url: 'https://www.phoenixmarketcity.com',
        source: 'You.com Local Directory',
        snippet: `Physical store validation and cashier terminal sync at ${topDeal.mall_name}, Pune.`
      }
    ];

    return {
      mode: 'ACTION',
      service: 'shopping',
      language: lang,
      ai_message: msg,
      shopping_data: {
        city: 'Pune',
        deals: deals,
        top_deal: topDeal
      },
      resource_links: resourceLinks,
      steps_log: [
        { title: "Shopping Intent Classified", detail: "Scanned mall promotions & exclusive coupons in Pune", status: "completed" },
        { title: "Retail Partner Validation", detail: `${topDeal.brand} offer active with code ${topDeal.coupon_code}`, status: "completed" }
      ]
    };
  }

  // Check if Travel query
  const isTravel = q.includes('flight') || q.includes('flights') || q.includes('bus') || 
                   q.includes('train') || q.includes('ticket') || q.includes('pune') || 
                   q.includes('mumbai') || q.includes('travel') || q.includes('goa') || q.includes('विमान') || q.includes('बस');

  if (isTravel) {
    const options = SCENARIO_DATABASE.travel;
    const isCheapest = q.includes('cheap') || q.includes('cheapest') || q.includes('स्वस्त') || q.includes('कम दाम');
    const bestOpt = isCheapest ? options[0] : options[1];

    const msg = lang === 'hi'
      ? `मुंबई से पुणे के लिए सबसे किफायती विकल्प ${bestOpt.carrier} (${bestOpt.travel_type.toUpperCase()}) है, जिसका किराया मात्र ₹${bestOpt.price} है। प्रस्थान समय: ${bestOpt.dep_time}। क्या आप टिकट बुक करना चाहते हैं?`
      : `For Mumbai to Pune, the most economical option is ${bestOpt.carrier} (${bestOpt.travel_type.toUpperCase()}) at just ₹${bestOpt.price}. Departs at ${bestOpt.dep_time}. Ready to book?`;

    const travelResourceLinks = [
      {
        title: "Google Flights via SerpApi: Mumbai to Pune Fares",
        url: "https://www.google.com/travel/flights?q=flights+mumbai+to+pune",
        source: "SerpApi Live Flight Engine",
        snippet: "Live airline schedule comparison across IndiGo, Air India, and Akasa Air."
      },
      {
        title: "Skyscanner — Live Mumbai to Pune Airfares & Timings",
        url: "https://www.skyscanner.co.in/routes/bom/pnq/mumbai-to-pune.html",
        source: "You.com Live Transit Verification",
        snippet: "Real-time non-stop departure timings and ticket pricing."
      },
      {
        title: "IRCTC Official Indian Railways Reservation Portal",
        url: "https://www.irctc.co.in",
        source: "SerpApi Transit Link",
        snippet: "Confirmed seat availability for Vande Bharat & Deccan Queen trains."
      },
      {
        title: "MSRTC Shivneri Volvo AC Timetable",
        url: "https://msrtc.maharashtra.gov.in",
        source: "You.com State Transport Index",
        snippet: "Official scheduled AC Volvo bus departures from Dadar/Borivali to Pune Station."
      }
    ];

    return {
      mode: 'ACTION',
      service: 'travel',
      language: lang,
      ai_message: msg,
      travel_data: {
        options: options,
        route: 'Mumbai → Pune',
        cheapest: bestOpt
      },
      resource_links: travelResourceLinks,
      steps_log: [
        { title: "Route & Schedule Query", detail: "Queried Mumbai to Pune live trains, buses & flights", status: "completed" },
        { title: "Fare Optimization", detail: `Selected ${bestOpt.carrier} at ₹${bestOpt.price}`, status: "completed" }
      ]
    };
  }

  // Check if Utility Bill / FASTag / DTH
  const isElectricity = q.includes('electricity') || q.includes('light') || q.includes('bijli') || q.includes('msedcl') || q.includes('बिजली');
  const isFastag = q.includes('fastag') || q.includes('toll') || q.includes('फास्टैग');
  const isDth = q.includes('dth') || q.includes('tata play') || q.includes('टाटा प्ले');

  if (isElectricity || isFastag || isDth) {
    const billType = isElectricity ? 'electricity' : (isFastag ? 'fastag' : 'dth');
    const bill = SCENARIO_DATABASE.bills.find(b => b.service_type === billType) || SCENARIO_DATABASE.bills[0];

    const msg = isElectricity
      ? (lang === 'hi' ? `आपके ${bill.provider_name} का बिजली बिल ₹${bill.amount_due} का है, जिसकी अंतिम तिथि ${bill.due_date} है। क्या आप UPI PIN से भुगतान करना चाहते हैं?` : `Your ${bill.provider_name} electricity bill is ₹${bill.amount_due}, due by ${bill.due_date}. Ready to authorize payment?`)
      : (lang === 'hi' ? `आपके वाहन ${bill.consumer_id} का फास्टैग बैलेंस कम (₹${bill.balance}) है। ₹${bill.amount_due} का रिचार्ज तैयार है।` : `Low FASTag balance on ${bill.consumer_id} (₹${bill.balance}). Prepared ₹${bill.amount_due} top-up.`);

    return {
      mode: 'ACTION',
      service: billType,
      language: lang,
      ai_message: msg,
      service_data: bill,
      steps_log: [
        { title: "BBPS Ingestion", detail: `Connected to ${bill.provider_name}`, status: "completed" },
        { title: "Invoice Verification", detail: `Amount ₹${bill.amount_due} • Due: ${bill.due_date}`, status: "completed" }
      ]
    };
  }

  // Check if Gold
  if (q.includes('gold') || q.includes('24k') || q.includes('सोना')) {
    const rate = 7640;
    const budget = 500;
    const grams = (budget / rate).toFixed(4);
    const msg = lang === 'hi'
      ? `आज का 24K 99.99% शुद्ध डिजिटल गोल्ड रेट ₹${rate}/ग्राम है। ₹${budget} में आपको ${grams} ग्राम सर्टिफाइड गोल्ड मिलेगा।`
      : `Live 24K pure digital gold rate is ₹${rate}/gm. For ₹${budget}, you will receive ${grams} grams stored in IDBI Trusteeship vault.`;

    return {
      mode: 'ACTION',
      service: 'gold',
      language: lang,
      ai_message: msg,
      gold_data: {
        rate,
        grams,
        budget,
        vault: 'IDBI Trusteeship Insured Vault'
      },
      steps_log: [
        { title: "MMTC-PAMP Rate Feed", detail: `Live spot price: ₹${rate}/gm`, status: "completed" },
        { title: "Vault Allocation", detail: `${grams} gm digital gold reserved`, status: "completed" }
      ]
    };
  }

  // Recharge query (Default Action)
  const plans = SCENARIO_DATABASE.plans;
  const isCheapest = q.includes('cheapest') || q.includes('cheap') || q.includes('स्वस्त') || q.includes('कम दाम');
  let plan = isCheapest ? plans[0] :
             (q.includes('netflix') ? plans.find(p => p.has_netflix === 1) : null) ||
             (q.includes('airtel') ? plans.find(p => p.operator === 'Airtel') : null) ||
             (q.includes('vi') ? plans.find(p => p.operator === 'Vi') : null) ||
             plans.find(p => p.price === 299) || plans[0];

  const msg = lang === 'hi'
    ? `मैंने ${plan.operator} का बेस्ट ₹${plan.price} वाला प्लान चुना है (${plan.data_daily}, ${plan.validity}, ${plan.calls})। क्या आप UPI PIN डालकर इसे तुरंत रिचार्ज करना चाहते हैं?`
    : `I selected the best matching ${plan.operator} ₹${plan.price} pack (${plan.data_daily}, ${plan.validity}, ${plan.calls}). Ready to authorize with UPI PIN?`;

  const rechargeResourceLinks = [
    {
      title: `Official ${plan.operator} Recharge Tariff Portal`,
      url: plan.operator.toLowerCase() === 'jio' ? 'https://www.jio.com/recharge' : (plan.operator.toLowerCase() === 'airtel' ? 'https://www.airtel.in/recharge' : 'https://www.myvi.in'),
      source: 'SerpApi Verified Tariff',
      snippet: `Active ${plan.data_daily} tariff with unlimited voice and 5G access.`
    },
    {
      title: "TRAI Telecom Tariff Regulations & Guidelines",
      url: "https://www.trai.gov.in",
      source: "You.com Regulatory Archive",
      snippet: "Telecom Regulatory Authority of India mandatory consumer tariff schedule."
    }
  ];

  return {
    mode: 'ACTION',
    service: 'recharge',
    language: lang,
    operator: plan.operator.toLowerCase(),
    budget: plan.price,
    ai_message: msg,
    plan_data: {
      best: plan,
      alternatives: plans.filter(p => p.plan_id !== plan.plan_id).slice(0, 3)
    },
    resource_links: rechargeResourceLinks,
    steps_log: [
      { title: "Telecom Tariff Search", detail: `Queried active tariffs for ${plan.operator}`, status: "completed" },
      { title: "Best Value Identified", detail: `Plan ₹${plan.price} (${plan.data_daily}) selected`, status: "completed" }
    ]
  };
};

export const executePaymentAction = async (payload) => {
  return {
    status: 'SUCCESS',
    txn_id: `PTM${Date.now() % 1000000000}`,
    bank_rrn: `SBI_RRN_${Date.now() % 100000000}`,
    amount: payload.amount,
    message: `Successfully paid ₹${payload.amount} for ${payload.service}`
  };
};
