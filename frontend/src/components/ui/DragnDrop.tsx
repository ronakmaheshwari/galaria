import { Backend_URL } from "@/config";
import axios from "axios";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface FilePreview {
  file: File;
  preview: string;
}

export default function DragAndDrop() {
  const [files, setFiles] = useState<FilePreview[]>([]);

  const token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1MDA5MzY4MSwiZXhwIjoxNzUwMTgwMDgxfQ.2kgvSi4EyMukzk1XsN-gFOEcWF2pq18l8tHKtlWrWjo"; // Replace with localStorage.getItem("token") in prod

  const onDrop = (acceptedFiles: File[]) => {
    const filePreviews = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...filePreviews]);
  };

  const uploadFiles = async () => {
    try {
      const formData = new FormData();
      files.forEach(({ file }) => formData.append("files", file));

      const response = await axios.post(`${Backend_URL}/content/upload`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Uploaded:", response.data);
      alert("Files uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload files");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    maxFiles: 10,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    onDrop,
  });

  useEffect(() => {
    return () => files.forEach((f) => URL.revokeObjectURL(f.preview));
  }, [files]);

  return (
    <section className="w-full space-y-6">

      <div
        {...getRootProps({
          className:
            "flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-100 hover:bg-gray-200 cursor-pointer transition",
        })}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600 mb-2 text-center">
          Drag and drop <span className="font-semibold text-gray-800">images/videos</span> here,
          or <span className="text-blue-600 underline">click to select files</span>
        </p>
        <em className="text-sm text-gray-400">(Max 10 files)</em>
      </div>

      {files.length > 0 && (
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-full">
            {files.map(({ file, preview }, index) => {
              const isImage = file.type.startsWith("image/");
              const isVideo = file.type.startsWith("video/");

              return (
                <div
                  key={index}
                  className="min-w-[200px] max-w-[200px] h-[150px] bg-white border rounded shadow overflow-hidden"
                >
                  {isImage ? (
                    <img
                      src={preview}
                      alt={file.name}
                      className="object-cover w-full h-full"
                    />
                  ) : isVideo ? (
                    <video
                      src={preview}
                      className="object-cover w-full h-full"
                      controls
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={uploadFiles}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded py-2 transition"
        >
          Upload Files
        </button>
      )}
    </section>
  );
}
