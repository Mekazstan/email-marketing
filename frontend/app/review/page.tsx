"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Edit2, RefreshCw, Maximize2 } from "lucide-react"
import { EmailModal } from "@/components/email-modal"

// Sample data - in a real app, this would come from your backend
const sampleData = [
  {
    id: 1,
    name: "Company A",
    industry: "Tech",
    email:
      "As a leader in innovation, your company would benefit from our cutting-edge solutions that can streamline your development processes and reduce time-to-market by up to 40%.",
    followUp: "Follow up with a call to discuss specific pain points in their development pipeline.",
  },
  {
    id: 2,
    name: "Company B",
    industry: "Finance",
    email:
      "In the fast-paced world of finance, security and ROI are paramount. Our solutions have helped financial institutions reduce fraud by 30% while increasing customer satisfaction scores.",
    followUp: "Send a detailed proposal with case studies from other financial institutions.",
  },
  {
    id: 3,
    name: "Company C",
    industry: "Healthcare",
    email:
      "With increasing regulatory requirements in healthcare, our compliance-focused solutions can help you maintain HIPAA compliance while improving patient outcomes through better data management.",
    followUp: "Schedule a demo focusing on compliance features and patient data security.",
  },
]

export default function ReviewPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState(sampleData)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<(typeof sampleData)[0] | null>(null)

  const handleEdit = (id: number, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const handleSaveEdit = () => {
    if (editingId) {
      setCompanies(companies.map((company) => (company.id === editingId ? { ...company, email: editText } : company)))
      setEditingId(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleRegenerate = (id: number) => {
    // In a real app, you would call your AI service to regenerate the email
    alert(`Regenerating email for ${companies.find((c) => c.id === id)?.name}`)
  }

  const handleSendEmails = () => {
    router.push("/send")
  }

  const openEmailModal = (company: (typeof sampleData)[0]) => {
    setSelectedCompany(company)
    setModalOpen(true)
  }

  const closeEmailModal = () => {
    setModalOpen(false)
    setSelectedCompany(null)
  }

  const handleSaveEmailFromModal = (id: number, email: string) => {
    setCompanies(companies.map((company) => (company.id === id ? { ...company, email: email } : company)))
  }

  // Update the TableRow to include a button to open the modal
  // In the TableBody section, update the Actions cell to include the Maximize button
  return (
    <div className="container py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Review Generated Emails</CardTitle>
          <CardDescription>Review and edit the personalized emails before sending them</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="emails">
            <TabsList className="mb-4">
              <TabsTrigger value="emails">Emails</TabsTrigger>
              <TabsTrigger value="followup">Follow-Up Advice</TabsTrigger>
            </TabsList>
            <TabsContent value="emails">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Personalized Email</TableHead>
                      <TableHead className="w-[160px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>{company.industry}</TableCell>
                        <TableCell>
                          {editingId === company.id ? (
                            <div className="space-y-2">
                              <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={4} />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleSaveEdit}>
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="line-clamp-3">{company.email}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(company.id, company.email)}
                              disabled={editingId !== null}
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRegenerate(company.id)}
                              disabled={editingId !== null}
                              title="Regenerate"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEmailModal(company)}
                              disabled={editingId !== null}
                              title="View Full Screen"
                            >
                              <Maximize2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="followup">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Follow-Up Advice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>{company.industry}</TableCell>
                        <TableCell>{company.followUp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSendEmails}>Send Emails</Button>
        </CardFooter>
      </Card>

      <EmailModal
        isOpen={modalOpen}
        onClose={closeEmailModal}
        company={selectedCompany}
        onSave={handleSaveEmailFromModal}
        onRegenerate={handleRegenerate}
      />
    </div>
  )
}

