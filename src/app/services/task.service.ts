import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable } from "rxjs"
import type { Task, TaskCreateRequest } from "../models/task.model"

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private apiUrl = "https://api.cloudyonce-tasks.com" // Replace with your API Gateway URL
  private tasksSubject = new BehaviorSubject<Task[]>([])
  public tasks$ = this.tasksSubject.asObservable()

  constructor(private http: HttpClient) {
    this.loadTasks()
  }

  private loadTasks(): void {
    // Mock data for demo - replace with actual API call
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Complete project proposal",
        description: "Finish the Q4 project proposal for the new client",
        status: "active",
        dueDate: new Date("2024-01-15"),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        hasAttachment: true,
        aiMetadata: {
          sentiment: "neutral",
          language: "English",
          languageCode: "en",
          category: "work",
          urgencyLevel: "high",
        },
      },
      {
        id: "2",
        title: "Buy groceries",
        description: "Get milk, bread, and vegetables from the store",
        status: "active",
        dueDate: new Date("2024-01-12"),
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
        hasAttachment: false,
        aiMetadata: {
          sentiment: "positive",
          language: "English",
          languageCode: "en",
          category: "shopping",
          urgencyLevel: "medium",
        },
      },
      {
        id: "3",
        title: "Call mom",
        description: "Remember to call mom this weekend",
        status: "completed",
        dueDate: new Date("2024-01-10"),
        createdAt: new Date("2024-01-08"),
        updatedAt: new Date("2024-01-11"),
        hasAttachment: false,
        aiMetadata: {
          sentiment: "positive",
          language: "English",
          languageCode: "en",
          category: "personal",
          urgencyLevel: "low",
        },
      },
    ]
    this.tasksSubject.next(mockTasks)
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`)
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/tasks/${id}`)
  }

  createTask(task: TaskCreateRequest): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task)
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, task)
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`)
  }

  markComplete(id: string): void {
    const tasks = this.tasksSubject.value
    const taskIndex = tasks.findIndex((t) => t.id === id)
    if (taskIndex !== -1) {
      tasks[taskIndex].status = "completed"
      tasks[taskIndex].updatedAt = new Date()
      this.tasksSubject.next([...tasks])
    }
  }

  markActive(id: string): void {
    const tasks = this.tasksSubject.value
    const taskIndex = tasks.findIndex((t) => t.id === id)
    if (taskIndex !== -1) {
      tasks[taskIndex].status = "active"
      tasks[taskIndex].updatedAt = new Date()
      this.tasksSubject.next([...tasks])
    }
  }

  addTask(task: Task): void {
    const tasks = this.tasksSubject.value
    tasks.unshift(task) // Add to beginning of array
    this.tasksSubject.next([...tasks])
  }

}