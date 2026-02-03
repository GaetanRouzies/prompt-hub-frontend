import { Routes } from '@angular/router'

import { authGuard } from './auth/auth.guard'
import { AuthFormComponent } from './auth/auth-form/auth-form'
import { PromptListComponent } from './prompts/prompt-list/prompt-list'
import { PromptFormComponent } from './prompts/prompt-form/prompt-form'

export const routes: Routes = [
  { path: '', redirectTo: 'prompts', pathMatch: 'full' },
  { path: 'auth', component: AuthFormComponent },
  { path: 'prompts', component: PromptListComponent },
  { path: 'prompts/add', component: PromptFormComponent, canActivate: [authGuard] },
  { path: 'prompts/:promptId/edit', component: PromptFormComponent, canActivate: [authGuard] },
]
