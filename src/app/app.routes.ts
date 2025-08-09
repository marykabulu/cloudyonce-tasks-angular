import type { Routes } from "@angular/router"
import { TaskListComponent } from "./components/task-list/task-list.component"
import { TaskDetailComponent } from "./components/task-detail/task-detail.component"
import { AnalyticsComponent } from "./components/analytics/analytics.component"
import { SettingsComponent } from "./components/settings/settings.component"

export const routes: Routes = [
  { path: "", redirectTo: "/tasks", pathMatch: "full" },
  { path: "tasks", component: TaskListComponent },
  { path: "tasks/:id", component: TaskDetailComponent },
  { path: "analytics", component: AnalyticsComponent },
  { path: "settings", component: SettingsComponent },
  { path: "**", redirectTo: "/tasks" },
]