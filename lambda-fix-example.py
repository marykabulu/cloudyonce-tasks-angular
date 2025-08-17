import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    """
    Fixed Lambda handler that properly handles API Gateway events
    """
    try:
        # Log the entire event for debugging
        logger.info(f"Received event: {json.dumps(event)}")
        
        # Handle different event structures
        if 'body' in event:
            # Lambda Proxy Integration
            if isinstance(event['body'], str):
                body = json.loads(event['body'])
            else:
                body = event['body']
        else:
            # Direct Lambda Integration or test event
            body = event
        
        # Extract the text parameter
        text = body.get('text', '')
        if not text:
            return create_error_response(400, "Missing 'text' parameter")
        
        # Your AI processing logic here
        # For example (replace with your actual AI service calls):
        result = {
            "analysis": f"Processed text: {text}",
            "sentiment": "positive",
            "confidence": 0.85
        }
        
        return create_success_response(result)
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        return create_error_response(400, "Invalid JSON in request body")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return create_error_response(500, f"Internal server error: {str(e)}")

def create_success_response(data):
    """Create a successful HTTP response"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        'body': json.dumps(data)
    }

def create_error_response(status_code, message):
    """Create an error HTTP response"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        'body': json.dumps({'error': message})
    }

# Example for translate function
def translate_lambda_handler(event, context):
    try:
        # Handle event structure
        if 'body' in event:
            if isinstance(event['body'], str):
                body = json.loads(event['body'])
            else:
                body = event['body']
        else:
            body = event
        
        text = body.get('text', '')
        target_language = body.get('targetLanguage', 'es')
        
        if not text:
            return create_error_response(400, "Missing 'text' parameter")
        
        # Your AWS Translate logic here
        # import boto3
        # translate_client = boto3.client('translate')
        # result = translate_client.translate_text(
        #     Text=text,
        #     SourceLanguageCode='auto',
        #     TargetLanguageCode=target_language
        # )
        
        # Mock response for now
        result = {
            "translatedText": f"[Translated to {target_language}] {text}"
        }
        
        return create_success_response(result)
        
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return create_error_response(500, f"Translation failed: {str(e)}")