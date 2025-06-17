import DragnDrop from "./components/ui/DragnDrop";
import ContentHeader from "./components/ui/Header";
import SharewithEmail from "./components/ui/ShareusingEmail";
import Sidebar from "./components/ui/Sidebar";

export default function Upload() {
  return (
    <div className="flex h-screen bg-gray-50 gap-4 p-4 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-6 sticky top-0 z-10 bg-white">
          <ContentHeader title="Upload Files" />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <DragnDrop />
          </div>
        </div>
        <div className="flex-1 flex-col justify-center items-center bg-amber-300">
            <SharewithEmail />
        </div>
      </div>
    </div>
  );
}
