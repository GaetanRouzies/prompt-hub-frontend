import { Component, input, output, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { PromptsService } from '../prompts.service';
import type { Prompt } from '../prompt.model';
import type { Category } from '../category.model';

@Component({
  selector: 'app-prompt-card',
  imports: [CardModule, ButtonModule, TagModule, RouterLink],
  templateUrl: './prompt-card.html',
  styleUrl: './prompt-card.scss'
})
export class PromptCardComponent {
  promptsService = inject(PromptsService);

  prompt = input.required<Prompt>();
  category = input<Category | null>(null);
  voted = output<void>();

  score = computed(() => {
    const p = this.prompt();
    return p.upvotes - p.downvotes;
  });

  contentPreview = computed(() => {
    const content = this.prompt().content;
    return content.length > 150 ? content.slice(0, 150) + '…' : content;
  });

  voting = false;

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
