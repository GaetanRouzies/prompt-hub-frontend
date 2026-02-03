import { Component, input, inject, signal, effect } from '@angular/core'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { TagModule } from 'primeng/tag'
import { TextareaModule } from 'primeng/textarea'
import { MessageService } from 'primeng/api'
import { from } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { PromptsService } from '../prompts.service'
import type { Prompt } from '../prompt.model'

@Component({
  selector: 'app-prompt-card',
  imports: [
    CardModule,
    ButtonModule,
    TagModule,
    TextareaModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './prompt-card.html',
  styleUrl: './prompt-card.scss',
})
export class PromptCardComponent {
  authService = inject(AuthService)
  promptsService = inject(PromptsService)
  messageService = inject(MessageService)

  prompt = input.required<Prompt>()

  displayScore = signal(0)
  displayUserVote = signal<'up' | 'down' | null>(null)

  constructor() {
    effect(() => {
      const prompt = this.prompt()
      this.displayScore.set(prompt.score)
      this.displayUserVote.set(prompt.userVote ?? null)
    })
  }

  get canEdit(): boolean {
    const user = this.authService.currentUser()
    return !!user && this.prompt().author.id === user.id
  }

  get canVote(): boolean {
    return !!this.authService.currentUser()
  }

  copyToClipboard(): void {
    from(navigator.clipboard.writeText(this.prompt().content)).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copié',
        detail: 'Prompt copié dans le presse-papiers',
      })
    })
  }

  upvote(): void {
    if (!this.canVote) return
    this.promptsService.upvotePrompt(this.prompt().id).subscribe((updatedPrompt) => {
      this.displayScore.set(updatedPrompt.score)
      this.displayUserVote.set(updatedPrompt.userVote ?? null)
    })
  }

  downvote(): void {
    if (!this.canVote) return
    this.promptsService.downvotePrompt(this.prompt().id).subscribe((updatedPrompt) => {
      this.displayScore.set(updatedPrompt.score)
      this.displayUserVote.set(updatedPrompt.userVote ?? null)
    })
  }
}
