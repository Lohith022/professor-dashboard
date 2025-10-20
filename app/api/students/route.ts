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

const TABLE_NAME = process.env.DYNAMO_STUDENTS_TABLE!;

// ✅ GET all students
export async function GET() {
  try {
    const result = await client.send(new ScanCommand({ TableName: TABLE_NAME }));
    return NextResponse.json({ items: result.Items || [] });
  } catch (err: any) {
    console.error("❌ DynamoDB GET Error:", err);
    return NextResponse.json({ error: err.message || "Failed to read data" }, { status: 500 });
  }
}

// ✅ POST - Add or update a student
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Expecting fields: student_id, name, email, department, photo_name
    await client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: body,
      })
    );

    return NextResponse.json({ message: "Student added/updated successfully!" });
  } catch (err: any) {
    console.error("❌ DynamoDB POST Error:", err);
    return NextResponse.json({ error: err.message || "Failed to save student" }, { status: 500 });
  }
}

// ✅ DELETE - Remove a student
export async function DELETE(req: Request) {
  try {
    const { student_id } = await req.json();

    await client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { student_id },
      })
    );

    return NextResponse.json({ message: "Student deleted successfully!" });
  } catch (err: any) {
    console.error("❌ DynamoDB DELETE Error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete student" }, { status: 500 });
  }
}
