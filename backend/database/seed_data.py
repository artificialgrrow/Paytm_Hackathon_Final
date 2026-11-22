"""
Seed Data Script for Paytm AI Hub SQLite Database
Seeds realistic Indian telecom, travel, shopping, utility, and dispute forensic scenarios.
"""
import os
import sys

# Ensure repository root is on sys.path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.database.db_service import init_database, get_db_connection


def seed_database():
    init_database()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing data
    cursor.execute("DELETE FROM telecom_plans;")
    cursor.execute("DELETE FROM travel_tickets;")
    cursor.execute("DELETE FROM shopping_deals;")
    cursor.execute("DELETE FROM utility_bills;")
    cursor.execute("DELETE FROM movie_tickets;")
    cursor.execute("DELETE FROM promo_codes;")
    cursor.execute("DELETE FROM dispute_cases;")

    # =========================================================================
    # 1. TELECOM PLANS (Jio, Airtel, Vi, BSNL)
    # =========================================================================
    plans = [
        # Jio Plans
        ("jio-149", "Jio", 149, "14 Days", "1 GB / Day", "14 GB", "Unlimited Calls", "100 SMS / Day", "Jio 4G LTE", "Cheapest Jio Pack 🏷️", "JioTV, JioCloud", 0, 1, "₹10 Cashback", "Cheapest pocket-friendly 1GB daily data plan."),
        ("jio-198", "Jio", 198, "14 Days", "2 GB / Day", "28 GB", "Unlimited Calls", "100 SMS / Day", "True Unlimited 5G", "5G Booster 🚀", "JioTV, JioCinema", 0, 0, "₹15 Cashback", "Short validity 2GB daily data with True 5G speed."),
        ("jio-209", "Jio", 209, "22 Days", "1 GB / Day", "22 GB", "Unlimited Calls", "100 SMS / Day", "Jio 4G LTE", "Budget Daily 1GB", "JioTV, JioCinema", 0, 0, "₹15 Cashback", "Economical 22-day pack for regular browsing."),
        ("jio-239", "Jio", 239, "28 Days", "1.5 GB / Day", "42 GB", "Unlimited Calls", "100 SMS / Day", "Jio 4G / 5G", "Daily 1.5GB 📱", "JioTV, JioCinema", 0, 0, "₹20 Cashback", "Standard monthly 1.5GB/day recharge with free calling."),
        ("jio-299", "Jio", 299, "28 Days", "2 GB / Day", "56 GB", "Unlimited Calls", "100 SMS / Day", "True Unlimited 5G", "Best Value & 5G ⚡", "JioTV, JioCinema, JioCloud", 0, 0, "₹25 Cashback", "Flagship 2GB daily data pack with True Unlimited 5G data."),
        ("jio-349", "Jio", 349, "28 Days", "2.5 GB / Day", "70 GB", "Unlimited Calls", "100 SMS / Day", "True Unlimited 5G", "High Speed 2.5GB 🚀", "JioTV, JioCinema Premium", 0, 0, "₹30 Cashback", "Heavy streaming plan with 2.5GB daily data."),
        ("jio-398", "Jio", 398, "28 Days", "2 GB / Day", "56 GB", "Unlimited Calls", "100 SMS / Day", "True Unlimited 5G", "Netflix Pack 🎬", "Netflix (Basic Mobile), JioCinema", 1, 0, "₹35 Cashback", "Includes bundled Netflix Basic Mobile subscription for 28 days."),
        ("jio-857", "Jio", 857, "84 Days", "2 GB / Day", "168 GB", "Unlimited Calls", "100 SMS / Day", "True Unlimited 5G", "84-Day Saver 🎯", "Amazon Prime Video Mobile, JioCinema", 0, 0, "₹50 Cashback", "Quarterly 84-day saver pack with Amazon Prime Video included."),
        ("jio-3599", "Jio", 3599, "365 Days", "2.5 GB / Day", "912.5 GB", "Unlimited Calls", "100 SMS / Day", "True Unlimited 5G", "Annual 365 Days 👑", "JioCinema, JioTV, FanCode", 0, 0, "₹200 Cashback", "Full 1-year annual plan with unlimited 5G."),

        # Airtel Plans
        ("airtel-199", "Airtel", 199, "28 Days", "2 GB Total", "2 GB", "Unlimited Calls", "100 SMS / Day", "Airtel 4G", "Cheapest Airtel Calling 🏷️", "Wynk Music", 0, 1, "₹10 Cashback", "Cheapest 28-day validity pack with unlimited calling."),
        ("airtel-299", "Airtel", 299, "28 Days", "1.5 GB / Day", "42 GB", "Unlimited Calls", "100 SMS / Day", "Unlimited 5G Data", "Airtel Popular ⚡", "Airtel Xstream Play, Wynk", 0, 0, "₹20 Cashback", "Standard 1.5GB daily data with unlimited 5G access."),
        ("airtel-349", "Airtel", 349, "28 Days", "2 GB / Day", "56 GB", "Unlimited Calls", "100 SMS / Day", "Unlimited 5G Data", "Best 2GB Pack 🏆", "Airtel Xstream Play (20+ OTTs)", 0, 0, "₹25 Cashback", "Top-rated 2GB daily pack with access to 20+ OTT platforms."),
        ("airtel-399", "Airtel", 399, "28 Days", "2.5 GB / Day", "70 GB", "Unlimited Calls", "100 SMS / Day", "Unlimited 5G Data", "Extra 2.5GB + Disney+", "Disney+ Hotstar 3 Months, Xstream", 0, 0, "₹35 Cashback", "Heavy entertainment pack with 3 months Disney+ Hotstar."),
        ("airtel-839", "Airtel", 839, "84 Days", "2 GB / Day", "168 GB", "Unlimited Calls", "100 SMS / Day", "Unlimited 5G Data", "84-Day Long Term 🎯", "Disney+ Hotstar, Airtel Xstream", 0, 0, "₹50 Cashback", "Long-term 84-day pack with daily 2GB and free Hotstar."),

        # Vi (Vodafone Idea) Plans
        ("vi-199", "Vi", 199, "18 Days", "1 GB / Day", "18 GB", "Unlimited Calls", "100 SMS / Day", "Vi GIGAnet 4G", "Budget Starter 🏷️", "Vi Movies & TV", 0, 1, "₹10 Cashback", "Budget 1GB daily plan."),
        ("vi-299", "Vi", 299, "28 Days", "1.5 GB / Day + Night", "42 GB", "Unlimited Calls", "100 SMS / Day", "Vi GIGAnet 4G", "Hero Unlimited 🌙", "Binge All Night (12-6AM), Weekend Rollover", 0, 0, "₹25 Cashback", "Hero Binge pack: free unlimited night data + weekend data rollover."),
        ("vi-349", "Vi", 349, "28 Days", "2 GB / Day + Night", "56 GB", "Unlimited Calls", "100 SMS / Day", "Vi GIGAnet 4G", "Double Data Hero ⚡", "Binge All Night, Vi Movies", 0, 0, "₹30 Cashback", "2GB daily data with unlimited night surfing."),

        # BSNL Plans
        ("bsnl-107", "BSNL", 107, "35 Days", "3 GB Total", "3 GB", "200 Mins Calls", "None", "BSNL 3G/4G", "Lowest Price In India 🏷️", "BSNL Tunes", 0, 1, "₹5 Cashback", "Lowest priced long-validity SIM preservation pack."),
        ("bsnl-197", "BSNL", 197, "70 Days", "2 GB / Day (18 Days)", "36 GB", "Unlimited Calls (18 Days)", "100 SMS / Day", "BSNL 3G/4G", "70-Day Long Validity 📅", "Zing Music", 0, 0, "₹15 Cashback", "Super economical 70-day validity plan.")
    ]

    cursor.executemany("""
    INSERT INTO telecom_plans (
        plan_id, operator, price, validity, data_daily, total_data, calls, sms, network, badge, ott, has_netflix, is_cheapest, cashback, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, plans)

    # =========================================================================
    # 2. TRAVEL & TRANSIT TICKETS (Flights, Shivneri AC Buses, Trains)
    # =========================================================================
    tickets = [
        # Mumbai to Pune
        ("trav-mum-pun-flt1", "Mumbai", "Pune", "flight", "IndiGo 6E-442", "Airbus A320 Direct", "08:15 AM", "09:05 AM", "50 mins", 2250, "9 Seats Left", 0, 1, "Economy", "Flat ₹150 Cashback"),
        ("trav-mum-pun-flt2", "Mumbai", "Pune", "flight", "Air India AI-619", "Boeing 737 Express", "04:30 PM", "05:25 PM", "55 mins", 2480, "14 Seats Left", 0, 0, "Economy", "Flat ₹150 Cashback"),
        ("trav-mum-pun-bus1", "Mumbai", "Pune", "bus", "MSRTC Shivneri Volvo", "Multi-Axle AC Sleeper", "06:30 AM", "10:15 AM", "3h 45m", 480, "22 Seats Left", 1, 0, "AC Volvo", "Flat ₹50 Cashback"),
        ("trav-mum-pun-bus2", "Mumbai", "Pune", "bus", "Purple Metrolink", "Scania AC Semi-Sleeper", "02:00 PM", "05:45 PM", "3h 45m", 520, "18 Seats Left", 0, 0, "AC Semi-Sleeper", "Flat ₹50 Cashback"),
        ("trav-mum-pun-trn1", "Mumbai", "Pune", "train", "Vande Bharat Express (22225)", "Executive AC Chair Car", "06:05 AM", "09:15 AM", "3h 10m", 560, "Available (WL 0)", 0, 0, "CC", "Instant IRCTC Booking"),
        ("trav-mum-pun-trn2", "Mumbai", "Pune", "train", "Deccan Queen Superfast (12123)", "AC Chair Car", "05:10 PM", "08:25 PM", "3h 15m", 380, "Available (RAC 5)", 1, 0, "CC", "Instant IRCTC Booking"),

        # Pune to Mumbai
        ("trav-pun-mum-flt1", "Pune", "Mumbai", "flight", "IndiGo 6E-443", "Airbus A320 Direct", "09:40 AM", "10:30 AM", "50 mins", 2199, "6 Seats Left", 0, 1, "Economy", "Flat ₹150 Cashback"),
        ("trav-pun-mum-bus1", "Pune", "Mumbai", "bus", "MSRTC Shivneri Volvo", "Multi-Axle AC Executive", "07:00 AM", "10:45 AM", "3h 45m", 480, "25 Seats Left", 1, 0, "AC Volvo", "Flat ₹50 Cashback"),
        ("trav-pun-mum-trn1", "Pune", "Mumbai", "train", "Vande Bharat Express (22226)", "AC Chair Car", "03:15 PM", "06:25 PM", "3h 10m", 560, "Available", 0, 0, "CC", "Instant IRCTC Booking"),

        # Pune to Goa
        ("trav-pun-goa-flt1", "Pune", "Goa", "flight", "IndiGo 6E-871", "Airbus A321 Non-Stop", "11:20 AM", "12:25 PM", "1h 05m", 2850, "12 Seats Left", 0, 1, "Economy", "Flat ₹200 Cashback"),
        ("trav-pun-goa-flt2", "Pune", "Goa", "flight", "SpiceJet SG-1042", "Boeing 737 Direct", "07:15 PM", "08:30 PM", "1h 15m", 2690, "4 Seats Left", 1, 0, "Economy", "Flat ₹200 Cashback"),
        ("trav-pun-goa-bus1", "Pune", "Goa", "bus", "Paulo Travels Volvo", "Multi-Axle AC Sleeper 2+1", "08:30 PM", "06:30 AM", "10h 00m", 850, "15 Berths Left", 1, 0, "AC Sleeper", "Flat ₹75 Cashback"),
        ("trav-pun-goa-bus2", "Pune", "Goa", "bus", "IntrCity SmartBus", "AC Bharat Benz Sleeper", "09:45 PM", "07:30 AM", "9h 45m", 920, "8 Berths Left", 0, 0, "AC Sleeper", "Flat ₹75 Cashback"),

        # Mumbai to Delhi
        ("trav-mum-del-flt1", "Mumbai", "Delhi", "flight", "Akasa Air QP-1102", "Boeing 737 Max Non-Stop", "06:00 AM", "08:15 AM", "2h 15m", 3850, "18 Seats Left", 1, 1, "Economy", "Flat ₹250 Cashback"),
        ("trav-mum-del-flt2", "Mumbai", "Delhi", "flight", "Air India AI-806", "Boeing 777 Widebody", "01:30 PM", "03:45 PM", "2h 15m", 4120, "22 Seats Left", 0, 0, "Economy", "Flat ₹250 Cashback"),
        ("trav-mum-del-trn1", "Mumbai", "Delhi", "train", "August Kranti Rajdhani (12953)", "AC 3-Tier (3A)", "05:10 PM", "10:55 AM", "17h 45m", 2150, "Available (Confirmed)", 1, 0, "3A", "Instant IRCTC Booking"),
        ("trav-mum-del-trn2", "Mumbai", "Delhi", "train", "Mumbai Tejas Rajdhani (12951)", "AC 2-Tier (2A)", "05:00 PM", "08:32 AM", "15h 32m", 2980, "Available (Confirmed)", 0, 1, "2A", "Instant IRCTC Booking"),

        # Delhi to Mumbai
        ("trav-del-mum-flt1", "Delhi", "Mumbai", "flight", "IndiGo 6E-2051", "Airbus A321 Non-Stop", "07:00 AM", "09:15 AM", "2h 15m", 3790, "15 Seats Left", 1, 1, "Economy", "Flat ₹250 Cashback"),
        ("trav-del-mum-trn1", "Delhi", "Mumbai", "train", "Tejas Rajdhani Express (12952)", "AC 3-Tier (3A)", "04:55 PM", "08:35 AM", "15h 40m", 2150, "Available", 1, 0, "3A", "Instant IRCTC Booking")
    ]

    cursor.executemany("""
    INSERT INTO travel_tickets (
        ticket_id, from_city, to_city, travel_type, carrier, service_name, dep_time, arr_time, duration, price, seats, is_cheapest, is_fastest, class_type, cashback
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, tickets)

    # =========================================================================
    # 3. SHOPPING DEALS & RETAIL MALLS
    # =========================================================================
    deals = [
        # Pune Deals
        ("deal-pun-croma-01", "electronics", "Pune", "Croma Megastore", "Phoenix Marketcity Viman Nagar", "Flat ₹2,000 Off on Smart TVs & Laptops", 25, "CROMA2000", 15000, "Paytm Exclusive 🏷️", "30 Nov 2026", "Valid on Paytm UPI scanning at Phoenix Marketcity Croma billing desk."),
        ("deal-pun-rel-02", "electronics", "Pune", "Reliance Digital", "Seasons Mall Magarpatta", "Instant 10% Cashback on 5G Smartphones", 10, "RELIANCE10", 10000, "Smartphone Deal 📱", "05 Dec 2026", "Available on Samsung, OnePlus, and Apple devices with Paytm Payments Bank."),
        ("deal-pun-zom-03", "food", "Pune", "Zomato Dining", "FC Road & Koregaon Park", "Flat 50% Off up to ₹150 on Food Delivery", 50, "PAYTM50", 299, "Super Saver 🍔", "31 Dec 2026", "Use code PAYTM50 on online order or restaurant dining payment."),
        ("deal-pun-myn-04", "fashion", "Pune", "Myntra", "Westend Mall Aundh", "Extra 30% Off on Winter Fashion & Jackets", 30, "MYNTRA30", 1499, "Winter Trend 👗", "15 Dec 2026", "Valid across all top apparel brands with Paytm UPI checkout."),
        ("deal-pun-pvr-05", "entertainment", "Pune", "PVR INOX Cinemas", "Pavilion Mall Senapati Bapat Road", "Buy 1 Get 1 Free on Movie Tickets", 50, "PVRPAYTM", 350, "BOGO Offer 🎬", "31 Dec 2026", "Applicable on weekend movie screenings booked through Paytm."),

        # Mumbai Deals
        ("deal-mum-croma-01", "electronics", "Mumbai", "Croma Megastore", "High Street Phoenix Lower Parel", "Up to ₹5,000 Exchange Bonus on iPhones", 20, "CROMAMUM5K", 25000, "Mega Exchange 📱", "10 Dec 2026", "Special exchange offer at Lower Parel flagship store."),
        ("deal-mum-lifestyle-02", "fashion", "Mumbai", "Lifestyle Stores", "Inorbit Mall Malad", "Flat ₹750 Off on Purchase of ₹2,999", 25, "LIFESTYLE750", 2999, "Fashion Haul 👗", "15 Dec 2026", "Instant discount applied at cashier scan."),
        ("deal-mum-swig-03", "food", "Mumbai", "Swiggy Gourmet", "Bandra & BKC", "Flat 40% Off on Premium Cafes & Bakeries", 40, "SWIGGY40", 499, "Foodie Delight 🍕", "31 Dec 2026", "Valid for Bandra and BKC orders paid via Paytm UPI."),
        ("deal-mum-pvr-04", "entertainment", "Mumbai", "PVR Cinemas IMAX", "Phoenix Palladium Mumbai", "₹100 Off on IMAX Ticket Bookings", 15, "IMAXPAYTM", 600, "IMAX Experience 🍿", "31 Dec 2026", "Discount valid on morning & evening IMAX shows."),

        # Delhi Deals
        ("deal-del-croma-01", "electronics", "Delhi", "Croma Megastore", "Select Citywalk Saket", "Flat 15% Instant Off on Home Appliances", 15, "SAKET15", 8000, "Home Makeover ❄️", "20 Dec 2026", "Valid on ACs, Refrigerators, and Washing Machines."),
        ("deal-del-haldiram-02", "food", "Delhi", "Haldiram's", "Connaught Place CP", "10% Cashback on All Sweets & Thali", 10, "HALDIRAM10", 300, "Dilli Ka Khana 🍛", "31 Dec 2026", "Pay using Paytm QR at CP store.")
    ]

    cursor.executemany("""
    INSERT INTO shopping_deals (
        deal_id, category, city, brand, mall_name, title, discount_pct, coupon_code, min_spend, badge, valid_until, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, deals)

    # =========================================================================
    # 4. UTILITY BILLS & FASTAG (BBPS Certified) - Full Suite for User
    # =========================================================================
    bills = [
        ("bill-elec-msedcl", "electricity", "Maharashtra State Electricity Distribution Co. (MSEDCL)", "002948192841", "Akash Bichukale", 1420.0, "28 Nov 2026", "184 kWh", 0.0, "DUE", "Flat ₹50 Cashback on Paytm UPI"),
        ("bill-gas-mgl", "gas", "Mahanagar Gas Limited (MGL Piped Natural Gas)", "MGL-992019482", "Akash Bichukale", 840.0, "30 Nov 2026", "24 SCM", 0.0, "DUE", "Flat ₹30 Cashback"),
        ("bill-water-pmc", "water", "Pune Municipal Corporation (PMC Water Dept)", "PMC-WTR-48192", "Akash Bichukale", 420.0, "05 Dec 2026", "15,000 Litres", 0.0, "DUE", "Zero Gateway Convenience Fee"),
        ("bill-bb-jiofiber", "broadband", "JioFiber 100 Mbps Unlimited Home Broadband", "020-49182941", "Akash Bichukale", 1179.0, "01 Dec 2026", "Unlimited High Speed", 0.0, "DUE", "Free 14 OTT Apps Bundle"),
        ("bill-fastag-car1", "fastag", "NETC NHAI National Electronic Toll (Paytm FASTag)", "MH 12 AB 1234", "Akash Bichukale", 500.0, "Instant Top-Up", "N/A", 45.0, "LOW_BALANCE", "Flat ₹25 Cashback on Highways"),
        ("bill-dth-tataplay", "dth", "Tata Play DTH Satellite Television", "1092837482", "Akash Bichukale", 399.0, "25 Nov 2026", "185 Channels + Free Binge OTT", 0.0, "DUE", "Flat ₹30 Cashback on Recharge"),
        ("bill-elec-adani", "electricity", "Adani Electricity Mumbai Limited", "102938475", "Suresh Deshmukh", 1850.0, "02 Dec 2026", "230 kWh", 0.0, "DUE", "Flat ₹75 Cashback on Paytm UPI")
    ]

    cursor.executemany("""
    INSERT INTO utility_bills (
        bill_id, service_type, provider_name, consumer_id, consumer_name, amount_due, due_date, units_consumed, balance, status, cashback
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, bills)

    # =========================================================================
    # 5. MOVIE TICKETS & ENTERTAINMENT (Current Blockbusters & Multiplexes)
    # =========================================================================
    movies = [
        (
            "mov-kalki-pun-01", "Kalki 2898 AD", "Sci-Fi / Action / Mythology", "Hindi / Telugu", "8.9/10 IMDb • UA 16+",
            "PVR INOX Phoenix Marketcity Viman Nagar", "Pune",
            "10:15 AM, 01:45 PM, 05:30 PM, 09:15 PM", "IMAX 3D", 450,
            "Filling Fast (14 Seats Left)", "/assets/movies/kalki.jpg",
            "Flat ₹75 Cashback with Paytm UPI", "20% Off on Large Popcorn & Beverage Combo",
            "Epic dystopian science-fiction spectacle directed by Nag Ashwin starring Amitabh Bachchan, Kamal Haasan, Prabhas, and Deepika Padukone."
        ),
        (
            "mov-stree2-pun-02", "Stree 2: Sarkate Ka Aatank", "Horror / Comedy", "Hindi", "8.6/10 IMDb • UA",
            "Cinepolis Seasons Mall Magarpatta", "Pune",
            "11:00 AM, 02:15 PM, 06:00 PM, 09:45 PM", "Dolby Atmos 2D", 320,
            "Available (48 Seats Left)", "/assets/movies/stree2.jpg",
            "Buy 1 Get 1 Free on Paytm Movies (Code: MOVIEBOGO)", "Free Salted Popcorn on Ticket Pair",
            "Chanderi town faces a headless menace as Stree returns in this horror-comedy blockbuster starring Rajkummar Rao and Shraddha Kapoor."
        ),
        (
            "mov-fighter-pun-03", "Fighter", "Action / Thriller", "Hindi", "8.2/10 IMDb • UA 16+",
            "PVR ICON Pavilion Senapati Bapat Road", "Pune",
            "12:30 PM, 04:15 PM, 08:00 PM", "4DX 3D", 490,
            "Filling Fast (8 Seats Left)", "/assets/movies/fighter.jpg",
            "Flat ₹50 Instant Discount", "15% Off Nachos & Cheese Combo",
            "India's premier air combat action film directed by Siddharth Anand, featuring aerial dogfights with Hrithik Roshan and Deepika Padukone."
        ),
        (
            "mov-dune2-mum-04", "Dune: Part Two", "Sci-Fi / Adventure", "English", "9.1/10 IMDb • UA",
            "PVR INOX IMAX High Street Phoenix Lower Parel", "Mumbai",
            "11:30 AM, 03:45 PM, 07:30 PM, 11:15 PM", "IMAX Laser 70mm", 650,
            "Selling Out Fast (6 Seats Left)", "/assets/movies/dune2.jpg",
            "Exclusive ₹100 Off with Paytm UPI", "Complimentary Gourmet Caramel Popcorn",
            "Denis Villeneuve's Oscar-winning visual masterwork following Paul Atreides' mythic journey across Arrakis."
        ),
        (
            "mov-pushpa2-mum-05", "Pushpa 2: The Rule", "Action / Drama", "Hindi / Telugu", "Expected 9.0/10 • UA",
            "Cinepolis Fun Republic Andheri West", "Mumbai",
            "10:00 AM, 01:30 PM, 05:00 PM, 08:30 PM, 11:59 PM", "Dolby Atmos 2D", 380,
            "Advance Booking Open (120 Seats Left)", "/assets/movies/pushpa2.jpg",
            "₹50 Cashback on Pre-booking", "Special Pushpa Commemorative Merchandise",
            "Allu Arjun returns as Pushpa Raj in the colossal clash against Bhanwar Singh Shekhawat."
        ),
        (
            "mov-glad2-pun-06", "Gladiator II", "Epic / Action / Historical", "English / Hindi", "8.4/10 IMDb • A",
            "INOX Nariman Point & Pavilion Mall", "Pune",
            "01:00 PM, 04:30 PM, 08:15 PM", "Insignia Luxe Recliner", 550,
            "Available (22 Recliners Left)", "/assets/movies/gladiator2.jpg",
            "Flat 20% Off on Paytm Luxe", "Chef-curated in-seat fine dining service",
            "Ridley Scott's Roman colosseum sequel starring Paul Mescal, Pedro Pascal, and Denzel Washington."
        )
    ]

    cursor.executemany("""
    INSERT INTO movie_tickets (
        movie_id, title, genre, language, rating, theatre_name, city, showtimes, format, price, seats_available, poster_banner, cashback, snack_offer, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, movies)

    # =========================================================================
    # 6. PROMO CODES & EXCLUSIVE CASHBACK OFFERS
    # =========================================================================
    promos = [
        ("PAYTMJIO50", "recharge", "Jio Recharge Mega Cashback", "Flat ₹50 Instant Cashback", 50, 666, "31 Dec 2026", "Valid on Jio 84-day or annual prepaid recharges via Paytm UPI.", "Trending 🔥"),
        ("AIRTEL30", "recharge", "Airtel 5G Booster Discount", "Flat ₹30 Off on 2GB/Day Plans", 30, 299, "31 Dec 2026", "Applicable on Airtel prepaid packs of ₹299 and above.", "Popular 📱"),
        ("FLIGHTFLY", "travel", "Domestic Flight Booking Bonanza", "Up to ₹1,500 Instant Discount", 1500, 3000, "15 Jan 2027", "Valid on IndiGo, Air India, and Akasa Air domestic flight tickets.", "Super Saver ✈️"),
        ("BUSNEW", "travel", "Intercity Bus Booking Offer", "Flat 20% Cashback up to ₹150", 150, 400, "31 Dec 2026", "Valid on MSRTC Shivneri, Purple Travels, and Zingbus bookings.", "Top Choice 🚌"),
        ("RAILZERO", "travel", "IRCTC Confirmed Train Booking", "Zero Payment Gateway & Convenience Fee", 40, 200, "31 Dec 2026", "Save PG charges on all IRCTC AC Chair Car and Sleeper tickets.", "Zero Fee 🚆"),
        ("MOVIEBOGO", "movies", "PVR INOX Buy 1 Get 1 Free", "Buy 1 Movie Ticket, Get 1 Free", 350, 350, "31 Dec 2026", "Applicable on Friday to Sunday screenings across all PVR & INOX screens.", "BOGO Free 🎬"),
        ("IMAX100", "movies", "IMAX Experience Discount", "Flat ₹100 Off on IMAX 3D Tickets", 100, 450, "31 Dec 2026", "Valid on Kalki 2898 AD and Dune: Part Two in IMAX multiplexes.", "IMAX Deal 🍿"),
        ("BIJLI50", "bills", "Electricity Bill Payment Cashback", "Flat ₹50 Cashback on Power Bills", 50, 1000, "31 Dec 2026", "Valid on MSEDCL, Adani, Tata Power, and BESCOM electricity payments.", "Bill Saver 💡"),
        ("ZOMATO50", "food", "Zomato Dining & Delivery", "50% Off up to ₹100 on Food", 100, 199, "31 Dec 2026", "Pay using Paytm UPI QR or in-app checkout at 10,000+ restaurants.", "Foodie 🍔"),
        ("GOLD24K", "shopping", "MMTC-PAMP Digital Gold Offer", "Get Extra 1% Free 24K Pure Gold", 50, 1000, "31 Dec 2026", "Free gold grams credited instantly to your insured vault.", "Gold Bonus 🪙")
    ]

    cursor.executemany("""
    INSERT INTO promo_codes (
        code, category, title, discount_text, discount_amount, min_spend, valid_until, terms, badge
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, promos)

    # =========================================================================
    # 7. FORENSIC DISPUTE CASES (3-Way Reconciliation & NPCI Resolution)
    # =========================================================================
    disputes = [
        # Scenario 1: Pending Telecom Recharge (Timeout during switch handoff)
        (
            "DISP_CASE_01", "PTM7890124", "paytm_user_01", "pending_recharge", 599.0,
            "Jio Prepaid Recharge (84 Days)", "State Bank of India", "SBI_RRN_9820194812",
            "PENDING_AT_SWITCH",
            "Discrepancy: Debited from SBI, Jio Switch Timed Out during Token Exchange",
            "Amount of ₹599 debited from your SBI account but timed out at the telecom switch. Under NPCI Harmonisation Circular No. 81, automated reversal will credit by tomorrow 10:14 AM.",
            "तुमच्या SBI खात्यातून ₹599 कट झाले आहेत, परंतु ऑपरेटरच्या सर्व्हरवर नेटवर्क टाइमआउट झाला आहे. NPCI परिपत्रक क्र. 81 नुसार उद्या सकाळी 10:14 पर्यंत रक्कम आपोआप परत जमा होईल.",
            "NPCI Harmonisation Circular No. 81 (T+1 SLA with ₹100/day compensation)",
            "T+1 Business Days (By Tomorrow, 10:14 AM IST)", 1
        ),
        # Scenario 2: Active E-Commerce Refund in Banking Clearing
        (
            "DISP_CASE_02", "PTM1200984", "paytm_user_01", "refund_tracker", 1200.0,
            "E-Commerce Order Cancellation (Myntra)", "HDFC Bank", "HDFC_RRN_4810294819",
            "CLEARING_CYCLE_ACTIVE",
            "Merchant Initiated Refund (ARN: 8201948201) • Funds Active in Bank Clearing",
            "Merchant has successfully approved and sent ₹1,200 refund with Acquirer Reference Number (ARN: 8201948201). Currently in RBI clearing house settlement.",
            "व्यापाऱ्याने ₹1,200 चा रिफंड मंजूर केला असून ARN क्र. 8201948201 जारी केला आहे. सध्या रक्कम बँकिंग क्लिअरिंग सायकलमध्ये आहे.",
            "RBI Payment System Circular Section 10(2)",
            "Within 48 Hours to Source Account", 0
        ),
        # Scenario 3: IRCTC Train Ticket Cancellation Refund
        (
            "DISP_CASE_03", "PTM2450891", "paytm_user_01", "refund_tracker", 2450.0,
            "IRCTC Train Ticket Cancellation (PNR: 824-9182941)", "State Bank of India", "SBI_RRN_1928301928",
            "REFUND_PROCESSED_BY_IRCTC",
            "IRCTC Approved Refund ID: IRCTC_REF_99182 • Scheduled Bank Settlement",
            "IRCTC cancellation refund of ₹2,450 successfully processed under Refund ID IRCTC_REF_99182. Funds are currently in the inter-bank NEFT batch and will credit your SBI account by tomorrow 06:00 PM.",
            "IRCTC ने ₹2,450 चा रिफंड मंजूर केला आहे (रिफंड आयडी: IRCTC_REF_99182). उद्या संध्याकाळी ६ वाजेपर्यंत SBI खात्यात जमा होईल.",
            "Indian Railways Citizen Charter & RBI Compensation Rules",
            "T+2 Business Days (By Tomorrow, 06:00 PM IST)", 0
        ),
        # Scenario 4: Food Delivery Cancelled Order Instant Refund
        (
            "DISP_CASE_04", "PTM3501928", "paytm_user_01", "refund_tracker", 350.0,
            "Swiggy Order Cancellation (#SWG-9948)", "ICICI Bank", "ICICI_RRN_8910293847",
            "INSTANT_REFUND_COMPLETED",
            "Swiggy Reversal Confirmed via Immediate UPI Refund Rail",
            "Swiggy restaurant cancellation of ₹350 has been reversed back to your ICICI Bank account via real-time UPI refund rail. Bank balance has been updated.",
            "स्विगी ऑर्डर रद्द झाल्यामुळे ₹350 चा इन्स्टंट रिफंड थेट तुमच्या ICICI खात्यात यशस्वीरीत्या जमा झाला आहे.",
            "NPCI Real-Time Instant UPI Refund Mandate",
            "Instant (Already Credited)", 0
        ),
        # Scenario 5: Flight Booking Concurrency Lock Failure
        (
            "DISP_CASE_05", "PTM4829104", "paytm_user_01", "failed_payment", 2150.0,
            "SpiceJet Mumbai to Pune Flight Booking", "HDFC Bank", "HDFC_RRN_9910283741",
            "AIRLINE_LOCK_FAILED",
            "Seat Lock Expired during Gateway Handoff • Money Debited without PNR",
            "₹2,150 was debited from HDFC Bank, but SpiceJet's reservation inventory expired before ticket issuance. PNR was not generated. Automated full reversal initiated under DGCA passenger charter.",
            "HDFC खात्यातून ₹2,150 कट झाले पण सीट बुक झाली नाही. DGCA नियमानुसार संपूर्ण रक्कम स्वयंचलित रिफंड प्रक्रियेत आहे.",
            "DGCA Passenger Charter Rule 3.2 & RBI Mandate",
            "T+1 Day Reversal (Within 24 Hours)", 1
        ),
        # Scenario 6: Local Kirana Store QR Soundbox Timeout
        (
            "DISP_CASE_06", "PTM8819203", "paytm_user_01", "merchant_mismatch", 200.0,
            "Sharma Kirana Store (QR Payment)", "State Bank of India", "SBI_RRN_1092837481",
            "SOUNDBOX_NETWORK_LAG",
            "Debited from Bank • Merchant 4G Soundbox Lagged due to Cellular Packet Drop",
            "₹200 was deducted from your bank, but the merchant's 4G Soundbox experienced packet drop. Funds are safely frozen in NPCI Escrow and cannot be lost. Reversal queued or manual merchant settlement verified.",
            "तुमच्या खात्यातून ₹200 कट झाले, पण दुकानदाराच्या साउंडबॉक्सला नेटवर्क लॅगमुळे ऑडिओ आला नाही. रक्कम NPCI एस्क्रोमध्ये सुरक्षित आहे.",
            "NPCI UPI Merchant Dispute Framework 2024",
            "Auto-Reversal within 2 Hours", 1
        ),
        # Scenario 7: Duplicate Debit on Metro Smart Card Top-up
        (
            "DISP_CASE_07", "PTM5519281", "paytm_user_01", "duplicate_debit", 300.0,
            "Metro Smart Card Automatic Top-Up", "ICICI Bank", "ICICI_RRN_7819203847",
            "DOUBLE_DEBIT_MATCHED",
            "Duplicate Debit Detected: Two identical ₹300 charges within 30 seconds",
            "Our automated fraud & audit engine detected duplicate debits of ₹300. The second charge has been flagged and queued for instant reversal back to your ICICI Bank account.",
            "आमच्या सिस्टीमने 30 सेकंदांत दोनदा ₹300 कट झाल्याचे शोधले आहे. दुसऱ्या व्यवहाराचा ऑटो-रिफंड सुरू केला आहे.",
            "RBI Customer Protection Guidelines 2024",
            "T+1 Day Automated Bank Credit", 1
        ),
        # Scenario 8: Pending Utility Bill Sync at BBPS
        (
            "DISP_CASE_08", "PTM1450284", "paytm_user_01", "bill_unpaid", 1450.0,
            "MSEDCL Electricity BBPS Payment", "Bank of Baroda", "BOB_RRN_5918293847",
            "BBPS_SETTLEMENT_PENDING",
            "Cleared by Bharat BillPay Hub • Utility Biller ERP Sync Pending",
            "Payment of ₹1,450 cleared successfully through NPCI Bharat BillPay. MSEDCL utility portal takes up to 24 hours to sync receipt and update bill status to PAID.",
            "₹1,450 चे पेमेंट भारत बिलपे द्वारे यशस्वी झाले आहे. महावितरणच्या सिस्टीममध्ये बिल अपडेट होण्यास साधारण 24 तास लागतात.",
            "Bharat Bill Payment System (BBPS) Dispute Resolution Mechanism",
            "24 Hours Biller ERP Update Guarantee", 0
        ),
        # Scenario 9: Formal Escalated Complaint to Nodal Officer
        (
            "DISP_CASE_09", "COMP_2026_0941", "paytm_user_01", "formal_complaint", 599.0,
            "Nodal Officer Escalation (Delayed Recharge)", "State Bank of India", "SBI_RRN_9820194812",
            "ESCALATED_TO_NODAL_OFFICER",
            "Formal Dispute Docket Sealed with SHA-256 • Assigned to Mr. Rajesh Sharma",
            "Official complaint docket COMP_2026_0941 has been registered with SHA-256 evidence sealing. Assigned to Senior Dispute Officer Mr. Rajesh Sharma for priority resolution within 12 hours.",
            "अधिकृत तक्रार COMP_2026_0941 नोंदवली गेली आहे. वरिष्ठ नोडल अधिकारी श्री. राजेश शर्मा यांच्याकडे तात्काळ निवारणासाठी वर्ग करण्यात आली आहे.",
            "RBI Banking Ombudsman Scheme 2021",
            "12 Hours Dedicated SLA", 1
        ),
        # Scenario 10: Formal Airline Carrier Dispute Escalation
        (
            "DISP_CASE_10", "COMP_2026_1120", "paytm_user_01", "formal_complaint", 2150.0,
            "Aviation Consumer Grievance (SpiceJet Flight)", "HDFC Bank", "HDFC_RRN_9910283741",
            "DGCA_ESCALATION_ACTIVE",
            "Formal Air Passenger Dispute Filed under DGCA Rule 3.2",
            "Aviation complaint COMP_2026_1120 forwarded to carrier nodal desk with bank debit certificate. Full refund + statutory cancellation compensation requested.",
            "विमान प्रवाशांच्या तक्रारीनुसार COMP_2026_1120 नोंदवली असून संपूर्ण परताव्याची मागणी एअरलाइन्सकडे केली आहे.",
            "DGCA Air Passenger Charter Section 3",
            "24 Hours Airline Action SLA", 1
        )
    ]

    cursor.executemany("""
    INSERT INTO dispute_cases (
        case_id, txn_id, user_id, dispute_type, amount, service_name, bank_name, bank_rrn, status, reconciliation_status, finding_en, finding_hi, regulatory_citation, tat_sla, compensation_eligible
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, disputes)

    conn.commit()
    conn.close()
    print("Successfully seeded Paytm AI Hub SQLite Database with 100+ scenarios!")


if __name__ == "__main__":
    seed_database()
