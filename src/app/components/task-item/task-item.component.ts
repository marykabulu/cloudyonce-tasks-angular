import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import type { Task } from "../../models/task.model"
import { TaskService } from "../../services/task.service"

@Component({
  selector: "app-task-item",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between gap-4">
         Task Content 
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-2">
            <h3 class="font-medium text-lg truncate" 
                [class.line-through]="task.status === 'completed'"
                [class.text-muted-foreground]="task.status === 'completed'">
              {{ task.title }}
            </h3>
            
             Status Badge 
            <span [class]="'px-2 py-1 text-xs rounded-full ' + getStatusClass()">
              {{ task.status === 'completed' ? 'Completed' : 'Active' }}
            </span>
          </div>

          <p class="text-muted-foreground text-sm mb-3 line-clamp-2">
            {{ task.description }}
          </p>

           AI Metadata 
          <div class="flex flex-wrap items-center gap-2 mb-3">
             Sentiment Badge 
            <span [class]="'px-2 py-1 text-xs rounded-full flex items-center gap-1 ' + getSentimentClass()">
              <span>{{ getSentimentIcon() }}</span>
              {{ task.aiMetadata.sentiment }}
            </span>

             Language Badge 
            <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1">
              <span>{{ getLanguageFlag() }}</span>
              {{ task.aiMetadata.language }}
            </span>

             Category Badge 
            <span *ngIf="task.aiMetadata.category" 
                  class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {{ task.aiMetadata.category }}
            </span>

             Urgency Badge 
            <span *ngIf="task.aiMetadata.urgencyLevel" 
                  [class]="'px-2 py-1 text-xs rounded-full ' + getUrgencyClass()">
              {{ task.aiMetadata.urgencyLevel }} priority
            </span>

             Attachment Icon 
            <span *ngIf="task.hasAttachment" 
                  class="text-muted-foreground" title="Has attachment">
              📎
            </span>
          </div>

           Due Date 
          <div class="text-sm text-muted-foreground">
            Due: {{ task.dueDate | date:'MMM d, y' }}
            <span *ngIf="isOverdue()" class="text-red-600 ml-2">(Overdue)</span>
          </div>
        </div>

         Actions 
        <div class="flex items-center gap-2">
          <button 
            (click)="toggleComplete()"
            [class]="'p-2 rounded-md transition-colors ' + 
                     (task.status === 'completed' ? 
                      'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' : 
                      'text-muted-foreground hover:bg-accent')">
            {{ task.status === 'completed' ? '↩️' : '✅' }}
          </button>

          <a [routerLink]="['/tasks', task.id]" 
             class="p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors">
            👁️
          </a>

          <button 
            (click)="deleteTask()"
            class="p-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            🗑️
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TaskItemComponent {
  @Input() task!: Task
  @Output() taskUpdated = new EventEmitter<Task>()
  @Output() taskDeleted = new EventEmitter<string>()

  constructor(private taskService: TaskService) {}

  getStatusClass(): string {
    return this.task.status === "completed"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  }

  getSentimentClass(): string {
    const classes = {
      positive: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      negative: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      neutral: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    }
    return classes[this.task.aiMetadata.sentiment]
  }

  getSentimentIcon(): string {
    const icons = {
      positive: "😊",
      negative: "😔",
      neutral: "😐",
    }
    return icons[this.task.aiMetadata.sentiment]
  }

  getLanguageFlag(): string {
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
    const classes = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return classes[this.task.aiMetadata.urgencyLevel || "low"]
  }

  isOverdue(): boolean {
    return this.task.status === "active" && new Date(this.task.dueDate) < new Date()
  }

  toggleComplete(): void {
    if (this.task.status === "completed") {
      this.taskService.markActive(this.task.id)
    } else {
      this.taskService.markComplete(this.task.id)
    }
  }

  deleteTask(): void {
    if (confirm("Are you sure you want to delete this task?")) {
      this.taskDeleted.emit(this.task.id)
    }
  }
}