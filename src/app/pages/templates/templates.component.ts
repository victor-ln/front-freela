import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./templates.component.html`,
  styleUrls: [`./templates.component.css`]
})
export class TemplatesComponent {
  mockTemplates = [
    {
      name: 'Contrato Desenvolvimento Web',
      status: 'approved',
      type: 'Contrato',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-10'),
      usageCount: 12,
      variables: ['{CLIENTE_NOME}', '{VALOR_TOTAL}', '{PRAZO_ENTREGA}', '{SERVICOS}']
    },
    {
      name: 'Proposta Design Gráfico',
      status: 'approved',
      type: 'Proposta',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-25'),
      usageCount: 8,
      variables: ['{CLIENTE_NOME}', '{SERVICOS}', '{VALOR}', '{BRIEFING}']
    },
    {
      name: 'Contrato App Mobile',
      status: 'review',
      type: 'Contrato',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-05'),
      usageCount: 0,
      variables: ['{CLIENTE_NOME}', '{PLATAFORMAS}', '{FUNCIONALIDADES}']
    },
    {
      name: 'Acordo de Consultoria',
      status: 'approved',
      type: 'Acordo',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15'),
      usageCount: 5,
      variables: ['{CLIENTE_NOME}', '{HORAS_CONSULTORIA}', '{TAXA_HORA}']
    },
    {
      name: 'Template E-commerce',
      status: 'draft',
      type: 'Contrato',
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15'),
      usageCount: 0,
      variables: []
    }
  ];

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'approved': 'Aprovado',
      'review': 'Em Revisão',
      'draft': 'Rascunho'
    };
    return labels[status] || status;
  }
}
