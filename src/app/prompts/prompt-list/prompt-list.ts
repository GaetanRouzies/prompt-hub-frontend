import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { combineLatest, map, merge, of, shareReplay, Subject, switchMap } from 'rxjs';
import { CategoriesService } from '../categories.service';
import { PromptsService } from '../prompts.service';
import { PromptCardComponent } from '../prompt-card/prompt-card';
import type { Category } from '../category.model';

@Component({
  selector: 'app-prompt-list',
  imports: [CardModule, SelectModule, FormsModule, PromptCardComponent, AsyncPipe],
  templateUrl: './prompt-list.html',
  styleUrl: './prompt-list.scss'
})
export class PromptListComponent {
  categoriesService = inject(CategoriesService);
  promptsService = inject(PromptsService);

  selectedCategoryId = signal<number | null>(null);

  refreshPrompts$ = new Subject<void>();

  categories$ = this.categoriesService.getCategories().pipe(shareReplay(1));

  categories = signal<Category[]>([]);

  prompts$ = merge(of(undefined), this.refreshPrompts$).pipe(
    switchMap(() => this.promptsService.getPrompts()),
    shareReplay(1)
  );

  filteredPrompts$ = combineLatest([
    this.prompts$,
    toObservable(this.selectedCategoryId)
  ]).pipe(
    map(([prompts, categoryId]) =>
      categoryId == null ? prompts : prompts.filter((p) => p.categoryId === categoryId)
    )
  );

  constructor() {
    this.categories$.subscribe((cats) => this.categories.set(cats));
  }

  getCategory(categoryId: number): Category | null {
    return this.categories().find((c) => c.id === categoryId) ?? null;
  }

  onVoted() {
    this.refreshPrompts$.next();
  }
}
