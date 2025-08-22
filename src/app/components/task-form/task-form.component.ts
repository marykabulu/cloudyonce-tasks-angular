import { Component, Output, EventEmitter, ViewChild } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, NgForm } from "@angular/forms"
import { TaskService } from "../../services/task.service"
import { AIService } from "../../services/ai.service"
import { FileService } from "../../services/file.service"
import type { Task, TaskCreateRequest } from "../../models/task.model"

@Component({
  selector: "app-task-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Add New Task</h2>
      
      <form (ngSubmit)="onSubmit()" #taskForm="ngForm">
        <!-- Title -->
        <div class="space-y-2">
          <label for="title" class="block text-sm font-medium">Task Title *</label>
          <input 
            type="text" 
            id="title"
            name="title"
            [(ngModel)]="task.title"
            required
            class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter task title">
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label for="description" class="block text-sm font-medium">Description *</label>
          <textarea 
            id="description"
            name="description"
            [(ngModel)]="task.description"
            required
            rows="3"
            class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Describe your task..."></textarea>
        </div>

        <!-- Due Date -->
        <div class="space-y-2">
          <label for="dueDate" class="block text-sm font-medium">Due Date *</label>
          <input 
            type="date" 
            id="dueDate"
            name="dueDate"
            [(ngModel)]="dueDateString"
            required
            class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
        </div>

        <!-- File Upload Section -->
        <!-- 
          JUNIOR DEV EXPLANATION:
          
          This section handles file uploads and AI image analysis. Here's what happens step by step:
          
          1. USER SELECTS FILE: When user picks a file, the (change)="onFileSelected($event)" event fires
          2. FILE UPLOAD: The selected file gets uploaded to AWS S3 (cloud storage) via our backend
          3. S3 URL PARSING: Once uploaded, we get back an S3 URL like:
             "https://my-bucket.s3.us-east-1.amazonaws.com/path/to/file.jpg"
          4. BUCKET/KEY EXTRACTION: We parse this URL to extract:
             - bucket: "my-bucket" (the S3 storage container name)
             - key: "path/to/file.jpg" (the file's location within the bucket)
          5. AI ANALYSIS: We send bucket + key to AWS Rekognition service to analyze the image
          6. RESULTS DISPLAY: The detected labels (like "car", "building", "person") are shown below
          
          WHY THIS APPROACH?
          - We can't send the actual file directly to Rekognition from the frontend
          - Instead, we upload to S3 first, then tell Rekognition "analyze the file at this S3 location"
          - This is a common pattern in AWS: upload → get URL → process with other services
        -->
        <div class="space-y-2">
          <label for="file" class="block text-sm font-medium">Attachment (Optional)</label>
          <input 
            type="file" 
            id="file"
            name="file"
            (change)="onFileSelected($event)"
            class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
          <p class="text-xs text-muted-foreground">
            Upload images, documents, or other files related to this task
          </p>
        </div>


        <div *ngIf="imageLabels.length" class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
  <p class="text-sm text-blue-800 font-semibold">Detected Labels:</p>
  <ul class="list-disc pl-5">
    <li *ngFor="let label of imageLabels">
      {{ label.Name }} ({{ label.Confidence }})
    </li>
  </ul>
</div>

<div *ngIf="imageAnalysisError" class="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
  <p class="text-sm text-red-800">{{ imageAnalysisError }}</p>
</div>

        

        <!-- Language Selector -->
        <div class="space-y-2">
          <label for="language" class="block text-sm font-medium">Force Language (Optional)</label>
          <select 
            id="language"
            name="language"
            [(ngModel)]="task.forceLanguage"
            class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
            <option value="">Auto-detect</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="zh">Chinese</option>
          </select>
          <p class="text-xs text-muted-foreground">
            Leave blank to automatically detect the language from your task description
          </p>
        </div>

        <!-- Translation Test -->
        <div class="space-y-2">
          <label class="block text-sm font-medium">Test Translation</label>
          <div class="flex gap-2">
            <input 
              type="text" 
              name="translationText"
              [(ngModel)]="translationText"
              placeholder="Enter text to translate"
              class="flex-1 px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
            <select 
              name="targetLanguage"
              [(ngModel)]="targetLanguage"
              class="px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="zh">Chinese</option>
            </select>
            <button 
              type="button"
              (click)="testTranslation()"
              [disabled]="isTranslating"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {{ isTranslating ? 'Translating...' : 'Translate' }}
            </button>
          </div>
          <div *ngIf="translatedText" class="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <p class="text-sm text-green-800">
              <strong>Translation:</strong> {{ translatedText }}
            </p>
          </div>
          <div *ngIf="translationError" class="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-800">{{ translationError }}</p>
          </div>
        </div>

        <!-- Audio Reminder Settings -->
        <div class="space-y-2">
          <label class="block text-sm font-medium">Audio Reminder Settings</label>
          <div class="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="enableAudioReminder"
              name="enableAudioReminder"
              [(ngModel)]="enableAudioReminder"
              (change)="onAudioReminderToggle()"
              class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
            <label for="enableAudioReminder" class="text-sm text-gray-700">
              Generate audio reminder for this task
            </label>
          </div>
          <p class="text-xs text-muted-foreground">
            When enabled, an audio reminder will be generated from your task details and played on the due date.
          </p>
          <div *ngIf="enableAudioReminder && audioReminderUrl" class="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <p class="text-sm text-green-800 mb-2">
              <strong>Audio Reminder Generated:</strong>
            </p>
            <audio controls class="w-full" preload="metadata" (error)="onAudioError($event)" (loadedmetadata)="onAudioLoaded()">
              <source [src]="audioReminderUrl" type="audio/mpeg">
              <source [src]="audioReminderUrl" type="audio/wav">
              <source [src]="audioReminderUrl" type="audio/ogg">
              Your browser does not support the audio element.
            </audio>
            <div class="mt-2 flex gap-2">
              <button 
                type="button"
                (click)="playAudioReminder()"
                class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                Play Reminder
              </button>
              <button 
                type="button"
                (click)="testAudioUrl()"
                class="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors">
                Test URL
              </button>
            </div>
            <p class="text-xs text-gray-600 mt-1">
              This reminder will play automatically on {{ dueDateString | date:'mediumDate' }}
            </p>
            <p class="text-xs text-blue-600 mt-1">
              Audio URL: <a [href]="audioReminderUrl" target="_blank" class="underline">{{ audioReminderUrl }}</a>
            </p>
          </div>
          <div *ngIf="audioError" class="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-800">{{ audioError }}</p>
          </div>
        </div>

        <!-- Error Display -->
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-red-800 text-sm">{{ errorMessage }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <button 
            type="submit"
            [disabled]="!taskForm.form.valid || isSubmitting"
            class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ isSubmitting ? 'Analyzing with AI...' : 'Create Task' }}
          </button>
          <button 
            type="button"
            (click)="onCancel()"
            class="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
})
export class TaskFormComponent {
  @Output() taskCreated = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()
  @ViewChild('taskForm') taskForm!: NgForm

