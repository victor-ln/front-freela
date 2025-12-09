import { Injectable } from '@angular/core';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { MockStorageService } from './mock-storage.service';
import { MockClientService } from './mock-client.service';
import { TemplateService } from '../template.service';
import { ProposalResponseDto, CreateProposalDto, UpdateProposalDto, AcceptProposalDto, GenerateContractDto } from '../../dto/proposal.dto';
import { PaginatedResponseDto, PaginationDto } from '../../../common/dto/pagination.dto';
import { ProposalStatus } from '../../enums/proposal-status.enum';
import { ContractStatus } from '../../enums/contract-status.enum';
import { ClientResponseDto } from '../../dto/client.dto';
import { TemplateResponseDto } from '../../dto/template.dto';

@Injectable({
  providedIn: 'root'
})
export class MockProposalService {
  private readonly ENTITY = 'proposals';

  constructor(
    private storage: MockStorageService,
    private clientService: MockClientService,
    private templateService: TemplateService
  ) {
    this.initializeDefaultData();
  }

  private initializeDefaultData(): void {
    // No seed data - users create their own proposals
    this.storage.initializeIfEmpty(this.ENTITY, []);
  }

  create(createDto: CreateProposalDto): Observable<ProposalResponseDto> {
    return forkJoin({
      client: this.clientService.findOne(createDto.clienteId),
      template: createDto.templateId
        ? this.templateService.findOne(createDto.templateId)
        : of(null as TemplateResponseDto | null)
    }).pipe(
      map(({ client, template }) => {
        const newProposal: ProposalResponseDto = {
          id: 0,
          titulo: createDto.titulo,
          descricao: createDto.descricao,
          cliente: client,
          servicos: [],
          template: template!,
          valorTotal: createDto.valorTotal,
          status: createDto.status || ProposalStatus.PENDING,
          contratoStatus: ContractStatus.WAITING_PROPOSAL,
          observacoes: createDto.observacoes,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const saved = this.storage.add(this.ENTITY, newProposal);
        return saved as ProposalResponseDto;
      }),
      delay(300)
    );
  }

  findAll(pagination: PaginationDto = {}): Observable<PaginatedResponseDto<ProposalResponseDto>> {
    const proposals = this.storage.get<ProposalResponseDto>(this.ENTITY);

    let filtered = proposals;
    if (pagination.search) {
      const search = pagination.search.toLowerCase();
      filtered = proposals.filter(p =>
        p.titulo.toLowerCase().includes(search) ||
        p.descricao.toLowerCase().includes(search) ||
        p.cliente?.nomeRazaoSocial?.toLowerCase().includes(search)
      );
    }

    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    const response: PaginatedResponseDto<ProposalResponseDto> = {
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

  findOne(id: number): Observable<ProposalResponseDto> {
    const proposal = this.storage.findById<ProposalResponseDto>(this.ENTITY, id);
    if (!proposal) {
      return throwError(() => new Error('Proposta não encontrada'));
    }
    return of(proposal).pipe(delay(300));
  }

  update(id: number, updateDto: UpdateProposalDto): Observable<ProposalResponseDto> {
    const proposal = this.storage.findById<ProposalResponseDto>(this.ENTITY, id);
    if (!proposal) {
      return throwError(() => new Error('Proposta não encontrada'));
    }

    // If templateId is being updated, fetch the new template
    if (updateDto.templateId && updateDto.templateId !== proposal.template?.id) {
      return this.templateService.findOne(updateDto.templateId).pipe(
        map(template => {
          const updated: ProposalResponseDto = {
            ...proposal,
            titulo: updateDto.titulo || proposal.titulo,
            descricao: updateDto.descricao || proposal.descricao,
            valorTotal: updateDto.valorTotal ?? proposal.valorTotal,
            status: updateDto.status || proposal.status,
            observacoes: updateDto.observacoes ?? proposal.observacoes,
            template: template,
            updatedAt: new Date()
          };

          this.storage.update(this.ENTITY, id, updated);
          return updated;
        }),
        delay(300)
      );
    }

    const updated: ProposalResponseDto = {
      ...proposal,
      titulo: updateDto.titulo || proposal.titulo,
      descricao: updateDto.descricao || proposal.descricao,
      valorTotal: updateDto.valorTotal ?? proposal.valorTotal,
      status: updateDto.status || proposal.status,
      observacoes: updateDto.observacoes ?? proposal.observacoes,
      updatedAt: new Date()
    };

    this.storage.update(this.ENTITY, id, updated);
    return of(updated).pipe(delay(300));
  }

  remove(id: number): Observable<{ message: string }> {
    const success = this.storage.delete(this.ENTITY, id);
    if (!success) {
      return throwError(() => new Error('Proposta não encontrada'));
    }
    return of({ message: 'Proposta removida com sucesso' }).pipe(delay(300));
  }

  acceptProposal(id: number, acceptDto: AcceptProposalDto): Observable<ProposalResponseDto> {
    const proposal = this.storage.findById<ProposalResponseDto>(this.ENTITY, id);
    if (!proposal) {
      return throwError(() => new Error('Proposta não encontrada'));
    }

    const updated: ProposalResponseDto = {
      ...proposal,
      status: ProposalStatus.ACCEPTED,
      evidenciaAceite: acceptDto.evidenciaAceite,
      updatedAt: new Date()
    };

    this.storage.update(this.ENTITY, id, updated);
    return of(updated).pipe(delay(300));
  }

  generateContract(id: number, contractDto: GenerateContractDto): Observable<ProposalResponseDto> {
    const proposal = this.storage.findById<ProposalResponseDto>(this.ENTITY, id);
    if (!proposal) {
      return throwError(() => new Error('Proposta não encontrada'));
    }

    // If proposal has a template, download it and trigger browser download
    if (proposal.template?.id) {
      return this.templateService.downloadTemplate(proposal.template.id).pipe(
        tap((blob: Blob) => {
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Contrato_${proposal.titulo.replace(/\s+/g, '_')}_${proposal.cliente?.nomeRazaoSocial?.replace(/\s+/g, '_') || 'Cliente'}.docx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }),
        map(() => {
          const updated: ProposalResponseDto = {
            ...proposal,
            contratoStatus: ContractStatus.CONTRACT_GENERATED,
            contratoGerado: `contrato_${id}_${Date.now()}.docx`,
            updatedAt: new Date()
          };

          this.storage.update(this.ENTITY, id, updated);
          return updated;
        })
      );
    }

    // If no template, just update the status
    const updated: ProposalResponseDto = {
      ...proposal,
      contratoStatus: ContractStatus.CONTRACT_GENERATED,
      contratoGerado: `contrato_${id}_${Date.now()}.docx`,
      updatedAt: new Date()
    };

    this.storage.update(this.ENTITY, id, updated);
    return of(updated).pipe(delay(300));
  }

  downloadContract(id: number, format: 'pdf' | 'docx' = 'docx'): Observable<Blob> {
    const proposal = this.storage.findById<ProposalResponseDto>(this.ENTITY, id);
    if (!proposal) {
      return throwError(() => new Error('Proposta não encontrada'));
    }

    if (!proposal.template?.id) {
      return throwError(() => new Error('Proposta não possui template associado'));
    }

    // Download the template file from backend
    return this.templateService.downloadTemplate(proposal.template.id);
  }
}
