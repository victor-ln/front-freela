import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Template {
  id?: number;
  nome: string;
  descricao: string;
  anexo: File | null;
  status: 'Em Revisão' | 'Ativo' | 'Inativo';
  categoriaId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl = 'http://localhost:3000/api/templates';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Template[]> {
    return this.http.get<Template[]>(this.apiUrl);
  }

  getById(id: number): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/${id}`);
  }

  create(template: FormData): Observable<Template> {
    return this.http.post<Template>(this.apiUrl, template);
  }

  update(id: number, template: FormData): Observable<Template> {
    return this.http.put<Template>(`${this.apiUrl}/${id}`, template);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
