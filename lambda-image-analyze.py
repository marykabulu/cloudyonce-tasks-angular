import json
import boto3
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    """
    Image Analysis using AWS Rekognition
    Endpoint: POST /ai/image-analyze
    """
    
    cors_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
    
    try:
        logger.info(f"Received event: {json.dumps(event)}")
        
        # Handle different event structures
        if 'body' in event and event['body']:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event
        
        bucket = body.get('bucket', '')
        key = body.get('key', '')
        
        if not bucket or not key:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Missing bucket or key parameter'})
            }
        
        # Initialize AWS Rekognition client
        rekognition = boto3.client('rekognition', region_name='us-east-1')
        
        # Detect labels in image
        response = rekognition.detect_labels(
            Image={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': key
                }
            },
            MaxLabels=10,
            MinConfidence=70
        )
        
        labels = []
        for label in response['Labels']:
            labels.append({
                'Name': label['Name'],
                'Confidence': f"{label['Confidence']:.2f}%"
            })
        
        result = {'labels': labels}
        
        logger.info(f"Image analysis successful: {json.dumps(result)}")
        
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps(result)
        }
        
    except Exception as e:
        logger.error(f"Image analysis error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': f'Image analysis failed: {str(e)}'})
        }