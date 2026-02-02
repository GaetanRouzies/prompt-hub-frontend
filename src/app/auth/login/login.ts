import { Component, inject } from '@angular/core'
import { Router, RouterLink, ActivatedRoute } from '@angular/router'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { InputTextModule } from 'primeng/inputtext'
import { PasswordModule } from 'primeng/password'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { AuthService } from '../auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly auth = inject(AuthService)
  private readonly messageService = inject(MessageService)

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  })

  submitting = false

  submit(): void {
    if (this.form.invalid || this.submitting) return
    this.submitting = true
    const { username, password } = this.form.getRawValue()
    this.auth.login(username, password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/prompts'
        this.router.navigateByUrl(returnUrl)
      },
      error: (err) => {
        this.submitting = false
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: err.status === 401 ? 'Identifiants invalides.' : 'Une erreur est survenue.',
        })
      },
    })
  }
}
