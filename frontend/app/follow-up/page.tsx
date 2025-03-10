"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

// Sample data - in a real app, this would come from your backend
const sampleData = [
  {
    id: 1,
    name: "Company A",
    engagement: "Low",
    followUp:
      "Consider a follow-up call within 3-5 days. Focus on addressing specific pain points in their development pipeline that you identified in your research.",
  },
  {
    id: 2,
    name: "Company B",
    engagement: "High",
    followUp:
      "Send a detailed proposal with case studies from other financial institutions within 2 days. Their high engagement suggests immediate interest.",
  },
  {
    id: 3,
    name: "Company C",
    engagement: "Medium",
    followUp:
      "Schedule a demo focusing on compliance features and patient data security. Wait 1 week before following up to give them time to review your initial email.",
  },
]

export default function FollowUpPage() {
  const router = useRouter()
  const [companies] = useState(sampleData)

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
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Follow-Up Advice</CardTitle>
          <CardDescription>
            Personalized follow-up strategies to maximize engagement with your target companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Engagement Level</TableHead>
                  <TableHead>Follow-Up Advice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>
                      <Badge className={getEngagementColor(company.engagement)} variant="outline">
                        {company.engagement}
                      </Badge>
                    </TableCell>
                    <TableCell>{company.followUp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

