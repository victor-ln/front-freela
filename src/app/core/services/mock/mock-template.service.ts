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
    const defaultTemplates: TemplateResponseDto[] = [
      {
        id: 1,
        nome: 'Template Proposta Comercial',
        anexo: 'proposta-comercial.pdf',
        status: TemplateStatus.APPROVED,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        nome: 'Template Briefing Design',
        anexo: 'briefing-design.pdf',
        status: TemplateStatus.APPROVED,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        nome: 'Template Contrato Serviços',
        anexo: 'contrato-servicos.pdf',
        status: TemplateStatus.APPROVED,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        nome: 'Template NDA',
        anexo: 'nda.pdf',
        status: TemplateStatus.APPROVED,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.storage.initializeIfEmpty(this.ENTITY, defaultTemplates);
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
