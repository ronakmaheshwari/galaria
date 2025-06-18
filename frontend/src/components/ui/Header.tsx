import { SidebarTrigger } from "@/components/ui/Sidebar"
import { Separator } from "@/components/ui/separator"
import { ShareButton } from "./Share"

interface ContentHeaderProps {
  title: string
  description?: string
}

export default function ContentHeader({ title, description }: ContentHeaderProps) {
  return (
    <div className="flex items-start md:items-center justify-between w-full flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
      </div>

      <div className="shrink-0">
        <ShareButton />
      </div>
    </div>
  );
}






