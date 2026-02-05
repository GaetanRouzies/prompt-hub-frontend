import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { environment } from '../../environments/environment'
import type { Category } from './category.model'

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly httpClient = inject(HttpClient)
  private readonly baseUrl = `${environment.appUrl}/categories`

  getCategories() {
    return this.httpClient.get<Category[]>(this.baseUrl)
  }
}
