"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"

export default function SendEmailsPage() {
  const router = useRouter()
  const [stage, setStage] = useState<"confirm" | "sending" | "sent">("confirm")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (stage === "sending") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setStage("sent")
            return 100
          }
          return prev + 10
        })
      }, 300)
      return () => clearInterval(interval)
    }
  }, [stage])

  const handleSend = () => {
    setStage("sending")
  }

  const handleViewFollowUp = () => {
    router.push("/follow-up")
  }

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Send Email</CardTitle>
          <CardDescription>
            {stage === "confirm"
              ? "Review and confirm before sending the email"
              : stage === "sending"
                ? "Sending email to your prospect..."
                : "Email sent successfully!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {stage === "confirm" ? (
            <div className="text-center p-6 space-y-4">
              <p className="text-lg">Are you sure you want to send this email?</p>
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Progress value={progress} className="h-2 w-full" />
              {stage === "sent" && (
                <div className="flex flex-col items-center justify-center p-6 space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                  <p className="text-lg font-medium">Email sent successfully!</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          {stage === "confirm" ? (
            <>
              <Button variant="outline" onClick={() => router.back()}>
                Back
              </Button>
              <Button onClick={handleSend}>Send Email</Button>
            </>
          ) : stage === "sent" ? (
            <Button onClick={handleViewFollowUp}>View Follow-Up Advice</Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  )
}

