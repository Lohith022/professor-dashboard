import boto3

# Initialize the Rekognition client
rekognition = boto3.client('rekognition', region_name="ap-south-1")

BUCKET_NAME = "image-bucket-for-project"
COLLECTION_ID = "attendance_faces"

# 1. Create the collection (Only runs if it doesn't already exist)
try:
    response = rekognition.create_collection(CollectionId=COLLECTION_ID)
    print("Collection ARN:", response['CollectionArn'])
except rekognition.exceptions.ResourceAlreadyExistsException:
    print(f"Collection '{COLLECTION_ID}' already exists.")

# 2. List of student base images in your S3 bucket
student_images = [
    "101_brijesh.jpg",
    "104_lohith.jpg",
    "111_doe.jpg",
    "102_girish.jpg",
    # Add remaining image filenames here
]

# 3. Index faces from each image
print("\nStarting indexing process...")
for image_key in student_images:
    # Extracts the roll number (e.g., "101_brijesh" -> "101_brijesh")
    external_image_id = image_key.split('.')[0] 
    
    response = rekognition.index_faces(
        CollectionId=COLLECTION_ID,
        Image={"S3Object": {"Bucket": BUCKET_NAME, "Name": image_key}},
        ExternalImageId=external_image_id,
        DetectionAttributes=['DEFAULT']
    )
    
    print(f"\nFaces indexed from {image_key}:")
    for face_record in response['FaceRecords']:
        face_id = face_record['Face']['FaceId']
        print(f"  -> FaceId: {face_id}")
        print(f"  -> Roll Number (External ID): {external_image_id}")