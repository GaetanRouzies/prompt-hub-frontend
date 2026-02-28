import { Routes } from '@angular/router'
import { PromptList } from './prompts/prompt-list/prompt-list'
import { PromptForm } from './prompts/prompt-form/prompt-form'

export const routes: Routes = [
  { path: '', redirectTo: 'prompts', pathMatch: 'full' },
  { path: 'prompts', component: PromptList },
  { path: 'prompts/create', component: PromptForm },
  { path: 'prompts/:promptId/edit', component: PromptForm },
]
