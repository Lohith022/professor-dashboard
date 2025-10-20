"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Camera, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function UploadAttendance() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadStatus("error")
      return
    }

    setIsUploading(true)
    setUploadStatus("idle")

    // Simulate upload process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate success (in real app, this would be actual face recognition processing)
    setUploadStatus("success")
    setIsUploading(false)
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })
      setStream(mediaStream)
      setShowCamera(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setUploadStatus("error")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        context.drawImage(video, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
            handleFileUpload(file)
          }
        }, "image/jpeg")
      }

      stopCamera()
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Attendance</h1>
        <p className="text-muted-foreground mt-1">
          Upload today's class photo to automatically mark attendance using face recognition.
        </p>
      </div>

      {/* Instructions */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-primary mb-2">Instructions</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Take a clear photo of your class with all students visible</li>
            <li>• Ensure good lighting and minimal shadows on faces</li>
            <li>• Supported formats: JPG, PNG (max 10MB)</li>
            <li>• The system will automatically identify and mark attendance</li>
          </ul>
        </CardContent>
      </Card>

      {/* Upload Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Photo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${dragActive ? "border-primary bg-primary/5" : "border-border"}
                ${isUploading ? "opacity-50 pointer-events-none" : "hover:border-primary/50 hover:bg-primary/5"}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <div className="space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <div>
                    <p className="text-sm font-medium">Processing image...</p>
                    <p className="text-xs text-muted-foreground">Running face recognition analysis</p>
                  </div>
                </div>
              ) : uploadStatus === "success" ? (
                <div className="space-y-4">
                  <CheckCircle className="h-12 w-12 mx-auto text-chart-2" />
                  <div>
                    <p className="text-sm font-medium text-chart-2">Upload successful!</p>
                    <p className="text-xs text-muted-foreground">Attendance has been marked for 28 students</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setUploadStatus("idle")}>
                    Upload Another
                  </Button>
                </div>
              ) : uploadStatus === "error" ? (
                <div className="space-y-4">
                  <AlertCircle className="h-12 w-12 mx-auto text-chart-4" />
                  <div>
                    <p className="text-sm font-medium text-chart-4">Upload failed</p>
                    <p className="text-xs text-muted-foreground">Please try again with a valid image file</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setUploadStatus("idle")}>
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Drop your image here</p>
                    <p className="text-xs text-muted-foreground">or click to browse files</p>
                  </div>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
            />
          </CardContent>
        </Card>

        {/* Camera Capture */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Camera Capture
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showCamera ? (
              <div className="text-center space-y-4">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Use your camera</p>
                  <p className="text-xs text-muted-foreground">Take a photo directly from your device</p>
                </div>
                <Button onClick={startCamera} className="bg-primary hover:bg-primary/90">
                  Start Camera
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={capturePhoto} className="flex-1 bg-primary hover:bg-primary/90">
                    Capture Photo
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
