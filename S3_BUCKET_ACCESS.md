# S3 Bucket Access Requirements for Image Analysis

## Issue
Image analysis (AWS Rekognition) requires access to S3 bucket where images are stored. The Lambda function needs proper IAM permissions.

## Required IAM Permissions

Your Lambda function needs the following permissions:

### 1. S3 Read Access
```json
{
  "Effect": "Allow",
  "Action": [
    "s3:GetObject",
    "s3:GetObjectVersion"
  ],
  "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
}
```

### 2. Rekognition Access
```json
{
  "Effect": "Allow",
  "Action": [
    "rekognition:DetectLabels",
    "rekognition:DetectText",
    "rekognition:DetectFaces"
  ],
  "Resource": "*"
}
```

## Complete IAM Policy Example

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion"
      ],
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "rekognition:DetectLabels",
        "rekognition:DetectText",
        "rekognition:DetectFaces"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

## S3 Bucket Configuration

### 1. Bucket Policy (Optional but Recommended)
Ensure your bucket allows Lambda to read objects:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowLambdaRead",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

### 2. Public Access (Not Required)
You don't need public access for Rekognition - Lambda can access private objects with proper IAM permissions.

## Troubleshooting

### Error: Access Denied (403)
- Check Lambda execution role has S3 GetObject permission
- Verify bucket name is correct
- Check bucket policy allows Lambda access

### Error: Not Found (404)
- Verify the S3 key (file path) is correct
- Check if file was uploaded successfully
- Ensure key includes full path (e.g., "folder/subfolder/file.jpg")

### Error: Timeout
- Rekognition may take time for large images
- Check Lambda timeout settings (should be at least 30 seconds)
- Verify image format is supported (JPEG, PNG)

## Testing S3 Access

You can test if Lambda can access S3 by adding this to your Lambda:

```python
import boto3

s3 = boto3.client('s3')
try:
    response = s3.head_object(Bucket='YOUR-BUCKET', Key='YOUR-KEY')
    print(f"✅ S3 access OK: {response}")
except Exception as e:
    print(f"❌ S3 access failed: {e}")
```

## Common Issues

1. **Wrong Bucket Name**: Double-check the bucket name matches exactly
2. **Key Path Issues**: Ensure the key includes the full path from bucket root
3. **IAM Role Not Attached**: Lambda execution role must have the permissions
4. **Region Mismatch**: Ensure Lambda and S3 bucket are in the same region (or configure cross-region access)

## Verification Steps

1. Go to AWS Lambda Console
2. Select your image-analysis Lambda function
3. Go to "Configuration" → "Permissions"
4. Click on the Execution role
5. Verify it has S3 and Rekognition permissions
6. Test with a known S3 object
