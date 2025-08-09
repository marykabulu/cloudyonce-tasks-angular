import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class FileService {
  private apiUrl = "https://api.cloudyonce-tasks.com" // Replace with your API Gateway URL

  constructor(private http: HttpClient) {}

  uploadFile(file: File, taskId: string): Observable<{ fileUrl: string; fileName: string }> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("taskId", taskId)

    return this.http.post<{ fileUrl: string; fileName: string }>(`${this.apiUrl}/files/upload`, formData)
  }

  deleteFile(fileUrl: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/files`, { body: { fileUrl } })
  }

  analyzeImage(fileUrl: string): Observable<{ labels: string[]; text?: string }> {
    return this.http.post<{ labels: string[]; text?: string }>(`${this.apiUrl}/ai/rekognition`, { fileUrl })
  }
}