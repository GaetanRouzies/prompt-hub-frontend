import { Routes } from '@angular/router';

import { PromptListComponent } from './prompts/prompt-list/prompt-list';
import { PromptFormComponent } from './prompts/prompt-form/prompt-form';

export const routes: Routes = [
  { path: '', redirectTo: 'prompts', pathMatch: 'full' },
  {
    path: 'prompts',
    children: [
      { path: '', component: PromptListComponent },
      { path: 'add', component: PromptFormComponent },
      { path: ':id/edit', component: PromptFormComponent }
    ]
  }
];
