import { DragnDrop } from "./components/ui/DragnDrop";
import ContentHeader from "./components/ui/Header";
import { SharewithEmail } from "./components/ui/ShareusingEmail";
import { SidebarInset, SidebarProvider } from "./components/ui/Sidebar";
import AppSidebar from "./components/ui/Sidebars";


export default function Upload() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-screen bg-gray-50">
          <div className="border-b border-gray-200 p-6 sticky top-0 z-10 bg-white">
            <ContentHeader title="Upload Files" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 sm:space-y-10">
            <div className="max-w-3xl mx-auto">
              <DragnDrop />
            </div>

            <div className="max-w-3xl mx-auto">
              <SharewithEmail />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
