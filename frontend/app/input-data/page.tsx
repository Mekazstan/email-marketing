"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Plus, Trash2 } from "lucide-react"

type Company = {
  id: number
  name: string
  industry: string
}

export default function InputDataPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([{ id: 1, name: "", industry: "" }])
  const [file, setFile] = useState<File | null>(null)

  const handleAddRow = () => {
    setCompanies([...companies, { id: companies.length + 1, name: "", industry: "" }])
  }

  const handleRemoveRow = (id: number) => {
    if (companies.length > 1) {
      setCompanies(companies.filter((company) => company.id !== id))
    }
  }

  const handleInputChange = (id: number, field: keyof Company, value: string) => {
    setCompanies(companies.map((company) => (company.id === id ? { ...company, [field]: value } : company)))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      // In a real app, you would parse the CSV file here
      // and update the companies state
    }
  }

  const handleSubmit = () => {
    // In a real app, you would validate the data here
    // and then send it to the server
    router.push("/processing")
  }

  return (
    <div className="container py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Input Company Data</CardTitle>
          <CardDescription>Upload a CSV file or manually enter the companies you want to target</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload CSV</Label>
            <div className="flex items-center gap-4">
              <Input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} className="w-full" />
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>
            {file && <p className="text-sm text-muted-foreground">File: {file.name}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Or Enter Manually</Label>
              <Button variant="outline" size="sm" onClick={handleAddRow} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Row
              </Button>
            </div>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Industry</TableHead>
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
                        <Input
                          value={company.industry}
                          onChange={(e) => handleInputChange(company.id, "industry", e.target.value)}
                          placeholder="Enter industry"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveRow(company.id)}
                          disabled={companies.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit}>Next</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

