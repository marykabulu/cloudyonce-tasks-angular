import boto3
import json
import logging

rekognition = boto3.client("rekognition")
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    # CORS headers for ALL responses
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token'
    }
    
    logger.info(f"Event: {json.dumps(event)}")

    # Handle OPTIONS preflight
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    try:
        # Parse body
        if 'body' in event and event['body']:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event

        bucket = body.get("bucket")
        key = body.get("key")

        if not bucket or not key:
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"error": "Missing bucket or key"})
            }

        response = rekognition.detect_labels(
            Image={"S3Object": {"Bucket": bucket, "Name": key}},
            MaxLabels=5,
            MinConfidence=70
        )

        labels = [{"Name": label["Name"], "Confidence": f"{label['Confidence']:.2f}%"} for label in response["Labels"]]

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"labels": labels})
        }

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": str(e)})
        }