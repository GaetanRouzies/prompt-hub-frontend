import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { environment } from '../../environments/environment'
import type { Prompt } from './prompt.model'

@Injectable({ providedIn: 'root' })
export class PromptsService {
  private readonly httpClient = inject(HttpClient)
  private readonly baseUrl = `${environment.appUrl}/prompts`

  getPrompts() {
    return this.httpClient.get<Prompt[]>(this.baseUrl)
  }

  getPrompt(id: number) {
    return this.httpClient.get<Prompt>(`${this.baseUrl}/${id}`)
  }

  createPrompt(prompt: { title: string; content: string; categoryId: number }) {
    return this.httpClient.post<Prompt>(this.baseUrl, prompt)
  }

  updatePrompt(id: number, prompt: { title: string; content: string; categoryId: number }) {
    return this.httpClient.put<Prompt>(`${this.baseUrl}/${id}`, prompt)
  }

  deletePrompt(id: number) {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
  }

  upvotePrompt(id: number) {
    return this.httpClient.post<Prompt>(`${this.baseUrl}/${id}/upvote`, null)
  }

  downvotePrompt(id: number) {
    return this.httpClient.post<Prompt>(`${this.baseUrl}/${id}/downvote`, null)
  }
}
