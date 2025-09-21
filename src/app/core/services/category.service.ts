import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { PaginatedResponseDto, PaginationDto } from '../../common/dto/pagination.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  create(createDto: CreateCategoryDto): Observable<CategoryResponseDto> {
    return this.http.post<CategoryResponseDto>(this.apiUrl, createDto);
  }

  findAll(pagination: PaginationDto = {}): Observable<PaginatedResponseDto<CategoryResponseDto>> {
    let params = new HttpParams();
    if (pagination.page) params = params.set('page', pagination.page.toString());
    if (pagination.limit) params = params.set('limit', pagination.limit.toString());
    if (pagination.search) params = params.set('search', pagination.search);

    return this.http.get<PaginatedResponseDto<CategoryResponseDto>>(this.apiUrl, { params });
  }

  findAllActive(): Observable<CategoryResponseDto[]> {
    return this.http.get<CategoryResponseDto[]>(`${this.apiUrl}/active`);
  }

  findOne(id: number): Observable<CategoryResponseDto> {
    return this.http.get<CategoryResponseDto>(`${this.apiUrl}/${id}`);
  }
  
  findByTipo(tipo: string): Observable<CategoryResponseDto> {
    return this.http.get<CategoryResponseDto>(`${this.apiUrl}/by-tipo/${tipo}`);
  }

  update(id: number, updateDto: UpdateCategoryDto): Observable<CategoryResponseDto> {
    return this.http.patch<CategoryResponseDto>(`${this.apiUrl}/${id}`, updateDto);
  }

  toggleStatus(id: number, status: boolean): Observable<CategoryResponseDto> {
    return this.http.patch<CategoryResponseDto>(`${this.apiUrl}/${id}/status`, { status });
  }

  remove(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}