import { Component, inject } from '@angular/core'
import { PromptCard } from '../prompt-card/prompt-card'
import { PromptService } from '../prompt-service'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-prompt-list',
  imports: [PromptCard],
  templateUrl: './prompt-list.html',
  styleUrl: './prompt-list.scss',
})
export class PromptList {
  promptService = inject(PromptService)

  prompts = toSignal(this.promptService.getPrompts(), { initialValue: [] })
}