  task: TaskCreateRequest = {
    title: "",
    description: "",
    dueDate: new Date(),
    forceLanguage: "",
  }

  dueDateString = ""
  isSubmitting = false
  errorMessage = ""
  translationText = ""
  targetLanguage = "es"
  translatedText = ""
  translationError = ""
  isTranslating = false
  audioText = ""
  audioLanguage = "en"
  audioUrl = ""
  audioError = ""
  isGeneratingAudio = false
  enableAudioReminder = false
  audioReminderUrl = ""

  imageLabels: { Name: string; Confidence: string }[] = [];
imageAnalysisError = "";


  constructor(
    private taskService: TaskService,
    private aiService: AIService,
    private fileService: FileService
  ) {
    // Set default due date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    this.task.dueDate = tomorrow
    this.dueDateString = tomorrow.toISOString().split("T")[0]
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    if (!file) return

    this.task.file = file
    this.imageLabels = []
    this.imageAnalysisError = ""

    // 1) Upload to S3 via backend, which returns a public/file URL
    const tempTaskId = Date.now().toString()
    this.fileService.uploadFile(file, tempTaskId).subscribe({
      next: ({ fileUrl }) => {
        // 2) Parse S3 URL into bucket/key for Rekognition
        const parsed = this.parseS3UrlToBucketKey(fileUrl)
        if (!parsed) {
          this.imageAnalysisError = "Could not parse S3 URL"
          return
        }

        // 3) Trigger AI image analysis using bucket/key
        this.aiService.analyzeImage(parsed.bucket, parsed.key).subscribe({
          next: (result: any) => {
            // Lambda Proxy Integration wraps response in 'body' property
            // Handle both string and object formats for flexibility
            let labels: any[] = []
            
            if (result.body) {
              // If body exists, parse it (could be string or object)
              if (typeof result.body === 'string') {
                try {
                  const parsedBody = JSON.parse(result.body)
                  labels = parsedBody.labels || []
                } catch (parseError) {
                  console.error('Failed to parse Lambda response body:', parseError)
                  this.imageAnalysisError = "Invalid response format from AI service"
                  return
                }
              } else {
                // Body is already an object
                labels = result.body.labels || []
              }
            } else {
              // Direct response format (fallback)
              labels = result.labels || []
            }
            
            this.imageLabels = labels
            console.log("Image labels:", this.imageLabels)
          },
          error: (error) => {
            console.error("Image analysis failed:", error)
            this.imageAnalysisError = "Failed to analyze image. Please try again."
          },
        })
      },
      error: (err) => {
        console.error("File upload failed:", err)
        this.imageAnalysisError = "Upload failed. Please try again."
      },
    })
  }

