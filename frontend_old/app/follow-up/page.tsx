"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

// Sample data - in a real app, this would come from your backend
const sampleData = {
  name: "Tech Innovators",
  engagement: "Medium",
  followUp:
    "Send a detailed proposal with case studies from other tech companies within 3 days. Address cost concerns by highlighting long-term savings and efficiency gains.",
}

export default function FollowUpPage() {
  const router = useRouter()
  const [company] = useState(sampleData)

  const getEngagementColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
      case "low":
        return "bg-red-100 text-red-800 hover:bg-red-100/80"
      default:
        return ""
    }
  }

  const handleExport = () => {
    // In a real app, you would generate and download a CSV file
    alert("Exporting follow-up advice as CSV...")
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <div className="container py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Follow-Up Advice</CardTitle>
          <CardDescription>Personalized follow-up strategy to maximize engagement with your prospect</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="font-semibold">Company Name:</div>
            <div>{company.name}</div>
            <div className="font-semibold">Engagement Level:</div>
            <div>
              <Badge className={getEngagementColor(company.engagement)} variant="outline">
                {company.engagement}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Follow-Up Advice:</h3>
            <p>{company.followUp}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBackToHome}>
            Back to Home
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export as CSV
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

