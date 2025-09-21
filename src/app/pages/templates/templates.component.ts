import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateModalComponent, Template } from '../../components/shared/template-modal/template-modal.component';
import { ConfirmModalComponent } from '../../components/shared/confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-templates',
    imports: [CommonModule, TemplateModalComponent, ConfirmModalComponent],
    templateUrl: `./templates.component.html`,
    styleUrls: [`./templates.component.css`]
})
export class TemplatesComponent {
  mockTemplates: Template[] = [
    {
      id: '1',
      name: 'Contrato Desenvolvimento Web',
      status: 'approved',
      type: 'Contrato',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-10'),
      usageCount: 12,
      variables: ['{CLIENTE_NOME}', '{VALOR_TOTAL}', '{PRAZO_ENTREGA}', '{SERVICOS}']
    },
    {
      id: '2',
      name: 'Proposta Design Gráfico',
      status: 'approved',
      type: 'Proposta',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-25'),
      usageCount: 8,
      variables: ['{CLIENTE_NOME}', '{SERVICOS}', '{VALOR}', '{BRIEFING}']
    },
    {
      id: '3',
      name: 'Contrato App Mobile',
      status: 'review',
      type: 'Contrato',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-05'),
      usageCount: 0,
      variables: ['{CLIENTE_NOME}', '{PLATAFORMAS}', '{FUNCIONALIDADES}']
    },
    {
      id: '4',
      name: 'Acordo de Consultoria',
      status: 'approved',
      type: 'Acordo',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15'),
      usageCount: 5,
      variables: ['{CLIENTE_NOME}', '{HORAS_CONSULTORIA}', '{TAXA_HORA}']
    },
    {
      id: '5',
      name: 'Template E-commerce',
      status: 'draft',
      type: 'Contrato',
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15'),
      usageCount: 0,
      variables: []
    }
  ];

  isTemplateModalOpen = false;
  isConfirmModalOpen = false;
  selectedTemplate: Template | null = null;
  templateToDelete: Template | null = null;

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'approved': 'Aprovado',
      'review': 'Em Revisão',
      'draft': 'Rascunho'
    };
    return labels[status] || status;
  }

  downloadTemplate(template: Template) {
    console.log('Baixando template:', template);
  }

  openNewTemplateModal() {
    this.selectedTemplate = null;
    this.isTemplateModalOpen = true;
  }

  openEditTemplateModal(template: Template) {
    this.selectedTemplate = { ...template };
    this.isTemplateModalOpen = true;
  }

  closeTemplateModal() {
    this.isTemplateModalOpen = false;
    this.selectedTemplate = null;
  }

  handleTemplateSaved(template: Template) {
    if (this.selectedTemplate?.id) {
      const index = this.mockTemplates.findIndex(t => t.id === template.id);
      if (index > -1) {
        this.mockTemplates[index] = template;
      }
    } else {
      this.mockTemplates.push(template);
    }
    this.closeTemplateModal();
  }

  confirmDeleteTemplate(template: Template) {
    this.templateToDelete = template;
    this.isConfirmModalOpen = true;
  }

  deleteTemplateConfirmed() {
    if (this.templateToDelete) {
      this.mockTemplates = this.mockTemplates.filter(t => t.id !== this.templateToDelete!.id);
    }
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.templateToDelete = null;
  }
}