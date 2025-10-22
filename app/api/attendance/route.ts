import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const TABLE_NAME = process.env.DYNAMO_ATTENDANCE_TABLE!;

// ✅ Fetch all attendance records
export async function GET() {
  try {
    const result = await client.send(new ScanCommand({ TableName: TABLE_NAME }));
    return NextResponse.json({ items: result.Items || [] });
  } catch (err: any) {
    console.error("DynamoDB GET Error:", err);
    return NextResponse.json({ error: err.message || "Failed to read data" }, { status: 500 });
  }
}

// ✅ Add a new attendance record manually
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { Name, Date, Time, Similarity, PhotoName } = body;

    if (!Name || !Date || !Time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newItem = {
      face_id: randomUUID(), // ✅ required key for your DynamoDB table
      Name,
      Date,
      Time,
      Similarity: Similarity || 100, // optional default
      PhotoName: PhotoName || "manual-entry",
    };

    await client.send(new PutCommand({ TableName: TABLE_NAME, Item: newItem }));

    return NextResponse.json({ message: "Record added successfully", item: newItem });
  } catch (err: any) {
    console.error("DynamoDB POST Error:", err);
    return NextResponse.json({ error: err.message || "Failed to add record" }, { status: 500 });
  }
}

// ✅ Delete an attendance record by face_id
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { face_id } = body;

    if (!face_id) {
      return NextResponse.json({ error: "Missing face_id" }, { status: 400 });
    }

    await client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { face_id },
      })
    );

    return NextResponse.json({ message: "Record deleted successfully" });
  } catch (err: any) {
    console.error("DynamoDB DELETE Error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete record" }, { status: 500 });
  }
}
