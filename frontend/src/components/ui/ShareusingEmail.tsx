import { useEffect, useState } from "react"
import { Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Backend_URL } from "@/config"
import axios from "axios"
import toast from "react-hot-toast"

interface EmailSchema {
  id: number
  email: string
}

export function SharewithEmail() {
  const [suggestedEmails, setSuggestedEmails] = useState<EmailSchema[]>([])
  const [filter, setFilter] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [sendingTo, setSendingTo] = useState<number | null>(null)

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      async function fetchEmails() {
        setLoading(true)
        try {
          const response = await axios.get(`${Backend_URL}/share/email`, {
            params: { filter },
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          setSuggestedEmails(response.data || [])
        } catch (err) {
          console.error("Failed to fetch emails:", err)
        } finally {
          setLoading(false)
        }
      }

      fetchEmails()
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [filter])

  const handleSend = async (id: number) => {
    try {
      setSendingTo(id)
      await axios.post(
        `${Backend_URL}/share/email`,
        { shared: id },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      const sharedUser = suggestedEmails.find((u) => u.id === id)
      toast.success(`Files shared with ${sharedUser?.email || "user"}`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to share files")
    } finally {
      setSendingTo(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Share via Email
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search-email">Search Users</Label>
          <Input
            id="search-email"
            placeholder="Search email..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="text-gray-500">Loading users...</div>
          ) : suggestedEmails.length === 0 ? (
            <div className="text-gray-500">No users found.</div>
          ) : (
            <div className="border rounded-md max-h-64 overflow-y-auto divide-y">
              {suggestedEmails.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-800">{user.email}</span>
                  <Button
                    size="sm"
                    onClick={() => handleSend(user.id)}
                    disabled={sendingTo === user.id}
                  >
                    {sendingTo === user.id ? "Sending..." : (
                      <>
                        <Send className="h-4 w-4 mr-1" />
                        Share
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
