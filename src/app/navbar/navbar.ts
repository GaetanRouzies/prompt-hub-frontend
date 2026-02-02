import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  auth = inject(AuthService)
}
