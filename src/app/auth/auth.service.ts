import { Injectable, signal, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { tap, catchError, of } from 'rxjs'
import type { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import type { CurrentUser } from './current-user.model'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly router = inject(Router)
  private readonly userSignal = signal<CurrentUser | null>(null)

  readonly currentUser = this.userSignal.asReadonly()

  /** Load current user from cookie (used at app init and after login/register). */
  loadUser(): Observable<CurrentUser | null> {
    return this.http
      .get<CurrentUser>(`${environment.appUrl}/auth/me`)
      .pipe(
        tap((user) => this.userSignal.set(user)),
        catchError(() => {
          this.userSignal.set(null)
          return of(null)
        }),
      )
  }

  login(username: string, password: string) {
    return this.http
      .post<CurrentUser>(`${environment.appUrl}/auth/login`, { username, password })
      .pipe(tap((user) => this.userSignal.set(user)))
  }

  register(username: string, password: string) {
    return this.http
      .post<CurrentUser>(`${environment.appUrl}/auth/register`, { username, password })
      .pipe(tap((user) => this.userSignal.set(user)))
  }

  logout(): void {
    this.http.post(`${environment.appUrl}/auth/logout`, {}).subscribe(() => this.clearAndNavigate())
  }

  private clearAndNavigate(): void {
    this.userSignal.set(null)
    this.router.navigate(['/prompts'])
  }
}
