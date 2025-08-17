# AWS Lambda Python 3.12 Troubleshooting Guide

## Your Current Configuration
- **API Gateway URL**: `https://wnrph10p1c.execute-api.us-east-1.amazonaws.com/Dev`
- **Runtime**: Python 3.12
- **Region**: us-east-1

## Common Issues & Solutions

### 1. Lambda Function Deployment
```bash
# Check if functions are deployed
aws lambda list-functions --region us-east-1 --query 'Functions[?Runtime==`python3.12`]'
```

### 2. API Gateway Integration
- ✅ Verify Lambda proxy integration is enabled
- ✅ Check method configuration (POST methods for your endpoints)
- ✅ Ensure deployment to "Dev" stage is complete

### 3. Lambda Function Structure
Your Lambda functions should return proper HTTP responses:
```python
import json

def lambda_handler(event, context):
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        
        # Your AI service logic here
        result = process_request(body)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps(result)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
```

### 4. Required AWS Services & Permissions
Your Lambda execution role needs permissions for:
- **Bedrock**: `bedrock:InvokeModel`
- **Translate**: `translate:TranslateText`, `translate:DetectDominantLanguage`
- **Polly**: `polly:SynthesizeSpeech`
- **S3**: `s3:PutObject`, `s3:GetObject` (for Polly audio files)
- **Comprehend**: `comprehend:DetectDominantLanguage`
- **CloudWatch Logs**: `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`

### 5. Python 3.12 Specific Considerations
- Ensure all dependencies are compatible with Python 3.12
- Use `pip install --target ./package` for packaging
- Check for any deprecated imports or syntax

### 6. CORS Configuration
Add CORS headers to all responses and handle OPTIONS preflight:
```python
def handle_cors():
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': ''
    }
```

### 7. Testing Commands
```bash
# Test API Gateway directly
curl -X POST https://wnrph10p1c.execute-api.us-east-1.amazonaws.com/Dev/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "test message"}'

# Check Lambda logs
aws logs describe-log-groups --region us-east-1 --log-group-name-prefix "/aws/lambda/"

# View recent logs
aws logs filter-log-events --region us-east-1 --log-group-name "/aws/lambda/your-function-name" --start-time $(date -d '1 hour ago' +%s)000
```

### 8. Required Dependencies
Make sure your Lambda layers or deployment packages include:
```
boto3>=1.34.0
requests>=2.31.0
```

### 9. Environment Variables
Set these in your Lambda configuration:
- `AWS_DEFAULT_REGION=us-east-1`
- Any API keys or configuration values

### 10. Timeout & Memory
- Set timeout to at least 30 seconds for AI services
- Use 512MB+ memory for better performance
- Consider provisioned concurrency for production