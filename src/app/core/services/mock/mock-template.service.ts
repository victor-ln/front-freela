import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockStorageService } from './mock-storage.service';
import { TemplateResponseDto } from '../../dto/template.dto';
import { TemplateStatus } from '../../enums/template-status.enum';

@Injectable({
  providedIn: 'root'
})
export class MockTemplateService {
  private readonly ENTITY = 'templates';

  constructor(private storage: MockStorageService) {
    this.initializeDefaultData();
  }

  private initializeDefaultData(): void {
    // No seed data - templates come from the real backend
    this.storage.initializeIfEmpty(this.ENTITY, []);
  }

  findApproved(): Observable<TemplateResponseDto[]> {
    const templates = this.storage.get<TemplateResponseDto>(this.ENTITY);
    const approved = templates.filter(t => t.status === TemplateStatus.APPROVED);
    return of(approved).pipe(delay(300));
  }

  findAll(): Observable<TemplateResponseDto[]> {
    const templates = this.storage.get<TemplateResponseDto>(this.ENTITY);
    return of(templates).pipe(delay(300));
  }

  findOne(id: number): Observable<TemplateResponseDto | null> {
    const template = this.storage.findById<TemplateResponseDto>(this.ENTITY, id);
    return of(template).pipe(delay(300));
  }
}
