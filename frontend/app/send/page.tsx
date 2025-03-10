"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"

export default function SendEmailsPage() {
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [complete, setComplete] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleSend = () => {
    setSending(true)

    // Simulate sending emails
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleViewFollowUp = () => {
    router.push("/follow-up")
  }

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Send Emails</CardTitle>
          <CardDescription>
            {!sending
              ? "Review and confirm before sending emails to your target companies"
              : complete
                ? "All emails have been sent successfully!"
                : "Sending emails to your target companies..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!sending ? (
            <div className="text-center p-6 space-y-4">
              <p className="text-lg">Are you sure you want to send these emails?</p>
              <p className="text-sm text-muted-foreground">This will send personalized emails to 3 companies.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Progress value={progress} className="h-2 w-full" />

              {complete ? (
                <div className="flex flex-col items-center justify-center p-6 space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                  <p className="text-lg font-medium">Emails sent successfully!</p>
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  Sending email {Math.ceil(progress / 10)} of 10...
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          {!sending ? (
            <>
              <Button variant="outline" onClick={() => router.back()}>
                Back
              </Button>
              <Button onClick={handleSend}>Send Emails</Button>
            </>
          ) : complete ? (
            <Button onClick={handleViewFollowUp}>View Follow-Up Advice</Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  )
}

