import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateModalComponent, Template } from '../../components/shared/template-modal/template-modal.component';
import { ConfirmModalComponent } from '../../components/shared/confirm-modal/confirm-modal.component';
import { FilterBarComponent, SelectFilter } from '../../components/shared/filter-bar/filter-bar.component';
import { TemplateService } from '../../core/services/template.service';
import { TemplateResponseDto } from '../../core/dto/template.dto';
import { TemplateStatus } from '../../core/enums/template-status.enum';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, TemplateModalComponent, ConfirmModalComponent, FilterBarComponent],
  templateUrl: `./templates.component.html`,
  styleUrls: [`./templates.component.css`]
})
export class TemplatesComponent implements OnInit {
  templates: Template[] = [];
  filteredTemplates: Template[] = [];
  isLoading = false;

  searchFields: (keyof Template)[] = ['name'];
  selectFilters: SelectFilter[] = [
    {
      label: 'Todos os Status',
      model: 'status',
      options: [
        { value: 'approved', label: 'Aprovado' },
        { value: 'review', label: 'Em Revisão' },
        { value: 'draft', label: 'Rascunho' }
      ]
    },
    {
      label: 'Todos os Tipos',
      model: 'type',
      options: [
        { value: 'Contrato', label: 'Contrato' },
        { value: 'Proposta', label: 'Proposta' },
        { value: 'Acordo', label: 'Acordo' }
      ]
    }
  ];

  isTemplateModalOpen = false;
  isConfirmModalOpen = false;
  selectedTemplate: Template | null = null;
  templateToDelete: Template | null = null;

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.isLoading = true;
    this.templateService.findAll({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.templates = response.data.map(this.mapTemplateFromApi);
        this.filteredTemplates = [...this.templates];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar templates:', error);
        this.isLoading = false;
      }
    });
  }

  private mapTemplateFromApi(templateDto: TemplateResponseDto): Template {
    return {
      id: templateDto.id.toString(),
      name: templateDto.nome,
      status: templateDto.status.toLowerCase(),
      type: 'Contrato', // TODO: A API não retorna tipo, ajustar conforme necessário
      createdAt: new Date(templateDto.createdAt),
      updatedAt: new Date(templateDto.updatedAt),
      usageCount: 0, // TODO: A API não retorna usageCount
      variables: [], // TODO: A API não retorna variables
    };
  }

  handleFilteredData(data: Template[]): void {
    this.filteredTemplates = data;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'approved': 'Aprovado',
      'review': 'Em Revisão',
      'draft': 'Rascunho'
    };
    return labels[status] || status;
  }

  downloadTemplate(template: Template) {
    const id = parseInt(template.id);
    this.templateService.downloadTemplate(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.name}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erro ao baixar template:', error);
      }
    });
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

  handleTemplateSaved(template: any) {
    const templateDto = {
      nome: template.name,
      anexo: template.anexo || '', // TODO: Ajustar modal para enviar arquivo
      status: template.status.toUpperCase() as TemplateStatus,
    };

    if (template.id && template.id !== 'new') {
      const id = parseInt(template.id);
      this.templateService.update(id, templateDto).subscribe({
        next: () => {
          this.loadTemplates();
          this.closeTemplateModal();
        },
        error: (error) => {
          console.error('Erro ao atualizar template:', error);
        }
      });
    } else {
      this.templateService.create(templateDto).subscribe({
        next: () => {
          this.loadTemplates();
          this.closeTemplateModal();
        },
        error: (error) => {
          console.error('Erro ao criar template:', error);
        }
      });
    }
  }

  confirmDeleteTemplate(template: Template) {
    this.templateToDelete = template;
    this.isConfirmModalOpen = true;
  }

  deleteTemplateConfirmed() {
    if (this.templateToDelete && this.templateToDelete.id) {
      const id = parseInt(this.templateToDelete.id);
      this.templateService.remove(id).subscribe({
        next: () => {
          this.loadTemplates();
          this.closeConfirmModal();
        },
        error: (error) => {
          console.error('Erro ao deletar template:', error);
          this.closeConfirmModal();
        }
      });
    }
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.templateToDelete = null;
  }
}