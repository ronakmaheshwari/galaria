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
  const [rejected, setRejected] = useState<any[]>([]);

  const onDrop = (acceptedFiles: File[], fileRejections: any[]) => {
    const previews = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFiles(previews);
    setRejected(fileRejections);
  };

  const uploadFiles = async () => {
    try {
      const formData = new FormData();
      files.forEach(({ file }) => formData.append("files", file));

      const response = await axios.post(`${Backend_URL}/content/upload`, formData, {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1MDA5MzY4MSwiZXhwIjoxNzUwMTgwMDgxfQ.2kgvSi4EyMukzk1XsN-gFOEcWF2pq18l8tHKtlWrWjo", //+ localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Uploaded:", response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const { getRootProps, getInputProps, acceptedFiles, fileRejections } = useDropzone({
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
<section className="w-full">
  <div
    {...getRootProps({
      className:
        'flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-100 hover:bg-gray-200 cursor-pointer transition',
    })}
  >
    <input {...getInputProps()} />
    <p className="text-gray-600 mb-2 text-center">
      Drag and drop <span className="font-semibold text-gray-800">images/videos</span> here,
      or <span className="text-blue-600 underline">click to select files</span>
    </p>
    <em className="text-sm text-gray-400">(Max 10 files)</em>
  </div>

  <aside className="mt-4">
    {acceptedFiles.length > 0 && (
      <>
        <h4 className="font-semibold mb-2">Preview</h4>
        <ul className="grid grid-cols-2 gap-4">
          {acceptedFiles.map((file) => {
            const isImage = file.type.startsWith("image/");
            const isVideo = file.type.startsWith("video/");
            const preview = URL.createObjectURL(file);

            return (
              <li key={file.name} className="rounded overflow-hidden shadow">
                {isImage ? (
                  <img src={preview} alt={file.name} className="object-cover w-full h-32" />
                ) : isVideo ? (
                  <video src={preview} className="w-full h-32 object-cover" controls />
                ) : null}
              </li>
            );
          })}
        </ul>
      </>
    )}

    {fileRejections.length > 0 && (
      <div className="mt-4 text-red-500 text-sm">
        <h4 className="font-semibold mb-2">Rejected files</h4>
        <ul className="list-disc pl-5">
          {fileRejections.map(({ file, errors }) => (
            <li key={file.name}>
              {file.name} - {file.size} bytes
              <ul>
                {errors.map((e) => (
                  <li key={e.code}>{e.message}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    )}
  </aside>
</section>
  );
}
