import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateSocialNetworkDto,
  UpdateSocialNetworkDto,
  SocialNetworkResponseDto,
} from '../dto/social-network.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable({
  providedIn: 'root',
})
export class SocialNetworkService {
  private readonly apiUrl = `${environment.apiUrl}/social-networks`;

  constructor(private readonly http: HttpClient) {}

  create(createDto: CreateSocialNetworkDto): Observable<SocialNetworkResponseDto> {
    return this.http.post<SocialNetworkResponseDto>(this.apiUrl, createDto);
  }

  findAll(pagination?: PaginationDto): Observable<PaginatedResponseDto<SocialNetworkResponseDto>> {
    let params = new HttpParams();
    if (pagination?.page) {
      params = params.set('page', pagination.page.toString());
    }
    if (pagination?.limit) {
      params = params.set('limit', pagination.limit.toString());
    }
    if (pagination?.search) {
      params = params.set('search', pagination.search);
    }
    if (pagination?.sortBy) {
      params = params.set('sortBy', pagination.sortBy);
    }
    if (pagination?.sortOrder) {
      params = params.set('sortOrder', pagination.sortOrder);
    }

    return this.http.get<PaginatedResponseDto<SocialNetworkResponseDto>>(this.apiUrl, { params });
  }

  findOne(id: number): Observable<SocialNetworkResponseDto> {
    return this.http.get<SocialNetworkResponseDto>(`${this.apiUrl}/${id}`);
  }

  findByClient(clienteId: number): Observable<SocialNetworkResponseDto[]> {
    return this.http.get<SocialNetworkResponseDto[]>(`${this.apiUrl}/client/${clienteId}`);
  }

  findByType(tipoId: number): Observable<SocialNetworkResponseDto[]> {
    return this.http.get<SocialNetworkResponseDto[]>(`${this.apiUrl}/type/${tipoId}`);
  }

  update(id: number, updateDto: UpdateSocialNetworkDto): Observable<SocialNetworkResponseDto> {
    return this.http.patch<SocialNetworkResponseDto>(`${this.apiUrl}/${id}`, updateDto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
