import { cn } from "@/lib/utils";
import { FolderOpen, LayoutGrid, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Dashboard", icon: LayoutGrid, navigator:"/files"},
  { label: "My Files", icon: FolderOpen, navigator:"/files"},
  { label: "Uploads", icon: UploadCloud,navigator:"/upload" },
];

export default function Sidebar(){
  const navigate = useNavigate();
    return(
    <aside className="w-64 bg-white shadow-md border-r rounded-md">
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
              onClick={()=>{navigate(link.navigator)}}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </div>
          ))}
        </nav>
      </aside>
    )
}