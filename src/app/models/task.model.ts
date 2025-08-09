export interface Task {
    id: string
    title: string
    description: string
    status: "active" | "completed"
    dueDate: Date
    createdAt: Date
    updatedAt: Date
    hasAttachment: boolean
    attachmentUrl?: string
    aiMetadata: {
      sentiment: "positive" | "negative" | "neutral"
      language: string
      languageCode: string
      category?: string
      urgencyLevel?: "low" | "medium" | "high"
    }
  }
  
  export interface TaskCreateRequest {
    title: string
    description: string
    dueDate: Date
    file?: File
    forceLanguage?: string
  }
  
  export interface AIInsights {
    sentiment: "positive" | "negative" | "neutral"
    language: string
    languageCode: string
    category: string
    urgencyLevel: "low" | "medium" | "high"
    summary: string
  }