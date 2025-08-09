import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from "@angular/router"
import { NavBarComponent } from "./components/nav-bar/nav-bar.component"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarComponent],
  template: `
    <div class="min-h-screen bg-background text-foreground">
      <app-nav-bar></app-nav-bar>
      <main class="container mx-auto px-4 py-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AppComponent {
  title = "cloudyonce-tasks"
}