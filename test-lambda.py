import requests
import json
import time

API_BASE = "https://wnrph10p1c.execute-api.us-east-1.amazonaws.com/Dev"

def test_endpoint(endpoint, payload):
    """Test a single Lambda endpoint"""
    url = f"{API_BASE}{endpoint}"
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    try:
        print(f"🔍 Testing: {endpoint}")
        print(f"   URL: {url}")
        print(f"   Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print(f"   ✅ SUCCESS")
            try:
                response_json = response.json()
                print(f"   Response: {json.dumps(response_json, indent=2)}")
            except:
                print(f"   Response (text): {response.text}")
        else:
            print(f"   ❌ FAILED")
            print(f"   Error: {response.text}")
            
        return {
            'endpoint': endpoint,
            'status_code': response.status_code,
            'success': response.status_code == 200,
            'response': response.text,
            'headers': dict(response.headers)
        }
        
    except requests.exceptions.Timeout:
        print(f"   ⏰ TIMEOUT - Lambda may be cold starting")
        return {'endpoint': endpoint, 'error': 'Timeout - possible cold start'}
    except requests.exceptions.ConnectionError:
        print(f"   🔌 CONNECTION ERROR - Check API Gateway URL")
        return {'endpoint': endpoint, 'error': 'Connection error'}
    except Exception as e:
        print(f"   💥 ERROR: {str(e)}")
        return {'endpoint': endpoint, 'error': str(e)}

def main():
    print("🧪 Testing Python 3.12 Lambda Functions via API Gateway\n")
    print(f"Base URL: {API_BASE}\n")
    
    # Test endpoints with appropriate payloads
    endpoints = [
        {
            'path': '/ai/analyze',
            'payload': {'text': 'This is a test message for AI analysis. Please analyze the sentiment and content.'}
        },
        {
            'path': '/ai/translate', 
            'payload': {'text': 'Hello, how are you today?', 'targetLanguage': 'es'}
        },
        {
            'path': '/ai/polly',
            'payload': {'text': 'Hello, this is a test for text to speech.', 'language': 'en'}
        },
        {
            'path': '/ai/detect-language',
            'payload': {'text': 'Bonjour, comment allez-vous aujourd\'hui?'}
        }
    ]
    
    results = []
    
    for endpoint_config in endpoints:
        result = test_endpoint(endpoint_config['path'], endpoint_config['payload'])
        results.append(result)
        print("-" * 80)
        time.sleep(1)  # Brief pause between requests
    
    # Summary
    print("\n📊 SUMMARY:")
    successful = sum(1 for r in results if r.get('success', False))
    total = len(results)
    print(f"   Successful: {successful}/{total}")
    
    if successful == 0:
        print("\n🚨 COMMON ISSUES TO CHECK:")
        print("   1. Lambda function deployment status")
        print("   2. API Gateway integration configuration")
        print("   3. Lambda execution role permissions")
        print("   4. CORS configuration")
        print("   5. Python 3.12 runtime compatibility")
        print("   6. Lambda function timeout settings")
        print("   7. VPC configuration (if applicable)")

if __name__ == "__main__":
    main()