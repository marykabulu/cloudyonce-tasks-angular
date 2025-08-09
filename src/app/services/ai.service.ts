import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { AIInsights } from "../models/task.model"

@Injectable({
  providedIn: "root",
})
export class AIService {
  private apiUrl = "https://api.cloudyonce-tasks.com" // Replace with your API Gateway URL

  constructor(private http: HttpClient) {}

  analyzeText(text: string): Observable<AIInsights> {
    return this.http.post<AIInsights>(`${this.apiUrl}/ai/analyze`, { text })
  }

  translateText(text: string, targetLanguage: string): Observable<{ translatedText: string }> {
    return this.http.post<{ translatedText: string }>(`${this.apiUrl}/ai/translate`, {
      text,
      targetLanguage,
    })
  }

  generateAudio(text: string, language = "en"): Observable<{ audioUrl: string }> {
    return this.http.post<{ audioUrl: string }>(`${this.apiUrl}/ai/polly`, {
      text,
      language,
    })
  }

  detectLanguage(text: string): Observable<{ language: string; languageCode: string; confidence: number }> {
    return this.http.post<{ language: string; languageCode: string; confidence: number }>(
      `${this.apiUrl}/ai/detect-language`,
      { text },
    )
  }
}