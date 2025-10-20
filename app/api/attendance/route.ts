import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// ✅ 👇 change this line
const TABLE_NAME = process.env.DYNAMO_ATTENDANCE_TABLE!;

// Example: Fetch all attendance records
export async function GET() {
  try {
    const result = await client.send(new ScanCommand({ TableName: TABLE_NAME }));
    return NextResponse.json({ items: result.Items || [] });
  } catch (err: any) {
    console.error("DynamoDB GET Error:", err);
    return NextResponse.json({ error: err.message || "Failed to read data" }, { status: 500 });
  }
}
