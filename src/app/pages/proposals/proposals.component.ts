import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent {
  selectedStatus = '';

  mockProposals = [
    {
      title: 'Website Corporativo - Empresa ABC',
      client: 'Empresa ABC Ltda',
      description: 'Desenvolvimento de website institucional responsivo com sistema de gerenciamento de conteúdo.',
      services: ['Desenvolvimento Web', 'Design Responsivo', 'CMS'],
      template: 'Contrato Desenvolvimento Web',
      totalValue: 8500,
      status: 'accepted',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      acceptedAt: new Date('2024-01-18')
    },
    {
      title: 'Aplicativo Mobile - Startup XYZ',
      client: 'Startup XYZ',
      description: 'Desenvolvimento de aplicativo nativo para iOS e Android com funcionalidades de e-commerce.',
      services: ['App iOS', 'App Android', 'Backend API'],
      template: 'Contrato App Mobile',
      totalValue: 18000,
      status: 'pending',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-05'),
      acceptedAt: null
    },
    {
      title: 'Identidade Visual - Loja 123',
      client: 'Loja 123',
      description: 'Criação completa de identidade visual incluindo logotipo, paleta de cores e manual de marca.',
      services: ['Design de Logo', 'Identidade Visual', 'Manual de Marca'],
      template: 'Contrato Design Gráfico',
      totalValue: 3200,
      status: 'negotiation',
      createdAt: new Date('2024-01-28'),
      updatedAt: new Date('2024-02-08'),
      acceptedAt: null
    },
    {
      title: 'E-commerce Completo - Moda Fashion',
      client: 'Moda Fashion',
      description: 'Loja virtual completa com sistema de pagamento integrado e painel administrativo.',
      services: ['E-commerce', 'Gateway Pagamento', 'Painel Admin'],
      template: null,
      totalValue: 25000,
      status: 'rejected',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-25'),
      acceptedAt: null
    },
    {
      title: 'Consultoria UX - Tech Inovação',
      client: 'Tech Inovação',
      description: 'Auditoria de UX e recomendações para melhoria da experiência do usuário.',
      services: ['Auditoria UX', 'Prototipação', 'Relatório de Melhorias'],
      template: 'Contrato Consultoria',
      totalValue: 4500,
      status: 'accepted',
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-30'),
      acceptedAt: new Date('2024-01-28')
    }
  ];

  getProposalsByStatus(status: string) {
    return this.mockProposals.filter(proposal => proposal.status === status);
  }

  getTotalValue(): number {
    return this.mockProposals.reduce((total, proposal) => total + proposal.totalValue, 0);
  }

  getFilteredProposals() {
    if (!this.selectedStatus) {
      return this.mockProposals;
    }
    return this.mockProposals.filter(proposal => proposal.status === this.selectedStatus);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pendente',
      'accepted': 'Aceita',
      'rejected': 'Rejeitada',
      'negotiation': 'Em Negociação'
    };
    return labels[status] || status;
  }

  getConversionRate(): number {
    const accepted = this.getProposalsByStatus('accepted').length;
    const total = this.mockProposals.length;
    return Math.round((accepted / total) * 100);
  }

  getAverageValue(): number {
    const total = this.getTotalValue();
    return total / this.mockProposals.length;
  }
}