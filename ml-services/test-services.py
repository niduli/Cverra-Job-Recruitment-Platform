#!/usr/bin/env python3
"""
ML Services Health Check and Testing Script
Tests all ML services and their endpoints
"""

import requests
import json
import time
from typing import Dict, List

# Service URLs
SERVICES = {
    "Role Prediction": {
        "url": "http://localhost:6000",
        "endpoints": [
            {"method": "GET", "path": "/health", "name": "Health Check"},
            {"method": "POST", "path": "/predict", "name": "Role Prediction", 
             "data": {"text": "python machine learning tensorflow keras"}}
        ]
    },
    "Job Recommendation": {
        "url": "http://localhost:5002",
        "endpoints": [
            {"method": "GET", "path": "/health", "name": "Health Check"},
            {"method": "POST", "path": "/recommend", "name": "Job Recommendation",
             "data": {"skills": ["python", "machine learning"], "experience": 5}}
        ]
    },
    "CV Ranking": {
        "url": "http://localhost:8002",
        "endpoints": [
            {"method": "GET", "path": "/health", "name": "Health Check"},
            {"method": "POST", "path": "/rank", "name": "CV Ranking",
             "data": {"cv_text": "Python developer with ML experience", "job_title": "ML Engineer"}}
        ]
    }
}

TIMEOUT = 5  # seconds

def test_service(service_name: str, service_info: Dict) -> Dict:
    """Test a single service and its endpoints"""
    print(f"\n{'='*60}")
    print(f"Testing: {service_name}")
    print(f"URL: {service_info['url']}")
    print('='*60)
    
    results = {
        "service": service_name,
        "url": service_info["url"],
        "endpoints": [],
        "healthy": False
    }
    
    for endpoint in service_info['endpoints']:
        endpoint_result = test_endpoint(service_info['url'], endpoint)
        results["endpoints"].append(endpoint_result)
        
        if endpoint_result["success"]:
            results["healthy"] = True
    
    return results

def test_endpoint(base_url: str, endpoint: Dict) -> Dict:
    """Test a single endpoint"""
    url = f"{base_url}{endpoint['path']}"
    method = endpoint['method']
    name = endpoint['name']
    
    result = {
        "name": name,
        "method": method,
        "path": endpoint['path'],
        "success": False,
        "status_code": None,
        "response": None,
        "error": None,
        "time_ms": 0
    }
    
    try:
        start_time = time.time()
        
        if method == "GET":
            response = requests.get(url, timeout=TIMEOUT)
        elif method == "POST":
            response = requests.post(
                url,
                json=endpoint.get('data', {}),
                timeout=TIMEOUT,
                headers={"Content-Type": "application/json"}
            )
        
        result["time_ms"] = round((time.time() - start_time) * 1000)
        result["status_code"] = response.status_code
        
        if response.status_code in [200, 201]:
            result["success"] = True
            try:
                result["response"] = response.json()
            except:
                result["response"] = response.text
        else:
            result["error"] = f"HTTP {response.status_code}"
            result["response"] = response.text
    
    except requests.Timeout:
        result["error"] = f"Timeout after {TIMEOUT}s"
    except requests.ConnectionError as e:
        result["error"] = f"Connection failed: {str(e)}"
    except Exception as e:
        result["error"] = f"Error: {str(e)}"
    
    # Print result
    status = "✓ PASS" if result["success"] else "✗ FAIL"
    print(f"\n  {status} - {method} {endpoint['path']} ({name})")
    print(f"      Status: {result['status_code']}")
    print(f"      Time: {result['time_ms']}ms")
    
    if result["error"]:
        print(f"      Error: {result['error']}")
    elif result["success"]:
        if isinstance(result["response"], dict):
            print(f"      Response: {json.dumps(result['response'], indent=14)}")
        else:
            print(f"      Response: {result['response'][:100]}")
    
    return result

