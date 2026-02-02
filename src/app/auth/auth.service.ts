import { Injectable, signal, computed } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { tap } from 'rxjs'
import { environment } from '../../environments/environment'

const TOKEN_KEY = 'token'

export interface CurrentUser {
  id: number
  username: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSignal = signal<string | null>(this.getStoredToken())

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  readonly token = this.tokenSignal.asReadonly()
  readonly isLoggedIn = computed(() => !!this.tokenSignal())
  readonly currentUser = computed<CurrentUser | null>(() => {
    const t = this.tokenSignal()
    if (!t) return null
    try {
      const payload = JSON.parse(atob(t.split('.')[1]))
      return { id: payload.sub, username: payload.username ?? '' }
    } catch {
      return null
    }
  })

  getToken(): string | null {
    return this.tokenSignal()
  }

  login(username: string, password: string) {
    return this.http
      .post<{ access_token: string }>(`${environment.appUrl}/auth/login`, {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.access_token)
          this.tokenSignal.set(res.access_token)
        }),
      )
  }

  register(username: string, password: string) {
    return this.http
      .post<{ access_token: string }>(`${environment.appUrl}/auth/register`, {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.access_token)
          this.tokenSignal.set(res.access_token)
        }),
      )
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY)
    this.tokenSignal.set(null)
    this.router.navigate(['/prompts'])
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }
}
