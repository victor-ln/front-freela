import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServiceResponseDto, CreateServiceDto, UpdateServiceDto } from '../dto/service.dto';
import { PaginatedResponseDto, PaginationDto } from '../../common/dto/pagination.dto';
import { ServiceStatus } from '../enums/service-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) { }

  create(createDto: CreateServiceDto): Observable<ServiceResponseDto> {
    return this.http.post<ServiceResponseDto>(this.apiUrl, createDto);
  }

  findAll(pagination: PaginationDto = {}): Observable<PaginatedResponseDto<ServiceResponseDto>> {
    let params = new HttpParams();
    if (pagination.page) params = params.set('page', pagination.page.toString());
    if (pagination.limit) params = params.set('limit', pagination.limit.toString());
    if (pagination.search) params = params.set('search', pagination.search);

    return this.http.get<PaginatedResponseDto<ServiceResponseDto>>(this.apiUrl, { params });
  }

  findActive(): Observable<ServiceResponseDto[]> {
    return this.http.get<ServiceResponseDto[]>(`${this.apiUrl}/active`);
  }
  
  findByStatus(status: ServiceStatus): Observable<ServiceResponseDto[]> {
    return this.http.get<ServiceResponseDto[]>(`${this.apiUrl}/by-status/${status}`);
  }

  findByCategory(categoriaId: number): Observable<ServiceResponseDto[]> {
    return this.http.get<ServiceResponseDto[]>(`${this.apiUrl}/category/${categoriaId}`);
  }

  findByPriceRange(minPrice: number, maxPrice: number): Observable<ServiceResponseDto[]> {
    const params = new HttpParams()
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString());
    return this.http.get<ServiceResponseDto[]>(`${this.apiUrl}/price-range`, { params });
  }

  findOne(id: number): Observable<ServiceResponseDto> {
    return this.http.get<ServiceResponseDto>(`${this.apiUrl}/${id}`);
  }

  update(id: number, updateDto: UpdateServiceDto): Observable<ServiceResponseDto> {
    return this.http.patch<ServiceResponseDto>(`${this.apiUrl}/${id}`, updateDto);
  }

  toggleStatus(id: number, status: ServiceStatus): Observable<ServiceResponseDto> {
    return this.http.patch<ServiceResponseDto>(`${this.apiUrl}/${id}/status`, { status });
  }

  remove(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}