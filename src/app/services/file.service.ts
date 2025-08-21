import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import type { Observable } from "rxjs"
import { switchMap, map, catchError } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class FileService {
  private apiUrl = "https://wnrph10p1c.execute-api.us-east-1.amazonaws.com/Dev"
 // Replace with your API Gateway URL

  constructor(private http: HttpClient) {}

  uploadFile(file: File, taskId: string): Observable<{ fileUrl: string; fileName: string }> {
    const fileName = file.name;
    const contentType = file.type || "application/octet-stream";
    
    return this.http.post<any>(
      `${this.apiUrl}/files`,
      { fileName, contentType, taskId }
    ).pipe(
      switchMap((res: any) => {
        // Lambda/API Gateway may wrap payload in { body: '...' }
        let payload = res;
        if (res && typeof res === 'object' && 'body' in res) {
          try {
            payload = typeof res.body === 'string' ? JSON.parse(res.body) : res.body;
          } catch (e) {
            console.error('Failed to parse presign response body:', e);
            throw e;
          }
        }
  
        const uploadUrl: string = payload?.uploadUrl;
        const fields: any = payload?.fields;
        const fileUrl: string = payload?.fileUrl;
  
        if (!uploadUrl || !fields || !fileUrl) {
          throw new Error('Invalid presigned URL response');
        }
  
        console.log('Presigned data:', { uploadUrl, fields, fileUrl });
  
        // Create FormData for S3 upload
        const formData = new FormData();
        
        // Add all presigned fields FIRST
        Object.keys(fields).forEach(key => {
          formData.append(key, fields[key]);
        });
        
        // Add the file LAST
        formData.append('file', file);
  
        // Upload to S3 using POST
        return this.http.post(uploadUrl, formData).pipe(
          map(() => ({
            fileUrl: fileUrl,
            fileName: fileName
          })),
          catchError(error => {
            console.error('S3 upload failed:', error);
            throw new Error(`Upload failed: ${error.status || 'Unknown error'}`);
          })
        );
      }),
      catchError(error => {
        console.error('Presigned URL generation failed:', error);
        throw error;
      })
    );
  }
  
  

  deleteFile(fileUrl: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/files`, { body: { fileUrl } })
  }

  analyzeImage(fileUrl: string): Observable<{ labels: string[]; text?: string }> {
    return this.http.post<{ labels: string[]; text?: string }>(`${this.apiUrl}/ai/image-analyze`, { fileUrl })
  }
}