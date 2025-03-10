"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

export default function ProcessingPage() {
  const router = useRouter()

  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      router.push("/review")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-10 space-y-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-2xl font-bold text-center">Generating personalized emails...</h2>
          <p className="text-center text-muted-foreground">
            We're analyzing your company data and crafting personalized emails and follow-up strategies.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

