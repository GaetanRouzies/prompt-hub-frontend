import { Component, effect, inject, signal } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'
import { Button } from 'primeng/button'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../auth/auth-service'

@Component({
  selector: 'app-navbar',
  imports: [NgOptimizedImage, Button, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  router = inject(Router)
  authService = inject(AuthService)
  readonly DARK_MODE_KEY = 'dark-mode'
  isDark = signal(localStorage.getItem(this.DARK_MODE_KEY) === 'true')
  loggingOut = signal(false)

  constructor() {
    effect(() => {
      document.documentElement.classList.toggle('app-dark', this.isDark())
      localStorage.setItem(this.DARK_MODE_KEY, String(this.isDark()))
    })
  }

  logout() {
    this.loggingOut.set(true)
    this.authService.logout().subscribe(() => {
      void this.router.navigate(['/'])
      this.loggingOut.set(false)
    })
  }
}
