import { Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { EMPTY, switchMap, tap } from 'rxjs';
import { PromptsService } from '../prompts.service';
import { CategoriesService } from '../categories.service';
import type { Category } from '../category.model';

@Component({
  selector: 'app-prompt-form',
  imports: [ReactiveFormsModule, RouterLink, InputTextModule, TextareaModule, SelectModule, ButtonModule, CardModule],
  templateUrl: './prompt-form.html',
  styleUrl: './prompt-form.scss'
})
export class PromptFormComponent {
  router = inject(Router);
  promptsService = inject(PromptsService);
  categoriesService = inject(CategoriesService);
  messageService = inject(MessageService);

  /** Bound from route param :id when navigating to prompts/:id/edit */
  id = input<string>();

  categories = signal<Category[]>([]);
  loading = signal(true);
  submitting = signal(false);

  form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    content: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    categoryId: new FormControl<number | null>(null, { validators: [Validators.required] })
  });

  constructor() {
    this.categoriesService.getCategories().subscribe({ next: (data) => this.categories.set(data) });

    toObservable(this.id)
      .pipe(
        tap((idParam) => {
          if (idParam === undefined) this.loading.set(false);
          else this.loading.set(true);
        }),
        switchMap((idParam) => {
          if (idParam === undefined) return EMPTY;
          const id = Number(idParam);
          if (Number.isNaN(id)) {
            this.loading.set(false);
            return EMPTY;
          }
          return this.promptsService.getPrompt(id);
        }),
        takeUntilDestroyed()
      )
      .subscribe({
        next: (p) => {
          this.form.patchValue({
            title: p.title,
            content: p.content,
            categoryId: p.category.id
          });
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  submit() {
    if (this.form.invalid || this.form.value.categoryId == null) {
      this.form.markAllAsTouched();
      return;
    }
    const idParam = this.id();
    const value = this.form.getRawValue();
    if (value.categoryId == null) return;
    this.submitting.set(true);
    if (idParam != null) {
      const id = Number(idParam);
      this.promptsService.updatePrompt(id, { title: value.title, content: value.content, categoryId: value.categoryId }).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Prompt mis à jour' });
          this.router.navigate(['/prompts']);
          this.submitting.set(false);
        },
        error: () => this.submitting.set(false)
      });
    } else {
      this.promptsService.createPrompt({ title: value.title, content: value.content, categoryId: value.categoryId }).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Prompt créé' });
          this.router.navigate(['/prompts']);
          this.submitting.set(false);
        },
        error: () => this.submitting.set(false)
      });
    }
  }

}
