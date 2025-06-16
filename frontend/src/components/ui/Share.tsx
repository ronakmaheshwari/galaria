import axios from "axios"
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
import { useState } from "react"
import { Backend_URL, Frontend_URL } from "@/config"

export function ShareButton() {
const [sharelink, setSharelink] = useState<string>("");

const handleShare = async()=>{
    try{
        const response = await axios.post(`${Backend_URL}/share`,{
            share:true
        },{
            headers:{
                Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1MDA5MzY4MSwiZXhwIjoxNzUwMTgwMDgxfQ.2kgvSi4EyMukzk1XsN-gFOEcWF2pq18l8tHKtlWrWjo"  //+localStorage.getItem("token")
            }
        })
        const link = response.data.link
        setSharelink(`${Frontend_URL}/share/${link}`);
    }catch(error){
        console.log(error);
    }
}
  return (
    <Dialog onOpenChange={(open) => open && handleShare()}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="bg-green-600 text-white">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={sharelink}
              readOnly
            />
          </div>
        </div>
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
