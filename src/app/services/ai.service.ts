import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { catchError, timeout, map } from "rxjs/operators"
import { throwError } from "rxjs"
import type { AIInsights } from "../models/task.model"

/**
 * AI Service - Handles all AI-related API calls to the backend
 * 
 * BACKEND CONNECTION REQUIREMENTS (AWS):
 * 1. Update apiUrl to point to your actual backend server
 * 2. Ensure backend implements all endpoints listed below
 * 3. Configure CORS on backend if frontend and backend are on different domains
 * 4. Set up proper authentication/authorization if required
 * 5. Handle error responses and implement retry logic
 * 6. Use AWS SDK for service integrations
 */
@Injectable({
  providedIn: "root",
})
export class AIService {
  // 🔧 BACKEND CONFIGURATION REQUIRED:
  // Update this URL to match your actual backend server address
  // Examples:
  // - Local development: "http://localhost:3000" or "http://localhost:8080"
  // - Production: "https://your-domain.com" or "https://api.your-domain.com"
  // - Docker: "http://localhost:8000" (if using Docker containers)
  // - AWS API Gateway: "https://[api-id].execute-api.[region].amazonaws.com/[stage]"
  private apiUrl = "https://wnrph10p1c.execute-api.us-east-1.amazonaws.com/Dev"

  constructor(private http: HttpClient) {}

  /**
   * Analyzes text using AI and returns insights
   * 
   * BACKEND ENDPOINT REQUIRED: POST /ai/analyze
   * Request body: { text: string }
   * Response: AIInsights object
   * 
   * AWS IMPLEMENTATION:
   * - Use AWS Bedrock for AI text analysis (Claude, Llama, etc.)
   * - Or AWS Comprehend for sentiment analysis, entity detection
   * - Consider AWS Lambda for serverless processing
   * - Store results in DynamoDB if needed
   * - Use CloudWatch for monitoring and logging
   */
  analyzeText(text: string): Observable<AIInsights> {
    console.log('🔍 AI Service: Analyzing text:', text)
    console.log('🔍 AI Service: Calling endpoint:', `${this.apiUrl}/ai/analyze`)
    console.log('🔍 AI Service: Request payload:', { text })
    
    return this.http.post<any>(`${this.apiUrl}/ai/analyze`, { text })
      .pipe(
        timeout(10000), // 10 second timeout
        map((response) => {
          console.log('🔍 AI Service: Raw response:', response)
          
          // Transform AWS Comprehend response to expected format
          const transformedResponse: AIInsights = {
            sentiment: this.mapSentiment(response.sentiment?.Sentiment || response.Sentiment),
            language: this.detectLanguageFromText(text),
            languageCode: this.detectLanguageCodeFromText(text),
            category: this.detectCategory(text),
            urgencyLevel: this.detectUrgency(text),
            summary: `Text analyzed with ${(response.sentiment?.Sentiment || response.Sentiment)?.toLowerCase() || 'neutral'} sentiment`
          }
          
          console.log('🔍 AI Service: Transformed response:', transformedResponse)
          return transformedResponse
        }),
        catchError((error) => {
          if (error.name === 'TimeoutError') {
            console.error('⏰ AI Service: Request timed out after 10 seconds')
          } else {
            console.error('❌ AI Service Error in analyzeText:', error)
            console.error('❌ Error details:', {
              status: error.status,
              statusText: error.statusText,
              message: error.message,
              url: error.url
            })
          }
          return this.handleError(error)
        })
      )
  }