def print_summary(all_results: List[Dict]):
    """Print test summary"""
    print(f"\n\n{'='*60}")
    print("SUMMARY")
    print('='*60)
    
    total_services = len(all_results)
    healthy_services = sum(1 for r in all_results if r["healthy"])
    
    print(f"\nServices: {healthy_services}/{total_services} healthy\n")
    
    for result in all_results:
        status = "✓ HEALTHY" if result["healthy"] else "✗ UNHEALTHY"
        healthy_endpoints = sum(1 for e in result["endpoints"] if e["success"])
        total_endpoints = len(result["endpoints"])
        
        print(f"  {status} - {result['service']}")
        print(f"           {healthy_endpoints}/{total_endpoints} endpoints responding")
    
    # Overall status
    print(f"\n{'─'*60}")
    if healthy_services == total_services:
        print("✓ All ML services are healthy and ready!")
        return True
    else:
        print(f"✗ {total_services - healthy_services} service(s) unavailable")
        print("\nTroubleshooting:")
        print("1. Ensure all services are running")
        print("   - Windows: Check open command windows for all services")
        print("   - Mac/Linux: ps aux | grep python")
        print("2. Check ports are available:")
        print("   - Windows: netstat -ano | findstr :6000")
        print("   - Mac/Linux: lsof -i :6000")
        print("3. Review service logs for errors")
        return False

def test_backend_integration():
    """Test backend ML health check endpoint"""
    print(f"\n\n{'='*60}")
    print("Testing Backend Integration")
    print('='*60)
    
    backend_url = "http://localhost:3000/health-check/full"
    
    print(f"\nChecking: {backend_url}")
    
    try:
        response = requests.get(backend_url, timeout=TIMEOUT)
        
        if response.status_code == 200 or response.status_code == 206:
            data = response.json()
            print("\n✓ Backend health check endpoint responding")
            
            if data.get("overall") == "healthy":
                print("✓ All ML services connected to backend")
                return True
            else:
                print(f"✗ Backend reports overall status: {data.get('overall')}")
                print("\nML Service Status:")
                for key, service in data.get("ml", {}).get("services", {}).items():
                    status = "✓" if service.get("status") == "healthy" else "✗"
                    print(f"  {status} {service.get('name')}: {service.get('status')}")
                return False
        else:
            print(f"✗ Backend returned HTTP {response.status_code}")
            return False
    
    except requests.ConnectionError:
        print(f"✗ Cannot connect to backend at {backend_url}")
        print("  Make sure backend is running: npm run dev")
        return False
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        return False

def main():
    """Main test runner"""
    print("""
╔════════════════════════════════════════════════════════════╗
║     Cverra ML Services Health Check & Test Suite          ║
║                                                            ║
║  This script tests all ML services and their endpoints    ║
╚════════════════════════════════════════════════════════════╝
    """)
    
    print("Testing ML services...\n")
    print(f"Timeout: {TIMEOUT}s per request")
    
    # Test all services
    all_results = []
    for service_name, service_info in SERVICES.items():
        result = test_service(service_name, service_info)
        all_results.append(result)
    
    # Print summary
    ml_healthy = print_summary(all_results)
    
    # Test backend integration (if available)
    print("\n")
    backend_healthy = test_backend_integration()
    
    # Final status
    print(f"\n{'='*60}")
    if ml_healthy and backend_healthy:
        print("✓ All systems operational!")
        print("\nYou can now:")
        print("  1. Upload CV → Auto-profile enhancement")
        print("  2. View recommended jobs")
        print("  3. Apply to jobs → Auto-scoring")
        return 0
    elif ml_healthy:
        print("⚠ ML services OK, but backend integration may have issues")
        print("  Backend can run in degraded mode with limited ML features")
        return 1
    else:
        print("✗ ML services are not available")
        print("  Please start them using start-services.bat (Windows)")
        print("  or ./start-services.sh (Mac/Linux)")
        return 2

if __name__ == "__main__":
    exit(main())
