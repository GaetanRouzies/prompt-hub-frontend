import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { environment } from '../../environments/environment'
import type { Category } from './category.model'

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  httpClient = inject(HttpClient)

  getCategories() {
    return this.httpClient.get<Category[]>(`${environment.appUrl}/categories`)
  }
}