  /**
   * Translates text to target language
   * 
   * BACKEND ENDPOINT REQUIRED: POST /ai/translate
   * Request body: { text: string, targetLanguage: string }
   * Response: { translatedText: string }
   * 
   * AWS IMPLEMENTATION:
   * - Use AWS Translate service for language translation
   * - Configure supported language pairs
   * - Consider caching translations in ElastiCache or DynamoDB
   * - Use CloudFront for global distribution if needed
   * - Monitor costs with AWS Cost Explorer
   */
  translateText(text: string, targetLanguage: string): Observable<{ translatedText: string }> {
    console.log('🌐 AI Service: Translating text:', text)
    console.log('🌐 AI Service: Target language:', targetLanguage)
    console.log('🌐 AI Service: Calling endpoint:', `${this.apiUrl}/ai/translate`)
    console.log('🌐 AI Service: Request payload:', { text, targetLanguage })
    
    return this.http.post<{ translatedText: string }>(`${this.apiUrl}/ai/translate`, {
      text,
      targetLanguage,
    }).pipe(
      map((response) => {
        console.log('🌐 AI Service: Translation response:', response)
        return response
      }),
      catchError((error) => {
        console.error('❌ AI Service Error in translateText:', error)
        return this.handleError(error)
      })
    )
  }

  /**
   * Generates audio from text using text-to-speech
   * 
   * BACKEND ENDPOINT REQUIRED: POST /ai/polly
   * Request body: { text: string, language: string }
   * Response: { audioUrl: string }
   * 
   * AWS IMPLEMENTATION:
   * - Use AWS Polly for text-to-speech conversion
   * - Store generated audio files in S3
   * - Use CloudFront for audio file delivery
   * - Implement S3 lifecycle policies for cleanup
   * - Consider using Polly Neural voices for better quality
   * - Monitor S3 storage costs
   */
  generateAudio(text: string, language = "en"): Observable<{ audioUrl: string }> {
    return this.http.post<{ audioUrl: string }>(`${this.apiUrl}/ai/polly`, {
      text,
      language,
    }).pipe(catchError(this.handleError))
  }

  /**
   * Detects the language of input text
   * 
   * BACKEND ENDPOINT REQUIRED: POST /ai/detect-language
   * Request body: { text: string }
   * Response: { language: string, languageCode: string, confidence: number }
   * 
   * AWS IMPLEMENTATION:
   * - Use AWS Comprehend for language detection
   * - Or AWS Translate detect_language API
   * - Consider minimum text length requirements
   * - Return confidence score for reliability
   * - Cache results in ElastiCache for repeated text
   */
  detectLanguage(text: string): Observable<{ language: string; languageCode: string; confidence: number }> {
    return this.http.post<{ language: string; languageCode: string; confidence: number }>(
      `${this.apiUrl}/ai/detect-language`,
      { text },
    ).pipe(catchError(this.handleError))
  }

  private handleError(error: any) {
    console.error('AI Service Error:', error)
    return throwError(() => error)
  }

  // Helper methods to transform AWS Comprehend response
  private mapSentiment(awsSentiment: string): "positive" | "negative" | "neutral" {
    if (!awsSentiment) return "neutral"
    switch (awsSentiment.toUpperCase()) {
      case "POSITIVE": return "positive"
      case "NEGATIVE": return "negative"
      case "NEUTRAL": return "neutral"
      case "MIXED": return "neutral"
      default: return "neutral"
    }
  }

  private detectLanguageFromText(text: string): string {
    // Simple language detection based on common words
    const lowerText = text.toLowerCase()
    if (lowerText.includes("hola") || lowerText.includes("gracias")) return "Spanish"
    if (lowerText.includes("bonjour") || lowerText.includes("merci")) return "French"
    if (lowerText.includes("hallo") || lowerText.includes("danke")) return "German"
    return "English" // Default to English
  }

  private detectLanguageCodeFromText(text: string): string {
    const lowerText = text.toLowerCase()
    if (lowerText.includes("hola") || lowerText.includes("gracias")) return "es"
    if (lowerText.includes("bonjour") || lowerText.includes("merci")) return "fr"
    if (lowerText.includes("hallo") || lowerText.includes("danke")) return "de"
    return "en" // Default to English
  }

  private detectCategory(text: string): string {
    const lowerText = text.toLowerCase()
    if (lowerText.includes("work") || lowerText.includes("project") || lowerText.includes("meeting")) return "work"
    if (lowerText.includes("buy") || lowerText.includes("shop") || lowerText.includes("store") || lowerText.includes("roses")) return "shopping"
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
}