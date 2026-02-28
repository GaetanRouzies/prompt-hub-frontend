import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Prompt } from './prompt.model'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  httpClient = inject(HttpClient)
  baseUrl = environment.apiUrl + 'prompts'

  getPrompts() {
    return this.httpClient.get<Prompt[]>(this.baseUrl)
  }
}
