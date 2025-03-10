"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Edit2, RefreshCw, Save } from "lucide-react"

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  company: {
    id: number
    name: string
    industry: string
    email: string
  } | null
  onSave: (id: number, email: string) => void
  onRegenerate: (id: number) => void
}

export function EmailModal({ isOpen, onClose, company, onSave, onRegenerate }: EmailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedEmail, setEditedEmail] = useState("")

  if (!isOpen || !company) return null

  const handleEditClick = () => {
    setEditedEmail(company.email)
    setIsEditing(true)
  }

  const handleSaveClick = () => {
    onSave(company.id, editedEmail)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="text-xl font-bold">{company.name}</h2>
            <p className="text-sm text-muted-foreground">Industry: {company.industry}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {isEditing ? (
            <Textarea
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="min-h-[300px] text-base leading-relaxed"
            />
          ) : (
            <div className="prose max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-wrap">{company.email}</p>
            </div>
          )}
        </div>

        <div className="border-t p-4 flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveClick}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onRegenerate(company.id)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button onClick={handleEditClick}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

