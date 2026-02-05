import { Component, inject, signal } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { AsyncPipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { CardModule } from 'primeng/card'
import { SelectModule } from 'primeng/select'
import { combineLatest, map, shareReplay } from 'rxjs'
import { CategoriesService } from '../categories.service'
import { PromptsService } from '../prompts.service'
import { PromptCardComponent } from '../prompt-card/prompt-card'

@Component({
  selector: 'app-prompt-list',
  imports: [CardModule, SelectModule, FormsModule, PromptCardComponent, AsyncPipe],
  templateUrl: './prompt-list.html',
  styleUrl: './prompt-list.scss',
})
export class PromptListComponent {
  private readonly categoriesService = inject(CategoriesService)
  private readonly promptsService = inject(PromptsService)

  selectedCategoryId = signal<number | null>(null)

  categories$ = this.categoriesService.getCategories()

  prompts$ = combineLatest([
    this.promptsService.getPrompts(),
    toObservable(this.selectedCategoryId),
  ]).pipe(
    map(([prompts, categoryId]) =>
      categoryId == null ? prompts : prompts.filter((prompt) => prompt.category.id === categoryId),
    ),
  )
}
