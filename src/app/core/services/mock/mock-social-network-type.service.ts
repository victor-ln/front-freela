import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockStorageService } from './mock-storage.service';
import { SocialNetworksTypeResponseDto, CreateSocialNetworksTypeDto, UpdateSocialNetworksTypeDto } from '../../dto/social-network-type.dto';
import { PaginatedResponseDto } from '../../../common/dto/pagination.dto';

@Injectable({
  providedIn: 'root'
})
export class MockSocialNetworkTypeService {
  private readonly ENTITY = 'social_network_types';

  constructor(private storage: MockStorageService) {
    this.initializeDefaultData();
  }

  private initializeDefaultData(): void {
    const defaultTypes: SocialNetworksTypeResponseDto[] = [
      { id: 1, tipo: 'Instagram', status: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, tipo: 'Facebook', status: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, tipo: 'LinkedIn', status: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, tipo: 'Twitter/X', status: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, tipo: 'TikTok', status: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, tipo: 'YouTube', status: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 7, tipo: 'Pinterest', status: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 8, tipo: 'WhatsApp Business', status: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    this.storage.initializeIfEmpty(this.ENTITY, defaultTypes);
  }

  create(createDto: CreateSocialNetworksTypeDto): Observable<SocialNetworksTypeResponseDto> {
    const newType: SocialNetworksTypeResponseDto = {
      id: 0,
      tipo: createDto.tipo,
      status: createDto.status !== undefined ? createDto.status : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const saved = this.storage.add(this.ENTITY, newType);
    return of(saved as SocialNetworksTypeResponseDto).pipe(delay(300));
  }

  findAll(pagination: any = {}): Observable<PaginatedResponseDto<SocialNetworksTypeResponseDto>> {
    const types = this.storage.get<SocialNetworksTypeResponseDto>(this.ENTITY);
    let filtered = types;
    if (pagination.search) {
      const search = pagination.search.toLowerCase();
      filtered = types.filter(t => t.tipo.toLowerCase().includes(search));
    }
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);
    const response: PaginatedResponseDto<SocialNetworksTypeResponseDto> = {
      data,
      meta: {
        totalItems: filtered.length,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(filtered.length / limit),
        currentPage: page
      }
    };
    return of(response).pipe(delay(300));
  }

  findOne(id: number): Observable<SocialNetworksTypeResponseDto> {
    const type = this.storage.findById<SocialNetworksTypeResponseDto>(this.ENTITY, id);
    if (!type) return throwError(() => new Error('Tipo de rede social não encontrado'));
    return of(type).pipe(delay(300));
  }

  update(id: number, updateDto: UpdateSocialNetworksTypeDto): Observable<SocialNetworksTypeResponseDto> {
    const type = this.storage.findById<SocialNetworksTypeResponseDto>(this.ENTITY, id);
    if (!type) return throwError(() => new Error('Tipo de rede social não encontrado'));
    const updated = { ...type, ...updateDto, updatedAt: new Date() };
    this.storage.update(this.ENTITY, id, updated);
    return of(updated as SocialNetworksTypeResponseDto).pipe(delay(300));
  }

  toggleStatus(id: number, status: boolean): Observable<SocialNetworksTypeResponseDto> {
    return this.update(id, { status });
  }

  remove(id: number): Observable<{ message: string }> {
    const success = this.storage.delete(this.ENTITY, id);
    if (!success) return throwError(() => new Error('Tipo de rede social não encontrado'));
    return of({ message: 'Tipo de rede social removido com sucesso' }).pipe(delay(300));
  }
}
