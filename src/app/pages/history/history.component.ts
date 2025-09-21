import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proposal } from '../../components/shared/proposal/proposal.component';

@Component({
    selector: 'app-history',
    imports: [CommonModule],
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  // Mock data representing proposals that have been accepted/completed.
  completedProposals: Proposal[] = [
    {
      id: '1',
      title: 'Website Corporativo - Empresa ABC',
      clientName: 'Empresa ABC Ltda',
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
      id: '5',
      title: 'Consultoria UX - Tech Inovação',
      clientName: 'Tech Inovação',
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

  getInitials(name: string): string {
    return name.split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}