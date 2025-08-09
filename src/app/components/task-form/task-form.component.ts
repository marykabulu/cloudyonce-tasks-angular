import { Component, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { TaskService } from "../../services/task.service"
import type { Task, TaskCreateRequest } from "../../models/task.model"

@Component({
  selector: "app-task-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Add New Task</h2>
      
      <form (ngSubmit)="onSubmit()" #taskForm="ngForm">
         Title 
        <div class="space-y-2">
          <label for="title" class="block text-sm font-medium">Task Title *</label>
          <input 
            type="text" 
            id="title"
            name="title"
            [(ngModel)]="task.title"
            required
            class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter task title">
        </div>

         Description 
        <div class="space-y-2">
          <label for="description" class="block text-sm font-medium">Description *</label>
          <textarea 
            id="description"
            name="description"
            [(ngModel)]="task.description"
            required
            rows="3"
            class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Describe your task..."></textarea>
        </div>

         Due Date 
        <div class="space-y-2">
          <label for="dueDate" class="block text-sm font-medium">Due Date *</label>
          <input 
            type="date" 
            id="dueDate"
            name="dueDate"
            [(ngModel)]="dueDateString"
            required
            class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
        </div>

         File Upload 
        <div class="space-y-2">
          <label for="file" class="block text-sm font-medium">Attachment (Optional)</label>
          <input 
            type="file" 
            id="file"
            name="file"
            (change)="onFileSelected($event)"
            class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
          <p class="text-xs text-muted-foreground">
            Upload images, documents, or other files related to this task
          </p>
        </div>

         Language Selector 
        <div class="space-y-2">
          <label for="language" class="block text-sm font-medium">Force Language (Optional)</label>
          <select 
            id="language"
            name="language"
            [(ngModel)]="task.forceLanguage"
            class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
            <option value="">Auto-detect</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="zh">Chinese</option>
          </select>
          <p class="text-xs text-muted-foreground">
            Leave blank to automatically detect the language from your task description
          </p>
        </div>

         Actions 
        <div class="flex gap-3 pt-4">
          <button 
            type="submit"
            [disabled]="!taskForm.form.valid || isSubmitting"
            class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ isSubmitting ? 'Creating...' : 'Create Task' }}
          </button>
          <button 
            type="button"
            (click)="onCancel()"
            class="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
})
export class TaskFormComponent {
  @Output() taskCreated = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  task: TaskCreateRequest = {
    title: "",
    description: "",
    dueDate: new Date(),
    forceLanguage: "",
  }

  dueDateString = ""
  isSubmitting = false

  constructor(private taskService: TaskService) {
    // Set default due date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    this.task.dueDate = tomorrow
    this.dueDateString = tomorrow.toISOString().split("T")[0]
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    if (file) {
      this.task.file = file
    }
  }
/*
  onSubmit(): void {
    if (this.isSubmitting) return

    this.isSubmitting = true
    this.task.dueDate = new Date(this.dueDateString)

    // In a real app, this would call the API
    // For now, we'll simulate the API call
    setTimeout(() => {
      console.log("Creating task:", this.task)
      this.taskCreated.emit()
      this.resetForm()
      this.isSubmitting = false
    }, 1000)
  }
   */
  
  onSubmit(): void {
    if (this.isSubmitting) return
  
    this.isSubmitting = true
    this.task.dueDate = new Date(this.dueDateString)
  
    // Create a new task object with AI metadata
    const newTask: Task = {
      id: Date.now().toString(), // Simple ID generation
      title: this.task.title,
      description: this.task.description,
      status: "active",
      dueDate: this.task.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      hasAttachment: !!this.task.file,
      aiMetadata: {
        sentiment: "neutral", // Default values - would come from AI in real app
        language: this.task.forceLanguage ? this.getLanguageName(this.task.forceLanguage) : "English",
        languageCode: this.task.forceLanguage || "en",
        category: this.detectCategory(this.task.title + " " + this.task.description),
        urgencyLevel: this.detectUrgency(this.task.description),
      },
    }
  
    // Add the task to the service
    setTimeout(() => {
      this.taskService.addTask(newTask)
      console.log("Task created:", newTask)
      this.taskCreated.emit()
      this.resetForm()
      this.isSubmitting = false
    }, 1000)
  }
  
  private getLanguageName(code: string): string {
    const languages: { [key: string]: string } = {
      en: "English",
      es: "Spanish", 
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ja: "Japanese",
      ko: "Korean",
      zh: "Chinese",
    }
    return languages[code] || "English"
  }
  
  private detectCategory(text: string): string {
    const lowerText = text.toLowerCase()
    if (lowerText.includes("work") || lowerText.includes("project") || lowerText.includes("meeting")) return "work"
    if (lowerText.includes("buy") || lowerText.includes("shop") || lowerText.includes("store")) return "shopping"
    if (lowerText.includes("call") || lowerText.includes("family") || lowerText.includes("friend")) return "personal"
    if (lowerText.includes("doctor") || lowerText.includes("health") || lowerText.includes("exercise")) return "health"
    return "personal"
  }
  
  private detectUrgency(text: string): "low" | "medium" | "high" {
    const lowerText = text.toLowerCase()
    if (lowerText.includes("urgent") || lowerText.includes("asap") || lowerText.includes("immediately")) return "high"
    if (lowerText.includes("soon") || lowerText.includes("important")) return "medium"
    return "low"
  }

  onCancel(): void {
    this.cancelled.emit()
    this.resetForm()
  }

  private resetForm(): void {
    this.task = {
      title: "",
      description: "",
      dueDate: new Date(),
      forceLanguage: "",
    }
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    this.dueDateString = tomorrow.toISOString().split("T")[0]
  }
}