import { Injectable } from '@angular/core';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { delay, map, switchMap, take } from 'rxjs/operators';
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
    // Fetch real templates from backend and create initial proposals with them
    this.templateService.findAll({ page: 1, limit: 10 }).pipe(take(1)).subscribe({
      next: (templatesResponse) => {
        const templates = templatesResponse.data;
        if (templates.length > 0 && this.storage.get(this.ENTITY).length === 0) {
          // Get clients to reference
          this.clientService.findAll({ page: 1, limit: 10 }).pipe(take(1)).subscribe({
            next: (clientsResponse) => {
              const clients = clientsResponse.data;
              if (clients.length > 0) {
                this.seedWithRealData(templates, clients);
              }
            }
          });
        }
      },
      error: (err) => {
        console.warn('Could not fetch templates for mock proposals:', err);
      }
    });
  }

  private seedWithRealData(templates: TemplateResponseDto[], clients: ClientResponseDto[]): void {
    const defaultProposals: Partial<ProposalResponseDto>[] = [
      {
        id: 1,
        titulo: 'Proposta de Desenvolvimento de Website',
        descricao: 'Desenvolvimento de website institucional com painel administrativo e integração com redes sociais.',
        cliente: clients[0],
        servicos: [],
        template: templates[0],
        valorTotal: 8500.00,
        status: ProposalStatus.PENDING,
        contratoStatus: ContractStatus.WAITING_PROPOSAL,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        titulo: 'Proposta de Identidade Visual',
        descricao: 'Criação de logotipo, paleta de cores, tipografia e manual de identidade visual completo.',
        cliente: clients.length > 1 ? clients[1] : clients[0],
        servicos: [],
        template: templates.length > 1 ? templates[1] : templates[0],
        valorTotal: 4200.00,
        status: ProposalStatus.ACCEPTED,
        contratoStatus: ContractStatus.CONTRACT_GENERATED,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        titulo: 'Proposta de Aplicativo Mobile',
        descricao: 'Desenvolvimento de aplicativo mobile multiplataforma (iOS e Android) para delivery.',
        cliente: clients.length > 2 ? clients[2] : clients[0],
        servicos: [],
        template: templates.length > 2 ? templates[2] : templates[0],
        valorTotal: 25000.00,
        status: ProposalStatus.SENT,
        contratoStatus: ContractStatus.WAITING_PROPOSAL,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    this.storage.initializeIfEmpty(this.ENTITY, defaultProposals);
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

    const updated: ProposalResponseDto = {
      ...proposal,
      contratoStatus: ContractStatus.CONTRACT_GENERATED,
      contratoGerado: `contrato_${id}_${Date.now()}.pdf`,
      updatedAt: new Date()
    };

    this.storage.update(this.ENTITY, id, updated);
    return of(updated).pipe(delay(300));
  }
}
