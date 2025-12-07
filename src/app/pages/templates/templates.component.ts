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
        { value: 'draft', label: 'Inativo' }
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

  private mapTemplateFromApi(dto: TemplateResponseDto): Template {
    let statusFrontend = 'review';
    
    // Mapeamento: Valor do Backend -> Chave do Frontend
    // O backend retorna 'Ativo', 'Em Revisão', 'Inativo'
    switch (dto.status) {
      case TemplateStatus.ACTIVE: // 'Ativo'
        statusFrontend = 'approved';
        break;
      case TemplateStatus.INACTIVE: // 'Inativo'
        statusFrontend = 'draft';
        break;
      case TemplateStatus.UNDER_REVIEW: // 'Em Revisão'
      default:
        statusFrontend = 'review';
        break;
    }
    
    return {
      id: dto.id.toString(),
      name: dto.nome,
      status: statusFrontend,
      type: 'Contrato',
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      usageCount: 0,
      variables: [],
      fileAttachment: dto.anexo ? new File([], dto.anexo) : undefined
    };
  }

  handleFilteredData(data: Template[]): void {
    this.filteredTemplates = data;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'approved': 'Aprovado',
      'review': 'Em Revisão',
      'draft': 'Inativo'
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
        a.download = `${template.name}.docx`;
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

  handleTemplateSaved(template: Template) {
    // Mapeamento: Chave do Frontend -> Valor do Backend (Enum)
    const statusMap: Record<string, TemplateStatus> = {
      'approved': TemplateStatus.ACTIVE,       // Envia 'Ativo'
      'review': TemplateStatus.UNDER_REVIEW,   // Envia 'Em Revisão'
      'draft': TemplateStatus.INACTIVE         // Envia 'Inativo'
    };
    
    const anexoNome = template.fileAttachment?.name || 
      (template.name ? `${template.name.replace(/\s+/g, '_')}.docx` : 'template.docx');

    const templateDto = {
      nome: template.name,
      anexo: anexoNome,
      // Garante que enviamos um dos valores permitidos pelo backend
      status: statusMap[template.status] || TemplateStatus.UNDER_REVIEW
    };

    if (template.id && template.id.length < 10) {
      const id = parseInt(template.id);
      this.templateService.update(id, templateDto).subscribe({
        next: () => {
          this.loadTemplates();
          this.closeTemplateModal();
        },
        error: (error) => {
          console.error('Erro ao atualizar:', error);
          alert('Erro ao atualizar: ' + (error.error?.message || 'Erro desconhecido'));
        }
      });
    } else {
      this.templateService.create(templateDto).subscribe({
        next: () => {
          this.loadTemplates();
          this.closeTemplateModal();
        },
        error: (error) => {
          console.error('Erro ao criar:', error);
          const msg = error.error?.message 
            ? (Array.isArray(error.error.message) ? error.error.message.join('\n') : error.error.message) 
            : 'Erro desconhecido';
          alert('Erro ao criar template:\n' + msg);
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
          console.error('Erro ao deletar:', error);
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