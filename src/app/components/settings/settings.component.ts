import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { SettingsService, type AppSettings } from "../../services/settings.service"

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
       Header 
      <div>
        <h1 class="text-3xl font-bold">Settings</h1>
        <p class="text-muted-foreground">Configure your app preferences and AI features</p>
      </div>

       API Configuration 
      <div class="bg-card border border-border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">API Configuration</h2>
        <div class="space-y-4">
          <div>
            <label for="apiEndpoint" class="block text-sm font-medium mb-2">API Endpoint</label>
            <input 
              type="url" 
              id="apiEndpoint"
              [(ngModel)]="settings.apiEndpoint"
              (blur)="saveSettings()"
              class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://api.cloudyonce-tasks.com">
            <p class="text-xs text-muted-foreground mt-1">
              The base URL for your API Gateway endpoint
            </p>
          </div>
        </div>
      </div>

       AI Features 
      <div class="bg-card border border-border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">AI Features</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Amazon Comprehend</h3>
              <p class="text-sm text-muted-foreground">Sentiment analysis and language detection</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.aiFeatures.comprehendEnabled"
                (change)="saveSettings()"
                class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Amazon Translate</h3>
              <p class="text-sm text-muted-foreground">Automatic text translation</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.aiFeatures.translateEnabled"
                (change)="saveSettings()"
                class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Amazon Polly</h3>
              <p class="text-sm text-muted-foreground">Text-to-speech for audio reminders</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.aiFeatures.pollyEnabled"
                (change)="saveSettings()"
                class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Amazon Rekognition</h3>
              <p class="text-sm text-muted-foreground">Image analysis for attachments</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.aiFeatures.rekognitionEnabled"
                (change)="saveSettings()"
                class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

       Theme Settings 
      <div class="bg-card border border-border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Appearance</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Theme</label>
            <div class="flex gap-3">
              <button 
                (click)="setTheme('light')"
                [class]="'flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ' + 
                         (settings.theme === 'light' ? 
                          'border-primary bg-primary/10 text-primary' : 
                          'border-border hover:bg-accent')">
                ☀️ Light
              </button>
              <button 
                (click)="setTheme('dark')"
                [class]="'flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ' + 
                         (settings.theme === 'dark' ? 
                          'border-primary bg-primary/10 text-primary' : 
                          'border-border hover:bg-accent')">
                🌙 Dark
              </button>
            </div>
          </div>
        </div>
      </div>

       User Profile 
      <div class="bg-card border border-border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">User Profile</h2>
        <div class="space-y-4">
          <div>
            <label for="userName" class="block text-sm font-medium mb-2">Name</label>
            <input 
              type="text" 
              id="userName"
              [(ngModel)]="userProfile.name"
              (blur)="saveUserProfile()"
              class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Your name">
          </div>
          <div>
            <label for="userEmail" class="block text-sm font-medium mb-2">Email</label>
            <input 
              type="email" 
              id="userEmail"
              [(ngModel)]="userProfile.email"
              (blur)="saveUserProfile()"
              class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="your.email@example.com">
          </div>
          <p class="text-xs text-muted-foreground">
            This information is stored locally and used for personalization
          </p>
        </div>
      </div>

       Data Management 
      <div class="bg-card border border-border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Data Management</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Export Data</h3>
              <p class="text-sm text-muted-foreground">Download all your tasks and settings</p>
            </div>
            <button 
              (click)="exportData()"
              class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Export
            </button>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-red-600">Reset All Data</h3>
              <p class="text-sm text-muted-foreground">Clear all tasks and reset settings to defaults</p>
            </div>
            <button 
              (click)="resetData()"
              class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>

       Save Confirmation 
      <div *ngIf="showSaveConfirmation" 
           class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg">
        Settings saved! ✅
      </div>
    </div>
  `,
})
export class SettingsComponent implements OnInit {
  settings: AppSettings = {
    apiEndpoint: "",
    aiFeatures: {
      comprehendEnabled: true,
      translateEnabled: true,
      pollyEnabled: true,
      rekognitionEnabled: true,
    },
    theme: "light",
  }

  userProfile = {
    name: "",
    email: "",
  }

  showSaveConfirmation = false

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.settings$.subscribe((settings) => {
      this.settings = { ...settings }
      this.userProfile = settings.userProfile || { name: "", email: "" }
    })
  }

  saveSettings(): void {
    this.settingsService.updateSettings(this.settings)
    this.showSaveConfirmation = true
    setTimeout(() => {
      this.showSaveConfirmation = false
    }, 2000)
  }

  saveUserProfile(): void {
    this.settingsService.updateSettings({
      userProfile: this.userProfile,
    })
    this.showSaveConfirmation = true
    setTimeout(() => {
      this.showSaveConfirmation = false
    }, 2000)
  }

  setTheme(theme: "light" | "dark"): void {
    this.settings.theme = theme
    this.saveSettings()
  }

  exportData(): void {
    const data = {
      settings: this.settings,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cloudyonce-tasks-export-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    window.URL.revokeObjectURL(url)
  }

  resetData(): void {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      localStorage.clear()
      location.reload()
    }
  }
}