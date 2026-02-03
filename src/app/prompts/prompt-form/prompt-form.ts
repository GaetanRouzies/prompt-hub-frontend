import { Component, inject, input, signal } from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { Router, RouterLink } from '@angular/router'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { InputTextModule } from 'primeng/inputtext'
import { TextareaModule } from 'primeng/textarea'
import { SelectModule } from 'primeng/select'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { EMPTY, switchMap, tap } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { PromptsService } from '../prompts.service'
import { CategoriesService } from '../categories.service'
import type { Category } from '../category.model'

@Component({
  selector: 'app-prompt-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ButtonModule,
    CardModule,
  ],
  templateUrl: './prompt-form.html',
  styleUrl: './prompt-form.scss',
})
export class PromptFormComponent {
  router = inject(Router)
  authService = inject(AuthService)
  promptsService = inject(PromptsService)
  categoriesService = inject(CategoriesService)
  messageService = inject(MessageService)

  /** Bound from route param :promptId when navigating to prompts/:promptId/edit */
  promptId = input<string>()

  categories = signal<Category[]>([])
  loading = signal(true)
  submitting = signal(false)

  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    content: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    categoryId: new FormControl<number | null>(null, { validators: [Validators.required] }),
  })

  constructor() {
    this.categoriesService.getCategories().subscribe((categories) => this.categories.set(categories))

    toObservable(this.promptId)
      .pipe(
        tap((promptIdParam) => {
          if (promptIdParam === undefined) this.loading.set(false)
          else this.loading.set(true)
        }),
        switchMap((promptIdParam) => {
          if (promptIdParam === undefined) return EMPTY
          const promptId = Number(promptIdParam)
          if (Number.isNaN(promptId)) {
            this.loading.set(false)
            return EMPTY
          }
          return this.promptsService.getPrompt(promptId)
        }),
        takeUntilDestroyed(),
      )
      .subscribe((prompt) => {
        const user = this.authService.currentUser()
        if (user && prompt.author.id !== user.id) {
          this.router.navigate(['/prompts'])
          this.loading.set(false)
          return
        }
        this.form.patchValue({
          title: prompt.title,
          content: prompt.content,
          categoryId: prompt.category.id,
        })
        this.loading.set(false)
      })
  }

  submit() {
    if (this.form.invalid || this.form.value.categoryId == null) {
      this.form.markAllAsTouched()
      return
    }
    const promptIdParam = this.promptId()
    const value = this.form.getRawValue()
    if (value.categoryId == null) return
    this.submitting.set(true)
    if (promptIdParam != null) {
      const promptId = Number(promptIdParam)
      this.promptsService
        .updatePrompt(promptId, {
          title: value.title,
          content: value.content,
          categoryId: value.categoryId,
        })
        .subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Prompt mis à jour' })
          this.router.navigate(['/prompts'])
          this.submitting.set(false)
        })
    } else {
      this.promptsService
        .createPrompt({ title: value.title, content: value.content, categoryId: value.categoryId })
        .subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Prompt créé' })
          this.router.navigate(['/prompts'])
          this.submitting.set(false)
        })
    }
  }
}
