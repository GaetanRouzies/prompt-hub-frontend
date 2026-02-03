import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs'

import { environment } from '../../environments/environment'
import type { Prompt } from './prompt.model'

@Injectable({ providedIn: 'root' })
export class PromptsService {
  httpClient = inject(HttpClient)

  getPrompts() {
    return this.httpClient
      .get<Prompt[]>(`${environment.appUrl}/prompts`)
      .pipe(map((prompts) => [...prompts].sort((promptA, promptB) => promptB.score - promptA.score)))
  }

  getPrompt(id: number) {
    return this.httpClient.get<Prompt>(`${environment.appUrl}/prompts/${id}`)
  }

  createPrompt(prompt: { title: string; content: string; categoryId: number }) {
    return this.httpClient.post<Prompt>(`${environment.appUrl}/prompts`, prompt)
  }

  updatePrompt(id: number, prompt: { title: string; content: string; categoryId: number }) {
    return this.httpClient.patch<Prompt>(`${environment.appUrl}/prompts/${id}`, prompt)
  }

  upvotePrompt(id: number) {
    return this.httpClient.post<Prompt>(`${environment.appUrl}/prompts/${id}/upvote`, null)
  }

  downvotePrompt(id: number) {
    return this.httpClient.post<Prompt>(`${environment.appUrl}/prompts/${id}/downvote`, null)
  }
}
