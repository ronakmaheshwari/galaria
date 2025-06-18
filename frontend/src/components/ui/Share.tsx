import axios from "axios"
import { useState } from "react"
import { Backend_URL, Frontend_URL } from "@/config"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"
import toast from "react-hot-toast"

export function ShareButton() {
  const [sharelink, setSharelink] = useState<string>("")

  const handleShare = async () => {
    try {
      const response = await axios.post(
        `${Backend_URL}/share`,
        { share: true },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      const link = response.data.link
      setSharelink(`${Frontend_URL}/share/${link}`)
    } catch (error) {
      console.error("Error sharing:", error)
      toast.error("Failed to generate share link")
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(sharelink)
    toast.success("Link copied to clipboard")
  }

  return (
    <Dialog onOpenChange={(open) => open && handleShare()}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="bg-green-600 text-white">
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Link</DialogTitle>
          <DialogDescription>
            Anyone with this link will be able to view your shared content.
          </DialogDescription>
        </DialogHeader>

        {sharelink && (
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Shareable Link
              </Label>
              <Input
                id="link"
                value={sharelink}
                readOnly
                onFocus={(e) => e.target.select()}
              />
            </div>
            <Button type="button" variant="outline" onClick={handleCopy}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        )}

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
