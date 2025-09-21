import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProposalResponseDto, CreateProposalDto, UpdateProposalDto, AcceptProposalDto, GenerateContractDto, SendEmailDto } from '../dto/proposal.dto';
import { PaginatedResponseDto, PaginationDto } from '../../common/dto/pagination.dto';
import { ProposalStatus } from '../enums/proposal-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private apiUrl = `${environment.apiUrl}/proposals`;

  constructor(private http: HttpClient) { }

  create(createDto: CreateProposalDto): Observable<ProposalResponseDto> {
    return this.http.post<ProposalResponseDto>(this.apiUrl, createDto);
  }

  findAll(pagination: PaginationDto = {}): Observable<PaginatedResponseDto<ProposalResponseDto>> {
    let params = new HttpParams();
    if (pagination.page) params = params.set('page', pagination.page.toString());
    if (pagination.limit) params = params.set('limit', pagination.limit.toString());
    if (pagination.search) params = params.set('search', pagination.search);

    return this.http.get<PaginatedResponseDto<ProposalResponseDto>>(this.apiUrl, { params });
  }

  findOne(id: number): Observable<ProposalResponseDto> {
    return this.http.get<ProposalResponseDto>(`${this.apiUrl}/${id}`);
  }
  
  update(id: number, updateDto: UpdateProposalDto): Observable<ProposalResponseDto> {
    return this.http.patch<ProposalResponseDto>(`${this.apiUrl}/${id}`, updateDto);
  }

  remove(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  acceptProposal(id: number, acceptDto: AcceptProposalDto): Observable<ProposalResponseDto> {
    return this.http.patch<ProposalResponseDto>(`${this.apiUrl}/${id}/accept`, acceptDto);
  }
  
  rejectProposal(id: number, reason?: string): Observable<ProposalResponseDto> {
    return this.http.patch<ProposalResponseDto>(`${this.apiUrl}/${id}/reject`, { reason });
  }

  generateContract(id: number, generateDto: GenerateContractDto): Observable<ProposalResponseDto> {
    return this.http.post<ProposalResponseDto>(`${this.apiUrl}/${id}/generate-contract`, generateDto);
  }

  downloadContract(id: number, format: 'pdf' | 'docx' = 'docx'): Observable<Blob> {
    const params = new HttpParams().set('format', format);
    return this.http.get(`${this.apiUrl}/${id}/contract/download`, { params, responseType: 'blob' });
  }
  
  sendContractEmail(id: number, emailDto: SendEmailDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/${id}/send-email`, emailDto);
  }

  toggleStatus(id: number, status: ProposalStatus): Observable<ProposalResponseDto> {
    return this.http.patch<ProposalResponseDto>(`${this.apiUrl}/${id}/status`, { status });
  }
}