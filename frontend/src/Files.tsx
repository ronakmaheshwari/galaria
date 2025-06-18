import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Backend_URL } from "./config";

import { PaginationBar } from "./components/ui/PaginationBar";
import { SidebarProvider } from "./components/ui/Sidebar";
import ContentHeader from "./components/ui/Header";
import AppSidebar from "./components/ui/Sidebars";

export interface GetContentSchema {
  id: number;
  url: string;
  type: "image" | "video";
  userId: number;
}

export default function FileStore() {
  const [content, setContent] = useState<GetContentSchema[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const token = "Bearer " + localStorage.getItem("token");

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${Backend_URL}/content`, {
        params: { page, limit },
        headers: {
          Authorization: token,
        },
      });
      setContent(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (id: number) => {
    try {
      await axios.delete(`${Backend_URL}/content/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      setContent((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [page, limit]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [page]);

  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row h-screen bg-gray-50 gap-2 md:gap-4 p-2 md:p-4 overflow-hidden">

        <div className="hidden md:block">
          <AppSidebar />
        </div>

        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 p-4 md:p-6 sticky top-0 z-10 bg-white">
            <ContentHeader title="Images" />
          </div>

          <div ref={contentRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {content.map((item) => (
                  <div
                    key={item.id}
                    className="relative h-64 md:h-72 rounded-lg shadow-md bg-gray-100 overflow-hidden group"
                  >
                    <a href={item.url} target="_blank">
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt="content"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <video
                          src={item.url}
                          className="object-cover w-full h-full"
                          controls
                        />
                      )}
                    </a>

                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="bg-white text-gray-700 text-xs px-2 py-1 rounded shadow hover:bg-red-500 hover:text-white mb-2"
                        onClick={() => deleteContent(item.id)}
                      >
                        Delete
                      </button>
                      <a
                        href={item.url}
                        download
                        className="bg-white text-gray-700 text-xs px-2 py-1 rounded shadow hover:bg-blue-500 hover:text-white block text-center"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 sticky bottom-0 bg-white z-10">
            <PaginationBar
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
