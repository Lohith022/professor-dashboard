"use client";

import S3Uploader from "@/components/S3Uploader";

export default function UploadPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Attendance Image</h1>
      <S3Uploader />
    </main>
  );
}
