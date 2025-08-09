import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TaskService } from "../../services/task.service"
import type { Task } from "../../models/task.model"

@Component({
  selector: "app-analytics",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
       Header 
      <div>
        <h1 class="text-3xl font-bold">Analytics & Insights</h1>
        <p class="text-muted-foreground">AI-powered insights into your task patterns</p>
      </div>

       Overview Stats 
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-card border border-border rounded-lg p-4">
          <div class="text-2xl font-bold text-primary">{{ totalTasks }}</div>
          <div class="text-sm text-muted-foreground">Total Tasks</div>
        </div>
        <div class="bg-card border border-border rounded-lg p-4">
          <div class="text-2xl font-bold text-green-600">{{ completionRate }}%</div>
          <div class="text-sm text-muted-foreground">Completion Rate</div>
        </div>
        <div class="bg-card border border-border rounded-lg p-4">
          <div class="text-2xl font-bold text-orange-600">{{ overdueTasks }}</div>
          <div class="text-sm text-muted-foreground">Overdue Tasks</div>
        </div>
        <div class="bg-card border border-border rounded-lg p-4">
          <div class="text-2xl font-bold text-purple-600">{{ avgCompletionDays }}</div>
          <div class="text-sm text-muted-foreground">Avg Days to Complete</div>
        </div>
      </div>

       Charts Row 
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
         Sentiment Analysis Chart 
        <div class="bg-card border border-border rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Tasks by Sentiment</h2>
          <div class="space-y-3">
            <div *ngFor="let sentiment of sentimentData" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span>{{ getSentimentIcon(sentiment.name) }}</span>
                <span class="capitalize">{{ sentiment.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-32 bg-secondary rounded-full h-2">
                  <div 
                    [class]="'h-2 rounded-full ' + getSentimentColor(sentiment.name)"
                    [style.width.%]="(sentiment.count / totalTasks) * 100">
                  </div>
                </div>
                <span class="text-sm font-medium w-8">{{ sentiment.count }}</span>
              </div>
            </div>
          </div>
        </div>

         Category Breakdown 
        <div class="bg-card border border-border rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Tasks by Category</h2>
          <div class="space-y-3">
            <div *ngFor="let category of categoryData" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span>{{ getCategoryIcon(category.name) }}</span>
                <span class="capitalize">{{ category.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-32 bg-secondary rounded-full h-2">
                  <div 
                    class="h-2 rounded-full bg-primary"
                    [style.width.%]="(category.count / totalTasks) * 100">
                  </div>
                </div>
                <span class="text-sm font-medium w-8">{{ category.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

       Language Breakdown 
      <div class="bg-card border border-border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Language Distribution</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div *ngFor="let language of languageData" 
               class="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
            <div class="flex items-center gap-2">
              <span>{{ getLanguageFlag(language.code) }}</span>
              <span>{{ language.name }}</span>
            </div>
            <span class="font-medium">{{ language.count }}</span>
          </div>
        </div>
      </div>

       Priority Analysis 
      <div class="bg-card border border-border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Priority Distribution</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div *ngFor="let priority of priorityData" 
               class="flex items-center justify-between p-4 rounded-lg"
               [class]="getPriorityBgClass(priority.name)">
            <div class="flex items-center gap-2">
              <span>{{ getPriorityIcon(priority.name) }}</span>
              <span class="capitalize font-medium">{{ priority.name }} Priority</span>
            </div>
            <span class="font-bold text-lg">{{ priority.count }}</span>
          </div>
        </div>
      </div>

       AI Insights 
      <div class="bg-card border border-border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">AI-Generated Insights</h2>
        <div class="space-y-4">
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 class="font-medium text-blue-900 dark:text-blue-100 mb-2">📊 Productivity Pattern</h3>
            <p class="text-blue-800 dark:text-blue-200 text-sm">
              You tend to create more {{ getMostCommonCategory() }} tasks, with {{ getMostCommonSentiment() }} sentiment. 
              Consider breaking down larger tasks into smaller, more manageable pieces.
            </p>
          </div>
          
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 class="font-medium text-green-900 dark:text-green-100 mb-2">✅ Completion Insights</h3>
            <p class="text-green-800 dark:text-green-200 text-sm">
              Your completion rate is {{ completionRate }}%. 
              {{ completionRate > 70 ? 'Great job staying on top of your tasks!' : 'Consider setting more realistic deadlines or breaking tasks into smaller steps.' }}
            </p>
          </div>

          <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h3 class="font-medium text-orange-900 dark:text-orange-100 mb-2">⏰ Time Management</h3>
            <p class="text-orange-800 dark:text-orange-200 text-sm">
              {{ overdueTasks > 0 ? 
                'You have ' + overdueTasks + ' overdue tasks. Consider reviewing your time estimates and priorities.' :
                'No overdue tasks! You\'re managing your time well.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AnalyticsComponent implements OnInit {
  tasks: Task[] = []
  totalTasks = 0
  completionRate = 0
  overdueTasks = 0
  avgCompletionDays = 0

  sentimentData: { name: string; count: number }[] = []
  categoryData: { name: string; count: number }[] = []
  languageData: { name: string; code: string; count: number }[] = []
  priorityData: { name: string; count: number }[] = []

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks
      this.calculateAnalytics()
    })
  }

  private calculateAnalytics(): void {
    this.totalTasks = this.tasks.length

    if (this.totalTasks === 0) return

    // Completion rate
    const completedTasks = this.tasks.filter((t) => t.status === "completed").length
    this.completionRate = Math.round((completedTasks / this.totalTasks) * 100)

    // Overdue tasks
    this.overdueTasks = this.tasks.filter((t) => t.status === "active" && new Date(t.dueDate) < new Date()).length

    // Average completion days (mock calculation)
    this.avgCompletionDays = 3 // This would be calculated from actual completion data

    // Sentiment analysis
    const sentimentCounts = this.tasks.reduce(
      (acc, task) => {
        acc[task.aiMetadata.sentiment] = (acc[task.aiMetadata.sentiment] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    this.sentimentData = Object.entries(sentimentCounts).map(([name, count]) => ({
      name,
      count,
    }))

    // Category analysis
    const categoryCounts = this.tasks.reduce(
      (acc, task) => {
        const category = task.aiMetadata.category || "uncategorized"
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    this.categoryData = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    }))

    // Language analysis
    const languageCounts = this.tasks.reduce(
      (acc, task) => {
        const key = `${task.aiMetadata.language}:${task.aiMetadata.languageCode}`
        acc[key] = (acc[key] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    this.languageData = Object.entries(languageCounts).map(([key, count]) => {
      const [name, code] = key.split(":")
      return { name, code, count }
    })

    // Priority analysis
    const priorityCounts = this.tasks.reduce(
      (acc, task) => {
        const priority = task.aiMetadata.urgencyLevel || "low"
        acc[priority] = (acc[priority] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    this.priorityData = Object.entries(priorityCounts).map(([name, count]) => ({
      name,
      count,
    }))
  }

  getSentimentIcon(sentiment: string): string {
    const icons = {
      positive: "😊",
      negative: "😔",
      neutral: "😐",
    }
    return icons[sentiment as keyof typeof icons] || "😐"
  }

  getSentimentColor(sentiment: string): string {
    const colors = {
      positive: "bg-green-500",
      negative: "bg-red-500",
      neutral: "bg-gray-500",
    }
    return colors[sentiment as keyof typeof colors] || "bg-gray-500"
  }

  getCategoryIcon(category: string): string {
    const icons = {
      work: "💼",
      personal: "👤",
      shopping: "🛒",
      health: "🏥",
      education: "📚",
      uncategorized: "📝",
    }
    return icons[category as keyof typeof icons] || "📝"
  }

  getLanguageFlag(code: string): string {
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
    return flags[code] || "🌐"
  }

  getPriorityIcon(priority: string): string {
    const icons = {
      low: "🟢",
      medium: "🟡",
      high: "🔴",
    }
    return icons[priority as keyof typeof icons] || "🟢"
  }

  getPriorityBgClass(priority: string): string {
    const classes = {
      low: "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800",
      medium: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800",
      high: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800",
    }
    return classes[priority as keyof typeof classes] || classes.low
  }

  getMostCommonCategory(): string {
    if (this.categoryData.length === 0) return "general"
    return this.categoryData.reduce((prev, current) => (prev.count > current.count ? prev : current)).name
  }

  getMostCommonSentiment(): string {
    if (this.sentimentData.length === 0) return "neutral"
    return this.sentimentData.reduce((prev, current) => (prev.count > current.count ? prev : current)).name
  }
}