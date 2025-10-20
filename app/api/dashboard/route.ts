import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const STUDENTS_TABLE = process.env.DYNAMO_STUDENTS_TABLE!;
const ATTENDANCE_TABLE = process.env.DYNAMO_ATTENDANCE_TABLE!;

export async function GET() {
  try {
    // ✅ Get all students
    const studentsData = await client.send(new ScanCommand({ TableName: STUDENTS_TABLE }));
    const totalStudents = studentsData.Items?.length || 0;

    // ✅ Get today's attendance
    const attendanceData = await client.send(new ScanCommand({ TableName: ATTENDANCE_TABLE }));
    const today = new Date().toISOString().split("T")[0];

    const presentToday = (attendanceData.Items || []).filter(
      (item: any) => item.Date?.startsWith(today)
    ).length;

    const absentToday = Math.max(totalStudents - presentToday, 0);

    return NextResponse.json({
      totalStudents,
      presentToday,
      absentToday,
    });
  } catch (err: any) {
    console.error("Dashboard Data Error:", err);
    return NextResponse.json({ error: err.message || "Failed to load dashboard data" }, { status: 500 });
  }
}
