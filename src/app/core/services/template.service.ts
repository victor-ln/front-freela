import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TemplateResponseDto, CreateTemplateDto, UpdateTemplateDto, ApproveTemplateDto } from '../dto/template.dto';
import { PaginatedResponseDto, PaginationDto } from '../../common/dto/pagination.dto';
import { TemplateStatus } from '../enums/template-status.enum';

export interface UploadTemplateDto {
  nome: string;
  descricao?: string;
  freelancerId: number;
  file: File;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl = `${environment.apiUrl}/templates`;

  constructor(private http: HttpClient) { }

  create(createDto: CreateTemplateDto): Observable<TemplateResponseDto> {
    return this.http.post<TemplateResponseDto>(this.apiUrl, createDto);
  }

  upload(uploadDto: UploadTemplateDto): Observable<TemplateResponseDto> {
    const formData = new FormData();
    formData.append('file', uploadDto.file, uploadDto.file.name);
    formData.append('nome', uploadDto.nome);
    formData.append('descricao', uploadDto.descricao || '');
    formData.append('freelancerId', uploadDto.freelancerId.toString());

    return this.http.post<TemplateResponseDto>(`${this.apiUrl}/upload`, formData);
  }

  findAll(pagination: PaginationDto = {}): Observable<PaginatedResponseDto<TemplateResponseDto>> {
    let params = new HttpParams();
    if (pagination.page) params = params.set('page', pagination.page.toString());
    if (pagination.limit) params = params.set('limit', pagination.limit.toString());
    if (pagination.search) params = params.set('search', pagination.search);

    return this.http.get<PaginatedResponseDto<TemplateResponseDto>>(this.apiUrl, { params });
  }

  findApproved(): Observable<TemplateResponseDto[]> {
    return this.http.get<TemplateResponseDto[]>(`${this.apiUrl}/approved`);
  }
  
  findByStatus(status: TemplateStatus): Observable<TemplateResponseDto[]> {
    return this.http.get<TemplateResponseDto[]>(`${this.apiUrl}/by-status/${status}`);
  }

  findOne(id: number): Observable<TemplateResponseDto> {
    return this.http.get<TemplateResponseDto>(`${this.apiUrl}/${id}`);
  }

  downloadTemplate(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  update(id: number, updateDto: UpdateTemplateDto): Observable<TemplateResponseDto> {
    return this.http.patch<TemplateResponseDto>(`${this.apiUrl}/${id}`, updateDto);
  }

  approve(id: number, approveDto: ApproveTemplateDto): Observable<TemplateResponseDto> {
    return this.http.patch<TemplateResponseDto>(`${this.apiUrl}/${id}/approve`, approveDto);
  }

  remove(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}