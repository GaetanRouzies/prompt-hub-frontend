import { Component, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgOptimizedImage } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ButtonModule, NgOptimizedImage],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  auth = inject(AuthService)
  isDark = signal(false)

  toggleDark(): void {
    this.isDark.update((value) => !value)
    document.documentElement.classList.toggle('app-dark', this.isDark())
  }
}
