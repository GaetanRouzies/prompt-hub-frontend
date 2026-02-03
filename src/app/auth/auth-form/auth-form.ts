import { Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { PasswordModule } from 'primeng/password'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { MessageService } from 'primeng/api'
import { AuthService } from '../auth.service'

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, CardModule],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.scss',
})
export class AuthFormComponent {
  private readonly router = inject(Router)
  private readonly auth = inject(AuthService)
  private readonly messageService = inject(MessageService)

  mode = signal<'login' | 'register'>('login')

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
  })

  submitting = signal(false)

  toggleMode(): void {
    this.mode.update((value) => (value === 'login' ? 'register' : 'login'))
  }

  submit(): void {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    this.submitting.set(true)
    const { username, password } = this.form.getRawValue()
    if (this.mode() === 'login') {
      this.auth.login(username, password).subscribe({
        next: () => {
          this.submitting.set(false)
          this.router.navigate(['/prompts'])
        },
        error: () => {
          this.submitting.set(false)
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Connexion impossible. Réessayez.',
          })
        },
      })
    } else {
      this.auth.register(username, password).subscribe({
        next: () => {
          this.submitting.set(false)
          this.router.navigate(['/prompts'])
        },
        error: () => {
          this.submitting.set(false)
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Connexion impossible. Réessayez.',
          })
        },
      })
    }
  }
}
