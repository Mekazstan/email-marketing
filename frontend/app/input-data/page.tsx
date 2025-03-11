"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Plus, Trash2 } from "lucide-react"

type Company = {
  id: number
  name: string
  industry: string
  engagement: string
  objections: string
}

export default function InputDataPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState<"upload" | "manual">("upload")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0]
      setFile(uploadedFile)

      // Parse CSV file
      const text = await uploadedFile.text()
      const rows = text.split("\n")
      const headers = rows[0].split(",")
      const parsedCompanies = rows.slice(1).map((row, index) => {
        const values = row.split(",")
        return {
          id: index + 1,
          name: values[headers.indexOf("name")] || "",
          industry: values[headers.indexOf("industry")] || "",
          engagement: values[headers.indexOf("engagement")] || "",
          objections: values[headers.indexOf("objections")] || "",
        }
      })
      setCompanies(parsedCompanies)
    }
  }

  const handleAddCompany = () => {
    setCompanies([...companies, { id: companies.length + 1, name: "", industry: "", engagement: "", objections: "" }])
  }

  const handleRemoveCompany = (id: number) => {
    setCompanies(companies.filter((company) => company.id !== id))
  }

  const handleInputChange = (id: number, field: keyof Company, value: string) => {
    setCompanies(companies.map((company) => (company.id === id ? { ...company, [field]: value } : company)))
  }

  const handleSubmit = () => {
    // In a real app, you would validate the data here
    // and then send it to the server
    router.push("/review-input")
  }

  return (
    <div className="container py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Input Prospect Details</CardTitle>
          <CardDescription>Upload a CSV file or manually enter the companies you want to target</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "upload" | "manual")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload CSV</TabsTrigger>
              <TabsTrigger value="manual">Manual Input</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-4">
              <div className="flex items-center gap-4">
                <Input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} className="w-full" />
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </div>
              {file && <p className="text-sm text-muted-foreground">File: {file.name}</p>}
            </TabsContent>
            <TabsContent value="manual">
              <Button variant="outline" size="sm" onClick={handleAddCompany} className="mb-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>
            </TabsContent>
          </Tabs>

          {companies.length > 0 && (
            <div className="mt-6 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Objections</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <Input
                          value={company.name}
                          onChange={(e) => handleInputChange(company.id, "name", e.target.value)}
                          placeholder="Enter company name"
                        />
                      </TableCell>
                      <TableCell>
                        <Select onValueChange={(value) => handleInputChange(company.id, "industry", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tech">Tech</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select onValueChange={(value) => handleInputChange(company.id, "engagement", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={company.objections}
                          onChange={(e) => handleInputChange(company.id, "objections", e.target.value)}
                          placeholder="Enter objections"
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveCompany(company.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit} disabled={companies.length === 0}>
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

