import { Component, input, output, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { PromptsService } from '../prompts.service';
import type { Prompt } from '../prompt.model';
import type { Category } from '../category.model';

@Component({
  selector: 'app-prompt-card',
  imports: [CardModule, ButtonModule, TagModule, TextareaModule, FormsModule, RouterLink],
  templateUrl: './prompt-card.html',
  styleUrl: './prompt-card.scss'
})
export class PromptCardComponent {
  promptsService = inject(PromptsService);
  messageService = inject(MessageService);

  prompt = input.required<Prompt>();
  category = input<Category | null>(null);
  voted = output<void>();

  score = computed(() => this.prompt().score);

  /** When true, textarea is expanded (taller); when false, collapsed with scroll */
  expanded = signal(false);

  voting = false;

  async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.prompt().content);
      this.messageService.add({
        severity: 'success',
        summary: 'Copié',
        detail: 'Prompt copié dans le presse-papiers'
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de copier'
      });
    }
  }

  toggleExpanded(): void {
    this.expanded.update((v) => !v);
  }

  upvote() {
    if (this.voting) return;
    this.voting = true;
    this.promptsService.upvotePrompt(this.prompt().id).subscribe({
      next: () => {
        this.voting = false;
        this.voted.emit();
      },
      error: () => {
        this.voting = false;
      }
    });
  }

  downvote() {
    if (this.voting) return;
    this.voting = true;
    this.promptsService.downvotePrompt(this.prompt().id).subscribe({
      next: () => {
        this.voting = false;
        this.voted.emit();
      },
      error: () => {
        this.voting = false;
      }
    });
  }
}
