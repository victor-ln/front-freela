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
  mockProposals: Proposal[] = [
    {
      id: '1',
      title: 'Website Corporativo - Empresa ABC',
      clientName: 'Empresa ABC Ltda',
      description:
        'Desenvolvimento de website institucional responsivo com sistema de gerenciamento de conteúdo.',
      services: ['Desenvolvimento Web', 'Design Responsivo', 'CMS'],
      template: 'Contrato Desenvolvimento Web',
      totalValue: 8500,
      status: 'accepted',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      acceptedAt: new Date('2024-01-18'),
    },
    {
      id: '2',
      title: 'Aplicativo Mobile - Startup XYZ',
      clientName: 'Startup XYZ',
      description:
        'Desenvolvimento de aplicativo nativo para iOS e Android com funcionalidades de e-commerce.',
      services: ['App iOS', 'App Android', 'Backend API'],
      template: 'Contrato App Mobile',
      totalValue: 18000,
      status: 'pending',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-05'),
    },
    {
      id: '3',
      title: 'Identidade Visual - Loja 123',
      clientName: 'Loja 123',
      description:
        'Criação completa de identidade visual incluindo logotipo, paleta de cores e manual de marca.',
      services: ['Design de Logo', 'Identidade Visual', 'Manual de Marca'],
      template: 'Contrato Design Gráfico',
      totalValue: 3200,
      status: 'negotiation',
      createdAt: new Date('2024-01-28'),
      updatedAt: new Date('2024-02-08'),
    },
    {
      id: '4',
      title: 'E-commerce Completo - Moda Fashion',
      clientName: 'Moda Fashion',
      description:
        'Loja virtual completa com sistema de pagamento integrado e painel administrativo.',
      services: ['E-commerce', 'Gateway Pagamento', 'Painel Admin'],
      totalValue: 25000,
      status: 'rejected',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-25'),
    },
    {
      id: '5',
      title: 'Consultoria UX - Tech Inovação',
      clientName: 'Tech Inovação',
      description:
        'Auditoria de UX e recomendações para melhoria da experiência do usuário.',
      services: ['Auditoria UX', 'Prototipação', 'Relatório de Melhorias'],
      template: 'Contrato Consultoria',
      totalValue: 4500,
      status: 'accepted',
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-30'),
      acceptedAt: new Date('2024-01-28'),
    },
  ];

  filteredProposals: Proposal[] = [];

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

  ngOnInit(): void {
    this.filteredProposals = [...this.mockProposals];
  }

  handleFilteredData(data: Proposal[]): void {
    this.filteredProposals = data;
  }

  getProposalsByStatus(status: string) {
    return this.mockProposals.filter((proposal) => proposal.status === status);
  }

  getTotalValue(): number {
    return this.mockProposals.reduce(
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
    const total = this.mockProposals.length;
    return total > 0 ? Math.round((accepted / total) * 100) : 0;
  }

  getAverageValue(): number {
    const total = this.getTotalValue();
    return this.mockProposals.length > 0
      ? total / this.mockProposals.length
      : 0;
  }

  markAsAccepted(proposal: Proposal) {
    proposal.status = 'accepted';
    proposal.acceptedAt = new Date();
    this.handleFilteredData(this.mockProposals);
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

  handleProposalSaved(proposal: Proposal) {
    const index = this.mockProposals.findIndex((p) => p.id === proposal.id);
    if (index > -1) {
      this.mockProposals[index] = proposal;
    } else {
      this.mockProposals.unshift(proposal);
    }
    this.handleFilteredData(this.mockProposals);
    this.closeProposalModal();
  }

  confirmDeleteProposal(proposal: Proposal) {
    this.proposalToDelete = proposal;
    this.isConfirmModalOpen = true;
  }

  deleteProposalConfirmed() {
    if (this.proposalToDelete) {
      this.mockProposals = this.mockProposals.filter(
        (p) => p.id !== this.proposalToDelete!.id
      );
      this.handleFilteredData(this.mockProposals);
    }
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.proposalToDelete = null;
  }

  generateContract(proposal: Proposal) {
    console.log(`Gerando contrato para a proposta: ${proposal.title}`);
  }
}