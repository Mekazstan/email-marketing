"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Edit2, RefreshCw, Send } from "lucide-react"

// Sample data - in a real app, this would come from your backend
const sampleData = {
  subject: "Cutting-Edge Insurance Solutions for Tech Innovators",
  body: `Dear Tech Innovators Team,

As a leader in innovation, your company would benefit from our cutting-edge solutions that can streamline your development processes and reduce time-to-market by up to 40%. We understand that cost is a concern, but our ROI-focused approach ensures that you'll see tangible benefits within the first quarter of implementation.

Would you be open to a brief call to discuss how we can address your specific needs?

Best regards,
[Your Name]`,
  followUp:
    "Send a detailed proposal with case studies from other tech companies within 3 days. Address cost concerns by highlighting long-term savings and efficiency gains.",
}

export default function ReviewPage() {
  const router = useRouter()
  const [emailData, setEmailData] = useState(sampleData)
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    // In a real app, you would save the changes here
  }

  const handleRegenerate = () => {
    // In a real app, you would call your AI service to regenerate the email
    alert("Regenerating email...")
  }

  const handleSend = () => {
    router.push("/send")
  }

  return (
    <div className="container py-10">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Review Generated Email</CardTitle>
          <CardDescription>Review and edit the personalized email before sending</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Subject</h3>
            {isEditing ? (
              <Textarea
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              />
            ) : (
              <p>{emailData.subject}</p>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Body</h3>
            {isEditing ? (
              <Textarea
                value={emailData.body}
                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                rows={10}
              />
            ) : (
              <p className="whitespace-pre-wrap">{emailData.body}</p>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Follow-Up Advice</h3>
            <p>{emailData.followUp}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button variant="outline" className="mr-2" onClick={handleEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={handleRegenerate}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          </div>
          {isEditing ? (
            <Button onClick={handleSave}>Save Changes</Button>
          ) : (
            <Button onClick={handleSend}>
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

