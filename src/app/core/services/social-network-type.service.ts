import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateSocialNetworksTypeDto,
  UpdateSocialNetworksTypeDto,
  SocialNetworksTypeResponseDto,
} from '../dto/social-network-type.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable({
  providedIn: 'root',
})
export class SocialNetworkTypeService {
  private readonly apiUrl = `${environment.apiUrl}/social-networks-types`;

  constructor(private readonly http: HttpClient) {}

  create(createDto: CreateSocialNetworksTypeDto): Observable<SocialNetworksTypeResponseDto> {
    return this.http.post<SocialNetworksTypeResponseDto>(this.apiUrl, createDto);
  }

  findAll(pagination?: PaginationDto): Observable<PaginatedResponseDto<SocialNetworksTypeResponseDto>> {
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

    return this.http.get<PaginatedResponseDto<SocialNetworksTypeResponseDto>>(this.apiUrl, { params });
  }

  findAllActive(): Observable<SocialNetworksTypeResponseDto[]> {
    return this.http.get<SocialNetworksTypeResponseDto[]>(`${this.apiUrl}/active`);
  }

  findOne(id: number): Observable<SocialNetworksTypeResponseDto> {
    return this.http.get<SocialNetworksTypeResponseDto>(`${this.apiUrl}/${id}`);
  }

  update(id: number, updateDto: UpdateSocialNetworksTypeDto): Observable<SocialNetworksTypeResponseDto> {
    return this.http.patch<SocialNetworksTypeResponseDto>(`${this.apiUrl}/${id}`, updateDto);
  }

  toggleStatus(id: number, status: boolean): Observable<SocialNetworksTypeResponseDto> {
    return this.http.patch<SocialNetworksTypeResponseDto>(`${this.apiUrl}/${id}/status`, { status });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
