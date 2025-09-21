import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientResponseDto, CreateClientDto, UpdateClientDto } from '../dto/client.dto'; // DTOs correspondentes
import { PaginatedResponseDto, PaginationDto } from '../../common/dto/pagination.dto';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) { }

  create(createDto: CreateClientDto): Observable<ClientResponseDto> {
    return this.http.post<ClientResponseDto>(this.apiUrl, createDto);
  }

  findAll(pagination: PaginationDto = {}): Observable<PaginatedResponseDto<ClientResponseDto>> {
    let params = new HttpParams();
    if (pagination.page) params = params.set('page', pagination.page.toString());
    if (pagination.limit) params = params.set('limit', pagination.limit.toString());
    if (pagination.search) params = params.set('search', pagination.search);

    return this.http.get<PaginatedResponseDto<ClientResponseDto>>(this.apiUrl, { params });
  }

  findOne(id: number): Observable<ClientResponseDto> {
    return this.http.get<ClientResponseDto>(`${this.apiUrl}/${id}`);
  }

  update(id: number, updateDto: UpdateClientDto): Observable<ClientResponseDto> {
    return this.http.patch<ClientResponseDto>(`${this.apiUrl}/${id}`, updateDto);
  }

  remove(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  findByEmail(email: string): Observable<ClientResponseDto> {
    return this.http.get<ClientResponseDto>(`${this.apiUrl}/by-email/${email}`);
  }

  findByCpfCnpj(cpfCnpj: string): Observable<ClientResponseDto> {
    return this.http.get<ClientResponseDto>(`${this.apiUrl}/by-document/${cpfCnpj}`);
  }
}