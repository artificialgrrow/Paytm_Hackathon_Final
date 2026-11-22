"""
Paytm ONE Comprehensive Multi-Scenario Test Suite
Validates top 10+ end-to-end user query variations across Action Mode and Resolve Mode.
Checks Mode, Service, AI narrative formatting, payload integrity, citations, and URLs.
"""

import sys
import os
import time
import json
import re

# Ensure backend root is on path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.graph_orchestrator import execute_paytm_graph

TEST_CASES = [
    {
        "id": "CASE-01",
        "category": "Action: Entertainment / Movies",
        "query": "Which movie tickets are available right now in IMAX?",
        "expected_mode": "ACTION",
        "expected_service": "movies",
        "payload_key": "movie_data"
    },
    {
        "id": "CASE-02",
        "category": "Action: Offers & Promo Codes",
        "query": "Are there any promo codes?",
        "expected_mode": "ACTION",
        "expected_service": "promos",
        "payload_key": "promo_data"
    },
    {
        "id": "CASE-03",
        "category": "Action: Consolidated Pending Bills",
        "query": "Are there any pending bills?",
        "expected_mode": "ACTION",
        "expected_service": "bills",
        "payload_key": "bills_data"
    },
    {
        "id": "CASE-04",
        "category": "Action: Mobile Telecom Recharge",
        "query": "Recharge Jio 299 with 2GB daily data",
        "expected_mode": "ACTION",
        "expected_service": "recharge",
        "payload_key": "plan_data"
    },
    {
        "id": "CASE-05",
        "category": "Action: Live Travel Booking",
        "query": "Cheapest flights or trains from Mumbai to Pune",
        "expected_mode": "ACTION",
        "expected_service": "travel",
        "payload_key": "travel_data"
    },
    {
        "id": "CASE-06",
        "category": "Action: Retail Shopping Deals",
        "query": "Show me shopping deals in Pune at Croma",
        "expected_mode": "ACTION",
        "expected_service": "shopping",
        "payload_key": "shopping_data"
    },
    {
        "id": "CASE-07",
        "category": "Action: 24K Digital Gold",
        "query": "Buy ₹500 24K digital gold",
        "expected_mode": "ACTION",
        "expected_service": "gold",
        "payload_key": "gold_data"
    },
    {
        "id": "CASE-08",
        "category": "Resolve: Pending Transactions at Switch",
        "query": "Are there any pending transactions?",
        "expected_mode": "RESOLVE",
        "expected_service": "dispute",
        "payload_key": "disputes_list"
    },
    {
        "id": "CASE-09",
        "category": "Resolve: Active Refund Tracking",
        "query": "Are there any refund requests?",
        "expected_mode": "RESOLVE",
        "expected_service": "dispute",
        "payload_key": "disputes_list"
    },
    {
        "id": "CASE-10",
        "category": "Resolve: Failed Debits & Double Deductions",
        "query": "Are there any failed transactions?",
        "expected_mode": "RESOLVE",
        "expected_service": "dispute",
        "payload_key": "disputes_list"
    },
    {
        "id": "CASE-11",
        "category": "Resolve: Formal Nodal Complaints & SLAs",
        "query": "Show me registered complaints",
        "expected_mode": "RESOLVE",
        "expected_service": "dispute",
        "payload_key": "disputes_list"
    }
]

def run_suite():
    results = []
    print("=" * 80)
    print("PAYTM ONE AI: COMPREHENSIVE MULTI-SCENARIO TEST SUITE EXECUTION")
    print("=" * 80)
    
    passed_count = 0
    total_cases = len(TEST_CASES)
    
    for case in TEST_CASES:
        t0 = time.time()
        res = execute_paytm_graph(case["query"], language="en")
        latency_ms = int((time.time() - t0) * 1000)
        
        mode = res.get("mode")
        service = res.get("service")
        ai_message = res.get("ai_message", "")
        resource_links = res.get("resource_links", [])
        citations = res.get("citations")
        
        # Validation checks
        mode_match = (mode == case["expected_mode"])
        service_match = (service == case["expected_service"] or (case["expected_service"] == "bills" and service in ["bills", "electricity"]))
        
        payload_key = case["payload_key"]
        has_payload = (payload_key in res and res[payload_key] is not None)
        
        # Check payload non-emptiness
        if has_payload:
            val = res[payload_key]
            if isinstance(val, list) and len(val) == 0:
                has_payload = False
            elif isinstance(val, dict) and len(val) == 0:
                has_payload = False

        # Check for URLs / Citations
        urls = []
        for link in resource_links:
            if "url" in link and link["url"]:
                urls.append(link["url"])
        if citations and "url" in citations and citations["url"]:
            urls.append(citations["url"])

        has_citations = len(urls) > 0

        # Quality check: No raw markdown asterisks in spoken/rendered message
        has_raw_asterisks = "**" in ai_message or "⚡" in ai_message
        
        # Overall pass criteria
        is_pass = mode_match and service_match and has_payload and bool(ai_message)

        if is_pass:
            passed_count += 1
            status_str = "PASS"
        else:
            status_str = "FAIL"

        case_result = {
            "id": case["id"],
            "category": case["category"],
            "query": case["query"],
            "status": status_str,
            "latency_ms": latency_ms,
            "mode": mode,
            "service": service,
            "mode_ok": mode_match,
            "service_ok": service_match,
            "payload_ok": has_payload,
            "payload_key": payload_key,
            "ai_message_preview": ai_message[:140].replace("\n", " "),
            "urls_count": len(urls),
            "urls": urls[:3],
            "raw_asterisks": has_raw_asterisks
        }
        results.append(case_result)

        print(f"[{status_str}] {case['id']}: {case['category']}")
        print(f"       Query: \"{case['query']}\"")
        print(f"       Result: Mode={mode} | Service={service} | Latency={latency_ms}ms | URLs={len(urls)}")
        print(f"       AI Answer: {ai_message[:110]}...")
        if urls:
            print(f"       Citations/URLs: {urls[0]}")
        print("-" * 80)

    print("\n" + "=" * 80)
    print(f"SUMMARY: {passed_count}/{total_cases} CASES PASSED ({int(passed_count/total_cases*100)}%)")
    print("=" * 80)

    # Save detailed JSON output for audit
    report_path = os.path.join(ROOT_DIR, "backend", "test_suite_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "total_cases": total_cases,
            "passed": passed_count,
            "pass_rate": f"{int(passed_count/total_cases*100)}%",
            "details": results
        }, f, indent=2)

    print(f"Detailed audit log written to: {report_path}")
    return results

if __name__ == "__main__":
    run_suite()
