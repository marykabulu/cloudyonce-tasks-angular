import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AITestService {
  private apiUrl = 'https://wnrph10p1c.execute-api.us-east-1.amazonaws.com/Dev';

  constructor(private http: HttpClient) {}

  /**
   * Test all AI endpoints to verify they're working
   */
  testAllEndpoints(): Observable<{ [key: string]: any }> {
    const results: { [key: string]: any } = {};
    
    return new Observable(observer => {
      Promise.all([
        this.testEndpoint('/ai/analyze', { text: 'Test message' }).toPromise(),
        this.testEndpoint('/ai/translate', { text: 'Hello', targetLanguage: 'es' }).toPromise(),
        this.testEndpoint('/ai/polly', { text: 'Test', language: 'en' }).toPromise(),
        this.testEndpoint('/ai/detect-language', { text: 'Hello world' }).toPromise()
      ]).then(responses => {
        results['analyze'] = responses[0];
        results['translate'] = responses[1];
        results['polly'] = responses[2];
        results['detectLanguage'] = responses[3];
        observer.next(results);
        observer.complete();
      });
    });
  }

  private testEndpoint(endpoint: string, payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${endpoint}`, payload).pipe(
      map(response => ({ success: true, data: response })),
      catchError((error: HttpErrorResponse) => {
        return of({
          success: false,
          error: {
            status: error.status,
            message: error.message,
            details: error.error
          }
        });
      })
    );
  }
}