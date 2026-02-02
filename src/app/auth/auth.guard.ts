import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from './auth.service'

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router)
  if (auth.isLoggedIn()) return true
  const url = router.url
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: url } })
}
