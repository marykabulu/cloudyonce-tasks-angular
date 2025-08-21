import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token'
}

def lambda_handler(event, context):
    logger.info(f"Event received: {json.dumps(event)}")

    # Handle OPTIONS preflight request for CORS
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "CORS preflight successful"})
        }

    # Get the path to determine which service to call
    path = event.get("path", "")
    resource = event.get("resource", "")
    
    logger.info(f"Path: {path}, Resource: {resource}")

    # Parse body
    body = event.get("body")
    if body:
        if isinstance(body, str):
            try:
                body = json.loads(body)
            except json.JSONDecodeError:
                return {
                    "statusCode": 400,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({"error": "Invalid JSON in request body"})
                }
    else:
        body = event

    # Route to appropriate service based on path
    if "image-analyze" in path:
        return handle_image_analysis(body)
    elif "analyze" in path:
        return handle_text_analysis(body)
    elif "translate" in path:
        return handle_translation(body)
    elif "polly" in path:
        return handle_polly(body)
    elif "detect-language" in path:
        return handle_language_detection(body)
    else:
        return {
            "statusCode": 404,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": f"Endpoint not found: {path}"})
        }

def handle_image_analysis(body):
    bucket = body.get("bucket")
    key = body.get("key")

    if not bucket or not key:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Missing bucket or key"})
        }

    try:
        rekognition = boto3.client("rekognition")
        response = rekognition.detect_labels(
            Image={"S3Object": {"Bucket": bucket, "Name": key}},
            MaxLabels=5,
            MinConfidence=70
        )

        labels = [
            {"Name": label["Name"], "Confidence": f"{label['Confidence']:.2f}%"}
            for label in response["Labels"]
        ]

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"labels": labels})
        }

    except Exception as e:
        logger.error(f"Error detecting labels: {str(e)}")
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)})
        }

def handle_text_analysis(body):
    text = body.get("text")
    if not text:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Missing text parameter"})
        }
    
    try:
        comprehend = boto3.client("comprehend")
        response = comprehend.detect_sentiment(Text=text, LanguageCode='en')
        
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "sentiment": response["Sentiment"],
                "sentimentScore": response["SentimentScore"]
            })
        }
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}")
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)})
        }

def handle_translation(body):
    text = body.get("text")
    target_language = body.get("targetLanguage", "es")
    
    if not text:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Missing text parameter"})
        }
    
    try:
        translate = boto3.client("translate")
        response = translate.translate_text(
            Text=text,
            SourceLanguageCode="auto",
            TargetLanguageCode=target_language
        )
        
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"translatedText": response["TranslatedText"]})
        }
    except Exception as e:
        logger.error(f"Error translating text: {str(e)}")
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)})
        }

def handle_polly(body):
    text = body.get("text")
    language = body.get("language", "en")
    
    if not text:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Missing text parameter"})
        }
    
    # Mock response - implement actual Polly logic
    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"audioUrl": "https://example.com/audio.mp3"})
    }

def handle_language_detection(body):
    text = body.get("text")
    
    if not text:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Missing text parameter"})
        }
    
    try:
        comprehend = boto3.client("comprehend")
        response = comprehend.detect_dominant_language(Text=text)
        
        if response["Languages"]:
            lang = response["Languages"][0]
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({
                    "language": lang["LanguageCode"],
                    "languageCode": lang["LanguageCode"],
                    "confidence": lang["Score"]
                })
            }
        
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "language": "en",
                "languageCode": "en", 
                "confidence": 0.5
            })
        }
    except Exception as e:
        logger.error(f"Error detecting language: {str(e)}")
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)})
        }