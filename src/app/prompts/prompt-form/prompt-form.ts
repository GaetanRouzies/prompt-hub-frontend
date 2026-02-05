import { Component, effect, inject, input } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { Router, RouterLink } from '@angular/router'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
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

  /** Bound from route param :promptId when navigating to prompts/:promptId/edit */
  promptId = input<number>()

  categories$ = this.categoriesService.getCategories()

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
      if (!promptId) return
      this.promptsService.getPrompt(promptId).subscribe((prompt) => {
        this.form.patchValue({
          title: prompt.title,
          content: prompt.content,
          categoryId: prompt.category.id,
        })
      })
    })
  }

  submit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const formValue = this.form.getRawValue()
    const promptId = this.promptId()

    if (promptId) {
      this.promptsService
        .updatePrompt(promptId, formValue)
        .subscribe(() => this.router.navigate(['/prompts']))
    } else {
      this.promptsService
        .createPrompt(formValue)
        .subscribe(() => this.router.navigate(['/prompts']))
    }
  }

  deletePrompt() {
    this.promptsService
      .deletePrompt(this.promptId()!)
      .subscribe(() => this.router.navigate(['/prompts']))
  }
}
