#!/usr/bin/env python3
"""
Backend API Testing for BiodataCraft Payment Integration
Tests Razorpay payment endpoints: order creation, verification, and token validation
"""

import requests
import json
import hmac
import hashlib
from pymongo import MongoClient
import os

# Configuration
BASE_URL = "https://wedlock-profile-1.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "biodatacraft"

# Test results tracking
test_results = {
    "passed": 0,
    "failed": 0,
    "tests": []
}

def log_test(test_name, passed, message=""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {test_name}")
    if message:
        print(f"   {message}")
    
    test_results["tests"].append({
        "name": test_name,
        "passed": passed,
        "message": message
    })
    
    if passed:
        test_results["passed"] += 1
    else:
        test_results["failed"] += 1

def print_summary():
    """Print test summary"""
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    print(f"Total Tests: {test_results['passed'] + test_results['failed']}")
    print(f"Passed: {test_results['passed']}")
    print(f"Failed: {test_results['failed']}")
    print("="*70)

def get_mongo_client():
    """Get MongoDB client"""
    try:
        client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
        client.server_info()  # Force connection
        return client
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return None

def cleanup_test_orders(client):
    """Clean up test orders from previous runs"""
    try:
        db = client[DB_NAME]
        result = db.orders.delete_many({"notes.template": {"$exists": True}})
        print(f"🧹 Cleaned up {result.deleted_count} test orders from previous runs\n")
    except Exception as e:
        print(f"⚠️  Cleanup warning: {e}\n")

# ============================================================================
# TEST 1: POST /api/payments/order - Order Creation
# ============================================================================

def test_order_creation_valid_template():
    """Test order creation with valid template"""
    try:
        response = requests.post(
            f"{API_BASE}/payments/order",
            json={"template": "Deep Burgundy"},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # Check required fields
            required_fields = ["keyId", "orderId", "amount", "currency"]
            missing_fields = [f for f in required_fields if f not in data]
            
            if missing_fields:
                log_test("Order Creation - Valid Template", False, 
                        f"Missing fields: {missing_fields}")
                return None
            
            # Verify values
            if data["amount"] != 4900:
                log_test("Order Creation - Valid Template", False, 
                        f"Amount should be 4900, got {data['amount']}")
                return None
            
            if data["currency"] != "INR":
                log_test("Order Creation - Valid Template", False, 
                        f"Currency should be INR, got {data['currency']}")
                return None
            
            # Check that KEY_SECRET is not exposed
            if "RAZORPAY_KEY_SECRET" in str(data) or "GrTn8433" in str(data):
                log_test("Order Creation - Valid Template", False, 
                        "Razorpay KEY_SECRET is exposed in response!")
                return None
            
            log_test("Order Creation - Valid Template", True, 
                    f"Order created: {data['orderId']}")
            return data
        else:
            log_test("Order Creation - Valid Template", False, 
                    f"Status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Order Creation - Valid Template", False, str(e))
        return None

def test_order_creation_missing_template():
    """Test order creation without template (should use default)"""
    try:
        response = requests.post(
            f"{API_BASE}/payments/order",
            json={},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "orderId" in data and data["amount"] == 4900:
                log_test("Order Creation - Missing Template (Default)", True, 
                        "Order created with default template")
                return data
            else:
                log_test("Order Creation - Missing Template (Default)", False, 
                        "Invalid response structure")
                return None
        else:
            log_test("Order Creation - Missing Template (Default)", False, 
                    f"Status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Order Creation - Missing Template (Default)", False, str(e))
        return None

def test_order_creation_invalid_json():
    """Test order creation with invalid JSON"""
    try:
        response = requests.post(
            f"{API_BASE}/payments/order",
            data="invalid json{",
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        # Should still work because code catches JSON parse errors and defaults to {}
        if response.status_code == 200:
            data = response.json()
            if "orderId" in data:
                log_test("Order Creation - Invalid JSON (Graceful Handling)", True, 
                        "Handled invalid JSON gracefully")
                return True
            else:
                log_test("Order Creation - Invalid JSON (Graceful Handling)", False, 
                        "Unexpected response")
                return False
        else:
            log_test("Order Creation - Invalid JSON (Graceful Handling)", False, 
                    f"Status {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Order Creation - Invalid JSON (Graceful Handling)", False, str(e))
        return False

def test_mongodb_order_persistence(order_id):
    """Test that order is stored in MongoDB"""
    try:
        client = get_mongo_client()
        if not client:
            log_test("MongoDB - Order Persistence", False, "Cannot connect to MongoDB")
            return False
        
        db = client[DB_NAME]
        order = db.orders.find_one({"razorpayOrderId": order_id})
        
        if order:
            required_fields = ["razorpayOrderId", "receipt", "template", "amount", 
                             "currency", "status", "createdAt"]
            missing = [f for f in required_fields if f not in order]
            
            if missing:
                log_test("MongoDB - Order Persistence", False, 
                        f"Missing fields in DB: {missing}")
                return False
            
            if order["status"] != "created":
                log_test("MongoDB - Order Persistence", False, 
                        f"Status should be 'created', got '{order['status']}'")
                return False
            
            log_test("MongoDB - Order Persistence", True, 
                    f"Order stored correctly in MongoDB")
            return True
        else:
            log_test("MongoDB - Order Persistence", False, 
                    f"Order {order_id} not found in database")
            return False
            
    except Exception as e:
        log_test("MongoDB - Order Persistence", False, str(e))
        return False

# ============================================================================
# TEST 2: POST /api/payments/verify - Payment Verification
# ============================================================================

def test_verify_missing_fields():
    """Test verification with missing required fields"""
    try:
        # Test with missing payment_id
        response = requests.post(
            f"{API_BASE}/payments/verify",
            json={"razorpay_order_id": "order_test", "razorpay_signature": "sig_test"},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 400:
            log_test("Payment Verification - Missing Fields", True, 
                    "Correctly returns 400 for missing fields")
            return True
        else:
            log_test("Payment Verification - Missing Fields", False, 
                    f"Expected 400, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Payment Verification - Missing Fields", False, str(e))
        return False

def test_verify_nonexistent_order():
    """Test verification with non-existent order ID"""
    try:
        response = requests.post(
            f"{API_BASE}/payments/verify",
            json={
                "razorpay_payment_id": "pay_nonexistent123",
                "razorpay_order_id": "order_nonexistent123",
                "razorpay_signature": "fake_signature_12345"
            },
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 404:
            log_test("Payment Verification - Non-existent Order", True, 
                    "Correctly returns 404 for non-existent order")
            return True
        else:
            log_test("Payment Verification - Non-existent Order", False, 
                    f"Expected 404, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Payment Verification - Non-existent Order", False, str(e))
        return False

def test_verify_invalid_signature(order_id):
    """Test verification with invalid signature"""
    try:
        response = requests.post(
            f"{API_BASE}/payments/verify",
            json={
                "razorpay_payment_id": "pay_test123",
                "razorpay_order_id": order_id,
                "razorpay_signature": "invalid_signature_abcdef1234567890"
            },
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 400:
            data = response.json()
            if "error" in data and "signature" in data["error"].lower():
                log_test("Payment Verification - Invalid Signature", True, 
                        "Correctly rejects invalid signature")
                return True
            else:
                log_test("Payment Verification - Invalid Signature", False, 
                        f"Unexpected error message: {data}")
                return False
        else:
            log_test("Payment Verification - Invalid Signature", False, 
                    f"Expected 400, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Payment Verification - Invalid Signature", False, str(e))
        return False

# ============================================================================
# TEST 3: POST /api/payments/check - Download Token Validation
# ============================================================================

def test_check_missing_token():
    """Test token check with missing token"""
    try:
        response = requests.post(
            f"{API_BASE}/payments/check",
            json={},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 400:
            log_test("Token Check - Missing Token", True, 
                    "Correctly returns 400 for missing token")
            return True
        else:
            log_test("Token Check - Missing Token", False, 
                    f"Expected 400, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Token Check - Missing Token", False, str(e))
        return False

def test_check_nonexistent_token():
    """Test token check with non-existent token"""
    try:
        response = requests.post(
            f"{API_BASE}/payments/check",
            json={"downloadToken": "00000000-0000-0000-0000-000000000000"},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "valid" in data and data["valid"] == False:
                log_test("Token Check - Non-existent Token", True, 
                        "Correctly returns valid: false")
                return True
            else:
                log_test("Token Check - Non-existent Token", False, 
                        f"Expected valid: false, got {data}")
                return False
        else:
            log_test("Token Check - Non-existent Token", False, 
                    f"Expected 200, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Token Check - Non-existent Token", False, str(e))
        return False

# ============================================================================
# MAIN TEST EXECUTION
# ============================================================================

def main():
    print("="*70)
    print("BiodataCraft Payment API Backend Tests")
    print("="*70)
    print(f"API Base URL: {API_BASE}")
    print(f"MongoDB: {MONGO_URL}/{DB_NAME}")
    print("="*70 + "\n")
    
    # Test MongoDB connection first
    print("🔍 Testing MongoDB Connection...")
    mongo_client = get_mongo_client()
    if not mongo_client:
        print("❌ Cannot proceed without MongoDB connection\n")
        print_summary()
        return
    
    log_test("MongoDB Connection", True, "Successfully connected to MongoDB")
    cleanup_test_orders(mongo_client)
    
    # Test 1: Order Creation
    print("\n📦 Testing Order Creation API...")
    print("-" * 70)
    
    order_data = test_order_creation_valid_template()
    test_order_creation_missing_template()
    test_order_creation_invalid_json()
    
    # Test MongoDB persistence
    if order_data and "orderId" in order_data:
        test_mongodb_order_persistence(order_data["orderId"])
    
    # Test 2: Payment Verification
    print("\n🔐 Testing Payment Verification API...")
    print("-" * 70)
    
    test_verify_missing_fields()
    test_verify_nonexistent_order()
    
    if order_data and "orderId" in order_data:
        test_verify_invalid_signature(order_data["orderId"])
    
    # Test 3: Download Token Check
    print("\n🎫 Testing Download Token Check API...")
    print("-" * 70)
    
    test_check_missing_token()
    test_check_nonexistent_token()
    
    # Print summary
    print_summary()
    
    # Return exit code
    return 0 if test_results["failed"] == 0 else 1

if __name__ == "__main__":
    exit(main())
