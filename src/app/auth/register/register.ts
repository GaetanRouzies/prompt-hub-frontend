import { Component, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { InputTextModule } from 'primeng/inputtext'
import { PasswordModule } from 'primeng/password'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { AuthService } from '../auth.service'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private readonly router = inject(Router)
  private readonly auth = inject(AuthService)
  private readonly messageService = inject(MessageService)

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
  })

  submitting = false

  submit(): void {
    if (this.form.invalid || this.submitting) return
    this.submitting = true
    const { username, password } = this.form.getRawValue()
    this.auth.register(username, password).subscribe({
      next: () => this.router.navigate(['/prompts']),
      error: (err) => {
        this.submitting = false
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail:
            err.status === 409
              ? "Ce nom d'utilisateur est déjà pris."
              : 'Une erreur est survenue.',
        })
      },
    })
  }
}
