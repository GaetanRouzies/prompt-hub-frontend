import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs';

import { environment } from '../../environments/environment';
import type { Prompt } from './prompt.model';

@Injectable({ providedIn: 'root' })
export class PromptsService {
  httpClient = inject(HttpClient);

  getPrompts() {
    return this.httpClient.get<Prompt[]>(`${environment.appUrl}/prompts`).pipe(
      map((prompts) =>
        [...prompts].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
      )
    );
  }

  getPrompt(id: number) {
    return this.httpClient.get<Prompt>(`${environment.appUrl}/prompts/${id}`);
  }

  createPrompt(prompt: Omit<Prompt, 'id' | 'upvotes' | 'downvotes' | 'createdAt'>) {
    const body = {
      ...prompt,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString()
    };
    return this.httpClient.post<Prompt>(`${environment.appUrl}/prompts`, body);
  }

  updatePrompt(id: number, prompt: Partial<Omit<Prompt, 'id' | 'upvotes' | 'downvotes' | 'createdAt'>>) {
    return this.httpClient.patch<Prompt>(`${environment.appUrl}/prompts/${id}`, prompt);
  }

  upvotePrompt(id: number) {
    return this.getPrompt(id).pipe(
      switchMap((p) =>
        this.httpClient.patch<Prompt>(`${environment.appUrl}/prompts/${id}`, { upvotes: p.upvotes + 1 })
      )
    );
  }

  downvotePrompt(id: number) {
    return this.getPrompt(id).pipe(
      switchMap((p) =>
        this.httpClient.patch<Prompt>(`${environment.appUrl}/prompts/${id}`, { downvotes: p.downvotes + 1 })
      )
    );
  }
}
