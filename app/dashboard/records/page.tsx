"use client";
import React, { useEffect, useState } from "react";

interface Record {
  Date: string;
  Name: string;
  Time: string;
  Similarity: number;
  PhotoName: string;
}

export default function AttendanceRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/attendance");
        const data = await res.json();
        setRecords(data.items || []);
      } catch (err) {
        console.error("Error fetching records:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading records...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Attendance Records</h2>
      <table className="w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Date</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Time</th>
            <th className="border px-3 py-2">Similarity</th>
            <th className="border px-3 py-2">Photo</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i} className="text-center hover:bg-gray-50">
              <td className="border px-3 py-2">{r.Date}</td>
              <td className="border px-3 py-2 font-medium">{r.Name}</td>
              <td className="border px-3 py-2">{r.Time}</td>
              <td className="border px-3 py-2">{r.Similarity?.toFixed?.(2)}%</td>
              <td className="border px-3 py-2">
                <a
                  href={`https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/uploads/${r.PhotoName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
