import { Component, inject, signal } from '@angular/core'
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
  isDark = signal(false)

  toggleDarkMode() {
    this.isDark.update((value) => !value)
    document.documentElement.classList.toggle('app-dark', this.isDark())
  }

  logout() {
    this.authService.logout().subscribe(() => {
      void this.router.navigate(['/'])
    })
  }
}
