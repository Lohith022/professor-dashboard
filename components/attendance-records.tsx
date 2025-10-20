"use client";

import { useEffect, useState } from "react";

interface AttendanceRecord {
  Date: string;
  Name: string;
  Time: string;
  Similarity: number;
  PhotoName: string;
}

export default function AttendanceRecords() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
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

    fetchRecords();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Attendance Records</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading attendance records...</p>
      ) : records.length === 0 ? (
        <p className="text-center text-gray-500">No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Similarity</th>
                <th className="p-3 text-left">Photo</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3">{r.Date}</td>
                  <td className="p-3">{r.Name}</td>
                  <td className="p-3">{r.Time}</td>
                  <td className="p-3">{r.Similarity?.toFixed(2)}%</td>
                  <td className="p-3">
                    <a
                      href={`https://attendance-images-bucket-for-project.s3.ap-south-1.amazonaws.com/uploads/${r.PhotoName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Photo
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
