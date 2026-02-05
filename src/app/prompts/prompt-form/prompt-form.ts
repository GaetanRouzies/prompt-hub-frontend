import { Component, effect, inject, input, signal } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { Router, RouterLink } from '@angular/router'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { InputTextModule } from 'primeng/inputtext'
import { TextareaModule } from 'primeng/textarea'
import { SelectModule } from 'primeng/select'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { PromptsService } from '../prompts.service'
import { CategoriesService } from '../categories.service'

@Component({
  selector: 'app-prompt-form',
  imports: [
    AsyncPipe,
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
  private readonly router = inject(Router)
  private readonly promptsService = inject(PromptsService)
  private readonly categoriesService = inject(CategoriesService)
  private readonly messageService = inject(MessageService)

  /** Bound from route param :promptId when navigating to prompts/:promptId/edit */
  promptId = input<number>()

  categories$ = this.categoriesService.getCategories()
  loading = signal(false)
  submitting = signal(false)
  deleting = signal(false)

  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    content: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    categoryId: new FormControl<number>(-1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
  })

  constructor() {
    effect(() => {
      const promptId = this.promptId()
      if (!promptId) {
        this.loading.set(false)
        return
      }
      this.loading.set(true)
      this.promptsService.getPrompt(promptId).subscribe({
        next: (prompt) => {
          this.form.patchValue({
            title: prompt.title,
            content: prompt.content,
            categoryId: prompt.category.id,
          })
          this.loading.set(false)
        },
        error: () => this.loading.set(false),
      })
    })
  }

  submit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const formValue = this.form.getRawValue()
    const promptId = this.promptId()
    this.submitting.set(true)

    if (promptId) {
      this.promptsService.updatePrompt(promptId, formValue).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Prompt mis à jour' })
          this.router.navigate(['/prompts'])
          this.submitting.set(false)
        },
        error: () => this.submitting.set(false),
      })
    } else {
      this.promptsService.createPrompt(formValue).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Prompt créé' })
          this.router.navigate(['/prompts'])
          this.submitting.set(false)
        },
        error: () => this.submitting.set(false),
      })
    }
  }

  deletePrompt() {
    this.deleting.set(true)
    this.promptsService.deletePrompt(this.promptId()!).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Prompt supprimé' })
        this.router.navigate(['/prompts'])
        this.deleting.set(false)
      },
      error: () => this.deleting.set(false),
    })
  }
}
