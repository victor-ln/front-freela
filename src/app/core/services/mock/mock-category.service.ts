import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockStorageService } from './mock-storage.service';
import { CategoryResponseDto } from '../../dto/category.dto';

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

  findAllActive(): Observable<CategoryResponseDto[]> {
    const categories = this.storage.get<CategoryResponseDto>(this.ENTITY);
    const active = categories.filter(c => c.status);
    return of(active).pipe(delay(300));
  }

  findAll(): Observable<CategoryResponseDto[]> {
    const categories = this.storage.get<CategoryResponseDto>(this.ENTITY);
    return of(categories).pipe(delay(300));
  }

  findOne(id: number): Observable<CategoryResponseDto | null> {
    const category = this.storage.findById<CategoryResponseDto>(this.ENTITY, id);
    return of(category).pipe(delay(300));
  }
}
