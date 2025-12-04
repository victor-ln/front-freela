import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ProposalModalComponent,
  Proposal,
} from '../../components/shared/proposal/proposal.component';
import { ConfirmModalComponent } from '../../components/shared/confirm-modal/confirm-modal.component';
import {
  FilterBarComponent,
  SelectFilter,
} from '../../components/shared/filter-bar/filter-bar.component';
import { ProposalService } from '../../core/services/proposal.service';
import { ProposalResponseDto } from '../../core/dto/proposal.dto';
import { ProposalStatus } from '../../core/enums/proposal-status.enum';

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProposalModalComponent,
    ConfirmModalComponent,
    FilterBarComponent,
  ],
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css'],
})
export class ProposalsComponent implements OnInit {
  proposals: Proposal[] = [];
  filteredProposals: Proposal[] = [];
  isLoading = false;

  // Configuração para o FilterBarComponent
  searchFields: (keyof Proposal)[] = ['title', 'clientName', 'description'];
  selectFilters: SelectFilter[] = [
    {
      label: 'Todos os Status',
      model: 'status',
      options: [
        { value: 'pending', label: 'Pendente' },
        { value: 'accepted', label: 'Aceita' },
        { value: 'rejected', label: 'Rejeitada' },
        { value: 'negotiation', label: 'Em Negociação' },
      ],
    },
  ];

  isProposalModalOpen = false;
  isConfirmModalOpen = false;
  isViewModalOpen = false;
  selectedProposal: Proposal | null = null;
  proposalToDelete: Proposal | null = null;

  constructor(private proposalService: ProposalService) {}

  ngOnInit(): void {
    this.loadProposals();
  }

  loadProposals(): void {
    this.isLoading = true;
    this.proposalService.findAll({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.proposals = response.data.map(this.mapProposalFromApi);
        this.filteredProposals = [...this.proposals];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar propostas:', error);
        this.isLoading = false;
      }
    });
  }

  private mapProposalFromApi(proposalDto: ProposalResponseDto): Proposal {
    const statusMap: Record<ProposalStatus, string> = {
      [ProposalStatus.PENDING]: 'pending',
      [ProposalStatus.ACCEPTED]: 'accepted',
      [ProposalStatus.REJECTED]: 'rejected',
      [ProposalStatus.IN_NEGOTIATION]: 'negotiation',
    };

    return {
      id: proposalDto.id.toString(),
      title: proposalDto.titulo,
      clientName: proposalDto.cliente.nomeRazaoSocial,
      description: proposalDto.descricao,
      services: proposalDto.servicos.map(s => s.nome),
      template: proposalDto.template.nome,
      totalValue: proposalDto.valorTotal,
      status: statusMap[proposalDto.status] || 'pending',
      createdAt: new Date(proposalDto.createdAt),
      updatedAt: new Date(proposalDto.updatedAt),
    };
  }

  handleFilteredData(data: Proposal[]): void {
    this.filteredProposals = data;
  }

  getProposalsByStatus(status: string) {
    return this.proposals.filter((proposal) => proposal.status === status);
  }

  getTotalValue(): number {
    return this.proposals.reduce(
      (total, proposal) => total + proposal.totalValue,
      0
    );
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pending: 'Pendente',
      accepted: 'Aceita',
      rejected: 'Rejeitada',
      negotiation: 'Em Negociação',
    };
    return labels[status] || status;
  }

  getConversionRate(): number {
    const accepted = this.getProposalsByStatus('accepted').length;
    const total = this.proposals.length;
    return total > 0 ? Math.round((accepted / total) * 100) : 0;
  }

  getAverageValue(): number {
    const total = this.getTotalValue();
    return this.proposals.length > 0
      ? total / this.proposals.length
      : 0;
  }

  markAsAccepted(proposal: Proposal) {
    const id = parseInt(proposal.id);
    this.proposalService.acceptProposal(id, { evidenciaAceite: '' }).subscribe({
      next: () => {
        this.loadProposals();
      },
      error: (error) => {
        console.error('Erro ao aceitar proposta:', error);
      }
    });
  }

  openNewProposalModal() {
    this.selectedProposal = null;
    this.isProposalModalOpen = true;
  }

  openEditProposalModal(proposal: Proposal) {
    this.selectedProposal = { ...proposal };
    this.isProposalModalOpen = true;
  }

  openViewProposalModal(proposal: Proposal) {
    this.selectedProposal = { ...proposal };
    this.isViewModalOpen = true;
  }

  closeProposalModal() {
    this.isProposalModalOpen = false;
    this.isViewModalOpen = false;
    this.selectedProposal = null;
  }

  handleProposalSaved(proposal: any) {
    // TODO: Modal precisa enviar clienteId, servicosIds e templateId
    const proposalDto = {
      titulo: proposal.title,
      descricao: proposal.description,
      clienteId: proposal.clientId || 1, // TODO: Ajustar modal
      servicosIds: proposal.servicosIds || [], // TODO: Ajustar modal
      templateId: proposal.templateId || 1, // TODO: Ajustar modal
      valorTotal: proposal.totalValue,
      status: ProposalStatus.PENDING,
    };

    if (proposal.id && proposal.id !== 'new') {
      const id = parseInt(proposal.id);
      this.proposalService.update(id, proposalDto).subscribe({
        next: () => {
          this.loadProposals();
          this.closeProposalModal();
        },
        error: (error) => {
          console.error('Erro ao atualizar proposta:', error);
        }
      });
    } else {
      this.proposalService.create(proposalDto).subscribe({
        next: () => {
          this.loadProposals();
          this.closeProposalModal();
        },
        error: (error) => {
          console.error('Erro ao criar proposta:', error);
        }
      });
    }
  }

  confirmDeleteProposal(proposal: Proposal) {
    this.proposalToDelete = proposal;
    this.isConfirmModalOpen = true;
  }

  deleteProposalConfirmed() {
    if (this.proposalToDelete && this.proposalToDelete.id) {
      const id = parseInt(this.proposalToDelete.id);
      this.proposalService.remove(id).subscribe({
        next: () => {
          this.loadProposals();
          this.closeConfirmModal();
        },
        error: (error) => {
          console.error('Erro ao deletar proposta:', error);
          this.closeConfirmModal();
        }
      });
    }
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.proposalToDelete = null;
  }

  generateContract(proposal: Proposal) {
    const id = parseInt(proposal.id);
    this.proposalService.generateContract(id, {}).subscribe({
      next: () => {
        console.log('Contrato gerado com sucesso');
        this.loadProposals();
      },
      error: (error) => {
        console.error('Erro ao gerar contrato:', error);
      }
    });
  }
}
