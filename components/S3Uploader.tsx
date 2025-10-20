"use client";
import React, { useState } from "react";

export default function S3Uploader() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const uploadFile = async () => {
    if (!file) {
      alert("Please choose an image first!");
      return;
    }

    try {
      // 1. Get a pre-signed upload URL from the backend
      const res = await fetch(`/api/upload-url?fileName=${file.name}&fileType=${file.type}`);
      const { url } = await res.json();

      // 2. Upload directly to S3 using the signed URL
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      setMessage("✅ Upload successful!");
    } catch (err: any) {
      console.error("UPLOAD ERROR:", err);
      setMessage(`❌ Upload failed: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white shadow-lg rounded-2xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Upload Image to S3
        </h2>

        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-100 text-blue-800 px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-200 transition"
        >
          Choose Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />

        <button
          onClick={uploadFile}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg mt-4 w-full hover:bg-blue-700 transition"
        >
          Upload
        </button>

        {message && (
          <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
