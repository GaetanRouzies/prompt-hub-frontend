import { Component, inject, signal } from '@angular/core'
import { PromptCard } from '../prompt-card/prompt-card'
import { PromptService } from '../prompt-service'
import { toSignal } from '@angular/core/rxjs-interop'
import { Prompt } from '../prompt.model'
import { tap } from 'rxjs'
import { ProgressSpinner } from 'primeng/progressspinner'

@Component({
  selector: 'app-prompt-list',
  imports: [PromptCard, ProgressSpinner],
  templateUrl: './prompt-list.html',
  styleUrl: './prompt-list.scss',
})
export class PromptList {
  promptService = inject(PromptService)

  loading = signal(true)
  prompts = toSignal(this.promptService.getPrompts().pipe(tap(() => this.loading.set(false))), {
    initialValue: [],
  })
}
