import ContentHeader from "@/components/ui/Header";
import { PaginationBar } from "@/components/ui/PaginationBar";
import Sidebar from "@/components/ui/Sidebar";
import { Backend_URL } from "@/config";
import type { GetContentSchema } from "@/Files";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SharedPage(){
    const {sharedId} = useParams();
    console.log(sharedId);

    const [content, setContent] = useState<GetContentSchema[]>([]);
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
    const fetchContent = async () => {
        try {
        const response = await axios.get(`${Backend_URL}/share/${sharedId}`, {
            params: { page, limit },
            headers: {
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1MDA5MzY4MSwiZXhwIjoxNzUwMTgwMDgxfQ.2kgvSi4EyMukzk1XsN-gFOEcWF2pq18l8tHKtlWrWjo"  //+ localStorage.getItem("token"),
            },
        });

        setContent(response.data.content);
        setTotalPages(response.data.totalPages);
        } catch (error) {
        console.error("Error fetching content:", error);
        }
    };

    fetchContent();
    }, [page, limit]);

    return(
        <div className="flex h-screen bg-gray-50 gap-4 p-4 overflow-hidden">
              <Sidebar />
        
              <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
                <div className="border-b border-gray-200 p-6 sticky top-0 z-10 bg-white">
                  <ContentHeader title="Shared Images" />
                </div>
        
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {content.map((item) => (
                      <div
                        key={item.id}
                        className="relative h-72 rounded-lg shadow-md bg-gray-100 overflow-hidden group"
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
                      </div>
                    ))}
                  </div>
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
    )
}