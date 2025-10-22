"use client";

import React, { useEffect, useState } from "react";

interface Record {
  face_id: string;
  Date: string;
  Name: string;
  Time: string;
  Similarity: string | number;
  PhotoName: string;
}

export default function AttendanceRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRecord, setNewRecord] = useState({ Name: "", Date: "", Time: "" });

  // ✅ Fetch all attendance records
  async function fetchRecords() {
    try {
      setLoading(true);
      const res = await fetch("/api/attendance");
      const data = await res.json();
      setRecords(data.items || []);
    } catch (err) {
      console.error("Error fetching records:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  // ✅ Add manual attendance record
  async function handleAdd() {
    if (!newRecord.Name || !newRecord.Date || !newRecord.Time) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRecord,
          Similarity: "Manual Entry",
          PhotoName: "N/A",
        }),
      });

      if (!res.ok) throw new Error("Failed to add record");

      setNewRecord({ Name: "", Date: "", Time: "" });
      await fetchRecords();
      alert("✅ Attendance record added!");
    } catch (err) {
      console.error(err);
      alert("❌ Error adding record.");
    }
  }

  // ✅ Delete a record (by face_id)
  async function handleDelete(face_id: string) {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch("/api/attendance", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ face_id }),
      });

      if (!res.ok) throw new Error("Failed to delete record");

      await fetchRecords();
      alert("🗑️ Record deleted successfully.");
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("❌ Error deleting record.");
    }
  }

  // ──────────────────────────────────────────────

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Attendance Records
      </h2>

      {/* Manual Add Form */}
      <div className="border rounded-lg p-4 mb-6 bg-gray-50 shadow-sm">
        <h3 className="font-semibold mb-3 text-center text-lg">
          Add Attendance Manually
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Name"
            value={newRecord.Name}
            onChange={(e) =>
              setNewRecord({ ...newRecord, Name: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={newRecord.Date}
            onChange={(e) =>
              setNewRecord({ ...newRecord, Date: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="time"
            value={newRecord.Time}
            onChange={(e) =>
              setNewRecord({ ...newRecord, Time: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>
        <div className="text-center mt-4">
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Record
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center mt-10 text-gray-500">Loading records...</p>
      ) : records.length === 0 ? (
        <p className="text-center text-gray-500">
          No attendance records found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Time</th>
                <th className="border px-3 py-2">Similarity</th>
                <th className="border px-3 py-2">Photo</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.face_id} className="text-center hover:bg-gray-50">
                  <td className="border px-3 py-2">{r.Date}</td>
                  <td className="border px-3 py-2 font-medium">{r.Name}</td>
                  <td className="border px-3 py-2">{r.Time}</td>
                  <td className="border px-3 py-2">
                    {typeof r.Similarity === "number"
                      ? `${r.Similarity.toFixed(2)}%`
                      : r.Similarity}
                  </td>
                  <td className="border px-3 py-2">
                    {r.PhotoName === "N/A" ? (
                      <span className="text-gray-400 italic">N/A</span>
                    ) : (
                      <a
                        href={`https://attendance-images-bucket-for-project.s3.ap-south-1.amazonaws.com/uploads/${r.PhotoName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    )}
                  </td>
                  <td className="border px-3 py-2">
                    <button
                      onClick={() => handleDelete(r.face_id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
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
