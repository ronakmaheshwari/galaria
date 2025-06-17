import { Backend_URL } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface EmailSchema {
  id: number;
  email: string;
}

export default function SharewithEmail() {
  const [emails, setEmails] = useState<EmailSchema[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [sendingTo, setSendingTo] = useState<number | null>(null);

  useEffect(() => {
    async function fetchEmails() {
      try {
        const response = await axios.get(
          `${Backend_URL}/share/email?filter=${filter}`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1MDA5MzY4MSwiZXhwIjoxNzUwMTgwMDgxfQ.2kgvSi4EyMukzk1XsN-gFOEcWF2pq18l8tHKtlWrWjo",
            },
          }
        );
        setEmails(response.data);
      } catch (err) {
        console.error("Failed to fetch emails:", err);
      }
    }

    fetchEmails();
  }, [filter]);

  const handleSend = async ( id: number) => {
    try {
      setSendingTo(id);

      await axios.post(
        `${Backend_URL}/share/email`,
        {shared:id},
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1MDA5MzY4MSwiZXhwIjoxNzUwMTgwMDgxfQ.2kgvSi4EyMukzk1XsN-gFOEcWF2pq18l8tHKtlWrWjo",
          },
        }
      );
      toast.success("Sent an email to your friend");
    } catch (err) {
      alert("Failed to share");
    } finally {
      setSendingTo(null);
    }
  };

  return (
    <div className="w-full h-full bg-white p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full rounded-md border-t border-dotted border-gray-300 py-3 px-4">
          <h1 className="text-lg font-semibold text-gray-800">Share via Email</h1>
        </div>

        <input
          type="email"
          placeholder="Enter recipient email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        {emails.length > 0 && (
          <div className="w-full max-h-64 overflow-y-auto border border-gray-200 rounded-md divide-y">
            {emails.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-4 py-2 hover:bg-blue-50"
              >
                <span className="text-sm text-gray-800">{item.email}</span>
                <button
                  onClick={() => handleSend(item.id)}
                  className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                  disabled={sendingTo === item.id}
                >
                  {sendingTo === item.id ? "Sending..." : "Send"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
