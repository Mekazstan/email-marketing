"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// This would come from the previous page in a real app
const sampleData = {
  name: "Tech Innovators",
  industry: "Tech",
  engagement: "Medium",
  objections: "Cost concerns",
}

export default function ReviewInputPage() {
  const router = useRouter()
  const [data] = useState(sampleData)

  const handleEdit = () => {
    router.push("/input-data")
  }

  const handleConfirm = () => {
    router.push("/processing")
  }

  return (
    <div className="container py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Review Input Data</CardTitle>
          <CardDescription>Please review the input data for accuracy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="font-semibold">Company Name:</div>
            <div>{data.name}</div>
            <div className="font-semibold">Industry:</div>
            <div>{data.industry}</div>
            <div className="font-semibold">Engagement Level:</div>
            <div>{data.engagement}</div>
            <div className="font-semibold">Potential Objections:</div>
            <div>{data.objections}</div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            Edit
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

