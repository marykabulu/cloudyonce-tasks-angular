import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { SettingsService } from "../../services/settings.service"

@Component({
  selector: "app-nav-bar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-card border-b border-border">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
           Logo 
          <div class="flex items-center space-x-2">
            <div class="text-2xl">✨</div>
            <h1 class="text-xl font-bold text-primary">Cloudyoncé Tasks</h1>
          </div>

           Navigation Links 
          <div class="hidden md:flex items-center space-x-6">
            <a routerLink="/tasks" 
               routerLinkActive="text-primary font-medium"
               class="text-muted-foreground hover:text-foreground transition-colors">
              Tasks
            </a>
            <a routerLink="/analytics" 
               routerLinkActive="text-primary font-medium"
               class="text-muted-foreground hover:text-foreground transition-colors">
              Analytics
            </a>
            <a routerLink="/settings" 
               routerLinkActive="text-primary font-medium"
               class="text-muted-foreground hover:text-foreground transition-colors">
              Settings
            </a>
          </div>

           Theme Toggle 
          <button 
            (click)="toggleTheme()"
            class="p-2 rounded-md hover:bg-accent transition-colors">
            <span class="text-lg">{{ isDark ? '☀️' : '🌙' }}</span>
          </button>

           Mobile Menu Button 
          <button 
            (click)="toggleMobileMenu()"
            class="md:hidden p-2 rounded-md hover:bg-accent">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

         Mobile Menu 
        <div *ngIf="showMobileMenu" class="md:hidden py-4 border-t border-border">
          <div class="flex flex-col space-y-2">
            <a routerLink="/tasks" 
               routerLinkActive="text-primary font-medium"
               (click)="closeMobileMenu()"
               class="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
              Tasks
            </a>
            <a routerLink="/analytics" 
               routerLinkActive="text-primary font-medium"
               (click)="closeMobileMenu()"
               class="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
              Analytics
            </a>
            <a routerLink="/settings" 
               routerLinkActive="text-primary font-medium"
               (click)="closeMobileMenu()"
               class="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
              Settings
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavBarComponent implements OnInit {
  isDark = false
  showMobileMenu = false

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.settings$.subscribe((settings) => {
      this.isDark = settings.theme === "dark"
    })
  }

  toggleTheme(): void {
    const newTheme = this.isDark ? "light" : "dark"
    this.settingsService.updateSettings({ theme: newTheme })
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false
  }
}