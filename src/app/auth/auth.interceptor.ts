import { HttpInterceptorFn } from '@angular/common/http'

/** Send credentials (cookies) with every request to the API. */
export const authInterceptor: HttpInterceptorFn = (request, nextHandler) => {
  return nextHandler(request.clone({ withCredentials: true }))
}
