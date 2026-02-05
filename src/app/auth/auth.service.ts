import { Injectable, signal, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { tap, catchError, of } from 'rxjs'
import type { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import type { CurrentUser } from './current-user.model'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly httpClient = inject(HttpClient)
  private readonly router = inject(Router)
  private readonly baseUrl = `${environment.appUrl}/auth`

  currentUser = signal<CurrentUser | null>(null)

  /** Load current user from cookie (used at app init and after login/register). */
  loadUser(): Observable<CurrentUser | null> {
    return this.httpClient.get<CurrentUser>(`${this.baseUrl}/me`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(null)
        return of(null)
      }),
    )
  }

  login(username: string, password: string) {
    return this.httpClient
      .post<CurrentUser>(`${this.baseUrl}/login`, { username, password })
      .pipe(tap((user) => this.currentUser.set(user)))
  }

  register(username: string, password: string) {
    return this.httpClient
      .post<CurrentUser>(`${this.baseUrl}/register`, { username, password })
      .pipe(tap((user) => this.currentUser.set(user)))
  }

  logout(): void {
    this.httpClient.post(`${this.baseUrl}/logout`, {}).subscribe(() => {
      this.currentUser.set(null)
      this.router.navigate(['/prompts'])
    })
  }
}
