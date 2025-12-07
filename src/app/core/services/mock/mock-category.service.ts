import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockStorageService } from './mock-storage.service';
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from '../../dto/category.dto';
import { PaginatedResponseDto } from '../../../common/dto/pagination.dto';

@Injectable({
  providedIn: 'root'
})
export class MockCategoryService {
  private readonly ENTITY = 'categories';

  constructor(private storage: MockStorageService) {
    this.initializeDefaultData();
  }

  private initializeDefaultData(): void {
    const defaultCategories: CategoryResponseDto[] = [
      {
        id: 1,
        tipo: 'Design Gráfico',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        tipo: 'Desenvolvimento Web',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        tipo: 'Marketing Digital',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        tipo: 'Redação e Conteúdo',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        tipo: 'Fotografia',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        tipo: 'Vídeo e Animação',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        tipo: 'Consultoria',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.storage.initializeIfEmpty(this.ENTITY, defaultCategories);
  }

  create(createDto: CreateCategoryDto): Observable<CategoryResponseDto> {
    const newCategory: CategoryResponseDto = {
      id: 0,
      tipo: createDto.tipo,
      status: createDto.status !== undefined ? createDto.status : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const saved = this.storage.add(this.ENTITY, newCategory);
    return of(saved as CategoryResponseDto).pipe(delay(300));
  }

  findAll(pagination: any = {}): Observable<PaginatedResponseDto<CategoryResponseDto>> {
    const categories = this.storage.get<CategoryResponseDto>(this.ENTITY);

    let filtered = categories;
    if (pagination.search) {
      const search = pagination.search.toLowerCase();
      filtered = categories.filter(c =>
        c.tipo.toLowerCase().includes(search)
      );
    }

    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    const response: PaginatedResponseDto<CategoryResponseDto> = {
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

  findAllActive(): Observable<CategoryResponseDto[]> {
    const categories = this.storage.get<CategoryResponseDto>(this.ENTITY);
    const active = categories.filter(c => c.status);
    return of(active).pipe(delay(300));
  }

  findOne(id: number): Observable<CategoryResponseDto> {
    const category = this.storage.findById<CategoryResponseDto>(this.ENTITY, id);
    if (!category) {
      return throwError(() => new Error('Categoria não encontrada'));
    }
    return of(category).pipe(delay(300));
  }

  update(id: number, updateDto: UpdateCategoryDto): Observable<CategoryResponseDto> {
    const category = this.storage.findById<CategoryResponseDto>(this.ENTITY, id);
    if (!category) {
      return throwError(() => new Error('Categoria não encontrada'));
    }

    const updated = {
      ...category,
      ...updateDto,
      updatedAt: new Date()
    };

    this.storage.update(this.ENTITY, id, updated);
    return of(updated as CategoryResponseDto).pipe(delay(300));
  }

  toggleStatus(id: number, status: boolean): Observable<CategoryResponseDto> {
    return this.update(id, { status });
  }

  remove(id: number): Observable<{ message: string }> {
    const success = this.storage.delete(this.ENTITY, id);
    if (!success) {
      return throwError(() => new Error('Categoria não encontrada'));
    }
    return of({ message: 'Categoria removida com sucesso' }).pipe(delay(300));
  }
}
