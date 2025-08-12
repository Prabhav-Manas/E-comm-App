import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../appModels/category.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl=environment.category;

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<Category[]>(`${this.baseUrl}/all-categories`);
  }

  addCategory(name: string) {
    return this.http.post<Category>(`${this.baseUrl}/add-category`,{name,});
  }

  updateCategory(id: string, name: string) {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, {name});
  }

  deleteCategory(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
