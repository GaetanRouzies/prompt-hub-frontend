import { Component, effect, inject, input, signal } from '@angular/core'
import { Card } from 'primeng/card'
import { InputText } from 'primeng/inputtext'
import { Textarea } from 'primeng/textarea'
import { Select } from 'primeng/select'
import { CategoryService } from '../category-service'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Button } from 'primeng/button'
import { PromptService } from '../prompt-service'
import { Router, RouterLink } from '@angular/router'
import { MessageService } from 'primeng/api'
import { ProgressSpinner } from 'primeng/progressspinner'

@Component({
  selector: 'app-prompt-form',
  imports: [
    Card,
    InputText,
    Textarea,
    Select,
    ReactiveFormsModule,
    Button,
    RouterLink,
    ProgressSpinner,
  ],
  templateUrl: './prompt-form.html',
  styleUrl: './prompt-form.scss',
})
export class PromptForm {
  messageService = inject(MessageService)
  router = inject(Router)
  promptService = inject(PromptService)
  categoryService = inject(CategoryService)

  loading = signal(false)
  submitting = signal(false)
  deleting = signal(false)
  promptId = input<number>()

  categories = toSignal(this.categoryService.getCategories())

  form = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(30)],
      nonNullable: true,
    }),
    content: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    categoryId: new FormControl(-1, {
      validators: [Validators.required, Validators.min(0)],
      nonNullable: true,
    }),
  })

  constructor() {
    effect(() => {
      const promptId = this.promptId()
      if (promptId) {
        this.loading.set(true)
        this.promptService.getPrompt(promptId).subscribe((prompt) => {
          this.form.patchValue({
            title: prompt.title,
            content: prompt.content,
            categoryId: prompt.category.id,
          })
          this.loading.set(false)
        })
      }
    })
  }

  submit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const prompt = this.form.getRawValue()
    const promptId = this.promptId()
    this.submitting.set(true)
    if (promptId) {
      this.promptService.updatePrompt(promptId, prompt).subscribe(() => {
        void this.router.navigate(['/'])
        this.submitting.set(false)
        this.messageService.add({
          severity: 'success',
          summary: 'Modifié',
          detail: 'Prompt modifié avec succès !',
        })
      })
    } else {
      this.promptService.createPrompt(prompt).subscribe(() => {
        void this.router.navigate(['/'])
        this.submitting.set(false)
        this.messageService.add({
          severity: 'success',
          summary: 'Créé',
          detail: 'Prompt créé avec succès !',
        })
      })
    }
  }

  deletePrompt() {
    this.deleting.set(true)
    this.promptService.deletePrompt(this.promptId()!).subscribe(() => {
      this.deleting.set(false)
      this.messageService.add({
        severity: 'success',
        summary: 'Supprimé',
        detail: 'Prompt supprimé avec succès !',
      })
      void this.router.navigate(['/'])
    })
  }
}
