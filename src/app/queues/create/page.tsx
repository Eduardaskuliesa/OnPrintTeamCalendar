"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Mail, Tag, Loader2, X, CirclePlus } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetTags } from "@/app/lib/actions/queuesSteps/hooks/useGetTags"
import { Badge } from "@/components/ui/badge"
import { bullTimeConvert } from "@/app/utils/bullTimeConvert"
import QueueTagButton from "../tags/QueueTagButton"

interface Tag {
  tagId: string
  tagName: string
  waitDuration: number
  isActive: boolean
}

interface SelectedTag {
  tagId: string
  tagName: string
  waitDuration: number
}

interface FormData {
  email: string
  selectedTags: SelectedTag[]
}

interface FormErrors {
  email?: string
  tags?: string
}

const CreateQueueJob = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: availableTags, isLoading: isLoadingTags } = useGetTags()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [currentTagId, setCurrentTagId] = useState<string>("")

  const [formData, setFormData] = useState<FormData>({
    email: "",
    selectedTags: [],
  })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "El. paštas yra būtinas"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Neteisingas el. pašto formatas"
    }

    if (formData.selectedTags.length === 0) {
      newErrors.tags = "Pasirinkite bent vieną žymą"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTagSelect = (tagId: string) => {
    const selectedTag = availableTags?.find((tag) => tag.tagId === tagId)
    if (selectedTag && !formData.selectedTags.some((t) => t.tagId === tagId)) {
      setFormData((prev) => ({
        ...prev,
        selectedTags: [
          ...prev.selectedTags,
          {
            tagId: selectedTag.tagId,
            tagName: selectedTag.tagName,
            waitDuration: selectedTag.waitDuration,
          },
        ],
      }))
      setCurrentTagId("")
    }
    if (errors.tags) setErrors((prev) => ({ ...prev, tags: undefined }))
  }

  const removeTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.filter((tag) => tag.tagId !== tagId),
    }))
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const requestData = {
        email: formData.email,
        tags: formData.selectedTags.map((tag) => ({
          tagId: tag.tagId,
          tagName: tag.tagName,
          scheduledFor: tag.waitDuration,
        })),
      }

      const response = await fetch("http://localhost:3000/api/queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Nepavyko sukurti eilės užduočių")
      }

      toast.success("Eilės užduotys sėkmingai sukurtos")
      await queryClient.invalidateQueries({ queryKey: ["queue", "delayed"] })
      await queryClient.invalidateQueries({ queryKey: ["all-tags"] })
      router.push("/queues")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Įvyko klaida")
      console.error("Nepavyko sukurti eilių:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableTagsExist = availableTags && availableTags.filter(
    (tag) => tag.isActive && !formData.selectedTags.some((t) => t.tagId === tag.tagId)
  ).length > 0

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Sukurti naujas eilės užduotis</h1>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              El. paštas
            </label>
            <Input
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }))
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              placeholder="Įveskite el. pašto adresą"
              className={`bg-white ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex flex-row gap-6   justify-between items-center">
              <div className="w-1/2">
                <label className="text-sm font-medium flex items-center gap-2 mb-2 ">
                  <Tag className="w-4 h-4" />
                  Pasirinkite žymas
                </label>
                <Select

                  value={currentTagId}
                  onValueChange={handleTagSelect}
                  disabled={isLoadingTags || !availableTagsExist}
                >
                  <SelectTrigger className={`${errors.tags ? "border-red-500" : ""} bg-white`}>
                    <SelectValue placeholder="Pasirinkite žymas" />
                  </SelectTrigger>
                  <SelectContent className="">
                    {isLoadingTags ? (
                      <SelectItem className="bg-white " value="loading" disabled>
                        Kraunama...
                      </SelectItem>
                    ) : availableTagsExist ? (
                      availableTags
                        .filter((tag) => tag.isActive && !formData.selectedTags.some((t) => t.tagId === tag.tagId))
                        .map((tag) => (
                          <SelectItem key={tag.tagId} value={tag.tagId} className="font-medium bg-white">
                            {tag.tagName} - {bullTimeConvert(tag.waitDuration)}
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="empty" disabled>
                        Nėra galimų tagų
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <QueueTagButton
                  buttonClassName="flex mt-5 group items-center gap-2 px-4 py-2 bg-dcoffe hover:bg-vdcoffe rounded-md transition-colors whitespace-nowrap"
                  iconClassName="w-4 h-4 text-db group-hover:text-gray-50"
                >
                  <span className="flex items-center gap-2">
                    <CirclePlus className="w-4 h-4 text-db group-hover:text-gray-50" />
                    <span className="text-sm text-db group-hover:text-gray-50">
                      Sukurti naują tagą
                    </span>
                  </span>
                </QueueTagButton>
              </div>
            </div>
          </div>
          <div>

            {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}

            {formData.selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 ">
                {formData.selectedTags.map((tag) => (
                  <Badge key={tag.tagId} variant="secondary" className="flex items-center bg-slate-100 border-2 shadow-md rounded-md px-2 py-2 border-blue-50 gap-1 text-sm">
                    {tag.tagName} - {bullTimeConvert(tag.waitDuration)}
                    <button onClick={() => removeTag(tag.tagId)} className="ml-1 bg-red-100 rounded-lg p-0.5 text-red-600 hover:text-red-800">
                      <X className="h-4 w-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button onClick={handleSubmit} className="w-full bg-dcoffe hover:bg-vdcoffe transition-colors duration-200 text-db hover:text-gray-50" disabled={isSubmitting || isLoadingTags}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Kuriamos eilės...
              </>
            ) : (
              "Sukurti užduotis"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateQueueJob

