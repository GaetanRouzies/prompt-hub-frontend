import { Routes } from '@angular/router'

import { authGuard } from './auth/auth.guard'
import { LoginComponent } from './auth/login/login'
import { RegisterComponent } from './auth/register/register'
import { PromptListComponent } from './prompts/prompt-list/prompt-list'
import { PromptFormComponent } from './prompts/prompt-form/prompt-form'

export const routes: Routes = [
  { path: '', redirectTo: 'prompts', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'prompts',
    children: [
      { path: '', component: PromptListComponent },
      { path: 'add', component: PromptFormComponent, canActivate: [authGuard] },
      { path: ':id/edit', component: PromptFormComponent, canActivate: [authGuard] },
    ],
  },
]
