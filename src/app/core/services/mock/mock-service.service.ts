import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockStorageService } from './mock-storage.service';
import { ServiceResponseDto } from '../../dto/service.dto';
import { ServiceStatus } from '../../enums/service-status.enum';
import { CategoryResponseDto } from '../../dto/category.dto';
import { TemplateResponseDto } from '../../dto/template.dto';
import { TimeUnit } from '../../enums/time-unit.enum';
import { PaginatedResponseDto } from '../../../common/dto/pagination.dto';

@Injectable({
  providedIn: 'root'
})
export class MockServiceService {
  private readonly ENTITY = 'services';

  constructor(private storage: MockStorageService) {}

  findActive(): Observable<ServiceResponseDto[]> {
    const services = this.storage.get<ServiceResponseDto>(this.ENTITY);
    const active = services.filter(s => s.status === ServiceStatus.ATIVO);
    return of(active).pipe(delay(300));
  }

  findAll(pagination: any = {}): Observable<PaginatedResponseDto<ServiceResponseDto>> {
    const services = this.storage.get<ServiceResponseDto>(this.ENTITY);
    let filtered = services;

    if (pagination.search) {
      const search = pagination.search.toLowerCase();
      filtered = services.filter(s =>
        s.nome.toLowerCase().includes(search) ||
        s.descricao.toLowerCase().includes(search)
      );
    }

    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    const response: PaginatedResponseDto<ServiceResponseDto> = {
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

  findOne(id: number): Observable<ServiceResponseDto | null> {
    const service = this.storage.findById<ServiceResponseDto>(this.ENTITY, id);
    return of(service).pipe(delay(300));
  }

  create(createDto: any): Observable<ServiceResponseDto> {
    // Get category and template from storage
    const categories = this.storage.get<CategoryResponseDto>('categories');
    const templates = this.storage.get<TemplateResponseDto>('templates');

    const category = categories.find(c => c.id == createDto.categoriaId);
    const template = createDto.templateBaseId ? templates.find(t => t.id == createDto.templateBaseId) : undefined;

    const newService: ServiceResponseDto = {
      id: 0,
      nome: createDto.nome,
      descricao: createDto.descricao,
      categoria: category!,
      prazoEntrega: createDto.prazoEntrega,
      unidadeTempoEntrega: createDto.unidadeTempoEntrega || TimeUnit.DAYS,
      templateBase: template,
      status: createDto.status || ServiceStatus.ATIVO,
      precoBase: createDto.precoBase,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const saved = this.storage.add(this.ENTITY, newService);
    return of(saved as ServiceResponseDto).pipe(delay(300));
  }

  update(id: number, updateDto: any): Observable<ServiceResponseDto> {
    const service = this.storage.findById<ServiceResponseDto>(this.ENTITY, id);
    if (!service) {
      throw new Error('Serviço não encontrado');
    }

    const updated = {
      ...service,
      ...updateDto,
      updatedAt: new Date()
    };

    this.storage.update(this.ENTITY, id, updated);
    return of(updated as ServiceResponseDto).pipe(delay(300));
  }

  remove(id: number): Observable<{ message: string }> {
    this.storage.delete(this.ENTITY, id);
    return of({ message: 'Serviço removido com sucesso' }).pipe(delay(300));
  }
}
