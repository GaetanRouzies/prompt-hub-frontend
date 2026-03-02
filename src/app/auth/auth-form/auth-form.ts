import { Component, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Card } from 'primeng/card'
import { Button } from 'primeng/button'
import { InputText } from 'primeng/inputtext'
import { Password } from 'primeng/password'
import { AuthService } from '../auth-service'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule, Card, Button, InputText, Password],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.scss',
})
export class AuthForm {
  messageService = inject(MessageService)
  authService = inject(AuthService)
  router = inject(Router)
  mode = signal<'login' | 'register'>('login')

  submitting = signal(false)

  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
  })

  toggleMode() {
    this.mode.update((value) => (value === 'login' ? 'register' : 'login'))
  }

  submit() {
    console.log(this.form.value)
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const { username, password } = this.form.getRawValue()
    this.submitting.set(true)
    if (this.mode() === 'login') {
      this.login(username, password)
    } else {
      this.register(username, password)
    }
  }

  login(username: string, password: string) {
    this.authService.login(username, password).subscribe({
      next: () => {
        this.submitting.set(false)
        void this.router.navigate(['/'])
      },
      error: () => {
        this.submitting.set(false)
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Connexion impossible, réessayez.'
        })
      }
    })
  }

  register(username: string, password: string) {
    this.authService.register(username, password).subscribe(() => {
      void this.router.navigate(['/'])
      this.submitting.set(false)
    })
  }
}
