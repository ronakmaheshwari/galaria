import { useState, useCallback } from "react"
import { Upload, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Backend_URL } from "@/config"
import axios from "axios"

interface UploadedFile {
  id: string
  name: string
  size: number
  progress: number
  status: "uploading" | "completed" | "error"
  file: File
}

export function DragnDrop() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }, [])

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading",
      file
    }))

    setFiles((prev) => [...prev, ...newFiles])

    newFiles.forEach((file) => uploadFile(file))
  }

  const uploadFile = async (file: UploadedFile) => {
    try {
      const formData = new FormData()
      formData.append("files", file.file)
      const token = "Bearer " + localStorage.getItem("token")

      const config = {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: import("axios").AxiosProgressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id ? { ...f, progress, status: progress === 100 ? "completed" : "uploading" } : f
              )
            )
          }
        },
      }

      await axios.post(`${Backend_URL}/content/upload`, formData, config)

    } catch (error) {
      console.error("Upload failed:", error)
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: "error" } : f))
      )
    }
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to upload</h3>
            <p className="text-sm text-gray-600 mb-4">
              Support for a single or bulk upload. Strictly prohibit from uploading company data or other banned files
            </p>
            <input type="file" multiple onChange={handleFileInput} className="hidden" id="file-upload" accept="image/*,video/*" />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Files ({files.length})</h3>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <File className="h-8 w-8 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    {file.status === "uploading" && <Progress value={file.progress} className="mt-2 h-1" />}
                    {file.status === "completed" && <p className="text-xs text-green-600 mt-1">Upload completed</p>}
                    {file.status === "error" && <p className="text-xs text-red-600 mt-1">Upload failed</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="flex-shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
