import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateModalComponent, Template } from '../../components/shared/template-modal/template-modal.component';
import { ConfirmModalComponent } from '../../components/shared/confirm-modal/confirm-modal.component';
import { FilterBarComponent, SelectFilter } from '../../components/shared/filter-bar/filter-bar.component';
import { TemplateService } from '../../core/services/template.service';
import { TemplateResponseDto } from '../../core/dto/template.dto';

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
    { label: 'Todos os Status', model: 'status', options: [{ value: 'approved', label: 'Aprovado' }, { value: 'review', label: 'Em Revisão' }, { value: 'draft', label: 'Rascunho' }] }
  ];

  isTemplateModalOpen = false;
  isConfirmModalOpen = false;
  selectedTemplate: Template | null = null;
  templateToDelete: Template | null = null;

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void { this.loadTemplates(); }

  loadTemplates(): void {
    this.isLoading = true;
    this.templateService.findAll({ page: 1, limit: 100 }).subscribe({
      next: (res) => {
        this.templates = res.data.map(this.mapTemplateFromApi);
        this.filteredTemplates = [...this.templates];
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  private mapTemplateFromApi(dto: TemplateResponseDto): Template {
    let status = 'review';
    if (dto.status === 'Ativo') status = 'approved';
    else if (dto.status === 'Inativo') status = 'draft';
    
    return {
      id: dto.id.toString(),
      name: dto.nome,
      status: status,
      type: 'Contrato',
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      usageCount: 0,
      variables: []
    };
  }

  handleFilteredData(data: Template[]) { this.filteredTemplates = data; }

  // Método restaurado para corrigir o erro no HTML
  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'approved': 'Aprovado',
      'review': 'Em Revisão',
      'draft': 'Rascunho'
    };
    return labels[status] || status;
  }

  // Método restaurado para corrigir o erro TS2551
  downloadTemplate(template: Template) {
    const id = parseInt(template.id);
    this.templateService.downloadTemplate(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Assume PDF baseado no código anterior, mas idealmente viria do mime-type do blob
        a.download = `${template.name}.pdf`; 
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erro ao baixar template:', error);
      }
    });
  }

  openNewTemplateModal() { this.selectedTemplate = null; this.isTemplateModalOpen = true; }
  openEditTemplateModal(t: Template) { this.selectedTemplate = { ...t }; this.isTemplateModalOpen = true; }
  closeTemplateModal() { this.isTemplateModalOpen = false; this.selectedTemplate = null; }

  handleTemplateSaved(template: Template) {
    // Mapeamento Correto de Status (Frontend -> Backend)
    const statusMap: Record<string, string> = {
      'approved': 'Ativo',
      'review': 'Em Revisão',
      'draft': 'Inativo'
    };

    // Placeholder para anexo se não houver arquivo
    const anexoNome = template.fileAttachment?.name || `${template.name.trim().replace(/\s+/g, '_')}.docx`;

    const dto = {
      nome: template.name,
      anexo: anexoNome,
      status: statusMap[template.status] || 'Em Revisão'
    };

    if (template.id && template.id.length < 10) {
      this.templateService.update(parseInt(template.id), dto as any).subscribe({
        next: () => { this.loadTemplates(); this.closeTemplateModal(); },
        error: (err) => console.error(err)
      });
    } else {
      this.templateService.create(dto as any).subscribe({
        next: () => { this.loadTemplates(); this.closeTemplateModal(); },
        error: (err) => alert('Erro: ' + (Array.isArray(err.error?.message) ? err.error.message.join('\n') : err.error?.message))
      });
    }
  }

  confirmDeleteTemplate(t: Template) { this.templateToDelete = t; this.isConfirmModalOpen = true; }
  deleteTemplateConfirmed() {
    if (this.templateToDelete) {
      this.templateService.remove(parseInt(this.templateToDelete.id)).subscribe(() => {
        this.loadTemplates(); this.closeConfirmModal();
      });
    }
  }
  closeConfirmModal() { this.isConfirmModalOpen = false; this.templateToDelete = null; }
}