  private parseS3UrlToBucketKey(url: string): { bucket: string; key: string } | null {
    try {
      // Examples of S3 URL formats:
      // 
      // WITH FOLDERS (nested structure):
      // - https://my-bucket.s3.us-east-1.amazonaws.com/folder1/folder2/file.jpg
      // - https://s3.amazonaws.com/my-bucket/folder1/folder2/file.jpg
      // 
      // WITHOUT FOLDERS (root level):
      // - https://my-bucket.s3.us-east-1.amazonaws.com/file.jpg
      // - https://s3.amazonaws.com/my-bucket/file.jpg
      // 
      // The 'key' will include the full path including folders, or just the filename if no folders
      
      const u = new URL(url)
      const host = u.hostname
      const pathname = u.pathname.startsWith("/") ? u.pathname.slice(1) : u.pathname

      // Virtual-hosted–style: <bucket>.s3.<region>.amazonaws.com/<key>
      // This handles: my-bucket.s3.us-east-1.amazonaws.com/folder/file.jpg
      // Support both with-region and no-region hosts:
      // - <bucket>.s3.us-east-1.amazonaws.com
      // - <bucket>.s3.amazonaws.com
      const virtualHostMatch = host.match(/^([^.]+)\.s3(?:[.-][a-z0-9-]+)?\.amazonaws\.com$/)
      if (virtualHostMatch) {
        const bucket = virtualHostMatch[1]
        // key will be: "folder/file.jpg" (with folders) or "file.jpg" (without folders)
        const key = decodeURIComponent(pathname)
        return { bucket, key }
      }

      // Path-style: s3.amazonaws.com/<bucket>/<key> or s3-<region>.amazonaws.com/<bucket>/<key>
      // This handles: s3.amazonaws.com/my-bucket/folder/file.jpg
      if (host === "s3.amazonaws.com" || /^s3-[a-z0-9-]+\.amazonaws\.com$/.test(host)) {
        const [bucket, ...rest] = pathname.split("/")
        // rest.join("/") will be: "folder/file.jpg" (with folders) or "file.jpg" (without folders)
        const key = decodeURIComponent(rest.join("/"))
        if (bucket && key) return { bucket, key }
      }

      return null
    } catch {
      return null
    }
  }
  
  testTranslation(): void {
    if (!this.translationText.trim() || this.isTranslating) return

    this.isTranslating = true
    this.translationError = ""
    this.translatedText = ""

    this.aiService.translateText(this.translationText, this.targetLanguage)
      .subscribe({
        next: (result) => {
          this.translatedText = result.translatedText
          console.log('Translation result:', result)
          this.isTranslating = false
        },
        error: (error) => {
          console.error('Translation error:', error)
          this.translationError = "Translation failed. Please try again."
          this.isTranslating = false
        }
      })
  }

  generateAudio(): void {
    if (!this.audioText.trim() || this.isGeneratingAudio) return

    this.isGeneratingAudio = true
    this.audioError = ""
    this.audioUrl = ""

    this.aiService.generateAudio(this.audioText, this.audioLanguage)
      .subscribe({
        next: (result) => {
          this.audioUrl = result.audioUrl
          console.log('Audio generation result:', result)
          console.log('Generated audio URL:', this.audioUrl)
          this.isGeneratingAudio = false
        },
        error: (error) => {
          console.error('Audio generation error:', error)
          this.audioError = "Audio generation failed. Please try again."
          this.isGeneratingAudio = false
        }
      })
  }

