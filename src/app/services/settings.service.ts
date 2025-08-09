import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

export interface AppSettings {
  apiEndpoint: string
  aiFeatures: {
    comprehendEnabled: boolean
    translateEnabled: boolean
    pollyEnabled: boolean
    rekognitionEnabled: boolean
  }
  theme: "light" | "dark"
  userProfile?: {
    name: string
    email: string
  }
}

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private defaultSettings: AppSettings = {
    apiEndpoint: "https://api.cloudyonce-tasks.com",
    aiFeatures: {
      comprehendEnabled: true,
      translateEnabled: true,
      pollyEnabled: true,
      rekognitionEnabled: true,
    },
    theme: "light",
  }

  private settingsSubject = new BehaviorSubject<AppSettings>(this.loadSettings())
  public settings$ = this.settingsSubject.asObservable()

  private loadSettings(): AppSettings {
    const stored = localStorage.getItem("cloudyonce-settings")
    return stored ? { ...this.defaultSettings, ...JSON.parse(stored) } : this.defaultSettings
  }

  updateSettings(settings: Partial<AppSettings>): void {
    const currentSettings = this.settingsSubject.value
    const newSettings = { ...currentSettings, ...settings }
    localStorage.setItem("cloudyonce-settings", JSON.stringify(newSettings))
    this.settingsSubject.next(newSettings)

    // Apply theme
    if (settings.theme) {
      this.applyTheme(settings.theme)
    }
  }

  private applyTheme(theme: "light" | "dark"): void {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }

  getSettings(): AppSettings {
    return this.settingsSubject.value
  }
}