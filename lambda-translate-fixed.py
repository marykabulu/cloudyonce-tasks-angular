import json
import boto3
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    """
    Fixed Lambda function for translation with proper CORS and error handling
    """
    
    # ALWAYS return CORS headers, even on errors
    cors_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
    
    try:
        logger.info(f"Received event: {json.dumps(event)}")
        
        # Handle different event structures (CRITICAL FIX)
        if 'body' in event and event['body']:
            if isinstance(event['body'], str):
                body = json.loads(event['body'])
            else:
                body = event['body']
        else:
            body = event
        
        logger.info(f"Parsed body: {json.dumps(body)}")
        
        # Extract parameters
        text = body.get('text', '')
        target_language = body.get('targetLanguage', 'es')
        
        if not text:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Missing text parameter'})
            }
        
        # Initialize AWS Translate client
        translate_client = boto3.client('translate', region_name='us-east-1')
        
        # Perform translation
        response = translate_client.translate_text(
            Text=text,
            SourceLanguageCode='auto',
            TargetLanguageCode=target_language
        )
        
        result = {
            'translatedText': response['TranslatedText']
        }
        
        logger.info(f"Translation successful: {json.dumps(result)}")
        
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps(result)
        }
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Invalid JSON in request body'})
        }
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': f'Translation failed: {str(e)}'})
        }