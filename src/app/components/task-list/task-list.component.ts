import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { TaskService } from "../../services/task.service"
import type { Task } from "../../models/task.model"
import { TaskItemComponent } from "../task-item/task-item.component"
import { TaskFormComponent } from "../task-form/task-form.component"

@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TaskItemComponent, TaskFormComponent],
  template: `
    <div class="space-y-6">
       Header 
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold">Tasks</h1>
          <p class="text-muted-foreground">Manage your tasks with AI-powered insights</p>
        </div>
        <button 
          (click)="showAddForm = !showAddForm"
          class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          {{ showAddForm ? 'Cancel' : 'Add Task' }}
        </button>
      </div>

       Add Task Form 
      <div *ngIf="showAddForm" class="bg-card border border-border rounded-lg p-6">
        <app-task-form (taskCreated)="onTaskCreated()" (cancelled)="showAddForm = false"></app-task-form>
      </div>

       Filters 
      <div class="flex flex-wrap gap-2">
        <button 
          *ngFor="let filter of filters"
          (click)="activeFilter = filter.value; filterTasks()"
          [class]="'px-3 py-1 rounded-full text-sm transition-colors ' + 
                   (activeFilter === filter.value ? 
                    'bg-primary text-primary-foreground' : 
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80')">
          {{ filter.label }} ({{ getFilterCount(filter.value) }})
        </button>
      </div>

       Task Stats 
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-card border border-border rounded-lg p-4">
          <div class="text-2xl font-bold text-primary">{{ getTotalTasks() }}</div>
          <div class="text-sm text-muted-foreground">Total Tasks</div>
        </div>
        <div class="bg-card border border-border rounded-lg p-4">
          <div class="text-2xl font-bold text-green-600">{{ getCompletedTasks() }}</div>
          <div class="text-sm text-muted-foreground">Completed</div>
        </div>
        <div class="bg-card border border-border rounded-lg p-4">
          <div class="text-2xl font-bold text-orange-600">{{ getActiveTasks() }}</div>
          <div class="text-sm text-muted-foreground">Active</div>
        </div>
      </div>

       Tasks List 
      <div class="space-y-3">
        <div *ngIf="filteredTasks.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📝</div>
          <h3 class="text-lg font-medium mb-2">No tasks found</h3>
          <p class="text-muted-foreground">
            {{ activeFilter === 'all' ? 'Create your first task to get started!' : 'No tasks match the current filter.' }}
          </p>
        </div>

        <app-task-item 
          *ngFor="let task of filteredTasks; trackBy: trackByTaskId"
          [task]="task"
          (taskUpdated)="onTaskUpdated($event)"
          (taskDeleted)="onTaskDeleted($event)">
        </app-task-item>
      </div>
    </div>
  `,
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = []
  filteredTasks: Task[] = []
  activeFilter: "all" | "active" | "completed" = "all"
  showAddForm = false

  filters = [
    { label: "All", value: "all" as const },
    { label: "Active", value: "active" as const },
    { label: "Completed", value: "completed" as const },
  ]

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks
      this.filterTasks()
    })
  }

  filterTasks(): void {
    if (this.activeFilter === "all") {
      this.filteredTasks = this.tasks
    } else {
      this.filteredTasks = this.tasks.filter((task) => task.status === this.activeFilter)
    }
  }

  getFilterCount(filter: "all" | "active" | "completed"): number {
    if (filter === "all") return this.tasks.length
    return this.tasks.filter((task) => task.status === filter).length
  }

  getTotalTasks(): number {
    return this.tasks.length
  }

  getCompletedTasks(): number {
    return this.tasks.filter((task) => task.status === "completed").length
  }

  getActiveTasks(): number {
    return this.tasks.filter((task) => task.status === "active").length
  }

  onTaskCreated(): void {
    this.showAddForm = false
    // Task list will update automatically via the service subscription
  }

  onTaskUpdated(task: Task): void {
    // Task list will update automatically via the service subscription
  }

  onTaskDeleted(taskId: string): void {
    // Task list will update automatically via the service subscription
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id
  }
}