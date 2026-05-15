import boto3
import os
import urllib.parse
from datetime import datetime

# --- CONFIGURATION ---
REGION = "ap-south-1"

# Initialize AWS clients outside the handler for warm-start performance
rekognition = boto3.client('rekognition', region_name=REGION)
dynamodb = boto3.resource('dynamodb', region_name=REGION)

# Retrieve environment variables configured in AWS Lambda
DYNAMODB_TABLE_NAME = os.environ['DYNAMODB_TABLE']
REKOGNITION_COLLECTION_ID = os.environ['REKOGNITION_COLLECTION_ID']

table = dynamodb.Table(DYNAMODB_TABLE_NAME)

def lambda_handler(event, context):
    """
    Triggered by an S3 ObjectCreated event.
    Uses AWS Rekognition to find matching faces and logs attendance to DynamoDB.
    """
    print("Received S3 Event:", event)

    for record in event['Records']:
        bucket_name = record['s3']['bucket']['name']
        
        # Decode the object key to handle spaces and special characters
        object_key = urllib.parse.unquote_plus(record['s3']['object']['key'])
        print(f"Processing image: s3://{bucket_name}/{object_key}")

        try:
            # Search for faces in the uploaded group image
            response = rekognition.search_faces_by_image(
                CollectionId=REKOGNITION_COLLECTION_ID,
                Image={'S3Object': {'Bucket': bucket_name, 'Name': object_key}},
                FaceMatchThreshold=50,  
                MaxFaces=10
            )
            
            # Filter out unknown/unrecognized faces
            if not response.get('FaceMatches'):
                print("No matching faces found in the image. Ignoring unknown faces.")
                continue

            # Process successfully recognized students
            for match in response['FaceMatches']:
                face = match['Face']
                roll_number = face['ExternalImageId']
                face_id = face['FaceId']
                confidence = match['Similarity']
                timestamp = datetime.utcnow().isoformat()
                
                print(f"Recognized: {roll_number} ({confidence:.2f}% confidence).")

                # Write attendance record to DynamoDB
                table.put_item(
                    Item={
                        'face_id': face_id,
                        'roll_number': roll_number,
                        'timestamp': timestamp,
                        'image_key': object_key,
                        'confidence': f"{confidence:.2f}" 
                    }
                )
                print(f"Successfully logged attendance for {roll_number}.")

        except Exception as e:
            print(f"Error processing image {object_key}. Details: {str(e)}")
            raise e

    return {
        "statusCode": 200,
        "body": "Attendance processing finished successfully."
    }