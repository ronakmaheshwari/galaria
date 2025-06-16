import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutGrid,
  FolderOpen,
  UploadCloud,
  Download,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const imageFiles = Array.from({ length: 15 }, (_, i) => ({
  name: `Image ${i + 1}`,
  date: `2025-06-${String(i + 1).padStart(2, "0")}`,
  owner: "SA",
  src: `https://picsum.photos/300?random=${i + 1}`,
}));

const navLinks = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "My Files", icon: FolderOpen },
  { label: "Uploads", icon: UploadCloud },
];

export default function FileManagerPage() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(imageFiles.length / itemsPerPage);

  const paginatedFiles = imageFiles.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r">
        <div className="px-6 py-6">
          <h2 className="text-xl font-bold text-purple-600">Galeria</h2>
        </div>
        <nav className="space-y-2 px-4">
          {navLinks.map((link, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition",
                link.label === "My Files" && "bg-purple-100 text-purple-700"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">My Images</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {paginatedFiles.map((file, index) => (
            <div key={index} className="relative group rounded-md overflow-hidden shadow-sm">
              <img
                src={file.src}
                alt={file.name}
                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-70 transition flex items-center justify-center gap-4">
                <a href={file.src} download title="Download">
                  <Download className="w-6 h-6 text-white hover:text-purple-400 transition" />
                </a>
                <button title="Delete">
                  <Trash2 className="w-6 h-6 text-white hover:text-red-400 transition" />
                </button>
              </div>

              {/* Filename */}
              <div className="bg-white py-2 px-2 text-center text-sm font-medium text-gray-700 truncate">
                {file.name}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className={cn("cursor-pointer", page === 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <button
                    onClick={() => setPage(i + 1)}
                    className={cn(
                      "px-3 py-1 rounded-md text-sm",
                      page === i + 1
                        ? "bg-purple-600 text-white"
                        : "text-gray-700 hover:bg-purple-100"
                    )}
                  >
                    {i + 1}
                  </button>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                  className={cn("cursor-pointer", page >= totalPages && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  );
}



// import React, { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   Folder,
//   FileImage,
//   FileText,
//   Video,
//   File,
//   Download,
//   Trash2,
//   LayoutGrid,
//   FolderOpen,
//   UploadCloud,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const files = [
//   { name: "Defect images", tag: "#defect", date: "12 Feb 2022", owner: "SA", type: "folder" },
//   { name: "Assets", tag: "#3dgltf", date: "14 Feb 2022", owner: "SA", type: "folder" },
//   { name: "UI files", tag: "#figmafiles", date: "19 Feb 2022", owner: "JS", type: "folder" },
//   { name: "Documentation", tag: "#document", date: "27 Feb 2022", owner: "SA", type: "folder" },
//   { name: "3d credit card .jpg", tag: "#3ddesign", date: "13 Mar 2022", owner: "FR", type: "image" },
//   { name: "panel 1 image.jpg", tag: "#bgn", date: "13 Mar 2022", owner: "FR", type: "image" },
//   { name: "branding details.doc", tag: "#branding", date: "06 Apr 2022", owner: "JB", type: "doc" },
//   { name: "store 1 dataset.csv", tag: "#storedataset", date: "07 May 2022", owner: "FR", type: "file" },
//   { name: "promotion video.mp4", tag: "#promotion", date: "11 Jul 2022", owner: "FR", type: "video" },
//   { name: "Not you lyrics.doc", tag: "#lyrics", date: "12 Jul 2022", owner: "AC", type: "doc" },
// ];

// const navLinks = [
//   { label: "Dashboard", icon: LayoutGrid },
//   { label: "My Files", icon: FolderOpen },
//   { label: "Uploads", icon: UploadCloud },
// ];

// const getFileIcon = (type: string) => {
//   switch (type) {
//     case "folder": return <Folder className="text-purple-500" />;
//     case "image": return <FileImage className="text-purple-500" />;
//     case "video": return <Video className="text-purple-500" />;
//     case "doc": return <FileText className="text-purple-500" />;
//     default: return <File className="text-purple-500" />;
//   }
// };

// export default function FileManagerPage() {
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 5;
//   const totalPages = Math.ceil(files.length / itemsPerPage);

//   const paginatedFiles = files.slice(
//     (page - 1) * itemsPerPage,
//     page * itemsPerPage
//   );

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md border-r">
//         <div className="px-6 py-6">
//           <h2 className="text-xl font-bold text-purple-600">Galeria</h2>
//         </div>
//         <nav className="space-y-2 px-4">
//           {navLinks.map((link, idx) => (
//             <div
//               key={idx}
//               className={cn(
//                 "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition",
//                 link.label === "My Files" && "bg-purple-100 text-purple-700"
//               )}
//             >
//               <link.icon className="w-5 h-5" />
//               {link.label}
//             </div>
//           ))}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8">
//         <h1 className="text-3xl font-bold text-purple-600 mb-6">My Files</h1>

//         <Card className="shadow-sm">
//           <CardContent className="p-0">
//             <div className="overflow-auto">
//               <table className="w-full text-left text-sm">
//                 <thead className="bg-purple-50 text-purple-700">
//                   <tr>
//                     <th className="p-4">Asset</th>
//                     <th className="p-4">Tag</th>
//                     <th className="p-4">Created</th>
//                     <th className="p-4">Owner</th>
//                     <th className="p-4">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedFiles.map((file, i) => (
//                     <tr key={i} className="border-t hover:bg-gray-50">
//                       <td className="p-4 flex items-center gap-2 font-medium text-gray-800">
//                         {getFileIcon(file.type)} {file.name}
//                       </td>
//                       <td className="p-4 text-gray-500">{file.tag}</td>
//                       <td className="p-4 text-gray-500">{file.date}</td>
//                       <td className="p-4">
//                         <Avatar className="h-6 w-6">
//                           <AvatarFallback>{file.owner}</AvatarFallback>
//                         </Avatar>
//                       </td>
//                       <td className="p-4 flex gap-4">
//                         <a href="#" title="Download">
//                           <Download className="w-4 h-4 text-purple-500 hover:text-purple-700" />
//                         </a>
//                         <a href="#" title="Delete">
//                           <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
//                         </a>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Pagination */}
//         <div className="mt-6">
//           <Pagination>
//             <PaginationContent className="gap-1">
//               <PaginationItem>
//                 <PaginationPrevious
//                   onClick={() => setPage((p) => Math.max(p - 1, 1))}
//                   className={cn(
//                     "cursor-pointer",
//                     page === 1 && "pointer-events-none opacity-50"
//                   )}
//                 />
//               </PaginationItem>

//               {Array.from({ length: totalPages }).map((_, i) => (
//                 <PaginationItem key={i}>
//                   <button
//                     onClick={() => setPage(i + 1)}
//                     className={cn(
//                       "px-3 py-1 rounded-md text-sm",
//                       page === i + 1
//                         ? "bg-purple-600 text-white"
//                         : "text-gray-700 hover:bg-purple-100"
//                     )}
//                   >
//                     {i + 1}
//                   </button>
//                 </PaginationItem>
//               ))}

//               <PaginationItem>
//                 <PaginationNext
//                   onClick={() =>
//                     setPage((p) => (p < totalPages ? p + 1 : p))
//                   }
//                   className={cn(
//                     "cursor-pointer",
//                     page >= totalPages && "pointer-events-none opacity-50"
//                   )}
//                 />
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </div>
//       </main>
//     </div>
//   );
// }