  playAudio(): void {
    if (!this.audioUrl) {
      this.audioError = "No audio available to play"
      return
    }

    this.audioError = ""
    console.log('Attempting to play audio from:', this.audioUrl)
    
    const audio = new Audio(this.audioUrl)
    
    audio.addEventListener('loadstart', () => {
      console.log('Audio loading started')
    })
    
    audio.addEventListener('loadeddata', () => {
      console.log('Audio data loaded successfully')
    })
    
    audio.addEventListener('canplay', () => {
      console.log('Audio is ready to play')
    })
    
    audio.addEventListener('error', (e: any) => {
      console.error('Audio loading error:', e)
      const target = e.target as HTMLAudioElement
      let errorMessage = "Failed to load audio file"
      
      switch (target.error?.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "Audio loading was aborted"
          break
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "Network error while loading audio"
          break
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "Audio file is corrupted or unsupported"
          break
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "Audio format not supported"
          break
      }
      
      this.audioError = errorMessage
    })

    audio.play()
      .then(() => {
        console.log('Audio started playing successfully')
      })
      .catch(error => {
        console.error('Audio playback error:', error)
        
        if (error.name === 'NotAllowedError') {
          this.audioError = "Audio blocked by browser. Please ensure you clicked a button to play."
        } else if (error.name === 'NotSupportedError') {
          this.audioError = "Audio format not supported by this browser."
        } else if (error.name === 'AbortError') {
          this.audioError = "Audio playback was interrupted."
        } else {
          this.audioError = `Audio playback failed: ${error.message}`
        }
      })
  }

  private generateReminderText(): string {
    // Use the selected date from calendar (dueDateString) instead of task.dueDate
    const selectedDate = new Date(this.dueDateString)
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    console.log('Selected date string:', this.dueDateString)
    console.log('Formatted due date:', formattedDate)
         
    return `Reminder: Your task "${this.task?.title || 'Untitled'}" is due today, ${formattedDate}. ${this.task?.description || ''}`
  }

  private generateAudioReminder(): void {
    if (!this.enableAudioReminder) return

    const reminderText = this.generateReminderText()
         
    this.aiService.generateAudio(reminderText, this.task?.forceLanguage || 'en')
      .subscribe({
        next: (result) => {
          this.audioReminderUrl = result.audioUrl
          console.log('Audio reminder generated:', result)
          console.log('Audio reminder URL:', this.audioReminderUrl)
        },
        error: (error) => {
          console.error('Error generating audio reminder:', error)
          this.audioError = "Failed to generate audio reminder"
        }
      })
  }

  onAudioReminderToggle(): void {
    if (this.enableAudioReminder) {
      this.generateAudioReminder()
    } else {
      this.audioReminderUrl = ""
      this.audioError = ""
    }
  }

  playAudioReminder(): void {
    if (!this.audioReminderUrl) {
      this.audioError = "No audio reminder available to play"
      return
    }

    this.audioError = ""
    console.log('Attempting to play audio reminder from:', this.audioReminderUrl)
    
    const audio = new Audio(this.audioReminderUrl)
    
    audio.addEventListener('loadstart', () => {
      console.log('Audio reminder loading started')
    })
    
    audio.addEventListener('loadeddata', () => {
      console.log('Audio reminder data loaded successfully')
    })
    
    audio.addEventListener('canplay', () => {
      console.log('Audio reminder is ready to play')
    })
    
    audio.addEventListener('error', (e: any) => {
      console.error('Audio reminder loading error:', e)
      const target = e.target as HTMLAudioElement
      let errorMessage = "Failed to load audio reminder"
      
      switch (target.error?.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "Audio reminder loading was aborted"
          break
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "Network error while loading audio reminder"
          break
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "Audio reminder file is corrupted or unsupported"
          break
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "Audio reminder format not supported"
          break
      }
      
      this.audioError = errorMessage
    })

    audio.play()
      .then(() => {
        console.log('Audio reminder started playing successfully')
      })
      .catch(error => {
        console.error('Audio reminder playback error:', error)
        
        if (error.name === 'NotAllowedError') {
          this.audioError = "Audio reminder blocked by browser. Please ensure you clicked a button to play."
        } else if (error.name === 'NotSupportedError') {
          this.audioError = "Audio reminder format not supported by this browser."
        } else if (error.name === 'AbortError') {
          this.audioError = "Audio reminder playback was interrupted."
        } else {
          this.audioError = `Audio reminder playback failed: ${error.message}`
        }
      })
  }

