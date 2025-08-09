import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router } from "@angular/router"
import { TaskService } from "../../services/task.service"
import { AIService } from "../../services/ai.service"
import type { Task } from "../../models/task.model"

@Component({
  selector: "app-task-detail",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="task" class="max-w-4xl mx-auto space-y-6">
       Header 
      <div class="flex items-center justify-between">
        <button 
          (click)="goBack()"
          class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Tasks
        </button>
        
        <div class="flex items-center gap-2">
          <button 
            (click)="toggleComplete()"
            [class]="'px-4 py-2 rounded-md transition-colors ' + 
                     (task.status === 'completed' ? 
                      'bg-green-600 text-white hover:bg-green-700' : 
                      'bg-blue-600 text-white hover:bg-blue-700')">
            {{ task.status === 'completed' ? 'Mark Active' : 'Mark Complete' }}
          </button>
          
          <button 
            (click)="deleteTask()"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Delete
          </button>
        </div>
      </div>

       Task Content 
      <div class="bg-card border border-border rounded-lg p-6">
        <div class="space-y-4">
           Title and Status 
          <div class="flex items-start justify-between gap-4">
            <h1 class="text-3xl font-bold" 
                [class.line-through]="task.status === 'completed'"
                [class.text-muted-foreground]="task.status === 'completed'">
              {{ task.title }}
            </h1>
            <span [class]="'px-3 py-1 text-sm rounded-full ' + getStatusClass()">
              {{ task.status === 'completed' ? 'Completed' : 'Active' }}
            </span>
          </div>

           Description 
          <div class="prose prose-sm max-w-none">
            <p class="text-muted-foreground whitespace-pre-wrap">{{ task.description }}</p>
          </div>

           Metadata Grid 
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <h3 class="font-medium mb-2">Task Information</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Created:</span>
                  <span>{{ task.createdAt | date:'MMM d, y h:mm a' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Due Date:</span>
                  <span [class.text-red-600]="isOverdue()">
                    {{ task.dueDate | date:'MMM d, y' }}
                    <span *ngIf="isOverdue()" class="ml-1">(Overdue)</span>
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Last Updated:</span>
                  <span>{{ task.updatedAt | date:'MMM d, y h:mm a' }}</span>
                </div>
                <div class="flex justify-between" *ngIf="task.hasAttachment">
                  <span class="text-muted-foreground">Attachment:</span>
                  <span>📎 File attached</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="font-medium mb-2">AI Insights</h3>
              <div class="space-y-2">
                 Sentiment 
                <div class="flex items-center gap-2">
                  <span class="text-sm text-muted-foreground">Sentiment:</span>
                  <span [class]="'px-2 py-1 text-xs rounded-full flex items-center gap-1 ' + getSentimentClass()">
                    <span>{{ getSentimentIcon() }}</span>
                    {{ task.aiMetadata.sentiment }}
                  </span>
                </div>

                 Language 
                <div class="flex items-center gap-2">
                  <span class="text-sm text-muted-foreground">Language:</span>
                  <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1">
                    <span>{{ getLanguageFlag() }}</span>
                    {{ task.aiMetadata.language }}
                  </span>
                </div>

                 Category 
                <div class="flex items-center gap-2" *ngIf="task.aiMetadata.category">
                  <span class="text-sm text-muted-foreground">Category:</span>
                  <span class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {{ task.aiMetadata.category }}
                  </span>
                </div>

                 Urgency 
                <div class="flex items-center gap-2" *ngIf="task.aiMetadata.urgencyLevel">
                  <span class="text-sm text-muted-foreground">Priority:</span>
                  <span [class]="'px-2 py-1 text-xs rounded-full ' + getUrgencyClass()">
                    {{ task.aiMetadata.urgencyLevel }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

       AI-Generated Insights 
      <div class="bg-card border border-border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">AI-Generated Insights</h2>
        <div class="space-y-4">
          <div class="bg-accent/50 rounded-lg p-4">
            <h3 class="font-medium mb-2">Task Analysis</h3>
            <p class="text-sm text-muted-foreground">
              This task appears to be {{ task.aiMetadata.urgencyLevel }} priority and falls under the 
              {{ task.aiMetadata.category }} category. The sentiment analysis indicates a 
              {{ task.aiMetadata.sentiment }} tone, suggesting 
              {{ getSentimentDescription() }}.
            </p>
          </div>

           Audio Playback 
          <div class="bg-accent/50 rounded-lg p-4">
            <h3 class="font-medium mb-2">Audio Reminder</h3>
            <div class="flex items-center gap-3">
              <button 
                (click)="playAudioReminder()"
                [disabled]="isGeneratingAudio"
                class="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {{ isGeneratingAudio ? 'Generating...' : '🔊 Play Reminder' }}
              </button>
              <span class="text-xs text-muted-foreground">
                Generate an audio reminder using AI text-to-speech
              </span>
            </div>
            <audio *ngIf="audioUrl" [src]="audioUrl" controls class="mt-2 w-full"></audio>
          </div>
        </div>
      </div>
    </div>

     Loading State 
    <div *ngIf="!task" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-muted-foreground">Loading task...</p>
      </div>
    </div>
  `,
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null
  audioUrl: string | null = null
  isGeneratingAudio = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private aiService: AIService,
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get("id")
    if (taskId) {
      this.loadTask(taskId)
    }
  }

  private loadTask(taskId: string): void {
    // In a real app, this would call the API
    // For now, we'll get it from the service's current tasks
    this.taskService.tasks$.subscribe((tasks) => {
      this.task = tasks.find((t) => t.id === taskId) || null
    })
  }

  getStatusClass(): string {
    if (!this.task) return ""
    return this.task.status === "completed"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  }

  getSentimentClass(): string {
    if (!this.task) return ""
    const classes = {
      positive: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      negative: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      neutral: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    }
    return classes[this.task.aiMetadata.sentiment]
  }

  getSentimentIcon(): string {
    if (!this.task) return ""
    const icons = {
      positive: "😊",
      negative: "😔",
      neutral: "😐",
    }
    return icons[this.task.aiMetadata.sentiment]
  }

  getSentimentDescription(): string {
    if (!this.task) return ""
    const descriptions = {
      positive: "an optimistic or enthusiastic approach to the task",
      negative: "some concerns or challenges that may need attention",
      neutral: "a balanced and straightforward approach",
    }
    return descriptions[this.task.aiMetadata.sentiment]
  }

  getLanguageFlag(): string {
    if (!this.task) return ""
    const flags: { [key: string]: string } = {
      en: "🇺🇸",
      es: "🇪🇸",
      fr: "🇫🇷",
      de: "🇩🇪",
      it: "🇮🇹",
      pt: "🇵🇹",
      ja: "🇯🇵",
      ko: "🇰🇷",
      zh: "🇨🇳",
    }
    return flags[this.task.aiMetadata.languageCode] || "🌐"
  }

  getUrgencyClass(): string {
    if (!this.task) return ""
    const classes = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return classes[this.task.aiMetadata.urgencyLevel || "low"]
  }

  isOverdue(): boolean {
    if (!this.task) return false
    return this.task.status === "active" && new Date(this.task.dueDate) < new Date()
  }

  toggleComplete(): void {
    if (!this.task) return

    if (this.task.status === "completed") {
      this.taskService.markActive(this.task.id)
    } else {
      this.taskService.markComplete(this.task.id)
    }
  }

  deleteTask(): void {
    if (!this.task) return

    if (confirm("Are you sure you want to delete this task?")) {
      // In a real app, this would call the API
      this.router.navigate(["/tasks"])
    }
  }

  playAudioReminder(): void {
    if (!this.task || this.isGeneratingAudio) return

    this.isGeneratingAudio = true
    const reminderText = `Reminder: ${this.task.title}. ${this.task.description}. Due date: ${new Date(this.task.dueDate).toLocaleDateString()}.`

    // In a real app, this would call the AI service
    // For now, we'll simulate the API call
    setTimeout(() => {
      // Mock audio URL - in reality this would come from Polly
      this.audioUrl = "/placeholder.mp3"
      this.isGeneratingAudio = false
    }, 2000)
  }

  goBack(): void {
    this.router.navigate(["/tasks"])
  }
}