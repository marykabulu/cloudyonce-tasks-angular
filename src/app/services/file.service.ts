import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import type { Observable } from "rxjs"
import { switchMap, map, catchError } from "rxjs/operators"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class FileService {
  private apiUrl = environment.apiUrl // Use environment configuration

  constructor(private http: HttpClient) {
    if (environment.enableLogging) {
      console.log('📁 File Service initialized with API URL:', this.apiUrl)
    }
  }

  uploadFile(file: File, taskId: string): Observable<{ fileUrl: string; fileName: string }> {
    const fileName = file.name;
    const contentType = file.type || "application/octet-stream";
    
    if (environment.enableLogging) {
      console.log('📁 File Service: Starting upload', { fileName, contentType, taskId, size: file.size });
    }
    
    return this.http.post<any>(
      `${this.apiUrl}/files`,
      { fileName, contentType, taskId },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      switchMap((res: any) => {
        if (environment.enableLogging) {
          console.log('📁 File Service: Presigned URL response:', res);
        }
        
        // Lambda/API Gateway may wrap payload in { body: '...' }
        let payload = res;
        if (res && typeof res === 'object' && 'body' in res) {
          try {
            payload = typeof res.body === 'string' ? JSON.parse(res.body) : res.body;
          } catch (e) {
            console.error('❌ Failed to parse presign response body:', e);
            console.error('❌ Raw response:', res);
            throw new Error('Failed to parse presigned URL response');
          }
        }
  
        const uploadUrl: string = payload?.uploadUrl;
        const fields: any = payload?.fields;
        const fileUrl: string = payload?.fileUrl;
  
        if (!uploadUrl || !fields || !fileUrl) {
          console.error('❌ Invalid presigned URL response:', { uploadUrl, fields, fileUrl, payload });
          throw new Error('Invalid presigned URL response - missing uploadUrl, fields, or fileUrl');
        }
  
        if (environment.enableLogging) {
          console.log('✅ Presigned data received:', { 
            uploadUrl, 
            fields: Object.keys(fields), 
            fileUrl,
            fieldCount: Object.keys(fields).length
          });
        }
  
        // Create FormData for S3 upload
        const formData = new FormData();
        
        // Add all presigned fields FIRST (order matters for S3)
        Object.keys(fields).forEach(key => {
          formData.append(key, fields[key]);
          if (environment.enableLogging) {
            console.log(`📝 Added field: ${key} = ${fields[key]}`);
          }
        });
        
        // Add the file LAST (must be last for S3 presigned POST)
        formData.append('file', file);
        
        if (environment.enableLogging) {
          console.log('📤 Uploading to S3:', uploadUrl);
        }
  
        // Upload to S3 using POST - S3 handles CORS, so don't use httpOptions
        // Use fetch API directly to avoid Angular HTTP interceptor issues with S3
        return new Observable(observer => {
          fetch(uploadUrl, {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header - browser will set it with boundary
          })
          .then(response => {
            if (environment.enableLogging) {
              console.log('📥 S3 upload response:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                headers: Object.fromEntries(response.headers.entries())
              });
            }
            
            if (!response.ok) {
              return response.text().then(text => {
                console.error('❌ S3 upload failed:', {
                  status: response.status,
                  statusText: response.statusText,
                  body: text
                });
                throw new Error(`S3 upload failed: ${response.status} ${response.statusText}. ${text}`);
              });
            }
            
            observer.next({
              fileUrl: fileUrl,
              fileName: fileName
            });
            observer.complete();
          })
          .catch(error => {
            console.error('❌ S3 upload error:', error);
            observer.error(new Error(`Upload failed: ${error.message || 'Network error'}`));
          });
        });
      }),
      catchError(error => {
        console.error('❌ Presigned URL generation failed:', error);
        if (environment.enableLogging) {
          console.error('❌ Error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            url: error.url
          });
        }
        
        // Provide more specific error messages
        if (error.status === 0) {
          throw new Error('Network error - check CORS settings or API Gateway configuration');
        } else if (error.status === 403) {
          throw new Error('Access denied - check Lambda IAM permissions for S3');
        } else if (error.status === 404) {
          throw new Error('Endpoint not found - check API Gateway route configuration');
        } else {
          throw error;
        }
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