  onAudioError(event: any): void {
    console.error('HTML5 Audio element error:', event)
    this.audioError = "Audio controls failed to load the file. The URL may be invalid or the file format unsupported."
  }

  onAudioLoaded(): void {
    console.log('HTML5 Audio element loaded successfully')
    this.audioError = ""
  }

  testAudioUrl(): void {
    if (!this.audioReminderUrl) return
    
    console.log('Testing audio URL:', this.audioReminderUrl)
    
    // Test if URL is accessible
    fetch(this.audioReminderUrl, { method: 'HEAD' })
      .then(response => {
        console.log('Audio URL test response:', {
          status: response.status,
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length')
        })
        
        if (response.ok) {
          this.audioError = `✅ URL accessible (${response.status}). Content-Type: ${response.headers.get('content-type') || 'unknown'}`
        } else {
          this.audioError = `❌ URL not accessible (${response.status})`
        }
      })
      .catch(error => {
        console.error('Audio URL test failed:', error)
        this.audioError = `❌ URL test failed: ${error.message}`
      })
  }

  onSubmit(): void {
    if (this.isSubmitting) return

    this.isSubmitting = true
    this.task.dueDate = new Date(this.dueDateString)
    this.errorMessage = ""

    const taskText = `${this.task.title} ${this.task.description}`
    
    this.aiService.analyzeText(taskText)
      .subscribe({
        next: (aiInsights) => {
          const newTask: Task = {
            id: Date.now().toString(),
            title: this.task.title,
            description: this.task.description,
            status: "active",
            dueDate: this.task.dueDate,
            createdAt: new Date(),
            updatedAt: new Date(),
            hasAttachment: !!this.task.file,
            aiMetadata: {
              sentiment: aiInsights.sentiment,
              language: aiInsights.language,
              languageCode: aiInsights.languageCode,
              category: aiInsights.category,
              urgencyLevel: aiInsights.urgencyLevel,
              audioReminderUrl: this.audioReminderUrl,
              audioReminderText: this.generateReminderText(),
            },
          }

          this.taskService.addTask(newTask)
          console.log("Task created with AI insights:", newTask)
          this.taskCreated.emit()
          this.resetForm()
          this.isSubmitting = false
        },
        error: (error) => {
          console.error("Error creating task with AI analysis:", error)
          this.errorMessage = "AI analysis failed. Creating task with default settings."
          
          const fallbackTask: Task = {
            id: Date.now().toString(),
            title: this.task.title,
            description: this.task.description,
            status: "active",
            dueDate: this.task.dueDate,
            createdAt: new Date(),
            updatedAt: new Date(),
            hasAttachment: !!this.task.file,
            aiMetadata: {
              sentiment: "neutral",
              language: this.task.forceLanguage ? this.getLanguageName(this.task.forceLanguage) : "English",
              languageCode: this.task.forceLanguage || "en",
              category: this.detectCategory(this.task.title + " " + this.task.description),
              urgencyLevel: this.detectUrgency(this.task.description),
            },
          }
          this.taskService.addTask(fallbackTask)
          this.taskCreated.emit()
          this.resetForm()
          this.isSubmitting = false
        }
      })
  }
  
  private getLanguageName(code: string): string {
    const languages: { [key: string]: string } = {
      en: "English",
      es: "Spanish", 
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ja: "Japanese",
      ko: "Korean",
      zh: "Chinese",
    }
    return languages[code] || "English"
  }
  
  private detectCategory(text: string): string {
    const lowerText = text.toLowerCase()
    if (lowerText.includes("work") || lowerText.includes("project") || lowerText.includes("meeting")) return "work"
    if (lowerText.includes("buy") || lowerText.includes("shop") || lowerText.includes("store")) return "shopping"
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

  onCancel(): void {
    this.cancelled.emit()
    this.resetForm()
  }

  private resetForm(): void {
    this.task = {
      title: "",
      description: "",
      dueDate: new Date(),
      forceLanguage: "",
    }
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    this.dueDateString = tomorrow.toISOString().split("T")[0]
    this.errorMessage = ""
    this.translationText = ""
    this.translatedText = ""
    this.translationError = ""
    this.audioText = ""
    this.audioUrl = ""
    this.audioError = ""
    this.enableAudioReminder = false
    this.audioReminderUrl = ""
  }
}  